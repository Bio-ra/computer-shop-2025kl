
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { addToCart } from "@/lib/actions/cart";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { productId, quantity } = body;

		// Try to resolve authenticated user id
		let userId: string | null = null;
		try {
			const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
			if (jwt && jwt.sub) userId = String(jwt.sub);
		} catch (e) {
			// ignore
		}

		if (!userId) {
			// fallback to session cookie lookup
			const ck = await cookies();
			let token: string | null = null;
			if (ck && typeof (ck as any).get === "function") {
				token =
					ck.get("__Secure-next-auth.session-token")?.value ||
					ck.get("next-auth.session-token")?.value ||
					ck.get("next-auth.sess")?.value ||
					null;
			} else {
				const cookieHeader = req.headers.get("cookie") || "";
				const parse = (str: string) =>
					str.split(/;\s*/).reduce<Record<string, string>>((acc, pair) => {
						const [k, ...v] = pair.split("=");
						if (!k) return acc;
						acc[k.trim()] = decodeURIComponent((v || []).join("=") || "");
						return acc;
					}, {});
				const parsed = parse(cookieHeader);
				token = parsed["__Secure-next-auth.session-token"] || parsed["next-auth.session-token"] || parsed["next-auth.sess"] || null;
			}

			if (token) {
				const session = await prisma.session.findUnique({ where: { sessionToken: token } });
				if (session) userId = String(session.userId);
			}
		}

		if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const item = await addToCart(userId, productId, quantity ?? 1);
		return NextResponse.json({ success: true, item });
	} catch (err: any) {
		return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
	}
}


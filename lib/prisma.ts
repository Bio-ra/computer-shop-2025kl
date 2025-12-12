// Lazily require @prisma/client to avoid build-time errors when the
// generated client doesn't yet exist (e.g. during `npm install` on CI).
let PrismaClientCtor: any | null = null;
try {
	// Use require so failures are caught synchronously and don't crash ESM import.
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const PrismaPkg = require("@prisma/client");
	PrismaClientCtor = PrismaPkg.PrismaClient ?? PrismaPkg.default ?? PrismaPkg;
} catch (err) {
	PrismaClientCtor = null;
}

type PrismaClientType = InstanceType<typeof PrismaClientCtor> | any;

const globalForPrisma = global as unknown as { prisma?: PrismaClientType };

function createMockPrisma() {
	// Minimal mock that returns harmless defaults for common query methods.
	const handler: ProxyHandler<any> = {
		get(_target, prop) {
			// Return async functions for model methods
			return async (..._args: any[]) => {
				const name = String(prop || "").toLowerCase();
				if (name.includes("findmany") || name.includes("findmany")) return [];
				if (name.includes("count")) return 0;
				if (name.startsWith("create") || name.startsWith("update") || name.startsWith("delete") || name.startsWith("upsert")) return null;
				return null;
			};
		},
	};

	// Proxy so any property access yields a harmless async function/object.
	return new Proxy({}, handler) as any;
}

let prisma: PrismaClientType;
if (PrismaClientCtor) {
	prisma = globalForPrisma.prisma || new PrismaClientCtor();
	if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} else {
	// If the generated client isn't available, use a mock so Next.js build can
	// collect page data without crashing. This avoids the "Cannot find module '.prisma/client/default'"
	// error at import time. If runtime code actually requires DB access, it will
	// need a real generated client and a live database.
	// eslint-disable-next-line no-console
	console.warn("@prisma/client not found — using mock Prisma client. Run `npx prisma generate` to generate the client.");
	prisma = createMockPrisma();
}

export default prisma;
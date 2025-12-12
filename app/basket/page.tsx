import {
  getCartWithItems,
  getCartTotal,
  getAllUsersWithCarts,
  transferCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "@/lib/actions/cart";
import { auth } from "@/lib/auth";
import { SignIn, SignOut } from "@/components/auth-component";
import { redirect } from "next/navigation";

function normalizeImage(img?: string) {
  const cleaned = (img || "").replace(/^public\//, "/");
  if (cleaned.includes("processor.jpg")) return "/images/products/cpu.jpg";
  return cleaned;
}

function formatPrice(p?: any) {
  if (p == null) return "";
  if (typeof p === "object" && typeof p.toString === "function")
    return p.toString();
  return String(p);
}

export default async function Basket() {
  const session = await auth();
  const userId = session?.user?.id ?? process.env.USER_ID ?? "";

  const cart = await getCartWithItems(userId);
  const total = await getCartTotal(userId);
  const users = await getAllUsersWithCarts();

  const items = cart?.items ?? [];
  return (
    <main className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg text-white mb-2">Koszyk</h2>
          <p className="text-gray-300">Zawartość koszyka.</p>
        </div>
        <div className="flex gap-2">
          {session?.user ? (
            <>
              <div className="text-gray-300 pr-2">{session.user.email}</div>
              <SignOut />
            </>
          ) : (
            <SignIn provider={"github"} />
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-gray-300 py-4">Twój koszyk jest pusty.</div>
      ) : (
        <div className="text-gray-300 py-2">
          <ul className="space-y-4">
            {items.map((item: any) => {
              const product = item.product;
              const imgPath = normalizeImage(item.product?.image);

              return (
                <li
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg"
                >
                  <div className="cart-item-image">
                    <img src={imgPath} alt={product?.name ?? "product"} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {product?.name}
                    </div>
                    {product?.category?.name && (
                      <div className="text-sm text-gray-400">
                        {product.category.name}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-white">
                      {formatPrice(product?.price)} PLN
                    </div>
                    <div className="text-gray-400">Ilość: {item.quantity}</div>

                    <div className="mt-2 flex gap-2 justify-end">
                      <form
                        action={async (formData: FormData) => {
                          "use server";
                          const userId = formData.get("userId") as string;
                          const productId = formData.get("productId") as string;
                          await addToCart(userId, productId, 1);
                          redirect("/basket");
                        }}
                      >
                        <input
                          type="hidden"
                          name="userId"
                          value={session?.user?.id ?? ""}
                        />
                        <input
                          type="hidden"
                          name="productId"
                          value={String(product.id)}
                        />
                        <button className="btn-enhanced btn-primary">+1</button>
                      </form>

                      <form
                        action={async (formData: FormData) => {
                          "use server";
                          const userId = formData.get("userId") as string;
                          const productId = formData.get("productId") as string;
                          await removeFromCart(userId, productId, 1);
                          redirect("/basket");
                        }}
                      >
                        <input
                          type="hidden"
                          name="userId"
                          value={session?.user?.id ?? ""}
                        />
                        <input
                          type="hidden"
                          name="productId"
                          value={String(product.id)}
                        />
                        <button className="btn-enhanced bg-yellow-400 hover:bg-yellow-500 text-black">
                          -1
                        </button>
                      </form>

                      <form
                        action={async (formData: FormData) => {
                          "use server";
                          const userId = formData.get("userId") as string;
                          const productId = formData.get("productId") as string;
                          await removeFromCart(userId, productId, 999999);
                          redirect("/basket");
                        }}
                      >
                        <input
                          type="hidden"
                          name="userId"
                          value={session?.user?.id ?? ""}
                        />
                        <input
                          type="hidden"
                          name="productId"
                          value={String(product.id)}
                        />
                        <button className="btn-enhanced btn-danger">
                          Usuń
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t border-gray-700 pt-4 flex justify-end">
            <div className="text-right">
              <div className="text-gray-400">Suma całkowita</div>
              <div className="text-white font-semibold">{total} PLN</div>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button className="btn-enhanced btn-primary px-4 py-2 transform transition-transform duration-150 hover:scale-105">
              Przejdź do kasy
            </button>

            <form
              action={async () => {
                "use server";
                const userId = session?.user?.id ?? "";
                await clearCart(userId);
                redirect("/basket");
              }}
            >
              <button className="btn-enhanced btn-muted px-4 py-2 transform transition-transform duration-150 hover:scale-105">
                Wyczyść koszyk
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Transfer form - visible only for logged-in users */}
      {session?.user ? (
        <div className="mt-6 text-gray-300">
          <form
            action={async (formData: FormData) => {
              "use server";
              const fromId = formData.get("from") as string;
              const toId = formData.get("to") as string;
              if (!fromId || !toId) throw new Error("Missing from/to");
              if (fromId === toId)
                throw new Error("Cannot transfer to the same user");
              await transferCart(fromId, toId);
              redirect("/basket");
            }}
            className="flex gap-2 items-center"
          >
            <label htmlFor="from-select" className="text-gray-400">
              Przenieś koszyk:
            </label>
            <select
              id="from-select"
              name="from"
              className="bg-gray-800 text-white p-1 rounded"
            >
              <option value="">-- od kogo --</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.email} ({u.itemsCount})
                </option>
              ))}
            </select>
            <select
              id="to-select"
              name="to"
              className="bg-gray-800 text-white p-1 rounded"
            >
              <option value="">-- do kogo --</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.email} ({u.itemsCount})
                </option>
              ))}
            </select>
            <button className="btn-enhanced btn-accent px-3 py-1 transform transition-transform duration-150 hover:scale-105">
              Przenieś
            </button>
          </form>
        </div>
      ) : null}
    </main>
  );
}

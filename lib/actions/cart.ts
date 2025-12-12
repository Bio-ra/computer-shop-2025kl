"use server";

import prisma from "@/lib/prisma";

export async function getCartWithItems(userId: string) {
  const id = String(userId ?? "").trim();
  if (!id) return null;

  const cart = await prisma.cart.findUnique({
    where: { userId: id },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            include: { category: true },
          },
        },
      },
    },
  });

  return cart;
}

export async function getCartTotal(userId: string) {
  const cart = await getCartWithItems(userId);
  if (!cart) return 0;

  const total = cart.items.reduce((acc: number, item: any) => {
    const price = Number(item.product.price);
    const qty = item.quantity ?? 0;
    return acc + price * qty;
  }, 0);

  return total;
}

export async function addToCart(
  userId: string,
  productId: string | number,
  quantity = 1
) {
  const id = String(userId ?? "").trim();
  const numericProductId = Number(productId);
  const qty = Math.max(1, Number(quantity));

  if (!id || Number.isNaN(numericProductId)) {
    throw new Error("Invalid userId or productId");
  }

  // Ensure cart exists for user
  let cart = await prisma.cart.findUnique({ where: { userId: id } });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { user: { connect: { id: id } } },
    });
  }

  // Try to find existing cart item (unique by cartId + productId)
  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: { cartId: cart.id, productId: numericProductId },
    },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + qty },
      include: { product: { include: { category: true } } },
    });
    return updated;
  }

  const created = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: numericProductId,
      quantity: qty,
    },
    include: { product: { include: { category: true } } },
  });

  return created;
}

export async function removeFromCart(
  userId: string,
  productId: string | number,
  quantity = 1
) {
  const id = String(userId ?? "").trim();
  const numericProductId = Number(productId);
  const qty = Math.max(1, Number(quantity));

  if (!id || Number.isNaN(numericProductId)) {
    throw new Error("Invalid userId or productId");
  }

  const cart = await prisma.cart.findUnique({ where: { userId: id } });
  if (!cart) return null;

  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: { cartId: cart.id, productId: numericProductId },
    },
  });
  if (!existing) return null;

  // If removing equal or more than existing quantity, delete the item
  if ((existing.quantity ?? 0) <= qty) {
    await prisma.cartItem.delete({ where: { id: existing.id } });
    return { deleted: true, remaining: 0 };
  }

  const updated = await prisma.cartItem.update({
    where: { id: existing.id },
    data: { quantity: (existing.quantity ?? 0) - qty },
    include: { product: { include: { category: true } } },
  });

  return updated;
}

export async function clearCart(userId: string) {
  const id = String(userId ?? "").trim();
  if (!id) return { cleared: 0 };

  const cart = await prisma.cart.findUnique({ where: { userId: id } });
  if (!cart) return { cleared: 0 };

  const res = await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return { cleared: res.count ?? 0 };
}

export async function getAllUsersWithCarts() {
  try {
    const users = await prisma.user.findMany({
      include: {
        cart: {
          include: { items: { include: { product: true } } },
        },
      },
      orderBy: { email: "asc" },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      cart: u.cart,
      itemsCount:
        u.cart?.items?.reduce((acc: number, it: any) => acc + (it.quantity ?? 0), 0) ?? 0,
    }));
  } catch (err) {
    // If DB/table isn't available yet (development), fail gracefully so UI can render
    // and authentication UI still appears. Log to console for visibility.
    // eslint-disable-next-line no-console
    console.error("getAllUsersWithCarts error:", err);
    return [];
  }
}

export async function transferCart(
  fromUserId: string | number,
  toUserId: string | number
) {
  const fromId = String(fromUserId ?? "").trim();
  const toId = String(toUserId ?? "").trim();

  if (!fromId || !toId) {
    throw new TypeError("Invalid user id(s)");
  }
  if (fromId === toId) {
    throw new TypeError("Cannot transfer to the same user");
  }

  return await prisma.$transaction(async (tx) => {
    // ensure carts exist
    const fromCart = await tx.cart.findUnique({
      where: { userId: fromId },
      include: { items: true },
    });
    if (!fromCart) return { transferred: 0 };

    let toCart = await tx.cart.findUnique({
      where: { userId: toId },
      include: { items: true },
    });
    if (!toCart) {
      toCart = await tx.cart.create({
        data: { user: { connect: { id: toId } } },
        include: { items: true },
      });
    }

    let transferred = 0;

    for (const item of fromCart.items) {
      // check if toCart already has the product
      const existing = await tx.cartItem.findUnique({
        where: {
          cartId_productId: { cartId: toCart!.id, productId: item.productId },
        },
      });

      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: (existing.quantity ?? 0) + (item.quantity ?? 0) },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: toCart!.id,
            productId: item.productId,
            quantity: item.quantity ?? 0,
          },
        });
      }

      // remove item from fromCart
      await tx.cartItem.delete({ where: { id: item.id } });
      transferred += item.quantity ?? 0;
    }

    return { transferred };
  });
}

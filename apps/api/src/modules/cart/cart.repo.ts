import { prisma } from "@/config/db";

const cartInclude = { items: { include: { product: true } } } as const;

export function getOrCreateCart(guestId: string) {
  return prisma.cart.upsert({
    where: { guestId },
    update: {},
    create: { guestId },
    include: cartInclude,
  });
}

export async function addCartItem(guestId: string, productId: string, qty: number) {
  const cart = await getOrCreateCart(guestId);
  const existing = cart.items.find((i) => i.productId === productId);

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { qty: existing.qty + qty },
    });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, qty } });
  }

  return prisma.cart.findUniqueOrThrow({ where: { id: cart.id }, include: cartInclude });
}

export async function updateCartItem(guestId: string, itemId: string, qty: number) {
  const cart = await getOrCreateCart(guestId);
  await prisma.cartItem.updateMany({ where: { id: itemId, cartId: cart.id }, data: { qty } });
  return prisma.cart.findUniqueOrThrow({ where: { id: cart.id }, include: cartInclude });
}

export async function removeCartItem(guestId: string, itemId: string) {
  const cart = await getOrCreateCart(guestId);
  await prisma.cartItem.deleteMany({ where: { id: itemId, cartId: cart.id } });
  return prisma.cart.findUniqueOrThrow({ where: { id: cart.id }, include: cartInclude });
}

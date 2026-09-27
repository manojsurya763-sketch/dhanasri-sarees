import type { Request, Response } from "express";
import { dateRangeQuerySchema } from "@/modules/analytics/analytics.schema";
import {
  countReturnsInRange,
  countRevenueOrdersInRange,
  findRevenueOrderItemsInRange,
  findRevenueOrdersInRange,
  groupRevenueOrdersByCustomer,
} from "@/modules/analytics/analytics.repo";

const DEFAULT_RANGE_DAYS = 30;

function resolveRange(dateFrom?: Date, dateTo?: Date) {
  const to = dateTo ?? new Date();
  const from = dateFrom ?? new Date(to.getTime() - DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000);
  return { from, to };
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getSalesAnalytics(req: Request, res: Response) {
  const { dateFrom, dateTo } = dateRangeQuerySchema.parse(req.query);
  const { from, to } = resolveRange(dateFrom, dateTo);

  const orders = await findRevenueOrdersInRange(from, to);

  const byDay = new Map<string, { revenue: number; orders: number }>();
  let totalRevenue = 0;
  for (const order of orders) {
    const key = dayKey(order.createdAt);
    const amount = Number(order.totalAmount);
    const bucket = byDay.get(key) ?? { revenue: 0, orders: 0 };
    bucket.revenue += amount;
    bucket.orders += 1;
    byDay.set(key, bucket);
    totalRevenue += amount;
  }

  const days = Array.from(byDay.entries())
    .map(([date, v]) => ({ date, revenue: v.revenue, orders: v.orders }))
    .sort((a, b) => a.date.localeCompare(b.date));

  res.json({
    dateFrom: from.toISOString(),
    dateTo: to.toISOString(),
    totalRevenue,
    totalOrders: orders.length,
    days,
  });
}

export async function getProductAnalytics(req: Request, res: Response) {
  const { dateFrom, dateTo } = dateRangeQuerySchema.parse(req.query);
  const { from, to } = resolveRange(dateFrom, dateTo);

  const items = await findRevenueOrderItemsInRange(from, to);

  const byProduct = new Map<string, { title: string; units: number; revenue: number }>();
  for (const item of items) {
    const existing = byProduct.get(item.productId) ?? { title: item.product.title, units: 0, revenue: 0 };
    existing.units += item.qty;
    existing.revenue += item.qty * Number(item.priceAtPurchase);
    byProduct.set(item.productId, existing);
  }

  const all = Array.from(byProduct.entries()).map(([productId, v]) => ({ productId, ...v }));
  const topByRevenue = [...all].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  const topByUnits = [...all].sort((a, b) => b.units - a.units).slice(0, 10);

  res.json({ dateFrom: from.toISOString(), dateTo: to.toISOString(), topByRevenue, topByUnits });
}

export async function getCustomerAnalytics(_req: Request, res: Response) {
  const groups = await groupRevenueOrdersByCustomer();
  const totalCustomers = groups.length;
  const repeatCustomers = groups.filter((g) => g._count._all >= 2).length;
  const repeatRate = totalCustomers === 0 ? 0 : repeatCustomers / totalCustomers;

  res.json({ totalCustomers, repeatCustomers, repeatRate });
}

// Only meaningful once returns exist (Phase 3) — an empty-returns store just
// reports a 0% rate rather than erroring.
export async function getReturnsRateAnalytics(req: Request, res: Response) {
  const { dateFrom, dateTo } = dateRangeQuerySchema.parse(req.query);
  const { from, to } = resolveRange(dateFrom, dateTo);

  const [orders, returns] = await Promise.all([countRevenueOrdersInRange(from, to), countReturnsInRange(from, to)]);
  const returnsRate = orders === 0 ? 0 : returns / orders;

  res.json({ dateFrom: from.toISOString(), dateTo: to.toISOString(), orders, returns, returnsRate });
}

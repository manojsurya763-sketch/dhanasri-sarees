import type { Request, Response } from "express";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import { adminListCustomersQuerySchema, updateCustomerSchema } from "@/modules/customers/customers.schema";
import {
  findCustomerByIdAdmin,
  findCustomersAdmin,
  getCustomerSpendSummary,
  setCustomerActive,
  updateCustomerRecord,
} from "@/modules/customers/customers.repo";

export async function listCustomersAdmin(req: Request, res: Response) {
  const query = adminListCustomersQuerySchema.parse(req.query);
  const { items, total } = await findCustomersAdmin(query);

  res.json({
    items: items.map((c) => ({
      id: c.id,
      phone: c.phone,
      name: c.name,
      email: c.email,
      isActive: c.isActive,
      createdAt: c.createdAt,
      orderCount: c._count.orders,
    })),
    pagination: { total, page: query.page, pageSize: query.limit },
  });
}

export async function getCustomerAdmin(req: Request, res: Response) {
  const customer = await findCustomerByIdAdmin(param(req.params.id));
  if (!customer) throw new ApiError(404, "Customer not found");

  // Employees get the same shape everyone else does, minus order amounts —
  // same "no pricing" boundary the IA draws for Orders.
  const isEmployee = req.staff!.role === "employee";
  const orders = customer.orders.map((o) =>
    isEmployee ? { id: o.id, status: o.status, createdAt: o.createdAt } : o
  );

  res.json({
    id: customer.id,
    phone: customer.phone,
    name: customer.name,
    email: customer.email,
    isActive: customer.isActive,
    createdAt: customer.createdAt,
    reviewCount: customer._count.reviews,
    wishlistCount: customer._count.wishlist,
    orders,
  });
}

export async function updateCustomer(req: Request, res: Response) {
  const id = param(req.params.id);
  const data = updateCustomerSchema.parse(req.body);

  const existing = await findCustomerByIdAdmin(id);
  if (!existing) throw new ApiError(404, "Customer not found");

  const customer = await updateCustomerRecord(id, data);
  res.json(customer);
}

export async function deactivateCustomer(req: Request, res: Response) {
  const id = param(req.params.id);
  const existing = await findCustomerByIdAdmin(id);
  if (!existing) throw new ApiError(404, "Customer not found");

  const customer = await setCustomerActive(id, false);
  res.json(customer);
}

export async function reactivateCustomer(req: Request, res: Response) {
  const id = param(req.params.id);
  const existing = await findCustomerByIdAdmin(id);
  if (!existing) throw new ApiError(404, "Customer not found");

  const customer = await setCustomerActive(id, true);
  res.json(customer);
}

export async function getCustomerSpendSummaryAdmin(req: Request, res: Response) {
  const id = param(req.params.id);
  const existing = await findCustomerByIdAdmin(id);
  if (!existing) throw new ApiError(404, "Customer not found");

  const summary = await getCustomerSpendSummary(id);
  res.json(summary);
}

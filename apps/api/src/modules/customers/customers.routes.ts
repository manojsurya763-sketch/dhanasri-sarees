import { Router } from "express";
import { requireSuperAdmin } from "@/middleware/auth.guard";
import {
  deactivateCustomer,
  getCustomerAdmin,
  getCustomerSpendSummaryAdmin,
  listCustomersAdmin,
  reactivateCustomer,
  updateCustomer,
} from "@/modules/customers/customers.controller";

export const customersAdminRouter = Router();

customersAdminRouter.get("/", listCustomersAdmin);
customersAdminRouter.get("/:id", getCustomerAdmin);
customersAdminRouter.get("/:id/spend-summary", requireSuperAdmin, getCustomerSpendSummaryAdmin);
customersAdminRouter.patch("/:id", requireSuperAdmin, updateCustomer);
customersAdminRouter.patch("/:id/deactivate", requireSuperAdmin, deactivateCustomer);
customersAdminRouter.patch("/:id/reactivate", requireSuperAdmin, reactivateCustomer);

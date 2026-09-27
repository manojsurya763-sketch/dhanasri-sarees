import { Router } from "express";
import { requireAdminOrAbove } from "@/middleware/auth.guard";
import {
  createReturn,
  getReturnAdmin,
  listReturnsAdmin,
  updateReturnStatus,
} from "@/modules/returns/returns.controller";

export const returnsAdminRouter = Router();

returnsAdminRouter.get("/", listReturnsAdmin);
returnsAdminRouter.get("/:id", getReturnAdmin);
returnsAdminRouter.post("/", requireAdminOrAbove, createReturn);
returnsAdminRouter.patch("/:id/status", updateReturnStatus);

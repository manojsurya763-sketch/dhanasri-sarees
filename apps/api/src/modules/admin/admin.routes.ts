import { Router } from "express";
import { requireAdminOrAbove, requireSuperAdmin } from "@/middleware/auth.guard";
import { getDashboardStats, getMe } from "@/modules/admin/admin.controller";
import { updateSettings } from "@/modules/settings/settings.controller";

export const adminRouter = Router();

adminRouter.get("/me", getMe);
adminRouter.get("/dashboard", requireAdminOrAbove, getDashboardStats);
adminRouter.patch("/settings", requireSuperAdmin, updateSettings);

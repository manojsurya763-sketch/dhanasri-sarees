import { Router } from "express";
import {
  createStaff,
  deactivateStaff,
  listStaff,
  reactivateStaff,
  updateStaffRole,
} from "@/modules/staff/staff.controller";

export const staffAdminRouter = Router();

staffAdminRouter.get("/", listStaff);
staffAdminRouter.post("/", createStaff);
staffAdminRouter.patch("/:id/role", updateStaffRole);
staffAdminRouter.patch("/:id/deactivate", deactivateStaff);
staffAdminRouter.patch("/:id/reactivate", reactivateStaff);

import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { firebaseAuth } from "@/config/firebaseAdmin";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import { createStaffSchema, updateStaffRoleSchema } from "@/modules/staff/staff.schema";
import {
  createStaffRecord,
  findAllStaff,
  findStaffByFirebaseUid,
  findStaffById,
  setStaffActive,
  setStaffRole,
} from "@/modules/staff/staff.repo";

export async function listStaff(_req: Request, res: Response) {
  const items = await findAllStaff();
  res.json({ items });
}

export async function createStaff(req: Request, res: Response) {
  const data = createStaffSchema.parse(req.body);

  let firebaseUser = await firebaseAuth.getUserByEmail(data.email).catch(() => null);
  if (!firebaseUser) {
    firebaseUser = await firebaseAuth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });
  }

  const existing = await findStaffByFirebaseUid(firebaseUser.uid);
  if (existing) throw new ApiError(409, "This email is already a staff account");

  const staff = await createStaffRecord({
    firebaseUid: firebaseUser.uid,
    email: data.email,
    name: data.name,
    role: data.role,
    createdBy: req.staff!.id,
  }).catch((err) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ApiError(409, "This email is already a staff account");
    }
    throw err;
  });

  res.status(201).json(staff);
}

export async function updateStaffRole(req: Request, res: Response) {
  const id = param(req.params.id);
  const { role } = updateStaffRoleSchema.parse(req.body);

  const existing = await findStaffById(id);
  if (!existing) throw new ApiError(404, "Staff member not found");

  const staff = await setStaffRole(id, role);
  res.json(staff);
}

export async function deactivateStaff(req: Request, res: Response) {
  const id = param(req.params.id);
  if (id === req.staff!.id) throw new ApiError(400, "You cannot deactivate your own account");

  const existing = await findStaffById(id);
  if (!existing) throw new ApiError(404, "Staff member not found");

  const staff = await setStaffActive(id, false);
  res.json(staff);
}

export async function reactivateStaff(req: Request, res: Response) {
  const id = param(req.params.id);

  const existing = await findStaffById(id);
  if (!existing) throw new ApiError(404, "Staff member not found");

  const staff = await setStaffActive(id, true);
  res.json(staff);
}

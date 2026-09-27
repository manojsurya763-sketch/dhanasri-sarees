import type { StaffRole } from "@prisma/client";
import { prisma } from "@/config/db";

export function findAllStaff() {
  return prisma.staff.findMany({ orderBy: { createdAt: "desc" } });
}

export function findStaffById(id: string) {
  return prisma.staff.findUnique({ where: { id } });
}

export function findStaffByFirebaseUid(firebaseUid: string) {
  return prisma.staff.findUnique({ where: { firebaseUid } });
}

export function createStaffRecord(data: {
  firebaseUid: string;
  email: string;
  name?: string;
  role: StaffRole;
  createdBy: string;
}) {
  return prisma.staff.create({ data });
}

export function setStaffRole(id: string, role: StaffRole) {
  return prisma.staff.update({ where: { id }, data: { role } });
}

export function setStaffActive(id: string, isActive: boolean) {
  return prisma.staff.update({ where: { id }, data: { isActive } });
}

import { prisma } from "@/config/db";

export function findOpenEntry(staffId: string) {
  return prisma.attendanceEntry.findFirst({
    where: { staffId, clockOutAt: null },
  });
}

export function createEntry(staffId: string) {
  return prisma.attendanceEntry.create({
    data: { staffId, clockInAt: new Date() },
  });
}

export function closeEntry(id: string) {
  return prisma.attendanceEntry.update({
    where: { id },
    data: { clockOutAt: new Date() },
  });
}

export async function listEntriesForStaff(staffId: string, page: number, limit: number) {
  const [items, total] = await prisma.$transaction([
    prisma.attendanceEntry.findMany({
      where: { staffId },
      orderBy: { clockInAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.attendanceEntry.count({ where: { staffId } }),
  ]);
  return { items, total };
}

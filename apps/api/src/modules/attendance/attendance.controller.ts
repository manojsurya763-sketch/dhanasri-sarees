import type { Request, Response } from "express";
import { ApiError } from "@/middleware/error-handler";
import { listMyAttendanceQuerySchema } from "@/modules/attendance/attendance.schema";
import { closeEntry, createEntry, findOpenEntry, listEntriesForStaff } from "@/modules/attendance/attendance.repo";

export async function clockIn(req: Request, res: Response) {
  const staffId = req.staff!.id;
  const open = await findOpenEntry(staffId);
  if (open) throw new ApiError(409, "Already clocked in");

  const entry = await createEntry(staffId);
  res.status(201).json(entry);
}

export async function clockOut(req: Request, res: Response) {
  const staffId = req.staff!.id;
  const open = await findOpenEntry(staffId);
  if (!open) throw new ApiError(404, "No open attendance entry to clock out of");

  const entry = await closeEntry(open.id);
  res.json(entry);
}

export async function listMyAttendance(req: Request, res: Response) {
  const query = listMyAttendanceQuerySchema.parse(req.query);
  const { items, total } = await listEntriesForStaff(req.staff!.id, query.page, query.limit);

  res.json({
    items,
    pagination: { total, page: query.page, pageSize: query.limit },
  });
}

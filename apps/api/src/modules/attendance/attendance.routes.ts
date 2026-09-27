import { Router } from "express";
import { clockIn, clockOut, listMyAttendance } from "@/modules/attendance/attendance.controller";

export const attendanceRouter = Router();

attendanceRouter.get("/me", listMyAttendance);
attendanceRouter.post("/clock-in", clockIn);
attendanceRouter.post("/clock-out", clockOut);

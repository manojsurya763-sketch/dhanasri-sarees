import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { decodeFakeToken, staffToken } from "./fakeAuth";

vi.mock("@/config/firebaseAdmin", () => ({
  firebaseAuth: { verifyIdToken: vi.fn(async (t: string) => decodeFakeToken(t)) },
}));

import { app } from "@/app";
import { prisma } from "@/config/db";

describe("requireStaff / requireRole", () => {
  const saUid = "auth-test-sa";
  const adminUid = "auth-test-admin";
  const empUid = "auth-test-employee";

  beforeAll(async () => {
    await prisma.staff.createMany({
      data: [
        { firebaseUid: saUid, email: "auth-sa@test.local", role: "super_admin" },
        { firebaseUid: adminUid, email: "auth-admin@test.local", role: "admin" },
        { firebaseUid: empUid, email: "auth-employee@test.local", role: "employee" },
      ],
      skipDuplicates: true,
    });
  });

  afterAll(async () => {
    await prisma.staff.deleteMany({ where: { firebaseUid: { in: [saUid, adminUid, empUid] } } });
  });

  it("rejects requests with no token", async () => {
    const res = await request(app).get("/admin/me");
    expect(res.status).toBe(401);
  });

  it("allows any staff role to hit /admin/me", async () => {
    for (const uid of [saUid, adminUid, empUid]) {
      const res = await request(app).get("/admin/me").set("Authorization", `Bearer ${staffToken(uid)}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
    }
  });

  it("only allows super_admin to hit /admin/staff", async () => {
    const sa = await request(app).get("/admin/staff").set("Authorization", `Bearer ${staffToken(saUid)}`);
    expect(sa.status).toBe(200);

    const admin = await request(app).get("/admin/staff").set("Authorization", `Bearer ${staffToken(adminUid)}`);
    expect(admin.status).toBe(403);

    const employee = await request(app).get("/admin/staff").set("Authorization", `Bearer ${staffToken(empUid)}`);
    expect(employee.status).toBe(403);
  });

  it("rejects a deactivated staff member on the very next request", async () => {
    await prisma.staff.update({ where: { firebaseUid: adminUid }, data: { isActive: false } });
    const res = await request(app).get("/admin/me").set("Authorization", `Bearer ${staffToken(adminUid)}`);
    expect(res.status).toBe(403);
    await prisma.staff.update({ where: { firebaseUid: adminUid }, data: { isActive: true } });
  });
});

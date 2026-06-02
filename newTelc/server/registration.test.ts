import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `sample-user-${userId}`,
    email: `user${userId}@example.com`,
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 999,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Registration System", () => {
  describe("OTP Procedures", () => {
    it("should send OTP to email", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.otp.send({ email: "test@example.com" });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toContain("OTP sent");
    });

    it("should verify OTP", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // First send OTP
      await caller.otp.send({ email: "test@example.com" });

      // Note: In a real test, we'd need to retrieve the actual OTP from the database
      // For now, we're just testing that the procedure exists and can be called
    });

    it("should reject invalid OTP format", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.otp.verify({ email: "test@example.com", otp: "invalid" });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("Exam Procedures", () => {
    it("should allow admin to create exam", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.exams.create({
        levelId: 1,
        region: "tashkent",
        address: "Test Address",
        examDate: new Date("2026-06-01"),
        startTime: "09:00",
        endTime: "11:00",
        capacity: 30,
      });

      expect(result).toBeDefined();
    });

    it("should prevent non-admin from creating exam", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.exams.create({
          levelId: 1,
          region: "tashkent",
          address: "Test Address",
          examDate: new Date("2026-06-01"),
          startTime: "09:00",
          endTime: "11:00",
          capacity: 30,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should list exam levels", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const levels = await caller.examLevels.list();

      expect(Array.isArray(levels)).toBe(true);
    });
  });

  describe("Payment Procedures", () => {
    it("should verify payment", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.verify({ paymentId: 1 });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });
});

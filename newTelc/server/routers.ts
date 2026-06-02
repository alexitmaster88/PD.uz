import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { sendOtpEmail, sendRegistrationConfirmation } from "./email";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Exam Level procedures
  examLevels: router({
    list: publicProcedure.query(async () => {
      return db.getExamLevels();
    }),

    get: publicProcedure.input(z.object({ level: z.string() })).query(async ({ input }) => {
      return db.getExamLevelByLevel(input.level);
    }),

    update: protectedProcedure
      .input(z.object({ levelId: z.number(), price: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.updateExamLevelPrice(input.levelId, input.price);
      }),
  }),

  // Exam procedures
  exams: router({
    list: publicProcedure.query(async () => {
      return db.getAllExams();
    }),

    getByRegionAndLevel: publicProcedure
      .input(z.object({ region: z.string(), levelId: z.number() }))
      .query(async ({ input }) => {
        return db.getExamsByRegionAndLevel(input.region, input.levelId);
      }),

    get: publicProcedure.input(z.object({ examId: z.number() })).query(async ({ input }) => {
      return db.getExamById(input.examId);
    }),

    create: protectedProcedure
      .input(
        z.object({
          levelId: z.number(),
          region: z.string(),
          address: z.string().optional(),
          examDate: z.date(),
          startTime: z.string(),
          endTime: z.string(),
          capacity: z.number().default(30),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.createExam(input);
      }),

    update: protectedProcedure
      .input(z.object({ examId: z.number(), data: z.any() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.updateExam(input.examId, input.data);
      }),

    delete: protectedProcedure
      .input(z.object({ examId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.deleteExam(input.examId);
      }),
  }),

  // Registration procedures
  registrations: router({
    create: protectedProcedure
      .input(
        z.object({
          examId: z.number(),
          firstName: z.string(),
          lastName: z.string(),
          phoneNumber: z.string(),
          email: z.string().email(),
          passportNumber: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Check for duplicate passport number for this exam
        const isDuplicate = await db.checkDuplicatePassportExam(input.passportNumber, input.examId);
        if (isDuplicate) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This passport number is already registered for this exam",
          });
        }

        return db.createRegistration({
          userId: ctx.user.id,
          examId: input.examId,
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          email: input.email,
          passportNumber: input.passportNumber,
          status: "pending",
        });
      }),

    get: protectedProcedure
      .input(z.object({ registrationId: z.number() }))
      .query(async ({ input, ctx }) => {
        const registration = await db.getRegistrationById(input.registrationId);
        if (!registration || (registration.userId !== ctx.user.id && ctx.user.role !== "admin")) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return registration;
      }),

    listByUser: protectedProcedure.query(async ({ ctx }) => {
      return db.getRegistrationsByUserId(ctx.user.id);
    }),

    listAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return db.getAllRegistrations();
    }),

    updateStatus: protectedProcedure
      .input(z.object({ registrationId: z.number(), status: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.updateRegistration(input.registrationId, { status: input.status });
      }),

    markEmailVerified: protectedProcedure
      .input(z.object({ registrationId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const registration = await db.getRegistrationById(input.registrationId);
        if (!registration || registration.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.updateRegistration(input.registrationId, { emailVerified: true, status: "verified" });
      }),
  }),

  // OTP procedures
  otp: router({
    send: publicProcedure.input(z.object({ email: z.string().email() })).mutation(async ({ input }) => {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await db.createOtp(input.email, otp, expiresAt);

      // Send OTP via email
      await sendOtpEmail(input.email, otp);

      return { success: true, message: "OTP sent to email" };
    }),

    verify: publicProcedure
      .input(z.object({ email: z.string().email(), otp: z.string() }))
      .mutation(async ({ input }) => {
        // Allow demo OTP 123456 for testing
        if (input.otp === "123456") {
          console.log(`[OTP] Demo OTP verified for ${input.email}`);
          return { success: true, message: "OTP verified" };
        }

        const otpRecord = await db.getOtpByEmailAndCode(input.email, input.otp);

        if (!otpRecord) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid OTP" });
        }

        if (otpRecord.expiresAt < new Date()) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "OTP expired" });
        }

        await db.markOtpAsVerified(otpRecord.id);

        return { success: true, message: "OTP verified" };
      }),
  }),

  // Payment procedures
  payments: router({
    create: protectedProcedure
      .input(
        z.object({
          registrationId: z.number(),
          amount: z.string(),
          paymentMethod: z.enum(["click", "payme", "other"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const registration = await db.getRegistrationById(input.registrationId);
        if (!registration || registration.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        return db.createPayment({
          registrationId: input.registrationId,
          amount: input.amount,
          paymentMethod: input.paymentMethod,
          status: "pending",
        });
      }),

    get: protectedProcedure
      .input(z.object({ registrationId: z.number() }))
      .query(async ({ input, ctx }) => {
        const registration = await db.getRegistrationById(input.registrationId);
        if (!registration || (registration.userId !== ctx.user.id && ctx.user.role !== "admin")) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.getPaymentByRegistrationId(input.registrationId);
      }),

    verify: protectedProcedure
      .input(z.object({ paymentId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Verify payment with payment provider
        // For now, mark as completed
        await db.updatePayment(input.paymentId, { status: "completed", verifiedAt: new Date() });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

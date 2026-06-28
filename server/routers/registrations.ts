import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../trpc"
import * as db from "../db"
import { sendRegistrationConfirmation } from "../email"

export const registrationsRouter = router({
  // Public — email OTP verified on the client side before calling this
  create: publicProcedure
    .input(
      z.object({
        examId: z.number(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        phoneNumber: z.string().regex(/^\+998\d{9}$/, "Phone must be in format +998XXXXXXXXX"),
        email: z.string().email(),
        passportNumber: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const isDuplicate = await db.checkDuplicatePassportExam(input.passportNumber, input.examId)
      if (isDuplicate) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This passport number is already registered for this exam",
        })
      }

      const registration = await db.createRegistration({
        userId: ctx.user?.id ?? null,
        ...input,
      })

      if (!registration) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create registration" })
      }

      // Fire-and-forget confirmation email — don't let email failure break registration
      void (async () => {
        try {
          const exam = await db.getExamById(input.examId)
          if (exam) {
            const levels = await db.getExamLevels()
            const level = levels.find(l => l.id === exam.levelId)
            await sendRegistrationConfirmation(input.email, {
              registrationId: registration.id,
              firstName: input.firstName,
              lastName: input.lastName,
              passportNumber: input.passportNumber,
              level: level?.level ?? '',
              region: exam.region,
              examDate: exam.examDate,
              startTime: exam.startTime,
              examAddress: exam.address ?? undefined,
            })
          }
        } catch {}
      })()

      return registration
    }),

  get: publicProcedure
    .input(z.object({ registrationId: z.number() }))
    .query(async ({ input }) => {
      const registration = await db.getRegistrationById(input.registrationId)
      if (!registration) throw new TRPCError({ code: "NOT_FOUND" })
      return registration
    }),

  listByUser: protectedProcedure.query(({ ctx }) =>
    db.getRegistrationsByUserId(ctx.user.id)
  ),

  listAll: adminProcedure.query(() => db.getAllRegistrations()),

  updateStatus: adminProcedure
    .input(z.object({ registrationId: z.number(), status: z.enum(["pending", "verified", "paid", "completed", "cancelled", "denied"]) }))
    .mutation(({ input }) =>
      db.updateRegistration(input.registrationId, {
        status: input.status as Parameters<typeof db.updateRegistration>[1]["status"],
      })
    ),

  markEmailVerified: publicProcedure
    .input(z.object({ registrationId: z.number() }))
    .mutation(({ input }) =>
      db.updateRegistration(input.registrationId, { emailVerified: true, status: "verified" })
    ),
})

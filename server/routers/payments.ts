import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { router, adminProcedure } from "../trpc"
import * as db from "../db"

export const paymentsRouter = router({
  create: adminProcedure
    .input(
      z.object({
        registrationId: z.number(),
        amount: z.string(),
        paymentMethod: z.enum(["click", "payme", "other"]),
      })
    )
    .mutation(async ({ input }) => {
      const registration = await db.getRegistrationById(input.registrationId)
      if (!registration) throw new TRPCError({ code: "NOT_FOUND" })

      return db.createPayment(input)
    }),

  get: adminProcedure
    .input(z.object({ registrationId: z.number() }))
    .query(({ input }) => db.getPaymentByRegistrationId(input.registrationId)),

  // Marks payment as completed — admin only
  verify: adminProcedure
    .input(z.object({ paymentId: z.number() }))
    .mutation(async ({ input }) => {
      await db.updatePayment(input.paymentId, {
        status: "completed",
        verifiedAt: new Date(),
        paidAt: new Date(),
      })
      return { success: true }
    }),
})

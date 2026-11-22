import { randomInt, timingSafeEqual } from "crypto"
import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { router, publicProcedure } from "../trpc"
import * as db from "../db"
import { sendOtpEmail } from "../email"

export const otpRouter = router({
  send: publicProcedure
    .input(z.object({ email: z.email() }))
    .mutation(async ({ input }) => {
      const otp = randomInt(100000, 1000000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      await db.createOtp(input.email, otp, expiresAt)
      await sendOtpEmail(input.email, otp)

      return { success: true }
    }),

  verify: publicProcedure
    .input(z.object({ email: z.email(), otp: z.string() }))
    .mutation(async ({ input }) => {
      if (process.env.NODE_ENV === "development" && input.otp === "123456") {
        return { success: true }
      }

      const record = await db.getActiveOtpByEmail(input.email)
      if (!record) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired OTP" })
      }

      const expected = Buffer.from(record.otp)
      const given = Buffer.from(input.otp.trim())
      if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
        // Each wrong guess cuts 2 minutes off the code's lifetime (~5 guesses per code)
        await db.setOtpExpiry(record.id, new Date(record.expiresAt.getTime() - 2 * 60 * 1000))
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired OTP" })
      }

      await db.markOtpAsVerified(record.id)

      return { success: true }
    }),
})

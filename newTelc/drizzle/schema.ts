import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, unique } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Exam levels with dynamic pricing
 */
export const examLevels = mysqlTable("exam_levels", {
  id: int("id").autoincrement().primaryKey(),
  level: varchar("level", { length: 10 }).notNull().unique(), // A2/B1, B1, B2, C1
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExamLevel = typeof examLevels.$inferSelect;
export type InsertExamLevel = typeof examLevels.$inferInsert;

/**
 * Exam sessions with date, time, location, and capacity
 */
export const exams = mysqlTable("exams", {
  id: int("id").autoincrement().primaryKey(),
  levelId: int("levelId").notNull(),
  region: varchar("region", { length: 50 }).notNull(), // Tashkent, Samarkand, Fergana, Kashkadarya, Bukhara, Urgench
  address: text("address"),
  examDate: timestamp("examDate").notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(), // HH:mm format
  endTime: varchar("endTime", { length: 5 }).notNull(),
  capacity: int("capacity").notNull().default(30),
  registeredCount: int("registeredCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Exam = typeof exams.$inferSelect;
export type InsertExam = typeof exams.$inferInsert;

/**
 * User registrations for exams
 */
export const registrations = mysqlTable(
  "registrations",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    examId: int("examId").notNull(),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    passportNumber: varchar("passportNumber", { length: 50 }).notNull(),
    status: mysqlEnum("status", ["pending", "verified", "paid", "completed", "cancelled"]).default("pending").notNull(),
    emailVerified: boolean("emailVerified").default(false).notNull(),
    paymentVerified: boolean("paymentVerified").default(false).notNull(),
    registrationDate: timestamp("registrationDate").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [unique("unique_passport_exam").on(table.passportNumber, table.examId)]
);

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = typeof registrations.$inferInsert;

/**
 * Payment records
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  registrationId: int("registrationId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }).notNull(), // click, payme, other
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
  transactionId: varchar("transactionId", { length: 100 }),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * OTP verification for email confirmation
 */
export const otpVerifications = mysqlTable("otp_verifications", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  verified: boolean("verified").default(false).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OtpVerification = typeof otpVerifications.$inferSelect;
export type InsertOtpVerification = typeof otpVerifications.$inferInsert;

// Relations
export const examsRelations = relations(exams, ({ one }) => ({
  level: one(examLevels, {
    fields: [exams.levelId],
    references: [examLevels.id],
  }),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
  exam: one(exams, {
    fields: [registrations.examId],
    references: [exams.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  registration: one(registrations, {
    fields: [payments.registrationId],
    references: [registrations.id],
  }),
}));
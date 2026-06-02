import { eq, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, examLevels, exams, registrations, payments, otpVerifications } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Exam Level queries
export async function getExamLevels() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(examLevels).orderBy(examLevels.level);
}

export async function getExamLevelByLevel(level: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(examLevels).where(eq(examLevels.level, level)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateExamLevelPrice(levelId: number, price: string) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(examLevels).set({ price }).where(eq(examLevels.id, levelId));
}

// Exam queries
export async function getAllExams() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(exams).orderBy(exams.examDate);
}

export async function getExamsByRegionAndLevel(region: string, levelId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(exams)
    .where(and(eq(exams.region, region), eq(exams.levelId, levelId)))
    .orderBy(exams.examDate);
}

export async function getExamById(examId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(exams).where(eq(exams.id, examId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createExam(data: any) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(exams).values(data);
  return result;
}

export async function updateExam(examId: number, data: any) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(exams).set(data).where(eq(exams.id, examId));
}

export async function deleteExam(examId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return db.delete(exams).where(eq(exams.id, examId));
}

// Registration queries
export async function createRegistration(data: any) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(registrations).values(data);
  return result;
}

export async function getRegistrationById(registrationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(registrations).where(eq(registrations.id, registrationId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getRegistrationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(registrations).where(eq(registrations.userId, userId));
}

export async function getAllRegistrations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(registrations).orderBy(registrations.createdAt);
}

export async function updateRegistration(registrationId: number, data: any) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(registrations).set(data).where(eq(registrations.id, registrationId));
}

export async function checkDuplicatePassportExam(passportNumber: string, examId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(registrations)
    .where(and(eq(registrations.passportNumber, passportNumber), eq(registrations.examId, examId)))
    .limit(1);
  return result.length > 0;
}

// Payment queries
export async function createPayment(data: any) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(payments).values(data);
  return result;
}

export async function getPaymentByRegistrationId(registrationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(payments).where(eq(payments.registrationId, registrationId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePayment(paymentId: number, data: any) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(payments).set(data).where(eq(payments.id, paymentId));
}

// OTP queries
export async function createOtp(email: string, otp: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(otpVerifications).values({ email, otp, verified: false, expiresAt });
}

export async function getOtpByEmailAndCode(email: string, otp: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(otpVerifications)
    .where(and(eq(otpVerifications.email, email), eq(otpVerifications.otp, otp)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function markOtpAsVerified(otpId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(otpVerifications).set({ verified: true }).where(eq(otpVerifications.id, otpId));
}

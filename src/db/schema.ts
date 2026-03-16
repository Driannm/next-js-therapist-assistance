// src/db/schema.ts

import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── ENUMS ─────────────────────────────────────────────────────

export const customerTypeEnum = pgEnum("customer_type", [
  "External Client",
  "ZEP",
]);

// ─── USERS ─────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  username: varchar("username", { length: 100 })
    .notNull()
    .unique(),

  password: text("password").notNull(), // bcrypt hash

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

// ─── FACIAL TYPES ──────────────────────────────────────────────

export const facialTypes = pgTable("facial_types", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
});

// ─── MONTHLY TARGETS ───────────────────────────────────────────
// target pasien yang bisa diset oleh user setiap bulan

export const monthlyTargets = pgTable(
  "monthly_targets",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),

    month: integer("month").notNull(), // 1 - 12

    year: integer("year").notNull(),

    targetPatients: integer("target_patients").notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userMonthUnique: uniqueIndex("user_month_unique").on(
      table.userId,
      table.month,
      table.year
    ),
  })
);

// ─── TREATMENTS ─────────────────────────────────────────────────

export const treatments = pgTable("treatments", {
  id: serial("id").primaryKey(),

  // owner data (biar tiap user cuma lihat datanya sendiri)
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),

  date: timestamp("date")
    .defaultNow()
    .notNull(),

  customerName: varchar("customer_name", { length: 255 })
    .notNull(),

  facialTypeId: integer("facial_type_id")
    .references(() => facialTypes.id)
    .notNull(),

  orderNo: varchar("order_no", { length: 100 })
    .notNull()
    .unique(),

  customerType: customerTypeEnum("customer_type")
    .notNull(),

  nextAppointment: timestamp("next_appointment"),

  therapistName: varchar("therapist_name", { length: 255 })
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});
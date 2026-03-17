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

export const customerTypeEnum = pgEnum("customer_type", [
  "External Client",
  "ZEP",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const facialTypes = pgTable("facial_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const monthlyTargets = pgTable(
  "monthly_targets",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    targetPatients: integer("target_patients").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userMonthUnique: uniqueIndex("user_month_unique").on(
      table.userId,
      table.month,
      table.year
    ),
  })
);

export const offDates = pgTable(
  "off_dates",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    date: varchar("date", { length: 10 }).notNull(), // "YYYY-MM-DD"
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userDateUnique: uniqueIndex("user_date_unique").on(
      table.userId,
      table.date
    ),
  })
);

export const treatments = pgTable("treatments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  facialTypeId: integer("facial_type_id")
    .references(() => facialTypes.id)
    .notNull(),
  orderNo: varchar("order_no", { length: 100 }).notNull().unique(),
  customerType: customerTypeEnum("customer_type").notNull(),
  nextAppointmentId: integer("next_appointment_id")
    .references(() => facialTypes.id),
  therapistName: varchar("therapist_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
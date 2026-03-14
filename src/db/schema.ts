import { pgTable, serial, text, timestamp, varchar, integer, pgEnum  } from 'drizzle-orm/pg-core';

export const customerTypeEnum = pgEnum("customer_type", [
  "External Client",
  "ZEP",
]);

export const facialTypes = pgTable("facial_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const treatments = pgTable("treatments", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  facialTypeId: integer("facial_type_id")
    .references(() => facialTypes.id)
    .notNull(),
  orderNo: varchar("order_no", { length: 100 }).notNull(),
  customerType: customerTypeEnum("customer_type").notNull(),
  nextAppointment: varchar("next_appointment", { length: 255 }),
  therapistName: varchar("therapist_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


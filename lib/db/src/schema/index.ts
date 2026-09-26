import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type OrderLine = {
  name: string;
  quantity: number;
  price: number;
};

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  tableNumber: text("table_number").notNull(),
  items: jsonb("items").$type<OrderLine[]>().notNull(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reservationsTable = pgTable("reservations", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
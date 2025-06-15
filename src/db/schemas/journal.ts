import { date, pgTable, serial, text } from "drizzle-orm/pg-core";

export const journal = pgTable("journal", {
  id: serial().primaryKey(),
  createdAt: date({ mode: "string" }).notNull().defaultNow(),
  description: text(),
});

export type JournalEntryInsert = typeof journal.$inferInsert;
export type JournalEntrySelect = typeof journal.$inferSelect;

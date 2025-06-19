import { date, pgTable, serial, text } from "drizzle-orm/pg-core";

export const journal = pgTable("journal", {
  id: serial().primaryKey(),
  createdAt: date({ mode: "string" }).notNull().defaultNow(),
  description: text().notNull(),
  category: text(),
  attachments: text(),
});

export type JournalEntryInsert = typeof journal.$inferInsert;
export type JournalEntrySelect = typeof journal.$inferSelect;

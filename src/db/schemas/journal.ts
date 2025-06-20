import { date, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";

export const journal = pgTable("journal", {
  id: uuid().defaultRandom().primaryKey(),
  entryNo: serial(),
  createdAt: date({ mode: "string" }).notNull().defaultNow(),
  description: text().notNull(),
  category: text(),
  attachments: text(),
});

export type JournalEntryInsert = typeof journal.$inferInsert;
export type JournalEntrySelect = typeof journal.$inferSelect;

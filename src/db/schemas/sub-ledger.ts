import { numeric, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { journal } from "./journal.ts";

export const subLedger = pgTable("sub_ledger", {
  id: uuid().defaultRandom().primaryKey(),
  code: text().notNull(),
  name: text().notNull(),
  debit: numeric({ scale: 2 }).notNull(),
  credit: numeric({ scale: 2 }).notNull(),
  journalEntry: serial()
    .notNull()
    .references(() => journal.id, { onDelete: "cascade" }),
});

export type SubLedgerEntryInsert = typeof subLedger.$inferInsert;
export type SubLedgerEntrySelect = typeof subLedger.$inferSelect;

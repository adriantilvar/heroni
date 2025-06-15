import { numeric, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { journal } from "./journal.ts";

export const subLedger = pgTable("sub_ledger", {
  id: uuid().defaultRandom().primaryKey(),
  code: text(),
  name: text(),
  debit: numeric({ scale: 2 }),
  credit: numeric({ scale: 2 }),
  journalEntry: serial()
    .notNull()
    .references(() => journal.id),
});

export type SubLedgerEntryInsert = typeof subLedger.$inferInsert;
export type SubLedgerEntrySelect = typeof subLedger.$inferSelect;

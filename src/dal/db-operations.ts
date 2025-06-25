import { eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import {
  type JournalEntryInsert,
  type JournalEntrySelect,
  journal,
} from "@/db/schemas/journal";
import {
  type SubLedgerEntryInsert,
  type SubLedgerEntrySelect,
  subLedger,
} from "@/db/schemas/sub-ledger";
import type { Prettify, QueryError } from "@/lib/types";
import { safeTry } from "@/lib/utils";

export type JournalInsertion = Prettify<{
  info: JournalEntryInsert;
  accounts: Omit<SubLedgerEntryInsert, "journalEntry">[];
}>;

export const insertIntoJournal = async ({ info, accounts }: JournalInsertion) =>
  safeTry<void, QueryError>(
    db.transaction(async (tx) => {
      const { journalEntry } = await tx
        .insert(journal)
        .values(info)
        .returning({ journalEntry: journal.id })
        .then((collection) => collection[0]);

      if (!journalEntry) tx.rollback();

      const { subLedgerEntry } = await tx
        .insert(subLedger)
        .values(accounts.map((account) => ({ ...account, journalEntry })))
        .returning({ subLedgerEntry: subLedger.id })
        .then((collection) => collection[0]);

      if (!subLedgerEntry) tx.rollback();
    })
  );

export const selectJournal = async () =>
  safeTry<JournalEntrySelect[], QueryError>(db.select().from(journal));

export const selectSubLedgerEntries = async () =>
  safeTry<SubLedgerEntrySelect[], QueryError>(db.select().from(subLedger));

export type DetailedSubLedgerEntry = Prettify<
  SubLedgerEntrySelect & {
    journalDescription: string;
  }
>;

export const selectSubLedgerEntriesByCode = async (code: string) =>
  safeTry<DetailedSubLedgerEntry[], QueryError>(
    db
      .select({
        ...getTableColumns(subLedger),
        journalDescription: journal.description,
      })
      .from(subLedger)
      .where(eq(subLedger.code, code))
      .innerJoin(journal, eq(subLedger.journalEntry, journal.id))
  );

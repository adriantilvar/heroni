import { eq } from "drizzle-orm";
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
import { type Prettify, type QueryError, safeTry } from "@/lib/utils";

export type JournalInsertion = Prettify<{
  info: JournalEntryInsert;
  accounts: SubLedgerEntryInsert[];
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

      await tx
        .insert(subLedger)
        .values(accounts.map((account) => ({ ...account, journalEntry })));
    })
  );

export const selectJournal = async () =>
  safeTry<JournalEntrySelect[], QueryError>(db.select().from(journal));

export const selectSubLedger = async (code: string) =>
  safeTry<SubLedgerEntrySelect[], QueryError>(
    db.select().from(subLedger).where(eq(subLedger.code, code))
  );

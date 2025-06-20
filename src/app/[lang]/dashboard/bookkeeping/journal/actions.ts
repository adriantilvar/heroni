"use server";

import {
  insertIntoJournal,
  type JournalInsertion,
  selectJournal,
} from "@/dal/db-operations";
import type { Prettify } from "@/lib/types";
import { unpackQueryError } from "@/lib/utils";

export const insertJournalEntry = async (data: Prettify<JournalInsertion>) => {
  const [error] = await insertIntoJournal(data);

  if (error) {
    console.error(unpackQueryError(error));

    return {
      success: false,
    };
  }

  return { success: true };
};

export const getJournalEntries = async () => {
  const [error, data] = await selectJournal();

  if (error) {
    console.error(error);

    return {
      success: false,
    } as const;
  }

  return { success: true, data } as const;
};

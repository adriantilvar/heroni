"use server";

import { type JournalInsertion, insertIntoJournal } from "@/dal/db-operations";
import { type Prettify, unpackQueryError } from "@/lib/utils";

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

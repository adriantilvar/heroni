"use server";
import { selectSubLedgerEntries } from "@/dal/db-operations";

export const getAccounts = async () => {
  const [error, data] = await selectSubLedgerEntries();

  if (error) {
    console.error(error);

    throw error;
  }

  return data;
};

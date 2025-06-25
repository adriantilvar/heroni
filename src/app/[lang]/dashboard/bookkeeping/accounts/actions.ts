"use server";
import { selectSubLedgerEntriesByCode } from "@/dal/db-operations";

export const getAccountTransactions = async (code: string) => {
  const [error, data] = await selectSubLedgerEntriesByCode(code);

  if (error) {
    console.error(error);

    throw error;
  }

  return data;
};

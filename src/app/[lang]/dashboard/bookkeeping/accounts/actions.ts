"use server";
import { selectSubLedger } from "@/dal/db-operations";

export const getAccountTransactions = async (code: string) => {
  const [error, data] = await selectSubLedger(code);

  if (error) {
    console.error(error);

    throw error;
  }

  return data;
};

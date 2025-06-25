import type { SubLedgerEntrySelect } from "@/db/schemas/sub-ledger";

export const getWorkingBalance = (accounts: SubLedgerEntrySelect[]) => {
  const groupedAccounts = Object.groupBy(accounts, ({ code }) => code);

  let workingBalanceCheck = 0;
  const workingBalance = Object.entries(groupedAccounts).map(
    ([key, entries]) => {
      if (!entries || !entries.length)
        throw new Error("Groups with empty entries are not allowed");

      const balance = entries.reduce((previous, current) => {
        const debit = Number(current.debit);
        const credit = Number(current.credit);

        return debit > 0
          ? previous + debit
          : credit > 0
            ? previous - credit
            : previous;
      }, 0);

      workingBalanceCheck += balance;

      return { code: key, name: entries[0].name, balance };
    }
  );

  return [workingBalance, workingBalanceCheck] as const;
};

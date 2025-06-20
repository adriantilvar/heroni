import { drizzle } from "drizzle-orm/postgres-js";
import type { QueryError } from "@/lib/types.ts";
import { journal } from "../db/schemas/journal.ts";
import { subLedger } from "../db/schemas/sub-ledger.ts";
import serverEnv from "../env/server.ts";
import { safeTry } from "../lib/utils.ts";

const DUMMY_ENTRIES = [
  {
    info: {
      createdAt: "2024-01-02T10:30:00Z",
      description: "Initial cash investment by owner",
    },
    accounts: [
      { code: "4010", name: "Bank", debit: "100000.00", credit: "0.00" },
      {
        code: "5080",
        name: "Private contributions",
        debit: "0.00",
        credit: "100000.00",
      },
    ],
  },
  {
    info: {
      createdAt: "2024-01-03T14:15:00Z",
      description: "Sale of goods to Danish customer with VAT",
    },
    accounts: [
      { code: "4010", name: "Bank", debit: "12500.00", credit: "0.00" },
      {
        code: "1000",
        name: "Sales of goods/services including VAT",
        debit: "0.00",
        credit: "10000.00",
      },
      { code: "8000", name: "Sales VAT", debit: "0.00", credit: "2500.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-01-05T09:45:00Z",
      description: "Purchase of inventory from supplier with VAT",
    },
    accounts: [
      {
        code: "1100",
        name: "Purchases of goods including VAT",
        debit: "6000.00",
        credit: "0.00",
      },
      { code: "8010", name: "Purchase VAT", debit: "1500.00", credit: "0.00" },
      {
        code: "7010",
        name: "Trade payables",
        debit: "0.00",
        credit: "7500.00",
      },
    ],
  },
  {
    info: {
      createdAt: "2024-01-08T11:20:00Z",
      description: "Monthly salary payment to employee",
    },
    accounts: [
      {
        code: "1200",
        name: "Wages and holiday pay",
        debit: "35000.00",
        credit: "0.00",
      },
      { code: "1202", name: "ATP", debit: "270.00", credit: "0.00" },
      { code: "1203", name: "Pensions", debit: "3500.00", credit: "0.00" },
      { code: "4010", name: "Bank", debit: "0.00", credit: "38770.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-01-10T16:30:00Z",
      description: "Office rent payment for January",
    },
    accounts: [
      {
        code: "1600",
        name: "Rent (excluding utilities)",
        debit: "8000.00",
        credit: "0.00",
      },
      { code: "8010", name: "Purchase VAT", debit: "2000.00", credit: "0.00" },
      { code: "4010", name: "Bank", debit: "0.00", credit: "10000.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-01-12T13:45:00Z",
      description: "Purchase of office computer equipment",
    },
    accounts: [
      {
        code: "3010",
        name: "Purchases during the year",
        debit: "15000.00",
        credit: "0.00",
      },
      { code: "8010", name: "Purchase VAT", debit: "3750.00", credit: "0.00" },
      { code: "4010", name: "Bank", debit: "0.00", credit: "18750.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-01-15T10:15:00Z",
      description: "Export sale to Germany (EU)",
    },
    accounts: [
      {
        code: "4030",
        name: "Accounts receivable",
        debit: "8000.00",
        credit: "0.00",
      },
      {
        code: "1010",
        name: "Sales of goods within the EU",
        debit: "0.00",
        credit: "8000.00",
      },
    ],
  },
  {
    info: {
      createdAt: "2024-01-18T14:20:00Z",
      description: "Fuel purchase for company vehicle",
    },
    accounts: [
      { code: "1400", name: "Fuel", debit: "800.00", credit: "0.00" },
      { code: "8010", name: "Purchase VAT", debit: "200.00", credit: "0.00" },
      { code: "4000", name: "Cash", debit: "0.00", credit: "1000.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-01-20T11:30:00Z",
      description: "Electricity bill payment",
    },
    accounts: [
      {
        code: "1610",
        name: "Utilities (electricity, water, gas, heating, etc.)",
        debit: "1200.00",
        credit: "0.00",
      },
      { code: "8010", name: "Purchase VAT", debit: "300.00", credit: "0.00" },
      {
        code: "8040",
        name: "Electricity tax",
        debit: "150.00",
        credit: "0.00",
      },
      { code: "4010", name: "Bank", debit: "0.00", credit: "1650.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-01-22T15:45:00Z",
      description: "Payment to supplier for previous purchase",
    },
    accounts: [
      {
        code: "7010",
        name: "Trade payables",
        debit: "7500.00",
        credit: "0.00",
      },
      { code: "4010", name: "Bank", debit: "0.00", credit: "7500.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-01-25T09:00:00Z",
      description: "Business insurance premium payment",
    },
    accounts: [
      { code: "1735", name: "Insurance", debit: "2400.00", credit: "0.00" },
      { code: "8010", name: "Purchase VAT", debit: "600.00", credit: "0.00" },
      { code: "4010", name: "Bank", debit: "0.00", credit: "3000.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-01-28T12:15:00Z",
      description: "Customer payment received",
    },
    accounts: [
      { code: "4010", name: "Bank", debit: "8000.00", credit: "0.00" },
      {
        code: "4030",
        name: "Accounts receivable",
        debit: "0.00",
        credit: "8000.00",
      },
    ],
  },
  {
    info: {
      createdAt: "2024-01-30T16:00:00Z",
      description: "Purchase of services from EU supplier (reverse charge)",
    },
    accounts: [
      {
        code: "1120",
        name: "Purchases of services within the EU",
        debit: "5000.00",
        credit: "0.00",
      },
      {
        code: "8030",
        name: "VAT on service purchases abroad under reverse charge",
        debit: "1250.00",
        credit: "0.00",
      },
      { code: "8010", name: "Purchase VAT", debit: "0.00", credit: "1250.00" },
      {
        code: "7010",
        name: "Trade payables",
        debit: "0.00",
        credit: "5000.00",
      },
    ],
  },
  {
    info: {
      createdAt: "2024-02-01T10:30:00Z",
      description: "Bank interest income received",
    },
    accounts: [
      { code: "4010", name: "Bank", debit: "150.00", credit: "0.00" },
      {
        code: "2400",
        name: "Bank interest income",
        debit: "0.00",
        credit: "150.00",
      },
    ],
  },
  {
    info: {
      createdAt: "2024-02-03T14:45:00Z",
      description: "Advertising expense payment",
    },
    accounts: [
      { code: "1310", name: "Advertising", debit: "3000.00", credit: "0.00" },
      { code: "8010", name: "Purchase VAT", debit: "750.00", credit: "0.00" },
      { code: "4010", name: "Bank", debit: "0.00", credit: "3750.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-02-05T11:20:00Z",
      description: "Professional fees to accountant",
    },
    accounts: [
      {
        code: "1725",
        name: "Professional fees",
        debit: "2500.00",
        credit: "0.00",
      },
      { code: "8010", name: "Purchase VAT", debit: "625.00", credit: "0.00" },
      { code: "4010", name: "Bank", debit: "0.00", credit: "3125.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-02-08T13:30:00Z",
      description: "Owner withdrawal for personal use",
    },
    accounts: [
      {
        code: "5020",
        name: "Owner withdrawals",
        debit: "10000.00",
        credit: "0.00",
      },
      { code: "4010", name: "Bank", debit: "0.00", credit: "10000.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-02-10T15:15:00Z",
      description: "Vehicle maintenance and repairs",
    },
    accounts: [
      { code: "1420", name: "Maintenance", debit: "1800.00", credit: "0.00" },
      { code: "8010", name: "Purchase VAT", debit: "450.00", credit: "0.00" },
      { code: "4010", name: "Bank", debit: "0.00", credit: "2250.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-02-12T09:45:00Z",
      description: "Telephone and internet services",
    },
    accounts: [
      {
        code: "1705",
        name: "Telephone and internet",
        debit: "800.00",
        credit: "0.00",
      },
      { code: "8010", name: "Purchase VAT", debit: "200.00", credit: "0.00" },
      { code: "4010", name: "Bank", debit: "0.00", credit: "1000.00" },
    ],
  },
  {
    info: {
      createdAt: "2024-02-15T16:20:00Z",
      description: "Sale of services to Norwegian customer",
    },
    accounts: [
      {
        code: "4030",
        name: "Accounts receivable",
        debit: "15000.00",
        credit: "0.00",
      },
      {
        code: "1025",
        name: "Sales of services to countries outside the EU",
        debit: "0.00",
        credit: "15000.00",
      },
    ],
  },
  {
    info: {
      createdAt: "2024-02-18T12:00:00Z",
      description: "Monthly depreciation of fixed assets",
    },
    accounts: [
      {
        code: "2000",
        name: "Depreciation of fixed assets (100% business use)",
        debit: "1250.00",
        credit: "0.00",
      },
      {
        code: "3030",
        name: "Depreciation for the year",
        debit: "0.00",
        credit: "1250.00",
      },
    ],
  },
];

function addSpinner(message: string) {
  const symbols = ["⠏", "⠼", "⠧"];
  let i = 0;

  if (i > 2) i = 0;

  return `${symbols[i]} ${message}`;
}

(async () => {
  const db = drizzle(serverEnv.DATABASE_URL, { casing: "snake_case" });

  let i = 1;
  for await (const entry of DUMMY_ENTRIES) {
    const [error] = await safeTry<void, QueryError>(
      db.transaction(async (tx) => {
        const { journalEntry } = await tx
          .insert(journal)
          .values(entry.info)
          .returning({ journalEntry: journal.id })
          .then((collection) => collection[0]);

        if (!journalEntry) tx.rollback();

        const { subLedgerEntry } = await tx
          .insert(subLedger)
          .values(
            entry.accounts.map((account) => ({ ...account, journalEntry }))
          )
          .returning({ subLedgerEntry: subLedger.id })
          .then((collection) => collection[0]);

        if (!subLedgerEntry) tx.rollback();
      })
    );

    if (error) {
      console.error(`🚫 Error: ${error.cause.message}`);
      console.error(`Query: ${error.query}`);
      console.error(`Params: ${error.params}`);

      process.exit(1);
    }
    const symbols = ["⠏", "⠼", "⠧"];

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `${symbols[i % 3]} Seeding journal entries: ${i}/${DUMMY_ENTRIES.length} inserted`
    );
    i++;
  }
  console.log("\n✅ Finished seeding");
  process.exit();
})();

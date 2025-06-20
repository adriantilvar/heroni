"use client";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { SubLedgerEntrySelect } from "@/db/schemas/sub-ledger";
import type { Account } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";
import { getAccountTransactions } from "./actions.ts";

// TODO: Remove dummy data
// const entries = [
//   { description: "Opening balance", debit: "0", credit: "0" },
//   { description: "Aroundblu consulting invoice", debit: "580", credit: "0" },
//   { description: "Office rent payment", debit: "0", credit: "1200" },
//   { description: "Client payment received", debit: "2500", credit: "0" },
//   { description: "Equipment purchase", debit: "0", credit: "450" },
//   { description: "Software subscription", debit: "0", credit: "99" },
//   { description: "Freelance work payment", debit: "1800", credit: "0" },
//   { description: "Marketing expenses", debit: "0", credit: "320" },
//   { description: "Sales commission", debit: "750", credit: "0" },
//   { description: "Utility bills", debit: "0", credit: "180" },
//   { description: "Bank interest earned", debit: "25", credit: "0" },
//   { description: "Insurance premium", debit: "0", credit: "280" },
//   { description: "Advertising campaign", debit: "0", credit: "650" },
//   { description: "Product sales", debit: "3200", credit: "0" },
//   { description: "Travel expenses", debit: "0", credit: "420" },
//   { description: "Professional services", debit: "0", credit: "890" },
//   { description: "Inventory purchase", debit: "0", credit: "1500" },
//   { description: "Customer refund", debit: "0", credit: "150" },
//   { description: "Service revenue", debit: "2100", credit: "0" },
//   { description: "Office supplies", debit: "0", credit: "85" },
//   { description: "Telephone expenses", debit: "0", credit: "120" },
//   { description: "Website maintenance", debit: "0", credit: "200" },
//   { description: "Consulting fees earned", debit: "1200", credit: "0" },
//   { description: "Loan payment", debit: "0", credit: "500" },
//   { description: "Equipment lease", debit: "0", credit: "350" },
//   { description: "Training workshop", debit: "0", credit: "400" },
//   { description: "License fees", debit: "0", credit: "150" },
//   { description: "Contract payment", debit: "4500", credit: "0" },
//   { description: "Maintenance costs", debit: "0", credit: "220" },
//   { description: "Legal fees", debit: "0", credit: "600" },
//   { description: "Shipping charges", debit: "0", credit: "95" },
//   { description: "Partnership income", debit: "1800", credit: "0" },
//   { description: "Cloud storage", debit: "0", credit: "45" },
//   { description: "Domain renewal", debit: "0", credit: "35" },
//   { description: "Accounting software", debit: "0", credit: "75" },
//   { description: "Milestone payment", debit: "3000", credit: "0" },
//   { description: "Fuel expenses", debit: "0", credit: "160" },
//   { description: "Parking fees", debit: "0", credit: "40" },
//   { description: "Conference registration", debit: "0", credit: "300" },
//   { description: "Book sales", debit: "480", credit: "0" },
//   { description: "Membership fees", debit: "0", credit: "120" },
//   { description: "Printing costs", debit: "0", credit: "65" },
//   { description: "Security deposit", debit: "0", credit: "800" },
//   { description: "Royalty income", debit: "650", credit: "0" },
//   { description: "Postage and courier", debit: "0", credit: "55" },
//   { description: "Research expenses", debit: "0", credit: "380" },
//   { description: "Investment returns", debit: "920", credit: "0" },
//   { description: "Cleaning services", debit: "0", credit: "140" },
//   { description: "Database subscription", debit: "0", credit: "180" },
//   { description: "Licensing revenue", debit: "2200", credit: "0" },
//   { description: "Repair and maintenance", debit: "0", credit: "290" },
//   { description: "Social media ads", debit: "0", credit: "240" },
//   { description: "Workshop income", debit: "1500", credit: "0" },
//   { description: "Office furniture", debit: "0", credit: "720" },
//   { description: "Internet service", debit: "0", credit: "80" },
//   { description: "Commission earned", debit: "340", credit: "0" },
//   { description: "Catering expenses", debit: "0", credit: "125" },
// ] satisfies AccountEntry[];

const splitEntries = (entries: SubLedgerEntrySelect[]) => {
  const debits = [];
  const credits = [];
  let debitsValue = 0;
  let creditsValue = 0;

  for (const entry of entries) {
    const debitValue = Number(entry.debit);
    const creditValue = Number(entry.credit);

    if (debitValue !== 0) {
      debits.push(entry);
      debitsValue += debitValue;
    }

    if (creditValue !== 0) {
      credits.push(entry);
      creditsValue += creditValue;
    }
  }

  return {
    debits,
    credits,
    debitsValue,
    creditsValue,
  };
};

export default function AccountView({
  account,
  isOpen,
  setIsOpen,
}: {
  account: Account;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { isPending, data } = useQuery({
    queryKey: [`account-${account.code}-view`],
    queryFn: async () => await getAccountTransactions(account.code),
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerContent className="pt-2 pb-12">
        <DrawerHeader>
          <div className="inline-flex gap-x-2">
            <Badge variant="secondary">{account.type}</Badge>
            <Badge variant="secondary">{account.category}</Badge>
          </div>

          <DrawerTitle className="space-x-2 text-lg">
            <span className="tabular-nums">{account.code}</span>
            <span className="tracking-wide">{account.name}</span>
          </DrawerTitle>

          <DrawerDescription>{account.description}</DrawerDescription>
        </DrawerHeader>

        {isPending && (
          <div className="flex flex-1 items-center justify-center px-4 xl:w-lg">
            <Loader className="animate-spin" />
          </div>
        )}

        {data && data.length > 0 && <AccountContent {...splitEntries(data)} />}

        {data && !data.length && (
          <div className="mt-44 flex flex-1 justify-center px-4 xl:w-lg">
            <div className="flex flex-col items-center gap-1 text-center text-foreground xl:w-60">
              <BookOpen />
              <span>No entries yet</span>
              <span className="text-muted-foreground">
                Transactions affecting this account will show up here
                automatically.
              </span>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

const AccountContent = ({
  debits,
  credits,
  debitsValue,
  creditsValue,
}: ReturnType<typeof splitEntries>) => {
  const closingBalance = debitsValue - creditsValue;

  return (
    <div className="flex flex-1 justify-center overflow-hidden p-4 font-mono">
      <div className="grid grid-cols-2 grid-rows-12 xl:w-4xl">
        <Window
          title="Debit"
          className="row-span-11 border"
          type="debit"
          entries={debits}
        />

        <Window
          title="Credit"
          className="-ml-px row-span-11 border"
          type="credit"
          entries={credits}
        />

        <div className="-mt-px row-span-1 border px-3">
          {closingBalance >= 0 && (
            <ClosingBox
              label="Closing balance"
              isPositive
              closingBalance={closingBalance}
            />
          )}
        </div>
        <div className="-ml-px -mt-px row-span-1 border px-3">
          {closingBalance < 0 && (
            <ClosingBox
              label="Closing balance"
              closingBalance={closingBalance}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Window = ({
  title,
  type,
  entries,
  className,
}: {
  title: string;
  type: "debit" | "credit";
  entries: SubLedgerEntrySelect[];
  className?: string;
}) => (
  <div className={cn("overflow-y-scroll px-4 py-2", className)}>
    <h2 className="text-zinc-500/80">{title}</h2>

    <div className="space-y-1 pt-1">
      {entries.map((entry) => (
        <div key={entry.name} className="flex justify-between">
          <span>{entry.name}</span>
          <span>{entry[type]}</span>
        </div>
      ))}
    </div>
  </div>
);

const ClosingBox = ({
  label,
  isPositive = false,
  closingBalance,
  className,
}: {
  label: string;
  isPositive?: boolean;
  closingBalance: number;
  className?: string;
}) => (
  <div className={cn("flex h-full items-center justify-between", className)}>
    <span>{label} </span>
    <span
      className={cn({
        "text-green-600": isPositive,
        "text-red-600": !isPositive,
      })}
    >
      {closingBalance}
    </span>
  </div>
);

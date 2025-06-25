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
import type { DetailedSubLedgerEntry } from "@/dal/db-operations.ts";
import type { Account } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";
import { getAccountTransactions } from "./actions.ts";

const splitEntries = (entries: DetailedSubLedgerEntry[]) => {
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
            <Badge variant="secondary">{account.category}</Badge>
            <Badge variant="secondary">{account.type}</Badge>
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
      <div className="grid grid-cols-2 grid-rows-12 xl:w-5xl">
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
  entries: DetailedSubLedgerEntry[];
  className?: string;
}) => (
  <div className={cn("overflow-y-scroll px-4 py-2", className)}>
    <h2 className="text-zinc-500/80">{title}</h2>

    <div className="space-y-1 pt-1">
      {entries.map((entry) => (
        <div key={entry.id} className="flex justify-between">
          <span className="max-w-sm">{entry.journalDescription}</span>
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
      {Math.abs(closingBalance)}
    </span>
  </div>
);

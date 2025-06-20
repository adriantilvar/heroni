"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Account } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils.ts";
import AccountView from "./account-view.tsx";

export function AccountsTable({
  className,
  accounts,
}: {
  className?: string;
  accounts: Account[];
}) {
  const [isShowingAccount, setIsShowingAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();

  const accountRowHandler = (account: Account) => {
    if (document.getSelection()?.type === "Range") return;

    setSelectedAccount(account);
    setIsShowingAccount(true);
  };

  return (
    <>
      <Table
        className={cn(
          "relative mb-4 border-separate border-spacing-0 overflow-scroll pr-4",
          className
        )}
      >
        <TableHeader className="sticky top-0 bg-red-100">
          <TableRow className="bg-zinc-100 *:font-semibold hover:bg-zinc-100">
            <TableHead className="pl-4">Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {accounts.map((account) => (
            <TableRow
              key={account.code}
              onClick={() => accountRowHandler(account)}
            >
              <TableCell className="pl-4 font-semibold">
                {account.code}
              </TableCell>
              <TableCell>{account.name}</TableCell>
              <TableCell>{account.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAccount && (
        <AccountView
          isOpen={isShowingAccount}
          setIsOpen={setIsShowingAccount}
          account={selectedAccount}
        />
      )}
    </>
  );
}

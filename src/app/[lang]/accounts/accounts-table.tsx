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
import AccountView from "./account-view.tsx";

export function AccountsTable({ accounts }: { accounts: Account[] }) {
  const [isShowingAccount, setIsShowingAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();

  const accountRowHandler = (account: Account) => {
    if (document.getSelection()?.type === "Range") return;

    setSelectedAccount(account);
    setIsShowingAccount(true);
  };

  return (
    <>
      <Table className="mt-4 border">
        <TableHeader>
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
              className="relative"
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

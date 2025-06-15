import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";

import { Input } from "@/components/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { getDictionary } from "@/i18n/get-dictionary";
import { Download, Ellipsis, ListFilter } from "lucide-react";
import JournalEntry from "./journal-entry.tsx";

// These should be retrieved from the database
type Transaction = {
  id: number;
  date: string; // type it more precisely
  description: string;
  category: string;
  attachments: File[];
};

const transactions = [
  {
    id: 1,
    date: "26.05.2025",
    description: "Aroundblu consulting invoice",
    category: "Invoices",
    attachments: [],
  },
  {
    id: 2,
    date: "26.05.2025",
    description: "Revolut monthly account fee",
    category: "Payments",
    attachments: [],
  },
] satisfies Transaction[];

export default async function JournalPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const { chartOfAccounts } = await getDictionary(lang);
  const accounts = chartOfAccounts.incomeStatement.accounts.concat(
    chartOfAccounts.balanceSheet.accounts
  );

  return (
    <main className="flex h-full flex-col items-center py-24 font-mono">
      <div className="flex flex-col items-end xl:w-6xl">
        <div className="flex w-full justify-between">
          <div className="inline-flex items-center gap-x-2">
            <Input
              type="search"
              placeholder="Search"
              className="w-64 rounded-none"
            />

            <Button variant="outline" className="rounded-none">
              <ListFilter />
            </Button>
          </div>

          <div className="inline-flex items-center gap-x-2">
            <Button variant="outline" className="rounded-none">
              <Download />
              Export
            </Button>

            <JournalEntry accounts={accounts} />
          </div>
        </div>

        <Table className="mt-4 border">
          <TableHeader>
            <TableRow className="bg-zinc-100 *:font-semibold hover:bg-zinc-100">
              <TableHead className="pl-4">#</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Attachements</TableHead>
              <TableHead className="w-20">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="pl-4">{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{transaction.category}</Badge>
                </TableCell>
                <TableCell>{transaction.attachments}</TableCell>
                <TableCell className="flex justify-center">
                  <Button variant="ghost" size="icon" className="rounded-none">
                    <Ellipsis />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

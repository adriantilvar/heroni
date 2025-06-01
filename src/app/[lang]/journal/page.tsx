"use client"; //TODO: move to server component
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Download, Ellipsis, ListFilter, Plus } from "lucide-react";
import { useState } from "react";
import JournalEntryForm, { type JournalEntry } from "./entry-form.tsx";

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

export default function JournalPage() {
  const [formVisible, setFormVisible] = useState(false);

  const addTransaction = ({ date, description }: JournalEntry) => {
    transactions.push({
      id: transactions.length + 1,
      date: date.toLocaleString("da-DK", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      description,
      category: "Miscellaneous",
      attachments: [],
    });

    setFormVisible(false);
  };

  return (
    <main className="mt-32 flex h-full flex-col items-center font-mono">
      <div className="flex flex-col items-end xl:w-5xl">
        <div className="w-full space-y-1">
          <h2 className="font-semibold">Journal Entry</h2>
          <p>A journal entry (JE) is a record of a financial transaction.</p>
        </div>

        <div className="mt-6 flex w-full justify-between">
          <div className="inline-flex items-center gap-x-2">
            <Input
              type="search"
              placeholder="Search"
              className="w-full max-w-md rounded-none"
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

            <Dialog open={formVisible} onOpenChange={setFormVisible}>
              <DialogTrigger asChild>
                <Button className="rounded-none">
                  <Plus />
                </Button>
              </DialogTrigger>

              <DialogContent className="rounded-none xl:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Journal Entry</DialogTitle>
                  <DialogDescription className="sr-only">
                    Form for entering transaction into the journal
                  </DialogDescription>
                </DialogHeader>

                <JournalEntryForm
                  className="lg:max-w-2xl"
                  submitHandler={addTransaction}
                />
              </DialogContent>
            </Dialog>
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

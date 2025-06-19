"use client";
import { Ellipsis } from "lucide-react";
import { use } from "react";
import { Temporal } from "temporal-polyfill";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import type { JournalEntrySelect } from "@/db/schemas/journal";
import { cn } from "@/lib/utils";
import { OptimisticContext } from "./context.tsx";

export default function JournalTable({
  className,
  entries,
}: {
  className?: string;
  entries: JournalEntrySelect[];
}) {
  const { isPending } = use(OptimisticContext);

  if (!entries.length && !isPending)
    return (
      <div className="flex h-full items-center justify-center ">
        <div className="flex flex-col gap-1 text-center text-foreground xl:max-w-xs">
          <h2>No entries</h2>
          <p className="text-muted-foreground">
            You haven't entered anything into the journal yet.
          </p>
        </div>
      </div>
    );

  return (
    <Table className={cn("border", className)}>
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
        {entries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="pl-4">{entry.id}</TableCell>
            <TableCell>
              {Temporal.PlainDate.from(entry.createdAt).toLocaleString(
                "da-DK",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )}
            </TableCell>
            <TableCell>{entry.description}</TableCell>
            <TableCell>
              {entry.category ? (
                <Badge variant="secondary">{entry.category}</Badge>
              ) : (
                <span>-</span>
              )}
            </TableCell>
            <TableCell>{entry.attachments}</TableCell>
            <TableCell className="flex justify-center">
              <Button variant="ghost" size="icon" className="rounded-none">
                <Ellipsis />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {isPending && (
          <TableRow>
            <TableCell>
              <div className="h-4 w-[2ch] animate-pulse rounded-lg bg-accent pl-4" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-[10ch] animate-pulse rounded-lg bg-accent" />
            </TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

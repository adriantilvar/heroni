import { Download, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { getDictionary } from "@/i18n/get-dictionary";
import { getJournalEntries } from "./actions.ts";
import { OptimisticProvider } from "./context.tsx";
import JournalEntry from "./journal-entry.tsx";
import JournalTable from "./journal-table.tsx";

export default async function JournalPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const journalQuery = await getJournalEntries();

  if (!journalQuery.success) {
    return (
      <main className="flex h-full flex-col items-center py-54 font-mono">
        <div className="flex flex-col gap-1 text-center text-foreground xl:max-w-xs">
          <h2 className="font-semibold">Something went wrong</h2>
          <p>
            We couldn't retrieve your journal. Try refreshing the page, and if
            the problem persists, contact support.
          </p>
        </div>
      </main>
    );
  }

  const accounts = await getDictionary(lang).then(({ chartOfAccounts }) =>
    chartOfAccounts.incomeStatement.accounts.concat(
      chartOfAccounts.balanceSheet.accounts
    )
  );

  return (
    <main className="flex h-full flex-col items-center py-24 font-mono">
      <OptimisticProvider>
        <div className="flex h-full flex-col xl:w-6xl">
          <div className="flex justify-between">
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

          <JournalTable className="mt-4 flex-1" entries={journalQuery.data} />
        </div>
      </OptimisticProvider>
    </main>
  );
}

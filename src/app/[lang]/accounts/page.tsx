import { Input } from "@/components/ui/input.tsx";
import { getDictionary } from "@/i18n/get-dictionary";
import { AccountsTable } from "./accounts-table.tsx";

export default async function AccountsPage({
  params,
}: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { chartOfAccounts } = await getDictionary(lang);

  const allAccounts = chartOfAccounts.incomeStatement.accounts.concat(
    chartOfAccounts.balanceSheet.accounts
  );

  return (
    <main className="flex h-full justify-center overflow-scroll py-24 font-mono">
      <div className="flex h-fit flex-col items-start xl:w-6xl">
        <div className="w-full">
          <Input
            type="search"
            placeholder="Search"
            className="w-64 rounded-none"
          />

          <AccountsTable accounts={allAccounts} />
        </div>
      </div>
    </main>
  );
}

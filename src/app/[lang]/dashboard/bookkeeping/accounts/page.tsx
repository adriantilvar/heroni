import { Input } from "@/components/ui/input.tsx";
import { getDictionary } from "@/i18n/get-dictionary";
import { AccountsTable } from "./accounts-table.tsx";

export default async function AccountsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const accounts = await getDictionary(lang).then(({ chartOfAccounts }) =>
    chartOfAccounts.incomeStatement.accounts.concat(
      chartOfAccounts.balanceSheet.accounts
    )
  );

  return (
    <div className="flex w-full flex-col gap-4 overflow-hidden pr-4">
      <div>
        <Input
          type="search"
          placeholder="Search"
          className="w-64 rounded-none"
        />
      </div>

      <AccountsTable className="mb-4 flex-1" accounts={accounts} />
    </div>
  );
}

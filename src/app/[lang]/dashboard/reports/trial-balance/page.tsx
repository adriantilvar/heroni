import { TriangleAlert } from "lucide-react";
import { Temporal } from "temporal-polyfill";
import { Separator } from "@/components/ui/separator";
import { getWorkingBalance } from "@/lib/report-helpers.ts";
import { cn, getCurrencyFormatter } from "@/lib/utils";
import { getAccounts } from "./actions.ts";

const currentDate = Temporal.Now.instant()
  .toLocaleString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  .toUpperCase()
  .replace(/(\w+) (\d+), (\d+)/, "$2 $1, $3");

const currencyFormatter = getCurrencyFormatter();

/* TODO: Add popover context to balance check fail warning
 *
 * Title: Your accounts don't balance
 * Description:
 * The trial balance doesn’t add up because total debits and credits
 * aren’t equal.
 */
export default async function TrialBalancePage() {
  const accounts = await getAccounts();
  const [workingBalance, workingBalanceCheck] = getWorkingBalance(accounts);

  const trialBalance = workingBalance.map((account) => ({
    code: account.code,
    name: account.name,
    debit: account.balance > 0 ? account.balance : 0,
    credit: account.balance < 0 ? Math.abs(account.balance) : 0,
  }));

  const [closingDebit, closingCredit] = trialBalance.reduce(
    (prev, curr) => [prev[0] + curr.debit, prev[1] + curr.credit] as const,
    [0, 0]
  );

  return (
    <div className="xl:w-4xl">
      <div className="flex flex-col justify-center text-center text-lg">
        <h1 className="font-semibold">Trial Balance</h1>
        <h2>for the period ended {currentDate}</h2>
      </div>

      <div className="relative mt-12 h-full overflow-scroll px-6 pb-32">
        <div className="sticky top-0 grid grid-cols-7 border-b bg-background pb-1 font-medium">
          <span className="pl-2">Account</span>
          <span className="col-span-4">Name</span>
          <span className="justify-self-end">Debit</span>
          <span className="justify-self-end pr-2">Credit</span>
        </div>

        <div className="overflow-hidden">
          {trialBalance.map((account) => (
            <div
              key={account.code}
              className="grid h-9 w-full grid-cols-7 items-center even:bg-accent"
            >
              <span className="pl-2">{account.code}</span>
              <span className="col-span-4">{account.name}</span>
              <span className="justify-self-end">
                {currencyFormatter.format(account.debit)}
              </span>
              <span className="justify-self-end pr-2">
                {currencyFormatter.format(account.credit)}
              </span>
            </div>
          ))}
        </div>

        <Separator className="mb-1 flex flex-col gap-y-0.5" />

        <div
          className={cn("grid grid-cols-7 font-medium", {
            "bg-amber-100 py-1 text-amber-900": workingBalanceCheck !== 0,
          })}
        >
          <span className="col-span-5 inline-flex items-center gap-x-1 pl-2">
            {workingBalanceCheck !== 0 && <TriangleAlert className="size-4" />}
            Total
          </span>
          <span className="justify-self-end">
            {currencyFormatter.format(closingDebit)}
          </span>
          <span className="justify-self-end pr-2">
            {currencyFormatter.format(closingCredit)}
          </span>
        </div>
      </div>
    </div>
  );
}

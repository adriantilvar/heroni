import { db } from "@/db";
import { subLedger } from "@/db/schemas";

export default async function TrialBalancePage() {
  const accounts = await db.select().from(subLedger);

  return (
    <div>
      <h2>Transactions:</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>{account.name}</li>
        ))}
      </ul>
    </div>
  );
}

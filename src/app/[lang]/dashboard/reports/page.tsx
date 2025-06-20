import Link from "next/link";
import { Button } from "@/components/ui/button";

const reportLinks = [
  {
    path: "/balance-sheet",
    label: "Balance Sheet",
  },
  {
    path: "/cash-flow-statement",
    label: "Cash Flow Statement",
  },
  {
    path: "/income-statement",
    label: "Income Statement",
  },
  {
    path: "/trial-balance",
    label: "Trial Balance",
  },
];

export default async function ReportsPage({
  params,
}: Readonly<{
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <h2 className="font-semibold text-xl">Reports</h2>
      <ul className="mt-5 inline-flex gap-x-1">
        {reportLinks.map((report) => (
          <li key={report.path}>
            {" "}
            <Button
              variant="ghost"
              asChild
              // className={cn({
              //   "bg-accent": currentPath?.startsWith(link.path),
              // })}
            >
              <Link href={`/${lang}/reports${report.path}`}>
                {report.label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}

"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button.tsx";

const navigationLinks = [
  { path: "journal", label: "Journal" },
  { path: "accounts", label: "Accounts" },
  { path: "reports", label: "Reports" },
];

export function Navbar({ className }: { className?: string }) {
  const [lang, currentPath, ...rest] = usePathname().slice(1).split("/");
  console.log(lang, currentPath);

  return (
    <nav
      className={cn(
        "z-10 flex w-full items-center justify-between border-b bg-background p-4 text-foreground shadow-xs",
        className
      )}
    >
      <div className="font-mono font-semibold text-lg tracking-wider">
        beantally
      </div>
      <ul className="inline-flex gap-x-1">
        {navigationLinks.map((link) => (
          <li key={link.path}>
            <Button
              variant="ghost"
              asChild
              className={cn({
                "bg-accent": currentPath?.startsWith(link.path),
              })}
            >
              <Link href={`/${lang}/${link.path}`}>{link.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

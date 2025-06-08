import "server-only";
import type { Locale } from "./config.ts";

export type Account = {
  code: string;
  name: string;
  description: string;
  type: string;
  category: string;
};

type ChartOfAccounts = {
  title: string;
  incomeStatement: {
    title: string;
    accounts: Account[];
  };
  balanceSheet: {
    title: string;
    accounts: Account[];
  };
};

type Dictionary = {
  landing: {
    hello: string;
  };
  chartOfAccounts: ChartOfAccounts;
};

const dictionaries: { [key in Locale]: () => Promise<Dictionary> } = {
  en: () =>
    import("@/i18n/dictionaries/en.json").then((module) => module.default),
  da: () =>
    import("@/i18n/dictionaries/da.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) =>
  dictionaries[locale as Locale]() ?? dictionaries.en();

import "server-only";
import type { Locale } from "./config.ts";

type Dictionary = { landing: { hello: string } };

const dictionaries: { [key in Locale]: () => Promise<Dictionary> } = {
  en: () =>
    import("@/i18n/dictionaries/en.json").then((module) => module.default),
  da: () =>
    import("@/i18n/dictionaries/da.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) =>
  dictionaries[locale as Locale]() ?? dictionaries.en();

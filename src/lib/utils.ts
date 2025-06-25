import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { QueryError } from "./types.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//TODO: Improve this by making sure that the error actually is of the expected type, otherwise return an UnkownError
export const safeTry = async <T, E = Error>(
  promise: Promise<T>
): Promise<[null, T] | [E, null]> => {
  try {
    const result = await promise;
    return [null, result];
  } catch (e: unknown) {
    return [e as E, null];
  }
};

export const slugToTitle = (slug: string) => {
  const exceptions = [
    "the",
    "and",
    "or",
    "but",
    "nor",
    "a",
    "an",
    "so",
    "for",
    "yet",
    "at",
    "by",
    "from",
    "of",
    "on",
    "to",
    "with",
    "in",
    "up",
    "over",
    "as",
  ];

  const words = slug.split("-");

  return words
    .map((word, index) => {
      if (
        index === 0 ||
        index === words.length - 1 ||
        !exceptions.includes(word)
      ) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }

      return word;
    })
    .join(" ");
};

export const unpackQueryError = ({ query, params, cause }: QueryError) => ({
  query,
  params,
  message: cause.message,
  code: cause.code,
});

export const getCurrencyFormatter = (_args?: {
  locale?: Intl.LocalesArgument;
  options?: Intl.NumberFormatOptions;
}) =>
  new Intl.NumberFormat(_args?.locale ?? "da", {
    style: "currency",
    currency: "DKK",
    ..._args?.options,
  });

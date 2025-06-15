import { type ClassValue, clsx } from "clsx";
import type { PostgresError } from "postgres";
import { twMerge } from "tailwind-merge";

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

export type QueryError = {
  query: string;
  params: string[];
  cause: PostgresError;
};

export const unpackQueryError = ({ query, params, cause }: QueryError) => ({
  query,
  params,
  message: cause.message,
  code: cause.code,
});

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

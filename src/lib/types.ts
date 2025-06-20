import type { PostgresError } from "postgres";

export type QueryError = {
  query: string;
  params: string[];
  cause: PostgresError;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

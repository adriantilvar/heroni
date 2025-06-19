"use client";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";

type ContextValue = {
  isPending: boolean;
  setIsPending: Dispatch<SetStateAction<boolean>>;
};

export const OptimisticContext = createContext<ContextValue>(
  {} as ContextValue
);

export const OptimisticProvider = ({ children }: { children: ReactNode }) => {
  const [isPending, setIsPending] = useState(false);

  return (
    <OptimisticContext value={{ isPending, setIsPending }}>
      {children}
    </OptimisticContext>
  );
};

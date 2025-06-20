"use client";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader, AppSidebar } from "./app-sidebar.tsx";
import LoadingPage from "./loading.tsx";

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15 * 1000,
      },
    },
  });

const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
};

let browserQueryClient: QueryClient | undefined;

export default function DashaboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset className="h-[calc(100vh-theme(spacing.4))] px-4">
        <AppHeader />
        <QueryClientProvider client={getQueryClient()}>
          <main className="flex flex-1 justify-center overflow-hidden px-9">
            <Suspense fallback={<LoadingPage />}>{children}</Suspense>
          </main>
        </QueryClientProvider>
      </SidebarInset>

      <Toaster />
    </SidebarProvider>
  );
}

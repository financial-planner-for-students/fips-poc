"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import RootApp from "./app"

export default function Root({ children }: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <RootApp />
    </QueryClientProvider>
  )
}
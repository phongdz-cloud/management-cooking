'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable auto refetch on window focus
      refetchOnMount: false, // Disable auto refetch on component mount
    },
  },
})

export const AppProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* The rest of your application */}
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

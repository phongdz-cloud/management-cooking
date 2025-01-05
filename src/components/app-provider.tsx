'use client'
import RefreshToken from '@/components/refresh-token'
import {
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from '@/lib/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable auto refetch on window focus
      refetchOnMount: false, // Disable auto refetch on component mount
    },
  },
})

const AppContext = createContext({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {},
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuthState] = useState(false)

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      setIsAuthState(true)
    }
  }, [])

  const setIsAuth = useCallback((isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true)
    } else {
      setIsAuthState(false)
      removeTokensFromLocalStorage()
    }
  }, [])

  return (
    // Nếu sử dụng React 19 thì không cần AppContext.Provider => AppContext
    <AppContext.Provider
      value={{
        isAuth,
        setIsAuth,
      }}
    >
      <QueryClientProvider client={queryClient}>
        {/* The rest of your application */}
        <RefreshToken />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}

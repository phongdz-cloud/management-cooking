'use client'
import RefreshToken from '@/components/refresh-token'
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
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
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
  isAuth: false,
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<RoleType | undefined>()

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const role = decodeToken(accessToken).role
      setRoleState(role)
    }
  }, [])

  const setRole = useCallback((role?: RoleType | undefined) => {
    setRoleState(role)
    if (!role) {
      removeTokensFromLocalStorage()
    }
  }, [])

  const isAuth = useMemo(() => !!role, [role])

  return (
    // Nếu sử dụng React 19 thì không cần AppContext.Provider => AppContext
    <AppContext.Provider
      value={{
        role,
        setRole,
        isAuth,
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

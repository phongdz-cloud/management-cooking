'use client'

import {
  checkAndRefreshtoken,
  getRefreshTokenFromLocalStorage,
} from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const RefreshTokenPage = () => {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const redirectPathName = searchParams.get('redirect')
  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshtoken({
        onSuccess: () => {
          router.push(redirectPathName || '/')
        },
      })
    } else {
      router.push('/')
    }
  }, [mutateAsync, router, refreshTokenFromUrl, redirectPathName])
  return <div>Refresh token...</div>
}

const RefreshTokenPageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <RefreshTokenPage />
  </Suspense>
)

export default RefreshTokenPageWrapper

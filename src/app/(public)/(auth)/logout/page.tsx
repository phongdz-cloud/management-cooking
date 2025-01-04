'use client'

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, Suspense } from 'react'

const LogoutPage = () => {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const ref = useRef<any>(null)
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const accessTokenFromUrl = searchParams.get('accessToken')
  useEffect(() => {
    if (
      ref.current ||
      !refreshTokenFromUrl ||
      !accessTokenFromUrl ||
      (refreshTokenFromUrl &&
        refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl !== getAccessTokenFromLocalStorage())
    ) {
      router.push('/login')
      return
    }
    ref.current = mutateAsync
    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null
      })
      router.push('/login')
    })
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl])
  return <div>Log out ...</div>
}

const LogoutPageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LogoutPage />
  </Suspense>
)

export default LogoutPageWrapper

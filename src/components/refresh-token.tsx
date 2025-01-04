'use client'

import { checkAndRefreshtoken } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// không check refresh token
const UNAUTHENTICATED_PATH = ['/login', '/register', '/refresh-token']
const RefreshToken = () => {
  const pathname = usePathname()
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) {
      return
    }
    let interval: any = null

    // Phải gọi lần đầu tiên, vì interval chỉ chạy sau thòi gian time out
    checkAndRefreshtoken({
      onError: () => {
        clearInterval(interval)
      },
    })

    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 1s thì mình sẽ cho check 1 lần
    const TIMEOUT = 1000
    interval = setInterval(checkAndRefreshtoken, TIMEOUT)

    return () => {
      clearInterval(interval)
    }
  }, [pathname])
  return null
}

export default RefreshToken

'use client'

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/app/apiRequests/auth'

// không check refresh token
const UNAUTHENTICATED_PATH = ['/login', '/register', '/refresh-token']
const RefreshToken = () => {
  const pathname = usePathname()
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) {
      return
    }
    let interval: any = null
    const checkAndRefreshtoken = async () => {
      // Không nên đưa logic lấy access và refresh token khỏi function
      // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì sẽ có cặp accessToken và refreshToken mới
      // Tránh hiện tượng bug lấy access và refreshToken cho lần gọi kế tiếp
      const accessToken = getAccessTokenFromLocalStorage()
      const refreshToken = getRefreshTokenFromLocalStorage()

      // chưa đăng nhập thì cũng kh cho chạy

      if (!accessToken || !refreshToken) return

      const decodedAccessToken = jwt.decode(accessToken) as {
        exp: number
        iat: number
      }
      const decodedRefreshToken = jwt.decode(refreshToken) as {
        exp: number
        iat: number
      }
      // Thời điểm hết hạn của token tính theo epoch time (s)
      const now = Math.round(new Date().getTime() / 1000)
      // Trường hợp refresh token hết hạn thì kh xử lý nữa
      if (decodedRefreshToken.exp <= now) return

      // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
      // thì mình sẽ kiểm tra 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
      // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
      if (
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
      ) {
        try {
          const res = await authApiRequest.refreshToken()
          setAccessTokenToLocalStorage(res.payload.data.accessToken)
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
        } catch (error) {
          console.log(error)
          clearInterval(interval)
        }
      }
    }

    // Phải gọi lần đầu tiên, vì interval chỉ chạy sau thòi gian time out
    checkAndRefreshtoken()

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

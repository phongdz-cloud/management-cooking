import { toast } from '@/hooks/use-toast'
import { EntityError } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/app/apiRequests/auth'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message,
      })
    })
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000,
    })
  }
}

export const getAccessTokenFromLocalStorage = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

export const setAccessTokenToLocalStorage = (accessToken: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('accessToken', accessToken)
}

export const getRefreshTokenFromLocalStorage = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refreshToken')
}

export const setRefreshTokenToLocalStorage = (refreshToken: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('refreshToken', refreshToken)
}

export const removeTokensFromLocalStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export const checkAndRefreshtoken = async (param?: {
  onError?: () => void
  onSuccess?: () => void
}) => {
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
  // Trường hợp refresh token hết hạn thì cho logout
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    param?.onError && param?.onError()
    return
  }

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
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      param?.onSuccess && param?.onSuccess()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      param?.onError && param?.onError()
    }
  }
}

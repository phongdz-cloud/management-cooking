import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from '@/schemaValidations/auth.schema'

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,
  sLogin: async (body: LoginBodyType) =>
    http.post<LoginResType>('/auth/login', body),
  login: async (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: '',
    }),

  sLogout: async (
    body: LogoutBodyType & {
      accessToken: string
    }
  ) =>
    http.post(
      '/auth/logout',
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),

  // Path: client/src/app/apiRequests/auth.ts client tự động gửi accessToken và refreshToken qua cookie
  logout: async () => http.post('/api/auth/logout', null, { baseUrl: '' }),
  sRefreshToken: async (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>('/auth/refresh-token', body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }

    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      '/api/refresh-token',
      null,
      {
        baseUrl: '',
      }
    )
    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  },
}

export default authApiRequest

import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from '@/schemaValidations/auth.schema'
import {
  GuestLoginBodyType,
  GuestLoginResType,
} from '@/schemaValidations/guest.schema'

const prefix = 'guest'
const guestApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,
  sLogin: async (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>(`/${prefix}/auth/login`, body),
  login: async (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>(`/api/${prefix}/auth/login`, body, {
      baseUrl: '',
    }),

  sLogout: async (
    body: LogoutBodyType & {
      accessToken: string
    }
  ) =>
    http.post(
      `/${prefix}/auth/logout`,
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
  logout: async () =>
    http.post(`/api/${prefix}/auth/logout`, null, { baseUrl: '' }),
  sRefreshToken: async (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>(`/${prefix}/auth/refresh-token`, body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }

    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      `/api/${prefix}/refresh-token`,
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

export default guestApiRequest

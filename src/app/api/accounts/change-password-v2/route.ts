import accountApiRequest from '@/app/apiRequests/account'
import { HttpError } from '@/lib/http'
import { ChangePasswordV2BodyType } from '@/schemaValidations/account.schema'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
export async function PUT(request: Request) {
  // trả về request gửi lên
  const body = (await request.json()) as ChangePasswordV2BodyType

  const cookieStore = await cookies()
  const accessTokenCookie = cookieStore.get('accessToken')?.value

  try {
    const { payload } = await accountApiRequest.sChangePasswordV2(
      accessTokenCookie || '',
      body
    )
    const { accessToken, refreshToken } = payload.data
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }
    // Set cookie accessToken, refreshToken
    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })

    return Response.json(payload)
  } catch (error) {
    console.log(error)
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status })
    } else {
      return Response.json({ message: 'Có lỗi xảy ra' }, { status: 500 })
    }
  }
}

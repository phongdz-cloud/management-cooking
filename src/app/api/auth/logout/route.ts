import authApiRequest from '@/app/apiRequests/auth'
import { cookies } from 'next/headers'
export async function POST() {
  // trả về request gửi lên
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')

  if (!accessToken || !refreshToken) {
    // Nếu không có accessToken hoặc refreshToken thì trả về
    return Response.json(
      { message: 'Không có quyền truy cập' },
      { status: 200 }
    )
  }

  try {
    const result = await authApiRequest.sLogout({
      accessToken,
      refreshToken,
    })
    const { payload } = result

    return Response.json(payload)
  } catch (error) {
    return Response.json(
      { message: 'Lỗi khi gọi API đến server backend', error },
      { status: 200 }
    )
  }
}

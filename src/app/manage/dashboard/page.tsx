import accountApiRequest from '@/app/apiRequests/account'
import { cookies } from 'next/headers'

const DashBoard = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  let name = ''
  try {
    const result = await accountApiRequest.sMe(accessToken)
    name = result.payload.data.name
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
  }

  return <div>DashBoard {name}</div>
}

export default DashBoard

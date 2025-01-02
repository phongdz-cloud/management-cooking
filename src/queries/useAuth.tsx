import authApiRequest from '@/app/apiRequests/auth'
import { useMutation } from '@tanstack/react-query'

export const useLoginMutation = () => {
  // useMutation dùng để gọi API save data
  return useMutation({
    mutationFn: authApiRequest.login,
  })
}

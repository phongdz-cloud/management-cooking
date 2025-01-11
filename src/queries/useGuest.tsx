import guestApiRequest from '@/app/apiRequests/guest'
import { useMutation } from '@tanstack/react-query'

export const useGuestLoginMutation = () => {
  // useMutation dùng để gọi API save data
  return useMutation({
    mutationFn: guestApiRequest.login,
  })
}

export const useGuestLogoutMutation = () => {
  // useMutation dùng để gọi API save data
  return useMutation({
    mutationFn: guestApiRequest.logout,
  })
}

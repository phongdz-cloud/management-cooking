import accountApiRequest from '@/app/apiRequests/account'
import { AccountResType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useAccountMe = (onSuccess?: (res: AccountResType) => void) => {
  // useMutation dùng để gọi API save data
  return useQuery({
    queryKey: ['account-me'],
    queryFn: () =>
      accountApiRequest.me().then((res) => {
        if (onSuccess) {
          onSuccess(res.payload)
        }
        return res
      }),
  })
}

export const useUpdateMeMutation = () => {
  // useMutation dùng để gọi API save data
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  })
}

export const useChangePasswordMutation = () => {
  // useMutation dùng để gọi API save data
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  })
}

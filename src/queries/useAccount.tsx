import accountApiRequest from '@/app/apiRequests/account'
import { AccountResType } from '@/schemaValidations/account.schema'
import { useQuery } from '@tanstack/react-query'

export const useAccountProfile = (
  onSuccess?: (res: AccountResType) => void
) => {
  // useMutation dùng để gọi API save data
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: () =>
      accountApiRequest.me().then((res) => {
        if (onSuccess) {
          onSuccess(res.payload)
        }
        return res
      }),
  })
}

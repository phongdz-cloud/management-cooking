import accountApiRequest from '@/app/apiRequests/account'
import {
  AccountResType,
  UpdateEmployeeAccountBodyType,
} from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
    mutationFn: accountApiRequest.changePasswordV2,
  })
}

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountApiRequest.list,
  })
}

export const useGetAccount = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountApiRequest.getEmployee(id),
  })
}

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      })
    },
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      })
    },
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      })
    },
  })
}

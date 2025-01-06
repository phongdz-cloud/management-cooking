import tableApiRequest from '@/app/apiRequests/tables'
import { UpdateTableBodyType } from '@/schemaValidations/table.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetTableList = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: tableApiRequest.list,
  })
}

export const useGetTableById = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ['tables', id],
    queryFn: () => tableApiRequest.getTable(id),
    enabled: id !== 0,
  })
}

export const useAddTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tableApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables'],
      })
    },
  })
}

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) =>
      tableApiRequest.updateTable(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables'],
        exact: true,
      })
    },
  })
}

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tableApiRequest.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables'],
      })
    },
  })
}

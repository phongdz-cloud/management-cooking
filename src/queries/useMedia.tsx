import { mediaApiRequest } from '@/app/apiRequests/media'
import { useMutation } from '@tanstack/react-query'

export const useUploadMediaMutation = () => {
  // useMutation dùng để gọi API save data
  return useMutation({
    mutationFn: mediaApiRequest.upload,
  })
}

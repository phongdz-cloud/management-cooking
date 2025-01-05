import http from '@/lib/http'
import {
  AccountResType,
  ChangePasswordBodyType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from '@/schemaValidations/account.schema'

const prefix = '/accounts'
const accountApiRequest = {
  me: () => http.get<AccountResType>(`${prefix}/me`),
  sMe: (accessToken: string) =>
    http.get<AccountResType>(`${prefix}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>(`${prefix}/me`, body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>(`${prefix}/change-password`, body),
  sChangePasswordV2: (accessToken: string, body: ChangePasswordV2BodyType) =>
    http.put<ChangePasswordV2ResType>(`${prefix}/change-password-v2`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  changePasswordV2: (body: ChangePasswordV2BodyType) =>
    http.put<ChangePasswordV2ResType>(
      `/api${prefix}/change-password-v2`,
      body,
      {
        baseUrl: '',
      }
    ),
  list: () => http.get<AccountResType>(`${prefix}`),

  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(`${prefix}`, body),

  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`${prefix}/${id}`, body),

  getEmployee: (id: number) => http.get<AccountResType>(`${prefix}/${id}`),

  deleteEmployee: (id: number) =>
    http.delete<AccountResType>(`${prefix}/${id}`),
}

export default accountApiRequest

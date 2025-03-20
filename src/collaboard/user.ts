import { getAccessToken } from './auth'
import { config } from '../config'
import { HttpStatusCode } from '../types/HttpStatusCode'
import type { UserInfo } from '../types/UserInfo'
import type { GetUserResponse } from '../types/responses/GetUserResponse'

const baseUrl: string = config.apiUrl

export const getUserInfo = async (): Promise<UserInfo> => {
  const token = getAccessToken()

  const response = await fetch(
    `${baseUrl}/public/api/public/v2.0/collaborationhub/auth/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (response.status !== Number(HttpStatusCode.Ok)) {
    throw new Error('Failed to get user info')
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- We trust the response
  const data = (await response.json()) as GetUserResponse

  const { Result: userInfo } = data

  return userInfo
}

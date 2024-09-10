import { getAccessToken } from './auth'
import { getConfig } from '../config'

const config = await getConfig()
const baseUrl: string = config.apiUrl

export const getUserInfo = async (): Promise<any> => {
  const token = getAccessToken()

  const response = await fetch(
    `${baseUrl}/public/api/public/v2.0/collaborationhub/auth/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (response.status !== 200) {
    throw new Error('Failed to get user info')
  }

  const data = await response.json()

  const userInfo = data.Result

  return userInfo
}

import pkceChallenge from 'pkce-challenge'
import { LocalStorageKey } from '../LocalStorageKey'
import { plugin } from '../plugin'
import { updateButton } from '../button/button'
import { getUserInfo } from './user'
import { config } from '../config'

const baseUrl: string = config.apiUrl
const clientId: string = config.clientId
const redirectUri: string = config.redirectUri

const authorizeUrl = `${baseUrl}/auth/oauth2/authorize`
const tokenUrl = `${baseUrl}/auth/oauth2/token`

const responseType = 'code'
const codeChallengeMethod = 'S256'

let codeVerifier: string

let accessToken: string | null = null

export let authenticated = false

export const handleAuthResponse = async (code: string): Promise<void> => {
  const formBody = new URLSearchParams()

  formBody.append('client_id', clientId)
  formBody.append('grant_type', 'authorization_code')
  formBody.append('code_verifier', codeVerifier)
  formBody.append('code', code)
  formBody.append('redirect_uri', redirectUri)

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })

  if (response.status === 200) {
    const data = await response.json()

    const token: string = data.access_token
    const refreshToken: string = data.refresh_token
    const expiresIn: string = data.expires_in
    const tokenType: string = data.token_type

    accessToken = data.access_token

    localStorage.setItem(LocalStorageKey.AccessToken, token)
    localStorage.setItem(LocalStorageKey.RefreshToken, refreshToken)
    localStorage.setItem(LocalStorageKey.ExpiresIn, expiresIn)
    localStorage.setItem(LocalStorageKey.TokenType, tokenType)

    authenticated = true

    await updateButton()

    await plugin.ui.showToast({ message: 'Logged into Collaboard' })
  } else {
    throw new Error('Failed to get access token')
  }
}

export const getAuthUrl = async (): Promise<string> => {
  const { code_verifier: verifier, code_challenge: codeChallenge } =
    await pkceChallenge()

  codeVerifier = verifier

  const authUrl = `${authorizeUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&code_challenge_method=${codeChallengeMethod}&code_challenge=${codeChallenge}&state=1234567890`
  return authUrl
}

export const getAccessToken = (): string | null => {
  if (accessToken == null) {
    accessToken = localStorage.getItem(LocalStorageKey.AccessToken)
  }
  return accessToken
}

export const checkAuthenticated = async (): Promise<void> => {
  try {
    await getUserInfo()
    authenticated = true
  } catch (e) {
    authenticated = false
  }
}

export const logout = async (): Promise<void> => {
  authenticated = false
  accessToken = null
  localStorage.removeItem(LocalStorageKey.AccessToken)
  localStorage.removeItem(LocalStorageKey.RefreshToken)
  localStorage.removeItem(LocalStorageKey.ExpiresIn)
  localStorage.removeItem(LocalStorageKey.TokenType)
  await plugin.ui.showToast({ message: 'Logged out from Collaboard' })
}

window.addEventListener('message', (event) => {
  if (event.data.search != null) {
    const search = new URLSearchParams(event.data.search as string)
    const code = search.get('code')
    if (code != null) {
      handleAuthResponse(code).catch(async (e) => {
        console.error(e)
        await plugin.ui.showToast({ message: e.message })
      })
    }
  }
})

// TODO: Refresh token

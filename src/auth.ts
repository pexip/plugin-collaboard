import pkceChallenge from 'pkce-challenge'
import { LocalStorageKey } from './LocalStorageKey'

const baseUrl = 'https://test-api.collaboard.app'

const authorizeUrl = `${baseUrl}/auth/oauth2/authorize`
const tokenUrl = `${baseUrl}/auth/oauth2/token`

const clientId = '74066737-271c-4b21-87e9-447b0472acf7'
const redirectUri = 'https://localhost:5173/local-plugin/oauth-redirect'
const responseType = 'code'
const codeChallengeMethod = 'S256'

let codeVerifier: string

let accessToken: string | null = null

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

  console.log(response)
  if (response.status === 200) {
    const data = await response.json()
    const accessToken: string = data.access_token
    const refreshToken: string = data.refresh_token
    const expiresIn: string = data.expires_in
    const tokenType: string = data.token_type

    localStorage.setItem(LocalStorageKey.AccessToken, accessToken)
    localStorage.setItem(LocalStorageKey.RefreshToken, refreshToken)
    localStorage.setItem(LocalStorageKey.ExpiresIn, expiresIn)
    localStorage.setItem(LocalStorageKey.TokenType, tokenType)
  } else {
    console.error('Failed to get access token')
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

export const logout = async (): Promise<void> => {
  accessToken = null
  localStorage.removeItem(LocalStorageKey.AccessToken)
  localStorage.removeItem(LocalStorageKey.RefreshToken)
  localStorage.removeItem(LocalStorageKey.ExpiresIn)
  localStorage.removeItem(LocalStorageKey.TokenType)
}

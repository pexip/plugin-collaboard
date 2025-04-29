import pkceChallenge from 'pkce-challenge'
import { LocalStorageKey } from '../LocalStorageKey'
import { getPlugin } from '../plugin'
import { updateButton } from '../button/button'
import { getUserInfo } from './user'
import { config } from '../config'
import { logger } from '../logger'
import { HttpStatusCode } from '../types/HttpStatusCode'

const baseUrl: string = config.apiUrl
const clientId: string = config.clientId
const redirectUri: string = config.redirectUri

const authorizeUrl = `${baseUrl}/auth/oauth2/authorize`
const tokenUrl = `${baseUrl}/auth/oauth2/token`

const responseType = 'code'
const codeChallengeMethod = 'S256'

let codeVerifier = ''

let refreshTokenTimeoutId: number | null = null

interface RequestTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: string
  token_type: string
}

export let authenticated = false

export const handleAuthResponse = async (code: string): Promise<void> => {
  const formBody = new URLSearchParams()
  const plugin = getPlugin()

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

  if (response.status === Number(HttpStatusCode.Ok)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- We trust the response
    const data = (await response.json()) as RequestTokenResponse

    await handleTokenResponse(data)

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

export const getAccessToken = (): string | null =>
  localStorage.getItem(LocalStorageKey.AccessToken)

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
  const plugin = getPlugin()

  localStorage.removeItem(LocalStorageKey.AccessToken)
  localStorage.removeItem(LocalStorageKey.RefreshToken)
  localStorage.removeItem(LocalStorageKey.ExpiresIn)
  localStorage.removeItem(LocalStorageKey.TokenType)

  if (refreshTokenTimeoutId != null) {
    clearTimeout(refreshTokenTimeoutId)
  }

  await plugin.ui.showToast({ message: 'Logged out from Collaboard' })
}

export const handleRefreshToken = async (): Promise<void> => {
  logger.info('Refreshing token')
  const refreshToken = localStorage.getItem(LocalStorageKey.RefreshToken)

  if (refreshToken == null) {
    return
  }

  const formBody = new URLSearchParams()

  formBody.append('client_id', clientId)
  formBody.append('grant_type', 'refresh_token')
  formBody.append('refresh_token', refreshToken)

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })

  if (response.status === Number(HttpStatusCode.Ok)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- We trust the response
    const data = (await response.json()) as RequestTokenResponse

    await handleTokenResponse(data)
  } else {
    logger.error('Failed to refresh token')
    authenticated = false
  }
}

const handleTokenResponse = async (
  data: RequestTokenResponse
): Promise<void> => {
  const token: string = data.access_token
  const refreshToken: string = data.refresh_token
  const expiresIn: string = data.expires_in
  const tokenType: string = data.token_type

  localStorage.setItem(LocalStorageKey.AccessToken, token)
  localStorage.setItem(LocalStorageKey.RefreshToken, refreshToken)
  localStorage.setItem(LocalStorageKey.ExpiresIn, expiresIn)
  localStorage.setItem(LocalStorageKey.TokenType, tokenType)

  authenticated = true

  await updateButton()

  const MILLISECONDS_IN_A_SECOND = 1000

  refreshTokenTimeoutId = setTimeout(
    handleRefreshToken,
    Number(expiresIn) * MILLISECONDS_IN_A_SECOND
  )
}

window.addEventListener(
  'message',
  (event: { data: { search: string | null } }) => {
    if (event.data.search != null) {
      const search = new URLSearchParams(event.data.search)
      const code = search.get('code')
      if (code != null) {
        handleAuthResponse(code).catch(async (e: unknown) => {
          logger.error(e)
          const plugin = getPlugin()
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- error is an Error
          await plugin.ui.showToast({ message: (e as Error).message })
        })
      }
    }
  }
)

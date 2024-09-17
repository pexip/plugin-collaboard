interface Config {
  apiUrl: string
  webappUrl: string
  clientId: string
  redirectUri: string
}

const response = await fetch('/config.json')

export const config: Config = await response.json()

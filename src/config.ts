interface Config {
  apiUrl: string
  webappUrl: string
  clientId: string
  redirectUri: string
}

let config: Config

export const getConfig = async (): Promise<Config> => {
  if (config != null) {
    return config
  } else {
    const response = await fetch('/config.json')
    config = await response.json()
    return config
  }
}

import type { Config } from './types/Config'

const response = await fetch('./config.json')

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- We trust the response
export const config: Config = await response.json()

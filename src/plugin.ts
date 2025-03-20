import type { Plugin } from '@pexip/plugin-api'

let plugin: Plugin | null = null

export const setPlugin = (p: Plugin): void => {
  plugin = p
}

export const getPlugin = (): Plugin => {
  if (plugin == null) {
    throw new Error('Plugin is not set')
  }
  return plugin
}

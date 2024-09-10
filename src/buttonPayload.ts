import { type ToolbarButtonPayload } from '@pexip/plugin-api'
import { CollaboardIcon } from './icons'

export const buttonPayload: ToolbarButtonPayload = {
  position: 'toolbar',
  icon: {
    custom: CollaboardIcon
  },
  tooltip: 'Collaboard'
}

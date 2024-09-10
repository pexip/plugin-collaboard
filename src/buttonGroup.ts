import { buttonPayload } from './buttonPayload'
import {
  NewWhiteboardIcon,
  OpenWhiteboardIcon,
  JoinWhiteboardIcon,
  LogoutWhiteboardIcon
} from './icons'
import { type Button } from '@pexip/plugin-api'

export enum ButtonGroupId {
  New = 'new',
  Open = 'open',
  Share = 'share',
  Join = 'join',
  Logout = 'logout'
}

export const setButtonGroup = (button: Button<'toolbar'>): void => {
  button
    .update({
      group: [
        {
          id: ButtonGroupId.New,
          position: 'toolbar',
          icon: {
            custom: NewWhiteboardIcon
          },
          tooltip: 'Create Whiteboard'
        },
        {
          id: ButtonGroupId.Open,
          position: 'toolbar',
          icon: {
            custom: OpenWhiteboardIcon
          },
          tooltip: 'Open Whiteboard'
        },
        {
          id: ButtonGroupId.Join,
          position: 'toolbar',
          icon: {
            custom: JoinWhiteboardIcon
          },
          tooltip: 'Join Whiteboard'
        },
        {
          id: ButtonGroupId.Logout,
          position: 'toolbar',
          icon: {
            custom: LogoutWhiteboardIcon
          },
          tooltip: 'Logout Collaboard'
        }
      ],
      ...buttonPayload
    })
    .catch(console.error)
}

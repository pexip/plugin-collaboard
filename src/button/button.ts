import {
  createWhiteboardIcon,
  openWhiteboardIcon,
  openWindowIcon,
  logoutIcon,
  loginIcon,
  collaboardIcon,
  stopSharingIcon,
  manageWhiteboardsIcon
} from './icons'
import type {
  Button,
  GroupButtonPayload,
  ToolbarButtonPayload
} from '@pexip/plugin-api'
import { isSharing } from '../collaboard/projects'
import { plugin } from '../plugin'
import { authenticated, checkAuthenticated } from '../collaboard/auth'
import {
  showAnotherUserSharingPrompt,
  showLoginPrompt,
  showLogoutPrompt,
  showManageWhiteboardsPrompt,
  showOpenWindowPrompt,
  showStopSharingPrompt
} from '../prompts'
import { showOpenWhiteboardForm, showCreateWhiteboardForm } from '../forms'
import { currentInvitationLink } from '../messages'

export enum ButtonGroupId {
  Login = 'login',
  CreateWhiteboard = 'create-whiteboard',
  OpenWhiteboard = 'open-whiteboard',
  ManageWhiteboards = 'manage-whiteboards',
  OpenWindow = 'open-window',
  StopSharing = 'stop-sharing',
  Logout = 'logout'
}

let button: Button<'toolbar'>

const baseButtonPayload: ToolbarButtonPayload = {
  position: 'toolbar',
  icon: {
    custom: collaboardIcon
  },
  tooltip: 'Collaboard'
}

export const createButton = async (): Promise<void> => {
  button = await plugin.ui.addButton(baseButtonPayload)

  button.onClick.add(async (event) => {
    switch (event.buttonId) {
      case ButtonGroupId.Login: {
        await showLoginPrompt()
        break
      }
      case ButtonGroupId.CreateWhiteboard: {
        if (currentInvitationLink !== '') {
          await showAnotherUserSharingPrompt(showCreateWhiteboardForm)
        } else {
          await showCreateWhiteboardForm()
        }
        break
      }
      case ButtonGroupId.OpenWhiteboard: {
        if (currentInvitationLink !== '') {
          await showAnotherUserSharingPrompt(showOpenWhiteboardForm)
        } else {
          await showOpenWhiteboardForm()
        }
        break
      }
      case ButtonGroupId.ManageWhiteboards: {
        await showManageWhiteboardsPrompt()
        break
      }
      case ButtonGroupId.OpenWindow: {
        await showOpenWindowPrompt()
        break
      }
      case ButtonGroupId.StopSharing: {
        await showStopSharingPrompt()
        break
      }
      case ButtonGroupId.Logout: {
        await showLogoutPrompt()
        break
      }
    }
  })

  await checkAuthenticated()
  updateButton()
}

export const updateButton = (): void => {
  button
    .update({
      group: getButtonGroup(),
      isActive: currentInvitationLink !== '',
      ...baseButtonPayload
    })
    .catch(console.error)
}

const getButtonGroup = (): GroupButtonPayload[] => {
  const group: GroupButtonPayload[] = []

  if (currentInvitationLink !== '') {
    group.push({
      id: ButtonGroupId.OpenWindow,
      position: 'toolbar',
      icon: {
        custom: openWindowIcon
      },
      tooltip: 'Open shared whiteboard'
    })

    if (isSharing) {
      group.push({
        id: ButtonGroupId.StopSharing,
        position: 'toolbar',
        icon: {
          custom: stopSharingIcon
        },
        tooltip: 'Stop sharing'
      })
    }
  }

  if (authenticated) {
    if (!isSharing) {
      group.push(
        {
          id: ButtonGroupId.CreateWhiteboard,
          position: 'toolbar',
          icon: {
            custom: createWhiteboardIcon
          },
          tooltip: 'Create whiteboard'
        },
        {
          id: ButtonGroupId.OpenWhiteboard,
          position: 'toolbar',
          icon: {
            custom: openWhiteboardIcon
          },
          tooltip: 'Open whiteboard'
        },
        {
          id: ButtonGroupId.ManageWhiteboards,
          position: 'toolbar',
          icon: {
            custom: manageWhiteboardsIcon
          },
          tooltip: 'Manage whiteboards'
        }
      )
    }

    group.push({
      id: ButtonGroupId.Logout,
      position: 'toolbar',
      icon: {
        custom: logoutIcon
      },
      tooltip: 'Log out'
    })
  } else {
    group.push({
      id: ButtonGroupId.Login,
      position: 'toolbar',
      icon: {
        custom: loginIcon
      },
      tooltip: 'Log in'
    })
  }

  return group
}

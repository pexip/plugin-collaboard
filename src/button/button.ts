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
import {
  authenticated,
  checkAuthenticated,
  getAuthUrl
} from '../collaboard/auth'
import {
  showAnotherUserSharingPrompt,
  showLogoutPrompt,
  showStopSharingPrompt
} from '../prompts'
import { showOpenWhiteboardForm, showCreateWhiteboardForm } from '../forms'
import { currentInvitationLink } from '../messages'
import { focusPopUp, PopUpId, PopUpOpts } from '../popUps'
import { config } from '../config'

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

const webappUrl: string = config.webappUrl

export const createButton = async (): Promise<void> => {
  button = await plugin.ui.addButton(baseButtonPayload)

  button.onClick.add(handleButtonClick)
  await checkAuthenticated()
  await updateButton()
}

export const updateButton = async (): Promise<void> => {
  button
    .update({
      group: await getButtonGroup(),
      isActive: currentInvitationLink !== '',
      ...baseButtonPayload
    })
    .catch(console.error)
}

const getButtonGroup = async (): Promise<GroupButtonPayload[]> => {
  const group: GroupButtonPayload[] = []

  if (currentInvitationLink !== '') {
    group.push({
      id: ButtonGroupId.OpenWindow,
      position: 'toolbar',
      icon: {
        custom: openWindowIcon
      },
      tooltip: 'Open shared whiteboard',
      opensPopup: {
        id: PopUpId.Whiteboard,
        openParams: [
          currentInvitationLink,
          PopUpId.Whiteboard,
          PopUpOpts.Whiteboard
        ]
      }
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
          tooltip: 'Manage whiteboards',
          opensPopup: {
            id: PopUpId.ManageWhiteboards,
            openParams: [
              `${webappUrl}/projects`,
              PopUpId.ManageWhiteboards,
              PopUpOpts.ManageWhiteboards
            ]
          }
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
    const authUrl = await getAuthUrl()

    group.push({
      id: ButtonGroupId.Login,
      position: 'toolbar',
      icon: {
        custom: loginIcon
      },
      tooltip: 'Log in',
      opensPopup: {
        id: PopUpId.Auth,
        openParams: [authUrl, PopUpId.Auth, PopUpOpts.Auth]
      }
    })
  }

  return group
}

const handleButtonClick = async (event: {
  buttonId: string
}): Promise<void> => {
  switch (event.buttonId) {
    case ButtonGroupId.Login: {
      focusPopUp(PopUpId.Auth)
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
      focusPopUp(PopUpId.ManageWhiteboards)
      break
    }
    case ButtonGroupId.OpenWindow: {
      focusPopUp(PopUpId.Whiteboard)
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
}

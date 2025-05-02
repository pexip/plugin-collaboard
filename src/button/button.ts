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
import { createOneTimeToken, isSharing } from '../collaboard/projects'
import { getPlugin } from '../plugin'
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
import { logger } from '../logger'

export enum ButtonGroupId {
  Login = 'login',
  CreateWhiteboard = 'create-whiteboard',
  OpenWhiteboard = 'open-whiteboard',
  ManageWhiteboards = 'manage-whiteboards',
  OpenWindow = 'open-window',
  StopSharing = 'stop-sharing',
  Logout = 'logout'
}

let button: Button<'toolbar'> | null = null

const baseButtonPayload: ToolbarButtonPayload = {
  position: 'toolbar',
  icon: {
    custom: collaboardIcon
  },
  tooltip: 'Collaboard'
}

const webappUrl: string = config.webappUrl

export const createButton = async (): Promise<void> => {
  const plugin = getPlugin()

  button = await plugin.ui.addButton(baseButtonPayload)

  button.onClick.add(handleButtonClick)
  await checkAuthenticated()
  await updateButton()
}

export const updateButton = async (): Promise<void> => {
  button
    ?.update({
      group: await getButtonGroup(),
      isActive: currentInvitationLink !== '',
      ...baseButtonPayload
    })
    .catch(logger.error)
}

const getButtonGroup = async (): Promise<GroupButtonPayload[]> => {
  const group: GroupButtonPayload[] = []

  if (currentInvitationLink !== '') {
    let oneTimeTokenParam = ''

    try {
      const oneTimeToken = await createOneTimeToken()
      oneTimeTokenParam = `&oneTimeToken=${oneTimeToken}`
    } catch (e) {
      logger.error('Error creating one time token', e)
    }

    group.push({
      id: ButtonGroupId.OpenWindow,
      icon: {
        custom: openWindowIcon
      },
      tooltip: 'Open shared whiteboard',
      opensPopup: {
        id: PopUpId.Whiteboard,
        openParams: [
          currentInvitationLink + oneTimeTokenParam,
          PopUpId.Whiteboard,
          PopUpOpts.Default
        ]
      }
    })

    if (isSharing) {
      group.push({
        id: ButtonGroupId.StopSharing,
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
          icon: {
            custom: createWhiteboardIcon
          },
          tooltip: 'Create whiteboard'
        },
        {
          id: ButtonGroupId.OpenWhiteboard,
          icon: {
            custom: openWhiteboardIcon
          },
          tooltip: 'Open whiteboard'
        },
        {
          id: ButtonGroupId.ManageWhiteboards,
          icon: {
            custom: manageWhiteboardsIcon
          },
          tooltip: 'Manage whiteboards',
          opensPopup: {
            id: PopUpId.ManageWhiteboards,
            openParams: [
              `${webappUrl}/projects`,
              PopUpId.ManageWhiteboards,
              PopUpOpts.Default
            ]
          }
        }
      )
    }

    group.push({
      id: ButtonGroupId.Logout,
      icon: {
        custom: logoutIcon
      },
      tooltip: 'Log out'
    })
  } else {
    const authUrl = await getAuthUrl()

    group.push({
      id: ButtonGroupId.Login,
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- buttonId is a string
  const buttonId = event.buttonId as ButtonGroupId
  switch (buttonId) {
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
      // Update the button to show the create a new oneTimeToken
      await updateButton()
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

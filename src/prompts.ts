import { updateButton } from './button/button'
import { getAuthUrl, logout } from './collaboard/auth'
import { stopSharingProject } from './collaboard/projects'
import { currentInvitationLink, sendStopSharingMessage } from './messages'
import { plugin } from './plugin'
import { PopUpId, PopUpOpts } from './popUps'

export const showLoginPrompt = async (): Promise<void> => {
  const authUrl = await getAuthUrl()

  await plugin.ui.showPrompt({
    title: 'Collaboard Log In',
    description:
      'You are going to open a third-party website to log in to Collaboard.',
    prompt: {
      primaryAction: 'Log in',
      secondaryAction: 'Cancel'
    },
    opensPopup: {
      id: PopUpId.Whiteboard,
      openParams: [authUrl, PopUpId.Auth, PopUpOpts.Auth]
    }
  })
}

export const showSharedWhiteboardPrompt = async (
  invitationLink: string
): Promise<void> => {
  await plugin.ui.showPrompt({
    title: 'Whiteboard Shared',
    description:
      'You have shared the whiteboard. Do you want to open the it in a new window?',
    prompt: {
      primaryAction: 'Open',
      secondaryAction: 'Cancel'
    },
    opensPopup: {
      id: PopUpId.Whiteboard,
      openParams: [invitationLink, PopUpId.Whiteboard, PopUpOpts.Whiteboard]
    }
  })
}

export const showReceivedInvitationPrompt = async (
  invitationLink: string
): Promise<void> => {
  await plugin.ui.showPrompt({
    title: 'Whiteboard Invitation',
    description:
      'You have received an invitation. Do you want to open the whiteboard in a new window?',
    prompt: {
      primaryAction: 'Open',
      secondaryAction: 'Cancel'
    },
    opensPopup: {
      id: PopUpId.Whiteboard,
      openParams: [invitationLink, PopUpId.Whiteboard, PopUpOpts.Whiteboard]
    }
  })
}

export const showOpenWindowPrompt = async (): Promise<void> => {
  await plugin.ui.showPrompt({
    title: 'Open Whiteboard',
    description: 'Do you want to open the whiteboard that is being shared?',
    prompt: {
      primaryAction: 'Open',
      secondaryAction: 'Cancel'
    },
    opensPopup: {
      id: PopUpId.Whiteboard,
      openParams: [
        currentInvitationLink,
        PopUpId.Whiteboard,
        PopUpOpts.Whiteboard
      ]
    }
  })
}

export const showStopSharingPrompt = async (): Promise<void> => {
  const primaryAction = 'Stop Sharing'

  const prompt = await plugin.ui.addPrompt({
    title: 'Stop Sharing',
    description: 'Do you want to stop sharing the whiteboard?',
    prompt: {
      primaryAction,
      secondaryAction: 'Cancel'
    }
  })

  prompt.onInput.add(async (event) => {
    await prompt.remove()
    if (event === primaryAction) {
      await stopSharingProject()
      await sendStopSharingMessage()
      updateButton()
    }
  })
}

export const showLogoutPrompt = async (): Promise<void> => {
  const primaryAction = 'Log out'

  const prompt = await plugin.ui.addPrompt({
    title: 'Log out',
    description:
      'Are you sure you want to log out from Collaboard? This will stop any shared whiteboards.',
    prompt: {
      primaryAction,
      secondaryAction: 'Cancel'
    }
  })

  prompt.onInput.add(async (event) => {
    await prompt.remove()
    if (event === primaryAction) {
      logout()
      await stopSharingProject()
      await sendStopSharingMessage()
      updateButton()
    }
  })
}

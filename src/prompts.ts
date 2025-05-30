import type { Prompt } from '@pexip/plugin-api'
import { updateButton } from './button/button'
import { authenticated, logout } from './collaboard/auth'
import {
  createOneTimeToken,
  isSharing,
  stopSharingProject
} from './collaboard/projects'
import { sendStopSharingMessage } from './messages'
import { getPlugin } from './plugin'
import { closePopUp, PopUpId, PopUpOpts } from './popUps'
import { logger } from './logger'

let currentPrompt: Prompt | null = null

export const showSharedWhiteboardPrompt = async (
  invitationLink: string
): Promise<void> => {
  await currentPrompt?.remove()

  const plugin = getPlugin()

  let oneTimeTokenParam = ''
  try {
    const oneTimeToken = await createOneTimeToken()
    oneTimeTokenParam = `&oneTimeToken=${oneTimeToken}`
  } catch (e) {
    logger.error('Error creating one time token', e)
  }

  currentPrompt = await plugin.ui.addPrompt({
    title: 'Whiteboard Shared',
    description:
      'You have shared the whiteboard. Do you want to open the it in a new window?',
    prompt: {
      primaryAction: 'Open',
      secondaryAction: 'Cancel'
    },
    opensPopup: {
      id: PopUpId.Whiteboard,
      openParams: [
        invitationLink + oneTimeTokenParam,
        PopUpId.Whiteboard,
        PopUpOpts.Default
      ]
    }
  })

  currentPrompt.onInput.add(async () => {
    await currentPrompt?.remove()
  })
}

export const showReceivedInvitationPrompt = async (
  invitationLink: string
): Promise<void> => {
  await currentPrompt?.remove()

  const plugin = getPlugin()

  let oneTimeTokenParam = ''
  if (authenticated) {
    try {
      const oneTimeToken = await createOneTimeToken()
      oneTimeTokenParam = `&oneTimeToken=${oneTimeToken}`
    } catch (e) {
      logger.error('Error creating one time token', e)
    }
  }

  currentPrompt = await plugin.ui.addPrompt({
    title: 'Whiteboard Invitation',
    description:
      'You have received an invitation. Do you want to open the whiteboard in a new window?',
    prompt: {
      primaryAction: 'Open',
      secondaryAction: 'Cancel'
    },
    opensPopup: {
      id: PopUpId.Whiteboard,
      openParams: [
        invitationLink + oneTimeTokenParam,
        PopUpId.Whiteboard,
        PopUpOpts.Default
      ]
    }
  })

  currentPrompt.onInput.add(async () => {
    await currentPrompt?.remove()
  })
}

export const showStopSharingPrompt = async (): Promise<void> => {
  const primaryAction = 'Stop Sharing'

  await currentPrompt?.remove()

  const plugin = getPlugin()

  currentPrompt = await plugin.ui.addPrompt({
    title: 'Stop Sharing',
    description: 'Do you want to stop sharing the whiteboard?',
    prompt: {
      primaryAction,
      secondaryAction: 'Cancel'
    }
  })

  currentPrompt.onInput.add(async (event) => {
    await currentPrompt?.remove()
    if (event === primaryAction) {
      stopSharingProject()
      await sendStopSharingMessage()
      await updateButton()
      closePopUp(PopUpId.Whiteboard)
      await plugin.ui.showToast({ message: 'Whiteboard sharing stopped' })
    }
  })
}

export const showSharingStoppedPrompt = async (): Promise<void> => {
  await currentPrompt?.remove()

  const plugin = getPlugin()

  currentPrompt = await plugin.ui.addPrompt({
    title: 'Sharing Stopped',
    description: 'The whiteboard sharing has been stopped.',
    prompt: {
      primaryAction: 'OK'
    }
  })

  currentPrompt.onInput.add(async () => {
    closePopUp(PopUpId.Whiteboard)
    await currentPrompt?.remove()
  })
}

export const showAnotherUserSharingPrompt = async (
  callback: () => Promise<void>
): Promise<void> => {
  const primaryAction = 'Continue'

  await currentPrompt?.remove()

  const plugin = getPlugin()

  currentPrompt = await plugin.ui.addPrompt({
    title: 'Another user is sharing',
    description:
      'Another user is sharing a whiteboard. You can share your whiteboard, but the other user will stop sharing. Do you want to continue?',
    prompt: {
      primaryAction,
      secondaryAction: 'Cancel'
    }
  })

  currentPrompt.onInput.add(async (input) => {
    await currentPrompt?.remove()
    if (input === primaryAction) {
      await callback()
    }
  })
}

export const showLogoutPrompt = async (): Promise<void> => {
  const primaryAction = 'Log out'

  await currentPrompt?.remove()

  const plugin = getPlugin()

  currentPrompt = await plugin.ui.addPrompt({
    title: 'Log out',
    description:
      'Are you sure you want to log out from Collaboard? This will stop any shared whiteboards.',
    prompt: {
      primaryAction,
      secondaryAction: 'Cancel'
    }
  })

  currentPrompt.onInput.add(async (event) => {
    await currentPrompt?.remove()
    if (event === primaryAction) {
      await logout()
      if (isSharing) {
        stopSharingProject()
        await sendStopSharingMessage()
      }
      closePopUp(PopUpId.Whiteboard)
      closePopUp(PopUpId.ManageWhiteboards)
      await updateButton()
    }
  })
}

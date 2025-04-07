import type { ApplicationMessage } from '@pexip/plugin-api'
import { updateButton } from './button/button'
import { stopSharingProject } from './collaboard/projects'
import { logger } from './logger'
import { getPlugin } from './plugin'
import {
  showReceivedInvitationPrompt,
  showSharingStoppedPrompt
} from './prompts'
import { type Message, MessageType } from './types/Message'

export let currentInvitationLink = ''

export const sendInvitationLink = async (
  invitationLink: string
): Promise<void> => {
  currentInvitationLink = invitationLink
  const plugin = getPlugin()

  await plugin.conference.sendApplicationMessage({
    payload: {
      type: MessageType.StartSharing,
      invitationLink
    }
  })
}

export const notifySharingActive = (participantUuid: string): void => {
  logger.info('Notifying sharing active')
  logger.info(participantUuid)

  const timeout = 2000
  const plugin = getPlugin()

  setTimeout(async () => {
    await plugin.conference.sendApplicationMessage({
      participantUuid,
      payload: {
        type: MessageType.SharingActive,
        invitationLink: currentInvitationLink
      }
    })
  }, timeout)
}

export const sendStopSharingMessage = async (): Promise<void> => {
  currentInvitationLink = ''
  const plugin = getPlugin()

  await plugin.conference.sendApplicationMessage({
    payload: {
      type: MessageType.StopSharing
    }
  })
}

export const handleApplicationMessages = async (
  applicationMessage: ApplicationMessage
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- We know the message is of type Message
  const message = applicationMessage.message as unknown as Message

  switch (message.type) {
    case MessageType.StartSharing: {
      const { invitationLink } = message
      currentInvitationLink = invitationLink ?? ''
      stopSharingProject()
      await updateButton()
      await showReceivedInvitationPrompt(currentInvitationLink)
      break
    }
    case MessageType.SharingActive: {
      logger.info('Sharing active')
      currentInvitationLink = message.invitationLink ?? ''
      await updateButton()
      break
    }
    case MessageType.StopSharing: {
      currentInvitationLink = ''
      await updateButton()
      await showSharingStoppedPrompt()
      break
    }
  }
}

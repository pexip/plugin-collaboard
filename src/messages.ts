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
import { getCurrentInvitation, setCurrentInvitation } from './currentInvitation'
import { setSharingParticipantUUID } from './sharingParticipantUUID'
import { getMe } from './me'

export const sendInvitationLink = async (
  invitationLink: string
): Promise<void> => {
  setCurrentInvitation(invitationLink)
  const plugin = getPlugin()

  await plugin.conference.sendApplicationMessage({
    payload: {
      type: MessageType.StartSharing,
      invitationLink,
      sharingParticipantUUID: getMe().uuid
    }
  })
}

export const notifySharingActive = (participantUuid: string): void => {
  logger.info('Notifying sharing active')
  logger.info(participantUuid)

  const timeout = 2000
  const plugin = getPlugin()

  setTimeout(() => {
    plugin.conference
      .sendApplicationMessage({
        participantUuid,
        payload: {
          type: MessageType.SharingActive,
          invitationLink: getCurrentInvitation(),
          sharingParticipantUUID: getMe().uuid
        }
      })
      .catch(logger.error)
  }, timeout)
}

export const sendStopSharingMessage = async (): Promise<void> => {
  setCurrentInvitation('')
  setSharingParticipantUUID('')
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
      setCurrentInvitation(invitationLink ?? '')
      setSharingParticipantUUID(message.sharingParticipantUUID ?? '')
      stopSharingProject()
      await updateButton()
      await showReceivedInvitationPrompt(getCurrentInvitation())
      break
    }
    case MessageType.SharingActive: {
      logger.info('Sharing active')
      setCurrentInvitation(message.invitationLink ?? '')
      setSharingParticipantUUID(message.sharingParticipantUUID ?? '')
      await updateButton()
      break
    }
    case MessageType.StopSharing: {
      setCurrentInvitation('')
      setSharingParticipantUUID('')
      await updateButton()
      await showSharingStoppedPrompt()
      break
    }
  }
}

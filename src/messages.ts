import { updateButton } from './button/button'
import { stopSharingProject } from './collaboard/projects'
import { plugin } from './plugin'
import {
  showReceivedInvitationPrompt,
  showSharingStoppedPrompt
} from './prompts'

export let currentInvitationLink: string = ''

enum MessageType {
  StartSharing = 'start-sharing',
  SharingActive = 'sharing-active',
  StopSharing = 'stop-sharing'
}

export const sendInvitationLink = async (
  invitationLink: string
): Promise<void> => {
  currentInvitationLink = invitationLink
  await plugin.conference.sendApplicationMessage({
    payload: {
      type: MessageType.StartSharing,
      invitationLink
    }
  })
}

export const notifySharingActive = async (
  participantUuid: string
): Promise<void> => {
  console.log('Notifying sharing active')
  console.log(participantUuid)
  setTimeout(async () => {
    await plugin.conference.sendApplicationMessage({
      participantUuid,
      payload: {
        type: MessageType.SharingActive,
        invitationLink: currentInvitationLink
      }
    })
  }, 2000)
}

export const sendStopSharingMessage = async (): Promise<void> => {
  currentInvitationLink = ''
  await plugin.conference.sendApplicationMessage({
    payload: {
      type: MessageType.StopSharing
    }
  })
}

export const handleApplicationMessages = async (event: any): Promise<void> => {
  const message = event.message

  switch (message.type) {
    case MessageType.StartSharing: {
      currentInvitationLink = message.invitationLink
      await stopSharingProject()
      await updateButton()
      await showReceivedInvitationPrompt(currentInvitationLink)
      break
    }
    case MessageType.SharingActive: {
      console.log('Sharing active')
      currentInvitationLink = message.invitationLink
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

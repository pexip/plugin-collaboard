import { plugin } from './plugin'
import { showReceivedInvitationPrompt } from './prompts'

export let currentInvitationLink: string = ''

enum MessageType {
  StartSharing = 'start-sharing',
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

export const sendStopSharingMessage = async (): Promise<void> => {
  currentInvitationLink = ''
}

export const handleApplicationMessages = async (event: any): Promise<void> => {
  const message = event.message

  switch (message.type) {
    case MessageType.StartSharing: {
      currentInvitationLink = message.invitationLink
      await showReceivedInvitationPrompt(currentInvitationLink)
      break
    }
    case MessageType.StopSharing: {
      break
    }
  }
}

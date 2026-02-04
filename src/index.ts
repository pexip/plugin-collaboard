import { registerPlugin } from '@pexip/plugin-api'
import { setPlugin } from './plugin'
import { handleApplicationMessages, notifySharingActive } from './messages'
import { PopUpId } from './popUps'
import { createButton, updateButton } from './button/button'
import { isSharing, stopSharingProject } from './collaboard/projects'
import { logger } from './logger'
import { handleRefreshToken } from './collaboard/auth'
import { closeCurrentPrompt, showSharingStoppedPrompt } from './prompts'
import { closeCurrentForm } from './forms'
import { setCurrentInvitation } from './currentInvitation'
import {
  getSharingParticipantUUID,
  setSharingParticipantUUID
} from './sharingParticipantUUID'
import { setMe } from './me'

const version = 1

const plugin = await registerPlugin({
  id: 'plugin-collaboard',
  version
})

setPlugin(plugin)

await handleRefreshToken()

await createButton()

// Decide if we should display or not the popup
window.plugin.popupManager.add(PopUpId.Whiteboard, (input) => {
  if (input.action === 'Cancel') {
    return false
  }
  return true
})

plugin.events.applicationMessage.add(handleApplicationMessages)

plugin.events.me.add((event) => {
  setMe(event.participant)
})

plugin.events.connected.add(async () => {
  setCurrentInvitation('')
  setSharingParticipantUUID('')
  stopSharingProject()
  await updateButton()
})

plugin.events.participantJoined.add((event) => {
  logger.info('Participant joined', event.participant)
  if (isSharing) {
    notifySharingActive(event.participant.uuid)
  }
})

plugin.events.participantLeft.add(async (event) => {
  if (!isSharing && event.participant.uuid === getSharingParticipantUUID()) {
    setCurrentInvitation('')
    setSharingParticipantUUID('')
    await closeCurrentPrompt()
    await closeCurrentForm()
    await updateButton()
    await showSharingStoppedPrompt()
  }
})

plugin.events.disconnected.add(async () => {
  await closeCurrentPrompt()
  await closeCurrentForm()
})

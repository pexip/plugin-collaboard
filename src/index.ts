import { registerPlugin } from '@pexip/plugin-api'
import { setPlugin } from './plugin'
import { handleApplicationMessages, notifySharingActive } from './messages'
import { PopUpId } from './popUps'
import { createButton } from './button/button'
import { isSharing } from './collaboard/projects'
import { logger } from './logger'
import { handleRefreshToken } from './collaboard/auth'

const version = 0

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
plugin.events.participantJoined.add((event) => {
  logger.info('Participant joined', event.participant)
  if (isSharing) {
    notifySharingActive(event.participant.uuid)
  }
})

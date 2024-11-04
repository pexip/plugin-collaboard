import { registerPlugin } from '@pexip/plugin-api'
import { setPlugin } from './plugin'
import { handleApplicationMessages, notifySharingActive } from './messages'
import { PopUpId } from './popUps'
import { createButton } from './button/button'
import { isSharing } from './collaboard/projects'

const plugin = await registerPlugin({
  id: 'plugin-collaboard',
  version: 0
})

setPlugin(plugin)

await createButton()

// Decide if we should display or not the popup
window.plugin.popupManager.add(PopUpId.Whiteboard, (input) => {
  if (input.action === 'Cancel') {
    return false
  }
  return true
})

plugin.events.applicationMessage.add(handleApplicationMessages)
plugin.events.participantJoined.add(async (event) => {
  console.log('Participant joined', event.participant)
  if (isSharing) {
    await notifySharingActive(event.participant.uuid)
  }
})

import { registerPlugin } from '@pexip/plugin-api'
import { getAuthUrl, handleAuthResponse } from './auth'
import {
  CollaboardIcon,
  LogoutWhiteboardIcon,
  NewWhiteboardIcon,
  OpenWhiteboardIcon
} from './icons'

const plugin = await registerPlugin({
  id: 'plugin-collaboard',
  version: 0
})

/**
 * Pop-up Parameters
 */
const authPopUpId = 'auth-collaboard'
const authPopUpOpts =
  'toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,width=500,height=775,left=600,top=200'

const authUrl = await getAuthUrl()

const button = await plugin.ui.addButton({
  position: 'toolbar',
  icon: {
    custom: CollaboardIcon
  },
  tooltip: 'Collaboard',
  opensPopup: {
    id: authPopUpId,
    openParams: [authUrl, authPopUpId, authPopUpOpts]
  }
})

await button.update({
  group: [
    {
      id: 'new',
      position: 'toolbar',
      icon: {
        custom: NewWhiteboardIcon
      },
      tooltip: 'Create whiteboard'
    },
    {
      id: 'open',
      position: 'toolbar',
      icon: {
        custom: OpenWhiteboardIcon
      },
      tooltip: 'Open whiteboard'
    },
    {
      id: 'logout',
      position: 'toolbar',
      icon: {
        custom: LogoutWhiteboardIcon
      },
      tooltip: 'Logout Collaboard'
    }
  ],
  position: 'toolbar',
  icon: {
    custom: CollaboardIcon
  },
  tooltip: 'Collaboard'
})

window.addEventListener('message', (event) => {
  if (event.data.code != null) {
    console.log('Collaboard code:', event.data.code)
    handleAuthResponse(event.data.code as string).catch(async (e) => {
      console.error(e)
      await plugin.ui.showToast({ message: e.message })
    })
  }
})

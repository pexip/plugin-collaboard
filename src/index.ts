import { registerPlugin } from '@pexip/plugin-api'
import { handleAuthResponse } from './collaboard/auth'
import { ButtonGroupId, setButtonGroup } from './buttonGroup'
import { buttonPayload } from './buttonPayload'
import { setAuthButton } from './authButton'
import { setPlugin } from './plugin'
import { getUserInfo } from './collaboard/user'
import { createLogoutPrompt } from './prompts'
import { createWhiteboardForm, openWhiteboardForm } from './forms'

const plugin = await registerPlugin({
  id: 'plugin-collaboard',
  version: 0
})

setPlugin(plugin)

const button = await plugin.ui.addButton(buttonPayload)

button.onClick.add(async (event) => {
  switch (event.buttonId) {
    case ButtonGroupId.New: {
      await createWhiteboardForm()
      break
    }
    case ButtonGroupId.Open: {
      await openWhiteboardForm()
      break
    }
    case ButtonGroupId.Join: {
      break
    }
    case ButtonGroupId.Logout: {
      await createLogoutPrompt()
      setAuthButton(button)
      break
    }
  }
})

// Check if the user is authenticated
try {
  await getUserInfo()
  setButtonGroup(button)
} catch (e) {
  setAuthButton(button)
}

window.addEventListener('message', (event) => {
  if (event.data.search != null) {
    const search = new URLSearchParams(event.data.search as string)
    const code = search.get('code')
    if (code != null) {
      handleAuthResponse(code)
        .then(() => {
          setButtonGroup(button)
        })
        .catch(async (e) => {
          console.error(e)
          await plugin.ui.showToast({ message: e.message })
        })
    }
  }
})

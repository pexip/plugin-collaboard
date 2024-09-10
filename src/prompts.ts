import { logout } from './collaboard/auth'
import { plugin } from './plugin'

export const createLogoutPrompt = async (): Promise<void> => {
  const primaryAction = 'Log out'

  const prompt = await plugin.ui.addPrompt({
    title: 'Log out',
    description: 'Are you sure you want to log out from Collaboard?',
    prompt: {
      primaryAction,
      secondaryAction: 'Cancel'
    }
  })

  prompt.onInput.add(async (event) => {
    await prompt.remove()
    if (event === primaryAction) {
      logout()
    }
  })
}

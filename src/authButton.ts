import { type Button } from '@pexip/plugin-api'
import { getAuthUrl } from './collaboard/auth'
import { buttonPayload } from './buttonPayload'

const authPopUpId = 'auth-collaboard'
const authPopUpOpts =
  'toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,width=500,height=775,left=600,top=200'

const authUrl = await getAuthUrl()

export const setAuthButton = (button: Button<'toolbar'>): void => {
  button
    .update({
      opensPopup: {
        id: authPopUpId,
        openParams: [authUrl, authPopUpId, authPopUpOpts]
      },
      ...buttonPayload
    })
    .catch(console.error)
}

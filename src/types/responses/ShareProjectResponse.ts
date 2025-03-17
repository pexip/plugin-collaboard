import type { CollaboardErrorCode } from '../CollaboardErrorCode'

export interface ShareProjectResponse {
  InvitationUrl: string
  ErrorCode: CollaboardErrorCode
}

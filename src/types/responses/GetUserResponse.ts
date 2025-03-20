import type { CollaboardErrorCode } from '../CollaboardErrorCode'
import type { UserInfo } from '../UserInfo'

export interface GetUserResponse {
  Result: UserInfo
  ErrorCode: CollaboardErrorCode
}

import type { CollaboardErrorCode } from '../CollaboardErrorCode'
import type { ProjectInfo } from '../ProjectInfo'

export interface GetProjectResponse {
  PageSize: number
  PageNumber: number
  TotalCount: number
  Results: ProjectInfo[]
  ErrorCode: CollaboardErrorCode
}

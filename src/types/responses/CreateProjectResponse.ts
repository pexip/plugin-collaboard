import type { CollaboardErrorCode } from '../CollaboardErrorCode'

export interface CreateProjectResponse {
  CanvasSizeRatio: number
  ProjectId: number
  ContainerUri: string
  ErrorCode: CollaboardErrorCode
}

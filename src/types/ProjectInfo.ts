import type { Project } from './Project'

export interface ProjectInfo {
  Project: Project
  ThumbnailUrl: string
  Permission: number
  IsLicensed: boolean
  LastAccessDate: string
  NumberOfParticipants: number
}

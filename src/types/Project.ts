export interface Project {
  ProjectId: number
  Description: string
  CanvasSizeRatio: number
  Type: number
  ContainerUri: string
  BackgroundColor: string
  CreatedByUser: string
  CreatedByUniqueMachineId: string
  CreationDate: string
  UpdatedByUser: string
  LastUpdate: string
  Presenter: string | null
}

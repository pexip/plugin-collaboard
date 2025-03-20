export enum MessageType {
  StartSharing = 'start-sharing',
  SharingActive = 'sharing-active',
  StopSharing = 'stop-sharing'
}

export interface Message {
  type: MessageType
  invitationLink?: string
}

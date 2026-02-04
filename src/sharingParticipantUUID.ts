let sharingParticipantUUID = ''

export const setSharingParticipantUUID = (participantUUID: string): void => {
  sharingParticipantUUID = participantUUID
}

export const getSharingParticipantUUID = (): string => sharingParticipantUUID

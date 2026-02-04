let currentInvitation = ''

export const setCurrentInvitation = (invitation: string): void => {
  currentInvitation = invitation
}

export const getCurrentInvitation = (): string => currentInvitation

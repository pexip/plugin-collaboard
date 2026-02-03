import type { InfinityParticipant } from '@pexip/plugin-api'

let me: InfinityParticipant | null = null

export const setMe = (participant: InfinityParticipant): void => {
  me = participant
}

export const getMe = (): InfinityParticipant => {
  if (me == null) {
    throw new Error('Me participant is not set')
  }
  return me
}

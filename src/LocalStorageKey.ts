const prefix = 'pexip-collaboard-'

export enum LocalStorageKey {
  Uuid = `${prefix}uuid`,
  AccessToken = `${prefix}access-token`,
  RefreshToken = `${prefix}refresh-token`,
  ExpiresIn = `${prefix}expires-in`,
  TokenType = `${prefix}token-type`
}

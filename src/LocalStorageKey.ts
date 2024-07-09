const prefix = 'collaboard-'

export enum LocalStorageKey {
  AccessToken = `${prefix}access-token`,
  RefreshToken = `${prefix}refresh-token`,
  ExpiresIn = `${prefix}expires-in`,
  TokenType = `${prefix}token-type`
}

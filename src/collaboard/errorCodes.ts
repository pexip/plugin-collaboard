export const getErrorDescription = (code: number): string => {
  let description = ErrorCodes[code] + '.'
  description = insertSpaceBetweenWords(description)
  description = description.toLowerCase()
  description = capitalizeFirstLetter(description)
  return description
}

const insertSpaceBetweenWords = (str: string): string => {
  return str.replace(/([A-Z]+)/g, ' $1').trim()
}

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

enum ErrorCodes {
  None = 0,
  Maintenance = 1,
  AppIdNotValid = 2,
  UserNotValid = 3,
  ProjectIdNotValid = 4,
  MissingHttpContext = 5,
  ProjectCreationFailure = 6,
  ProjectLockedByAnOtherUser = 7,
  ProjectIsNotLocked = 8,
  ProjectIsNotUnLocked = 9,
  NotPossibleToUpdateKeepAlive = 10,
  ImpossibleToLockProject = 11,
  ProjectIsInAnInvalidState = 12,
  AppVerNotValid = 13,
  UniqueMachineIdNotValid = 14,
  UserIdNotValid = 15,
  FeatureNotAvailableForUnregisteredUsers = 16,
  FeatureNotAvailableOnTeamFamilyDevice = 17,
  ResetProjectPasswordFailed = 18,
  ErrorWhileCreatingNewUser = 19,
  MandatoryFiledMissing = 20,
  ProjectCreationFailureWhileCreatingAzureStorage = 21,
  ProjectCreationFailureWhileUpdatingToken = 22,
  RequestSizeExceeded = 23,
  ListIsEmpty = 24,
  MessageContainsNoFileName = 25,
  InvalidConnectionId = 26,
  InvalidPageSize = 27,
  InvalidPageNumber = 28,
  NoSuchQuickLinkInProject = 29,
  InvalidFilterType = 30,
  ErrorSendingMessage = 41,

  // Collaboard
  PasswordNotValid = 130,
  TokenNotValid = 131,
  UserIsParticipantInProject = 132,
  UserIsNotParticipantInProject = 133,
  ProjectInvitationExpired = 136,
  MaximumNumberOfProjectsReached = 137,
  InvalidLicense = 138,
  InvalidProjectOwner = 139,
  InvalidProjectPermission = 140,
  ProjectInvitationGuestIdentificationInvalid = 141,
  ActionNotAllowedForGuestUser = 142,
  MaxNumberOfParticipantsReached = 143,
  MaxNumberOfGuestsReached = 144,
  InvalidSubscriptionUser = 145,
  SubscriptionUserInvitationIncorrectUser = 146,
  UserDoesNotHaveTheRequiredLicense = 147,
  UserIsParticipantInSpace = 148,
  InvalidSpacePermission = 149,
  ProjectIsNotATemplate = 150,
  ProjectTypeIdNotValid = 151,
  ProjectIsUpgrading = 152,

  // Auth
  EntityNotValid = 2000,
  DomainNotValid = 2001,
  RefreshTokenNotValid = 2002,
  TenantNotValid = 2003,
  OTPCodeNotValid = 2004,
  UserAlreadyExists = 2005,
  UserTFANotEnabled = 2006,
  UserPasswordNotValid = 2007,
  UserTokenNotValid = 2008,
  UserAlreadyVerified = 2009,
  UserNotVerified = 2010,
  UserLockedOut = 2011,
  UserNotAcceptedTermsOfService = 2012,
  WrongUsernameOrPassword = 2013,

  GenericError = 10000,
  UnauthorizedServiceCall = 10001,
  HttpContentSerializationError = 10002,
  SignalRException = 10003,
  UserNotAuthorizedToPerformRequestedAction = 10004,
  DBFailedToPerformRequestedAction = 10005,
  WrongAzureBlobStatus = 10006,
  WrongTileStatus = 10007,
  PayloadNotValid = 10008,

  // Facilitator
  CannotChangePermissionDuringPresentation = 10020,
  ActionNotAllowedForNonFacilitator = 10021,
  ProjectNotInPresentationMode = 10022,
  ProjectAlreadyInPresentationMode = 10023,

  // Voting
  ProjectNotInVotingMode = 10050,
  VotingSessionIdInvalid = 10051,
  ProjectAlreadyInVotingMode = 10052,
  VotingRequiresAtLeastOneInvite = 10055,
  UserNotInVoteSession = 10060,
  UserAlreadyStoppedVotingSession = 10061,
  UserOutOfVotes = 10062,
  ErrorGettingResults = 10070,
  NoActiveVotingSession = 10075,

  // Spaces
  SpaceNotValid = 10100,
  UserIsNotParticipantInSpace = 10101,
  SpaceContainsProjects = 10102,

  // Links
  LinkTileIdInvalid = 10200,
  LinkSourceTileNotFound = 10202,
  LinkTargetTileNotFound = 10203,
  MissingLinkTarget = 10204,
  LinkTargetQuickLinkNotFound = 10205,
  LinkAlreadyOnSourceTile = 10210,
  LinkNotFoundForSource = 10211,
  LinkNotFound = 10212,

  // Comments
  CommentNotValid = 10300,
  CommentLikeNotValid = 10301,

  // Notifications
  NotificationNotValid = 10400,

  // Licensing
  InvalidProduct = 20000,
  InvalidPricelist = 20001,
  InvalidPrice = 20002,
  InvalidCustomer = 20003,
  InvalidOrder = 20004,
  InvalidOrderLine = 20005,
  InvalidSubscription = 20006,
  InvalidPromoCode = 20007,
  InvalidBillingType = 20008,
  InvalidPaymentType = 20009,
  InvalidPayment = 20010,
  UnableToCancelPayment = 20011,
  MaxNumberOfUsersExceeded = 20012,
  MinNumberOfUsersSubceeded = 20013,
  MaxNumberOfDevicesExceeded = 20014,
  MinNumberOfDevicesSubceeded = 20015,
  UnableToReactivatePayment = 20016,
  UnknownPaymentProvider = 20017,
  ItemDoesNotExist = 20018,
  ItemAlreadyExists = 20019,
  InvalidUserPermission = 20020
}

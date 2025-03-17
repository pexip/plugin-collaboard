export interface UserInfo {
  Email: string
  AuthenticationMode: number
  CompanyIndustry: string | null
  CompanyName: string | null
  CompanyUrl: string | null
  CompanyRole: string | null
  CompanySize: string | null
  Country: string | null
  FirstName: string
  IsGuest: boolean
  Language: string
  LastName: string
  PhoneNumber: string | null
  PhotoUrl: string
  TermsOfServiceAccepted: boolean
  UseCases: string | null
  NotificationMethod: number
  RegistrationReason: number
  UserId: number
  UserName: string
  DateCreated: string
  DateLastUpdated: string
  DateLastActivity: string
}

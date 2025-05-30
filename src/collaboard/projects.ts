import { getAccessToken } from './auth'
import { LocalStorageKey } from '../LocalStorageKey'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../config'
import { CollaboardErrorCode } from '../types/CollaboardErrorCode'
import { HttpStatusCode } from '../types/HttpStatusCode'
import type { GetProjectResponse } from '../types/responses/GetProjectResponse'
import type { ProjectInfo } from '../types/ProjectInfo'
import type { CreateProjectResponse } from '../types/responses/CreateProjectResponse'
import type { ShareProjectResponse } from '../types/responses/ShareProjectResponse'
import type { CreateOneTimeTokenResponse } from '../types/responses/CreateOneTimeTokenResponse'

const baseUrl: string = config.apiUrl
const webappUrl: string = config.webappUrl

let uuid = localStorage.getItem(LocalStorageKey.Uuid)
if (uuid == null) {
  const newUuid: string = uuidv4()
  localStorage.setItem(LocalStorageKey.Uuid, newUuid)
  uuid = newUuid
}

export let isSharing = false

export const createProject = async (name: string): Promise<number> => {
  const token = getAccessToken()

  const response = await fetch(
    `${baseUrl}/public/api/public/v2.0/collaborationhub/projects`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Description: name
      })
    }
  )

  if (response.status !== HttpStatusCode.Ok.valueOf()) {
    const errorMessage = 'Failed to create project'

    if (response.status === HttpStatusCode.BadRequest.valueOf()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- We trust the response
      const data = (await response.json()) as CreateProjectResponse
      const { ErrorCode: error } = data
      throw new Error(errorMessage + ': ' + getErrorDescription(error))
    }
    throw new Error(errorMessage)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- We trust the response
    const data = (await response.json()) as CreateProjectResponse
    return data.ProjectId
  }
}

export const getProjects = async (): Promise<ProjectInfo[]> => {
  const token = getAccessToken()
  const pageSize = 10
  const pageNumber = 1

  const response = await fetch(
    `${baseUrl}/public/api/public/v2.0/collaborationhub/projects/owned?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (response.status !== HttpStatusCode.Ok.valueOf()) {
    const errorMessage = 'Failed to get projects'

    if (response.status === HttpStatusCode.BadRequest.valueOf()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- We trust the response
      const data = (await response.json()) as { ErrorCode: CollaboardErrorCode }
      const { ErrorCode: error } = data
      throw new Error(errorMessage + ': ' + getErrorDescription(error))
    }
    throw new Error(errorMessage)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- We trust the response
    const data = (await response.json()) as GetProjectResponse
    const { Results: projects } = data
    return projects
  }
}

export const shareProject = async (
  projectId: number,
  writable: boolean
): Promise<string> => {
  const token = getAccessToken()

  const readWrite = 2
  const readOnly = 1

  const MemberPermission = writable ? readWrite : readOnly

  const ValidForMinutes = 60

  const response = await fetch(
    `${baseUrl}/public/api/public/v2.0/collaborationhub/projects/${projectId}/invitationlink`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        UniqueDeviceId: uuid,
        MemberPermission,
        ValidForMinutes,
        InvitationUrl: `${webappUrl}/share`
      })
    }
  )

  if (response.status !== HttpStatusCode.Ok.valueOf()) {
    const errorMessage = 'Failed to share project'

    if (response.status === HttpStatusCode.BadRequest.valueOf()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- We trust the response
      const data = (await response.json()) as { ErrorCode: CollaboardErrorCode }
      const { ErrorCode: error } = data
      throw new Error(errorMessage + ': ' + getErrorDescription(error))
    }
    throw new Error(errorMessage)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- We trust the response
    const data = (await response.json()) as ShareProjectResponse
    const invitationLink: string = data.InvitationUrl
    isSharing = true
    return invitationLink
  }
}

export const stopSharingProject = (): void => {
  isSharing = false
}

export const createOneTimeToken = async (): Promise<string> => {
  const token = getAccessToken()

  const response = await fetch(
    `${baseUrl}/public/api/public/v2.0/collaborationhub/auth/onetimetoken`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (response.status !== HttpStatusCode.Ok.valueOf()) {
    const errorMessage = 'Failed to create one time token'
    throw new Error(errorMessage)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- We trust the response
    const data = (await response.json()) as CreateOneTimeTokenResponse
    return data.Result
  }
}

const getErrorDescription = (code: number): string => {
  let description = CollaboardErrorCode[code] + '.'
  description = insertSpaceBetweenWords(description)
  description = description.toLowerCase()
  description = capitalizeFirstLetter(description)
  return description
}

const insertSpaceBetweenWords = (str: string): string =>
  str.replace(/([A-Z]+)/g, ' $1').trim()

const firstLetter = 0
const secondLetter = 1
const capitalizeFirstLetter = (str: string): string =>
  str.charAt(firstLetter).toUpperCase() + str.slice(secondLetter)

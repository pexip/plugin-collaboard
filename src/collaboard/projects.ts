import { getAccessToken } from './auth'
import { LocalStorageKey } from '../LocalStorageKey'
import { v4 as uuidv4 } from 'uuid'
import { getErrorDescription } from './errorCodes'
import { config } from '../config'

const baseUrl: string = config.apiUrl
const webappUrl: string = config.webappUrl

let uuid = localStorage.getItem(LocalStorageKey.Uuid)
if (uuid == null) {
  const newUuid: string = uuidv4()
  localStorage.setItem(LocalStorageKey.Uuid, newUuid)
  uuid = newUuid
}

export let isSharing = false

export const createProject = async (name: string): Promise<any> => {
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

  if (response.status !== 200) {
    const errorMessage = 'Failed to create project'

    if (response.status === 400) {
      const data = await response.json()
      throw new Error(
        errorMessage + ': ' + getErrorDescription(data.ErrorCode as number)
      )
    }
    throw new Error(errorMessage)
  } else {
    const data = await response.json()
    const project = data
    return project
  }
}

export const getProjects = async (): Promise<any> => {
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

  if (response.status !== 200) {
    const errorMessage = 'Failed to get projects'

    if (response.status === 400) {
      const data = await response.json()
      throw new Error(
        errorMessage + ': ' + getErrorDescription(data.ErrorCode as number)
      )
    }
    throw new Error(errorMessage)
  } else {
    const data = await response.json()
    const projects = data.Results
    return projects
  }
}

export const shareProject = async (
  projectId: string,
  writable: boolean
): Promise<string> => {
  const token = getAccessToken()

  const MemberPermission = writable
    ? 2 // ReadWrite
    : 1 // ReadOnly

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
        ValidForMinutes: 60,
        InvitationUrl: `${webappUrl}/share`
      })
    }
  )

  if (response.status !== 200) {
    const errorMessage = 'Failed to share project'

    if (response.status === 400) {
      const data = await response.json()
      throw new Error(
        errorMessage + ': ' + getErrorDescription(data.ErrorCode as number)
      )
    }
    throw new Error(errorMessage)
  } else {
    const data = await response.json()
    const invitationLink: string = data.InvitationUrl
    isSharing = true
    return invitationLink
  }
}

export const stopSharingProject = async (): Promise<void> => {
  isSharing = false
}

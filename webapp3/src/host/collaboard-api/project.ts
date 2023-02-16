import { collaboardApiUrl } from "./constants";

/**
 * Obtain all the available projects for the authenticated user.
 * @param authToken - Token that was obtained in the authentication process.
 * @returns 
 */
const getProjects = async (authToken: string) => {
  const result = await fetch(`${collaboardApiUrl}/api/CollaborationHub/GetParticipatingProjecs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      "UniqueDeviceId": "c0bd411b-783c-42ef-b1f3-f5de2373538a",
      "AppVer": "5.16.155",
      "PageSize": 20,
      "PageNumber": 1,
      "WantsCount": true,
      "SpaceId": null
    })
  });
  if (result.status === 200) {
    const jsonResult = await result.json();
    return jsonResult.Results;
  }
}

/**
 * Create a new empty project in collaboard.
 * @param authToken - Token that was obtained in the authentication process.
 * @param projectName - Name for the project that will be used in the description.
 * @returns JSON object with the new project.
 */
const createProject = async (authToken: string, projectName: string) => {
  const result = await fetch(`${collaboardApiUrl}/api/CollaborationHub/CreateProject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      "UniqueDeviceId": "c0bd411b-783c-42ef-b1f3-f5de2373538a",
      "AppVer": "5.16.155",
      "Description": projectName,
      "SpaceId": null
    })
  });
  if (result.status === 200) {
    const jsonResult = await result.json();
    return jsonResult;
  }
  throw Error('Cannot create a collaboard project')
}

/**
 * Remove a project from our collaboard account.
 * @param authToken - Token that was obtained in the authentication process.
 * @param projectId - Id of the project that we want to remove.
 * @returns Empty promise.
 */
const deleteProject = async (authToken: string, projectId: number) => {
  const result = await fetch(`${collaboardApiUrl}/api/CollaborationHub/DeleteProject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      "UniqueDeviceId": "c0bd411b-783c-42ef-b1f3-f5de2373538a",
      "AppVer": "5.16.155",
      "ProjectId": projectId
    })
  });
  if (result.status === 200) {
    return;
  }
  throw Error('Cannot delete a collaboard project')
}

/**
 * Create an invitation link that can be shared with authenticated users.
 * @param authToken - Token that was obtained in the authentication process.
 * @param projectId - Id of the project that we want to share.
 * @returns Invitation link in a string.
 */
const createInvitationLink = async (authToken: string, projectId: number) => {
  const result = await fetch(`${collaboardApiUrl}/api/CollaborationHub/CreateProjectInvitationLink`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      "UniqueDeviceId": "c0bd411b-783c-42ef-b1f3-f5de2373538a",
      "AppVer": "5.16.155",
      "ProjectId": projectId,
      "MemberPermission": 2,
      "GuestPermission": 0,
      "ValidForMinutes": 60,
      "GuestIdentificationRequired": true,
      "InvitationUrl": "https://web.collaboard.app/acceptProjectInvitation"
    })
  });
  if (result.status === 200) {
    const jsonResult = await result.json();
    return jsonResult.InvitationUrl;
  }
  throw Error('Cannot send invitation to a collaboard project')
}

export {
  getProjects,
  createProject,
  deleteProject,
  createInvitationLink
}

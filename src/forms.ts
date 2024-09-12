import { updateButton } from './button/button'
import { createProject, getProjects, shareProject } from './collaboard/projects'
import { sendInvitationLink } from './messages'
import { plugin } from './plugin'
import { showSharedWhiteboardPrompt } from './prompts'

export const showCreateWhiteboardForm = async (): Promise<void> => {
  const form = await plugin.ui.addForm({
    title: 'Create Whiteboard',
    description:
      'You will create a public whiteboard that will be accessible by anyone with the link.',
    form: {
      elements: {
        name: {
          name: 'Name',
          type: 'text',
          isOptional: false,
          placeholder: 'Enter Name'
        },
        permissions: {
          name: 'Guest Permissions',
          type: 'checklist',
          options: [
            {
              id: 'writable',
              label: 'Writable'
            }
          ]
        }
      },
      submitBtnTitle: 'Create'
    }
  })

  form.onInput.add(async (event) => {
    await form.remove()

    const name = event.name

    if (name == null) {
      return
    }

    const writable = event.permissions.writable

    try {
      const project = await createProject(name)
      const projectId: string = project.ProjectId
      const invitationLink = await shareProject(projectId, writable)
      await sendInvitationLink(invitationLink)
      await showSharedWhiteboardPrompt(invitationLink)
      updateButton()
    } catch (error: any) {
      await plugin.ui.showToast({ message: error.message })
    }
  })
}

export const showOpenWhiteboardForm = async (): Promise<void> => {
  let projects: any
  try {
    projects = await getProjects()
    console.log(projects)
  } catch (error: any) {
    await plugin.ui.showToast({ message: error.message })
    return
  }

  const form = await plugin.ui.addForm({
    title: 'Open whiteboard',
    form: {
      elements: {
        project: {
          name: 'Select whiteboard',
          type: 'select',
          options: projects.map((element: any) => ({
            id: element.Project.ProjectId,
            label: element.Project.Description
          }))
        }
      },
      submitBtnTitle: 'Select'
    }
  })

  form.onInput.add(async (event) => {
    await form.remove()

    const projectId = event.project

    if (projectId == null) {
      return
    }

    try {
      const writable = false
      const invitationLink = await shareProject(projectId, writable)
      await sendInvitationLink(invitationLink)
      await showSharedWhiteboardPrompt(invitationLink)
      updateButton()
    } catch (error: any) {
      await plugin.ui.showToast({ message: error.message })
    }
  })
}

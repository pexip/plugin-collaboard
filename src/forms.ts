import { updateButton } from './button/button'
import { createProject, getProjects, shareProject } from './collaboard/projects'
import { logger } from './logger'
import { sendInvitationLink } from './messages'
import { getPlugin } from './plugin'
import { showSharedWhiteboardPrompt } from './prompts'
import type { ProjectInfo } from './types/ProjectInfo'

export const showCreateWhiteboardForm = async (): Promise<void> => {
  const plugin = getPlugin()

  const form = await plugin.ui.addForm({
    title: 'Create Whiteboard',
    description:
      'You are going to create a whiteboard and share it with the rest of the participants.',
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

    const { name } = event

    const { permissions } = event
    const { writable } = permissions

    try {
      const projectId = await createProject(name)
      const invitationLink = await shareProject(projectId, writable)
      await sendInvitationLink(invitationLink)
      await showSharedWhiteboardPrompt(invitationLink)
      await updateButton()
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- error is an Error
      await plugin.ui.showToast({ message: (e as Error).message })
    }
  })
}

export const showOpenWhiteboardForm = async (): Promise<void> => {
  let projects: ProjectInfo[] = []
  const plugin = getPlugin()

  try {
    projects = await getProjects()
    logger.info(projects)
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- error is an Error
    await plugin.ui.showToast({ message: (e as Error).message })
    return
  }

  const form = await plugin.ui.addForm({
    title: 'Open whiteboard',
    description:
      'You are going to open a whiteboard and share it with the rest of the participants.',

    form: {
      elements: {
        project: {
          name: 'Select whiteboard',
          type: 'select',
          options: projects.map((project: ProjectInfo) => {
            const { Project } = project
            const { ProjectId: id, Description: label } = Project
            return { id, label }
          })
        }
      },
      submitBtnTitle: 'Select'
    }
  })

  form.onInput.add(async (event) => {
    await form.remove()

    const { project: projectId } = event

    try {
      const writable = false
      const invitationLink = await shareProject(Number(projectId), writable)
      await sendInvitationLink(invitationLink)
      await showSharedWhiteboardPrompt(invitationLink)
      await updateButton()
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- error is an Error
      await plugin.ui.showToast({ message: (e as Error).message })
    }
  })
}

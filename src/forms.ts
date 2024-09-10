import { createProject, getProjects, shareProject } from './collaboard/projects'
import { plugin } from './plugin'

export const createWhiteboardForm = async (): Promise<void> => {
  const form = await plugin.ui.addForm({
    title: 'Create whiteboard',
    description:
      'You will create a public whiteboard that will be accessible by anyone with the link.',
    form: {
      elements: {
        name: {
          name: 'Name',
          type: 'text',
          required: true,
          placeholder: 'Enter whiteboard name'
        }
      },
      submitBtnTitle: 'Create'
    }
  })

  form.onInput.add(async (event) => {
    await form.remove()

    if (event.name == null) {
      return
    }

    const name = event.name

    try {
      const project = await createProject(name)
      const projectId: string = project.ProjectId
      const invitationLink = await shareProject(projectId)
    } catch (error: any) {
      await plugin.ui.showToast({ message: error.message })
    }
  })
}

export const openWhiteboardForm = async (): Promise<void> => {
  let projects: any
  try {
    const projects = await getProjects()
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
    try {
      const invitationLink = await shareProject(projectId)
    } catch (error: any) {
      await plugin.ui.showToast({ message: error.message })
    }
  })
}

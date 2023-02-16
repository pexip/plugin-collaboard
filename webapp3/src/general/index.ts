import { Plugin } from '@pexip/plugin-api';

let plugin: Plugin;

const initializeGeneral = async (plugin_rcv: Plugin) => {
  plugin = plugin_rcv;
  plugin.events.applicationMessage.add((appMessage) => {
    console.log(appMessage);
    if (appMessage.message.type === 'whiteboard-invitation') {
      showWhiteboardInvitation(appMessage.message.data as string)
    }
  })
}

const showWhiteboardInvitation = async (link: string) => {
  const primaryAction = 'Open'
  const prompt = await plugin.ui.addPrompt({
    title: 'Whiteboard invitation',
    description: 'You have received a whiteboard invitation. ' +
      'Do you want to open the whiteboard in a new tab?',
    prompt: {
      primaryAction,
      secondaryAction: 'Cancel'
    }
  })

  prompt.onInput.add(async (result) => {
    await prompt.remove()
    if (result === primaryAction) {
      window.open(link)
    }
  })
}

export {
  initializeGeneral
}
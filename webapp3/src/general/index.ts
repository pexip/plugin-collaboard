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
      const w = 800;
      const h = 800;
      let left = (screen.width/2)-(w/2);
      var top = (screen.height/2)-(h/2); 
      window.open(link, 'Collaboard',
        'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left)

    }
  })
}

export {
  initializeGeneral
}
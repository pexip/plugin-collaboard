export enum PopUpId {
  Auth = 'collaboard-auth',
  Whiteboard = 'collaboard-whiteboard',
  ManageWhiteboards = 'collaboard-manage-whiteboards'
}

export enum PopUpOpts {
  Auth = 'toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,width=500,height=775,left=600,top=200',
  Default = 'toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,width=800,height=600,left=600,top=200'
}

export const focusPopUp = (id: string): void => {
  const timeout = 0
  setTimeout(() => {
    window.plugin.popupManager.get(id)?.focus()
  }, timeout)
}

export const closePopUp = (id: string): void => {
  window.plugin.popupManager.get(id)?.close()
}

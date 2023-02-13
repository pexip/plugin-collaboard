const state$ = (window as any).PEX.pluginAPI.createNewState({});


(window as any).PEX.pluginAPI.registerPlugin({
  id: 'plugin-collaboard-url',
  load: () => console.log('Plugin Collaboard URL', 'Loaded'),
  unload: () => console.log('Plugin Collaboard URL', 'Unloaded'),
  state$: state$,
  launchUrl: () => window.open("https://web.collaboard.app/", )
});
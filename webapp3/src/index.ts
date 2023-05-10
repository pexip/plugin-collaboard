import { registerPlugin } from '@pexip/plugin-api';
import { initializeHost } from './host';
import { initializeGeneral } from './general';
import { Config } from './config';

const plugin = await registerPlugin({
  id: 'collaboard',
  version: 0,
});

const response = await fetch('./config.json');
const config: Config = await response.json();

initializeHost(plugin, config);
initializeGeneral(plugin, config);

window.plugin.popupManager.add('open-collaboard-link', ctx => {
  if (ctx.input === 'Open') {
      return true;
  }
  return false;
})

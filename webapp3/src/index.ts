import { registerPlugin } from '@pexip/plugin-api';
import { initializeHost } from './host';
import { initializeGeneral } from './general';

const plugin = await registerPlugin({
  id: 'collaboard',
  version: 0,
});

initializeHost(plugin);
initializeGeneral(plugin);

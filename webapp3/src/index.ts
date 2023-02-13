import {registerPlugin} from '@pexip/plugin-api';

const plugin = await registerPlugin({
    id: 'my-plugin',
    version: 0,
});

await plugin.ui.showToast({message: 'Hello plugin world👋'});
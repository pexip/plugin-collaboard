# Web App 3 Plugin: Collaboard

This plugin enables the user to share whiteboard during the meetings with the
rest of the participants

## Requirements

In order to use this plugin, you need to comply with the following requirements:

| Component      | Version |
| -------------- | ------- |
| Pexip Infinity | v35     |

## How to use

This plugin will create a new button in the interface.

## How to configure the branding

This plugin uses `oAuth` authentication and, to support this, we need to enable
the redirections in the `manifest.json` file:

```
{
  "applicationConfig": {
    "handleOauthRedirects": true
    ...
  }
  ...
}
```

## Run for development

- Install all the dependencies:

```bash
$ npm i
```

- Run the dev environment:

```bash
$ npm start
```

The plugin will be served from https://localhost:5173 (visit that page and
accept the self-signed certificates), but you should access it thought the Web
App 3 URL. You have more information about how to configure your environment in
the
[Developer Portal: Setup guide for plugin developers](https://developer.pexip.com/docs/plugins/webapp-3/setup-guide-for-plugin-developers).

## Build for production

To create a package, you will need to first install all the dependencies:

```bash
$ npm i
```

And now to create the package itself:

```bash
$ npm run build
```

Congrats! Your package is ready and it will be available in the `dist` folder.
The next step is to create a Web App3 branding and copy `dist` into that
branding.

If you want to know more about how to deploy your plugin in Pexip Infinity,
check our [Developer Portal](https://developer.pexip.com).

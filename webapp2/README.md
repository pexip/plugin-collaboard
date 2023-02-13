# Plugin: Collaboard URL

Plugin that opens a URL with a whiteboard. The URL that it opens is https://web.collaboard.app/

## Prerequisites

The only prerequisite for building this project is to have `node` and `npm` in your system. At this moment we are using the following versions:

- node: `16.14.2`
- npm:  `8.5.0`

Other `node` and `npm` could work, but it's recommended to use the same versions.

## Generate a production package

For generating the production package we need follow the next steps:

Install the `node` dependencies:

    $ npm install

Build a production package:

    $ npm run build

This will create a  `dist` folder with the follow architecture:

```
📁 dist
↳ 📁 plugins
  ↳ 📁 collaboard-url
    ↳ 📁 assets
      ↳ 📁 images
        ↳ 📄 collaboard-url.svg
    ↳ 📄 index.js
    ↳ 📄 index.js.LICENSE.txt
    ↳ 📄 plugin.json
```

The main files are these two:

- `index.js`: Contains the whole minified JavaScript code for this plugin.
  
- `plugin.json`: Defines the plugin configuration.
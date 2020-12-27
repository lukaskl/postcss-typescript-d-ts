# PostCSS modules Typescript definitions generator

[PostCSS] plugin - `postcss-typescript-d-ts`.

[postcss]: https://github.com/postcss/postcss

This plugin generated `.d.ts` files for each of the PostCSS file so that this file could be used with [PostCSS modules] and TypeScript.

[postcss modules]: https://github.com/css-modules/postcss-modules

For example, if `styles.pcss` content would be:

```css
.container {
  background-color: blue;

  .header {
    font-size: 20px;
  }

  &-name {
    color: red;
  }
}
```

This plugin would create a new file `styles.pcss.d.ts` with the following content:

```ts
declare const styles: {
  container: string
  header: string
  'container-name': string
}

export default styles
```

## Usage

**Step 1:** Install plugin:

```sh
yarn add --dev postcss  postcss-typescript-d-ts
```

OR

```sh
npm install --save-dev postcss postcss-typescript-d-ts
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js` (or `.postcssrc.js` or any other postcss config file variation)
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-typescript-d-ts'),
    require('postcss-modules')
  ]
}
```

<details>
  <summary>Or passing object instead of array</summary>

```diff
module.exports = {
  plugins: {
+   'postcss-typescript-d-ts': {},
    'postcss-modules': {},
  },
}
```

</details>

<br/>

**Step 4 (Optional):** Configure the plugin

see `packages/postcss-typescript-d-ts/src/plugin.ts` for details.

The plugin accepts these configuration options:

```ts
export interface TypeScriptDefinitionsPluginOptions {
  /**
   * Custom handler which is called when a new generated file would be written.
   * If `writeFile` is passed, original `writeFile` will not be called.
   */
  writeFile?: (props: WriteFileProps) => Promise<void> | void
  /**
   * Transform content before writing it to the file.
   */
  transformContent?: (props: WriteFileProps) => Promise<string> | string
  /** Add extra content items either to the top or bottom of the file */
  extra?: {
    /** Add extra content to the top of the file */
    header?: string
    /** Add extra content to the bottom of the file */
    footer?: string
  }
}
```

**Example:** Use `prettier` to transform the content before writing to the file:

```ts
const prettier = require('prettier')
const prettierOptions = prettier.resolveConfig(__dirname + '..')

module.exports = {
  plugins: [
    require('postcss-typescript-d-ts')({
      transformContent: ({ content }) =>
        prettier.format(content, {
          parser: 'typescript',
          ...prettierOptions,
        }),
    }),
    require('postcss-modules'),
  ],
}
```

<details>
  <summary>Or passing object instead of array</summary>

```ts
const prettier = require('prettier')
const prettierOptions = prettier.resolveConfig(__dirname + '..')

module.exports = {
  plugins: {
    'postcss-typescript-d-ts': {
      transformContent: ({ content }) =>
        prettier.format(content, {
          parser: 'typescript',
          ...prettierOptions,
        }),
    },
    'postcss-modules': {},
  },
}
```

</details>

[official docs]: https://github.com/postcss/postcss#usage

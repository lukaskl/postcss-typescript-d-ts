import { Plugin } from 'postcss'

import { defaultWriteFile, getClasses, WriteFileProps } from './utils'

export interface TypeScriptDefinitionsPluginOptions {
  writeFile?: (props: WriteFileProps) => Promise<void> | void
  extra?: {
    header?: string
    footer?: string
  }
}

export const plugin = (
  opts: TypeScriptDefinitionsPluginOptions = {}
): Plugin => {
  const { writeFile = defaultWriteFile, extra }: typeof opts = opts
  const cache: { [path: string]: Set<string> } = {}

  return {
    postcssPlugin: 'postcss-typescript-d-ts',
    Once: (root) => {
      const file = root.source?.input.file
      if (!file) {
        root.warn(
          root.toResult(),
          `Filepath for the plugin "postcss-typescript-d-ts" was expected, however "${JSON.stringify(
            file
          )}" was received.`
        )
        return
      }
      cache[file] = new Set<string>()
    },

    OnceExit: (root) => {
      const file = root.source?.input.file
      if (!file) {
        // warning was already outputted by the `Once` event.
        return
      }
      const set = cache[file]
      if (!set) {
        root.warn(
          root.toResult(),
          `There is a bug in "postcss-typescript-d-ts" plugin, set of classes expected to be truthy but it was falsy.`
        )
      }
      const classes = Array.from(set)
      delete cache[file]

      if (classes.length === 0) {
        return
      }

      const classesProps = classes.map((x) => `'${x}': string`).join('\n  ')
      const classesDefinition = [
        'declare const styles: {',
        `  ${classesProps}`,
        '}',
        '',
        'export default styles',
        '',
      ].join('\n')

      const content = [extra?.header, classesDefinition, extra?.footer]
        .filter((x) => !!x)
        .join('\n')

      writeFile({
        content,
        paths: { cssFile: file, dtsFile: file + '.d.ts' },
        parts: { ...extra, classes },
      })
    },

    Rule: async (rule, { result }) => {
      const file = rule.source?.input.file
      if (!file) {
        // warning was already outputted by the `Once` event.
        return
      }
      const set = cache[file]
      if (!set) {
        rule.warn(
          result,
          `There is a bug in "postcss-typescript-d-ts" plugin, set of classes expected to be truthy but it was falsy.`
        )
      }

      const classes = await getClasses(rule.selector)

      classes.forEach((c) => set.add(c))
    },
  }
}

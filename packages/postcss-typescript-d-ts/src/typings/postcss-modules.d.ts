declare module 'postcss-modules' {
  import { PluginCreator } from 'postcss'

  interface PostcssModulesPluginProps {
    getJSON: (
      cssFile: unknown,
      json: unknown,
      outputFileName: unknown
    ) => unknown
  }
  const plugin: PluginCreator<PostcssModulesPluginProps>
  export default plugin
}

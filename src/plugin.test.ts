import postcss, { AcceptedPlugin } from 'postcss'
import postcssModules from 'postcss-modules'
import postcssNested from 'postcss-nested'
import postcssNesting from 'postcss-nesting'

import { plugin, TypeScriptDefinitionsPluginOptions } from './plugin'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

interface ProcessOptions extends TypeScriptDefinitionsPluginOptions {
  extraPlugins?: AcceptedPlugin[]
}
const getProcessor = (opts: ProcessOptions = {}) => {
  const { extraPlugins = [], ...tsOptions }: typeof opts = opts
  const processor = postcss([
    ...extraPlugins,
    plugin(tsOptions),
    postcssModules({ getJSON: noop }),
  ])

  const process = async (cssInput: string) =>
    await processor.process(cssInput, {
      from: __dirname,
      to: undefined,
    })

  return { process, processor }
}

it('ignores non classes', async () => {
  const writeFile = jest.fn()
  const { process } = getProcessor({ writeFile })

  const result = await process(`a:hover{} a{} .b:focus{}`)

  expect(writeFile).toHaveBeenCalledTimes(1)
  const { content } = writeFile.mock.calls[0][0]
  expect(content).toMatchInlineSnapshot(`
    "declare const styles: {
      'b': string
    }

    export default styles
    "
  `)
  expect(result.warnings()).toHaveLength(0)
})

it('ignores files without class declarations', async () => {
  const writeFile = jest.fn()
  const { process } = getProcessor({ writeFile })

  const result = await process(`a{} body{}`)

  expect(writeFile).toHaveBeenCalledTimes(0)
  expect(result.warnings()).toHaveLength(0)
})

it('generates declaration files for simple classes', async () => {
  const writeFile = jest.fn()
  const { process } = getProcessor({ writeFile })

  const result = await process(`.a{}`)

  expect(writeFile).toHaveBeenCalledTimes(1)
  const { content } = writeFile.mock.calls[0][0]
  expect(content).toMatchInlineSnapshot(`
    "declare const styles: {
      'a': string
    }

    export default styles
    "
  `)
  expect(result.warnings()).toHaveLength(0)
})

it('merges classes', async () => {
  const writeFile = jest.fn()
  const { process } = getProcessor({ writeFile })

  const result = await process(`.a{} .a{} .a:focus{} .a:hover{}`)

  expect(writeFile).toHaveBeenCalledTimes(1)
  const { content } = writeFile.mock.calls[0][0]
  expect(content).toMatchInlineSnapshot(`
    "declare const styles: {
      'a': string
    }

    export default styles
    "
  `)
  expect(result.warnings()).toHaveLength(0)
})

it('picks multiple classes per selector', async () => {
  const writeFile = jest.fn()
  const { process } = getProcessor({ writeFile })

  const result = await process(`.a .b, .c.d{}`)

  expect(writeFile).toHaveBeenCalledTimes(1)
  const { content } = writeFile.mock.calls[0][0]
  expect(content).toMatchInlineSnapshot(`
    "declare const styles: {
      'a': string
      'b': string
      'c': string
      'd': string
    }

    export default styles
    "
  `)
  expect(result.warnings()).toHaveLength(0)
})

it('works with nested classes (postcss-nested)', async () => {
  const writeFile = jest.fn()
  const { process } = getProcessor({ writeFile, extraPlugins: [postcssNested] })

  const result = await process(`.a { .b{} &-b {} }`)

  expect(writeFile).toHaveBeenCalledTimes(1)
  const { content } = writeFile.mock.calls[0][0]
  expect(content).toMatchInlineSnapshot(`
    "declare const styles: {
      'a': string
      'b': string
      'a-b': string
    }

    export default styles
    "
  `)
  expect(result.warnings()).toHaveLength(0)
})

it('works with nested classes (postcss-nesting)', async () => {
  const writeFile = jest.fn()
  const { process } = getProcessor({
    writeFile,
    extraPlugins: [postcssNesting],
  })

  const result = await process(`.a, .b { & .c, & .d {}}`)

  expect(writeFile).toHaveBeenCalledTimes(1)
  const { content } = writeFile.mock.calls[0][0]
  expect(content).toMatchInlineSnapshot(`
    "declare const styles: {
      'a': string
      'c': string
      'd': string
      'b': string
    }

    export default styles
    "
  `)
  expect(result.warnings()).toHaveLength(0)
})

import postcss from 'postcss'

import plugin from './'

async function run(input: string, output: string, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('does something', async () => {
  await run('a{ }', 'a{ }', {})
})

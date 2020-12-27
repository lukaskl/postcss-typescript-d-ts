const prettier = require('prettier')
const prettierOptions = prettier.resolveConfig(__dirname + '..')

module.exports = {
  plugins: {
    'postcss-nested': {},
    // In real world cases this should be without the "/dist"
    'postcss-typescript-d-ts/dist': {
      transformContent: ({ content }) =>
        prettier.format(content, {
          parser: 'typescript',
          ...prettierOptions,
        }),
    },
    'postcss-modules': {},
  },
}

// OR:

module.exports = {
  plugins: [
    require('postcss-nested'),
    require('postcss-typescript-d-ts/dist')({
      transformContent: ({ content }) =>
        prettier.format(content, {
          parser: 'typescript',
          ...prettierOptions,
        }),
    }),
    require('postcss-modules'),
  ],
}

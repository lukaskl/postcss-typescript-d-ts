const prettier = require('prettier')
const prettierOptions = prettier.resolveConfig(__dirname + '..')

module.exports = {
  plugins: {
    'postcss-nested': {},
    'postcss-typescript-d-ts/dist': {
      transformContent: ({ content }) =>
        prettier.format(content, {
          parser: 'typescript',
          ...prettierOptions,
        }),
    },
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
      },
    },
  },
}

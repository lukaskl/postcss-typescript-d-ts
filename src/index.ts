const plugin = (opts = {}) => {
  // Work with options here

  return {
    postcssPlugin: 'postcss-typescript-d-ts',
    /*
    Root (root, postcss) {
      // Transform CSS AST here
    }
    */

    /*
    Declaration (decl, postcss) {
      // The faster way to find Declaration node
    }
    */

    /*
    Declaration: {
      color: (decl, postcss) {
        // The fastest way find Declaration node if you know property name
      }
    }
    */
  }
}
export const postcss = true
export default plugin

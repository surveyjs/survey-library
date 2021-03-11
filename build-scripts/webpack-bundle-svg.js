class BundleSvgPlugin {
  apply(compiler) {
    compiler.hooks.afterEnvironment.tap('BundleSvgPlugin', (params) => {
        // params['MyPlugin - data'] = 'important stuff my plugin will use later';
      });
  }
}

module.exports = BundleSvgPlugin;

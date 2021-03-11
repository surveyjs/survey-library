function DashedNamePlugin(options) {}

DashedNamePlugin.prototype.apply = function (compiler) {
  const REGEXP_NAME = /\[dashedname\]/gi;

  compiler.hooks.compilation.tap("RemoveCoreFromNamePlugin", (compilation) => {
    const mainTemplate = compilation.mainTemplate;

    mainTemplate.hooks.assetPath.tap(
      "DashedNamePlugin",
      (path, data) => {
        const chunk = data.chunk;
        const chunkName = chunk && (chunk.name || chunk.id);

        if (typeof path === "function") {
          path = path(data);
        }

        return path.replace(REGEXP_NAME, (match, ...args) => {
          return chunkName.replace(/\./g, "-");
        });
      }
    );
  });
};

module.exports = DashedNamePlugin;

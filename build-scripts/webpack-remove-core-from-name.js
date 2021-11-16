function RemoveCoreFromNamePlugin(options) {}

RemoveCoreFromNamePlugin.prototype.apply = function (compiler) {
  const REGEXP_NAME = /\[rc-name\]/gi;

  compiler.hooks.compilation.tap("RemoveCoreFromNamePlugin", (compilation) => {
    const mainTemplate = compilation.mainTemplate;

    mainTemplate.hooks.assetPath.tap(
      "RemoveCoreFromNamePlugin",
      (path, data) => {
        const chunk = data.chunk;
        const chunkName = chunk && (chunk.name || chunk.id);

        if (typeof path === "function") {
          path = path(data);
        }

        return path.replace(REGEXP_NAME, (match, ...args) => {
          return chunkName !== "modern" && chunkName !== "defaultV2" ? "survey" : chunkName;
        });
      }
    );
  });
};

module.exports = RemoveCoreFromNamePlugin;

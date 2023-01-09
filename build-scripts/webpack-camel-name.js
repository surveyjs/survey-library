function CamelCaseNamePlugin(options) {}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

CamelCaseNamePlugin.prototype.apply = function (compiler) {
  const REGEXP_NAME = /\[camelname\]/gi;

  compiler.hooks.compilation.tap("RemoveCoreFromNamePlugin", (compilation) => {
    const mainTemplate = compilation.mainTemplate;

    mainTemplate.hooks.assetPath.tap(
      "CamelCaseNamePlugin",
      (path, data) => {
        const chunk = data.chunk;
        const chunkName = chunk && (chunk.name || chunk.id);

        if (typeof path === "function") {
          path = path(data);
        }

        return path.replace(REGEXP_NAME, (match, ...args) => {
          const parts = chunkName.split("-");
          return parts.map(function(part) { return capitalizeFirstLetter(part) }).join("");
        });
      }
    );
  });
};

module.exports = CamelCaseNamePlugin;

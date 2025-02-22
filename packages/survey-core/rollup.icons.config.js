const defaultConfig = require("./rollup.config");
const path = require("path");
const glob = require("fast-glob").glob;
const readFile = require("fs").readFileSync;
const input = {
  "iconsV1": path.resolve(__dirname, "./src/iconsV1-es.ts"),
  "iconsV2": path.resolve(__dirname, "./src/iconsV2-es.ts"),
};
module.exports = () => {
  let options = {
    dir: path.resolve(__dirname, "./build/fesm/icons"),
    tsconfig: path.resolve(__dirname, "./tsconfig.icons.json")
  };
  const config = defaultConfig(options);
  const iconsMap = {
    "iconsV1": path.resolve(__dirname, "./src/images-v1/*.svg"),
    "iconsV2": path.resolve(__dirname, "./src/images-v2/*.svg")
  };
  config.plugins.push({
    name: "icons",
    resolveId: (id) => {
      if (Object.keys(iconsMap).includes(id)) {
        return id;
      }
    },
    load: async (id) => {
      if (Object.keys(iconsMap).includes(id)) {
        const icons = {};
        for (const iconPath of await glob(iconsMap[id])) {
          const [fname] = iconPath.split("/").slice(-1);
          icons[fname.replace(/\.svg$/, "").toLocaleLowerCase()] = readFile(iconPath).toString();
        }
        return `export default ${JSON.stringify(icons, undefined, "\t")}`;
      }
    }
  });
  config.input = input;
  return config;
};
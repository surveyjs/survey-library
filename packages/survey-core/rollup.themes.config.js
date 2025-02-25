const defaultConfig = require("./rollup.config");
const path = require("path");
const input = { index: path.resolve(__dirname, "./src/themes/index.ts") };
module.exports = () => {
  let options = {
    dir: path.resolve(__dirname, "./build/fesm/themes"),
    tsconfig: path.resolve(__dirname, "./tsconfig.themes.json")
  };
  const config = defaultConfig(options);
  config.input = input;
  return config;
};
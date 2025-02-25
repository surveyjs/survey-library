const defaultConfig = require("./rollup.config");
const path = require("path");
const fs = require("fs");
const input = {
  "survey.i18n": path.resolve(__dirname, "./entries/i18n.ts")
};

function patchEntries() {
  fs.readdirSync(path.resolve(__dirname, "./src/localization")).forEach(file => {
    var extension = path.extname(file);
    if (extension.toLowerCase() === ".ts") {
      input[`i18n/${path.basename(file, extension)}`] = (path.resolve(__dirname, "./src/localization") + "/" + file);
    }
  });
  input["i18n/index"] = path.resolve(__dirname, "./entries/i18n.ts");
}

module.exports = () => {
  let options = {
    tsconfig: path.resolve(__dirname, "./tsconfig.i18n.json")
  };
  const config = defaultConfig(options);
  patchEntries();
  config.input = input;
  config.external = ["survey-core"];
  return config;
};
import webpackCommonConfigCreator from "./webpack.themes.config.js";
import { fileURLToPath, URL } from "node:url";
export default function (options) {
  const config = webpackCommonConfigCreator(options);
  config.optimization.minimize = false;
  config.optimization.concatenateModules = true;
  config.devtool = "source-map";
  config.entry = {
    "themes/index": fileURLToPath(new URL("./src/themes/index.ts", import.meta.url)),
  };
  config.experiments = {
    outputModule: true,
  };
  config.output = {
    filename: "[name]" + ".js",
    path: config.output.path += "/fesm",
    library: {
      type: "modern-module"
    }
  };
  return config;
}

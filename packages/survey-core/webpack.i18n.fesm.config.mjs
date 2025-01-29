import webpackCommonConfigCreator from "./webpack.i18n.config.js";
import path from "path";
export default function (options) {
  const config = webpackCommonConfigCreator(options);
  config.optimization.minimize = false;
  config.devtool = "source-map",
  config.experiments = {
    outputModule: true,
  };
  config.output = {
    filename: "[name]" + ".js",
    path: config.output.path += "/fesm",
    library: {
      type: "module"
    }
  };
  config.externalsType = "module";
  config.externals = {
    "survey-core": "survey-core"
  };
  return config;
}

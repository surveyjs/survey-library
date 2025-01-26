import webpackCommonConfigCreator from "./webpack.config.js";
import path from "path";
export default function (options) {
  const config = webpackCommonConfigCreator(options);
  config.mode = "production";
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
  config.externalsType = "module";
  config.externals = {
    react: "react",
    "react-dom": "react-dom",
    "survey-core": "survey-core"
  };
  const surveyReactUI = config.entry["survey-react-ui"];
  config.entry = {
    "survey-react-ui": surveyReactUI,
  };
  return config;
}

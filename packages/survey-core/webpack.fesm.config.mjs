import webpackCommonConfigCreator from "./webpack.config.js";
import path from "path";
export default function (options) {
  options.tsConfigFile = "tsconfig.fesm.json";
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
  const surveyCore = config.entry["survey.core"];
  config.entry = {
    "survey-core": surveyCore,
  };
  return config;
}

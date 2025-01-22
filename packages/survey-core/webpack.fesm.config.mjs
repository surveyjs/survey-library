import webpackCommonConfigCreator from "./webpack.config.js";
import path from "path";
export default function (options) {
  const config = webpackCommonConfigCreator(options);
  config.experiments = {
    outputModule: true,
  };
  config.output = {
    path: config.output.path += "/fesm",
    module: true,
    library: {
      type: "module"
    }
  };
  config.optimization.concatenateModules = false;
  config.target = "web";
  const surveyCore = config.entry["survey.core"];
  config.entry = {
    "survey-core": surveyCore,
  };
  return config;
}

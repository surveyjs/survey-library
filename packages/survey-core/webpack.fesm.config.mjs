import webpackCommonConfigCreator from "./webpack.config.js";
export default function (options) {
  options.tsConfigFile = "tsconfig.fesm.json";
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
  const surveyCore = config.entry["survey.core"];
  config.entry = {
    "survey-core": surveyCore,
  };
  return config;
}

import webpackCommonConfigCreator from "./webpack.config.js";
import path from "path";

// const { merge } = require("webpack-merge");

export default function (options) {
  const config = webpackCommonConfigCreator(options);
  config.experiments = {
    outputModule: true,
  };
  config.output = {
    path: config.output.path += "/esm",
    module: true,
    library: {
      type: "module"
    }
  };
  config.optimization.concatenateModules = false;
  config.target = "web";

  config.entry = {
    "survey-core": config.entry["survey-core"],
  };
  return config;
};

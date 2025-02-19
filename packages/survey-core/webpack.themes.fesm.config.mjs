import webpackCommonConfigCreator from "./webpack.themes.config.js";
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
  return config;
}

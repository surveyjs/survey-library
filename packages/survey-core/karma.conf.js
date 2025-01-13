const path = require("path");
const webpack = require("webpack");
const webpackConfigCreator = require("./webpack.config");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpackConfig = webpackConfigCreator({ buildType: "dev" });

//process.env.CHROME_BIN = require("puppeteer").executablePath();

/*setup ts config file for tests ("noImplicitAny": false)*/
webpackConfig.resolve.plugins = [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, "./tsconfig.tests.json") })];
webpackConfig.module.rules[0].options.configFile = path.resolve(__dirname, "./tsconfig.tests.json");
module.exports = function (config) {
  config.set({
    basePath: "./",
    frameworks: ["qunit"],
    files: ["tests/entries/*.ts"],
    exclude: [],
    mime: {
      "text/x-typescript": ["ts", "tsx"]
    },
    captureTimeout: 210000,
    browserDisconnectTimeout: 100000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 100000,
    junitReporter: {
      outputDir: "tmp/testresults/",
      outputFile: "test-results.xml"
    },
    preprocessors: {
      "**/*.ts": ["webpack", "sourcemap"]
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      plugins: webpackConfig.plugins.concat([
        new webpack.SourceMapDevToolPlugin({
          filename: null, // if no value is provided the sourcemap is inlined
          test: /\.(ts|js)($|\?)/i // process .js and .ts files only
        }),
        new webpack.ProvidePlugin({
          process: "process/browser",
        }),
      ])
    },
    reporters: ["progress", "dots", "junit"],
    browsers: ["ChromeHeadlessNoSandbox"],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: [
          "--no-sandbox",
          "--disable-gpu",
          "--no-default-browser-check",
          "--no-first-run",
          "--disable-default-apps",
          "--disable-popup-blocking",
          "--disable-translate",
          "--disable-background-timer-throttling",
          "--disable-renderer-backgrounding",
          "--disable-device-discovery-notifications",
          "--disable-web-security"
        ]
      }
    },
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity
  });
};

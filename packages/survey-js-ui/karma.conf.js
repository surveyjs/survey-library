const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");
const packageJson = require("./package.json");
const webpack = require("webpack");
module.exports = function (config) {
  config.set({
    basePath: "",
    files: ["tests/markup.ts"],
    frameworks: ["qunit"],
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
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            loader: "ts-loader",
            options: {
              transpileOnly: false,
              configFile: path.resolve(__dirname, "./tsconfig.tests.json")
            }
          },
          {
            test: /\.html$/,
            loader: "html-loader",
            options: {
              esModule: false
            }
          },
        ]
      },
      resolve: {
        extensions: [".ts", ".js", ".tsx", ".scss"],
        alias: {
          "react": path.resolve(__dirname, "./node_modules/preact/compat"),
          "react-dom/test-utils": path.resolve(__dirname, "./node_modules/preact/test-utils"),
          "react-dom": path.resolve(__dirname, "./node_modules/preact/compat"),
          "react/jsx-runtime": path.resolve(__dirname, "./node_modules/preact/jsx-runtime"),
          "survey-core": path.resolve(__dirname, "./node_modules/survey-core"),
          "survey-core/icons/iconsV1": path.resolve(__dirname, "./node_modules/survey-core/icons/iconsV1"),
          "survey-core/icons/iconsV2": path.resolve(__dirname, "./node_modules/survey-core/icons/iconsV2"),
          "jquery": path.resolve(__dirname, "./node_modules/jquery"),
        }
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.env.VERSION": JSON.stringify(packageJson.version)
        }),
      ]
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
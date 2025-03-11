"use strict";

const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var DashedNamePlugin = require("../../build-scripts/webpack-dashed-name");
const packageJson = require("./package.json");
const fs = require("fs");

const year = new Date().getFullYear();
const banner = [
  "surveyjs - Survey JavaScript library v" + packageJson.version,
  "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

const buildPlatformJson = {
  "name": packageJson.name,
  "version": packageJson.version,
  "description": "survey.js is a JavaScript Survey Library. It is a modern way to add a survey to your website. It uses JSON for survey metadata and results.",
  "keywords": [
    "Survey",
    "JavaScript",
    "Bootstrap",
    "Library",
    "jquery",
    "jquery-plugin"
  ],
  "homepage": "https://surveyjs.io/",
  "license": "MIT",
  "files": [
    "**/*"
  ],
  "main": "survey-js-ui.js",
  "module": "fesm/survey-js-ui.js",
  "typings": "./typings/survey-js-ui/entries/index.d.ts",
  "exports": {
    ".": {
      "types": "./typings/survey-js-ui/entries/index.d.ts",
      "import": "./fesm/survey-js-ui.js",
      "require": "./survey-js-ui.js"
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/surveyjs/surveyjs.git"
  },
  "dependencies": {},
  "peerDependencies": {
    "survey-core": packageJson.version,
    "@types/react-dom": "*",
    "@types/react": "*"
  }
};

module.exports = function (options) {
  const buildPath = __dirname + "/build/";
  const isProductionBuild = options.buildType === "prod";

  const percentage_handler = function handler(percentage, msg) {
    if (0 == percentage) {
      console.log("Build started... good luck!");
    } else if (1 == percentage) {
      if (isProductionBuild) {
        fs.createReadStream("./README.md").pipe(
          fs.createWriteStream(buildPath + "README.md")
        );
      }

      if (isProductionBuild) {
        fs.writeFileSync(
          buildPath + "package.json",
          JSON.stringify(buildPlatformJson, null, 2),
          "utf8"
        );
      }
    }
  };

  const config = {
    mode: isProductionBuild ? "production" : "development",
    entry: {
      [packageJson.name]: path.resolve(__dirname, "./entries/index.ts")
    },
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".scss"],
      alias: {
        "react": path.resolve(__dirname, "./node_modules/preact/compat"),
        "react-dom/test-utils": path.resolve(__dirname, "./node_modules/preact/test-utils"),
        "react-dom": path.resolve(__dirname, "./node_modules/preact/compat"),
        "react/jsx-runtime": path.resolve(__dirname, "./node_modules/preact/jsx-runtime"),
        "survey-core/icons/iconsV1": path.resolve(__dirname, "./node_modules/survey-core/icons/iconsV1"),
        "survey-core/icons/iconsV2": path.resolve(__dirname, "./node_modules/survey-core/icons/iconsV2"),
      }
    },
    optimization: {
      minimize: isProductionBuild
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: "ts-loader",
          options: {
            transpileOnly: isProductionBuild
          }
        },
      ]
    },
    output: {
      path: buildPath,
      filename: "[name]" + (isProductionBuild ? ".min" : "") + ".js",
      library: {
        root: options.libraryName || "SurveyUI",
        amd: "[dashedname]",
        commonjs: "[dashedname]",
      },
      libraryTarget: "umd",
      globalObject: "this",
      umdNamedDefine: true
    },
    externals: [
      {
        "survey-core": {
          root: "Survey",
          commonjs2: "survey-core",
          commonjs: "survey-core",
          amd: "survey-core"
        },
        jquery: {
          root: "jQuery",
          commonjs2: "jquery",
          commonjs: "jquery",
          amd: "jquery"
        },
      }
    ],
    plugins: [
      new DashedNamePlugin(),
      new webpack.ProgressPlugin(percentage_handler),
      new webpack.DefinePlugin({
        "process.env.VERSION": JSON.stringify(packageJson.version)
      }),
      new MiniCssExtractPlugin({
        filename: isProductionBuild ? "[name].min.css" : "[name].css"
      }),
      new webpack.BannerPlugin({
        banner: banner
      })
    ]
  };

  if (isProductionBuild) {
    config.plugins.push = config.plugins.concat([]);
  } else {
    config.devtool = "source-map";
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        inject: "body",
        template: "index.html"
      }),
    ]);
    config.devServer = {
      static: {
        directory: path.join(__dirname, "."),
      },
      //host: "0.0.0.0",
      compress: false,
      port: 7777
    };
  }

  return config;
};
"use strict";

const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var DashedNamePlugin = require("../../build-scripts/webpack-dashed-name");
var RemoveCoreFromName = require("../../build-scripts/webpack-remove-core-from-name");
const mergeFiles = require("merge-files");
const packageJson = require("./package.json");

const today = new Date();
const year = today.getFullYear();

const banner = [
  "surveyjs - Survey JavaScript library v" + packageJson.version,
  "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

var buildPlatformJson = {
  name: packageJson.name,
  version: packageJson.version,
  "description": "survey.js is a JavaScript Survey Library. It is a modern way to add a survey to your website. It uses JSON for survey metadata and results.",
  "keywords": [
    "Survey",
    "JavaScript",
    "Bootstrap",
    "Library",
    "survey",
    "library"
  ],
  "homepage": "https://surveyjs.io/",
  "license": "MIT",
  files: [
    "**/*"
  ],
  "main": "survey-core.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/surveyjs/surveyjs.git"
  },
  typings: "./typings/entries/index.d.ts",
  "typesVersions": {
    "<4.2": {
      "*": [
        "ts3.4/*"
      ]
    }
  }
};

module.exports = function (options) {
  var buildPath = __dirname + "/build/";
  var isProductionBuild = options.buildType === "prod";

  // function createStylesBundleWithFonts() {
  //   const getdir = (filename) => {
  //     return buildPath + filename;
  //   };

  //   if (isProductionBuild) {
  //     let outputPath = getdir("survey-creator-core.min.css");
  //     let inputPathList = [
  //       getdir("fonts.fontless.min.css"),
  //       getdir("survey-creator-core.fontless.min.css")
  //     ];
  //     return mergeFiles(inputPathList, outputPath);
  //   } else {
  //     let outputPath = getdir("survey-creator-core.css");
  //     let inputPathList = [
  //       getdir("fonts.fontless.css"),
  //       getdir("survey-creator-core.fontless.css")
  //     ];
  //     return mergeFiles(inputPathList, outputPath);
  //   }

  // }

  var percentage_handler = function handler(percentage, msg) {
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

      // return createStylesBundleWithFonts();
    }
  };

  var config = {
    mode: isProductionBuild ? "production" : "development",
    entry: {
      [packageJson.name]: path.resolve(__dirname, "./entries/index.ts"),
      defaultV2: path.resolve(__dirname, "./src/defaultV2-theme/defaultV2.scss"),
      "defaultV2.fontless": path.resolve(__dirname, "./src/defaultV2-theme/defaultV2.fontless.scss")
    },
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".scss"],
      //plugins: [new TsconfigPathsPlugin(/*{ configFile: "./tsconfig.json" }*/)],
      // alias: {
      //   tslib: path.join(__dirname, "./src/entries/helpers.ts"),
      // },
    },
    optimization: {
      minimize: isProductionBuild,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: "ts-loader",
          options: {
            configFile: options.tsConfigFile || "tsconfig.json",
            transpileOnly: isProductionBuild
          }
        },
        {
          test: /\.s(c|a)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: ""
              }
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: options.buildType !== "prod",
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: options.buildType !== "prod",
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader",
        },
      ],
    },
    output: {
      path: buildPath,
      filename: "[name]" + (isProductionBuild ? ".min" : "") + ".js",
      library: {
        root: options.libraryName || "Survey",
        amd: '[dashedname]',
        commonjs: '[dashedname]',
      },
      libraryTarget: "umd",
      globalObject: 'this',
      umdNamedDefine: true
    },
    plugins: [
      new webpack.ProgressPlugin(percentage_handler),
      new DashedNamePlugin(),
      new webpack.DefinePlugin({
        "process.env.ENVIRONMENT": JSON.stringify(options.buildType),
        "process.env.VERSION": JSON.stringify(packageJson.version),
      }),
      new RemoveCoreFromName(),
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({
        filename: isProductionBuild ? "[rc-name].min.css" : "[rc-name].css",
      }),
      new webpack.WatchIgnorePlugin({ paths: [/svgbundle\.html/] }),
      new webpack.BannerPlugin({
        banner: banner,
      }),
    ],
  };

  if (isProductionBuild) {
    config.plugins.push = config.plugins.concat([]);
  } else {
    config.devtool = "source-map";
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true }),
    ]);
  }

  return config;
};

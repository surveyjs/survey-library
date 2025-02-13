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
  name: packageJson.name,
  version: packageJson.version,
  "description": "survey.js is a JavaScript Survey Library. It is a modern way to add a survey to your website. It uses JSON for survey metadata and results.",
  "keywords": [
    "Survey",
    "JavaScript",
    "Bootstrap",
    "Library",
    "knockout"
  ],
  "homepage": "https://surveyjs.io/",
  "license": "MIT",
  "files": [
    "**/*"
  ],
  "main": "survey-react-ui.js",
  "module": "fesm/survey-react-ui.js",
  typings: "./typings/entries/index.d.ts",

  "peerDependencies": {
    "survey-core": packageJson.version,
    "react": "^16.5.0 || ^17.0.1 || ^18.1.0 || ^19.0.0",
    "react-dom": "^16.5.0 || ^17.0.1 || ^18.1.0 || ^19.0.0",
  }
};

function getPercentageHandler(emitNonSourceFiles, buildPath) {
  return function handler(percentage, msg) {
    if (0 == percentage) {
      console.log("Build started... good luck!");
    } else if (1 == percentage && emitNonSourceFiles) {
      fs.createReadStream("./README.md").pipe(
        fs.createWriteStream(buildPath + "README.md")
      );
      fs.writeFileSync(
        buildPath + "package.json",
        JSON.stringify(buildPlatformJson, null, 2),
        "utf8"
      );
    }
  };
}

module.exports = function (options) {
  const emitDeclarations = !!options.emitDeclarations;
  const emitNonSourceFiles = !!options.emitNonSourceFiles;
  const buildPath = __dirname + "/build/";
  const isProductionBuild = options.buildType === "prod";
  const compilerOptions = emitDeclarations ? {} : {
    declaration: false,
    declarationDir: null
  };
  const config = {
    mode: isProductionBuild ? "production" : "development",
    entry: {
      [packageJson.name]: path.resolve(__dirname, "./entries/index.ts")
    },
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".scss"],
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
            configFile: options.tsConfigFile || "tsconfig.json",
            compilerOptions
          }
        },
        {
          test: /\.s(c|a)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: options.buildType !== "prod"
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: options.buildType !== "prod"
              }
            }
          ]
        },
        {
          test: /\.(svg|png)$/,
          use: {
            loader: "url-loader",
            options: {}
          }
        }
      ]
    },
    output: {
      path: buildPath,
      filename: "[name]" + (isProductionBuild ? ".min" : "") + ".js",
      library: {
        root: options.libraryName || "SurveyReact",
        amd: "[dashedname]",
        commonjs: "[dashedname]",
      },
      libraryTarget: "umd",
      globalObject: "this",
      umdNamedDefine: true
    },
    externals: {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      },
      "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
      },
      "survey-core": {
        root: "Survey",
        commonjs2: "survey-core",
        commonjs: "survey-core",
        amd: "survey-core"
      },
    },
    plugins: [
      new DashedNamePlugin(),
      new webpack.ProgressPlugin(getPercentageHandler(emitNonSourceFiles, buildPath)),
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

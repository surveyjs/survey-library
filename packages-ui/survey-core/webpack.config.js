"use strict";

var webpack = require("webpack");
var path = require("path");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
//var TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
var dts = require("dts-bundle");
var rimraf = require("rimraf");
var packageJson = require("./package.json");
var fs = require("fs");
var replace = require("replace-in-file");
var svgStoreUtils = require(path.resolve(
  __dirname,
  "./node_modules/webpack-svgstore-plugin/src/helpers/utils.js"
));

var banner = [
  "surveyjs - Survey JavaScript library v" + packageJson.version,
  "Copyright (c) 2015-2020 Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)"
].join("\n");

// TODO add to dts_bundler
var dts_banner = [
  "Type definitions for Survey JavaScript library v" + packageJson.version,
  "Copyright (c) 2015-2020 Devsoft Baltic OÜ  - http://surveyjs.io/",
  "Definitions by: Devsoft Baltic OÜ <https://github.com/surveyjs/>",
  ""
].join("\n");

module.exports = function (options) {
  var buildPath = __dirname + "/build/";
  var isProductionBuild = options.buildType === "prod";

  function createSVGBundle() {
    var options = {
      fileName: path.resolve(__dirname, "./svgbundle.html"),
      template: path.resolve(__dirname, "../svgbundle.pug"),
      svgoOptions: {
        plugins: [{ removeTitle: true }],
      },
      prefix: "icon-",
    };

    svgStoreUtils.filesMap(path.join("./src/images/**/*.svg"), (files) => {
      const fileContent = svgStoreUtils.createSprite(
        svgStoreUtils.parseFiles(files, options),
        options.template
      );

      fs.writeFileSync(options.fileName, fileContent);
    });
  }

  var percentage_handler = function handler(percentage, msg) {
    if (0 == percentage) {
      console.log("Build started... good luck!");
      createSVGBundle();
    } else if (1 == percentage) {
      if (isProductionBuild) {
        dts.bundle({
          name: "../../" + packageJson.name,
          main: buildPath + "typings/entries/core.d.ts",
          outputAsModuleFolder: true,
          headerText: dts_banner,
        });

        replace.sync(
          {
            files: buildPath + packageJson.name + ".d.ts",
            from: /export let\s+\w+:\s+\w+;/,
            to: "",
          },
          (error, changes) => {
            if (error) {
              return console.error("Error occurred:", error);
            }
            console.log("check me :     " + buildPath + packageJson.name + ".d.ts");
            console.log("Modified files:", changes.join(", "));
          }
        );

        rimraf.sync(buildPath + "typings");
      }
    }
  };

  var config = {
    mode: isProductionBuild ? "production" : "development",
    entry: {
      [packageJson.name]: path.resolve(__dirname, "../../src/entries/core.ts"),
    },
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".scss"],
      //plugins: [new TsconfigPathsPlugin(/*{ configFile: "./tsconfig.json" }*/)],
      alias: {
        tslib: path.join(__dirname, "../../src/entries/chunks/helpers.ts"),
      },
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
            compilerOptions: {
              declaration: isProductionBuild,
              outDir: buildPath + "typings/",
            },
          },
        },
        {
          test: /\.css$/,
          loader: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: options.buildType !== "prod",
              },
            },
          ],
        },
        {
          test: /\.s(c|a)ss$/,
          loader: [
            MiniCssExtractPlugin.loader,
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
          test: /\.html$/,
          loader: "html-loader",
        },
        {
          test: /\.(svg|png)$/,
          use: {
            loader: "url-loader",
            options: {},
          },
        },
      ],
    },
    output: {
      path: buildPath,
      filename: "[name]" + (isProductionBuild ? ".min" : "") + ".js",
      library: options.libraryName || "SurveyCore",
      libraryTarget: "umd",
      umdNamedDefine: true,
    },
    plugins: [
      new webpack.ProgressPlugin(percentage_handler),
      new webpack.DefinePlugin({
        "process.env.ENVIRONMENT": JSON.stringify(options.buildType),
        "process.env.VERSION": JSON.stringify(packageJson.version),
      }),
      new MiniCssExtractPlugin({
        filename: isProductionBuild ? "[name].min.css" : "[name].css",
      }),
      new webpack.WatchIgnorePlugin([/svgbundle\.html/]),
      new webpack.BannerPlugin({
        banner: banner,
      }),
    ],
  };

  if (isProductionBuild) {
    config.plugins.push = config.plugins.concat([]);
  } else {
    config.devtool = "inline-source-map";
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true }),
    ]);
  }

  return config;
};

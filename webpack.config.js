"use strict";

var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var dts = require("dts-bundle");
var rimraf = require("rimraf");
var GenerateJsonPlugin = require("generate-json-webpack-plugin");
var packageJson = require("./package.json");
var fs = require("fs");
var replace = require("replace-in-file");

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

var platformOptions = {
  react: {
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
      }
    },
    keywords: ["react", "react-component"],
    peerDependencies: {
      react: "^16.5.0",
      "react-dom": "^16.5.0"
    }
  },
  knockout: {
    externals: {
      knockout: {
        root: "ko",
        commonjs2: "knockout",
        commonjs: "knockout",
        amd: "knockout"
      }
    },
    keywords: ["knockout"],
    dependencies: { knockout: "^3.5.0" }
  },
  jquery: {
    externals: {
      jquery: {
        root: "jQuery",
        commonjs2: "jquery",
        commonjs: "jquery",
        amd: "jquery"
      }
    },
    keywords: ["jquery", "jquery-plugin"],
    dependencies: {
      jquery: ">=1.12.4"
    }
  },
  angular: {
    externals: {},
    keywords: ["angular", "angular-component"],
    dependencies: {}
  },
  vue: {
    externals: {
      vue: {
        root: "Vue",
        commonjs2: "vue",
        commonjs: "vue",
        amd: "vue"
      }
    },
    keywords: ["vue"],
    dependencies: { vue: "^2.1.10" }
  },
  core: {
    externals: {},
    keywords: ["survey", "library"],
    dependencies: {}
  }
};

module.exports = function(options) {
  //TODO
  options.platformPrefix =
    options.platform == "knockout" ? "ko" : options.platform;
  var packagePath = "./packages/survey-" + options.platform + "/";
  var mainThemeExtractCss = new ExtractTextPlugin({
    filename:
      packagePath +
      (options.buildType === "prod" ? "survey.min.css" : "survey.css")
  });

  var modernThemeExtractCss = new ExtractTextPlugin({
    filename:
      packagePath + (options.buildType === "prod" ? "modern.min.css" : "modern.css")
  });

  var percentage_handler = function handler(percentage, msg) {
    if (0 === percentage) {
      console.log("Build started... good luck!");
    } else if (1 === percentage) {
      if (options.buildType === "prod") {
        dts.bundle({
          name: "../../survey." + options.platformPrefix,
          main: packagePath + "typings/entries/" + options.platform + ".d.ts",
          outputAsModuleFolder: true,
          headerText: dts_banner
        });

        if (options.platform === "vue") {
          replace(
            {
              files: packagePath + "survey.vue.d.ts",
              from: /export default\s+\w+;/g,
              to: ""
            },
            (error, changes) => {
              if (error) {
                return console.error("Error occurred:", error);
              }
              console.log("Modified files:", changes.join(", "));
            }
          );

          fs
            .createReadStream(packagePath + "survey.vue.js")
            .pipe(fs.createWriteStream(packagePath + "survey-vue.js"));
          fs
            .createReadStream(packagePath + "survey.vue.min.js")
            .pipe(fs.createWriteStream(packagePath + "survey-vue.min.js"));
        }

        rimraf.sync(packagePath + "typings");
        fs
          .createReadStream("./npmREADME.md")
          .pipe(fs.createWriteStream(packagePath + "README.md"));
      }
    }
  };

  var mainFile =
    options.platform === "vue"
      ? "survey-vue.js"
      : "survey." + options.platformPrefix + ".js";
  var packagePlatformJson = {
    name: "survey-" + options.platform,
    version: packageJson.version,
    description:
      "survey.js is a JavaScript Survey Library. It is a modern way to add a survey to your website. It uses JSON for survey metadata and results.",
    keywords: ["Survey", "JavaScript", "Bootstrap", "Library"].concat(
      platformOptions[options.platform].keywords
    ),
    homepage: "https://surveyjs.io/",
    license: "MIT",
    files: [
      "survey.css",
      "survey.min.css",
      "modern.css",
      "modern.min.css",
      "survey." + options.platformPrefix + ".d.ts",
      "survey." + options.platformPrefix + ".js",
      "survey." + options.platformPrefix + ".min.js"
    ],
    main: mainFile,
    repository: {
      type: "git",
      url: "https://github.com/surveyjs/surveyjs.git"
    },
    typings: "survey." + options.platformPrefix + ".d.ts"
  };

  if (!!platformOptions[options.platform].dependencies) {
    packagePlatformJson.dependencies =
      platformOptions[options.platform].dependencies;
  }
  if (!!platformOptions[options.platform].peerDependencies) {
    packagePlatformJson.peerDependencies =
      platformOptions[options.platform].peerDependencies;
  }

  var config = {
    entry: {},
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".scss"],
      alias: {
        tslib: path.join(__dirname, "./src/entries/chunks/helpers.ts")
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                declaration: options.buildType === "prod",
                outDir: packagePath + "typings/"
              },
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        },
        {
          test: /\.vue$/,
          use: {
            loader: "vue-loader",
            options: {
              esModule: true
            }
          }
        },
        {
          test: /\.scss$/,
          include: [path.resolve(__dirname, "src/main.scss")],
          use: mainThemeExtractCss.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: options.buildType === "dev",
                  // minimize: options.buildType === "prod",
                  importLoaders: true
                }
              },
              {
                loader: "sass-loader",
                options: {
                  sourceMap: options.buildType === "dev"
                }
              }
            ]
          })
        },
        {
          test: /\.scss$/,
          include: [path.resolve(__dirname, "src/modern.scss")],
          use: modernThemeExtractCss.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: options.buildType === "dev",
                  // minimize: options.buildType === "prod",
                  importLoaders: true
                }
              },
              {
                loader: "sass-loader",
                options: {
                  sourceMap: options.buildType === "dev"
                }
              }
            ]
          })
        },
        {
          test: /\.svg/,
          use: { loader: "url-loader" }
        },
        {
          test: /\.html$/,
          use: { loader: "html-loader" }
        }
      ]
    },
    output: {
      filename:
        packagePath +
        "[name]" +
        (options.buildType === "prod" ? ".min" : "") +
        ".js",
      library: "Survey",
      libraryTarget: "umd",
      umdNamedDefine: true
    },
    externals: platformOptions[options.platform].externals,
    plugins: [
      new webpack.ProgressPlugin(percentage_handler),
      new webpack.DefinePlugin({
        "process.env.ENVIRONMENT": JSON.stringify(options.buildType),
        "process.env.VERSION": JSON.stringify(packageJson.version)
      }),
      new webpack.BannerPlugin({
        banner: banner
      }),
      mainThemeExtractCss,
      modernThemeExtractCss
    ],
    devtool: "inline-source-map"
  };

  if (options.buildType === "prod") {
    config.devtool = false;
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin(),
      new GenerateJsonPlugin(
        packagePath + "package.json",
        packagePlatformJson,
        undefined,
        2
      )
    ]);
  }

  if (options.buildType === "dev") {
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true })
    ]);
  }

  config.entry[
    "survey." + (options.platform == "knockout" ? "ko" : options.platform)
  ] = path.resolve(__dirname, "./src/entries/" + options.platform);

  return config;
};

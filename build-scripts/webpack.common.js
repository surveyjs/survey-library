"use strict";

var webpack = require("webpack");
var path = require("path");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
var RemoveCoreFromName = require("./webpack-remove-core-from-name");
var TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
var GenerateJsonPlugin = require("generate-json-webpack-plugin");
var DashedNamePlugin = require("./webpack-dashed-name");
var CamelCaseNamePlugin = require("./webpack-camel-name");

var packageJsonWithVersion = require("../package.json");
var fs = require("fs");
var replace = require("replace-in-file");
var svgStoreUtils = require(path.resolve(
  __dirname,
  "../node_modules/webpack-svgstore-plugin/src/helpers/utils.js"
));

module.exports = function (options, packageJson, chunkName, buildFolderName) {
  packageJson.version = packageJsonWithVersion.version;
  const today = new Date();
  const year = today.getFullYear();
  var banner = [
    "surveyjs - Survey JavaScript library v" + packageJson.version,
    "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
    "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
  ].join("\n");

  var buildPath = __dirname + "/../build/" + (buildFolderName || packageJson.name) + "/";
  var isProductionBuild = options.buildType === "prod";

  if (!!packageJson.peerDependencies && packageJson.peerDependencies["survey-core"]) {
    packageJson.peerDependencies["survey-core"] = packageJson.version;
  }

  function createSVGBundle() {
    var options = {
      fileName: path.resolve(
        path.join("./src"),
        "./svgbundle.html"
      ),
      template: path.resolve(__dirname, "./svgbundle.pug"),
      svgoOptions: {
        plugins: [{ removeTitle: true }],
      },
      prefix: "icon-",
    };

    svgStoreUtils.filesMap(path.join("./src/images/**/*.svg"), files => {
      const fileContent = svgStoreUtils.createSprite(
        svgStoreUtils.parseFiles(files, options),
        options.template
      );
      fs.writeFileSync(options.fileName, fileContent);
    });
  }

  function replaceLines(fileName, regex, to) {
    replace.sync(
      {
        files: fileName,
        from: regex,
        to: to,
      },
      (error, changes) => {
        if (error) {
          return console.error("Error occurred:", error);
        }
        console.log("check me :     " + fileName);
        console.log("Modified files:", changes.join(", "));
      }
    );
  }

  function removeLines(fileName, regex) {
    replace.sync(
      {
        files: fileName,
        from: regex,
        to: "",
      },
      (error, changes) => {
        if (error) {
          return console.error("Error occurred:", error);
        }
        console.log("check me :     " + fileName);
        console.log("Modified files:", changes.join(", "));
      }
    );
  }

  var packageName = chunkName || packageJson.name;

  var percentage_handler = function handler(percentage, msg) {
    if (0 == percentage) {
      console.log("Build started... good luck!");
    } else if (1 == percentage) {
      if (isProductionBuild) {
        if (fs.existsSync(buildPath + "survey.vue.js"))
          fs.copyFileSync(
            buildPath + "survey.vue.js",
            buildPath + "survey-vue.js"
          );
        if (fs.existsSync(buildPath + "survey.vue.min.js"))
          fs.copyFileSync(
            buildPath + "survey.vue.min.js",
            buildPath + "survey-vue.min.js"
          );
        if (fs.existsSync(__dirname + "/" + packageJson.name + "/README.md"))
          fs.copyFileSync(
            __dirname + "/" + packageJson.name + "/README.md",
            buildPath + "/README.md"
          );
      }
    }
  };

  var config = {
    mode: isProductionBuild ? "production" : "development",
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".scss"],
      plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
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
            //transpileOnly: options.buildType !== "prod",
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        {
          test: /\.vue$/,
          use: {
            loader: "vue-loader",
            options: {
              esModule: true,
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
          test: /\.(svg)$/,
          use: {
            loader: "svg-inline-loader",
            options: {},
          },
        },
      ],
    },
    output: {
      path: buildPath,
      filename: "[name]" + (isProductionBuild ? ".min" : "") + ".js",
      library: {
        root: options.libraryName,
        amd: '[dashedname]',
        commonjs: '[dashedname]',
      },
      libraryTarget: "umd",
      globalObject: 'this',
      umdNamedDefine: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.ENVIRONMENT": JSON.stringify(options.buildType),
        "process.env.VERSION": JSON.stringify(packageJson.version),
        "process.env.RELEASE_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
      }),
      new MiniCssExtractPlugin({
        filename: isProductionBuild ? "[rc-name].min.css" : "[rc-name].css",
      }),
      new VueLoaderPlugin(),
      new webpack.WatchIgnorePlugin([/svgbundle\.html/]),
      new webpack.BannerPlugin({
        banner: banner,
      }),
      new RemoveCoreFromName(),
      new FixStyleOnlyEntriesPlugin(),
      new DashedNamePlugin(),
      new CamelCaseNamePlugin()
    ],
  };

  if (!!options.platform) {
    config.plugins.unshift(new webpack.ProgressPlugin(percentage_handler));
    config.entry = {
      [packageName]: path.resolve(
        __dirname,
        "../src/entries/" + options.platform + ".ts"
      ),
    };
  }

  if (isProductionBuild) {
    if (!!options.platform) {
      config.plugins.push(
        new GenerateJsonPlugin(
          /*buildPath +*/ "package.json",
          packageJson,
          undefined,
          2
        )
      );
    }
  } else {
    config.devtool = "source-map";
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true }),
    ]);
  }

  return config;
};
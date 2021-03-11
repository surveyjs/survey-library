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

var dts = require("dts-bundle");
var rimraf = require("rimraf");
var packageJsonWithVersion = require("../package.json");
var fs = require("fs");
var replace = require("replace-in-file");
var svgStoreUtils = require(path.resolve(
  __dirname,
  "../node_modules/webpack-svgstore-plugin/src/helpers/utils.js"
));

module.exports = function(options, packageJson, chunkName) {
  packageJson.version = packageJsonWithVersion.version;

  const today = new Date();
  const year = today.getFullYear();
  var banner = [
    "surveyjs - Survey JavaScript library v" + packageJson.version,
    "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
    "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
  ].join("\n");

  // TODO add to dts_bundler
  var dts_banner = [
    "Type definitions for Survey JavaScript library v" + packageJson.version,
    "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
    "Definitions by: Devsoft Baltic OÜ <https://github.com/surveyjs/>",
    "",
  ].join("\n");

  var buildPath = __dirname + "/../build/" + packageJson.name + "/";
  var isProductionBuild = options.buildType === "prod";

  function createSVGBundle() {
    if (fs.existsSync(__dirname, "./" + packageJson.name)) {
      return;
    }
    var options = {
      fileName: path.resolve(
        __dirname,
        "./" + packageJson.name + "/svgbundle.html"
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
      createSVGBundle();
    } else if (1 == percentage) {
      if (isProductionBuild) {
        dts.bundle({
          name: buildPath + packageName,
          main: buildPath + "typings/entries/" + options.platform + ".d.ts",
          outputAsModuleFolder: true,
          headerText: dts_banner,
        });

        var fileName = buildPath + packageName + ".d.ts";

        if (
          !packageJson.dependencies ||
          !packageJson.dependencies["survey-core"]
        ) {
          removeLines(
            fileName,
            /^import\s+.*("|')survey-core("|');\s*(\n|\r)?/gm
          );
        }
        removeLines(fileName, /^import\s+.*("|')\..*("|');\s*(\n|\r)?/gm);
        removeLines(fileName, /export let\s+\w+:\s+\w+;/g);
        removeLines(fileName, /export default\s+\w+;/g);

        rimraf.sync(buildPath + "typings");

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
    entry: {
      [packageName]: path.resolve(
        __dirname,
        "../src/entries/" + options.platform + ".ts"
      ),
    },
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
            compilerOptions: {
              declaration: isProductionBuild,
              outDir: buildPath + "typings/",
            },
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
      library: {
        root: options.libraryName,
        amd: '[dashedname]',
        commonjs: '[dashedname]',
      },
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
        filename: isProductionBuild ? "[rc-name].min.css" : "[rc-name].css",
      }),
      new VueLoaderPlugin(),
      new webpack.WatchIgnorePlugin([/svgbundle\.html/]),
      new webpack.BannerPlugin({
        banner: banner,
      }),
      new RemoveCoreFromName(),
      new FixStyleOnlyEntriesPlugin(),
      new DashedNamePlugin()
    ],
  };

  if (isProductionBuild) {
    config.plugins.push(
      new GenerateJsonPlugin(
        /*buildPath +*/ "package.json",
        packageJson,
        undefined,
        2
      )
    );
  } else {
    config.devtool = "inline-source-map";
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true }),
    ]);
  }

  return config;
};

import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import bannerPlugin from "rollup-plugin-license";
import terser from "@rollup/plugin-terser";
import { resolve } from "node:path";
import pkg from "./package.json" assert { type: "json" };

import postcss from "rollup-plugin-postcss";

const banner = [
  "surveyjs - Survey JavaScript library v" + pkg.version,
  "Copyright (c) 2015-" + new Date().getFullYear() + " Devsoft Baltic OÜ  - http://surveyjs.io/", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

function omit(fn) {
  return {
    generateBundle(_, bundle) {
      for (const file of Object.keys(bundle)) {
        if (fn(file)) {
          delete bundle[file];
        }
      }
    }
  };
}

function addBannerToCss(text) {
  return {
    generateBundle(_, bundle) {
      for (const file of Object.keys(bundle)) {
        if (file.endsWith(".css")) {
          bundle[file].source = text + "\n" + bundle[file].source;
        }
      }
    }
  };
}

export function createUmdConfigs(options) {

  const { input, globalName, external, globals, dir, tsconfig, declarationDir, emitMinified, exports } = options;

  const commonOutput = {
    dir: dir,
    format: "umd",
    exports: exports || "named",
    name: globalName,
    globals: globals
  };

  const commonOptions = {
    input,
    context: "this",
    external,
  };

  const commonPlugins = [
    nodeResolve(),
    replace({
      preventAssignment: false,
      values: {
        "process.env.RELEASE_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
        "process.env.VERSION": JSON.stringify(pkg.version),
      }
    }),
  ];

  if (Object.keys(input).length > 1) throw Error("umd config accepts only one input");

  const configs = [{
    ...commonOptions,
    plugins: [
      typescript({
        tsconfig: tsconfig,
        compilerOptions: declarationDir ? {
          inlineSources: true,
          sourceMap: true,
          declaration: true,
          declarationDir: declarationDir
        } : {}
      }),
      ...commonPlugins,
      bannerPlugin({
        banner: {
          content: banner,
          commentStyle: "ignored",
        }
      }),
    ],
    output: [
      { ...commonOutput, entryFileNames: "[name].js", sourcemap: true },
    ],
  }];

  if (emitMinified) {
    configs.push({
      ...commonOptions,
      plugins: [
        typescript({
          tsconfig: tsconfig,
          sourceMap: false,
          inlineSources: false,
        }),
        ...commonPlugins,
        terser({ format: { comments: false } }),
        bannerPlugin({
          banner: {
            content: `For license information please see ${Object.keys(input)[0]}.min.js.LICENSE.txt`,
            commentStyle: "ignored",
          },
          thirdParty: {
            output: {
              file: resolve(dir, `${Object.keys(input)[0]}.min.js.LICENSE.txt`),
              template: (dependencies) => {
                // TODO: Not all dependencies are captured here
                // console.info(dependencies);
                return `/*!\n${banner.split("\n").map(str => " * " + str).join("\n")}\n */`;
              }
            }
          }
        })
      ],
      output: [
        { ...commonOutput, entryFileNames: "[name].min.js", sourcemap: false },
      ],
    });
  }
  return configs;
}

export function createEsmConfigs(options) {

  const { input, external, dir, tsconfig, sharedFileName } = options;

  return [{
    context: "this",
    input,
    plugins: [
      nodeResolve(),
      replace({
        preventAssignment: false,
        values: {
          "process.env.RELEASE_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
          "process.env.VERSION": JSON.stringify(pkg.version),
        }
      }),
      typescript({
        tsconfig: tsconfig,
        compilerOptions: {
          declaration: false,
          declarationDir: null,
          "target": "ES6"
        }
      }),
      bannerPlugin({
        banner: {
          content: banner,
          commentStyle: "ignored",
        }
      })
    ],
    external,
    output: [
      {
        dir,
        entryFileNames: "[name].mjs",
        format: "esm",
        exports: "named",
        sourcemap: true,
        chunkFileNames: (chunkInfo) => {
          if (!chunkInfo.isEntry) {
            return sharedFileName;
          }
        },
      }
    ],
  }];
}

export function createCssConfig(options) {

  const result = [];
  const { inputs, output, minified } = options;

  for (const [name, input] of Object.entries(inputs)) {

    result.push({
      input: input,
      output: { file: resolve(output, `${name}.js`) },
      plugins: [
        postcss({
          extract: resolve(output, `${name}.css`),
          minimize: false,
          sourceMap: true,
          use: {
            sass: {
              api: "modern",
              silenceDeprecations: ["legacy-js-api"], // https://github.com/egoist/rollup-plugin-postcss/issues/463
            }
          }
        }),
        omit(e => e.endsWith(".js")),
        addBannerToCss(`/*!\n${banner.split("\n").map(str => " * " + str).join("\n")}\n */`),
      ]
    });

    if (minified) {
      result.push({
        input: input,
        output: { file: resolve(output, `${name}.min.js`) },
        plugins: [
          postcss({
            extract: resolve(output, `${name}.min.css`),
            minimize: true,
            sourceMap: false,
            use: {
              sass: {
                api: "modern",
                silenceDeprecations: ["legacy-js-api"], // https://github.com/egoist/rollup-plugin-postcss/issues/463
              }
            }
          }),
          omit(e => e.endsWith(".js")),
          addBannerToCss(`/*!\n${banner.split("\n").map(str => " * " + str).join("\n")}\n */`),
        ]
      });
    }
  }

  return result;
}
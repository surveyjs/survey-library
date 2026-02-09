import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import bannerPlugin from "rollup-plugin-license";
import terser from "@rollup/plugin-terser";
import { resolve } from "node:path";
import pkg from "./package.json" assert { type: "json" };

import rollupPostcss from "rollup-plugin-postcss";
import postcss from "postcss";
import cssnano from "cssnano";

const banner = [
  "surveyjs - Survey JavaScript library v" + pkg.version,
  "Copyright (c) 2015-" + new Date().getFullYear() + " Devsoft Baltic OÜ  - http://surveyjs.io/", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

function createBanner(e) {
  return `/*!\n${e.split("\n").map(str => " * " + str).join("\n")}\n */`;
}

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

function addBanner(fn, text) {
  return {
    generateBundle(_, bundle) {
      for (const file of Object.keys(bundle)) {
        if (fn(file)) {
          bundle[file].source = text + "\n" + bundle[file].source;
        }
      }
    }
  };
}

export function createUmdConfig(options) {

  const { input, globalName, external, globals, dir, tsconfig, declarationDir, emitMinified, exports } = options;

  const commonOutput = {
    dir: dir,
    format: "umd",
    exports: exports || "named",
    name: globalName,
    globals: globals
  };

  if (Object.keys(input).length > 1) throw Error("umd config accepts only one input");

  return {
    context: "this",
    input,
    external,
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
        compilerOptions: declarationDir ? {
          inlineSources: true,
          sourceMap: true,
          declaration: true,
          declarationDir: declarationDir
        } : {}
      }),
    ],
    output: [
      {
        ...commonOutput,
        entryFileNames: "[name].js",
        sourcemap: true,
        plugins: [
          bannerPlugin({
            banner: {
              content: banner,
              commentStyle: "ignored",
            }
          }),
        ]
      },
      emitMinified && {
        ...commonOutput,
        entryFileNames: "[name].min.js",
        sourcemap: false,
        plugins: [
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
                  return createBanner(banner) + "\n\n" + dependencies.map(e => {
                    return createBanner([
                      `${ e.name } v${e.version } | ${ e.homepage }`,
                      `(c) ${ e.author.name } | Released under the ${ e.license } license`
                    ].join("\n"));
                  }).join("\n\n");
                }
              }
            }
          }),
        ],
      }
    ],
  };
}

export function createEsmConfig(options) {

  const { input, external, dir, tsconfig, sharedFileName } = options;

  return {
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
  };
}

export function createCssConfig(options) {

  const { input, dir, emitMinified } = options;

  if (Object.keys(input).length > 1) throw Error("css config accepts only one input");

  const [name, value] = Object.entries(input)[0];

  return {
    input: value,
    output: [
      {
        file: resolve(dir, `${name}.omitted`),
      },
      {
        file: resolve(dir, `${name}.min.omitted`),
        plugins: [
          omit(e => e.endsWith(".css.map")),
          {
            async generateBundle(_, bundle) {
              for await (const file of Object.keys(bundle)) {
                if (file.endsWith(".css")) {
                  const result = await postcss([cssnano]).process(bundle[file].source, { from: undefined });
                  bundle[file].source = result.css;
                }
              }
            }
          }
        ]
      },
    ],
    plugins: [
      rollupPostcss({
        extract: true,
        minimize: false,
        sourceMap: true,
        use: {
          sass: {
            api: "modern",
            silenceDeprecations: ["legacy-js-api"], // https://github.com/egoist/rollup-plugin-postcss/issues/463
          }
        }
      }),
      omit(e => e.endsWith(".omitted")),
      addBanner(e => e.endsWith(".css"), `/*!\n${banner.split("\n").map(str => " * " + str).join("\n")}\n */`),
    ]
  };
}
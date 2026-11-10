// @ts-check
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";

// JS only - declarations are emitted separately by `tsc -p tsconfig.build.json`
// (see the `build:types` script) into dist/typings, which the `exports` map and
// `typesVersions` reference.
const tsPlugin = () =>
  typescript({
    tsconfig: "./tsconfig.json",
    declaration: false,
    declarationMap: false,
    outputToFilesystem: true
  });

/**
 * Each converter is published behind its own subpath export and its own CDN
 * bundle. The subpath entries emit ESM + CJS + d.ts; the CDN entries emit a
 * single self-contained minified IIFE named `survey.converter.<name>.min.js`
 * (NOT `survey.core.*` - the package is `survey-converter`).
 */
const subpaths = [
  { input: "src/index.ts", out: "dist/index", name: "SurveyConverter" },
  { input: "src/formio/index.ts", out: "dist/formio/index", name: "SurveyConverterFormio" },
  { input: "src/json-schema/index.ts", out: "dist/json-schema/index", name: "SurveyConverterJsonSchema" }
];

const cdn = [
  { input: "src/formio/index.ts", file: "dist/survey.converter.formio.min.js", name: "SurveyConverterFormio" },
  { input: "src/json-schema/index.ts", file: "dist/survey.converter.json-schema.min.js", name: "SurveyConverterJsonSchema" }
];

const config = [];

// Subpath ESM + CJS. d.ts emitted once alongside the ESM build.
for (const s of subpaths) {
  config.push({
    input: s.input,
    output: [
      { file: `${s.out}.mjs`, format: "es", sourcemap: true },
      { file: `${s.out}.js`, format: "cjs", sourcemap: true, exports: "named" }
    ],
    plugins: [nodeResolve(), tsPlugin()]
  });
}

// CDN IIFE bundles - zero runtime deps, so nothing external to mark.
for (const c of cdn) {
  config.push({
    input: c.input,
    output: { file: c.file, format: "iife", name: c.name, sourcemap: true },
    plugins: [nodeResolve(), tsPlugin(), terser()]
  });
}

// CLI (Node, CJS, shebang preserved).
config.push({
  input: "src/cli.ts",
  output: { file: "dist/cli.js", format: "cjs", banner: "#!/usr/bin/env node", sourcemap: true },
  plugins: [nodeResolve(), tsPlugin()]
});

export default config;

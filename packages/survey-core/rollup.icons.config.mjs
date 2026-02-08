import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import svgo from "rollup-plugin-svgo";
import virtual from "@rollup/plugin-virtual";
import fs from "fs";
import terser from "@rollup/plugin-terser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

function generateIconsModule(importBase) {

  const imagesDir = resolve(__dirname, importBase);
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith(".svg"));
  let imports = "";
  let obj = "export const icons = {\n";
  files.forEach((file) => {
    const name = file.replace(/\.svg$/, "").toLowerCase();
    const varName = name.replace(/[^a-zA-Z0-9_]/g, "_");
    const importPath = `${importBase}/${file}`;
    imports += `import ${varName} from '${importPath}';\n`;
    obj += `  "${name}": ${varName},\n`;
  });
  obj += "};\n";
  return `${imports}\n${obj}`;
}

export default () => {

  return [
    ...[
      ["iconsV1", "./src/images-v1"],
      ["iconsV2", "./src/images-v2"]
    ].map(([name, path]) => {
      return {
        input: { [`${name}`]: `virtual:${ name }` },
        output: [{
          dir: resolve(buildPath, "icons"),
          format: "umd",
          entryFileNames: "[name].js",
          name: "Survey",
        }, {
          dir: resolve(buildPath, "icons"),
          format: "umd",
          entryFileNames: "[name].min.js",
          name: "Survey",
          plugins: [
            terser({ format: { comments: false } })
          ]
        }, {
          dir: resolve(buildPath, "fesm", "icons"),
          format: "esm",
          entryFileNames: "[name].mjs",
          name: "Survey",
        }],
        plugins: [
          virtual({
            [`virtual:${ name }`]: generateIconsModule(path)
          }),
          svgo({
            plugins: [
              { name: "removeDimensions", active: true },
              { name: "removeTitle", active: true },
              { name: "removeDesc", active: true },
              { name: "removeUselessDefs", active: true },
              { name: "removeXMLNS", active: false },
            ]
          }),
        ],
      };
    })
  ];

};
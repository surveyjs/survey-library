import * as doc from "./docgenerator";
import * as ts from "typescript";

doc.generateDocumentation(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});
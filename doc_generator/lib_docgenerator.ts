import * as doc from "./docgenerator";
import * as ts from "typescript";
import {JsonObject} from "../src/jsonobject";

doc.setJsonObj(JsonObject.metaData);

doc.generateDocumentation(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});
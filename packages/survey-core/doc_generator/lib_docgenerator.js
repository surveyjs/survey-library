var doc = require("surveyjs-doc-generator");
var ts = require("typescript");
var Survey = require("../build/survey.core");

doc.setJsonObj(Survey.Serializer);

doc.generateDocumentation(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
}, { generateJSONDefinition: true });
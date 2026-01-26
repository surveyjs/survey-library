var fs = require("fs");
var Survey = require("../build/survey.core");

const json = Survey.Serializer.generateSchema();

fs.writeFileSync("./surveyjs_definition.json", JSON.stringify(json, null, 2));
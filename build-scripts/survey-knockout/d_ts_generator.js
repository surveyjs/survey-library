var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/core.ts", "./src/entries/knockout-ui.ts"],
  out: "./build/survey-knockout/survey.knockout.d.ts",
  name: "Type definition for Survey JavaScript library for Knockout",
  license: "MIT (http://www.opensource.org/licenses/mit-license.php)"
});

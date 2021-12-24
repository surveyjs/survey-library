var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/core.ts", "./src/entries/knockout-ui.ts"],
  out: "./build/survey-knockout/survey.knockout.d.ts"
});

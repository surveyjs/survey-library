var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/knockout-ui.ts"],
  out: "./build/survey-knockout-ui/survey-knockout-ui.d.ts",
  paths: {
    "survey-core": ["./build/survey-core/survey.core.d.ts"],
  }    
});

var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/react-ui.ts"],
  out: "./build/survey-react-ui/survey-react-ui.d.ts",
  paths: {
    "survey-core": ["./build/survey-core/survey.core.d.ts"],
  }    
});

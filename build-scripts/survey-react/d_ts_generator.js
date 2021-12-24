var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/core.ts", "./src/entries/react-ui.ts"],
  out: "./build/survey-react-ui/survey.react.d.ts"
});

var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/jquery.ts"],
  out: "./build/survey-jquery/survey.jquery.d.ts"
});

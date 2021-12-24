var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/core.ts"],
  out: "./build/survey-core/survey.core.d.ts"
}
);

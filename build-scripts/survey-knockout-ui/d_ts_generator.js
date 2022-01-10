var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/knockout-ui.ts"],
  out: "./build/survey-knockout-ui/survey-knockout-ui.d.ts",
  name: "Type definition for Survey JavaScript library for Knockout (without core)",
  license: "MIT (http://www.opensource.org/licenses/mit-license.php)",
  excludeImports: true,
  paths: {
    "survey-core": ["./build/survey-core/survey.core.d.ts"],
  }    
});

var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/react-ui.ts"],
  out: "./build/survey-react-ui/survey-react-ui.d.ts",
  name: "Type definition for Survey JavaScript library for React (without core)",
  license: "MIT (http://www.opensource.org/licenses/mit-license.php)",
  excludeImports: true,
  paths: {
    "survey-core": ["./build/survey-core/survey.core.d.ts"],
  }    
});

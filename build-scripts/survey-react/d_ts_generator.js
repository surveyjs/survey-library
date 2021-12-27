var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/core.ts", "./src/entries/react-ui.ts"],
  out: "./build/survey-react-ui/survey.react.d.ts",
  name: "Type definition for Survey JavaScript library for React",
  license: "MIT (http://www.opensource.org/licenses/mit-license.php)"
});

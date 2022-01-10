var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/jquery.ts"],
  out: "./build/survey-jquery/survey.jquery.d.ts",
  name: "Type definition for Survey JavaScript library for jQuery",
  license: "MIT (http://www.opensource.org/licenses/mit-license.php)"
});

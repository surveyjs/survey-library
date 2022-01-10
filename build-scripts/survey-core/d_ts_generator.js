var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/core.ts"],
  out: "./build/survey-core/survey.core.d.ts",
  name: "Type definition for Survey JavaScript library. Platform independent (core)",
  license: "MIT (http://www.opensource.org/licenses/mit-license.php)"
}
);

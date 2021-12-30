var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/angular.ts"],
  out: "./build/survey-angular/survey.angular.d.ts",
  name: "Type definition for Survey JavaScript library for Angular",
  license: "MIT (http://www.opensource.org/licenses/mit-license.php)"
}
);

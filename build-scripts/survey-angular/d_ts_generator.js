var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/angular.ts"],
  out: "./build/survey-angular/survey.angular.d.ts"
}
);

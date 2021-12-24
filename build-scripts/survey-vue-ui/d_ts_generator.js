var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/vue-ui.ts"],
  out: "./build/survey-react-ui/survey.vue.d.ts",
  paths: {
    "survey-core": ["./build/survey-core/survey.core.d.ts"],
  }    
});

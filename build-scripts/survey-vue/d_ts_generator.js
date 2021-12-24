var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/core.ts", "./src/entries/vue-ui.ts"],
  out: "./build/survey-vue/survey.vue.d.ts"
}
);

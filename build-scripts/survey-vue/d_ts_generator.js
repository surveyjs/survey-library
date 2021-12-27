var doc = require("surveyjs-doc-generator");

doc.generateDts({ 
  entries: ["./src/entries/core.ts", "./src/entries/vue-ui.ts"],
  out: "./build/survey-vue/survey.vue.d.ts",
  name: "Type definition for Survey JavaScript library for Vue",
  license: "MIT (http://www.opensource.org/licenses/mit-license.php)"
}
);

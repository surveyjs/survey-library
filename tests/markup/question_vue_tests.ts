
import { testQuestionMarkup } from "./helper";
import { markupTests } from "./etalon";
import { Model as VueModel, Survey as SurveyVue } from "../../src/entries/vue";
import Vue from "vue/dist/vue.js";

var platformDescriptor = {
  name: "Vue",
  survey: null,
  surveyFactory: (json) => new (<any>VueModel)(json),
  getStrFromHtml: (snapshot) => {
    return require("./snapshots/"+snapshot+".snap.html");
  },
  render: (survey, element) => {
    (<any>window).ResizeObserver = function () {
      return {
        observe: () => {},
        disconnect: () => {},
        unobserve: () => {},
      };
    };
    Vue.component("survey", SurveyVue);
    new Vue({ el: element, template: "<survey :survey='survey'/>", data: { survey: survey } });
  }
};

export default QUnit.module("Base");

markupTests.forEach(markupTest => {
  if(markupTest.excludePlatform === platformDescriptor.name) {
    QUnit.skip(markupTest.name, function (assert) {
      testQuestionMarkup(assert, markupTest, platformDescriptor);
    });
  } else {
    QUnit.test(markupTest.name, function (assert) {
      testQuestionMarkup(assert, markupTest, platformDescriptor);
    });
  }
});

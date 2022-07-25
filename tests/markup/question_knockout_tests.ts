
import { testQuestionMarkup } from "./helper";
import { Model as KnockoutModel } from "../../src/entries/knockout";
import { markupTests } from "./etalon";

var platformDescriptor = {
  name: "Knockout",
  survey: null,
  surveyFactory: (json) => new KnockoutModel(json),
  getStrFromHtml: (snapshot) => {
    return require("./snapshots/"+snapshot+".snap.html");
  },
  render: (survey, element) => survey.render(element.id)
};

export default QUnit.module("Base");

markupTests.forEach(markupTest => {
  QUnit.test(markupTest.name, function (assert) {
    testQuestionMarkup(assert, markupTest, platformDescriptor);
  });
});


import { testQuestionMarkup } from "../../../tests/markup/helper";
import { markupTests } from "../../../tests/markup/etalon";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import * as SurveyUI from "../entries/index";
import { Model } from "survey-core";

var platformDescriptor = {
  name: "React",
  survey: null,
  surveyFactory: (json) => new Model(json),
  render: (survey, element) => {
    SurveyUI.renderSurvey(survey, element);
  },
  getStrFromHtml: (snapshot) => {
    return require("../../../tests/markup/snapshots/" + snapshot + ".snap.html");
  },
  finish: (element) => {
    SurveyUI.unmountComponentAtNode(element);
  }
};

export default QUnit.module("Base");

markupTests.forEach(markupTest => {
  QUnit.test(markupTest.name, function (assert) {
    testQuestionMarkup(assert, markupTest, platformDescriptor);
  });
});


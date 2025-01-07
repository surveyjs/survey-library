
import { testQuestionMarkup } from "../../../tests/markup/helper";
import { markupTests } from "../../../tests/markup/etalon";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { Model } from "survey-core";
import { act } from "react-dom/test-utils";
import React from "react";
import ReactDOM from "react-dom";

var platformDescriptor = {
  name: "React",
  survey: null,
  surveyFactory: (json) => new Model(json),
  render: (survey, element) => {
    var component = React.createElement(SurveyReact, { model: survey }, null);
    act(() => {
      ReactDOM.render(
        component,
        element
      );
    });
  },
  getStrFromHtml: (snapshot) => {
    return require("../../../tests/markup/snapshots/" + snapshot + ".snap.html");
  },
  finish: (element) => {
    ReactDOM.unmountComponentAtNode(element);
  }
};

export default QUnit.module("Base");

markupTests.forEach(markupTest => {
  QUnit.test(markupTest.name, function (assert) {
    testQuestionMarkup(assert, markupTest, platformDescriptor);
  });
});


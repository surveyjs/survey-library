
import { testQuestionMarkup } from "./helper";
import { markupTests } from "./etalon";
import { Model as ReactModel, Survey as SurveyReact } from "../../src/entries/react";
import { act } from "react-dom/test-utils";
import React from "react";
import ReactDOM from "react-dom";

var platformDescriptor = {
  name: "React",
  survey: null,
  surveyFactory: (json) => new ReactModel(json),
  render: (survey, element) => {
    var component = React.createElement(SurveyReact, { model: survey }, null);
    act(()=>{
      ReactDOM.render(
        component,
        element
      );
    });
  },
  getStrFromHtml: (snapshot) => {
    return require("./snapshots/"+snapshot+".snap.html");
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


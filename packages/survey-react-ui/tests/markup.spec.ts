import { SurveyModel, Model } from "survey-core";
import { testQuestionMarkup } from "../../../tests/markup/helper";
import { markupTests } from "../../../tests/markup/etalon";
import { describe, it, expect, beforeAll } from "vitest";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import fs from "fs";
import path from "path";

beforeAll(() => {
  (<any>window).ResizeObserver = function () {
    return {
      observe: () => {},
      disconnect: () => {},
      unobserve: () => {},
    };
  };
});

const platformDescriptor = {
  name: "React",
  survey: null,
  surveyFactory: (json: any) => new Model(json),
  render: (survey: SurveyModel, element: HTMLElement) => {
    const component = React.createElement(SurveyReact, { model: survey }, null);
    act(() => {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(component, element);
    });
  },
  getStrFromHtml: (snapshot: string) =>
    fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../tests/markup/snapshots/" + snapshot + ".snap.html"
      ),
      "utf-8"
    ),
  finish: (element: HTMLElement) => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(element);
  },
};

class ExpectAssertAdapter {
  constructor(private expect: any, private done: any, private reject: any) {}
  public equal(actual: any, expected: any, msg: string) {
    try {
      this.expect(actual, msg).toBe(expected);
    } catch(e) {
      this.reject(e);
    }
  }
  public async() {
    return this.done;
  }
}

const whiteList = [/.*/];

describe("markup tests", () => {
  markupTests.forEach((markupTest) => {
    if (whiteList.some((item) => markupTest.snapshot?.search(item) > -1)) {
      it(
        markupTest.name,
        () =>
          new Promise<void>((done, reject) => {
            testQuestionMarkup(
              new ExpectAssertAdapter(expect, done, reject),
              markupTest,
              platformDescriptor
            );
          }),
        1000
      );
    }
  });
});

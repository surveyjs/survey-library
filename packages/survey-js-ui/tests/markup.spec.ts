import { SurveyModel } from "survey-core";
import { testQuestionMarkup } from "../../../tests/markup/helper";
import { markupTests } from "../../../tests/markup/etalon";
import { describe, it, expect, beforeAll } from "vitest";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import * as SurveyUI from "../entries/index";
import fs from "fs";
import path from "path";

beforeAll(() => {
  (window as any).ResizeObserver = function () {
    return {
      observe: () => {},
      disconnect: () => {},
      unobserve: () => {},
    };
  };
});

const platformDescriptor = {
  // NOTE: kept as "React" because the existing snapshot ids and any tests in
  // the shared helper depend on `platform.name`. The framework-free js-ui
  // package shares its DOM markup with the React-based renderer, so the
  // surveyElement id naming stays compatible with the previous Karma run.
  name: "React",
  survey: null as SurveyModel | null,
  surveyFactory: (json: any) => new SurveyModel(json),
  getStrFromHtml: (snapshot: string) =>
    fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../tests/markup/snapshots/" + snapshot + ".snap.html"
      ),
      "utf-8"
    ),
  render: (survey: SurveyModel, element: HTMLElement) => {
    SurveyUI.renderSurvey(survey, element);
  },
  finish: (element: HTMLElement) => {
    SurveyUI.unmountComponentAtNode(element);
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

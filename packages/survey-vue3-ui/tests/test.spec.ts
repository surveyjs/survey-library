import { SurveyModel } from "survey-core";
import { testQuestionMarkup } from "../../../tests/markup/helper";
import { markupTests } from "../../../tests/markup/etalon";
import { describe, it, expect, beforeAll } from "vitest";
import { mount, config } from "@vue/test-utils";
import { surveyPlugin } from "../src/index";
import Survey from "@/Survey.vue";
import fs from "fs";
import path from "path";

beforeAll(() => {
  config.global.plugins.push(surveyPlugin);
  (<any>window).ResizeObserver = function () {
    return {
      observe: () => {},
      disconnect: () => {},
      unobserve: () => {},
    };
  };
});
const platformDescriptor = {
  name: "Vue3",
  survey: null,
  surveyFactory: (json: any) => {
    return new SurveyModel(json);
  },
  getStrFromHtml: (snapshot: string) =>
    fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../tests/markup/snapshots/" + snapshot + ".snap.html"
      ),
      "utf-8"
    ),
  render: (survey: SurveyModel, element: HTMLElement) => {
    mount(Survey, {
      attachTo: element,
      propsData: {
        survey: survey,
      },
    });
  },
};

class ExpectAssertAdapter {
  constructor(private expect: any, private done: any, private reject: any) {}
  public equal(actual: any, expected: any, msg: string) {
    try {
      this.expect(actual, msg).toBe(expected);
    } catch (e) {
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

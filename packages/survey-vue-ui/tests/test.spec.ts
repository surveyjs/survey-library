import { SurveyModel, StylesManager } from "survey-core";
import { testQuestionMarkup } from "../../../tests/markup/helper";
import { markupTests } from "../../../tests/markup/etalon";
import { describe, it, expect, beforeAll } from "vitest";
import { mount, config } from "@vue/test-utils";
import SurveyPlugin from "../src/index";
import Survey from "@/Survey.vue";
import fs from "fs";
import path from "path";

beforeAll(() => {
  config.global.plugins.push(SurveyPlugin);
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
      propsData: {
        survey: survey,
      },
    });
  },
};

class ExpectAssertAdapter {
  constructor(private expect: any, private done: any) {}
  public equal(actual: any, expected: any, msg: string) {
    this.expect.soft(expected, msg).toBe(actual);
  }
  public async() {
    return this.done;
  }
}

const whiteList = ["comment"];

describe("etalon tests", () => {
  markupTests.forEach((markupTest) => {
    if (whiteList.some((item) => markupTest.snapshot?.search(item) > -1)) {
      it(
        markupTest.name,
        () =>
          new Promise<void>((done) => {
            // expect("3434").to.eql("3244");
            testQuestionMarkup(
              new ExpectAssertAdapter(expect, done),
              markupTest,
              platformDescriptor
            );
          })
      );
    }
  });
}, 10000);

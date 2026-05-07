import { SurveyModel, Model } from "survey-core";
import { testQuestionMarkup } from "../../../tests/markup/helper";
import { markupTests } from "../../../tests/markup/etalon";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import fs from "fs";
import path from "path";

const updateSnapshots = process.env.UPDATE_SNAPSHOTS === "1" || process.env.UPDATE_SNAPSHOTS === "true";
const snapshotsDir = path.resolve(__dirname, "../../../tests/markup/snapshots");
const snapshotLogPath = path.resolve(__dirname, ".snapshot-updates.log");
const updatedSnapshots: string[] = [];
if (updateSnapshots) {
  try { fs.unlinkSync(snapshotLogPath); } catch(e) { /* ignore */ }
}

function formatMarkup(html: string): string {
  const tab = "\t";
  let result = "";
  let indent = "";
  html.split(/>\s*</).forEach(function(element) {
    if (element.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }
    result += indent + "<" + element + ">\r\n";
    if (element.match(/^<?\w[^>]*[^/]$/) && !element.startsWith("input")) {
      indent += tab;
    }
  });
  return result.substring(1, result.length - 3);
}

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
  constructor(private expect: any, private done: any, private reject: any, private snapshot?: string) {}
  public equal(actual: any, expected: any, msg: string) {
    if (actual !== expected && updateSnapshots && this.snapshot) {
      try {
        const filePath = path.join(snapshotsDir, this.snapshot + ".snap.html");
        fs.writeFileSync(filePath, formatMarkup(actual), "utf-8");
        updatedSnapshots.push(this.snapshot);
        try { fs.appendFileSync(snapshotLogPath, this.snapshot + "\n"); } catch(e) { /* ignore */ }
        this.done();
        return;
      } catch(e) {
        this.reject(e);
        return;
      }
    }
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
              new ExpectAssertAdapter(expect, done, reject, markupTest.snapshot),
              markupTest,
              platformDescriptor
            );
          }),
        1000
      );
    }
  });

  afterAll(() => {
    // Output is printed by tests/print-snapshot-updates.js after vitest exits.
  });
});

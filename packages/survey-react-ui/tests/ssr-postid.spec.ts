import { SurveyModel } from "survey-core";
import React from "react";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, beforeAll } from "vitest";

// react-dom/server is CJS in v17; require keeps it working under both v17 and v18.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReactDOMServer = require("react-dom/server");

const json = {
  pages: [
    {
      name: "page1",
      elements: [
        { type: "text", name: "q1" },
        { type: "checkbox", name: "q2", hasOther: true, choices: ["a", "b", "c"] },
      ],
    },
    {
      name: "page2",
      elements: [{ type: "comment", name: "q3" }],
    },
  ],
};

beforeAll(() => {
  (<any>window).ResizeObserver = function () {
    return { observe: () => {}, disconnect: () => {}, unobserve: () => {} };
  };
});

function renderToStaticHtml(survey: SurveyModel): string {
  return ReactDOMServer.renderToStaticMarkup(React.createElement(SurveyReact, { model: survey }));
}

describe("SSR id wiring (survey-react-ui)", () => {
  it("Fallback: the server HTML uses the raw ids", () => {
    const survey = new SurveyModel(json);
    const html = renderToStaticHtml(survey);

    const q1 = survey.getQuestionByName("q1");
    expect(q1.renderedId).toBe("sq_0");
    expect(html).toContain("id=\"sq_0i\""); // inputId of the first text question
  });

  it("Determinism: two independent models produce byte-identical markup", () => {
    const s1 = new SurveyModel(json);
    const s2 = new SurveyModel(json);
    expect(renderToStaticHtml(s2)).toBe(renderToStaticHtml(s1));
  });

  it("Invariant: no element's uniqueId reaches the server HTML", () => {
    const survey = new SurveyModel(json);
    const html = renderToStaticHtml(survey);
    survey.getAllQuestions().forEach((q: any) => {
      // uniqueId is an internal number; it must never be rendered as a bare DOM id (the old action
      // id shape, e.g. id="7"). Index-based ids like sq_1i_0 are fine - they are not uniqueIds.
      expect(html).not.toContain("id=\"" + q.uniqueId + "\"");
    });
  });

  it("Two surveys with distinct elementIdPrefix render into one document with zero id collision", () => {
    const s1 = new SurveyModel(json); s1.elementIdPrefix = "a-";
    const s2 = new SurveyModel(json); s2.elementIdPrefix = "b-";
    const html1 = renderToStaticHtml(s1);
    const html2 = renderToStaticHtml(s2);
    expect(html1).toContain("id=\"a-sq_0i\"");
    expect(html2).toContain("id=\"b-sq_0i\"");
    expect(html1).not.toContain("b-sq_0");
    expect(html2).not.toContain("a-sq_0");
  });
});

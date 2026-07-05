import { SurveyModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";

// react-dom/server is CJS in v17; require keeps it working under both v17 and v18.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReactDOMServer = require("react-dom/server");
// Present on React 18+, undefined on React 17 - the same gate the renderer uses.
const reactUseId: (() => string) | undefined = (React as any).useId;

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

describe("SSR renderedIdSuffix wiring (survey-react-ui)", () => {
  it("Fallback: with useId absent, renderedIdSuffix stays empty and the server HTML uses the raw ids", () => {
    const survey = new SurveyModel(json);
    const html = renderToStaticHtml(survey);

    // On React 17 the initializer is inert; on React 18 it assigns a renderedIdSuffix (see the two-pass block).
    if (!reactUseId) {
      expect(survey.renderedIdSuffix).toBe("");
      const q1 = survey.getQuestionByName("q1");
      expect(q1.renderedId).toBe("sq_0");
      expect(html).toContain("id=\"sq_0i\""); // inputId of the first text question
    }
  });

  it("Determinism: two independent models with the same renderedIdSuffix produce byte-identical markup", () => {
    const s1 = new SurveyModel(json);
    const s2 = new SurveyModel(json);
    // Whatever the renderer assigned to s1 (empty on React 17, a useId token on 18), pin s2 to match.
    s2.renderedIdSuffix = s1.renderedIdSuffix;
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

  it("Two surveys with distinct renderedIdPrefix render into one document with zero id collision", () => {
    const s1 = new SurveyModel(json); s1.renderedIdPrefix = "a-";
    const s2 = new SurveyModel(json); s2.renderedIdPrefix = "b-";
    const html1 = renderToStaticHtml(s1);
    const html2 = renderToStaticHtml(s2);
    expect(html1).toContain("id=\"a-sq_0i\"");
    expect(html2).toContain("id=\"b-sq_0i\"");
    expect(html1).not.toContain("b-sq_0");
    expect(html2).not.toContain("a-sq_0");
  });

  // The real acceptance test - a two-pass SSR/hydration check. Needs React 18's useId + hydrateRoot,
  // so it is skipped on the currently pinned React 17 and activates automatically after the bump.
  describe.skipIf(!reactUseId)("two-pass SSR -> hydration (React 18+)", () => {
    afterEach(() => vi.restoreAllMocks());

    it("server ids equal client ids and hydration emits no mismatch warning", () => {
      // Server pass: an independent model, rendered to string the way SSR would.
      const serverModel = new SurveyModel(json);
      // Emulate what the renderer's initializer does on the server, using a fixed token.
      serverModel.renderedIdSuffix = "_srv";
      const serverHtml = ReactDOMServer.renderToString(
        React.createElement(SurveyReact, { model: serverModel })
      );

      // Client pass: a second, independent model, hydrated into the server HTML.
      const container = document.createElement("div");
      container.innerHTML = serverHtml;
      document.body.appendChild(container);
      const clientModel = new SurveyModel(json);
      clientModel.renderedIdSuffix = "_srv";

      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const hydrateRoot = (ReactDOM as any).hydrateRoot;
      act(() => {
        if (hydrateRoot) {
          hydrateRoot(container, React.createElement(SurveyReact, { model: clientModel }));
        } else {
          (ReactDOM as any).hydrate(
            React.createElement(SurveyReact, { model: clientModel }), container
          );
        }
      });

      const mismatch = [...errorSpy.mock.calls, ...warnSpy.mock.calls]
        .map((c) => String(c[0]))
        .filter((m) => /hydrat|did not match|mismatch/i.test(m));
      expect(mismatch).toEqual([]);
      expect(clientModel.getQuestionByName("q1").renderedId)
        .toBe(serverModel.getQuestionByName("q1").renderedId);

      document.body.removeChild(container);
    });
  });
});

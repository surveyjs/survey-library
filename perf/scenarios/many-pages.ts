import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { expectThat, expectEqual } from "../harness/scenario.ts";
import { loadModel } from "./common.ts";
import { cachedSurvey, pagesShown } from "./helpers.ts";

// Page navigation, preview, validation and locale on manyPages only: on large 108 of 109 pages are hidden at load.
// One survey per process; setup puts it back on the page each sample starts from (00, Budgets).

// The required questions of the first pages answered, with values that hide no page.
export function answerRequired(ctx: PerfContext, survey: any, pages: number): void {
  const meta = ctx.fixture.meta;
  const data: { [name: string]: any } = {};
  meta.required.forEach((name: string) => {
    const page = +name.substring(1, name.indexOf("_"));
    if (page < pages) data[name] = meta.answers[name];
  });
  // One merge: a setValue per question re-runs the conditions each time (1,500 of them took 29.5 s).
  survey.mergeData(data);
}

export function pagesSurvey(ctx: PerfContext): any {
  return cachedSurvey(ctx, (survey: any) => answerRequired(ctx, survey, 11));
}

export function manyPagesScenarios(): Array<PerfScenario> {
  return [
    loadModel("manyPages"),
    {
      id: "manyPages/pages/next10", rev: 1, fixture: "manyPages", kind: "action", uses: ["cachedSurvey", "pagesSurvey", "answerRequired", "pagesShown"], counters: pagesShown,
      setup: (ctx: PerfContext): any => {
        const survey = pagesSurvey(ctx);
        survey.currentPageNo = 0;
        return { survey: survey };
      },
      // Validation runs on each page and passes: the required questions are answered.
      run: (ctx: PerfContext, state: any): void => {
        for (let i = 0; i < 10; i++) state.survey.nextPage();
      },
      check: (ctx: PerfContext, state: any): void => expectEqual(state.survey.currentPageNo, 10, "page after ten Next")
    }, {
      id: "manyPages/pages/prev", rev: 1, fixture: "manyPages", kind: "action", uses: ["cachedSurvey", "pagesSurvey", "answerRequired", "pagesShown"], counters: pagesShown,
      setup: (ctx: PerfContext): any => {
        const survey = pagesSurvey(ctx);
        survey.currentPageNo = 10;
        return { survey: survey, from: 10 };
      },
      run: (ctx: PerfContext, state: any): void => { state.survey.prevPage(); },
      check: (ctx: PerfContext, state: any): void => expectEqual(state.survey.currentPageNo, state.from - 5, "five pages back"),
      // One Previous takes about 3 ms: five of them in a sample (02 check 1).
      repeat: 5
    }, {
      id: "manyPages/pages/last", rev: 1, fixture: "manyPages", kind: "action", uses: ["cachedSurvey", "pagesSurvey", "answerRequired", "pagesShown"], counters: pagesShown,
      setup: (ctx: PerfContext): any => {
        const survey = pagesSurvey(ctx);
        survey.currentPageNo = 0;
        return { survey: survey };
      },
      run: (ctx: PerfContext, state: any): void => { state.survey.currentPageNo = state.survey.visiblePageCount - 1; },
      // About 3.5 ms and not repeatable (the second move goes nowhere): its time is reported, its counters judged.
      counterOnly: true,
      check: (ctx: PerfContext, state: any): void => {
        expectEqual(state.survey.currentPageNo, ctx.fixture.meta.pages - 1, "the last page");
        expectThat(state.survey.isLastPage, "isLastPage");
      }
    }, {
      id: "manyPages/pages/preview", rev: 1, fixture: "manyPages", kind: "action", uses: ["cachedSurvey", "answerRequired"],
      setup: (ctx: PerfContext): any => {
        // Every required question answered, so showPreview is not stopped by an error.
        const survey = cachedSurvey(ctx, (s: any) => answerRequired(ctx, s, ctx.fixture.meta.pages));
        survey.currentPageNo = 0;
        return { survey: survey };
      },
      run: (ctx: PerfContext, state: any): void => { state.survey.showPreview(); },
      check: (ctx: PerfContext, state: any): void => expectEqual(state.survey.state, "preview", "survey state"),
      teardown: (ctx: PerfContext, state: any): void => { state.survey.cancelPreview(); }
    }, {
      id: "manyPages/pages/validate", rev: 1, fixture: "manyPages", kind: "action", uses: ["cachedSurvey"],
      setup: (ctx: PerfContext): any => ({ survey: cachedSurvey(ctx), res: undefined }),
      // Nothing is answered: every page is visible and its required questions fail.
      run: (ctx: PerfContext, state: any): void => { state.res = state.survey.validate(); },
      check: (ctx: PerfContext, state: any): void => {
        expectEqual(state.res, false, "validate() with unanswered required questions");
        const first = state.survey.getQuestionByName(ctx.fixture.meta.required[0]);
        expectThat(first.errors.length > 0, "the first required question shows an error");
      }
    }, {
      id: "manyPages/pages/locale", rev: 1, fixture: "manyPages", kind: "action", uses: ["cachedSurvey"],
      setup: (ctx: PerfContext): any => {
        const survey = cachedSurvey(ctx);
        survey.locale = "";
        const q = survey.getAllQuestions(false)[0];
        return { survey: survey, question: q };
      },
      run: (ctx: PerfContext, state: any): void => { state.survey.locale = "de"; },
      // About 6 ms in core, where titles re-render lazily, and not repeatable: counterOnly. The browser suites
      // measure the re-render.
      counterOnly: true,
      check: (ctx: PerfContext, state: any): void => {
        const json = ctx.fixture.json.pages[0].elements[0];
        expectEqual(state.question.locTitle.renderedHtml, json.title.de, "the title in de");
        expectThat(state.survey.pageNextText !== "Next", "the build's German UI strings are loaded");
      },
      teardown: (ctx: PerfContext, state: any): void => { state.survey.locale = ""; }
    }
  ];
}

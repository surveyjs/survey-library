import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { expectThat, expectEqual } from "../harness/scenario.ts";
import { loadModel } from "./common.ts";
import { cachedSurvey, pagesShown } from "./helpers.ts";

// Page navigation, preview, validation and locale on manyPages only: on large 108 of 109 pages are hidden at load.
// One survey per process or page; setup puts it back on the page each sample starts from (00, Budgets). In a page
// Next is a click on the navigation button; preview and locale are model calls, as there is no single element.

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

export function pagesSurvey(ctx: PerfContext): Promise<any> {
  return cachedSurvey(ctx, (survey: any) => answerRequired(ctx, survey, 11));
}

// Back to a page before a sample (untimed); in a page the move is rendered and settled by the sampler.
export async function goToPage(ctx: PerfContext, survey: any, index: number): Promise<void> {
  if (survey.currentPageNo === index) return;
  survey.currentPageNo = index;
  if (ctx.page) await ctx.page.updated();
}

// The rendered page title: the DOM fact of a page move.
export function renderedPageTitle(ctx: PerfContext): string | undefined {
  const el = ctx.page ? ctx.page.query(".sd-page__title") : undefined;
  return el ? (el.textContent || "").trim() : undefined;
}

export function manyPagesScenarios(): Array<PerfScenario> {
  const uses = ["cachedSurvey", "pagesSurvey", "answerRequired", "goToPage", "pagesShown"];
  return [
    loadModel("manyPages"),
    {
      id: "manyPages/pages/next10", rev: 1, fixture: "manyPages", kind: "action", uses: uses.concat(["renderedPageTitle"]), counters: pagesShown,
      setup: async(ctx: PerfContext): Promise<any> => {
        const survey = await pagesSurvey(ctx);
        await goToPage(ctx, survey, 0);
        return { survey: survey, dom: undefined };
      },
      // Validation runs on each page and passes: the required questions are answered.
      run: async(ctx: PerfContext, state: any): Promise<void> => {
        for (let i = 0; i < 10; i++) {
          if (ctx.page) await ctx.page.click(".sd-navigation__next-btn");
          else state.survey.nextPage();
        }
      },
      record: (ctx: PerfContext, state: any): void => { state.dom = renderedPageTitle(ctx); },
      check: (ctx: PerfContext, state: any): void => {
        expectEqual(state.survey.currentPageNo, 10, "page after ten Next");
        if (ctx.page) expectEqual(state.dom, ctx.fixture.json.pages[10].title.default, "the rendered page title");
      }
    }, {
      id: "manyPages/pages/prev", rev: 1, fixture: "manyPages", kind: "action", uses: uses, counters: pagesShown,
      setup: async(ctx: PerfContext): Promise<any> => {
        const survey = await pagesSurvey(ctx);
        await goToPage(ctx, survey, 10);
        return { survey: survey, from: 10 };
      },
      run: (ctx: PerfContext, state: any): void => { state.survey.prevPage(); },
      check: (ctx: PerfContext, state: any): void => expectEqual(state.survey.currentPageNo, state.from - 5, "five pages back"),
      // One Previous takes about 3 ms: five of them in a sample (02 check 1).
      repeat: 5
    }, {
      id: "manyPages/pages/last", rev: 1, fixture: "manyPages", kind: "action", uses: uses, counters: pagesShown,
      setup: async(ctx: PerfContext): Promise<any> => {
        const survey = await pagesSurvey(ctx);
        await goToPage(ctx, survey, 0);
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
      id: "manyPages/pages/preview", rev: 1, fixture: "manyPages", kind: "action", uses: ["cachedSurvey", "answerRequired", "goToPage"],
      setup: async(ctx: PerfContext): Promise<any> => {
        // Every required question answered, so showPreview is not stopped by an error.
        const survey = await cachedSurvey(ctx, (s: any) => answerRequired(ctx, s, ctx.fixture.meta.pages));
        if (survey.state === "preview") {
          survey.cancelPreview();
          if (ctx.page) await ctx.page.updated();
        }
        await goToPage(ctx, survey, 0);
        return { survey: survey, dom: undefined };
      },
      run: async(ctx: PerfContext, state: any): Promise<void> => {
        state.survey.showPreview();
        if (ctx.page) await ctx.page.updated();
      },
      // The preview shows every page's questions on one page.
      record: (ctx: PerfContext, state: any): void => { state.dom = ctx.page ? ctx.page.queryAll(".sd-question").length : undefined; },
      check: (ctx: PerfContext, state: any): void => {
        expectEqual(state.survey.state, "preview", "survey state");
        if (ctx.page) expectThat(state.dom > ctx.fixture.meta.questions / ctx.fixture.meta.pages, "the preview renders the questions of more than one page (" + state.dom + ")");
      }
    }, {
      id: "manyPages/pages/validate", rev: 1, fixture: "manyPages", kind: "action", uses: ["cachedSurvey"],
      setup: async(ctx: PerfContext): Promise<any> => ({ survey: await cachedSurvey(ctx), res: undefined }),
      // Nothing is answered: every page is visible and its required questions fail.
      run: (ctx: PerfContext, state: any): void => { state.res = state.survey.validate(); },
      check: (ctx: PerfContext, state: any): void => {
        expectEqual(state.res, false, "validate() with unanswered required questions");
        const first = state.survey.getQuestionByName(ctx.fixture.meta.required[0]);
        expectThat(first.errors.length > 0, "the first required question shows an error");
      }
    }, {
      id: "manyPages/pages/locale", rev: 1, fixture: "manyPages", kind: "action", uses: ["cachedSurvey", "goToPage"],
      setup: async(ctx: PerfContext): Promise<any> => {
        const survey = await cachedSurvey(ctx);
        await goToPage(ctx, survey, 0);
        if (survey.locale !== "") {
          survey.locale = "";
          if (ctx.page) await ctx.page.updated();
        }
        return { survey: survey, question: survey.getAllQuestions(false)[0], switches: 0, dom: undefined };
      },
      // Each run switches "" <-> "de", so a repeat changes the locale every time: 2 in core (~6 ms each, titles
      // re-render lazily), 3 in the browsers (~15 ms each, the shown page's 15 questions re-render).
      run: async(ctx: PerfContext, state: any): Promise<void> => {
        state.survey.locale = state.survey.locale === "de" ? "" : "de";
        state.switches++;
        if (ctx.page) await ctx.page.updated();
      },
      repeat: 2,
      browser: { repeat: 3 },
      record: (ctx: PerfContext, state: any): void => {
        const title = ctx.page ? ctx.page.query("[data-name=\"" + state.question.name + "\"] .sd-question__title") : undefined;
        state.dom = title ? (title.textContent || "").trim() : undefined;
      },
      check: (ctx: PerfContext, state: any): void => {
        const json = ctx.fixture.json.pages[0].elements[0];
        const isDe = state.switches % 2 === 1;
        expectEqual(state.survey.locale, isDe ? "de" : "", "the locale after " + state.switches + " switches");
        expectEqual(state.question.locTitle.renderedHtml, isDe ? json.title.de : json.title.default, "the title");
        if (isDe) expectThat(state.survey.pageNextText !== "Next", "the build's German UI strings are loaded");
        if (ctx.page) expectThat(!!state.dom && state.dom.indexOf(isDe ? json.title.de : json.title.default) > -1, "the rendered title");
      }
    }
  ];
}

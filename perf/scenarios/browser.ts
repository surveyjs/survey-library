import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { expectThat, expectEqual } from "../harness/scenario.ts";
import { loadSurvey, releaseSurvey, showPageOf, renderedAnswered } from "./helpers.ts";

// Scenarios of the browser suites only (00, The scenarios): load/paint on every fixture, typing on complexLogic.
// The records sort header is in records.ts.

// load/paint: the phases model (new Model, plus survey.data = for records) and paint (render call to the end of the
// update, layout forced). The sum is the sample.
export function loadPaint(fixture: string): PerfScenario {
  const isRecords = fixture.indexOf("records-") === 0;
  const s: PerfScenario = {
    id: fixture + "/load/paint", rev: 1, fixture: fixture, kind: "load",
    setup: (ctx: PerfContext): any => ({ text: ctx.fixture.text, survey: undefined }),
    run: async(ctx: PerfContext, state: any): Promise<any> => {
      const t0 = ctx.now();
      state.survey = new ctx.Survey.Model(JSON.parse(state.text));
      if (ctx.fixture.data) state.survey.data = ctx.fixture.data;
      const t1 = ctx.now();
      await (ctx.page as any).render(state.survey);
      const t2 = ctx.now();
      return { model: t1 - t0, paint: t2 - t1 };
    },
    check: (ctx: PerfContext, state: any): void => {
      ctx.cache.jsonErrors = state.survey.jsonErrors ? state.survey.jsonErrors.length : 0;
      expectEqual(state.survey.pages.length, ctx.fixture.meta.pages, "pages");
      expectThat(!!(ctx.page as any).query(".sd-root-modern"), "the survey is rendered");
      if (isRecords) {
        const rows = (ctx.page as any).queryAll("[data-name=\"orders\"] tbody tr.sd-table__row").length;
        expectEqual(rows, state.survey.getQuestionByName("orders").pageSize, "rendered rows of the first page");
      }
    }
  };
  if (isRecords) s.requires = ["matrixdynamic.pageSize", "paneldynamic.pageSize"];
  return s;
}

// The first visible text question with no setValueIf: the field answer/type types into.
export function typingTarget(survey: any): any {
  return survey.getAllQuestions(true).filter((q: any) => q.getType() === "text" && q.page.isVisible && !q.setValueIf &&
    !/number|date/.test(q.inputType))[0];
}

// answer/type: five characters into a text question with textUpdateMode "onTyping", from the first character to the
// end of the last update.
export function answerType(fixture: string): PerfScenario {
  return {
    id: fixture + "/answer/type", rev: 1, fixture: fixture, kind: "action", uses: ["loadSurvey", "releaseSurvey", "showPageOf", "typingTarget", "renderedAnswered"],
    setup: async(ctx: PerfContext): Promise<any> => {
      const survey = await loadSurvey(ctx, (sv: any) => { sv.textUpdateMode = "onTyping"; });
      const q = typingTarget(survey);
      expectThat(!!q, "a visible text question");
      await showPageOf(ctx, survey, q.name);
      const input = (ctx.page as any).query("[data-name=\"" + q.name + "\"] input");
      expectThat(!!input, "the input of " + q.name);
      expectEqual(renderedAnswered(ctx, q.name), false, "the question is not answered before the sample");
      return { survey: survey, q: q, input: input, text: "abcde", dom: undefined };
    },
    run: async(ctx: PerfContext, s: any): Promise<void> => {
      await (ctx.page as any).type(s.input, s.text);
    },
    record: (ctx: PerfContext, s: any): void => { s.dom = renderedAnswered(ctx, s.q.name); },
    check: (ctx: PerfContext, s: any): void => {
      expectEqual(s.q.value, s.text, "the typed value");
      expectEqual(s.dom, true, "the question renders as answered");
    },
    teardown: (ctx: PerfContext, s: any): void => releaseSurvey(ctx, s.survey)
  };
}

export function browserScenarios(): Array<PerfScenario> {
  const keys = ["large", "expressions", "calculations", "complexLogic", "manyPages", "records-1k", "records-10k"];
  return keys.map(loadPaint).concat([answerType("complexLogic")]);
}

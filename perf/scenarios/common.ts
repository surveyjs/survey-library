import type { PerfScenario, PerfContext } from "../harness/scenario.ts";
import { expectThat, expectEqual } from "../harness/scenario.ts";
import { work } from "../harness/counters.ts";
import { loadSurvey, cachedSurvey, disposeSurvey, expectHidden } from "./helpers.ts";

// Scenario factories shared by several fixtures: loads, answers and outputs (02, The scenarios).

// load/model: the parse sits inside the time, the same in core and in the browser.
export function loadModel(fixture: string): PerfScenario {
  return {
    id: fixture + "/load/model", rev: 1, fixture: fixture, kind: "load", uses: ["disposeSurvey"],
    setup: (ctx: PerfContext): any => ({ text: ctx.fixture.text, survey: undefined }),
    run: (ctx: PerfContext, state: any): void => {
      state.survey = new ctx.Survey.Model(JSON.parse(state.text));
    },
    check: (ctx: PerfContext, state: any): void => {
      expectThat(!!state.survey, "a survey was created");
      ctx.cache.jsonErrors = state.survey.jsonErrors ? state.survey.jsonErrors.length : 0;
      expectEqual(state.survey.pages.length, ctx.fixture.meta.pages, "pages");
      expectEqual(state.survey.getAllQuestions(false).length, ctx.fixture.meta.questions, "questions");
    },
    teardown: (ctx: PerfContext, state: any): void => disposeSurvey(state.survey)
  };
}

// load/design: design mode, then fromJSON.
export function loadDesign(fixture: string): PerfScenario {
  return {
    id: fixture + "/load/design", rev: 1, fixture: fixture, kind: "load", uses: ["disposeSurvey"],
    setup: (ctx: PerfContext): any => ({ text: ctx.fixture.text, survey: undefined }),
    run: (ctx: PerfContext, state: any): void => {
      const survey = new ctx.Survey.Model();
      survey.setDesignMode(true);
      survey.fromJSON(JSON.parse(state.text));
      state.survey = survey;
    },
    check: (ctx: PerfContext, state: any): void => {
      expectThat(state.survey && state.survey.isDesignMode, "the survey is in design mode");
      ctx.cache.jsonErrors = state.survey.jsonErrors ? state.survey.jsonErrors.length : 0;
      expectEqual(state.survey.pages.length, ctx.fixture.meta.pages, "pages");
      expectEqual(state.survey.getAllQuestions(false).length, ctx.fixture.meta.questions, "questions");
    },
    teardown: (ctx: PerfContext, state: any): void => disposeSurvey(state.survey)
  };
}

// answer/first: the most-read chain-start question, to a value that changes visibility (or, on calculations, the
// end of its chain).
// uses names the after/before callbacks: exported functions of perf/scenarios, part of the rev hash.
export function answerFirst(fixture: string, uses: Array<string>, after: (ctx: PerfContext, survey: any, before: any) => void,
  before?: (ctx: PerfContext, survey: any) => any): PerfScenario {
  return {
    id: fixture + "/answer/first", rev: 1, fixture: fixture, kind: "action", uses: ["loadSurvey", "disposeSurvey"].concat(uses),
    setup: (ctx: PerfContext): any => {
      const survey = loadSurvey(ctx);
      return { survey: survey, before: before ? before(ctx, survey) : undefined };
    },
    run: (ctx: PerfContext, state: any): void => {
      state.survey.setValue(ctx.fixture.meta.firstAnswer.name, ctx.fixture.meta.firstAnswer.value);
    },
    check: (ctx: PerfContext, state: any): void => {
      expectEqual(state.survey.getValue(ctx.fixture.meta.firstAnswer.name), ctx.fixture.meta.firstAnswer.value, "the answer is set");
      after(ctx, state.survey, state.before);
    },
    teardown: (ctx: PerfContext, state: any): void => disposeSurvey(state.survey)
  };
}

// answer/next10: ten more answers in one sample, each to a value that differs from the current one.
export function answerNext10(fixture: string, uses: Array<string>, after: (ctx: PerfContext, survey: any, before: any) => void,
  before?: (ctx: PerfContext, survey: any) => any): PerfScenario {
  return {
    id: fixture + "/answer/next10", rev: 1, fixture: fixture, kind: "action", uses: ["loadSurvey", "disposeSurvey"].concat(uses),
    setup: (ctx: PerfContext): any => {
      const survey = loadSurvey(ctx);
      survey.setValue(ctx.fixture.meta.firstAnswer.name, ctx.fixture.meta.firstAnswer.value);
      const answers = ctx.fixture.meta.nextAnswers.slice(0, 10);
      answers.forEach((a: any) => expectThat(survey.getValue(a.name) !== a.value, a.name + " differs before the sample"));
      return { survey: survey, answers: answers, before: before ? before(ctx, survey) : undefined };
    },
    run: (ctx: PerfContext, state: any): void => {
      for (const a of state.answers) state.survey.setValue(a.name, a.value);
    },
    check: (ctx: PerfContext, state: any): void => {
      expectEqual(state.answers.length, 10, "ten answers");
      state.answers.forEach((a: any) => expectEqual(state.survey.getValue(a.name), a.value, a.name));
      after(ctx, state.survey, state.before);
    },
    teardown: (ctx: PerfContext, state: any): void => disposeSurvey(state.survey)
  };
}

// The check of the answer scenarios on expressions and complexLogic: the planned elements are hidden.
export function plannedHidden(ctx: PerfContext, survey: any): void {
  expectHidden(survey, ctx.fixture.meta.plannedElements, "planned element");
}

// After the ten answers, the planned elements of the ten starts are hidden. Each was visible before: an answer may
// also show other elements, so a net count would not tell.
export function nextPlannedVisible(ctx: PerfContext, survey: any): void {
  ctx.fixture.meta.plannedByStart.slice(1, 11).forEach((names: Array<string>) => names.forEach((name: string) => {
    const el = survey.getQuestionByName(name) || survey.getPanelByName(name);
    expectThat(el && el.isVisible, "planned element " + name + " is visible before the ten answers");
  }));
}

export function nextPlannedHidden(ctx: PerfContext, survey: any): void {
  ctx.fixture.meta.plannedByStart.slice(1, 11).forEach((names: Array<string>) => expectHidden(survey, names, "planned element"));
}

// output/*: on a freshly loaded, answered survey. data and toJSON keep it between samples; dispose needs a new one.
export function outputScenarios(fixture: string, answerName: string, answer: (ctx: PerfContext, survey: any) => void): Array<PerfScenario> {
  const answered = (ctx: PerfContext): any => cachedSurvey(ctx, (survey: any) => answer(ctx, survey));
  return [{
    id: fixture + "/output/data", rev: 1, fixture: fixture, kind: "action", uses: ["cachedSurvey", answerName],
    setup: (ctx: PerfContext): any => ({ survey: answered(ctx), data: undefined }),
    run: (ctx: PerfContext, state: any): void => { state.data = state.survey.data; },
    counters: (ctx: PerfContext, state: any): any => ({ answers: work(Object.keys(state.data).length) }),
    // A copy of the stored value, well under a millisecond: its time is reported, its counters judged.
    counterOnly: true,
    check: (ctx: PerfContext, state: any): void => {
      expectThat(state.data && Object.keys(state.data).length > 0, "data has answers");
    }
  }, {
    id: fixture + "/output/toJSON", rev: 1, fixture: fixture, kind: "action", uses: ["cachedSurvey", answerName],
    setup: (ctx: PerfContext): any => ({ survey: answered(ctx), json: undefined }),
    run: (ctx: PerfContext, state: any): void => { state.json = state.survey.toJSON(); },
    counters: (ctx: PerfContext, state: any): any => ({ jsonLength: work(JSON.stringify(state.json).length) }),
    check: (ctx: PerfContext, state: any): void => {
      expectEqual(state.json && state.json.pages.length, ctx.fixture.meta.pages, "toJSON pages");
    }
  }, {
    id: fixture + "/output/dispose", rev: 1, fixture: fixture, kind: "action", uses: ["loadSurvey", answerName],
    setup: (ctx: PerfContext): any => {
      const survey = loadSurvey(ctx);
      answer(ctx, survey);
      return { survey: survey };
    },
    run: (ctx: PerfContext, state: any): void => { state.survey.dispose(); },
    counters: (ctx: PerfContext, state: any): any => ({ disposed: work(state.survey.isDisposed ? 1 : 0) }),
    check: (ctx: PerfContext, state: any): void => {
      expectThat(state.survey.isDisposed, "the survey is disposed");
    }
  }];
}

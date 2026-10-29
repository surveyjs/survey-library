import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { expectThat, expectEqual } from "../harness/scenario.ts";
import { loadModel } from "./common.ts";
import { loadSurvey, disposeSurvey } from "./helpers.ts";

// D03: load/model and answer/first for each PERF_EXTRA_JSON file, local only. The first answer is the first
// choice of the first question with choices; its counts are recorded, never asserted against a plan.
export function firstChoiceQuestion(survey: any): any {
  return survey.getAllQuestions(false).filter((q: any) => Array.isArray(q.visibleChoices) && q.visibleChoices.length > 0)[0];
}

export function extraScenarios(key: string): Array<PerfScenario> {
  return [loadModel(key), {
    id: key + "/answer/first", rev: 1, fixture: key, kind: "action", uses: ["loadSurvey", "disposeSurvey", "firstChoiceQuestion"],
    setup: (ctx: PerfContext): any => {
      const survey = loadSurvey(ctx);
      const q = firstChoiceQuestion(survey);
      expectThat(!!q, "the survey has a question with choices");
      return { survey: survey, q: q, value: q.visibleChoices[0].value };
    },
    run: (ctx: PerfContext, s: any): void => { s.q.value = s.value; },
    check: (ctx: PerfContext, s: any): void => expectEqual(s.q.value, s.value, "the answer is set"),
    teardown: (ctx: PerfContext, s: any): void => disposeSurvey(s.survey)
  }];
}

import {
  ISurveyTestContext, ISurveyTestTarget, ISurveyTests, runSurveyTests, SurveyTestCheckFactory,
  SurveyTestCommandFactory, SurveyTestIssueCodes, SurveyTestRunner, SurveyTestValidator,
} from "survey-core/tester";
import { SurveyTestCommandFactory as InternalCommandFactory } from "../../src/tester/test-commands";
import { SurveyTestCheckFactory as InternalCheckFactory } from "../../src/tester/test-checks";
import { SurveyTestRunner as InternalRunner } from "../../src/tester/test-runner";
import { SurveyModel } from "../../src/survey";

import { afterEach, describe, expect, test } from "vitest";

// The entry point is what "survey-core/tester" resolves to. These tests read it exactly as an
// integrator does - through the module specifier, never through a src/ path - so that a name that
// stops being exported fails here and not in someone's application.

const survey = {
  elements: [
    { type: "text", name: "q1" },
    { type: "text", name: "q2", visibleIf: "{q1} notempty" },
  ],
};

const registered: Array<string> = [];
afterEach(() => {
  registered.forEach(name => SurveyTestCommandFactory.Instance.unregister(name));
  registered.splice(0, registered.length);
});

describe("survey-core/tester entry point", () => {
  test("runSurveyTests runs a suite end to end", async () => {
    const tests: ISurveyTests = {
      name: "Entry",
      tests: [{
        name: "q2 appears once q1 is answered",
        steps: [
          { expect: { q2: { visible: false } } },
          { set: { q1: "a" } },
          { expect: { q2: { visible: true }, survey: { state: "running" } } },
        ],
      }],
    };
    const result = await runSurveyTests(survey, tests);
    expect(result.name).toBe("Entry");
    expect(result.status).toBe("passed");
    expect(result.summary).toEqual({
      total: 1, passed: 1, failed: 0, errored: 0, skipped: 0, checks: 3, failedChecks: 0, warnings: 0,
    });
  });

  test("runSurveyTests accepts a SurveyModel and reports a failing check", async () => {
    const tests: ISurveyTests = {
      tests: [{ name: "wrong", steps: [{ expect: { q1: { value: "a" } } }] }],
    };
    const result = await runSurveyTests(new SurveyModel(survey), tests);
    expect(result.status).toBe("failed");
    expect(result.tests[0].steps[0].checks[0].passed).toBe(false);
    expect(result.tests[0].steps[0].checks[0].actual).toBe(undefined);
  });

  test("runSurveyTests passes the options through as the root options", async () => {
    const tests: ISurveyTests = {
      tests: [
        { name: "root", steps: [] },
        { name: "override", options: { locale: "de" }, steps: [] },
      ],
    };
    const result = await runSurveyTests(survey, tests, { locale: "fr", randomSeed: 7 });
    expect(result.tests[0].options).toEqual({ locale: "fr", randomSeed: 7 });
    expect(result.tests[1].options).toEqual({ locale: "de", randomSeed: 7 });
  });

  test("runSurveyTests reports a missing survey definition instead of throwing", async () => {
    const result = await runSurveyTests(undefined, { tests: [{ name: "a", steps: [] }] });
    expect(result.status).toBe("error");
    expect(result.issues[0].code).toBe(SurveyTestIssueCodes.surveyMissing);
  });

  test("The entry point exports the runtime surface", () => {
    expect(typeof runSurveyTests).toBe("function");
    expect(typeof SurveyTestRunner).toBe("function");
    expect(typeof SurveyTestValidator).toBe("function");
    expect(typeof SurveyTestCommandFactory).toBe("function");
    expect(typeof SurveyTestCheckFactory).toBe("function");
    expect(SurveyTestIssueCodes.unknownTarget).toBe("unknownTarget");
  });

  // Two copies of a registry would silently swallow every registration an integrator makes.
  test("The exported registries and the runner are the ones the run uses", () => {
    expect(SurveyTestCommandFactory).toBe(InternalCommandFactory);
    expect(SurveyTestCheckFactory).toBe(InternalCheckFactory);
    expect(SurveyTestRunner).toBe(InternalRunner);
    expect(SurveyTestCommandFactory.Instance).toBe(InternalCommandFactory.Instance);
    expect(SurveyTestCheckFactory.Instance).toBe(InternalCheckFactory.Instance);
  });

  test("The built-in commands and checks are registered by importing the entry point", () => {
    expect(SurveyTestCommandFactory.Instance.getNames()).toContain("set");
    expect(SurveyTestCommandFactory.Instance.getNames()).toContain("expect");
    expect(SurveyTestCommandFactory.Instance.getNames()).toContain("complete");
    expect(SurveyTestCheckFactory.Instance.getNames()).toContain("value");
    expect(SurveyTestCheckFactory.Instance.getNames()).toContain("noValues");
  });

  test("A command registered through the entry point runs", async () => {
    registered.push("answerAll");
    SurveyTestCommandFactory.Instance.register({
      name: "answerAll",
      allowSurvey: true,
      allowElement: false,
      payloadType: "string",
      run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void => {
        context.survey.getAllQuestions().forEach((question: any) => { question.value = params; });
      },
    });
    const tests: ISurveyTests = {
      tests: [{
        name: "custom",
        steps: [
          { answerAll: { survey: "x" } },
          { expect: { survey: { values: { q1: "x", q2: "x" } } } },
        ],
      }],
    };
    const result = await runSurveyTests(survey, tests);
    expect(result.status).toBe("passed");
    expect(result.summary.checks).toBe(2);
  });

  test("SurveyTestValidator validates a suite without a survey", () => {
    const issues = new SurveyTestValidator().validate(<any>{ tests: [{ steps: [{ set: { q1: "a" } }] }] });
    expect(issues.map(issue => issue.code)).toEqual([SurveyTestIssueCodes.testNameMissing]);
  });

  test("SurveyTestRunner is usable directly", async () => {
    const runner = new SurveyTestRunner(survey, { tests: [{ name: "a", steps: [{ expect: { q1: { empty: true } } }] }] });
    const result = await runner.run();
    expect(result.status).toBe("passed");
  });
});

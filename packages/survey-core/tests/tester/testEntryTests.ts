import {
  getSurveyTestCheckDetails, getSurveyTestDetailKind, getSurveyTestStepCommandNames, getTestPayloadTypeText,
  isValidTestPayload, ISurveyTestContext, ISurveyTestTarget, ISurveyTests, parseSurveyTestStep, runSurveyTests,
  SurveyTestCheckCommandName, SurveyTestCheckFactory, SurveyTestCommandFactory, SurveyTestDetailKinds,
  SurveyTestIssueCodes, SurveyTestPayloadTypes, SurveyTestRunner, SurveyTestStepMetadataKeys,
  SurveyTestSurveyTargetName, SurveyTestTargetKinds, SurveyTestTargets, SurveyTestValidator,
} from "survey-core/tester";
import type {
  ISurveyTestBlockedRecord, ISurveyTestBlockingQuestion, ISurveyTestCheckDetails, ISurveyTestClearedRecord,
  ISurveyTestExpressionTrace, ISurveyTestTriggerTrace, SurveyTestDetailKind,
} from "survey-core/tester";
import * as SurveyCore from "survey-core";
import {
  SurveyTestCommandFactory as InternalCommandFactory, isValidTestPayload as InternalIsValidPayload,
} from "../../src/tester/test-commands";
import { SurveyTestCheckFactory as InternalCheckFactory } from "../../src/tester/test-checks";
import { SurveyTestRunner as InternalRunner } from "../../src/tester/test-runner";
import { SurveyTestTargets as InternalTargets } from "../../src/tester/test-targets";
import { parseSurveyTestStep as InternalParseStep } from "../../src/tester/test-authoring";
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
      total: 1, passed: 1, failed: 0, errored: 0, skipped: 0, canceled: 0, checks: 3, failedChecks: 0, warnings: 0,
    });
  });

  test("runSurveyTests reports a failing check", async () => {
    const tests: ISurveyTests = {
      tests: [{ name: "wrong", steps: [{ expect: { q1: { value: "a" } } }] }],
    };
    const result = await runSurveyTests(survey, tests);
    expect(result.status).toBe("failed");
    expect(result.tests[0].steps[0].checks[0].passed).toBe(false);
    expect(result.tests[0].steps[0].checks[0].actual).toBe(undefined);
  });

  test("runSurveyTests takes the survey JSON and rejects a SurveyModel", async () => {
    const tests: ISurveyTests = { tests: [{ name: "t", steps: [{ expect: { q1: { empty: true } } }] }] };
    const result = await runSurveyTests(new SurveyModel(survey), tests);
    expect(result.status).toBe("error");
    expect(result.issues[0].code).toBe(SurveyTestIssueCodes.surveyJsonExpected);
    expect(result.tests.length).toBe(0);
  });

  test("runSurveyTests configures the model through the execution options", async () => {
    const created: Array<SurveyModel> = [];
    const tests: ISurveyTests = {
      tests: [{
        name: "t",
        steps: [{ set: { q1: "typed" } }, { expect: { q1: { value: "from the factory" } } }],
      }],
    };
    const result = await runSurveyTests(survey, tests, undefined, {
      createSurvey: (surveyJson: any): SurveyModel => {
        const model = new SurveyModel(surveyJson);
        model.onValueChanging.add((sender: any, options: any) => { options.value = "from the factory"; });
        created.push(model);
        return model;
      },
    });
    expect(result.status).toBe("passed");
    expect(created.length).toBe(1);
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

  test("The recorder and authoring APIs are the ones of the sources", () => {
    expect(SurveyTestTargets).toBe(InternalTargets);
    expect(parseSurveyTestStep).toBe(InternalParseStep);
    expect(isValidTestPayload).toBe(InternalIsValidPayload);
  });

  test("SurveyTestTargets.nameOf answers through the entry point", () => {
    const model = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "paneldynamic", name: "contacts", panelCount: 2, templateElements: [{ type: "text", name: "phone" }] },
      ],
    });
    expect(SurveyTestTargets.nameOf(model, model), "the survey").toBe(SurveyTestSurveyTargetName);
    expect(SurveyTestTargets.nameOf(model, model.getQuestionByName("q1")), "a question").toBe("q1");
    const phone = (<any>model.getQuestionByName("contacts")).panels[1].getQuestionByName("phone");
    expect(SurveyTestTargets.nameOf(model, phone), "a question of a dynamic panel").toBe("contacts[1].phone");
    expect(SurveyTestTargets.nameOf(model, { name: "q1" }), "an object of no survey").toBe(undefined);
  });

  test("The authoring helpers answer through the entry point", () => {
    expect(getSurveyTestStepCommandNames({ name: "a", set: { q1: 1 } })).toEqual(["set"]);
    expect(parseSurveyTestStep({ name: "a" }).command, "a step with no command").toBe(undefined);
    expect(isValidTestPayload("stringArray", ["a"])).toBe(true);
    expect(isValidTestPayload("stringArray", [1])).toBe(false);
    expect(typeof getTestPayloadTypeText("nameMap")).toBe("string");
    expect(SurveyTestPayloadTypes).toContain("none");
    expect(SurveyTestTargetKinds).toContain("calculatedValue");
    expect(SurveyTestStepMetadataKeys.slice()).toEqual(["name", "description"]);
    expect(SurveyTestCheckCommandName).toBe("expect");
  });

  test("The diagnostic detail types are usable from the entry point, with no src/ import", async () => {
    const definition = {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} = 'yes'" },
      ],
    };
    const tests: ISurveyTests = {
      tests: [{ name: "t", steps: [{ set: { q1: "no" } }, { expect: { q2: { visible: true } } }] }],
    };
    const result = await runSurveyTests(definition, tests);
    const check = result.tests[0].steps[1].checks[0];
    expect(check.passed, "the check the details explain").toBe(false);
    // The compiler is what is under test here: these are the declared types, not "any".
    const details: ISurveyTestCheckDetails = getSurveyTestCheckDetails(check.details);
    const trace: ISurveyTestExpressionTrace = details.expression;
    expect(trace.kind).toBe("expression");
    expect(trace.expression).toBe("{q1} = 'yes'");
    expect(trace.values).toEqual({ q1: "no" });
    expect(trace.result).toBe(false);
    const kind: SurveyTestDetailKind = getSurveyTestDetailKind(trace);
    expect(kind).toBe("expression");
    expect(SurveyTestDetailKinds.slice()).toEqual(["expression", "trigger", "blocked", "cleared"]);
  });

  test("The blocked detail narrows through the same discriminant", async () => {
    const result = await runSurveyTests({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1", isRequired: true }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
      ],
    }, {
      tests: [{
        name: "t",
        steps: [{ nextPage: { survey: true } }, { expect: { survey: { currentPage: "page2" } } }],
      }],
    });
    const blocked: ISurveyTestBlockedRecord =
      getSurveyTestCheckDetails(result.tests[0].steps[1].checks[0].details).blockedBy;
    expect(blocked.kind).toBe("blocked");
    expect(blocked.command).toBe("nextPage");
    const blocking: ISurveyTestBlockingQuestion = blocked.questions[0];
    expect(blocking.name).toBe("q1");
    expect(blocking.isRequired).toBe(true);
  });

  test("The trigger detail narrows through the same discriminant", async () => {
    const result = await runSurveyTests({
      elements: [
        { type: "text", name: "claimAmount", inputType: "number" },
        { type: "text", name: "payout", inputType: "number" },
      ],
      triggers: [{ type: "setvalue", expression: "{claimAmount} notempty", setToName: "payout", setValue: 0 }],
    }, {
      tests: [{
        name: "t",
        steps: [{ set: { claimAmount: 500 } }, { expect: { survey: { values: { payout: 500 } } } }],
      }],
    });
    const triggers: Array<ISurveyTestTriggerTrace> =
      getSurveyTestCheckDetails(result.tests[0].steps[1].checks[0].details).triggers;
    expect(triggers.length).toBe(1);
    expect(triggers[0].kind).toBe("trigger");
    expect(triggers[0].triggerType).toBe("setvalue");
    expect(triggers[0].jsonPath).toBe("triggers[0]");
  });

  test("The cleared detail narrows through the same discriminant", async () => {
    const result = await runSurveyTests({
      elements: [
        { type: "radiogroup", name: "hasInsurance", choices: ["yes", "no"] },
        { type: "text", name: "insuranceProvider", visibleIf: "{hasInsurance} = 'yes'" },
      ],
    }, {
      options: { clearInvisibleValues: "onComplete" },
      tests: [{
        name: "t",
        steps: [
          { set: { hasInsurance: "yes" } },
          { set: { insuranceProvider: "Acme" } },
          { set: { hasInsurance: "no" } },
          { complete: { survey: true } },
          { expect: { survey: { values: { insuranceProvider: "Acme" } } } },
        ],
      }],
    });
    const details: ISurveyTestCheckDetails =
      getSurveyTestCheckDetails(result.tests[0].steps[4].checks[0].details);
    const cleared: ISurveyTestClearedRecord = details.clearedBy;
    expect(cleared.kind).toBe("cleared");
    expect(cleared.name).toBe("insuranceProvider");
    expect(cleared.clearInvisibleValues).toBe("onComplete");
    expect(details.key, "the key of the per-key check the detail explains").toBe("insuranceProvider");
  });

  test("A custom detail object is never presented as a built-in shape", () => {
    // The property names of the built-ins are not reserved: a third-party check may use any of them,
    // and it is the discriminant - not the name - that decides what the helper vouches for.
    const details = {
      expression: { expression: "made up", values: {}, result: 1 },
      blockedBy: { kind: "somethingElse", command: "complete" },
      triggers: [{ kind: "trigger", stepIndex: 0, triggerType: "complete", expression: "", jsonPath: "" },
        { stepIndex: 1 }],
      clearedBy: undefined,
      rowIndex: "2",
      key: "q1",
    };
    const read = getSurveyTestCheckDetails(details);
    expect(read.expression, "no discriminant, no promise").toBeUndefined();
    expect(read.blockedBy, "a discriminant of its own is not one of ours").toBeUndefined();
    expect(read.triggers, "one entry of the array is not a trace").toBeUndefined();
    expect(read.rowIndex, "a row index is a number").toBeUndefined();
    expect(read.key, "and the plain members are read as declared").toBe("q1");
    expect(getSurveyTestDetailKind(undefined)).toBeUndefined();
    expect(getSurveyTestDetailKind("expression"), "a string is not a detail object").toBeUndefined();
    expect(getSurveyTestCheckDetails(undefined), "an absent details object reads as empty").toEqual({});
  });

  test("None of it leaks into the main survey-core entry point", () => {
    const main: any = SurveyCore;
    const names = [
      "SurveyTestTargets", "SurveyTestRunner", "SurveyTestValidator", "SurveyTestCommandFactory",
      "SurveyTestCheckFactory", "SurveyTestIssueCodes", "SurveyTestPayloadTypes", "SurveyTestTargetKinds",
      "SurveyTestStepMetadataKeys", "SurveyTestCheckCommandName", "SurveyTestSurveyTargetName",
      "parseSurveyTestStep", "getSurveyTestStepCommandNames", "isValidTestPayload", "getTestPayloadTypeText",
      "isCommandAllowedForKind", "runSurveyTests", "SurveyTestDetailKinds", "getSurveyTestCheckDetails",
      "getSurveyTestDetailKind",
    ];
    const leaked = names.filter(name => main[name] !== undefined);
    expect(leaked, "the tester is a separate entry point").toEqual([]);
  });
});

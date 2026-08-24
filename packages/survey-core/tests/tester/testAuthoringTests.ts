import { SurveyModel } from "../../src/survey";
import { ISurveyTestIssue, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { SurveyTestValidator } from "../../src/tester/test-validator";
import {
  getTestPayloadTypeText, isCommandAllowedForKind, isValidTestPayload, ISurveyTestCommand,
  SurveyTestCommandFactory, SurveyTestPayloadType, SurveyTestPayloadTypes,
} from "../../src/tester/test-commands";
import { SurveyTestCheckFactory } from "../../src/tester/test-checks";
import { SurveyTestTargetKinds, SurveyTestTargets } from "../../src/tester/test-targets";
import { getSurveyTestStepCommandNames, parseSurveyTestStep } from "../../src/tester/test-authoring";
import { ISurveyTestExecutionOptions, SurveyTestExecutionEvent } from "../../src/tester/test-execution";
import { CHECK_COMMAND_NAME, RESERVED_TARGET_SURVEY, STEP_METADATA_KEYS } from "../../src/tester/test-json";

import { afterEach, describe, expect, test } from "vitest";

// What a case editor, a recorder or a test generator is given: a test may hold no steps at all, the
// target grammar runs backwards as well as forwards, and the rules of the format are exported instead
// of being restated by every host.

const registeredCommands: Array<string> = [];
function registerCommand(command: ISurveyTestCommand): void {
  registeredCommands.push(command.name);
  SurveyTestCommandFactory.Instance.register(command);
}
afterEach(() => {
  registeredCommands.forEach(name => SurveyTestCommandFactory.Instance.unregister(name));
  registeredCommands.splice(0, registeredCommands.length);
});

const twoPageSurvey = {
  pages: [
    { name: "page1", elements: [{ type: "text", name: "q1" }] },
    { name: "page2", elements: [{ type: "text", name: "q2" }] },
  ],
};

function run(survey: any, tests: any, executionOptions?: ISurveyTestExecutionOptions): Promise<ISurveyTestsResult> {
  return new SurveyTestRunner(survey, tests).run(executionOptions);
}
function codes(issues: Array<ISurveyTestIssue>): Array<string> {
  return issues.map(issue => issue.code);
}
function allIssues(result: ISurveyTestsResult): Array<ISurveyTestIssue> {
  const res: Array<ISurveyTestIssue> = [].concat(result.issues);
  result.tests.forEach(test => {
    test.issues.forEach(issue => res.push(issue));
    test.steps.forEach(step => step.issues.forEach(issue => res.push(issue)));
  });
  return res;
}

describe("A test with no steps", () => {
  test("A missing and a non-array \"steps\" are still structural errors", () => {
    const validator = new SurveyTestValidator();
    expect(codes(validator.validateTest(<any>{ name: "t" }, "test")), "no steps at all")
      .toEqual([SurveyTestIssueCodes.stepsMissing]);
    expect(codes(validator.validateTest(<any>{ name: "t", steps: {} }, "test")), "an object")
      .toEqual([SurveyTestIssueCodes.stepsMissing]);
    expect(codes(validator.validateTest(<any>{ name: "t", steps: "set" }, "test")), "a string")
      .toEqual([SurveyTestIssueCodes.stepsMissing]);
    expect(codes(validator.validateTest(<any>{ name: "t", steps: [] }, "test")), "an empty array is valid")
      .toEqual([]);
  });
  test("An empty test runs and passes vacuously", async () => {
    const result = await run(twoPageSurvey, { tests: [{ name: "t", steps: [] }] });
    expect(result.status, "the suite passes").toEqual("passed");
    expect(result.tests[0].status, "so does the test").toEqual("passed");
    expect(result.tests[0].steps, "no step ran").toEqual([]);
    expect(allIssues(result), "nothing is reported").toEqual([]);
    expect(result.summary).toEqual({
      total: 1, passed: 1, failed: 0, errored: 0, skipped: 0, canceled: 0, checks: 0, failedChecks: 0, warnings: 0,
    });
  });
  test("The model is created, the start state is applied and the host is handed the model", async () => {
    let survey: SurveyModel = undefined;
    const log: Array<string> = [];
    const result = await run(twoPageSurvey, {
      variables: { role: "admin" },
      tests: [{
        name: "t",
        options: { locale: "de" },
        start: { data: { q1: "typed" }, startPage: "page2" },
        steps: [],
      }],
    }, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        log.push(event.type);
        if (event.type === "surveyCreated") survey = event.survey;
      },
    });
    expect(result.status).toEqual("passed");
    // No step, target or check event: nothing of the kind happened.
    expect(log, "the lifecycle of a test that does nothing").toEqual([
      "runStarted", "testStarted", "surveyCreated", "testCompleted", "runCompleted",
    ]);
    expect(!!survey, "the host was handed the model").toBeTruthy();
    expect(survey.locale, "the options were applied").toEqual("de");
    expect(survey.getValue("q1"), "the start data was applied").toEqual("typed");
    expect(survey.currentPage.name, "the start page was applied").toEqual("page2");
    expect(survey.getVariable("role"), "the variables were applied").toEqual("admin");
  });
  test("Teardown happens before testCompleted and before the promise settles", async () => {
    let survey: SurveyModel = undefined;
    let attachedAtCreation = false;
    let attachedAtCompletion = true;
    await run(twoPageSurvey, { tests: [{ name: "t", steps: [] }] }, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        // The diagnostics of the tester subscribe to onTriggerExecuted while the test runs.
        if (event.type === "surveyCreated") {
          survey = event.survey;
          attachedAtCreation = !(<any>survey).onTriggerExecuted.isEmpty;
        }
        if (event.type === "testCompleted") attachedAtCompletion = !(<any>survey).onTriggerExecuted.isEmpty;
      },
    });
    expect(attachedAtCreation, "the tester was attached while the test ran").toBeTruthy();
    expect(attachedAtCompletion, "the tester detached from the model before the test was completed").toBeFalsy();
    expect((<any>survey).onTriggerExecuted.isEmpty, "and it is still detached afterwards").toBeTruthy();
  });
  test("A model factory that fails still errors an empty test", async () => {
    const result = await run(twoPageSurvey, { tests: [{ name: "t", steps: [] }] }, {
      createSurvey: (): SurveyModel => { throw new Error("no model"); },
    });
    expect(result.tests[0].status, "the test errors").toEqual("error");
    expect(codes(allIssues(result))).toEqual([SurveyTestIssueCodes.surveyFactoryFailed]);
  });
  test("A start state that cannot be applied still errors an empty test", async () => {
    const result = await run(twoPageSurvey, {
      tests: [{ name: "t", start: { startPage: "nowhere" }, steps: [] }],
    });
    expect(result.tests[0].status, "the test errors").toEqual("error");
    expect(codes(allIssues(result))).toEqual([SurveyTestIssueCodes.unknownStartPage]);
  });
  test("An empty test is skipped when it is disabled and never reaches the factory", async () => {
    let calls = 0;
    const result = await run(twoPageSurvey, { tests: [{ name: "t", disabled: true, steps: [] }] }, {
      createSurvey: (json: any): SurveyModel => { calls++; return new SurveyModel(json); },
    });
    expect(result.tests[0].status).toEqual("skipped");
    expect(calls).toEqual(0);
  });
});

// -------------------------------------------------------------------------------------------------
// The inverse of target resolution
// -------------------------------------------------------------------------------------------------

const targetSurveyJson = {
  calculatedValues: [{ name: "calc1", expression: "1 + 2" }],
  pages: [
    {
      name: "page1",
      elements: [
        { type: "text", name: "q1" },
        { type: "panel", name: "staticPanel", elements: [{ type: "text", name: "inPanel" }] },
        {
          type: "paneldynamic", name: "contacts", panelCount: 2,
          templateElements: [
            { type: "text", name: "phone" },
            { type: "panel", name: "innerPanel", elements: [{ type: "text", name: "nested" }] },
            {
              type: "matrixdynamic", name: "items", rowCount: 2,
              columns: [{ name: "price", cellType: "text" }],
            },
          ],
        },
        {
          type: "matrixdropdown", name: "ratings", rows: ["row1", "row2"],
          columns: [{ name: "score", cellType: "text" }],
          detailPanelMode: "underRow",
          detailElements: [{ type: "text", name: "note" }],
        },
      ],
    },
    { name: "page2", elements: [{ type: "text", name: "q2" }] },
  ],
};

function createTargetSurvey(): SurveyModel {
  return new SurveyModel(JSON.parse(JSON.stringify(targetSurveyJson)));
}
function question(survey: SurveyModel, name: string): any {
  return survey.getQuestionByName(name);
}
// The forward direction as the runner performs it, so that the round trip is proved against the
// resolver and not against a second reading of the same path.
function resolve(survey: SurveyModel, name: string): any {
  const target = SurveyTestTargets.resolve(survey, name);
  return !!target ? target.obj : undefined;
}
function expectRoundTrip(survey: SurveyModel, obj: any, expected: string, message: string): void {
  const name = SurveyTestTargets.nameOf(survey, obj);
  expect(name, message).toEqual(expected);
  expect(resolve(survey, name), message + ": the name resolves back to the same object").toBe(obj);
}

describe("SurveyTestTargets.nameOf: every target kind round-trips", () => {
  test("The survey, a question, a panel, a page and a calculated value", () => {
    const survey = createTargetSurvey();
    expect(SurveyTestTargets.nameOf(survey, survey), "the survey is the reserved name")
      .toEqual(RESERVED_TARGET_SURVEY);
    expectRoundTrip(survey, question(survey, "q1"), "q1", "a root question");
    expectRoundTrip(survey, question(survey, "inPanel"), "inPanel", "a question of a static panel");
    expectRoundTrip(survey, survey.getPanelByName("staticPanel"), "staticPanel", "a root panel");
    expectRoundTrip(survey, survey.getPageByName("page2"), "page2", "a page");
    expectRoundTrip(survey, survey.getCalculatedValueByName("calc1"), "calc1", "a calculated value");
  });
  test("A dynamic panel: the panel itself and the questions inside it", () => {
    const survey = createTargetSurvey();
    const contacts: any = question(survey, "contacts");
    expectRoundTrip(survey, contacts, "contacts", "the dynamic panel question");
    expectRoundTrip(survey, contacts.panels[1], "contacts[1]", "a panel of the dynamic panel");
    expectRoundTrip(survey, contacts.panels[0].getQuestionByName("phone"), "contacts[0].phone",
      "a question of the first panel");
    expectRoundTrip(survey, contacts.panels[1].getQuestionByName("phone"), "contacts[1].phone",
      "a question of the second panel");
    // The static panel inside the template does not appear in the path: a question is addressed by the
    // panel index of the dynamic panel and its own name.
    expectRoundTrip(survey, contacts.panels[1].getQuestionByName("nested"), "contacts[1].nested",
      "a question of a static panel inside a dynamic panel");
  });
  test("A dynamic matrix nested in a dynamic panel", () => {
    const survey = createTargetSurvey();
    const contacts: any = question(survey, "contacts");
    const items: any = contacts.panels[0].getQuestionByName("items");
    expectRoundTrip(survey, items, "contacts[0].items", "the matrix question itself");
    expectRoundTrip(survey, items.visibleRows[1], "contacts[0].items[1]", "a row of the nested matrix");
    expectRoundTrip(survey, items.visibleRows[1].getQuestionByColumnName("price"), "contacts[0].items[1].price",
      "a cell of the nested matrix");
  });
  test("A declared matrix is addressed by row name, a dynamic one by row index", () => {
    const survey = createTargetSurvey();
    const ratings: any = question(survey, "ratings");
    expectRoundTrip(survey, ratings.visibleRows[1], "ratings.row2", "a declared row");
    expectRoundTrip(survey, ratings.visibleRows[0].getQuestionByColumnName("score"), "ratings.row1.score",
      "a cell of a declared row");
    const items: any = question(survey, "contacts").panels[0].getQuestionByName("items");
    // A row of a dynamic matrix names itself after a generated id, so a case addresses it by position.
    expect(SurveyTestTargets.nameOf(survey, items.visibleRows[0]).indexOf(items.visibleRows[0].rowName) < 0,
      "the generated row name is never written into a target").toBeTruthy();
  });
  test("A question of a matrix detail panel", () => {
    const survey = createTargetSurvey();
    const ratings: any = question(survey, "ratings");
    ratings.visibleRows[1].showDetailPanel();
    expectRoundTrip(survey, ratings.visibleRows[1].getQuestionByName("note"), "ratings.row2.note",
      "a detail-panel question");
  });
  test("A row handed over by a renderer event: the context names the matrix", () => {
    const survey = createTargetSurvey();
    const ratings: any = question(survey, "ratings");
    const row = ratings.visibleRows[0];
    expect(SurveyTestTargets.nameOf(survey, row, { matrix: ratings, row: row }), "the row of the event")
      .toEqual("ratings.row1");
    expect(SurveyTestTargets.nameOf(survey, row.getQuestionByColumnName("score"), { matrix: ratings, row: row }),
      "the cell of the event").toEqual("ratings.row1.score");
    // A context that names the wrong row cannot produce a name for another one: what the object itself
    // says wins, and the round trip is verified either way.
    expect(SurveyTestTargets.nameOf(survey, row, { matrix: ratings, row: ratings.visibleRows[1] }),
      "the object decides, not the context").toEqual("ratings.row1");
  });
});

describe("SurveyTestTargets.nameOf: what it refuses to name", () => {
  test("Nothing, a plain object and a foreign model", () => {
    const survey = createTargetSurvey();
    expect(SurveyTestTargets.nameOf(survey, undefined), "nothing").toEqual(undefined);
    expect(SurveyTestTargets.nameOf(undefined, question(survey, "q1")), "no survey").toEqual(undefined);
    expect(SurveyTestTargets.nameOf(survey, { name: "q1" }), "a plain object").toEqual(undefined);
    expect(SurveyTestTargets.nameOf(survey, new SurveyModel({})), "another survey").toEqual(undefined);
  });
  test("A question of another survey with the same name is never named after this one", () => {
    const survey = createTargetSurvey();
    const other = createTargetSurvey();
    expect(SurveyTestTargets.nameOf(survey, question(other, "q1")),
      "\"q1\" resolves here, but not to this object").toEqual(undefined);
    expect(SurveyTestTargets.nameOf(survey, other.getPageByName("page2")), "a foreign page").toEqual(undefined);
    const otherRow: any = question(other, "ratings").visibleRows[0];
    expect(SurveyTestTargets.nameOf(survey, otherRow), "a foreign row").toEqual(undefined);
  });
  test("An element the grammar cannot address", () => {
    const survey = createTargetSurvey();
    const contacts: any = question(survey, "contacts");
    // A panel inside the panel of a dynamic panel is not reachable by getPanelByName and there is no
    // path for it, so no name is invented that would end a case with unknownTarget.
    const innerPanel = contacts.panels[0].getElementByName("innerPanel");
    expect(!!innerPanel, "the panel exists in the model").toBeTruthy();
    expect(SurveyTestTargets.nameOf(survey, innerPanel), "a panel inside a dynamic panel").toEqual(undefined);
    const ratings: any = question(survey, "ratings");
    ratings.visibleRows[0].showDetailPanel();
    expect(SurveyTestTargets.nameOf(survey, ratings.visibleRows[0].detailPanel), "a detail panel")
      .toEqual(undefined);
  });
  test("A question removed from the survey", () => {
    const survey = createTargetSurvey();
    const q1 = question(survey, "q1");
    expect(SurveyTestTargets.nameOf(survey, q1), "while it belongs to the survey").toEqual("q1");
    survey.getPageByName("page1").removeElement(q1);
    expect(SurveyTestTargets.nameOf(survey, q1), "once it is detached").toEqual(undefined);
  });
});

describe("SurveyTestTargets.nameOf: nothing is cached", () => {
  test("Removing a panel renames the questions of the panels after it", () => {
    const survey = createTargetSurvey();
    const contacts: any = question(survey, "contacts");
    const phone = contacts.panels[1].getQuestionByName("phone");
    expectRoundTrip(survey, phone, "contacts[1].phone", "before the removal");
    contacts.removePanel(0);
    expectRoundTrip(survey, phone, "contacts[0].phone", "after the removal");
    contacts.addPanel();
    expectRoundTrip(survey, phone, "contacts[0].phone", "after a panel was added at the end");
  });
  test("Adding and removing matrix rows renames the cells after them", () => {
    const survey = createTargetSurvey();
    const items: any = question(survey, "contacts").panels[0].getQuestionByName("items");
    const price = items.visibleRows[1].getQuestionByColumnName("price");
    expectRoundTrip(survey, price, "contacts[0].items[1].price", "before the removal");
    items.removeRow(0);
    expectRoundTrip(survey, price, "contacts[0].items[0].price", "after the first row was removed");
  });
});

// -------------------------------------------------------------------------------------------------
// The authoring helpers
// -------------------------------------------------------------------------------------------------

describe("Authoring helpers: payloads", () => {
  test("isValidTestPayload is exactly what the runner applies, for every payload type", async () => {
    const values: Array<any> = [
      "text", "", 1, 0, NaN, Infinity, true, false, ["a"], [1], [], { q1: "a" }, {}, null, undefined,
    ];
    const mismatches: Array<string> = [];
    for (let t = 0; t < SurveyTestPayloadTypes.length; t++) {
      const type: SurveyTestPayloadType = SurveyTestPayloadTypes[t];
      const name = "probe_" + type;
      registerCommand({ name: name, payloadType: type, run: (): void => {} });
      for (let v = 0; v < values.length; v++) {
        const value = values[v];
        const result = await run(twoPageSurvey, { tests: [{ name: "t", steps: [{ [name]: { q1: value } }] }] });
        const refused = codes(allIssues(result)).indexOf(SurveyTestIssueCodes.invalidCommandParams) > -1;
        // An undefined payload is not a command parameter at all: the step holds no command, and that
        // is a different error. The helper still answers for it and the two agree that it is not valid.
        const helperSaid = isValidTestPayload(type, value);
        if (value !== undefined && helperSaid === refused) {
          mismatches.push(type + " <- " + JSON.stringify(value === undefined ? "undefined" : value));
        }
        if (value === undefined && helperSaid) mismatches.push(type + " accepts undefined");
      }
    }
    expect(mismatches, "the helper and the runner agree on every payload type").toEqual([]);
  });
  test("getTestPayloadTypeText names every payload type", () => {
    SurveyTestPayloadTypes.forEach(type => {
      const text = getTestPayloadTypeText(type);
      expect(typeof text === "string" && text.length > 0, "the type " + type + " has a text").toBeTruthy();
      expect(text, "the text is not the raw name of " + type).not.toEqual(type);
    });
  });
  test("isCommandAllowedForKind answers for the survey and for an element", () => {
    const surveyOnly: any = { name: "x", payloadType: "none", allowSurvey: true, allowElement: false };
    expect(isCommandAllowedForKind(surveyOnly, "survey")).toBeTruthy();
    expect(isCommandAllowedForKind(surveyOnly, "question")).toBeFalsy();
    const elementOnly: any = { name: "y", payloadType: "none" };
    expect(isCommandAllowedForKind(elementOnly, "survey"), "allowSurvey defaults to false").toBeFalsy();
    expect(isCommandAllowedForKind(elementOnly, "question"), "allowElement defaults to true").toBeTruthy();
  });
});

describe("Authoring helpers: a step", () => {
  test("A valid step reports its command and its parameters", () => {
    const step: any = { name: "answer", description: "why", set: { q1: "a" } };
    const parsed = parseSurveyTestStep(step);
    expect(parsed.commands, "one command").toEqual(["set"]);
    expect(parsed.command).toEqual("set");
    expect(parsed.params).toBe(step.set);
    expect(parsed.name).toEqual("answer");
    expect(parsed.description).toEqual("why");
    expect(parsed.undefinedKeys).toEqual([]);
    expect(getSurveyTestStepCommandNames(step)).toEqual(["set"]);
  });
  test("Metadata never counts as a command", () => {
    const parsed = parseSurveyTestStep(<any>{ name: "a", description: "b" });
    expect(parsed.commands, "a step of metadata only holds no command").toEqual([]);
    expect(parsed.command, "and nothing is invented for it").toEqual(undefined);
    expect(parsed.params).toEqual(undefined);
  });
  test("A step with several commands reports all of them and none of them as the one", () => {
    const parsed = parseSurveyTestStep(<any>{ set: { q1: "a" }, expect: { q1: { value: "a" } } });
    expect(parsed.commands, "both, in the order they are written").toEqual(["set", CHECK_COMMAND_NAME]);
    expect(parsed.command, "a broken step is not turned into a valid one").toEqual(undefined);
    expect(parsed.params).toEqual(undefined);
  });
  test("A key whose value is undefined is not a command", () => {
    const parsed = parseSurveyTestStep(<any>{ set: { q1: "a" }, clear: undefined });
    expect(parsed.commands).toEqual(["set"]);
    expect(parsed.command).toEqual("set");
    expect(parsed.undefinedKeys, "the key is reported as what it is").toEqual(["clear"]);
  });
  test("Nothing, a string and an array are steps that hold no command", () => {
    [undefined, null, "set", [1], 5].forEach(step => {
      const parsed = parseSurveyTestStep(<any>step);
      expect(parsed.commands, "no command in " + JSON.stringify(step)).toEqual([]);
      expect(parsed.undefinedKeys).toEqual([]);
      expect(parsed.command).toEqual(undefined);
    });
  });
  test("The helper and the validator see the same commands", () => {
    const steps: Array<any> = [
      { set: { q1: "a" } },
      { name: "only metadata" },
      { set: { q1: "a" }, clear: { q1: true } },
      { set: { q1: "a" }, clear: undefined },
    ];
    const validator = new SurveyTestValidator();
    steps.forEach(step => {
      const commands = getSurveyTestStepCommandNames(step);
      const issues = codes(validator.validateStep(step, "test.steps[0]"));
      expect(issues.indexOf(SurveyTestIssueCodes.stepEmpty) > -1, "empty <-> no command: " + JSON.stringify(step))
        .toEqual(commands.length === 0);
      expect(issues.indexOf(SurveyTestIssueCodes.stepHasSeveralCommands) > -1,
        "several <-> more than one: " + JSON.stringify(step)).toEqual(commands.length > 1);
    });
  });
});

describe("Authoring helpers: the runtime collections", () => {
  test("The payload types are frozen and cover every registered command and check", () => {
    expect(Object.isFrozen(SurveyTestPayloadTypes), "the list cannot be edited by a host").toBeTruthy();
    const unknown: Array<string> = [];
    SurveyTestCommandFactory.Instance.getNames().forEach(name => {
      const type = SurveyTestCommandFactory.Instance.get(name).payloadType;
      if (SurveyTestPayloadTypes.indexOf(type) < 0) unknown.push("command " + name + ": " + type);
    });
    SurveyTestCheckFactory.Instance.getNames().forEach(name => {
      const type = SurveyTestCheckFactory.Instance.get(name).payloadType;
      if (SurveyTestPayloadTypes.indexOf(type) < 0) unknown.push("check " + name + ": " + type);
    });
    expect(unknown, "every registry entry declares one of the public payload types").toEqual([]);
  });
  test("The target kinds are frozen and cover every kind the registries name", () => {
    expect(Object.isFrozen(SurveyTestTargetKinds), "the list cannot be edited by a host").toBeTruthy();
    expect(SurveyTestTargetKinds.indexOf("survey") > -1, "the reserved target is a kind").toBeTruthy();
    const unknown: Array<string> = [];
    SurveyTestCheckFactory.Instance.getNames().forEach(name => {
      const kinds = SurveyTestCheckFactory.Instance.get(name).kinds;
      if (!kinds) return;
      kinds.forEach(kind => {
        if (SurveyTestTargetKinds.indexOf(kind) < 0) unknown.push("check " + name + ": " + kind);
      });
    });
    expect(unknown).toEqual([]);
    // Every kind is a kind the command registry can be asked about.
    SurveyTestTargetKinds.forEach(kind => {
      expect(Array.isArray(SurveyTestCommandFactory.Instance.getNamesForKind(kind)),
        "the commands of a " + kind).toBeTruthy();
    });
  });
  test("The names the format fixes are frozen", () => {
    expect(Object.isFrozen(STEP_METADATA_KEYS)).toBeTruthy();
    expect(STEP_METADATA_KEYS.slice()).toEqual(["name", "description"]);
    expect(CHECK_COMMAND_NAME).toEqual("expect");
    expect(RESERVED_TARGET_SURVEY).toEqual("survey");
  });
});

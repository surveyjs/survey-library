import { SurveyModel } from "survey-core";
import { ISurveyTestIssue, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import {
  ISurveyTestExecutionOptions, ISurveyTestModelFactoryContext, SurveyTestExecutionEvent,
} from "../../src/tester/test-execution";

import { afterEach, describe, expect, test, vi } from "vitest";

// A host injects variables the survey JSON never mentions, and the suite says what those variables
// are: one definition survey whose top-level questions are the variables, and named records of values
// for it. The tester checks what a case injects against that definition before the survey under test
// exists - a variable the application could never inject must not reach it - and it builds the model
// of the definition itself, with the clock, the stubbed functions and the web transport of the test,
// because the definition is a survey of the case like every other.

afterEach(() => {
  vi.restoreAllMocks();
});

const surveyJson = {
  elements: [
    { type: "text", name: "q1" },
    { type: "text", name: "q2", visibleIf: "{tier} = 'gold'" },
  ],
};
const definition = {
  elements: [
    { type: "dropdown", name: "tier", choices: ["basic", "gold"], isRequired: true },
    { type: "text", name: "years", inputType: "number", min: 0, max: 99 },
  ],
};

// The models the runner handed to the tests, in order. The factory is the default one - the two steps
// the tester documents - so that counting the calls says exactly how many surveys under test were
// created and which they are.
interface ISurveyFactoryRecord {
  count: number;
  models: Array<SurveyModel>;
}
function factoryRecord(): ISurveyFactoryRecord {
  return { count: 0, models: [] };
}
function withFactory(record: ISurveyFactoryRecord, options?: ISurveyTestExecutionOptions): ISurveyTestExecutionOptions {
  const res: ISurveyTestExecutionOptions = options || {};
  res.createSurvey = (json: any, context: ISurveyTestModelFactoryContext): SurveyModel => {
    record.count++;
    const survey = new SurveyModel();
    context.attachProviders(survey);
    survey.fromJSON(json);
    record.models.push(survey);
    return survey;
  };
  return res;
}
function run(survey: any, tests: any, executionOptions?: ISurveyTestExecutionOptions): Promise<ISurveyTestsResult> {
  return new SurveyTestRunner(survey, tests).run(executionOptions);
}
function allIssues(result: ISurveyTestsResult): Array<ISurveyTestIssue> {
  const res: Array<ISurveyTestIssue> = [].concat(result.issues);
  result.tests.forEach(test => {
    test.issues.forEach(issue => res.push(issue));
    test.steps.forEach(step => step.issues.forEach(issue => res.push(issue)));
  });
  return res;
}
function codes(result: ISurveyTestsResult): Array<string> {
  return allIssues(result).map(issue => issue.code);
}
function issueOf(result: ISurveyTestsResult, code: string): ISurveyTestIssue {
  return allIssues(result).filter(issue => issue.code === code)[0];
}
// Every fromJSON call is one model that was built from a document: one per survey under test and one
// per definition. The constructor of an empty SurveyModel does not go through it.
function countLoadedModels(): { count: number } {
  const res = { count: 0 };
  const original = SurveyModel.prototype.fromJSON;
  vi.spyOn(SurveyModel.prototype, "fromJSON").mockImplementation(function(this: SurveyModel, json: any, options?: any) {
    res.count++;
    return original.call(this, json, options);
  });
  return res;
}

describe("The tester and the variable definition (issue #11814)", () => {
  test("A variable the definition accepts reaches the survey under test", async () => {
    const result = await run(surveyJson, {
      variablePresets: { definition: definition },
      variables: { tier: "gold", years: 12 },
      tests: [{
        name: "the survey sees the variables",
        steps: [{ expect: { survey: { variables: { tier: "gold", years: 12 } }, q2: { visible: true } } }],
      }],
    });
    expect(codes(result), "the definition accepts the values").toEqual([]);
    expect(result.tests[0].status).toEqual("passed");
  });
  test("A value the definition rejects ends the test before the model factory", async () => {
    const record = factoryRecord();
    const result = await run(surveyJson, {
      variablePresets: { definition: definition },
      variables: { tier: "bronze", years: 200 },
      tests: [{ name: "invalid variables", steps: [{ expect: { q1: { empty: true } } }] }],
    }, withFactory(record));
    expect(result.tests[0].status, "the case is broken, not failing").toEqual("error");
    expect(codes(result)).toEqual([SurveyTestIssueCodes.variableInvalid]);
    expect(record.count, "no survey under test is created").toEqual(0);
    expect(result.tests[0].steps.length, "no step runs").toEqual(0);
    const issue = issueOf(result, SurveyTestIssueCodes.variableInvalid);
    expect(issue.path, "the issue belongs to the test").toEqual("tests[0]");
    // The core's error objects, verbatim: one entry per failing definition question, with the texts
    // the survey renders.
    expect(issue.data.questions.length, "both questions are reported").toEqual(2);
    expect(issue.data.questions[0].variable).toEqual("tier");
    expect(issue.data.questions[0].question).toEqual("tier");
    expect(issue.data.questions[0].errors.length > 0, "the error text is carried").toBe(true);
    expect(issue.data.questions[1].variable).toEqual("years");
    expect(issue.message.indexOf("tier") > -1 && issue.message.indexOf("years") > -1,
      "one message lists both questions").toBe(true);
  });
  test("An unknown variable is a warning, is not set on the survey, and the test still runs", async () => {
    const record = factoryRecord();
    const result = await run(surveyJson, {
      variablePresets: { definition: definition },
      variables: { tier: "gold", teir: "gold" },
      tests: [{ name: "one name too many", steps: [{ expect: { q2: { visible: true } } }] }],
    }, withFactory(record));
    expect(result.tests[0].status, "the test runs with the variables that are defined").toEqual("passed");
    const issue = issueOf(result, SurveyTestIssueCodes.variableNotDefined);
    expect(issue.severity).toEqual("warning");
    expect(issue.path).toEqual("tests[0]");
    expect(issue.data).toEqual({ name: "teir", defined: ["tier", "years"] });
    expect(issue.suggestion).toEqual("Did you mean \"tier\"?");
    // The result says what the case asked for; the warning next to it says what never reached the model.
    expect(result.tests[0].variables).toEqual({ tier: "gold", teir: "gold" });
    expect(record.models[0].getVariable("teir"), "the unknown name is not applied").toBeUndefined();
    expect(record.models[0].getVariable("tier")).toEqual("gold");
  });
  test("The reported error names the data key and the definition question behind it", async () => {
    const result = await run(surveyJson, {
      variablePresets: {
        definition: {
          elements: [{ type: "text", name: "yearsInBusiness", valueName: "years", inputType: "number", min: 0, max: 99 }],
        },
      },
      variables: { years: 200 },
      tests: [{ name: "out of range", steps: [] }],
    });
    const issue = issueOf(result, SurveyTestIssueCodes.variableInvalid);
    expect(issue.data.questions[0].variable, "the variable is the data key").toEqual("years");
    expect(issue.data.questions[0].question, "the question is the one that failed").toEqual("yearsInBusiness");
  });
  test("A variable whose case differs from the definition's spelling is defined", async () => {
    const result = await run(surveyJson, {
      variablePresets: { definition: definition },
      variables: { Tier: "gold" },
      tests: [{
        name: "the runtime lower-cases a variable name anyway",
        steps: [{ expect: { survey: { variables: { tier: "gold" } } } }],
      }],
    });
    expect(codes(result), "the definition question \"tier\" is what \"Tier\" means").toEqual([]);
    expect(result.tests[0].status).toEqual("passed");
  });
  test("The values are applied raw: the definition validates, it does not convert", async () => {
    const result = await run(surveyJson, {
      variablePresets: { definition: definition },
      variables: { tier: "gold", years: "12" },
      tests: [{
        name: "a string that a numeric question accepts stays a string",
        steps: [{ expect: { survey: { variables: { years: "12" } } } }],
      }],
    });
    expect(codes(result)).toEqual([]);
    expect(result.tests[0].status, "the survey under test sees what the case wrote").toEqual("passed");
  });
  test("A suite without \"variablePresets\" builds no definition model and checks nothing", async () => {
    const loaded = countLoadedModels();
    const result = await run(surveyJson, {
      variables: { anything: "at all" },
      tests: [{ name: "no container", steps: [{ expect: { q1: { empty: true } } }] }],
    });
    expect(result.tests[0].status).toEqual("passed");
    expect(codes(result), "nothing about a definition is reported").toEqual([]);
    expect(loaded.count, "only the survey under test is built").toEqual(1);
  });
  test("Presets without a definition are applied and nothing is checked", async () => {
    const loaded = countLoadedModels();
    const result = await run(surveyJson, {
      variablePresets: { presets: [{ name: "gold customer", variables: { tier: "gold", whatever: 1 } }] },
      variablePreset: "gold customer",
      tests: [{ name: "no definition to check against", steps: [{ expect: { q2: { visible: true } } }] }],
    });
    expect(result.tests[0].status).toEqual("passed");
    expect(codes(result)).toEqual([]);
    expect(loaded.count, "no definition model is built").toEqual(1);
  });
});

describe("The definition model is a model of the test (issue #11814)", () => {
  test("The pinned clock reaches the definition", async () => {
    const suite = {
      variablePresets: {
        definition: {
          elements: [
            { type: "expression", name: "year", expression: "currentYear()" },
            // Validated only in the year the case pins: it is how a definition says "this variable
            // applies only when ...".
            { type: "text", name: "code", isRequired: true, visibleIf: "{year} = 2030" },
          ],
        },
      },
      tests: [
        { name: "pinned to 2030", options: { now: "2030-06-01T00:00:00" }, steps: [] },
        { name: "the default now", steps: [] },
      ],
    };
    const result = await run(surveyJson, suite);
    expect(result.tests.map(item => item.status), "the clock of the test decides the verdict")
      .toEqual(["error", "passed"]);
    expect(codes(result)).toEqual([SurveyTestIssueCodes.variableInvalid]);
    expect(issueOf(result, SurveyTestIssueCodes.variableInvalid).data.questions[0].variable).toEqual("code");
  });
  test("A function the case stubs reaches the definition", async () => {
    const result = await run(surveyJson, {
      variablePresets: {
        definition: { elements: [{ type: "text", name: "code", isRequired: true, visibleIf: "isStrict() = true" }] },
      },
      functions: { isStrict: { async: false, result: true } },
      tests: [
        { name: "strict", steps: [] },
        { name: "lenient", functions: { isStrict: { async: false, result: false } }, steps: [] },
      ],
    });
    expect(result.tests.map(item => item.status), "the stub of the test decides whether the variable is validated")
      .toEqual(["error", "passed"]);
    expect(codes(result)).toEqual([SurveyTestIssueCodes.variableInvalid]);
  });
  test("A definition question loading its choices from the web stub is checked against them", async () => {
    const suite = (tier: string): any => ({
      variablePresets: {
        definition: { elements: [{ type: "dropdown", name: "tier", choicesByUrl: { url: "https://api.example.com/tiers" } }] },
      },
      web: { "https://api.example.com/tiers": { response: ["basic", "gold"] } },
      variables: { tier: tier },
      tests: [{ name: "t", steps: [] }],
    });
    const accepted = await run(surveyJson, suite("gold"));
    expect(codes(accepted), "a value the service serves is accepted").toEqual([]);
    expect(accepted.tests[0].status).toEqual("passed");
    const rejected = await run(surveyJson, suite("platinum"));
    expect(codes(rejected), "a value it does not serve is not").toEqual([SurveyTestIssueCodes.variableInvalid]);
    expect(rejected.tests[0].status).toEqual("error");
  });
  test("One definition model per test, disposed with the test", async () => {
    const loaded = countLoadedModels();
    const disposed: Array<SurveyModel> = [];
    const original = SurveyModel.prototype.dispose;
    vi.spyOn(SurveyModel.prototype, "dispose").mockImplementation(function(this: SurveyModel) {
      disposed.push(this);
      return original.call(this);
    });
    const record = factoryRecord();
    const result = await run(surveyJson, {
      variablePresets: { definition: definition },
      variables: { tier: "gold" },
      tests: [
        { name: "first", steps: [] },
        { name: "second", steps: [] },
      ],
    }, withFactory(record));
    expect(result.tests.map(item => item.status)).toEqual(["passed", "passed"]);
    expect(loaded.count, "two surveys under test and two definition models").toEqual(4);
    expect(disposed.length, "both definition models are disposed").toEqual(2);
    disposed.forEach(model => {
      expect(record.models.indexOf(model), "no survey under test is disposed").toEqual(-1);
    });
  });
  test("The definition model is not the survey of the test", async () => {
    const record = factoryRecord();
    const created: Array<SurveyModel> = [];
    const options = withFactory(record, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "surveyCreated") created.push(event.survey);
      },
    });
    const result = await run(surveyJson, {
      variablePresets: { definition: definition },
      variables: { tier: "gold" },
      tests: [
        { name: "first", steps: [{ set: { q1: "a" } }] },
        { name: "second", steps: [{ set: { q1: "b" } }] },
      ],
    }, options);
    expect(result.tests.map(item => item.status)).toEqual(["passed", "passed"]);
    // Two events for two tests: the definition model is announced to nobody.
    expect(created.length).toEqual(2);
    expect(created[0]).toBe(record.models[0]);
    expect(created[1]).toBe(record.models[1]);
    // A step talks to the survey under test, which is the only model the case addresses.
    expect(record.models[0].getValue("q1")).toEqual("a");
    expect(record.models[1].getValue("q1")).toEqual("b");
  });
  test("The container of the suite is not changed by a run", async () => {
    const suite = {
      variablePresets: {
        definition: definition,
        presets: [{ name: "gold customer", variables: { tier: "gold", years: 12 } }],
      },
      variablePreset: "gold customer",
      tests: [{ name: "t", steps: [{ expect: { survey: { variables: { tier: "gold" } } } }] }],
    };
    const before = JSON.stringify(suite.variablePresets);
    const result = await run(surveyJson, suite);
    expect(result.tests[0].status).toEqual("passed");
    expect(JSON.stringify(suite.variablePresets), "the document belongs to the caller").toEqual(before);
  });
  test("A definition that cannot be loaded is a case error", async () => {
    const original = SurveyModel.prototype.fromJSON;
    vi.spyOn(SurveyModel.prototype, "fromJSON").mockImplementation(function(this: SurveyModel, json: any, options?: any) {
      if (!!json && json.brokenDefinition === true) throw new Error("bad definition");
      return original.call(this, json, options);
    });
    const record = factoryRecord();
    const result = await run(surveyJson, {
      variablePresets: { definition: { brokenDefinition: true, elements: [{ type: "text", name: "tier" }] } },
      variables: { tier: "gold" },
      tests: [{ name: "t", steps: [{ expect: { q1: { empty: true } } }] }],
    }, withFactory(record));
    expect(result.tests[0].status).toEqual("error");
    const issue = issueOf(result, SurveyTestIssueCodes.variableDefinitionFailed);
    expect(issue.data.error).toEqual("bad definition");
    expect(issue.path).toEqual("tests[0]");
    expect(record.count, "no survey under test is created").toEqual(0);
  });
  test("A suite whose tests are all disabled builds no definition model", async () => {
    const loaded = countLoadedModels();
    const result = await run(surveyJson, {
      variablePresets: { definition: definition },
      variables: { tier: "bronze" },
      tests: [
        { name: "first", disabled: true, steps: [] },
        { name: "second", disabled: true, steps: [] },
      ],
    });
    expect(result.tests.map(item => item.status), "a disabled test is skipped, definition or not")
      .toEqual(["skipped", "skipped"]);
    expect(loaded.count, "nothing is built for a test that does not run").toEqual(0);
    expect(codes(result), "the invalid variable of a skipped test is not reported").toEqual([]);
  });
});

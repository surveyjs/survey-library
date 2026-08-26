import { FunctionFactory } from "../../src/functionsfactory";
import { ChoicesRestful } from "../../src/choicesRestful";
import { SurveyModel } from "../../src/survey";
import { settings } from "../../src/settings";
import { ISurveyTestIssue, ISurveyTestResult, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { ISurveyTestExecutionOptions, ISurveyTestModelFactoryContext, SurveyTestExecutionEvent } from "../../src/tester/test-execution";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { SurveyTestValidator } from "../../src/tester/test-validator";

import { afterEach, describe, expect, test } from "vitest";

// What a survey takes from outside itself: the asynchronous functions its expressions call and the web
// service its choicesByUrl questions load from. A case may replace either with a reproducible answer.

const registeredFunctions: Array<string> = [];
function registerFunction(name: string, func: (params: any) => any, isAsync: boolean = true): void {
  registeredFunctions.push(name);
  FunctionFactory.Instance.register(name, func, isAsync, false);
}
afterEach(() => {
  registeredFunctions.splice(0).forEach(name => FunctionFactory.Instance.unregister(name));
  ChoicesRestful.clearCache();
});

function run(surveyJson: any, tests: any, executionOptions?: ISurveyTestExecutionOptions): Promise<ISurveyTestsResult> {
  return new SurveyTestRunner(surveyJson, tests).run(executionOptions);
}
function allIssues(result: ISurveyTestResult): Array<ISurveyTestIssue> {
  const res: Array<ISurveyTestIssue> = [].concat(result.issues);
  result.steps.forEach(step => step.issues.forEach(issue => res.push(issue)));
  return res;
}
function codes(result: ISurveyTestResult): Array<string> {
  return allIssues(result).map(issue => issue.code);
}
// Everything that would make a case wrong, in one list: a failed check and an error-severity issue
// both mean the run did not do what the case describes, and asserting only the checks would let a
// misspelled check name pass as a test that "produced no failures".
function failedChecks(result: ISurveyTestResult): Array<string> {
  const res: Array<string> = [];
  result.steps.forEach(step => step.checks.forEach(check => {
    if (!check.passed) res.push(check.target + "." + check.check + ": " + check.message);
  }));
  allIssues(result).forEach(issue => {
    if (issue.severity === "error") res.push("issue " + issue.code + ": " + issue.message);
  });
  return res;
}

const rateSurvey = {
  elements: [
    { type: "dropdown", name: "currency", choices: ["EUR", "GBP"] },
    { type: "expression", name: "rate", expression: "getRate({currency})" },
  ],
};

describe("survey-tester: asynchronous function stubs", () => {
  test("a stubbed function answers an expression question, and the step after it reads the answer", async () => {
    const result = await run(rateSurvey, {
      functions: { getRate: { async: true, result: 0, results: [{ params: ["EUR"], result: 1.1 }] } },
      tests: [{
        name: "rate",
        steps: [
          { set: { currency: "EUR" } },
          { expect: { rate: { value: 1.1 } } },
        ],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    expect(result.tests[0].status).toBe("passed");
  });
  test("the answer reaches visibleIf, a calculated value, a trigger and defaultValueExpression", async () => {
    const surveyJson = {
      calculatedValues: [{ name: "doubled", expression: "getNumber({q1}) * 2", includeIntoResult: true }],
      triggers: [{ type: "setvalue", expression: "getNumber({q1}) > 5", setToName: "big", setValue: "yes" }],
      elements: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "text", name: "q2", visibleIf: "getNumber({q1}) > 5" },
        { type: "text", name: "q3", defaultValueExpression: "getNumber({q1})" },
        { type: "text", name: "big" },
      ],
    };
    const result = await run(surveyJson, {
      functions: { getNumber: { async: true, results: [{ params: [10], result: 10 }], result: 0 } },
      tests: [{
        name: "cascade",
        steps: [
          { set: { q1: 10 } },
          {
            expect: {
              q2: { visible: true },
              q3: { value: 10 },
              big: { value: "yes" },
              survey: { values: { doubled: 20 } },
            },
          },
        ],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("a step that checks q2 waits for the function running on q1", async () => {
    const surveyJson = {
      elements: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "expression", name: "q1x", expression: "slowDouble({q1})" },
        { type: "text", name: "q2", visibleIf: "{q1x} > 10" },
      ],
    };
    const result = await run(surveyJson, {
      functions: { slowDouble: { async: true, delay: 20, results: [{ params: [8], result: 16 }], result: 0 } },
      tests: [{
        name: "cascade",
        steps: [
          { set: { q1: 8 } },
          // q2 has nothing pending of its own: it is "ready" the whole time, and it is wrong until the
          // function running on q1 answers.
          { expect: { q2: { visible: true } } },
        ],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("a chain three deep settles before the next step", async () => {
    const surveyJson = {
      elements: [
        { type: "text", name: "a", inputType: "number" },
        { type: "expression", name: "b", expression: "step({a})" },
        { type: "expression", name: "c", expression: "step({b})" },
        { type: "expression", name: "d", expression: "step({c})" },
      ],
    };
    // The body comes from the execution options: the "functions" map of a suite holds answers, and a
    // function that has a real implementation is not declared there at all.
    const result = await run(surveyJson, {
      tests: [{
        name: "chain",
        steps: [{ set: { a: 1 } }, { expect: { d: { value: 4 } } }],
      }],
    }, {
      functions: {
        step: (params: Array<any>) => new Promise(resolve => setTimeout(() => resolve((params[0] || 0) + 1), 5)),
      },
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("a value an asynchronous trigger writes on another page is checked without navigating to it", async () => {
    const surveyJson = {
      triggers: [{ type: "setvalue", expression: "isBig({q1})", setToName: "flag", setValue: "yes" }],
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1", inputType: "number" }] },
        { name: "page2", elements: [{ type: "text", name: "flag" }] },
      ],
    };
    const result = await run(surveyJson, {
      functions: { isBig: { async: true, delay: 10, results: [{ params: [10], result: true }], result: false } },
      tests: [{
        name: "offpage",
        steps: [{ set: { q1: 10 } }, { expect: { flag: { value: "yes" } } }],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("rows match by arguments, and they match by type", async () => {
    const result = await run(rateSurvey, {
      functions: {
        getRate: {
          async: true, result: -1,
          results: [{ params: ["EUR"], result: 1.1 }, { params: ["GBP"], result: 1.3 }],
        },
      },
      tests: [{
        name: "rows",
        steps: [
          { set: { currency: "GBP" } },
          { expect: { rate: { value: 1.3 } } },
          { set: { currency: "EUR" } },
          { expect: { rate: { value: 1.1 } } },
        ],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("a row whose parameter differs only by type does not answer the call", async () => {
    const surveyJson = {
      elements: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "expression", name: "out", expression: "pick({q1})" },
      ],
    };
    const result = await run(surveyJson, {
      functions: { pick: { async: true, result: "fallback", results: [{ params: ["1"], result: "string one" }] } },
      tests: [{
        name: "types",
        steps: [{ set: { q1: 1 } }, { expect: { out: { value: "fallback" } } }],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("a stub declared as failing gives null and says why", async () => {
    const result = await run(rateSurvey, {
      functions: { getRate: { async: true, error: "the rate service is down" } },
      tests: [{
        name: "failing",
        steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: null } } }],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    expect(codes(result.tests[0])).toContain(SurveyTestIssueCodes.functionStubFailed);
    const issue = allIssues(result.tests[0]).filter(item => item.code === SurveyTestIssueCodes.functionStubFailed)[0];
    expect(issue.severity).toBe("warning");
    expect(issue.message).toContain("the rate service is down");
    // The test still passed: a declared failure is what the case asked for.
    expect(result.tests[0].status).toBe("passed");
  });
  test("a handler that never answers ends the test with the asynchronous timeout", async () => {
    const result = await run(rateSurvey, {
      options: { asyncTimeout: 60 },
      tests: [{
        name: "hanging",
        steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: 1.1 } } }],
      }],
    }, { functions: { getRate: () => new Promise(() => { }) } });
    expect(result.tests[0].status).toBe("error");
    const issue = allIssues(result.tests[0]).filter(item => item.code === SurveyTestIssueCodes.asyncOperationTimeout)[0];
    expect(issue).toBeTruthy();
    expect(issue.data.reason).toBe("expressions");
  });
  test("a synchronous stub answers inside the call", async () => {
    registerFunction("syncRate", () => 0, false);
    const result = await run(rateSurvey.elements[1].expression === undefined ? rateSurvey : {
      elements: [
        { type: "dropdown", name: "currency", choices: ["EUR"] },
        { type: "expression", name: "rate", expression: "syncRate({currency})" },
      ],
    }, {
      functions: { syncRate: { async: false, result: 2.5 } },
      tests: [{
        name: "sync",
        steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: 2.5 } } }],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("a stub that contradicts an existing registration is a case error", async () => {
    registerFunction("getRate", () => 1, true);
    const result = await run(rateSurvey, {
      functions: { getRate: { async: false, result: 1.1 } },
      tests: [{ name: "conflict", steps: [{ set: { currency: "EUR" } }] }],
    });
    expect(result.tests[0].status).toBe("error");
    expect(codes(result.tests[0])).toContain(SurveyTestIssueCodes.functionStubConflict);
  });
  test("a survey that calls a function nobody registered is told once", async () => {
    const result = await run(rateSurvey, {
      tests: [{ name: "unknown", steps: [{ set: { currency: "EUR" } }] }],
    });
    const issues = allIssues(result.tests[0]).filter(item => item.code === SurveyTestIssueCodes.unknownFunctionCalled);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain("getRate");
    expect(issues[0].severity).toBe("warning");
  });
});

describe("survey-tester: function stub isolation", () => {
  test("the application's function is neither replaced for other surveys nor lost afterwards", async () => {
    const calls: Array<string> = [];
    registerFunction("getRate", function(params: Array<any>): any {
      calls.push("real:" + params[0]);
      (<any>this).returnResult(9);
      return false;
    }, true);
    const other = new SurveyModel({
      elements: [
        { type: "dropdown", name: "currency", choices: ["EUR"] },
        { type: "expression", name: "rate", expression: "getRate({currency})" },
      ],
    });
    const runPromise = run(rateSurvey, {
      functions: { getRate: { async: true, result: 1.1 } },
      tests: [{
        name: "stubbed",
        steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: 1.1 } } }],
      }],
    });
    // A survey of the application, evaluated while the run is in flight, reaches the real function.
    other.setValue("currency", "EUR");
    const result = await runPromise;
    // The test read the stub - the real function answers 9 - and the application survey read the real
    // function. The load-time evaluations of the application model are its own and are not counted.
    expect(failedChecks(result.tests[0])).toEqual([]);
    expect(calls.filter(item => item === "real:EUR")).toHaveLength(1);
    expect(other.getValue("rate")).toBe(9);
    // And the registration is exactly what it was before the run.
    expect(FunctionFactory.Instance.isAsyncFunction("getRate")).toBe(true);
    const after = new SurveyModel({
      elements: [
        { type: "dropdown", name: "currency", choices: ["EUR"] },
        { type: "expression", name: "rate", expression: "getRate({currency})" },
      ],
    });
    after.setValue("currency", "EUR");
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(after.getValue("rate")).toBe(9);
  });
  test("two interleaved runs stubbing one name each receive their own answer", async () => {
    const suite = (value: number): any => ({
      functions: { getRate: { async: true, delay: 15, result: value } },
      tests: [{
        name: "rate " + value,
        steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: value } } }],
      }],
    });
    const [first, second] = await Promise.all([run(rateSurvey, suite(1.1)), run(rateSurvey, suite(2.2))]);
    expect(failedChecks(first.tests[0])).toEqual([]);
    expect(failedChecks(second.tests[0])).toEqual([]);
    // Nothing of either run is left installed.
    expect(FunctionFactory.Instance.hasFunction("getRate")).toBe(false);
  });
  test("two interleaved runs that disagree about asyncness do not corrupt each other", async () => {
    const first = run(rateSurvey, {
      functions: { getRate: { async: true, delay: 20, result: 1.1 } },
      tests: [{ name: "async", steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: 1.1 } } }] }],
    });
    const second = await run(rateSurvey, {
      functions: { getRate: { async: false, result: 2.2 } },
      tests: [{ name: "sync", steps: [{ set: { currency: "EUR" } }] }],
    });
    expect(second.tests[0].status).toBe("error");
    expect(codes(second.tests[0])).toContain(SurveyTestIssueCodes.functionStubConflict);
    const firstResult = await first;
    expect(failedChecks(firstResult.tests[0])).toEqual([]);
  });
  test("the answer of one test is not cached into the next", async () => {
    const result = await run(rateSurvey, {
      tests: [
        {
          name: "first",
          functions: { getRate: { async: true, results: [{ params: ["EUR"], result: 1.1 }] } },
          steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: 1.1 } } }],
        },
        {
          name: "second",
          functions: { getRate: { async: true, results: [{ params: ["EUR"], result: 7.7 }] } },
          steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: 7.7 } } }],
        },
      ],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    expect(failedChecks(result.tests[1])).toEqual([]);
  });
  test("a test overrides one entry of the suite map and keeps the rest", async () => {
    const surveyJson = {
      elements: [
        { type: "text", name: "q1" },
        { type: "expression", name: "a", expression: "first()" },
        { type: "expression", name: "b", expression: "second()" },
      ],
    };
    const result = await run(surveyJson, {
      functions: { first: { async: true, result: 1 }, second: { async: true, result: 2 } },
      tests: [{
        name: "override",
        functions: { second: { async: true, result: 22 } },
        steps: [{ set: { q1: "x" } }, { expect: { a: { value: 1 }, b: { value: 22 } } }],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
});

const countriesUrl = "https://api.example.com/countries";
const countriesSurvey = {
  elements: [{
    type: "dropdown", name: "country",
    choicesByUrl: { url: countriesUrl, valueName: "id", titleName: "name" },
  }],
};

describe("survey-tester: web choices", () => {
  test("the choices of a stubbed url are loaded, parsed and checked", async () => {
    const result = await run(countriesSurvey, {
      web: {
        [countriesUrl]: { response: [{ id: "de", name: "Germany" }, { id: "fr", name: "France" }] },
      },
      tests: [{
        name: "countries",
        steps: [{ expect: { country: { choices: ["de", "fr"], choiceTexts: ["Germany", "France"] } } }],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("a nested body is read through \"path\", and a string body is parsed", async () => {
    const surveyJson = {
      elements: [{
        type: "dropdown", name: "country",
        choicesByUrl: { url: countriesUrl, path: "data", valueName: "id", titleName: "name" },
      }],
    };
    const result = await run(surveyJson, {
      web: {
        [countriesUrl]: { response: JSON.stringify({ data: [{ id: "de", name: "Germany" }] }) },
      },
      tests: [{
        name: "path",
        steps: [{ expect: { country: { choices: ["de"], choiceTexts: ["Germany"] } } }],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("a delayed response is waited for before the step that reads it", async () => {
    const result = await run(countriesSurvey, {
      web: { [countriesUrl]: { delay: 25, response: [{ id: "de", name: "Germany" }] } },
      tests: [{ name: "delayed", steps: [{ expect: { country: { choices: ["de"] } } }] }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("a failing status takes the question down the survey's own error path", async () => {
    const loaded: Array<string> = [];
    let created: SurveyModel = undefined;
    const result = await run(countriesSurvey, {
      web: { [countriesUrl]: { status: 500, statusText: "Server Error" } },
      tests: [{ name: "failing", steps: [{ expect: { country: { choices: [] } } }] }],
    }, {
      createSurvey: (json: any, context: ISurveyTestModelFactoryContext): SurveyModel => {
        const survey = new SurveyModel();
        context.attachProviders(survey);
        survey.onLoadChoicesFromServer.add((_, options: any) => { loaded.push(options.question.name); });
        survey.fromJSON(json);
        created = survey;
        return survey;
      },
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    // The survey's own failure path ran: its event fired and the error it builds carries the status.
    expect(loaded).toEqual(["country"]);
    const question: any = created.getQuestionByName("country");
    expect(question.choicesByUrl.error).toBeTruthy();
    expect(question.choicesByUrl.error.getText()).toContain("Server Error");
  });
  test("a piped url asks a second time, and the second stub answers", async () => {
    const surveyJson = {
      elements: [
        { type: "dropdown", name: "country", choices: ["de", "fr"] },
        {
          type: "dropdown", name: "city",
          choicesByUrl: { url: "https://api.example.com/cities?country={country}" },
        },
      ],
    };
    const result = await run(surveyJson, {
      web: {
        "https://api.example.com/cities?country=de": { response: ["Berlin", "Bonn"] },
        "https://api.example.com/cities?country=fr": { response: ["Paris"] },
      },
      tests: [{
        name: "piped",
        steps: [
          { set: { country: "de" } },
          { expect: { city: { choices: ["Berlin", "Bonn"] } } },
          { set: { country: "fr" } },
          { expect: { city: { choices: ["Paris"] } } },
        ],
      }],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("an url uses the real transport when the case has no web section", async () => {
    const globalAny: any = globalThis;
    const savedXhr = globalAny.XMLHttpRequest;
    let transportUsed = 0;
    globalAny.XMLHttpRequest = class {
      public status: number = 200;
      public statusText: string = "OK";
      public response: string = JSON.stringify([{ id: "de", name: "Germany" }]);
      public responseText: string = this.response;
      public onload: () => void;
      public open(): void {}
      public setRequestHeader(): void {}
      public send(): void {
        transportUsed++;
        this.onload();
      }
    };
    try {
      const result = await run(countriesSurvey, {
        tests: [{ name: "real web", steps: [{ expect: { country: { choices: ["de"] } } }] }],
      });
      expect(transportUsed).toBe(1);
      expect(failedChecks(result.tests[0])).toEqual([]);
      expect(codes(result.tests[0])).not.toContain(SurveyTestIssueCodes.webRequestNotStubbed);
    } finally {
      globalAny.XMLHttpRequest = savedXhr;
    }
  });
  test("an url missing from the web section uses the real transport and its static cache", async () => {
    const globalAny: any = globalThis;
    const savedXhr = globalAny.XMLHttpRequest;
    let transportUsed = 0;
    globalAny.XMLHttpRequest = class {
      public status: number = 200;
      public statusText: string = "OK";
      public response: string = JSON.stringify([{ id: "de", name: "Germany" }]);
      public responseText: string = this.response;
      public onload: () => void;
      public open(): void {}
      public setRequestHeader(): void {}
      public send(): void {
        transportUsed++;
        this.onload();
      }
    };
    try {
      const result = await run(countriesSurvey, {
        web: { "https://api.example.com/other": { response: [] } },
        tests: [
          { name: "first", steps: [{ expect: { country: { choices: ["de"] } } }] },
          { name: "cached", steps: [{ expect: { country: { choices: ["de"] } } }] },
          {
            name: "stub wins",
            web: { [countriesUrl]: { response: [{ id: "fr", name: "France" }] } },
            steps: [{ expect: { country: { choices: ["fr"] } } }],
          },
        ],
      });
      expect(failedChecks(result.tests[0])).toEqual([]);
      expect(failedChecks(result.tests[1])).toEqual([]);
      expect(failedChecks(result.tests[2])).toEqual([]);
      expect(transportUsed, "the second test uses ChoicesRestful's static cache").toBe(1);
    } finally {
      globalAny.XMLHttpRequest = savedXhr;
    }
  });
  test("two tests declaring one url differently each get their own answer", async () => {
    const result = await run(countriesSurvey, {
      tests: [
        {
          name: "first",
          web: { [countriesUrl]: { response: [{ id: "de", name: "Germany" }] } },
          steps: [{ expect: { country: { choices: ["de"] } } }],
        },
        {
          name: "second",
          web: { [countriesUrl]: { response: [{ id: "fr", name: "France" }] } },
          steps: [{ expect: { country: { choices: ["fr"] } } }],
        },
      ],
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    expect(failedChecks(result.tests[1])).toEqual([]);
  });
  test("a stubbed request does not write to the process-wide choices cache", async () => {
    const globalAny: any = globalThis;
    const savedXhr = globalAny.XMLHttpRequest;
    const savedCache = settings.web.cacheLoadedChoices;
    settings.web.cacheLoadedChoices = true;
    let transportUsed = 0;
    globalAny.XMLHttpRequest = class {
      public status: number = 200;
      public response: string = JSON.stringify([{ id: "fr", name: "France" }]);
      public onload: () => void;
      public open(): void {}
      public setRequestHeader(): void {}
      public send(): void {
        transportUsed++;
        this.onload();
      }
    };
    try {
      await run(countriesSurvey, {
        web: { [countriesUrl]: { response: [{ id: "de", name: "Germany" }] } },
        tests: [{ name: "cached", steps: [{ expect: { country: { choices: ["de"] } } }] }],
      });
      // An application survey asking for the same url is not served the answer of the test.
      const other = new SurveyModel(countriesSurvey);
      const question: any = other.getQuestionByName("country");
      expect(question.visibleChoices.map((item: any) => item.value)).toEqual(["fr"]);
      expect(transportUsed).toBe(1);
    } finally {
      globalAny.XMLHttpRequest = savedXhr;
      settings.web.cacheLoadedChoices = savedCache;
    }
  });
  test("a question that has a url but never requests it delays no step", async () => {
    const surveyJson = {
      elements: [
        { type: "text", name: "q1" },
        {
          type: "dropdown", name: "lazy", choicesLazyLoadEnabled: true,
          choicesByUrl: { url: countriesUrl },
        },
      ],
    };
    const started = Date.now();
    const result = await run(surveyJson, {
      options: { asyncTimeout: 500 },
      web: { [countriesUrl]: { response: [{ id: "de", name: "Germany" }] } },
      tests: [{
        name: "lazy",
        steps: [{ set: { q1: "a" } }, { expect: { q1: { value: "a" } } }],
      }],
    });
    // The question is un-ready for the whole run - core makes it so the moment it has a url - and no
    // step waited for it.
    expect(result.tests[0].status).toBe("passed");
    expect(Date.now() - started).toBeLessThan(400);
  });
  test("a web handler serves what the case did not declare, and the case wins where it did", async () => {
    const asked: Array<string> = [];
    const result = await run(countriesSurvey, {
      web: { [countriesUrl]: { response: [{ id: "de", name: "Germany" }] } },
      tests: [{ name: "handler", steps: [{ expect: { country: { choices: ["de"] } } }] }],
    }, {
      web: (request: any) => {
        asked.push(request.url);
        return { response: [{ id: "zz", name: "Nowhere" }] };
      },
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    expect(asked).toEqual([]);
  });
  test("an asynchronous web handler answers a url the case left out", async () => {
    const result = await run(countriesSurvey, {
      tests: [{ name: "handler", steps: [{ expect: { country: { choices: ["de"] } } }] }],
    }, {
      web: (request: any) => Promise.resolve(request.url === countriesUrl
        ? { response: [{ id: "de", name: "Germany" }] }
        : undefined),
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
  test("a model kept after the run reloads a declared url instead of loading forever", async () => {
    const pipedSurvey = {
      elements: [
        { type: "text", name: "code", defaultValue: "de" },
        {
          type: "dropdown", name: "country",
          choicesByUrl: { url: "https://api.example.com/{code}/countries", valueName: "id", titleName: "name" },
        },
      ],
    };
    let created: SurveyModel = undefined;
    const result = await run(pipedSurvey, {
      web: {
        "https://api.example.com/de/countries": { response: [{ id: "de", name: "Germany" }] },
        "https://api.example.com/fr/countries": { delay: 30, response: [{ id: "fr", name: "France" }] },
      },
      tests: [{ name: "countries", steps: [{ expect: { country: { choices: ["de"] } } }] }],
    }, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "surveyCreated") created = event.survey;
      },
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    // The run is over and the stubs are disposed, but the model keeps the transport it ran with. The
    // reload this value change starts is answered from the case - at once, whatever delay the stub
    // declares, because no step is waiting for a slow service any more - and the question settles.
    const question: any = created.getQuestionByName("country");
    created.setValue("code", "fr");
    await new Promise(resolve => setTimeout(resolve, 60));
    expect(question.choicesByUrl.isRunning).toBe(false);
    expect(question.visibleChoices.map((item: any) => item.value)).toEqual(["fr"]);
    expect(question.isReady).toBe(true);
  });
});

// A handler is application code and it fails the way application code does. What a case sees then is
// what it sees when a declared stub says it failed: the value the survey would have got from a real
// failure, and a warning that names the handler and says why.
describe("survey-tester: handlers that fail", () => {
  function issueOf(result: ISurveyTestResult, code: string): ISurveyTestIssue {
    return allIssues(result).filter(issue => issue.code === code)[0];
  }
  test("a function handler that throws gives the expression null and says why", async () => {
    const result = await run(rateSurvey, {
      tests: [{
        name: "throwing",
        steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: null } } }],
      }],
    }, {
      functions: { getRate: () => { throw new Error("the rate service is down"); } },
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    const issue = issueOf(result.tests[0], SurveyTestIssueCodes.functionStubFailed);
    expect(issue.severity).toBe("warning");
    expect(issue.message).toContain("the rate service is down");
    // A handler that fails is not a case that is wrong: the case pinned what the survey does about it.
    expect(result.tests[0].status).toBe("passed");
  });
  test("a function handler that rejects gives the expression null and says why", async () => {
    const result = await run(rateSurvey, {
      tests: [{
        name: "rejecting",
        steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: null } } }],
      }],
    }, {
      functions: { getRate: () => Promise.reject(new Error("the rate service timed out")) },
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    const issue = issueOf(result.tests[0], SurveyTestIssueCodes.functionStubFailed);
    expect(issue.severity).toBe("warning");
    expect(issue.message).toContain("the rate service timed out");
    expect(result.tests[0].status).toBe("passed");
  });
  test("a promise from a handler of a synchronous function is reported, not read as a value", async () => {
    registerFunction("syncRate", () => 0, false);
    const surveyJson = {
      elements: [
        { type: "dropdown", name: "currency", choices: ["EUR", "GBP"] },
        { type: "expression", name: "rate", expression: "syncRate({currency})" },
      ],
    };
    const result = await run(surveyJson, {
      tests: [{
        name: "a promise nothing waits for",
        steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: null } } }],
      }],
    }, {
      functions: { syncRate: () => Promise.resolve(1.1) },
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    const issue = issueOf(result.tests[0], SurveyTestIssueCodes.functionStubFailed);
    expect(issue.severity).toBe("warning");
    expect(issue.message).toContain("is a synchronous function");
    expect(issue.message).toContain("\"async\": true");
    expect(result.tests[0].status).toBe("passed");
  });
  test("a web handler that throws leaves the question without choices and says why", async () => {
    const result = await run(countriesSurvey, {
      tests: [{ name: "throwing", steps: [{ expect: { country: { choices: [] } } }] }],
    }, {
      web: () => { throw new Error("the countries service is down"); },
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    const issue = issueOf(result.tests[0], SurveyTestIssueCodes.webRequestNotStubbed);
    expect(issue.severity).toBe("warning");
    expect(issue.message).toContain(countriesUrl);
    expect(issue.message).toContain("the countries service is down");
    expect(result.tests[0].status).toBe("passed");
  });
  test("a web handler that rejects leaves the question without choices and says why", async () => {
    const result = await run(countriesSurvey, {
      tests: [{ name: "rejecting", steps: [{ expect: { country: { choices: [] } } }] }],
    }, {
      web: () => Promise.reject(new Error("the countries service timed out")),
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    const issue = issueOf(result.tests[0], SurveyTestIssueCodes.webRequestNotStubbed);
    expect(issue.severity).toBe("warning");
    expect(issue.message).toContain("the countries service timed out");
    expect(result.tests[0].status).toBe("passed");
  });
  test("a web handler that answers nothing is the url nobody declared", async () => {
    const result = await run(countriesSurvey, {
      tests: [{ name: "no answer", steps: [{ expect: { country: { choices: [] } } }] }],
    }, {
      web: () => undefined,
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
    const issue = issueOf(result.tests[0], SurveyTestIssueCodes.webRequestNotStubbed);
    expect(issue.severity).toBe("warning");
    expect(issue.message).toContain("returned no answer");
    expect(result.tests[0].status).toBe("passed");
  });
});

describe("survey-tester: stubs, cancellation and single tests", () => {
  test("a stopped run leaves nothing pending on the model", async () => {
    const controller = new AbortController();
    const surveyJson = {
      elements: [
        { type: "text", name: "q1" },
        { type: "expression", name: "out", expression: "slow({q1})" },
      ],
    };
    const promise = run(surveyJson, {
      web: { [countriesUrl]: { delay: 30, response: [] } },
      functions: { slow: { async: true, delay: 40, result: "late" } },
      tests: [{
        name: "canceled",
        steps: [{ set: { q1: "a" } }, { expect: { out: { value: "late" } } }],
      }],
    }, { signal: controller.signal });
    setTimeout(() => controller.abort(), 5);
    const result = await promise;
    expect(result.status).toBe("canceled");
    // Nothing rejects or throws after the run is over: the pending answers were dropped.
    await new Promise(resolve => setTimeout(resolve, 60));
  });
  test("runTest() installs the stubs of the suite and of the test", async () => {
    const runner = new SurveyTestRunner(rateSurvey, {
      functions: { getRate: { async: true, result: 1.1 } },
      tests: [],
    });
    const result = await runner.runTest({
      name: "single",
      functions: { getRate: { async: true, result: 3.3 } },
      steps: [{ set: { currency: "EUR" } }, { expect: { rate: { value: 3.3 } } }],
    });
    expect(failedChecks(result)).toEqual([]);
  });
  test("a custom factory attaches the providers before the JSON is loaded", async () => {
    const surveyJson = {
      elements: [
        { type: "text", name: "q1", defaultValueExpression: "getDefault()" },
      ],
    };
    const result = await run(surveyJson, {
      functions: { getDefault: { async: true, result: "from the stub" } },
      tests: [{ name: "constructor time", steps: [{ expect: { q1: { value: "from the stub" } } }] }],
    }, {
      createSurvey: (json: any, context: ISurveyTestModelFactoryContext): SurveyModel => {
        const survey = new SurveyModel();
        context.attachProviders(survey);
        survey.fromJSON(json);
        return survey;
      },
    });
    expect(failedChecks(result.tests[0])).toEqual([]);
  });
});

describe("survey-tester: stub validation", () => {
  const validator = new SurveyTestValidator();
  function validate(suite: any): Array<string> {
    return validator.validate(suite).map(issue => issue.code);
  }
  const oneTest = [{ name: "t", steps: [] }];
  test("a stub that answers nothing is rejected", () => {
    expect(validate({ functions: { f: {} }, tests: oneTest }))
      .toContain(SurveyTestIssueCodes.functionStubHasNoResult);
    expect(validate({ web: { "http://x": {} }, tests: oneTest }))
      .toContain(SurveyTestIssueCodes.webStubHasNoResponse);
  });
  test("a row without params is rejected, and so is a row that answers nothing", () => {
    expect(validate({ functions: { f: { results: [{ result: 1 }] } }, tests: oneTest }))
      .toContain(SurveyTestIssueCodes.functionStubResultsInvalid);
    expect(validate({ functions: { f: { results: [{ params: [1] }] } }, tests: oneTest }))
      .toContain(SurveyTestIssueCodes.functionStubHasNoResult);
  });
  test("a misspelled key is named", () => {
    const issues = validator.validate({ functions: { f: { result: 1, delayed: 5 } }, tests: oneTest });
    const issue = issues.filter(item => item.code === SurveyTestIssueCodes.unknownStubKey)[0];
    expect(issue).toBeTruthy();
    expect(issue.message).toContain("delay");
    expect(issue.path).toBe("functions.f");
  });
  test("a delay on a synchronous stub is rejected", () => {
    expect(validate({ functions: { f: { async: false, delay: 5, result: 1 } }, tests: oneTest }))
      .toContain(SurveyTestIssueCodes.functionStubDelayNotAsync);
  });
  test("the maps themselves must be objects", () => {
    expect(validate({ functions: [], tests: oneTest })).toContain(SurveyTestIssueCodes.functionsNotAnObject);
    expect(validate({ web: 5, tests: oneTest })).toContain(SurveyTestIssueCodes.webNotAnObject);
    expect(validate({ functions: { f: 5 }, tests: oneTest })).toContain(SurveyTestIssueCodes.functionStubNotAnObject);
  });
  test("a valid pair of maps produces nothing", () => {
    expect(validate({
      functions: { f: { async: true, delay: 5, results: [{ params: ["a"], result: 1 }], result: 0 } },
      web: { "http://x": { status: 500 } },
      tests: oneTest,
    })).toEqual([]);
  });
  test("a stub declared inside a test is validated with the path of that test", () => {
    const issues = validator.validate({ tests: [{ name: "t", functions: { f: {} }, steps: [] }] });
    const issue = issues.filter(item => item.code === SurveyTestIssueCodes.functionStubHasNoResult)[0];
    expect(issue.path).toBe("tests[0].functions.f");
  });
});

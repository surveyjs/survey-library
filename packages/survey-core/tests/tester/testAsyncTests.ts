import { FunctionFactory } from "../../src/functionsfactory";
import { SurveyModel } from "../../src/survey";
import { ISurveyTestIssue, ISurveyTestResult, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { ISurveyTestModelFactoryContext } from "../../src/tester/test-execution";
import { SurveyTestRunner } from "../../src/tester/test-runner";

import { afterEach, describe, expect, test } from "vitest";

// A survey operation that finishes later than the call that started it: the tester waits for the model
// to settle before it says what the interaction did, before the next step reads the state and before
// the run ends. Nothing here asserts a returned boolean - that boolean is exactly what is unreliable.

const registeredFunctions: Array<string> = [];
function registerAsyncFunction(name: string, func: (params: any) => any): void {
  registeredFunctions.push(name);
  FunctionFactory.Instance.register(name, func, true, false);
}
afterEach(() => {
  registeredFunctions.splice(0).forEach(name => FunctionFactory.Instance.unregister(name));
});

const onePageSurvey = {
  elements: [{ type: "text", name: "q1" }],
};
const twoPageSurvey = {
  pages: [
    { name: "page1", elements: [{ type: "text", name: "q1" }] },
    { name: "page2", elements: [{ type: "text", name: "q2" }] },
  ],
};
const asyncExpressionSurvey = {
  elements: [
    { type: "text", name: "q1", inputType: "number" },
    { type: "expression", name: "q2", expression: "asyncDouble({q1})" },
  ],
};
function asyncDouble(params: any): any {
  const returnResult = this.returnResult;
  setTimeout(() => returnResult(!params[0] ? 0 : params[0] * 2), 5);
  return false;
}

function run(surveyJson: any, tests: any, createSurvey?: (survey: SurveyModel) => void): Promise<ISurveyTestsResult> {
  const executionOptions = !createSurvey ? undefined : {
    createSurvey: (json: any, context: ISurveyTestModelFactoryContext): SurveyModel => {
      const survey = new SurveyModel();
      survey.dateProvider = context.dateProvider;
      survey.fromJSON(json);
      createSurvey(survey);
      return survey;
    },
  };
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
function issueByCode(result: ISurveyTestResult, code: string): ISurveyTestIssue {
  return allIssues(result).filter(issue => issue.code === code)[0];
}
// The handler of onServerValidateQuestions a real application writes: it answers a moment later, and
// tryComplete()/nextPage() have long returned false by then.
function addServerValidation(survey: SurveyModel, errors?: { [name: string]: string }, delay: number = 5): void {
  survey.onServerValidateQuestions.add((_, options: any) => {
    setTimeout(() => {
      if (!!errors) {
        Object.keys(errors).forEach(name => { options.errors[name] = errors[name]; });
      }
      options.complete();
    }, delay);
  });
}

describe("Server validation", () => {
  test("A completion that passes server validation is not reported as blocked", async () => {
    const result = await run(onePageSurvey, {
      tests: [{
        name: "t", steps: [
          { set: { q1: "abc" } },
          { complete: { survey: true } },
          { expect: { survey: { state: "completed" } } },
        ],
      }],
    }, survey => addServerValidation(survey));
    expect(codes(result.tests[0])).toEqual([]);
    expect(result.tests[0].status).toBe("passed");
  });
  test("The survey is completed when the run ends, not after it", async () => {
    let survey: SurveyModel = undefined;
    await run(onePageSurvey, {
      tests: [{ name: "t", steps: [{ complete: { survey: true } }] }],
    }, model => { survey = model; addServerValidation(model); });
    expect(survey.state).toBe("completed");
  });
  test("A completion the server rejects is blocked, and the warning carries the server error", async () => {
    const result = await run(onePageSurvey, {
      tests: [{
        name: "t", steps: [
          { set: { q1: "abc" } },
          { complete: { survey: true } },
          { expect: { survey: { state: "running" } } },
        ],
      }],
    }, survey => addServerValidation(survey, { q1: "The server says no" }));
    expect(codes(result.tests[0])).toEqual([SurveyTestIssueCodes.completeBlocked]);
    const issue = issueByCode(result.tests[0], SurveyTestIssueCodes.completeBlocked);
    expect(issue.data.questions.length).toBe(1);
    expect(issue.data.questions[0].name).toBe("q1");
    expect(issue.data.questions[0].errors).toEqual(["The server says no"]);
    // The step that follows sees the state the rejection produced, not the state before the command.
    expect(result.tests[0].status).toBe("passed");
  });
  test("A page turn that passes server validation is not reported as blocked", async () => {
    const result = await run(twoPageSurvey, {
      tests: [{
        name: "t", steps: [
          { nextPage: { survey: true } },
          { expect: { survey: { currentPage: "page2" } } },
        ],
      }],
    }, survey => addServerValidation(survey));
    expect(codes(result.tests[0])).toEqual([]);
    expect(result.tests[0].status).toBe("passed");
  });
  test("A page turn the server rejects is blocked", async () => {
    const result = await run(twoPageSurvey, {
      tests: [{
        name: "t", steps: [
          { nextPage: { survey: true } },
          { expect: { survey: { currentPage: "page1" } } },
        ],
      }],
    }, survey => addServerValidation(survey, { q1: "The server says no" }));
    expect(codes(result.tests[0])).toEqual([SurveyTestIssueCodes.nextPageBlocked]);
    expect(result.tests[0].status).toBe("passed");
  });
});

describe("Asynchronous validators and expressions", () => {
  test("A page turn waits for an asynchronous validator", async () => {
    registerAsyncFunction("asyncIsValid", function(params: any): any {
      const returnResult = this.returnResult;
      setTimeout(() => returnResult(params[0] === "ok"), 5);
      return false;
    });
    const surveyJson = {
      pages: [
        {
          name: "page1", elements: [{
            type: "text", name: "q1",
            validators: [{ type: "expression", expression: "asyncIsValid({q1}) = true", text: "Not accepted" }],
          }],
        },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
      ],
    };
    const passed = await run(surveyJson, {
      tests: [{
        name: "t", steps: [
          { set: { q1: "ok" } },
          { nextPage: { survey: true } },
          { expect: { survey: { currentPage: "page2" } } },
        ],
      }],
    });
    expect(codes(passed.tests[0])).toEqual([]);
    expect(passed.tests[0].status).toBe("passed");

    const rejected = await run(surveyJson, {
      tests: [{
        name: "t", steps: [
          { set: { q1: "no" } },
          { nextPage: { survey: true } },
          { expect: { q1: { errors: ["Not accepted"] } } },
        ],
      }],
    });
    expect(codes(rejected.tests[0])).toEqual([SurveyTestIssueCodes.nextPageBlocked]);
    expect(rejected.tests[0].status).toBe("passed");
  });
  test("A step waits for the asynchronous expression its value started", async () => {
    registerAsyncFunction("asyncDouble", asyncDouble);
    const result = await run(asyncExpressionSurvey, {
      tests: [{
        name: "t", steps: [
          { set: { q1: 2 } },
          { expect: { q2: { value: 4 } } },
        ],
      }],
    });
    expect(result.tests[0].steps[1].checks[0].passed).toBe(true);
    expect(result.tests[0].status).toBe("passed");
  });
  // Loading the JSON starts the expression with no value at all, and survey-core skips a second run
  // while the first one is in flight. A start applied on a model that is still loading would be read
  // by nothing.
  test("The model settles before the start data is applied", async () => {
    registerAsyncFunction("asyncDouble", asyncDouble);
    const result = await run(asyncExpressionSurvey, {
      tests: [{
        name: "t", start: { data: { q1: 3 } },
        steps: [{ expect: { q2: { value: 6 } } }],
      }],
    });
    expect(result.tests[0].steps[0].checks[0].passed).toBe(true);
  });
});

describe("A navigation handler that holds its callback", () => {
  test("A completion waits for an asynchronous onCompleting handler", async () => {
    const result = await run(onePageSurvey, {
      tests: [{
        name: "t", steps: [
          { complete: { survey: true } },
          { expect: { survey: { state: "completed" } } },
        ],
      }],
    }, survey => {
      survey.onCompleting.add((): Promise<void> => new Promise<void>(resolve => { setTimeout(resolve, 5); }));
    });
    expect(codes(result.tests[0])).toEqual([]);
    expect(result.tests[0].status).toBe("passed");
  });
});

describe("The asyncTimeout option", () => {
  test("An operation that never finishes ends the test with an error", async () => {
    const result = await run(onePageSurvey, {
      options: { asyncTimeout: 30 },
      tests: [{
        name: "t", steps: [
          { complete: { survey: true } },
          { expect: { survey: { state: "completed" } } },
        ],
      }],
    }, survey => {
      // The handler never calls options.complete(): the survey stays in server validation forever.
      survey.onServerValidateQuestions.add(() => {});
    });
    expect(result.tests[0].status).toBe("error");
    const issue = issueByCode(result.tests[0], SurveyTestIssueCodes.asyncOperationTimeout);
    expect(!!issue).toBe(true);
    expect(issue.data.reason).toBe("serverValidation");
    expect(issue.data.timeout).toBe(30);
    expect(issue.message.indexOf("the \"complete\" command") > -1).toBe(true);
    // The step after the one that timed out never runs.
    expect(result.tests[0].steps.length).toBe(1);
  });
  test("The timeout names the questions an asynchronous validator is holding", async () => {
    registerAsyncFunction("asyncNever", function(): any {
      return false;
    });
    const result = await run({
      elements: [{
        type: "text", name: "q1",
        validators: [{ type: "expression", expression: "asyncNever() = true" }],
      }],
    }, {
      options: { asyncTimeout: 30 },
      tests: [{ name: "t", steps: [{ complete: { survey: true } }] }],
    });
    const issue = issueByCode(result.tests[0], SurveyTestIssueCodes.asyncOperationTimeout);
    expect(issue.data.reason).toBe("validators");
    expect(issue.data.names).toEqual(["q1"]);
  });
  test("Zero waits for nothing", async () => {
    const result = await run(onePageSurvey, {
      options: { asyncTimeout: 0 },
      tests: [{ name: "t", steps: [{ complete: { survey: true } }] }],
    }, survey => addServerValidation(survey));
    // Nothing was awaited, so the survey is still validating and the completion looks blocked. The
    // option exists for a caller that drives the waiting itself.
    expect(codes(result.tests[0])).toEqual([SurveyTestIssueCodes.completeBlocked]);
  });
});

describe("Cancellation while the survey is busy", () => {
  test("A run stopped while it waits is canceled, not timed out", async () => {
    const controller = new AbortController();
    const runner = new SurveyTestRunner(onePageSurvey, {
      options: { asyncTimeout: 1000 },
      tests: [{ name: "t", steps: [{ complete: { survey: true } }] }],
    });
    const promise = runner.run({
      signal: controller.signal,
      createSurvey: (json: any, context: ISurveyTestModelFactoryContext): SurveyModel => {
        const survey = new SurveyModel();
        survey.dateProvider = context.dateProvider;
        survey.fromJSON(json);
        survey.onServerValidateQuestions.add(() => {});
        return survey;
      },
    });
    await new Promise<void>(resolve => { setTimeout(resolve, 20); });
    controller.abort();
    const result = await promise;
    expect(result.status).toBe("canceled");
    expect(codes(result.tests[0]).indexOf(SurveyTestIssueCodes.asyncOperationTimeout)).toBe(-1);
  });
});

import { settings } from "../../src/settings";
import { SurveyModel } from "../../src/survey";
import { ISurveyTestsResult } from "../../src/tester/test-result";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { ISurveyTestCommand, SurveyTestCommandFactory } from "../../src/tester/test-commands";
import {
  ISurveyTestExecutionOptions, ISurveyTestModelFactoryContext, SurveyTestExecutionEvent,
} from "../../src/tester/test-execution";

import { afterEach, describe, expect, test } from "vitest";

// The test clock is pinned per model, never per process. A run that waits - for a UI callback, for an
// asynchronous command, for a factory that fetches something - holds no global state while it waits,
// so another run with another "now", or an ordinary survey of the application, is unaffected.

const savedCommands: { [name: string]: ISurveyTestCommand } = {};
function registerCommand(command: ISurveyTestCommand): void {
  if (!(command.name in savedCommands)) {
    savedCommands[command.name] = SurveyTestCommandFactory.Instance.get(command.name);
  }
  SurveyTestCommandFactory.Instance.register(command);
}
afterEach(() => {
  Object.keys(savedCommands).forEach(name => {
    const prev = savedCommands[name];
    if (!!prev) SurveyTestCommandFactory.Instance.register(prev);
    else SurveyTestCommandFactory.Instance.unregister(name);
    delete savedCommands[name];
  });
});

// year and dv are computed while the model is being built: an expression question and a
// defaultValueExpression both run inside fromJSON. explicit converts a date the case wrote itself.
const clockSurvey = {
  elements: [
    { type: "expression", name: "year", expression: "currentYear()" },
    { type: "text", name: "dv", defaultValueExpression: "currentYear()" },
    { type: "expression", name: "explicit", expression: "getYear('2011-05-05')" },
    { type: "expression", name: "since", expression: "dateDiff('2020-01-01', currentDate(), 'years')" },
  ],
};
const machineYear = new Date().getFullYear();

function delay(ms: number = 0): Promise<void> {
  return new Promise<void>(resolve => { setTimeout(resolve, ms); });
}
// The default step is the case that only asks the survey what year it is, and expects the year of the
// "now" the suite was given.
function suite(now?: string, steps?: Array<any>): any {
  const pinnedYear = !!now ? new Date(Date.parse(now)).getFullYear() : 2024;
  const test: any = { name: "t", steps: steps || [{ expect: { year: { value: pinnedYear } } }] };
  if (!!now) test.options = { now: now };
  return { tests: [test] };
}
function yearOf(survey: SurveyModel, name: string = "year"): any {
  return survey.getQuestionByName(name).value;
}

interface IClockOutcome {
  result: ISurveyTestsResult;
  survey: SurveyModel;
}
// The model of the test is caught as it is created, so what its constructor computed can be read
// before a single step has run.
function runAndCatchSurvey(definition: any, tests: any,
  executionOptions?: ISurveyTestExecutionOptions): Promise<IClockOutcome> {
  const outcome: IClockOutcome = { result: undefined, survey: undefined };
  const given = executionOptions || {};
  const observer = given.onEvent;
  const options: ISurveyTestExecutionOptions = {
    createSurvey: given.createSurvey,
    signal: given.signal,
    onEvent: async (event: SurveyTestExecutionEvent): Promise<void> => {
      if (event.type === "surveyCreated") outcome.survey = event.survey;
      if (!!observer) await observer(event);
    },
  };
  return new SurveyTestRunner(definition, tests).run(options).then(result => {
    outcome.result = result;
    return outcome;
  });
}

describe("The tester clock: what a case computes", () => {
  test("today(), currentDate() and currentYear() read the clock of the test", async () => {
    const definition = {
      elements: [
        { type: "expression", name: "y", expression: "currentYear()" },
        { type: "expression", name: "d", expression: "getYear(currentDate())" },
        { type: "expression", name: "t", expression: "getYear(today())" },
      ],
    };
    const defaultNow = await runAndCatchSurvey(definition, suite(undefined, [{ expect: { y: { value: 2024 } } }]));
    expect(defaultNow.result.tests[0].status, "the default now is 2024-01-01").toEqual("passed");
    expect([yearOf(defaultNow.survey, "y"), yearOf(defaultNow.survey, "d"), yearOf(defaultNow.survey, "t")],
      "the three ways of asking for the current moment agree").toEqual([2024, 2024, 2024]);
    const pinned = await runAndCatchSurvey(definition, suite("2031-07-09T10:00:00", [{ expect: { y: { value: 2031 } } }]));
    expect(pinned.result.tests[0].status, "the now option moves all three").toEqual("passed");
    expect([yearOf(pinned.survey, "y"), yearOf(pinned.survey, "d"), yearOf(pinned.survey, "t")]).toEqual([2031, 2031, 2031]);
    expect(machineYear === 2024 || machineYear === 2031, "the machine clock is not what answered").toBeFalsy();
  });
  test("A defaultValueExpression and an expression question are pinned while the model is built", async () => {
    const outcome = await runAndCatchSurvey(clockSurvey, suite("2030-03-03T00:00:00",
      [{ expect: { dv: { value: 2030 }, year: { value: 2030 } } }]));
    // Read off the model before any step ran: both values were computed inside fromJSON.
    expect(yearOf(outcome.survey, "dv"), "the defaultValueExpression ran with the test clock").toEqual(2030);
    expect(yearOf(outcome.survey, "year"), "so did the expression question").toEqual(2030);
    expect(outcome.result.tests[0].status).toEqual("passed");
  });
  test("An explicit date is the date it says it is", async () => {
    const outcome = await runAndCatchSurvey(clockSurvey, suite("2030-03-03T00:00:00",
      [{ expect: { explicit: { value: 2011 }, since: { value: 10 } } }]));
    expect(yearOf(outcome.survey, "explicit"), "a date written in the survey is never repinned").toEqual(2011);
    expect(yearOf(outcome.survey, "since"), "only the open end of the comparison is the test clock").toEqual(10);
    expect(outcome.result.tests[0].status).toEqual("passed");
  });
  test("An application hook still runs on top of the test clock", async () => {
    const prevHook = settings.onDateCreated;
    const reasons: Array<string> = [];
    settings.onDateCreated = (newDate: Date, reason: string, val?: number | string | Date): Date => {
      reasons.push(reason);
      if (!val) newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    };
    try {
      const outcome = await runAndCatchSurvey(clockSurvey, suite("2030-03-03T00:00:00",
        [{ expect: { year: { value: 2031 } } }]));
      expect(yearOf(outcome.survey), "the hook adjusts the date the clock produced").toEqual(2031);
      expect(reasons.indexOf("function-currentYear") > -1, "the hook is called with the same reasons").toBeTruthy();
      expect(outcome.result.tests[0].status).toEqual("passed");
    } finally {
      settings.onDateCreated = prevHook;
    }
  });
});

describe("The tester clock: nothing global is installed", () => {
  test("settings.onDateCreated is untouched while a run is waiting, and after it", async () => {
    const prevHook = settings.onDateCreated;
    const seen: Array<any> = [];
    const outcome = await runAndCatchSurvey(clockSurvey, suite("2030-03-03T00:00:00"), {
      onEvent: async (event: SurveyTestExecutionEvent): Promise<void> => {
        seen.push(settings.onDateCreated);
        await delay();
      },
    });
    expect(outcome.result.tests[0].status).toEqual("passed");
    expect(seen.length > 0, "the observer was called").toBeTruthy();
    expect(seen.every(hook => hook === prevHook), "the global hook is the application's at every boundary").toBeTruthy();
    expect(settings.onDateCreated, "and it is still the application's afterwards").toBe(prevHook);
  });
  test("An ordinary SurveyModel created while a run is paused reads the machine clock", async () => {
    let release: () => void = undefined;
    const paused = new Promise<void>(resolve => { release = resolve; });
    let ordinaryYear: any = undefined;
    const running = runAndCatchSurvey(clockSurvey, suite("2030-03-03T00:00:00"), {
      onEvent: async (event: SurveyTestExecutionEvent): Promise<void> => {
        // The model of the test exists and its clock is installed on it; the run stops here.
        if (event.type === "surveyCreated") await paused;
      },
    });
    await delay();
    const ordinary = new SurveyModel(JSON.parse(JSON.stringify(clockSurvey)));
    ordinaryYear = yearOf(ordinary);
    release();
    const outcome = await running;
    expect(ordinaryYear, "a survey of the application is not pinned by a tester that is waiting").toEqual(machineYear);
    expect(yearOf(outcome.survey), "and the model of the test keeps its own clock").toEqual(2030);
  });
  test("Two runs with different now values interleave without seeing each other's clock", async () => {
    let release: () => void = undefined;
    const paused = new Promise<void>(resolve => { release = resolve; });
    const order: Array<string> = [];
    const first = runAndCatchSurvey(clockSurvey, suite("2030-03-03T00:00:00"), {
      onEvent: async (event: SurveyTestExecutionEvent): Promise<void> => {
        if (event.type === "surveyCreated") {
          order.push("first paused");
          await paused;
          order.push("first resumed");
        }
      },
    });
    await delay();
    // The whole second run - its model, its steps and its teardown - happens inside the first one.
    const second = await runAndCatchSurvey(clockSurvey, suite("2045-11-11T00:00:00",
      [{ expect: { year: { value: 2045 } } }]));
    order.push("second done");
    release();
    const firstOutcome = await first;
    expect(order, "the second run ran while the first was waiting")
      .toEqual(["first paused", "second done", "first resumed"]);
    expect(yearOf(firstOutcome.survey), "the first run kept its own now").toEqual(2030);
    expect(yearOf(second.survey), "the second run had its own").toEqual(2045);
    expect(firstOutcome.result.tests[0].status, "and both cases passed").toEqual("passed");
    expect(second.result.tests[0].status).toEqual("passed");
    // Re-evaluated after both runs ended: the clock belongs to the model, and the model outlives the run.
    firstOutcome.survey.runExpressions();
    expect(yearOf(firstOutcome.survey), "the model of a finished run still answers with its clock").toEqual(2030);
  });
});

describe("The tester clock: the model factory", () => {
  test("A synchronous factory that takes the clock pins the constructor of its model", async () => {
    const outcome = await runAndCatchSurvey(clockSurvey, suite("2033-02-02T00:00:00"), {
      createSurvey: (surveyJson: any, context: ISurveyTestModelFactoryContext): SurveyModel => {
        const survey = new SurveyModel();
        survey.dateProvider = context.dateProvider;
        survey.fromJSON(surveyJson);
        return survey;
      },
    });
    expect(yearOf(outcome.survey), "the expression question ran inside fromJSON with the test clock").toEqual(2033);
    expect(yearOf(outcome.survey, "dv"), "and so did the defaultValueExpression").toEqual(2033);
  });
  test("An asynchronous factory receives the clock of its own test", async () => {
    const built: Array<number> = [];
    const result = await new SurveyTestRunner(clockSurvey, {
      tests: [
        { name: "a", options: { now: "2026-01-01T00:00:00" }, steps: [{ expect: { year: { value: 2026 } } }] },
        { name: "b", options: { now: "2042-01-01T00:00:00" }, steps: [{ expect: { year: { value: 2042 } } }] },
      ],
    }).run({
      createSurvey: async (surveyJson: any, context: ISurveyTestModelFactoryContext): Promise<SurveyModel> => {
        // The clock survives an await: it travels on the context, not on a global the tester would
        // have had to keep installed while this promise was pending.
        await delay(5);
        const survey = new SurveyModel();
        survey.dateProvider = context.dateProvider;
        survey.fromJSON(surveyJson);
        built.push(survey.getQuestionByName("year").value);
        return survey;
      },
    });
    expect(result.tests.map(item => item.status), "each test ran on its own clock").toEqual(["passed", "passed"]);
    expect(built, "and the constructor of each model saw only that clock").toEqual([2026, 2042]);
  });
  test("A factory that ignores the clock loses it for construction only", async () => {
    const outcome = await runAndCatchSurvey(clockSurvey, suite("2030-03-03T00:00:00",
      [{ expect: { year: { value: machineYear }, dv: { value: machineYear } } }]), {
      createSurvey: (surveyJson: any): SurveyModel => new SurveyModel(surveyJson),
    });
    expect(outcome.result.tests[0].status,
      "what the constructor computed before the tester saw the model is the machine date").toEqual("passed");
    // The tester pins the model it is handed, so everything evaluated from that point on is the test's.
    outcome.survey.runExpressions();
    expect(yearOf(outcome.survey), "every later evaluation reads the test clock").toEqual(2030);
  });
});

describe("The tester clock: cleanup", () => {
  test("A rejected handler leaves no clock behind", async () => {
    registerCommand({
      name: "explodes",
      payloadType: "none",
      run: async () => { await delay(); throw new Error("the handler failed"); },
    });
    const prevHook = settings.onDateCreated;
    const outcome = await runAndCatchSurvey(clockSurvey, suite("2030-03-03T00:00:00", [{ explodes: { year: true } }]));
    expect(outcome.result.tests[0].status, "the case errors").toEqual("error");
    expect(settings.onDateCreated, "and the global hook was never the tester's").toBe(prevHook);
    expect(yearOf(new SurveyModel(JSON.parse(JSON.stringify(clockSurvey)))),
      "a survey created afterwards reads the machine clock").toEqual(machineYear);
  });
  test("A canceled run leaves no clock behind", async () => {
    const controller = new AbortController();
    const prevHook = settings.onDateCreated;
    const outcome = await runAndCatchSurvey(clockSurvey, suite("2030-03-03T00:00:00"), {
      signal: controller.signal,
      onEvent: async (event: SurveyTestExecutionEvent): Promise<void> => {
        if (event.type === "surveyCreated") controller.abort();
      },
    });
    expect(outcome.result.status, "the run is canceled").toEqual("canceled");
    expect(settings.onDateCreated, "the global hook was never the tester's").toBe(prevHook);
    expect(yearOf(new SurveyModel(JSON.parse(JSON.stringify(clockSurvey)))),
      "a survey created afterwards reads the machine clock").toEqual(machineYear);
  });
});

describe("survey.dateProvider outside the tester", () => {
  test("A survey with no provider reads the machine clock", () => {
    const survey = new SurveyModel(JSON.parse(JSON.stringify(clockSurvey)));
    expect(yearOf(survey), "nothing changes for an application that configures nothing").toEqual(machineYear);
  });
  test("A provider assigned before the JSON is loaded pins the model, and only that model", () => {
    const pinned = new SurveyModel();
    pinned.dateProvider = { now: () => Date.parse("2035-06-06T00:00:00") };
    pinned.fromJSON(JSON.parse(JSON.stringify(clockSurvey)));
    const ordinary = new SurveyModel(JSON.parse(JSON.stringify(clockSurvey)));
    expect(yearOf(pinned), "the pinned model computed its expressions with the provider").toEqual(2035);
    expect(yearOf(pinned, "dv"), "the defaultValueExpression too").toEqual(2035);
    expect(yearOf(ordinary), "the survey next to it is untouched").toEqual(machineYear);
    expect(yearOf(pinned, "explicit"), "an explicit date is not the provider's business").toEqual(2011);
  });
});

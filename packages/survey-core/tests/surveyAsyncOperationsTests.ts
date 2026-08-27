import { SurveyModel } from "../src/survey";
import { FunctionFactory } from "../src/functionsfactory";

import { afterEach, describe, expect, test } from "vitest";

// SurveyModel.getRunningAsyncOperations() is the one place that enumerates the asynchronous
// mechanisms of the model, so code that waits for a survey - a busy indicator, the tester, an e2e
// helper - does not keep a list of its own. These tests pin each mechanism: it is reported while it
// runs and gone once it has landed.

const registeredFunctions: Array<string> = [];
function registerAsyncFunction(name: string, func: (params: any[]) => any): void {
  registeredFunctions.push(name);
  FunctionFactory.Instance.register(name, func, true, false);
}
afterEach(() => {
  registeredFunctions.splice(0).forEach(name => FunctionFactory.Instance.unregister(name));
});

function delay(ms: number): Promise<void> {
  return new Promise<void>(resolve => { setTimeout(resolve, ms); });
}
function types(survey: SurveyModel): Array<string> {
  return survey.getRunningAsyncOperations().map(operation => operation.type);
}

describe("SurveyModel.getRunningAsyncOperations", () => {
  test("A settled model reports nothing", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    expect(survey.getRunningAsyncOperations()).toEqual([]);
    survey.setValue("q1", "a");
    expect(survey.getRunningAsyncOperations()).toEqual([]);
  });
  test("A pending server validation is reported until options.complete() is called", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    let complete: () => void = undefined;
    survey.onServerValidateQuestions.add((_, options: any) => { complete = options.complete; });
    survey.tryComplete();
    const operations = survey.getRunningAsyncOperations();
    expect(operations.map(operation => operation.type)).toEqual(["serverValidation"]);
    expect(operations[0].owner, "the survey itself runs it").toBe(survey);
    complete();
    expect(types(survey)).toEqual([]);
    expect(survey.state).toBe("completed");
  });
  test("A navigation handler that holds its callback is reported until it resolves", async () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    let release: () => void = undefined;
    survey.onCompleting.add((): Promise<void> => new Promise<void>(resolve => { release = resolve; }));
    expect(survey.isNavigationBlocked, "nothing holds a navigation yet").toBe(false);
    survey.tryComplete();
    const operations = survey.getRunningAsyncOperations();
    expect(operations.map(operation => operation.type)).toEqual(["navigationHandler"]);
    expect(operations[0].owner, "the survey itself runs it").toBe(survey);
    // The same hold, as the public boolean the navigation buttons disable themselves on.
    expect(survey.isNavigationBlocked).toBe(true);
    release();
    await delay(1);
    expect(types(survey)).toEqual([]);
    expect(survey.isNavigationBlocked).toBe(false);
    expect(survey.state).toBe("completed");
  });
  test("A running asynchronous validator is reported with the question that owns it", async () => {
    registerAsyncFunction("asyncCoreOpsValid", function(params: any[]): any {
      const returnResult = (<any>this).returnResult;
      setTimeout(() => returnResult(params[0] === "ok"), 5);
      return false;
    });
    const survey = new SurveyModel({
      elements: [{
        type: "text", name: "q1",
        validators: [{ type: "expression", expression: "asyncCoreOpsValid({q1}) = true" }],
      }],
    });
    survey.setValue("q1", "ok");
    survey.tryComplete();
    const operations = survey.getRunningAsyncOperations();
    expect(operations.map(operation => operation.type)).toEqual(["validators"]);
    expect((<any>operations[0].owner).name, "the question that validates").toBe("q1");
    await delay(15);
    expect(types(survey)).toEqual([]);
    expect(survey.state).toBe("completed");
  });
  test("A running asynchronous expression is reported with its owner", async () => {
    registerAsyncFunction("asyncCoreOpsRate", function(): any {
      const returnResult = (<any>this).returnResult;
      setTimeout(() => returnResult(1.1), 5);
      return undefined;
    });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "expression", name: "rate", expression: "asyncCoreOpsRate({q1})" },
      ],
    });
    survey.setValue("q1", "EUR");
    const operations = survey.getRunningAsyncOperations();
    expect(operations.map(operation => operation.type)).toEqual(["expressions"]);
    expect((<any>operations[0].owner).name, "the expression question that waits").toBe("rate");
    await delay(15);
    expect(types(survey)).toEqual([]);
    expect(survey.getValue("rate")).toBe(1.1);
  });
  test("Asking for the running operations does not render the pages that were never shown", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2" }] },
        { name: "p3", elements: [{ type: "text", name: "q3" }] },
      ],
    });
    const shown: Array<string> = [];
    survey.onUIStateChanged.add((_, options: any) => {
      if (options.changedProperty === "shown" && !!options.element) shown.push(options.element.name);
    });

    survey.getRunningAsyncOperations();

    // getAllQuestions(includeNested) runs page.onFirstRendering(), which is not repeatable: the page
    // is marked rendered for good and the real first rendering becomes a no-op.
    expect((<any>survey.pages[1]).wasRendered, "page 2 was never rendered").toBe(false);
    expect((<any>survey.pages[2]).wasRendered, "page 3 was never rendered").toBe(false);
    expect(shown, "no page was shown").toEqual([]);
  });
  test("A choicesByUrl request that has not answered is reported with its question", () => {
    let respond: (response: any) => void = undefined;
    const survey = new SurveyModel();
    survey.webProvider = {
      sendRequest: (request, onResponse): void => { respond = onResponse; },
    };
    survey.fromJSON({
      elements: [{
        type: "dropdown", name: "country",
        choicesByUrl: { url: "https://api.example.com/countries", valueName: "id" },
      }],
    });
    const operations = survey.getRunningAsyncOperations();
    expect(operations.map(operation => operation.type)).toEqual(["webChoices"]);
    expect((<any>operations[0].owner).name, "the question that loads").toBe("country");
    respond({ status: 200, response: [{ id: "de" }] });
    expect(types(survey)).toEqual([]);
    expect(survey.getQuestionByName("country").visibleChoices.map((item: any) => item.value)).toEqual(["de"]);
  });
});

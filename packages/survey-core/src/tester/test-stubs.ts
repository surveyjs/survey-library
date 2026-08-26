import { FunctionFactory } from "../functionsfactory";
import type { IFunctionRegistration } from "../functionsfactory";
import type { ISurveyWebProvider, ISurveyWebRequest, ISurveyWebResponse } from "../base-interfaces";
import { SurveyModel } from "../survey";
import { isSameTestValue } from "./test-values";
import { ISurveyTestFunctionResult, ISurveyTestFunctionStub, ISurveyTestWebStub } from "./test-json";
import { SurveyTestIssueCodes } from "./test-result";
import { createCaseError } from "./test-error";
import {
  ISurveyTestWebHandler, ISurveyTestWebHandlerRequest, ISurveyTestWebResponse, SurveyTestFunction,
} from "./test-execution";

// What a survey takes from outside itself, and what a case puts there instead: the asynchronous
// functions its expressions call, and the web service its choicesByUrl questions load from. Declared
// answers come from the case; an undeclared url follows the survey's real, cached web transport.
//
// The two halves are scoped differently, because survey-core decides them at two different moments.
// A url is asked for by a model, and the model carries the transport (survey.webProvider), so the web
// half needs nothing global at all. Whether an expression is asynchronous, on the other hand, is
// decided when the expression is parsed - FunctionFactory.isAsyncFunction, with no survey in reach -
// so the name has to be registered before the JSON is loaded. Only the *name* is global: the body
// dispatches on the survey it was called for, so two runs stubbing one name differently never see
// each other's answers, and an application survey evaluated between them reaches the real function.

// The model a stub answers for. A dispatcher is called by the expression engine with the survey in
// its properties, and that survey is the only thing that says which run it belongs to.
const stubsBySurvey: WeakMap<SurveyModel, SurveyTestStubs> = new WeakMap<SurveyModel, SurveyTestStubs>();

interface IInstalledFunction {
  // What was registered under this name before the first run installed a dispatcher, if anything. It
  // is what a survey with no stub of its own gets, and it is what goes back when the last run ends.
  saved?: IFunctionRegistration;
  isAsync: boolean;
  // How many runs are holding this name. A concurrent run must not have the function taken away from
  // it because another one finished.
  count: number;
}
const installedFunctions: { [name: string]: IInstalledFunction } = {};

// One entry per name, whatever the number of runs: the dispatcher is stateless and routes by survey.
function createFunctionDispatcher(name: string): (params: any[], originalParams: any[]) => any {
  return function(this: any, params: any[], originalParams: any[]): any {
    const survey = this.survey;
    const stubs = !!survey ? stubsBySurvey.get(survey) : undefined;
    const stub = !!stubs ? stubs.getFunctionStub(name) : undefined;
    if (!stub) {
      // Not this run's function: the survey belongs to another test that does not stub the name, or
      // to the application itself. It gets what it would have got if no test were running.
      const saved = !!installedFunctions[name] ? installedFunctions[name].saved : undefined;
      if (!!saved) return saved.func.call(this, params, originalParams);
      if (!!this.returnResult)this.returnResult(null);
      return null;
    }
    return stubs.runFunctionStub(name, stub, params, this);
  };
}

// Installing is refcounted per name and it never replaces a registration with a different asyncness:
// a survey cannot treat one name as asynchronous and synchronous at once, and silently flipping it
// would change how an unrelated model parses its expressions.
function installFunction(name: string, isAsync: boolean): void {
  const installed = installedFunctions[name];
  if (!!installed) {
    if (installed.isAsync !== isAsync) {
      throw createCaseError(SurveyTestIssueCodes.functionStubConflict,
        "The function \"" + name + "\" is already stubbed as " + asyncText(installed.isAsync) +
        " by a test that is running now, and this test declares it " + asyncText(isAsync) +
        ". Whether a function is asynchronous is decided when an expression is parsed, so one name " +
        "cannot be both. Declare \"async\" the same way in both tests.",
        { data: { name: name, isAsync: isAsync, installedIsAsync: installed.isAsync } });
    }
    installed.count++;
    return;
  }
  const saved = getRegistration(name);
  if (!!saved && !!saved.isAsync !== isAsync) {
    throw createCaseError(SurveyTestIssueCodes.functionStubConflict,
      "The function \"" + name + "\" is registered as " + asyncText(!!saved.isAsync) +
      " and the stub declares it " + asyncText(isAsync) + ". Whether a function is asynchronous is " +
      "decided when an expression is parsed and it is the same for every survey in the process, so " +
      "the stub cannot change it. Remove \"async\" from the stub to use the registered one.",
      { data: { name: name, isAsync: isAsync, registeredIsAsync: !!saved.isAsync } });
  }
  // useCache is off on purpose. The cache of the factory keeps a result whose validity is decided by
  // the survey values the function read, so a stub that reads none - getRate("EUR") - would be valid
  // for every survey in the process, and the answer of one test would be handed to the next one.
  FunctionFactory.Instance.register({ name: name, func: createFunctionDispatcher(name), isAsync: isAsync, useCache: false });
  installedFunctions[name] = { saved: saved, isAsync: isAsync, count: 1 };
}

function uninstallFunction(name: string): void {
  const installed = installedFunctions[name];
  if (!installed) return;
  installed.count--;
  if (installed.count > 0) return;
  delete installedFunctions[name];
  if (!!installed.saved) {
    FunctionFactory.Instance.register(installed.saved);
  } else {
    FunctionFactory.Instance.unregister(name);
  }
}

function getRegistration(name: string): IFunctionRegistration {
  const all = FunctionFactory.Instance.getRegistrations();
  for (let i = 0; i < all.length; i++) {
    if (all[i].name === name) return all[i];
  }
  return undefined;
}

function asyncText(isAsync: boolean): string {
  return isAsync ? "asynchronous" : "synchronous";
}

// How a stub reports what it did. The stubs answer while a step is running, so an issue they raise
// lands on that step - which is the step whose result would otherwise be inexplicable.
export type SurveyTestStubReporter = (code: string, message: string, data?: any) => void;

export class SurveyTestStubs {
  private reporter: SurveyTestStubReporter;
  private timers: Array<any> = [];
  private installedNames: Array<string> = [];
  private isDisposedValue: boolean = false;
  private webProviderValue: ISurveyWebProvider;
  constructor(private functions: { [name: string]: ISurveyTestFunctionStub },
    private web: { [url: string]: ISurveyTestWebStub },
    private functionHandlers?: { [name: string]: SurveyTestFunction },
    private webHandler?: ISurveyTestWebHandler) {
    const self = this;
    this.webProviderValue = {
      canHandleRequest: (request: ISurveyWebRequest): boolean => {
        return self.canHandleWebRequest(request);
      },
      sendRequest: (request: ISurveyWebRequest, onResponse: (response: ISurveyWebResponse) => void): void => {
        self.sendWebRequest(request, onResponse);
      },
    };
  }
  public get webProvider(): ISurveyWebProvider {
    return this.webProviderValue;
  }
  public setReporter(reporter: SurveyTestStubReporter): void {
    this.reporter = reporter;
  }
  // Before the JSON of the test is loaded: an expression is built as asynchronous or not when it is
  // parsed, so a name registered after that is a name the survey never waits for.
  public install(): void {
    const names = Object.keys(this.functions).concat(Object.keys(this.functionHandlers || {}));
    names.forEach(name => {
      if (this.installedNames.indexOf(name) >= 0) return;
      installFunction(name, this.isAsyncStub(name));
      this.installedNames.push(name);
    });
  }
  // The model of this test, so that the dispatcher of a name several runs share knows whose answer to
  // give. Called before the JSON is loaded, for the same reason the clock is: an expression that runs
  // while the model is being built calls the function of its own test, not of another one.
  public attach(survey: SurveyModel): void {
    if (!survey) return;
    stubsBySurvey.set(survey, this);
    survey.webProvider = this.webProvider;
  }
  // Everything this test started stops here: a pending answer is dropped instead of landing on a model
  // no step is watching, and the names this test holds go back to what they were.
  public dispose(): void {
    if (this.isDisposedValue) return;
    this.isDisposedValue = true;
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
    this.installedNames.forEach(name => uninstallFunction(name));
    this.installedNames = [];
    this.reporter = undefined;
  }
  public get isDisposed(): boolean {
    return this.isDisposedValue;
  }
  public getFunctionStub(name: string): ISurveyTestFunctionStub {
    const stub = this.functions[name];
    if (!!stub) return stub;
    // A code handler serves what the case did not declare: the case document is the reproducible
    // artifact, so a JSON entry always wins.
    return !!this.functionHandlers && !!this.functionHandlers[name] ? {} : undefined;
  }
  public runFunctionStub(name: string, stub: ISurveyTestFunctionStub, params: any[], properties: any): any {
    const isAsync = this.isAsyncStub(name);
    const handler = !!this.functionHandlers ? this.functionHandlers[name] : undefined;
    if (!!handler && !this.functions[name]) {
      return this.runFunctionHandler(name, handler, params, properties, isAsync);
    }
    const row = this.findFunctionRow(stub, params);
    const outcome = !!row ? row : stub;
    const delay = typeof outcome.delay === "number" ? outcome.delay : stub.delay;
    if (!isAsync) {
      return this.getFunctionResult(name, outcome, params);
    }
    this.schedule(() => {
      if (!properties.returnResult) return;
      properties.returnResult(this.getFunctionResult(name, outcome, params));
    }, delay);
    return undefined;
  }
  private runFunctionHandler(name: string, handler: SurveyTestFunction, params: any[],
    properties: any, isAsync: boolean): any {
    let res: any = undefined;
    try {
      res = handler(params, properties.survey);
    } catch(e) {
      this.report(SurveyTestIssueCodes.functionStubFailed, "The handler of the function \"" + name +
        "\" failed: " + errorText(e) + ". The expression that called it receives null.",
      { name: name, params: params, error: errorText(e) });
      res = null;
    }
    if (!!res && typeof res.then === "function") {
      // A handler that returns a promise is asynchronous whatever it was registered as: a synchronous
      // expression cannot wait for it, so the case is told instead of reading a promise as a value.
      if (!isAsync) {
        this.report(SurveyTestIssueCodes.functionStubFailed, "The handler of the function \"" + name +
          "\" returned a promise, but \"" + name + "\" is a synchronous function: nothing waits for " +
          "it and the expression receives null. Declare the stub with \"async\": true.",
        { name: name, params: params });
        return null;
      }
      res.then((value: any) => {
        if (this.isDisposedValue || !properties.returnResult) return;
        properties.returnResult(value);
      }, (error: any) => {
        this.report(SurveyTestIssueCodes.functionStubFailed, "The handler of the function \"" + name +
          "\" failed: " + errorText(error) + ". The expression that called it receives null.",
        { name: name, params: params, error: errorText(error) });
        if (this.isDisposedValue || !properties.returnResult) return;
        properties.returnResult(null);
      });
      return undefined;
    }
    if (!isAsync) return res;
    this.schedule(() => {
      if (!properties.returnResult) return;
      properties.returnResult(res);
    }, 0);
    return undefined;
  }
  private getFunctionResult(name: string, outcome: ISurveyTestFunctionStub | ISurveyTestFunctionResult,
    params: any[]): any {
    if (typeof outcome.error === "string") {
      this.report(SurveyTestIssueCodes.functionStubFailed,
        "The stub of the function \"" + name + "\" is declared as failing: " + outcome.error +
        ". The expression that called it receives null, the way it does when a real handler fails.",
        { name: name, params: params, error: outcome.error });
      return null;
    }
    return outcome.result;
  }
  // The rows are tried in the order the case wrote them, and the first match answers. The comparison
  // is the strict one the checks use: a case must not pass because "1" matched 1.
  private findFunctionRow(stub: ISurveyTestFunctionStub, params: any[]): ISurveyTestFunctionResult {
    const rows = stub.results;
    if (!Array.isArray(rows)) return undefined;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!!row && Array.isArray(row.params) && isSameParams(row.params, params)) return row;
    }
    return undefined;
  }
  private isAsyncStub(name: string): boolean {
    const stub = this.functions[name];
    if (!!stub && typeof stub.async === "boolean") return stub.async;
    const registered = getRegistration(name);
    // What the process already believes about the name wins over a default: a stub of a registered
    // function replaces its body, never its contract. Only a name nobody registered is asynchronous
    // by default - a stub declared for it exists to be waited for.
    if (!!registered) return !!registered.isAsync;
    return true;
  }
  private canHandleWebRequest(request: ISurveyWebRequest): boolean {
    const url = !!request ? request.url : "";
    return !!this.web[url] || !!this.webHandler;
  }
  private sendWebRequest(request: ISurveyWebRequest, onResponse: (response: ISurveyWebResponse) => void): void {
    const url = !!request ? request.url : "";
    // The transport stays on the model when the test is over, so a request may arrive after teardown -
    // a host that keeps rendering the model reloads a url. Such a request was never part of the test:
    // no step waits for it and nothing is reported about it, but a url this test claims still has to
    // be answered. Dropping it would leave the question loading for as long as the model lives.
    const afterTeardown = this.isDisposedValue;
    const stub = this.web[url];
    if (!!stub) {
      // A delay describes a slow service to the step that waits for it. After teardown no step does,
      // and this object no longer owns timers: it is the same answer, given at once.
      if (afterTeardown) {
        onResponse(this.getWebStubResponse(stub));
        return;
      }
      this.schedule(() => {
        onResponse(this.getWebStubResponse(stub));
      }, stub.delay);
      return;
    }
    if (!!this.webHandler) {
      this.runWebHandler(url, onResponse, afterTeardown);
      return;
    }
    this.reportUnstubbedUrl(url);
    onResponse({ status: 200, response: [] });
  }
  private getWebStubResponse(stub: ISurveyTestWebStub): ISurveyWebResponse {
    return {
      status: typeof stub.status === "number" ? stub.status : 200,
      statusText: stub.statusText,
      response: stub.response,
    };
  }
  private runWebHandler(url: string, onResponse: (response: ISurveyWebResponse) => void,
    afterTeardown?: boolean): void {
    const request: ISurveyTestWebHandlerRequest = { url: url };
    let res: any = undefined;
    try {
      res = this.webHandler(request);
    } catch(e) {
      this.reportWebHandlerError(url, e);
      onResponse({ status: 200, response: [] });
      return;
    }
    if (!!res && typeof res.then === "function") {
      // An answer to a request the test made is dropped once the test is over: it would land on a
      // model no step is watching. An answer to a request that came after teardown is the only thing
      // whoever made that request is waiting for.
      res.then((response: ISurveyWebResponse) => {
        if (this.isDisposedValue && !afterTeardown) return;
        onResponse(this.toWebResponse(url, response));
      }, (error: any) => {
        if (this.isDisposedValue && !afterTeardown) return;
        this.reportWebHandlerError(url, error);
        onResponse({ status: 200, response: [] });
      });
      return;
    }
    onResponse(this.toWebResponse(url, res));
  }
  // A handler that answers with nothing declared nothing: the request is as unstubbed as it would be
  // without a handler at all, and it is reported the same way rather than read as an empty body.
  private toWebResponse(url: string, response: ISurveyTestWebResponse): ISurveyWebResponse {
    if (!response || typeof response !== "object") {
      this.reportUnstubbedUrl(url);
      return { status: 200, response: [] };
    }
    return {
      status: typeof response.status === "number" ? response.status : 200,
      statusText: response.statusText,
      response: response.response,
    };
  }
  private reportUnstubbedUrl(url: string): void {
    const declared = Object.keys(this.web);
    this.report(SurveyTestIssueCodes.webRequestNotStubbed,
      "The survey requested \"" + url + "\", and the web handler returned no answer for it, so the " +
      "question loaded no choices. " +
      (declared.length > 0
        ? "The urls the case declares: " + declared.join(", ") + "."
        : "Declare the url in the \"web\" section of the suite or return it from the handler."),
      { url: url, declared: declared });
  }
  private reportWebHandlerError(url: string, error: any): void {
    this.report(SurveyTestIssueCodes.webRequestNotStubbed,
      "The handler that answers web requests failed for \"" + url + "\": " + errorText(error) +
      ". The question loaded no choices.",
      { url: url, error: errorText(error) });
  }
  // A delay is real milliseconds and it is deliberately not the pinned clock: what it describes is a
  // slow handler, not a different date. Zero costs no timer - a microtask is already a turn later than
  // the call that started it, which is all "asynchronous" has to mean here.
  private schedule(action: () => void, delay?: number): void {
    if (this.isDisposedValue) return;
    const ms = typeof delay === "number" && isFinite(delay) && delay > 0 ? delay : 0;
    if (ms === 0) {
      Promise.resolve().then(() => {
        if (this.isDisposedValue) return;
        action();
      });
      return;
    }
    const timer = setTimeout(() => {
      this.timers = this.timers.filter(item => item !== timer);
      if (this.isDisposedValue) return;
      action();
    }, ms);
    this.timers.push(timer);
  }
  private report(code: string, message: string, data?: any): void {
    if (!this.reporter || this.isDisposedValue) return;
    this.reporter(code, message, data);
  }
}

// Argument by argument, with the comparison the checks use: a row must not answer a call because "1"
// matched 1. A shorter or longer argument list is a different call.
function isSameParams(expected: Array<any>, actual: Array<any>): boolean {
  if (!Array.isArray(actual) || expected.length !== actual.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (!isSameTestValue(actual[i], expected[i])) return false;
  }
  return true;
}

function errorText(error: any): string {
  return !!error && !!error.message ? error.message : String(error);
}

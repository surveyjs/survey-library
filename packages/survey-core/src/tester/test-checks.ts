import { Helpers } from "../helpers";
import { CHECK_COMMAND_NAME } from "./test-json";
import {
  formatTestValue, getTestPayloadTypeText, isValidTestPayload, SurveyTestCommandFactory, SurveyTestPayloadType,
} from "./test-commands";
import { ISurveyTestContext, ISurveyTestTarget, SurveyTestTargetKind } from "./test-context";
import { ISurveyTestIssue, SurveyTestIssueCodes } from "./test-result";

export interface ISurveyTestCheckOutcome {
  passed: boolean;
  actual: any;
  message?: string;
  details?: any;
}

// The runtime counterpart of ISurveyTestCheck from test-json.ts: that one is the JSON shape of a
// check map, this one is a registered check handler.
export interface ISurveyTestCheckHandler {
  name: string;
  // The target kinds the check applies to; undefined means all of them.
  kinds?: Array<SurveyTestTargetKind>;
  payloadType: SurveyTestPayloadType;
  check(context: ISurveyTestContext, target: ISurveyTestTarget, expected: any): ISurveyTestCheckOutcome;
}

export function isCheckAllowedForKind(check: ISurveyTestCheckHandler, kind: SurveyTestTargetKind): boolean {
  return !check.kinds || check.kinds.indexOf(kind) > -1;
}

export class SurveyTestCheckFactory {
  public static Instance: SurveyTestCheckFactory = new SurveyTestCheckFactory();
  private checks: { [name: string]: ISurveyTestCheckHandler } = {};
  public register(check: ISurveyTestCheckHandler): void {
    this.checks[check.name] = check;
  }
  public unregister(name: string): void {
    delete this.checks[name];
  }
  public get(name: string): ISurveyTestCheckHandler {
    return this.checks[name];
  }
  // Sorted and stable: the Builder editor populates its dropdowns from it.
  public getNames(): Array<string> {
    return Object.keys(this.checks).sort();
  }
  public getNamesForKind(kind: SurveyTestTargetKind): Array<string> {
    return this.getNames().filter(name => isCheckAllowedForKind(this.checks[name], kind));
  }
}

function addPairIssue(context: ISurveyTestContext, code: string, message: string, target: string, data: any): void {
  const issue: ISurveyTestIssue = { severity: "error", code: code, message: message, target: target, data: data };
  context.addIssue(issue);
}

// "expect" is an ordinary registry entry whose parameters are a map of check -> expected value. It is
// the only place assertions are produced by a built-in, but nothing about producing them is tied to
// this name: any command may call context.addCheckResult.
SurveyTestCommandFactory.Instance.register({
  name: CHECK_COMMAND_NAME,
  allowSurvey: true,
  allowElement: true,
  paramsKind: "checks",
  payloadType: "nameMap",
  run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void => {
    const factory = SurveyTestCheckFactory.Instance;
    // Every pair produces a result or an issue, including the pairs after a failing one: checks are
    // independent of each other.
    Object.keys(params).forEach(checkName => {
      const handler = factory.get(checkName);
      if (!handler) {
        addPairIssue(context, SurveyTestIssueCodes.unknownCheck,
          "There is no check named \"" + checkName + "\". Available checks: " + factory.getNames().join(", ") + ".",
          target.name, { check: checkName });
        return;
      }
      if (!isCheckAllowedForKind(handler, target.kind)) {
        addPairIssue(context, SurveyTestIssueCodes.checkNotApplicable,
          "The check \"" + checkName + "\" does not apply to the " + target.kind + " \"" + target.name +
          "\". Checks for a " + target.kind + ": " + factory.getNamesForKind(target.kind).join(", ") + ".",
          target.name, { check: checkName, kind: target.kind });
        return;
      }
      const expected = params[checkName];
      if (!isValidTestPayload(handler.payloadType, expected)) {
        addPairIssue(context, SurveyTestIssueCodes.invalidCheckPayload,
          "The check \"" + checkName + "\" expects " + getTestPayloadTypeText(handler.payloadType) +
          " as its expected value, but the target \"" + target.name + "\" passes " + formatTestValue(expected) + ".",
          target.name, { check: checkName, payloadType: handler.payloadType });
        return;
      }
      const outcome = handler.check(context, target, expected);
      context.addCheckResult({
        target: target.name,
        check: checkName,
        expected: expected,
        actual: outcome.actual,
        passed: outcome.passed,
        message: outcome.message,
        details: outcome.details,
      });
    });
  },
});

// The expression engine compares values with Helpers.isTwoValueEquals, so a case compares them the
// same way: "5" and 5, or two arrays with the same items, must not disagree with what the survey does.
SurveyTestCheckFactory.Instance.register({
  name: "value",
  kinds: ["question"],
  payloadType: "value",
  check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any): ISurveyTestCheckOutcome => {
    const actual = target.obj.value;
    const passed = Helpers.isTwoValueEquals(actual, expected);
    return {
      passed: passed,
      actual: actual,
      message: passed ? undefined
        : "The value of \"" + target.name + "\" is " + formatTestValue(actual) + ", expected " + formatTestValue(expected) + ".",
    };
  },
});

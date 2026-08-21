import { CHECK_COMMAND_NAME, ISurveyTests, RESERVED_TARGET_SURVEY, STEP_METADATA_KEYS } from "../../src/tester/test-json";
import { ISurveyTestIssue, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { SurveyTestValidator } from "../../src/tester/test-validator";

import { describe, test, expect } from "vitest";

function validate(tests: any): Array<ISurveyTestIssue> {
  return new SurveyTestValidator().validate(tests);
}
function codes(issues: Array<ISurveyTestIssue>): Array<string> {
  return issues.map(issue => issue.code);
}
function paths(issues: Array<ISurveyTestIssue>): Array<string | undefined> {
  return issues.map(issue => issue.path);
}
function deepFreeze<T>(obj: T): T {
  if (!!obj && typeof obj === "object") {
    Object.getOwnPropertyNames(obj).forEach(key => deepFreeze((<any>obj)[key]));
    Object.freeze(obj);
  }
  return obj;
}

describe("SurveyTestValidator: a valid suite", () => {
  test("A minimal suite produces no issues", () => {
    const issues = validate({
      tests: [
        {
          name: "Declining insurance skips the provider question",
          steps: [
            { set: { hasInsurance: "no" } },
            { expect: { insuranceProvider: { visible: false } } },
          ],
        },
      ],
    });
    expect(codes(issues), "The suite is valid").toEqual([]);
  });
  test("The canonical example from the overview produces no issues", () => {
    const issues = validate({
      name: "Insurance",
      tests: [
        {
          name: "Declining insurance skips the provider question",
          steps: [
            { set: { hasInsurance: "no" } },
            { expect: { insuranceProvider: { visible: false } } },
            { complete: { survey: true } },
            {
              expect: {
                survey: {
                  state: "completed",
                  values: { hasInsurance: "no" },
                  noValues: ["insuranceProvider"],
                },
              },
            },
          ],
        },
      ],
    });
    expect(codes(issues), "The canonical example is valid").toEqual([]);
  });
  test("A suite using every documented key produces no issues", () => {
    // A type-level fixture as well: a change that breaks the declared shape breaks compilation here.
    const suite: ISurveyTests = {
      name: "Insurance",
      description: "Every documented key",
      options: {
        locale: "de",
        now: "2024-05-05T10:00:00",
        randomSeed: 5,
        clearInvisibleValues: "onComplete",
        checkErrorsMode: "onValueChanged",
        stopOnFirstFailure: true,
      },
      variables: { region: "eu", tier: "gold" },
      starts: [
        {
          name: "midFlow",
          description: "The second page is filled in",
          data: { hasInsurance: "yes" },
          startPage: "page2",
          dataMode: "restore",
        },
      ],
      tests: [
        {
          name: "A named start",
          description: "Starts from midFlow",
          disabled: false,
          start: "midFlow",
          options: { stopOnFirstFailure: false },
          variables: { region: "us" },
          steps: [
            { name: "Answer", description: "Type the provider", set: { insuranceProvider: "Acme" } },
            { expect: { insuranceProvider: { value: "Acme", visible: true } } },
          ],
        },
        {
          name: "An inline start",
          start: { data: { hasInsurance: "no" }, startPage: "page2", dataMode: "input" },
          steps: [{ expect: { survey: { state: "running" } } }],
        },
      ],
    };
    expect(codes(validate(suite)), "Every documented key is valid").toEqual([]);
  });
  test("An unknown suite-level key is ignored, an older file stays loadable", () => {
    const issues = validate({
      survey: { elements: [{ type: "text", name: "q1" }] },
      tests: [{ name: "t1", steps: [{ expect: { q1: { visible: true } } }] }],
    });
    expect(codes(issues), "The stray \"survey\" key is ignored").toEqual([]);
  });
  test("A disabled test is validated as any other test", () => {
    const issues = validate({
      tests: [{ name: "t1", disabled: true, steps: [{}] }],
    });
    expect(codes(issues), "\"disabled\" does not suppress structural validation").toEqual([SurveyTestIssueCodes.stepEmpty]);
    expect(paths(issues)).toEqual(["tests[0].steps[0]"]);
  });
});

describe("SurveyTestValidator: the suite object", () => {
  test("The suite must be an object", () => {
    expect(codes(validate(null)), "null").toEqual([SurveyTestIssueCodes.notAnObject]);
    expect(codes(validate(undefined)), "undefined").toEqual([SurveyTestIssueCodes.notAnObject]);
    expect(codes(validate("suite")), "a string").toEqual([SurveyTestIssueCodes.notAnObject]);
    expect(codes(validate([])), "an array").toEqual([SurveyTestIssueCodes.notAnObject]);
  });
  test("\"tests\" must be a non-empty array", () => {
    expect(codes(validate({})), "no tests").toEqual([SurveyTestIssueCodes.testsMissing]);
    expect(codes(validate({ tests: [] })), "an empty array").toEqual([SurveyTestIssueCodes.testsMissing]);
    expect(codes(validate({ tests: {} })), "an object").toEqual([SurveyTestIssueCodes.testsMissing]);
  });
  test("A test must be an object", () => {
    const issues = validate({ tests: ["t1"] });
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.notAnObject]);
    expect(paths(issues)).toEqual(["tests[0]"]);
  });
});

describe("SurveyTestValidator: tests", () => {
  test("A test must have a non-empty name", () => {
    const issues = validate({ tests: [{ steps: [{ set: { q1: 1 } }] }, { name: "", steps: [{ set: { q1: 1 } }] }] });
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.testNameMissing, SurveyTestIssueCodes.testNameMissing]);
    expect(paths(issues)).toEqual(["tests[0]", "tests[1]"]);
  });
  test("Two tests with the same name produce a warning on the second one", () => {
    const issues = validate({
      tests: [
        { name: "t1", steps: [{ set: { q1: 1 } }] },
        { name: "t1", steps: [{ set: { q1: 2 } }] },
      ],
    });
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.duplicateTestName]);
    expect(issues[0].severity, "A duplicate test name is a warning").toBe("warning");
    expect(issues[0].path, "The second test is reported").toBe("tests[1]");
    expect(issues[0].data.indexes, "Both indexes are reported").toEqual([0, 1]);
    expect(issues[0].message.indexOf("\"t1\"") > -1, "The message names the test").toBeTruthy();
  });
  test("\"steps\" must be an array, and an empty one is valid", () => {
    expect(codes(validate({ tests: [{ name: "t1" }] })), "no steps").toEqual([SurveyTestIssueCodes.stepsMissing]);
    expect(codes(validate({ tests: [{ name: "t1", steps: {} }] })), "an object").toEqual([SurveyTestIssueCodes.stepsMissing]);
    expect(codes(validate({ tests: [{ name: "t1", steps: <any>null }] })), "null").toEqual([SurveyTestIssueCodes.stepsMissing]);
    expect(codes(validate({ tests: [{ name: "t1", steps: <any>"set" }] })), "a string").toEqual([SurveyTestIssueCodes.stepsMissing]);
    // The intermediate state of a test that is being written, and what a recorder starts from: the
    // runner builds the model, applies the start state and hands it over with nothing recorded yet.
    expect(codes(validate({ tests: [{ name: "t1", steps: [] }] })), "an empty array is valid").toEqual([]);
  });
});

describe("SurveyTestValidator: steps", () => {
  function validateSteps(steps: Array<any>): Array<ISurveyTestIssue> {
    return validate({ tests: [{ name: "t1", steps: steps }] });
  }
  test("A step must be an object", () => {
    const issues = validateSteps(["set"]);
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.stepNotAnObject]);
    expect(paths(issues)).toEqual(["tests[0].steps[0]"]);
  });
  test("A step without a command is empty", () => {
    expect(codes(validateSteps([{}])), "an empty step").toEqual([SurveyTestIssueCodes.stepEmpty]);
    const issues = validateSteps([{ name: "x", description: "y" }]);
    expect(codes(issues), "metadata only").toEqual([SurveyTestIssueCodes.stepEmpty]);
    STEP_METADATA_KEYS.forEach(key => {
      expect(issues[0].message.indexOf("\"" + key + "\"") > -1, "The message names the metadata key " + key).toBeTruthy();
    });
  });
  test("A step holds exactly one command, an action and an assertion never mix", () => {
    const issues = validateSteps([{ set: { q1: 1 }, expect: { q1: { value: 1 } } }]);
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.stepHasSeveralCommands]);
    expect(issues[0].data.commands).toEqual(["set", "expect"]);
    expect(issues[0].message.indexOf("\"set\"") > -1, "The message names \"set\"").toBeTruthy();
    expect(issues[0].message.indexOf("\"expect\"") > -1, "The message names \"expect\"").toBeTruthy();
    expect(issues[0].message.indexOf("is a command as well") > -1, "The message points out that \"expect\" is a command").toBeTruthy();
    expect(issues[0].step, "The step index is reported").toBe(0);
  });
  test("Two action commands in one step are reported as well", () => {
    const issues = validateSteps([{ set: { q1: 1 }, complete: { survey: true } }]);
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.stepHasSeveralCommands]);
    expect(issues[0].data.commands).toEqual(["set", "complete"]);
    expect(issues[0].message.indexOf("is a command as well") > -1, "There is no \"expect\" note here").toBeFalsy();
  });
  test("A key with an undefined value is not a command", () => {
    const issues = validateSteps([{ set: { q1: 1 }, unknown: undefined }]);
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.unknownStepKey]);
    expect(issues[0].data.key).toBe("unknown");
    const emptyIssues = validateSteps([{ unknown: undefined }]);
    expect(codes(emptyIssues), "The step has no command left").toEqual([
      SurveyTestIssueCodes.unknownStepKey, SurveyTestIssueCodes.stepEmpty,
    ]);
  });
  test("The step index and the step path are reported", () => {
    const issues = validate({
      tests: [
        { name: "t1", steps: [{ set: { q1: 1 } }, {}] },
        { name: "t2", steps: [{ set: { q1: 1 } }, { set: { q1: 1 }, complete: { survey: true } }] },
      ],
    });
    expect(paths(issues)).toEqual(["tests[0].steps[1]", "tests[1].steps[1]"]);
    expect(issues.map(issue => issue.step)).toEqual([1, 1]);
  });
});

describe("SurveyTestValidator: command parameters", () => {
  function validateStep(step: any): Array<ISurveyTestIssue> {
    return validate({ tests: [{ name: "t1", steps: [step] }] });
  }
  test("Command parameters must be an object", () => {
    expect(codes(validateStep({ set: "q1" })), "a string").toEqual([SurveyTestIssueCodes.commandParamsNotAnObject]);
    expect(codes(validateStep({ set: [] })), "an array").toEqual([SurveyTestIssueCodes.commandParamsNotAnObject]);
    expect(codes(validateStep({ set: null })), "null").toEqual([SurveyTestIssueCodes.commandParamsNotAnObject]);
    const issues = validateStep({ set: "q1" });
    expect(issues[0].data.command, "The command is reported").toBe("set");
    expect(issues[0].path, "The path points to the command").toBe("tests[0].steps[0].set");
  });
  test("A command without a target does nothing", () => {
    const issues = validateStep({ set: {} });
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.commandParamsNotAnObject]);
    expect(issues[0].data.command).toBe("set");
  });
  test("A command with several targets is valid", () => {
    expect(codes(validateStep({ set: { q1: 1, q2: "a" } })), "One command, two targets").toEqual([]);
  });
});

describe("SurveyTestValidator: the expect command", () => {
  function validateStep(step: any): Array<ISurveyTestIssue> {
    return validate({ tests: [{ name: "t1", steps: [step] }] });
  }
  test("The expect parameters must be an object", () => {
    const issues = validateStep({ expect: "q1" });
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.expectNotAnObject]);
    expect(issues[0].path).toBe("tests[0].steps[0].expect");
    expect(codes(validateStep({ expect: [] })), "an array").toEqual([SurveyTestIssueCodes.expectNotAnObject]);
  });
  test("The expect parameters must name at least one target", () => {
    const issues = validateStep({ expect: {} });
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.expectEmpty]);
    expect(issues[0].path).toBe("tests[0].steps[0].expect");
  });
  test("The checks of a target must be an object", () => {
    const issues = validateStep({ expect: { q1: true } });
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.expectTargetNotAnObject]);
    expect(issues[0].target).toBe("q1");
    expect(issues[0].path).toBe("tests[0].steps[0].expect.q1");
  });
  test("A target must carry at least one check", () => {
    const issues = validateStep({ expect: { q1: {} } });
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.expectEmpty]);
    expect(issues[0].target).toBe("q1");
    expect(issues[0].path).toBe("tests[0].steps[0].expect.q1");
  });
  test("Several targets and several checks at once are valid", () => {
    const step: any = {};
    step[CHECK_COMMAND_NAME] = {
      q1: { value: 5, visible: true, enabled: false },
      q2: { visible: false },
    };
    step[CHECK_COMMAND_NAME][RESERVED_TARGET_SURVEY] = { state: "running" };
    expect(codes(validateStep(step)), "Several targets, several checks").toEqual([]);
  });
  test("Unknown check names are not the business of the validator", () => {
    expect(codes(validateStep({ expect: { q1: { thereIsNoSuchCheck: 1 } } })), "Checks are resolved at run time").toEqual([]);
  });
});

describe("SurveyTestValidator: options and variables", () => {
  test("\"options\" must be an object at either level", () => {
    let issues = validate({ options: "locale", tests: [{ name: "t1", steps: [{ set: { q1: 1 } }] }] });
    expect(codes(issues), "the suite level").toEqual([SurveyTestIssueCodes.optionsNotAnObject]);
    expect(issues[0].path).toBe("options");
    issues = validate({ tests: [{ name: "t1", options: [], steps: [{ set: { q1: 1 } }] }] });
    expect(codes(issues), "the test level").toEqual([SurveyTestIssueCodes.optionsNotAnObject]);
    expect(issues[0].path).toBe("tests[0].options");
  });
  test("\"options\" is flat: no member is an object or an array", () => {
    const issues = validate({
      options: { locale: "de", nested: { randomSeed: 2 }, list: [1] },
      tests: [{ name: "t1", steps: [{ set: { q1: 1 } }] }],
    });
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.optionsNotAnObject, SurveyTestIssueCodes.optionsNotAnObject]);
    expect(paths(issues)).toEqual(["options.nested", "options.list"]);
    expect(issues[0].data.key).toBe("nested");
  });
  test("An option set to null or to a scalar is valid", () => {
    const issues = validate({
      options: { locale: null, randomSeed: 0, stopOnFirstFailure: false },
      tests: [{ name: "t1", options: { stopOnFirstFailure: false }, steps: [{ set: { q1: 1 } }] }],
    });
    expect(codes(issues), "Scalars, including null and the default value, are valid").toEqual([]);
  });
  test("\"variables\" must be an object at either level", () => {
    let issues = validate({ variables: ["region"], tests: [{ name: "t1", steps: [{ set: { q1: 1 } }] }] });
    expect(codes(issues), "the suite level").toEqual([SurveyTestIssueCodes.variablesNotAnObject]);
    expect(issues[0].path).toBe("variables");
    issues = validate({ tests: [{ name: "t1", variables: "region", steps: [{ set: { q1: 1 } }] }] });
    expect(codes(issues), "the test level").toEqual([SurveyTestIssueCodes.variablesNotAnObject]);
    expect(issues[0].path).toBe("tests[0].variables");
  });
  test("A variable may hold an object: only options are flat", () => {
    const issues = validate({
      variables: { region: { code: "eu" } },
      tests: [{ name: "t1", steps: [{ set: { q1: 1 } }] }],
    });
    expect(codes(issues), "Variables are values of any shape").toEqual([]);
  });
});

describe("SurveyTestValidator: starts", () => {
  function validateStarts(starts: any): Array<ISurveyTestIssue> {
    return validate({ starts: starts, tests: [{ name: "t1", steps: [{ set: { q1: 1 } }] }] });
  }
  test("\"starts\" must be an array of objects", () => {
    let issues = validateStarts({ midFlow: {} });
    expect(codes(issues), "not an array").toEqual([SurveyTestIssueCodes.startsNotAnArray]);
    expect(issues[0].path).toBe("starts");
    issues = validateStarts(["midFlow"]);
    expect(codes(issues), "not an object").toEqual([SurveyTestIssueCodes.startNotAnObject]);
    expect(issues[0].path).toBe("starts[0]");
  });
  test("An empty \"starts\" array is valid", () => {
    expect(codes(validateStarts([])), "No named starts").toEqual([]);
  });
  test("A \"starts\" entry must have a non-empty name", () => {
    const issues = validateStarts([{ data: { q1: 1 } }, { name: "", data: { q1: 1 } }]);
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.startNameMissing, SurveyTestIssueCodes.startNameMissing]);
    expect(paths(issues)).toEqual(["starts[0]", "starts[1]"]);
  });
  test("Two starts with the same name is an error, not a warning", () => {
    const issues = validateStarts([{ name: "midFlow" }, { name: "other" }, { name: "midFlow" }]);
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.duplicateStartName]);
    expect(issues[0].severity, "A test referring to the name has no unambiguous state to begin from").toBe("error");
    expect(issues[0].path).toBe("starts[2]");
    expect(issues[0].data.indexes, "Both indexes are reported").toEqual([0, 2]);
    expect(issues[0].message.indexOf("\"midFlow\"") > -1, "The message names the start").toBeTruthy();
  });
  test("A start carries neither options nor variables", () => {
    let issues = validateStarts([{ name: "midFlow", options: { locale: "de" } }]);
    expect(codes(issues), "options").toEqual([SurveyTestIssueCodes.startHasReservedKey]);
    expect(issues[0].data.key).toBe("options");
    expect(issues[0].path).toBe("starts[0].options");
    expect(issues[0].message.indexOf("\"options\"") > -1, "The message names the key").toBeTruthy();
    issues = validateStarts([{ name: "midFlow", variables: { region: "eu" } }]);
    expect(codes(issues), "variables").toEqual([SurveyTestIssueCodes.startHasReservedKey]);
    expect(issues[0].data.key).toBe("variables");
  });
  test("\"dataMode\" is either input or restore", () => {
    expect(codes(validateStarts([{ name: "a", dataMode: "input" }, { name: "b", dataMode: "restore" }])), "valid modes").toEqual([]);
    const issues = validateStarts([{ name: "midFlow", dataMode: "merge" }]);
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.invalidDataMode]);
    expect(issues[0].path).toBe("starts[0].dataMode");
    expect(issues[0].data.dataMode).toBe("merge");
  });
  test("\"startPage\" is a page name, never an index", () => {
    expect(codes(validateStarts([{ name: "midFlow", startPage: "page2" }])), "a page name").toEqual([]);
    const issues = validateStarts([{ name: "midFlow", startPage: 2 }]);
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.invalidStartPage]);
    expect(issues[0].path).toBe("starts[0].startPage");
  });
});

describe("SurveyTestValidator: the start of a test", () => {
  function validateStart(start: any, starts?: Array<any>): Array<ISurveyTestIssue> {
    const suite: any = { tests: [{ name: "t1", start: start, steps: [{ set: { q1: 1 } }] }] };
    if (!!starts) suite.starts = starts;
    return validate(suite);
  }
  test("A named start must exist", () => {
    let issues = validateStart("midFlow");
    expect(codes(issues), "no starts at all").toEqual([SurveyTestIssueCodes.unknownStartReference]);
    expect(issues[0].path).toBe("tests[0].start");
    expect(issues[0].data.name).toBe("midFlow");
    issues = validateStart("midFlow", [{ name: "other" }]);
    expect(codes(issues), "a list without the name").toEqual([SurveyTestIssueCodes.unknownStartReference]);
    expect(codes(validateStart("midFlow", [{ name: "midFlow" }])), "a list with the name").toEqual([]);
  });
  test("An unknown start reference is reported before any step issue of that test", () => {
    const issues = validate({
      starts: [{ name: "other" }],
      tests: [{ name: "t1", start: "midFlow", steps: [{}] }],
    });
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.unknownStartReference, SurveyTestIssueCodes.stepEmpty]);
  });
  test("An inline start is valid and follows the rules of a starts entry", () => {
    expect(codes(validateStart({ data: { q1: 1 }, dataMode: "restore" })), "an inline start").toEqual([]);
    let issues = validateStart({ data: { q1: 1 }, options: { locale: "de" } });
    expect(codes(issues), "options inline").toEqual([SurveyTestIssueCodes.startHasReservedKey]);
    expect(issues[0].path).toBe("tests[0].start.options");
    issues = validateStart({ data: { q1: 1 }, variables: { region: "eu" } });
    expect(codes(issues), "variables inline").toEqual([SurveyTestIssueCodes.startHasReservedKey]);
    issues = validateStart({ dataMode: "merge" });
    expect(codes(issues), "an invalid dataMode inline").toEqual([SurveyTestIssueCodes.invalidDataMode]);
    expect(issues[0].path).toBe("tests[0].start.dataMode");
    issues = validateStart({ startPage: 2 });
    expect(codes(issues), "a page index inline").toEqual([SurveyTestIssueCodes.invalidStartPage]);
  });
  test("A name inside an inline start is ignored, it looks nothing up", () => {
    // The start stays the inline object: prompt 02 asserts the resolved state, here the observable
    // part is that the name is never resolved against "starts".
    const suite: any = {
      starts: [{ name: "other", data: { q1: 2 } }],
      tests: [{ name: "t1", start: { name: "midFlow", data: { q1: 1 } }, steps: [{ set: { q1: 1 } }] }],
    };
    expect(codes(validate(suite)), "\"midFlow\" is not looked up").toEqual([]);
    expect(suite.tests[0].start, "The inline start is untouched").toEqual({ name: "midFlow", data: { q1: 1 } });
  });
  test("A start that is neither a name nor an object", () => {
    const issues = validateStart(2);
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.startNotAnObject]);
    expect(issues[0].path).toBe("tests[0].start");
  });
});

describe("SurveyTestValidator: the public methods and the state", () => {
  test("validateTest and validateStep can be called on their own", () => {
    const validator = new SurveyTestValidator();
    let issues = validator.validateTest(<any>{ name: "t1", steps: [{}] }, "tests[7]");
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.stepEmpty]);
    expect(paths(issues)).toEqual(["tests[7].steps[0]"]);
    issues = validator.validateStep(<any>{ set: {} }, "step");
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.commandParamsNotAnObject]);
    expect(paths(issues)).toEqual(["step.set"]);
  });
  test("A named start is not resolved when a test is validated without its suite", () => {
    const validator = new SurveyTestValidator();
    const test: any = { name: "t1", start: "midFlow", steps: [{ set: { q1: 1 } }] };
    expect(codes(validator.validateTest(test, "tests[0]")), "There is no suite to resolve the name against").toEqual([]);
    expect(codes(validator.validateTest(test, "tests[0]", ["other"])), "The known names are passed in").toEqual([
      SurveyTestIssueCodes.unknownStartReference,
    ]);
  });
  test("The validator is stateless and never mutates the suite", () => {
    const suite = deepFreeze({
      options: { locale: "de" },
      starts: [{ name: "midFlow", data: { q1: 1 } }],
      tests: [
        { name: "t1", start: "midFlow", steps: [{ set: { q1: 1 } }] },
        { name: "t1", steps: [{ set: { q1: 1 }, expect: { q1: { value: 1 } } }] },
      ],
    });
    const validator = new SurveyTestValidator();
    const first = validator.validate(<any>suite);
    const second = validator.validate(<any>suite);
    expect(first.length, "Two issues are found").toBe(2);
    expect(second, "The second run returns the same issues").toEqual(first);
    expect(new SurveyTestValidator().validate(<any>suite), "A fresh validator returns the same issues").toEqual(first);
  });
  test("Every issue carries a severity, a code and a message", () => {
    const issues = validate({
      tests: [
        { steps: undefined },
        { name: "t2", steps: [{ expect: "q1" }] },
      ],
    });
    expect(issues.length).toBe(3);
    issues.forEach(issue => {
      expect(issue.severity === "error" || issue.severity === "warning", "The severity is set").toBeTruthy();
      expect((<any>SurveyTestIssueCodes)[issue.code], "The code is a known one").toBe(issue.code);
      expect(issue.message.length > 0, "The message is not empty").toBeTruthy();
      expect(issue.message[issue.message.length - 1], "The message is a sentence").toBe(".");
    });
  });
});

import {
  ISurveyTestCheckResult, ISurveyTestIssue, ISurveyTestResult, ISurveyTests, ISurveyTestsResult,
  ISurveyTestStepResult, runSurveyTests, SurveyTestIssueCodes,
} from "survey-core/tester";

import { describe, expect, test } from "vitest";

// End-to-end runs of realistic definitions through the public entry point. Everything here goes in
// as JSON and comes back as the result object: no test below reaches into the model, because a
// consumer of the harness cannot either.

function getCheck(result: ISurveyTestsResult, testIndex: number, stepIndex: number,
  target: string, check: string): ISurveyTestCheckResult {
  const step = result.tests[testIndex].steps[stepIndex];
  return step.checks.filter(item => item.target === target && item.check === check)[0];
}
function getIssues(test: ISurveyTestResult): Array<ISurveyTestIssue> {
  const res: Array<ISurveyTestIssue> = [].concat(test.issues);
  test.steps.forEach((step: ISurveyTestStepResult) => step.issues.forEach(issue => res.push(issue)));
  return res;
}
function getCodes(test: ISurveyTestResult): Array<string> {
  return getIssues(test).map(issue => issue.code);
}

// -------------------------------------------------------------------------------------------------
// 1. The case from issue #11692, in the final format.
// -------------------------------------------------------------------------------------------------

const insuranceSurvey = {
  pages: [{
    name: "page1",
    elements: [
      { type: "radiogroup", name: "hasInsurance", title: "Do you have insurance?", choices: ["yes", "no"] },
      {
        type: "text", name: "insuranceProvider", title: "Who is your provider?",
        visibleIf: "{hasInsurance} = 'yes'", isRequired: true,
      },
    ],
  }],
};

describe("The insurance case of issue #11692", () => {
  const suite: ISurveyTests = {
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
      {
        name: "Accepting insurance requires the provider",
        steps: [
          { set: { hasInsurance: "yes" } },
          { expect: { insuranceProvider: { visible: true, required: true, empty: true } } },
          { complete: { survey: true } },
          { expect: { survey: { state: "running" }, insuranceProvider: { hasErrors: true } } },
          { set: { insuranceProvider: "Acme" } },
          { complete: { survey: true } },
          { expect: { survey: { state: "completed", values: { hasInsurance: "yes", insuranceProvider: "Acme" } } } },
        ],
      },
    ],
  };

  test("Both branches pass end to end", async () => {
    const result = await runSurveyTests(insuranceSurvey, suite);
    expect(result.name).toBe("Insurance");
    expect(result.status).toBe("passed");
    expect(result.tests.map(item => item.status)).toEqual(["passed", "passed"]);
    expect(result.summary.total).toBe(2);
    expect(result.summary.passed).toBe(2);
    expect(result.summary.failedChecks).toBe(0);
    // The "no" branch asserts three survey-level checks in one step, one result each.
    expect(result.tests[0].steps[3].checks.map(item => item.check)).toEqual(["state", "values", "noValues"]);
    expect(result.tests[0].steps[3].checks.every(item => item.passed)).toBe(true);
  });

  test("The blocked completion is a warning, not a failure", async () => {
    const result = await runSurveyTests(insuranceSurvey, suite);
    const blocked = getIssues(result.tests[1]).filter(issue => issue.code === SurveyTestIssueCodes.completeBlocked);
    expect(blocked.length).toBe(1);
    expect(blocked[0].severity).toBe("warning");
    expect(blocked[0].data.questions[0].name).toBe("insuranceProvider");
    expect(blocked[0].data.questions[0].isRequired).toBe(true);
    expect(result.tests[1].steps[2].status).toBe("passed");
    expect(result.summary.warnings).toBe(1);
  });

  test("A wrong expectation fails with the value that was read", async () => {
    const wrong: ISurveyTests = {
      tests: [{
        name: "The provider question is visible after declining",
        steps: [
          { set: { hasInsurance: "no" } },
          { expect: { insuranceProvider: { visible: true } } },
        ],
      }],
    };
    const result = await runSurveyTests(insuranceSurvey, wrong);
    expect(result.status).toBe("failed");
    const check = getCheck(result, 0, 1, "insuranceProvider", "visible");
    expect(check.passed).toBe(false);
    expect(check.actual).toBe(false);
    expect(check.jsonPath).toBe("pages[0].elements[1].visibleIf");
    expect(check.details.expression.expression).toBe("{hasInsurance} = 'yes'");
    expect(check.details.expression.values).toEqual({ hasInsurance: "no" });
    expect(check.details.expression.result).toBe(false);
  });
});

// -------------------------------------------------------------------------------------------------
// 2. Multi-page navigation.
// -------------------------------------------------------------------------------------------------

const threePageSurvey = {
  pages: [
    { name: "role", elements: [{ type: "radiogroup", name: "job", choices: ["developer", "other"] }] },
    { name: "developer", visibleIf: "{job} = 'developer'", elements: [{ type: "text", name: "language" }] },
    { name: "comments", elements: [{ type: "text", name: "feedback" }] },
  ],
};

describe("Multi-page navigation", () => {
  test("An invisible page is skipped and Previous goes back to the page before it", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "The developer page is hidden for everyone else",
        steps: [
          { expect: { survey: { pages: ["role", "comments"], currentPage: "role" } } },
          { set: { job: "other" } },
          { expect: { survey: { pages: ["role", "comments"] }, developer: { visible: false } } },
          { nextPage: { survey: true } },
          { expect: { survey: { currentPage: "comments" } } },
          { prevPage: { survey: true } },
          { expect: { survey: { currentPage: "role" } } },
        ],
      }, {
        name: "The developer page is walked through by a developer",
        steps: [
          { set: { job: "developer" } },
          { expect: { survey: { pages: ["role", "developer", "comments"] } } },
          { nextPage: { survey: true } },
          { expect: { survey: { currentPage: "developer" } } },
          { set: { language: "TypeScript" } },
          { nextPage: { survey: true } },
          { expect: { survey: { currentPage: "comments" }, language: { page: "developer" } } },
        ],
      }],
    };
    const result = await runSurveyTests(threePageSurvey, suite);
    expect(result.status).toBe("passed");
    expect(result.summary.checks).toBe(10);
  });

  test("The pages check compares in order", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "Reversed",
        steps: [{ expect: { survey: { pages: ["comments", "role"] } } }],
      }],
    };
    const result = await runSurveyTests(threePageSurvey, suite);
    expect(result.status).toBe("failed");
    expect(getCheck(result, 0, 0, "survey", "pages").actual).toEqual(["role", "comments"]);
  });
});

// -------------------------------------------------------------------------------------------------
// 3. Triggers.
// -------------------------------------------------------------------------------------------------

const triggerSurvey = {
  pages: [
    { name: "first", elements: [{ type: "radiogroup", name: "path", choices: ["fill", "jump", "finish"] }, { type: "text", name: "filled" }] },
    { name: "second", elements: [{ type: "text", name: "middle" }] },
    { name: "third", elements: [{ type: "text", name: "last" }] },
  ],
  triggers: [
    { type: "setvalue", expression: "{path} = 'fill'", setToName: "filled", setValue: "auto" },
    { type: "skip", expression: "{path} = 'jump'", gotoName: "last" },
    { type: "complete", expression: "{path} = 'finish'" },
  ],
};

describe("Triggers", () => {
  test("setValue, skip and complete triggers each show up in the state the case asserts", async () => {
    const suite: ISurveyTests = {
      tests: [
        {
          name: "The setValue trigger fills a question",
          steps: [
            { set: { path: "fill" } },
            { expect: { filled: { value: "auto" }, survey: { state: "running", currentPage: "first" } } },
          ],
        },
        {
          name: "The skip trigger jumps to the page of its question",
          steps: [
            { set: { path: "jump" } },
            { expect: { survey: { currentPage: "third" } } },
          ],
        },
        {
          name: "The complete trigger ends the survey on navigation",
          steps: [
            { set: { path: "finish" } },
            { expect: { survey: { state: "running" } } },
            { complete: { survey: true } },
            { expect: { survey: { state: "completed" } } },
          ],
        },
      ],
    };
    const result = await runSurveyTests(triggerSurvey, suite);
    expect(result.tests.map(item => item.status)).toEqual(["passed", "passed", "passed"]);
  });

  test("A failing state check carries the trigger that fired", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "The survey keeps running",
        steps: [
          { set: { path: "fill" } },
          { expect: { filled: { value: "typed" } } },
        ],
      }],
    };
    const result = await runSurveyTests(triggerSurvey, suite);
    const check = getCheck(result, 0, 1, "filled", "value");
    expect(check.passed).toBe(false);
    expect(check.actual).toBe("auto");
    expect(check.details.triggers.length).toBe(1);
    expect(check.details.triggers[0].triggerType).toBe("setvalue");
    expect(check.details.triggers[0].jsonPath).toBe("triggers[0]");
  });
});

// -------------------------------------------------------------------------------------------------
// 4. Calculated values and expressions.
// -------------------------------------------------------------------------------------------------

const payoutSurvey = {
  elements: [
    { type: "text", name: "claimAmount", inputType: "number" },
    { type: "text", name: "excess", inputType: "number" },
  ],
  calculatedValues: [
    { name: "payout", expression: "{claimAmount} - {excessAmount}", includeIntoResult: true },
  ],
};

describe("Calculated values and expressions", () => {
  test("A name the definition does not contain is reported with its closest match", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "Payout subtracts the excess",
        steps: [
          { set: { claimAmount: 500, excess: 100 } },
          { expect: { payout: { value: 400 } } },
        ],
      }],
    };
    const result = await runSurveyTests(payoutSurvey, suite);
    expect(result.status).toBe("failed");
    const check = getCheck(result, 0, 1, "payout", "value");
    expect(check.passed).toBe(false);
    expect(check.jsonPath).toBe("calculatedValues[0].expression");
    const trace = check.details.expression;
    expect(trace.expression).toBe("{claimAmount} - {excessAmount}");
    expect(trace.values.claimAmount).toBe(500);
    expect(trace.values.excessAmount).toBe(undefined);
    expect(trace.unknownNames).toEqual(["excessAmount"]);
    expect(trace.suggestions).toEqual({ excessAmount: "excess" });
  });

  test("The corrected expression passes", async () => {
    const fixed = JSON.parse(JSON.stringify(payoutSurvey));
    fixed.calculatedValues[0].expression = "{claimAmount} - {excess}";
    const suite: ISurveyTests = {
      tests: [{
        name: "Payout subtracts the excess",
        steps: [
          { set: { claimAmount: 500, excess: 100 } },
          { expect: { payout: { value: 400 }, survey: { values: { payout: 400 } } } },
        ],
      }],
    };
    const result = await runSurveyTests(fixed, suite);
    expect(result.status).toBe("passed");
  });
});

// -------------------------------------------------------------------------------------------------
// 5. Validation.
// -------------------------------------------------------------------------------------------------

const validationSurvey = {
  elements: [
    { type: "text", name: "fullName", isRequired: true },
    {
      type: "text", name: "age", inputType: "number",
      validators: [{ type: "numeric", minValue: 18, text: "You must be at least 18" }],
    },
    {
      type: "text", name: "code",
      validators: [{ type: "expression", expression: "{code} = 'ABC'", text: "The code must be ABC" }],
    },
  ],
};

describe("Validation", () => {
  test("A required question blocks the completion and the errors are readable", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "Every validator reports",
        steps: [
          { set: { age: 10, code: "XYZ" } },
          { complete: { survey: true } },
          {
            expect: {
              survey: { state: "running", errorCount: 3 },
              fullName: { hasErrors: true },
              age: { errors: ["You must be at least 18"], errorCount: 1 },
              code: { errors: ["The code must be ABC"] },
            },
          },
        ],
      }],
    };
    const result = await runSurveyTests(validationSurvey, suite);
    expect(result.status).toBe("passed");
    expect(getCodes(result.tests[0])).toEqual([SurveyTestIssueCodes.completeBlocked]);
  });

  test("Valid answers complete the survey with no error", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "All good",
        steps: [
          { set: { fullName: "Ann", age: 30, code: "ABC" } },
          { complete: { survey: true } },
          { expect: { survey: { state: "completed", errorCount: 0 }, age: { hasErrors: false } } },
        ],
      }],
    };
    const result = await runSurveyTests(validationSurvey, suite);
    expect(result.status).toBe("passed");
    expect(getCodes(result.tests[0])).toEqual([]);
  });
});

// -------------------------------------------------------------------------------------------------
// 6. Dynamic panel and dynamic matrix.
// -------------------------------------------------------------------------------------------------

const dynamicSurvey = {
  elements: [
    {
      type: "paneldynamic", name: "contacts", panelCount: 1,
      templateElements: [
        { type: "text", name: "contactName" },
        { type: "text", name: "contactPhone", visibleIf: "{panel.contactName} notempty" },
      ],
    },
    {
      type: "matrixdynamic", name: "items", rowCount: 1,
      columns: [
        { name: "item", cellType: "text" },
        { name: "quantity", cellType: "text", inputType: "number", visibleIf: "{row.item} notempty" },
      ],
    },
  ],
};

describe("Dynamic panel and dynamic matrix", () => {
  test("Panels and rows are added, filled cell by cell and removed", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "Two contacts and two items",
        steps: [
          { expect: { "contacts[0].contactPhone": { visible: false } } },
          { addPanel: { contacts: 1 } },
          { expect: { contacts: { panelCount: 2 } } },
          { set: { "contacts[1].contactName": "Bob" } },
          { expect: { "contacts[1].contactPhone": { visible: true } } },
          { set: { "contacts[1].contactPhone": "555" } },
          { addRow: { items: 1 } },
          { expect: { items: { rowCount: 2 } } },
          { set: { "items[1].item": "Cable" } },
          { set: { "items[1].quantity": 3 } },
          { removePanel: { contacts: 0 } },
          { expect: { contacts: { panelCount: 1 }, "contacts[0].contactName": { value: "Bob" } } },
          {
            expect: {
              survey: {
                values: {
                  contacts: [{ contactName: "Bob", contactPhone: "555" }],
                  items: [{}, { item: "Cable", quantity: 3 }],
                },
              },
            },
          },
        ],
      }],
    };
    const result = await runSurveyTests(dynamicSurvey, suite);
    expect(result.status).toBe("passed");
  });

  test("A cell hidden by its sibling cannot be filled", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "The quantity of an unnamed item",
        steps: [{ set: { "items[0].quantity": 3 } }],
      }],
    };
    const result = await runSurveyTests(dynamicSurvey, suite);
    expect(result.status).toBe("error");
    const issues = getIssues(result.tests[0]);
    expect(issues.length).toBe(1);
    expect(issues[0].code).toBe(SurveyTestIssueCodes.elementNotVisible);
    expect(issues[0].data.visibleIf).toBe("{row.item} notempty");
  });
});

// -------------------------------------------------------------------------------------------------
// 7. A path a respondent could not take, and the same path rewritten.
// -------------------------------------------------------------------------------------------------

const feasibilitySurvey = {
  pages: [
    {
      name: "contact",
      elements: [{ type: "text", name: "phone", maskType: "pattern", maskSettings: { pattern: "999-999" } }],
    },
    { name: "notes", elements: [{ type: "text", name: "comments" }] },
  ],
};

describe("A path a respondent could not take", () => {
  test("Answering a question of the next page is a case error", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "Answer page 2 first",
        steps: [
          { set: { comments: "typed too early" } },
          { expect: { comments: { value: "typed too early" } } },
        ],
      }],
    };
    const result = await runSurveyTests(feasibilitySurvey, suite);
    expect(result.status).toBe("error");
    expect(result.tests[0].status).toBe("error");
    // The step that raised the error is the last one that ran: the survey is left as it was.
    expect(result.tests[0].steps.length).toBe(1);
    const issue = getIssues(result.tests[0])[0];
    expect(issue.code).toBe(SurveyTestIssueCodes.elementNotOnCurrentPage);
    expect(issue.data).toEqual({ page: "notes", currentPage: "contact" });
    expect(issue.jsonPath).toBe("pages[1].elements[0]");
  });

  test("Pressing Next on the last page is a case error that names the command to use", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "One page too far",
        steps: [
          { nextPage: { survey: true } },
          { nextPage: { survey: true } },
        ],
      }],
    };
    const result = await runSurveyTests(feasibilitySurvey, suite);
    expect(result.status).toBe("error");
    const issue = getIssues(result.tests[0])[0];
    expect(issue.code).toBe(SurveyTestIssueCodes.navigationButtonNotAvailable);
    expect(issue.data.button).toBe("sv-nav-next");
    expect(issue.data.useCommand).toBe("complete");
    expect(issue.step).toBe(1);
  });

  test("A value the input rejects is a case error that names the mask", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "A phone that is not a phone",
        steps: [{ set: { phone: "not a phone" } }],
      }],
    };
    const result = await runSurveyTests(feasibilitySurvey, suite);
    expect(result.status).toBe("error");
    const issue = getIssues(result.tests[0])[0];
    expect(issue.code).toBe(SurveyTestIssueCodes.valueNotEnterable);
    expect(issue.data.maskType).toBe("pattern");
    expect(issue.data.pattern).toBe("999-999");
  });

  test("The same case, rewritten as a respondent could perform it, passes", async () => {
    const suite: ISurveyTests = {
      tests: [{
        name: "One contact, one comment",
        steps: [
          { set: { phone: "123456" } },
          { nextPage: { survey: true } },
          { set: { comments: "all fine" } },
          { complete: { survey: true } },
          { expect: { survey: { state: "completed", values: { phone: "123456", comments: "all fine" } } } },
        ],
      }],
    };
    const result = await runSurveyTests(feasibilitySurvey, suite);
    expect(result.status).toBe("passed");
    expect(getCodes(result.tests[0])).toEqual([]);
  });
});

// -------------------------------------------------------------------------------------------------
// 8. clearInvisibleValues.
// -------------------------------------------------------------------------------------------------

const clearingSurvey = {
  elements: [
    { type: "radiogroup", name: "owner", choices: ["yes", "no"] },
    { type: "text", name: "model", visibleIf: "{owner} = 'yes'" },
  ],
};

const clearingSuite: ISurveyTests = {
  tests: [{
    name: "The answer of a question that became invisible",
    steps: [
      { set: { owner: "yes" } },
      { set: { model: "T-1000" } },
      { set: { owner: "no" } },
      { complete: { survey: true } },
      { expect: { survey: { state: "completed", noValues: ["model"] } } },
    ],
  }],
};

describe("clearInvisibleValues", () => {
  test("\"onComplete\" drops the answer of the hidden question", async () => {
    const result = await runSurveyTests(clearingSurvey, clearingSuite, { clearInvisibleValues: "onComplete" });
    expect(result.status).toBe("passed");
    expect(result.tests[0].options).toEqual({ clearInvisibleValues: "onComplete" });
  });

  test("\"none\" keeps it, and the failing check says which key is still there", async () => {
    const result = await runSurveyTests(clearingSurvey, clearingSuite, { clearInvisibleValues: "none" });
    expect(result.status).toBe("failed");
    const check = getCheck(result, 0, 4, "survey", "noValues");
    expect(check.passed).toBe(false);
    expect(check.actual).toBe("T-1000");
    expect(check.details).toEqual({ key: "model", present: true });
  });
});

// -------------------------------------------------------------------------------------------------
// 9. Localization.
// -------------------------------------------------------------------------------------------------

const localizedSurvey = {
  elements: [{ type: "text", name: "q1", title: { default: "Name", de: "Name (de)", fr: "Name (fr)" } }],
};

describe("Localization", () => {
  test("The locale of the run resolves the title", async () => {
    const suite: ISurveyTests = {
      options: { locale: "de" },
      tests: [
        { name: "Root locale", steps: [{ expect: { q1: { title: "Name (de)" } } }] },
        { name: "Test locale", options: { locale: "fr" }, steps: [{ expect: { q1: { title: "Name (fr)" } } }] },
        { name: "Default locale", options: { locale: "" }, steps: [{ expect: { q1: { title: "Name" } } }] },
      ],
    };
    const result = await runSurveyTests(localizedSurvey, suite);
    expect(result.status).toBe("passed");
    expect(result.tests.map(item => item.options.locale)).toEqual(["de", "fr", ""]);
  });
});

// -------------------------------------------------------------------------------------------------
// 10. A suite of ten cases where three fail.
// -------------------------------------------------------------------------------------------------

describe("A suite that continues past a failure", () => {
  test("Ten cases run, three fail, and the counters match exactly", async () => {
    const failing = [2, 5, 8];
    const tests = [];
    for (let i = 0; i < 10; i++) {
      tests.push({
        name: "Case " + i,
        steps: [
          { set: { q1: "value" + i } },
          { expect: { q1: { value: failing.indexOf(i) > -1 ? "wrong" : "value" + i } } },
        ],
      });
    }
    const result = await runSurveyTests({ elements: [{ type: "text", name: "q1" }] }, { tests: tests });
    expect(result.status).toBe("failed");
    expect(result.tests.length).toBe(10);
    expect(result.tests.every(item => item.steps.length === 2)).toBe(true);
    expect(result.summary).toEqual({
      total: 10, passed: 7, failed: 3, errored: 0, skipped: 0, checks: 10, failedChecks: 3, warnings: 0,
    });
    expect(result.tests.filter(item => item.status === "failed").map(item => item.name))
      .toEqual(["Case 2", "Case 5", "Case 8"]);
    // Every case ran against its own survey: the value of the case before it never leaks in.
    expect(result.tests[3].steps[1].checks[0].actual).toBe("value3");
  });

  test("A disabled case is skipped and the rest still run", async () => {
    const suite: ISurveyTests = {
      tests: [
        { name: "Off", disabled: true, steps: [{ expect: { q1: { value: "never read" } } }] },
        { name: "On", steps: [{ expect: { q1: { empty: true } } }] },
      ],
    };
    const result = await runSurveyTests({ elements: [{ type: "text", name: "q1" }] }, suite);
    expect(result.status).toBe("passed");
    expect(result.tests.map(item => item.status)).toEqual(["skipped", "passed"]);
    expect(result.summary.skipped).toBe(1);
    expect(result.summary.checks).toBe(1);
  });
});

// -------------------------------------------------------------------------------------------------
// 11. One shared start, five tests.
// -------------------------------------------------------------------------------------------------

function createLargeStartData(): { [name: string]: any } {
  const res: any = { firstName: "Ann", lastName: "Lee", country: "no", plan: "gold", seats: 3 };
  for (let i = 0; i < 30; i++) {
    res["filler" + i] = { index: i, tags: ["a", "b", "c"], note: "a shared blob every case reads" };
  }
  return res;
}

const sharedStartSurvey = {
  elements: [
    { type: "text", name: "firstName" },
    { type: "text", name: "lastName" },
    { type: "dropdown", name: "country", choices: ["no", "se", "fi"] },
    { type: "dropdown", name: "plan", choices: ["gold", "silver"] },
    { type: "text", name: "seats", inputType: "number" },
  ],
};

describe("One shared start, five tests", () => {
  test("Every test mutates its own copy and the suite object is untouched", async () => {
    const suite: ISurveyTests = {
      starts: [{ name: "signedUp", description: "A filled sign-up form", data: createLargeStartData() }],
      tests: [
        { name: "Rename", start: "signedUp", steps: [{ set: { firstName: "Bea" } }, { expect: { firstName: { value: "Bea" }, lastName: { value: "Lee" } } }] },
        { name: "Move", start: "signedUp", steps: [{ set: { country: "se" } }, { expect: { country: { value: "se" }, firstName: { value: "Ann" } } }] },
        { name: "Downgrade", start: "signedUp", steps: [{ set: { plan: "silver" } }, { expect: { plan: { value: "silver" } } }] },
        { name: "Resize", start: "signedUp", steps: [{ set: { seats: 10 } }, { expect: { seats: { value: 10 } } }] },
        { name: "Clear", start: "signedUp", steps: [{ clear: { lastName: true } }, { expect: { lastName: { empty: true }, firstName: { value: "Ann" } } }] },
      ],
    };
    const pristine = JSON.parse(JSON.stringify(suite));
    const result = await runSurveyTests(sharedStartSurvey, suite);
    expect(result.status).toBe("passed");
    expect(result.tests.length).toBe(5);
    expect(suite).toEqual(pristine);
    // The resolved start travels with every result and is a copy of the shared entry, not the entry.
    expect(result.tests[0].startName).toBe("signedUp");
    expect(result.tests[0].start.data.firstName).toBe("Ann");
    expect(result.tests[0].start.data).not.toBe(suite.starts[0].data);
  });

  test("A start reference that resolves to nothing names the closest one", async () => {
    const suite: ISurveyTests = {
      starts: [{ name: "signedUp", data: { firstName: "Ann" } }],
      tests: [{ name: "Typo", start: "signedIn", steps: [{ expect: { firstName: { value: "Ann" } } }] }],
    };
    const result = await runSurveyTests(sharedStartSurvey, suite);
    expect(result.status).toBe("error");
    const issue = getIssues(result.tests[0])[0];
    expect(issue.code).toBe(SurveyTestIssueCodes.unknownStartReference);
    expect(issue.suggestion).toBe("Did you mean \"signedUp\"?");
  });
});

// -------------------------------------------------------------------------------------------------
// 12. Options, variables and starts side by side.
// -------------------------------------------------------------------------------------------------

const pricingSurvey = {
  elements: [
    { type: "radiogroup", name: "wantsSupport", choices: ["yes", "no"] },
    { type: "text", name: "supportLevel", visibleIf: "{wantsSupport} = 'yes'" },
    { type: "text", name: "region", defaultValueExpression: "{region}" },
  ],
};

describe("Options, variables and starts side by side", () => {
  test("Each test explains its own outcome through its resolved options and variables", async () => {
    const suite: ISurveyTests = {
      options: { clearInvisibleValues: "onComplete" },
      variables: { region: "eu", tier: "gold" },
      starts: [{ name: "wantsSupport", data: { wantsSupport: "yes", supportLevel: "24/7" } }],
      tests: [
        {
          name: "The hidden answer is dropped on completion",
          start: "wantsSupport",
          steps: [
            { set: { wantsSupport: "no" } },
            { complete: { survey: true } },
            { expect: { survey: { noValues: ["supportLevel"], variables: { region: "eu", tier: "gold" } } } },
          ],
        },
        {
          name: "The hidden answer is kept",
          start: "wantsSupport",
          options: { clearInvisibleValues: "none" },
          steps: [
            { set: { wantsSupport: "no" } },
            { complete: { survey: true } },
            { expect: { survey: { values: { supportLevel: "24/7" } } } },
          ],
        },
        {
          name: "One variable is overridden and the rest are kept",
          variables: { region: "us" },
          steps: [
            { expect: { survey: { variables: { region: "us", tier: "gold" } }, region: { value: "us" } } },
          ],
        },
      ],
    };
    const result = await runSurveyTests(pricingSurvey, suite);
    expect(result.status).toBe("passed");
    expect(result.tests[0].options).toEqual({ clearInvisibleValues: "onComplete" });
    expect(result.tests[1].options).toEqual({ clearInvisibleValues: "none" });
    expect(result.tests[0].variables).toEqual({ region: "eu", tier: "gold" });
    expect(result.tests[2].variables).toEqual({ region: "us", tier: "gold" });
    expect(result.tests[0].startName).toBe("wantsSupport");
    expect(result.tests[2].start).toBe(undefined);
  });
});

// -------------------------------------------------------------------------------------------------
// 13. The definition and the suite are independent documents.
// -------------------------------------------------------------------------------------------------

describe("The definition and the suite are independent documents", () => {
  const suite: ISurveyTests = {
    tests: [{
      name: "Declining insurance skips the provider question",
      steps: [
        { set: { hasInsurance: "no" } },
        { expect: { insuranceProvider: { visible: false } } },
      ],
    }],
  };

  test("One suite runs against two definitions", async () => {
    const renamed = JSON.parse(JSON.stringify(insuranceSurvey));
    renamed.pages[0].elements[0].name = "insurance";
    renamed.pages[0].elements[1].visibleIf = "{insurance} = 'yes'";

    const before = await runSurveyTests(insuranceSurvey, suite);
    expect(before.status).toBe("passed");

    const after = await runSurveyTests(renamed, suite);
    expect(after.status).toBe("error");
    const issue = getIssues(after.tests[0])[0];
    expect(issue.code).toBe(SurveyTestIssueCodes.unknownTarget);
    expect(issue.suggestion).toBe("Did you mean \"insurance\"?");
  });

  test("One definition runs against two suites", async () => {
    const other: ISurveyTests = {
      tests: [{
        name: "Accepting insurance shows the provider question",
        steps: [
          { set: { hasInsurance: "yes" } },
          { expect: { insuranceProvider: { visible: true } } },
        ],
      }],
    };
    const first = await runSurveyTests(insuranceSurvey, suite);
    const second = await runSurveyTests(insuranceSurvey, other);
    expect(first.status).toBe("passed");
    expect(second.status).toBe("passed");
    expect(first.tests[0].name).toBe("Declining insurance skips the provider question");
    expect(second.tests[0].name).toBe("Accepting insurance shows the provider question");
  });
});

// -------------------------------------------------------------------------------------------------
// 14. The format and the result both cross a process boundary.
// -------------------------------------------------------------------------------------------------

describe("Round trip", () => {
  const suite: ISurveyTests = {
    name: "Insurance",
    options: { clearInvisibleValues: "onComplete", now: "2026-01-01T00:00:00" },
    variables: { region: "eu" },
    starts: [{ name: "declined", data: { hasInsurance: "no" } }],
    tests: [
      {
        name: "Declining insurance skips the provider question",
        start: "declined",
        steps: [
          { expect: { insuranceProvider: { visible: false } } },
          { complete: { survey: true } },
          { expect: { survey: { state: "completed", noValues: ["insuranceProvider"] } } },
        ],
      },
      {
        name: "A failing case, so the result carries a failure too",
        steps: [{ expect: { hasInsurance: { value: "yes" } } }],
      },
    ],
  };

  test("A suite that went through JSON runs identically", async () => {
    const direct = await runSurveyTests(insuranceSurvey, suite);
    const parsed = await runSurveyTests(insuranceSurvey, JSON.parse(JSON.stringify(suite)));
    expect(parsed).toEqual(direct);
    expect(direct.status).toBe("failed");
  });

  test("The result is JSON-serialisable", async () => {
    const result = await runSurveyTests(insuranceSurvey, suite);
    const text = JSON.stringify(result);
    const parsed = JSON.parse(text);
    expect(parsed.status).toBe("failed");
    expect(parsed.summary).toEqual(result.summary);
    expect(parsed.tests.length).toBe(result.tests.length);
    // Every field a consumer reads to render a result survives the boundary.
    parsed.tests.forEach((item: any) => {
      expect(typeof item.name).toBe("string");
      expect(typeof item.status).toBe("string");
      expect(typeof item.options).toBe("object");
      item.steps.forEach((step: any) => {
        expect(typeof step.command).toBe("string");
        expect(typeof step.index).toBe("number");
        step.checks.forEach((check: any) => {
          expect(typeof check.target).toBe("string");
          expect(typeof check.check).toBe("string");
          expect(typeof check.passed).toBe("boolean");
        });
        step.issues.forEach((issue: any) => {
          expect(typeof issue.code).toBe("string");
          expect(typeof issue.message).toBe("string");
          expect(typeof issue.severity).toBe("string");
        });
      });
    });
    const failed = parsed.tests[1].steps[0].checks[0];
    expect(failed.passed).toBe(false);
    // The one key JSON drops: "actual" is undefined when the question was never answered. Nothing
    // reads it in that state - "passed" and "message" carry the whole finding - so the loss is
    // pinned here rather than worked around with a null.
    expect(Object.prototype.hasOwnProperty.call(failed, "actual")).toBe(false);
    expect(failed.message).toBe("The value of \"hasInsurance\" is undefined, expected \"yes\".");
  });
});

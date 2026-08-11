import { SurveyModel } from "../../src/survey";
import { ExpressionRunner } from "../../src/expressions/expressionRunner";
import { ExpressionExecutor } from "../../src/expressions/expressionExecutor";
import { ConditionRunner } from "../../src/conditions/conditionRunner";
import { settings } from "../../src/settings";
import { FunctionFactory } from "../../src/functionsfactory";
import { Helpers } from "../../src/helpers";
import { QuestionTextModel } from "../../src/question_text";
import { QuestionDropdownModel } from "../../src/question_dropdown";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { PanelModel } from "../../src/panel";

import { describe, test, expect, afterEach } from "vitest";

// Every test declared with `test.fails` below reproduces a defect that is still open: it asserts
// the correct behaviour and is expected to fail. Once the defect is fixed the assertions pass,
// vitest reports the `.fails` marker itself as an error, and the marker has to be removed
// together with the fix - so a fix cannot land while the test stays disabled.
//
// Sharing a condition result between elements is an optimization: a survey must behave exactly as
// if every element evaluated its own expression. This helper repeats a scenario with the
// survey-wide cache disabled, so a test can compare the two runs instead of hard-coding what the
// correct answer happens to be - the comparison is the decisive control, the explicit assertions
// after it only spell out which of the two runs is the correct one.
function withoutSharedResults<T>(fn: () => T): T {
  const proto: any = SurveyModel.prototype;
  const original = proto.getCachedConditionResult;
  proto.getCachedConditionResult = function (): any { return undefined; };
  try {
    return fn();
  } finally {
    proto.getCachedConditionResult = original;
  }
}

// 1. base.ts: the entry is stamped with the data version read after onExecute has already written
// into the survey, so a result computed for version N is published as valid for version N+1.
describe("A shared condition result is stamped with the version it was computed for", () => {
  test.fails("a value cleared inside onExecute does not publish the pre-clear result", () => {
    // visibleIf -> onExecute sets `visible` -> clearValueIfInvisible deletes the value ->
    // the trigger writes {flag} back. All of it runs before the result reaches the cache.
    const json = {
      clearInvisibleValues: "onHidden",
      elements: [
        { type: "text", name: "flag" },
        { type: "text", name: "q1", visibleIf: "{flag} = 1" },
        { type: "text", name: "q2", visibleIf: "{flag} = 1" }
      ],
      triggers: [{ type: "setvalue", expression: "{q1} empty", setToName: "flag", setValue: 1 }]
    };
    const run = (): any => {
      const survey = new SurveyModel(json);
      survey.setValue("flag", 1);
      survey.setValue("q1", "a");
      survey.setValue("flag", 0);
      return {
        flag: survey.getValue("flag"),
        q1IsVisible: survey.getQuestionByName("q1").isVisible,
        q2IsVisible: survey.getQuestionByName("q2").isVisible
      };
    };
    const withCache = run();
    expect(withCache, "sharing the result does not change the outcome").toEqual(withoutSharedResults(run));
    expect(withCache.flag, "the trigger has restored the flag").toBe(1);
    expect(withCache.q1IsVisible, "{flag} = 1, q1 is visible").toBe(true);
    expect(withCache.q2IsVisible, "{flag} = 1, q2 is visible").toBe(true);
  });

  test.fails("a result published into the cache is valid for the version it is stamped with", () => {
    // The same defect without relying on a scenario that keeps the wrong result until the end:
    // every entry is checked against a fresh evaluation at the moment it is published.
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b", defaultValueExpression: "{a} + 1" },
        { type: "text", name: "c", defaultValueExpression: "{a} + 1" }
      ],
      triggers: [{ type: "setvalue", expression: "{b} = 11", setToName: "a", setValue: 100 }]
    });
    const host: any = survey;
    const original = host.setCachedConditionResult.bind(host);
    const staleEntries = new Array<any>();
    host.setCachedConditionResult = function (expression: string, res: any): void {
      const actual = survey.runExpression(expression);
      if (!Helpers.isTwoValueEquals(actual, res)) {
        staleEntries.push({ expression: expression, published: res, actual: actual });
      }
      original(expression, res);
    };
    survey.setValue("a", 10);
    expect(staleEntries, "no result is published for a data version it was not computed for").toEqual([]);
  });
});

// 2. base.ts: on a cache hit onExecute is called and the method returns before info.isRunning is
// set, so the per-property re-entrancy guard that the normal path holds is dropped.
describe("A cache hit keeps the per-property re-entrancy guard", () => {
  // The shape of the existing "visibleIf and adding/remove elements on changing visible, Bug #1044"
  // test: a handler that puts the element back into a state the next run changes again.
  const addReentrantHandler = (survey: SurveyModel): void => {
    survey.onVisibleChanged.add((sender: SurveyModel, options: any) => {
      if (options.visible) {
        const question = options.question;
        question.visible = false;
        sender.currentPage.removeQuestion(question);
        sender.currentPage.addQuestion(question);
      }
    });
  };
  test("one question holds the guard for the whole duration of onExecute", () => {
    // The control: with a single question every run is a cache miss, so the guard is armed.
    // This test passes - it is what makes the next one attributable to the shared result.
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} = 2" }
      ]
    });
    addReentrantHandler(survey);
    expect(() => survey.setValue("q1", 2), "the re-entrant handler does not recurse").not.toThrow();
  });
  test.fails("two questions sharing one expression string keep the same guard", () => {
    // q3 reads the result q2 has already published, so it never arms the guard
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} = 2" },
        { type: "text", name: "q3", visibleIf: "{q1} = 2" }
      ]
    });
    addReentrantHandler(survey);
    expect(() => survey.setValue("q1", 2), "the re-entrant handler does not recurse").not.toThrow();
  });
});

// 3. survey-element.ts: getParentQuestionOrDataOwner returns undefined for a panel owned by a
// matrix row, so the panel reports canShareConditionResults() === true and writes a row-scoped
// result into the survey-wide cache.
describe("An element nested into a matrix row does not share its result", () => {
  test.fails("a detail panel resolving a row name does not affect a survey-level question", () => {
    // The nested panel resolves {row1} against the matrix value, a survey-level question
    // resolves the same name against the survey data - one expression string, two meanings
    const json = {
      elements: [
        { type: "text", name: "row1" },
        {
          type: "matrixdropdown",
          name: "matrix",
          rows: ["row1", "row2"],
          columns: [{ name: "col1", cellType: "text" }],
          detailPanelMode: "underRow",
          detailElements: [{ type: "panel", name: "detail", visibleIf: "{row1} = 'a'" }]
        },
        { type: "text", name: "q2", visibleIf: "{row1} = 'a'" }
      ]
    };
    const run = (): any => {
      const survey = new SurveyModel(json);
      survey.setValue("row1", "a");
      survey.setValue("matrix", { row1: { col1: "b" } });
      const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
      matrix.visibleRows[0].showDetailPanel();
      survey.runConditions();
      return {
        q2IsVisible: survey.getQuestionByName("q2").isVisible,
        detailIsVisible: (<PanelModel>matrix.visibleRows[0].detailPanel.getElementByName("detail")).isVisible
      };
    };
    const withCache = run();
    expect(withCache, "the row-scoped result is not shared with survey-level elements")
      .toEqual(withoutSharedResults(run));
    expect(withCache.q2IsVisible, "the survey-level {row1} is 'a'").toBe(true);
  });
});

// 4. expressions.ts: Variable.strictCompareValue is evaluate-time state left on an operand tree
// that is now shared process-wide, so a re-entrant evaluation of the same expression string
// clobbers the flag of the outer run.
describe("Strict comparison is not lost on a re-entrant evaluation", () => {
  afterEach(() => {
    FunctionFactory.Instance.unregister("reenterRank");
  });
  test.fails("a ranking question compares its value with the order taken into account", () => {
    const expression = "{q} = reenterRank()";
    let depth = 0;
    // BinaryOperand.evaluate runs the whole right operand between writing and reading the flag
    // of the left one, so an application-supplied function is enough to re-enter that window
    FunctionFactory.Instance.register("reenterRank", (): any => {
      if (depth === 0) {
        depth++;
        try {
          // the same expression string, so the same shared operand tree, but a context
          // that does not require strict comparison
          new ConditionRunner(expression).runValues({ q: ["a", "b"] });
        } finally {
          depth--;
        }
      }
      return ["a", "b"];
    });
    const survey = new SurveyModel({
      elements: [
        { type: "ranking", name: "q", choices: ["a", "b"], visibleIf: expression }
      ]
    });
    survey.setValue("q", ["b", "a"]);
    expect(survey.getQuestionByName("q").isVisible,
      "a ranking value is compared with the order taken into account").toBe(false);
  });
});

// 5. expressionRunner.ts: calcIsResultShareable assumes a variable name with no function and no
// built-in prefix resolves to a pure function of the survey data, but a question can transform
// its own value in getFilteredValue - masked text questions do.
describe("A result is not shared when the question transforms its own value", () => {
  test.fails("changing the mask of a text question invalidates the shared result", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text", name: "q1", maskType: "pattern",
          maskSettings: { pattern: "999-99", saveMaskedValue: true }
        },
        { type: "text", name: "a", visibleIf: "{q1} = 12345" },
        { type: "text", name: "b", visibleIf: "{q1} = 12345" }
      ]
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    survey.setValue("q1", "123-45");
    expect(q1.getFilteredValue(), "the mask is stripped for expressions").toBe("12345");
    expect(survey.getQuestionByName("a").isVisible, "{q1} = 12345").toBe(true);

    // the mask is a regular property: a phone mask driven by a country dropdown changes it
    // at runtime, and the survey data is not touched, so the cache is never invalidated
    (<any>q1.maskSettings).pattern = "9999999";
    survey.runConditions();
    expect(q1.getFilteredValue(), "the new mask does not produce the old value").not.toBe("12345");
    expect(survey.getQuestionByName("a").isVisible, "a is recalculated for the new mask").toBe(false);
    expect(survey.getQuestionByName("b").isVisible, "b is recalculated for the new mask").toBe(false);
  });
});

// 6. expressionRunner.ts: isResultShareable() memoizes its verdict forever, but calcIsResultShareable
// reads the mutable settings with no settings key - unlike the parse cache, which guards itself
// with getParseSettingsKey().
describe("isResultShareable follows the settings it is calculated from", () => {
  test.fails("settings.expressionVariables", () => {
    const prev = settings.expressionVariables.row;
    try {
      const runner = new ExpressionRunner("{myRow.a} = 1");
      expect(runner.isResultShareable(), "'myRow' is a survey value").toBe(true);
      settings.expressionVariables.row = "myRow";
      expect(runner.isResultShareable(), "'myRow' is the row context variable now").toBe(false);
    } finally {
      settings.expressionVariables.row = prev;
    }
  });
  test.fails("settings.expressionElementPropertyPrefix", () => {
    const prev = settings.expressionElementPropertyPrefix;
    try {
      const runner = new ExpressionRunner("{%q1.isVisible} = true");
      expect(runner.isResultShareable(), "'%q1.isVisible' is a survey value").toBe(true);
      settings.expressionElementPropertyPrefix = "%";
      expect(runner.isResultShareable(), "'%q1.isVisible' is an element property now").toBe(false);
    } finally {
      settings.expressionElementPropertyPrefix = prev;
    }
  });
});

// 7. question_baseselect.ts: getChoicesCondition caches the ConditionRunner per property, so its
// ExpressionExecutor is never recreated and isAsync freezes at the value computed when the
// function registry was first read.
describe("A cached choices condition runner follows the function registry", () => {
  afterEach(() => {
    FunctionFactory.Instance.unregister("choicesFn");
  });
  test.fails("registering the function as async after the first run", () => {
    FunctionFactory.Instance.register("choicesFn", (params: any[]): any => params[0] !== 2);
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "dropdown", name: "q2", choices: [1, 2, 3], choicesVisibleIf: "choicesFn({item}) = true" }
      ]
    });
    survey.setValue("q1", 1);
    const q2 = <QuestionDropdownModel>survey.getQuestionByName("q2");
    expect(q2.visibleChoices.length, "the sync function has hidden one item").toBe(2);

    FunctionFactory.Instance.register("choicesFn", function (params: any[]): any {
      (<any>this).returnResult(params[0] !== 2);
    }, true);
    // isAsync is still false on the cached runner, so the executor calls the async function
    // synchronously and it has no returnResult to call back into
    expect(() => survey.setValue("q1", 2), "the runner respects the new registration").not.toThrow();
  });
});

// 8. expressionExecutor.ts: parsedExpressions is a process-lifetime static Map whose only eviction
// is a full clear(), so transient expression strings accumulate and the 10000th entry drops every
// live survey's hot trees at once.
describe("The parsed expression cache is bounded without dropping everything", () => {
  test.fails("a hot entry survives the eviction of transient ones", () => {
    const cache: Map<string, any> = (<any>ExpressionExecutor).parsedExpressions;
    const max: number = (<any>ExpressionExecutor).maxParsedExpressions;
    cache.clear();
    try {
      const hot = "{hotQuestion} = 'hot'";
      new ExpressionRunner(hot);
      for (let i = 0; i < max + 1; i++) {
        // an expression editor produces a new intermediate string on every keystroke
        new ExpressionRunner("{q} = " + i);
      }
      expect(cache.has(hot),
        "the entry used by a live survey is not evicted by transient ones").toBe(true);
    } finally {
      cache.clear();
    }
  });
});

// 9. survey.ts: conditionResultsCache has no size cap and no pruning, while its key is the
// post-beforeExpressionRunning string, which a supported extension point can vary per run.
describe("The survey condition results cache is bounded", () => {
  test.fails("an onExpressionRunning subscriber that rewrites the expression per run", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} = 1" }
      ]
    });
    let counter = 0;
    survey.onExpressionRunning.add((sender: SurveyModel, options: any) => {
      options.expression = options.expression + " or {q1} = " + (1000 + counter++);
    });
    for (let i = 0; i < 500; i++) {
      survey.setValue("q1", i);
    }
    const cache: any = (<any>survey).conditionResultsCache;
    expect(Object.keys(cache).length,
      "obsolete entries are not retained for the lifetime of the survey").toBeLessThan(100);
  });
});

// 14. question_baseselect.ts: guarding onVisibleChanged() with hideIfChoicesEmpty also skips the
// choices-independent work in onVisibleChangedCore. Reported as the least certain of the findings:
// supported validation never reaches an invisible question, so addError below is the direct path.
describe("A choices change refreshes the question visibility state", () => {
  test.fails("errors of an invisible question are cleared when its choices change", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "dropdown", name: "q2", visibleIf: "{q1} = 1", choices: [1, 2, 3] }
      ]
    });
    const q2 = <QuestionDropdownModel>survey.getQuestionByName("q2");
    expect(q2.isVisible, "q2 is invisible").toBe(false);
    q2.addError("an error of an invisible question");
    q2.choices = [4, 5, 6];
    expect(q2.errors.length, "the errors are cleared on the choices change").toBe(0);
  });
});

import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionSelectBase } from "../../src/question_baseselect";
import { lintSurvey } from "../../src/linter/index";
import { getBuiltInVariableNames } from "../../src/survey";

// A finding at "error" severity claims the survey cannot work. These tests build a
// live SurveyModel on purpose - it is the only way to pin the linter against real
// behavior rather than against our reading of the code. Every case in the first
// describe used to be reported as an error while the runtime accepted it.
//
// The linter itself must stay model-free (issue #11693, pinned by
// linter-imports.tests.ts); only this test file constructs a survey.
function errors(json: any): Array<string> {
  return lintSurvey(json).findings
    .filter(f => f.severity === "error")
    .map(f => f.ruleId + " @ " + f.path);
}

function cellQuestion(survey: SurveyModel, matrixName: string, rowIndex: number, cellIndex: number): any {
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName(matrixName);
  return matrix.visibleRows[rowIndex].cells[cellIndex].question;
}

function choiceValues(question: QuestionSelectBase): Array<any> {
  return question.visibleChoices.map(choice => choice.value);
}

describe("linter vs runtime: configurations the runtime accepts", () => {
  test("carry-forward through panel. builds choices", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [
          { type: "checkbox", name: "src", choices: ["a", "b"] },
          { type: "dropdown", name: "dst", choicesFromQuestion: "panel.src" },
        ],
      }],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p1");
    const dst = <QuestionSelectBase>panel.panels[0].getQuestionByName("dst");
    expect(choiceValues(dst)).toEqual(["a", "b"]);
  });

  test("carry-forward through row. builds choices", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m1", rowCount: 1, columns: [
          { name: "src", cellType: "checkbox", choices: ["a", "b"] },
          { name: "dst", cellType: "dropdown", choicesFromQuestion: "row.src" },
        ],
      }],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    expect(choiceValues(cellQuestion(survey, "m1", 0, 1))).toEqual(["a", "b"]);
  });

  test("a column named after a top-level question reacts to that question", () => {
    const json = {
      elements: [
        { type: "text", name: "score", inputType: "number" },
        {
          type: "matrixdynamic", name: "m1", rowCount: 1,
          columns: [{ name: "score", cellType: "text", visibleIf: "{score} > 5" }],
        },
      ],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.setValue("score", 10);
    expect(cellQuestion(survey, "m1", 0, 0).isVisible).toBe(true);
    survey.setValue("score", 1);
    expect(cellQuestion(survey, "m1", 0, 0).isVisible).toBe(false);
  });

  test("a comment key of a column is a live row key", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m1", rowCount: 1, columns: [
          { name: "col1", cellType: "text", showCommentArea: true },
          { name: "col2", cellType: "text", visibleIf: "{row.col1-Comment} notempty" },
        ],
      }],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.setValue("m1", [{ col1: "x", "col1-Comment": "note" }]);
    expect(cellQuestion(survey, "m1", 0, 1).isVisible).toBe(true);
  });

  test("a comment key of a template question is a live panel key", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [
          { type: "text", name: "q1", showCommentArea: true },
          { type: "text", name: "q2", visibleIf: "{panel.q1-Comment} notempty" },
        ],
      }],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.setValue("p1", [{ q1: "x", "q1-Comment": "note" }]);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p1");
    expect(panel.panels[0].getQuestionByName("q2").isVisible).toBe(true);
  });

  test("an item condition filters the choices of a matrix cell", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m1", rowCount: 1,
        columns: [{
          name: "col2", cellType: "dropdown", choices: ["a", "b"],
          choicesVisibleIf: "{item} != 'b'",
        }],
      }],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    expect(choiceValues(cellQuestion(survey, "m1", 0, 0))).toEqual(["a"]);
  });

  test("an array source without choiceValuesFromQuestion uses the first field", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }, { name: "col2" }] },
        { type: "dropdown", name: "d1", choicesFromQuestion: "m1" },
      ],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.setValue("m1", [{ col1: "a", col2: "b" }, { col1: "c", col2: "d" }]);
    expect(choiceValues(<QuestionSelectBase>survey.getQuestionByName("d1"))).toEqual(["a", "c"]);
  });

  test("the total row is addressed by valueName", () => {
    const json = {
      elements: [
        {
          type: "matrixdynamic", name: "m1", valueName: "mv", rowCount: 1,
          columns: [{ name: "col1", cellType: "text", inputType: "number", totalType: "sum" }],
        },
        { type: "text", name: "q2", visibleIf: "{mv-total.col1} > 0" },
      ],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.setValue("mv", [{ col1: 5 }]);
    expect(survey.data["mv-total"]).toEqual({ col1: 5 });
    expect(survey.getQuestionByName("q2").isVisible).toBe(true);
  });
});

describe("linter vs runtime: configurations that really are dead", () => {
  test("a scoped carry-forward outside a dynamic panel builds no choices", () => {
    const json = {
      elements: [
        { type: "checkbox", name: "src", choices: ["a", "b"] },
        { type: "dropdown", name: "dst", choicesFromQuestion: "panel.src" },
      ],
    };
    expect(errors(json)).toEqual(["choices/dead-source @ elements[1].choicesFromQuestion"]);
    const survey = new SurveyModel(json);
    expect(choiceValues(<QuestionSelectBase>survey.getQuestionByName("dst"))).toEqual([]);
  });

  test("a question referencing itself is still an error", () => {
    const json = {
      elements: [{ type: "text", name: "q1", visibleIf: "{q1} notempty" }],
    };
    expect(errors(json)).toEqual(["reference/self @ elements[0].visibleIf"]);
  });

  test("an unknown inner name behind a comment suffix is still an error", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text", visibleIf: "{row.nosuch-Comment} notempty" },
        ],
      }],
    };
    expect(errors(json)).toEqual(["reference/unknown @ elements[0].columns[1].visibleIf"]);
  });

  test("an item variable outside an item condition is still an error", () => {
    const json = { elements: [{ type: "text", name: "q1", visibleIf: "{item} = 1" }] };
    expect(errors(json)).toEqual(["reference/unknown @ elements[0].visibleIf"]);
  });

  test("a misspelled choiceValuesFromQuestion is still an error", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "product" }] },
        { type: "dropdown", name: "d1", choicesFromQuestion: "m1", choiceValuesFromQuestion: "produkt" },
      ],
    };
    expect(errors(json)).toEqual(["choices/dead-source @ elements[1].choiceValuesFromQuestion"]);
  });

  test("a page name in an expression resolves to nothing", () => {
    const json = {
      pages: [
        { name: "intro", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2", visibleIf: "{intro} notempty" }] },
      ],
    };
    expect(errors(json)).toEqual(["reference/unknown @ pages[1].elements[0].visibleIf"]);
    const survey = new SurveyModel(json);
    survey.setValue("q1", "abc");
    expect(survey.runExpression("{intro} notempty")).toBe(false);
    // the runtime answers a page only behind the element-property prefix
    expect(survey.runExpression("{$intro.isVisible}")).toBe(true);
    expect(errors({
      pages: [
        { name: "intro", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2", visibleIf: "{$intro.isVisible} = true" }] },
      ],
    })).toEqual([]);
  });

  test("an unknown total column is still an error", () => {
    const json = {
      elements: [
        {
          type: "matrixdynamic", name: "m1", valueName: "mv",
          columns: [{ name: "col1", cellType: "text", inputType: "number", totalType: "sum" }],
        },
        { type: "text", name: "q2", visibleIf: "{mv-total.nosuchcol} > 0" },
      ],
    };
    expect(errors(json)).toEqual(["reference/unknown @ elements[1].visibleIf"]);
  });
});

// The linter reads these names from the core's own table, so the two cannot drift
// apart. What still needs pinning is the table itself: every name in it must really be
// answered by a live survey, and a name outside it must not be.
describe("built-in variables: the core table vs the linter", () => {
  const json = {
    elements: [
      { type: "text", name: "q1", correctAnswer: "a" },
      { type: "text", name: "q2" },
    ],
  };
  getBuiltInVariableNames().forEach(name => {
    test("{" + name + "} is answered by the survey and accepted by the linter", () => {
      const survey = new SurveyModel(json);
      expect(survey.runExpression("{" + name + "}")).not.toBe(null);
      expect(errors({
        elements: [{ type: "text", name: "q1", visibleIf: "{" + name + "} notempty" }],
      })).toEqual([]);
    });
  });

  test("a name outside the table is answered by nothing", () => {
    const survey = new SurveyModel(json);
    expect(survey.runExpression("{nosuchvariable}")).toBe(null);
    expect(errors({
      elements: [{ type: "text", name: "q1", visibleIf: "{nosuchvariable} notempty" }],
    })).toEqual(["reference/unknown @ elements[0].visibleIf"]);
  });

  test("a built-in has no sub-path", () => {
    const survey = new SurveyModel(json);
    expect(survey.runExpression("{pageno.title}")).toBe(null);
    expect(errors({
      elements: [{ type: "text", name: "q1", visibleIf: "{pageno.title} notempty" }],
    })).toEqual(["reference/unknown @ elements[0].visibleIf"]);
  });
});

// validator/dead claims a validator either never fires or rejects every answer. The claim is
// about behaviour, so it is pinned against behaviour: each case feeds the question a valid
// answer and asks the model what the validator did with it.
//
// settings.supportedValidators is deliberately NOT the criterion. It lists what the Creator
// offers, and the runtime runs whatever is attached: the "regex on a number input" rows below
// pass validation, which is why the linter stays silent about them.
describe("linter vs runtime: validators that cannot validate", () => {
  function runtimeRejects(question: any, validator: any, value: any): boolean {
    const survey = new SurveyModel({
      elements: [Object.assign({}, question, { name: "q1", validators: [validator] })],
    });
    const q = survey.getQuestionByName("q1");
    q.value = value;
    return q.hasErrors(false);
  }
  function lintReports(question: any, validator: any): Array<string> {
    const json = { elements: [Object.assign({}, question, { name: "q1", validators: [validator] })] };
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "validator/dead" && f.reason === "wrongValueShape")
      .map(f => f.messageData.effect);
  }
  const CASES: Array<{
    title: string, question: any, validator: any,
    // answers the validator is meant to accept, plus one it is meant to reject
    good: any, bad: any, effect?: string,
  }> = [
    {
      title: "numeric on a checkbox", question: { type: "checkbox", choices: [1, 2] },
      validator: { type: "numeric", minValue: 1 }, good: [1, 2], bad: [1, 2],
      effect: "rejectsEveryAnswer",
    },
    {
      title: "email on a number input", question: { type: "text", inputType: "number" },
      validator: { type: "email" }, good: 42, bad: 42, effect: "rejectsEveryAnswer",
    },
    {
      title: "a length check on a number input", question: { type: "text", inputType: "number" },
      validator: { type: "text", minLength: 5 }, good: 42, bad: 4, effect: "neverFires",
    },
    {
      title: "answercount on a single-value question", question: { type: "radiogroup", choices: ["a"] },
      validator: { type: "answercount", minCount: 2 }, good: "a", bad: "a", effect: "neverFires",
    },
    {
      title: "regex on a number input", question: { type: "text", inputType: "number" },
      validator: { type: "regex", regex: "^4" }, good: 42, bad: 91,
    },
    {
      title: "regex on a checkbox", question: { type: "checkbox", choices: ["ab"] },
      validator: { type: "regex", regex: "^a" }, good: ["ab"], bad: undefined,
    },
    {
      title: "numeric on a rating", question: { type: "rating" },
      validator: { type: "numeric", minValue: 1 }, good: 3, bad: undefined,
    },
    {
      title: "a length check on a text input", question: { type: "text" },
      validator: { type: "text", minLength: 5 }, good: "abcdef", bad: "ab",
    },
  ];
  CASES.forEach(entry => {
    test(entry.title + (entry.effect ? " is reported as " + entry.effect : " stays clean"), () => {
      expect(lintReports(entry.question, entry.validator)).toEqual(entry.effect ? [entry.effect] : []);
      if (entry.effect === "rejectsEveryAnswer") {
        // the answer the validator was written for is rejected all the same
        expect(runtimeRejects(entry.question, entry.validator, entry.good)).toBe(true);
      } else if (entry.effect === "neverFires") {
        // the answer the validator was written to reject passes
        expect(runtimeRejects(entry.question, entry.validator, entry.bad)).toBe(false);
      } else {
        expect(runtimeRejects(entry.question, entry.validator, entry.good)).toBe(false);
        if (entry.bad !== undefined) {
          expect(runtimeRejects(entry.question, entry.validator, entry.bad)).toBe(true);
        }
      }
    });
  });
});

// property/unknown rebuilds the deserializer's own key matching. The runtime answer is
// survey.jsonErrors: a JsonUnknownPropertyError per key it could not place.
describe("linter vs runtime: unknown properties", () => {
  function runtimeUnknownKeys(json: any): Array<string> {
    const survey = new SurveyModel(json);
    // jsonErrors is null while the JSON loads without a complaint
    return (survey.jsonErrors || [])
      .filter(e => e.type === "unknownproperty")
      .map((e: any) => e.propertyName)
      .sort();
  }
  function lintUnknownKeys(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "property/unknown")
      .map(f => f.messageData.key)
      .sort();
  }
  const CASES: Array<{ title: string, json: any }> = [
    {
      title: "misspelled keys on a question and on the survey",
      json: { titlee: "t", elements: [{ type: "text", name: "q1", visibileIf: "1=1", nosuch: 2 }] },
    },
    {
      title: "keys of a page, a panel and a trigger",
      json: {
        pages: [{
          name: "p1", nosuchpageprop: 1,
          elements: [{ type: "panel", name: "pan1", nosuchpanelprop: 1, elements: [] }],
        }],
        triggers: [{ type: "complete", expression: "1=1", nosuchtriggerprop: 1 }],
      },
    },
    {
      title: "keys inside a matrix column and a multipletext item",
      json: {
        elements: [
          { type: "matrixdynamic", name: "m1", columns: [{ name: "c1", nosuchcolumnprop: 1 }] },
          { type: "multipletext", name: "mt1", items: [{ name: "i1", nosuchitemprop: 1 }] },
        ],
      },
    },
    {
      title: "an object-form choice next to a scalar one",
      json: {
        elements: [{ type: "dropdown", name: "q1", choices: ["a", { value: "b", nosuchchoiceprop: 1 }] }],
      },
    },
    {
      title: "a survey the serializer accepts whole",
      json: {
        title: "t",
        elements: [
          { type: "text", name: "q1", inputType: "number", min: 1, max: 5 },
          { type: "checkbox", name: "q2", choices: ["a"], hasOther: true },
          { type: "matrixdynamic", name: "m1", columns: [{ name: "c1", cellType: "dropdown", choices: ["x"] }] },
        ],
        triggers: [{ type: "setvalue", expression: "{q1} > 1", setToName: "q2", setValue: ["a"] }],
      },
    },
  ];
  CASES.forEach(entry => {
    test(entry.title + ": the linter reports what the deserializer drops", () => {
      expect(lintUnknownKeys(entry.json)).toEqual(runtimeUnknownKeys(entry.json));
    });
  });
});

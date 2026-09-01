import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionSelectBase } from "../../src/question_baseselect";
import { lintSurvey } from "../../src/linter/index";
import { getSupportedValidators } from "../../src/linter/validator-utils";
import { resolveLintSettings } from "../../src/linter/lint-settings";
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

// The supported-validator table the linter rebuilds from settings and the serializer against
// the model's own answer. question_text.ts narrows the list by inputType through a private
// hash, so the mirror in validator-utils.ts is only trustworthy while this test holds.
describe("linter vs runtime: supported validators", () => {
  const INPUT_TYPES = ["text", "email", "tel", "password", "url", "number", "range", "date"];
  INPUT_TYPES.forEach(inputType => {
    test("a text question with inputType \"" + inputType + "\" supports the same validators", () => {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "q1", inputType: inputType }],
      });
      const question = survey.getQuestionByName("q1");
      const record: any = { kind: "question", type: "text", json: { inputType: inputType } };
      expect(getSupportedValidators(record, resolveLintSettings()).sort())
        .toEqual(question.getSupportedValidators().sort());
    });
  });
  ["comment", "checkbox", "radiogroup", "imagepicker", "rating"].forEach(type => {
    test("a " + type + " question supports the same validators", () => {
      const survey = new SurveyModel({ elements: [{ type: type, name: "q1", choices: ["a"] }] });
      const question = survey.getQuestionByName("q1");
      const record: any = { kind: "question", type: type, json: {} };
      expect(getSupportedValidators(record, resolveLintSettings()).sort())
        .toEqual(question.getSupportedValidators().sort());
    });
  });
});

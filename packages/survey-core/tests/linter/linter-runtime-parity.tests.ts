import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { JsonObject } from "../../src/jsonobject";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionSelectBase } from "../../src/question_baseselect";
import { lintSurvey } from "../../src/linter/index";
import { OBJECT_PROTOTYPE_MEMBERS } from "../../src/linter/catalog";
import { LintFixture, NOT_AN_ARRAY_FIXTURES, REQUIRED_FIXTURES } from "./lint-fixtures";
import { getBuiltInVariableNames } from "../../src/survey";

// A finding at "error" severity claims the survey cannot work. These tests build a
// live SurveyModel on purpose - it is the only way to pin the linter against real
// behavior rather than against our reading of the code. Every case in the first
// describe used to be reported as an error while the runtime accepted it.
//
// One rule is deliberately wider than the runtime: name/reserved reports every member of
// Object.prototype in every slot that keys a value, although the core now survives most of
// them. Its describe keeps the two halves apart and says why.
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
  test("numeric checkbox validation still warns when a single selection is coerced", () => {
    const question = { type: "checkbox", choices: [1, 2, 3] };
    const validator = { type: "numeric", minValue: 2 };
    // minValue compares the coerced value, not the selection count or each item.
    expect(runtimeRejects(question, validator, [1])).toBe(true);
    expect(runtimeRejects(question, validator, [2])).toBe(false);
    expect(runtimeRejects(question, validator, [3])).toBe(false);
    expect(runtimeRejects(question, validator, [2, 3])).toBe(true);
    expect(lintReports(question, validator)).toHaveLength(1);
  });
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

// property/not-an-array mirrors JsonRequiredArrayPropertyError: the deserializer wraps a
// non-array value written for an array property and records the key it found it under.
describe("linter vs runtime: a non-array written for an array property", () => {
  function runtimeKeys(json: any): Array<string> {
    const survey = new SurveyModel(json);
    return (survey.jsonErrors || [])
      .filter(e => e.type === "arrayproperty")
      .map((e: any) => e.propertyName + "@" + e.className)
      .sort();
  }
  function lintKeys(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "property/not-an-array")
      .map(f => f.messageData.key + "@" + f.messageData.className)
      .sort();
  }
  const CASES: Array<LintFixture> = Object.keys(NOT_AN_ARRAY_FIXTURES)
    .map(key => NOT_AN_ARRAY_FIXTURES[key]);
  CASES.forEach(entry => {
    test(entry.title + ": the linter reports what the deserializer wraps", () => {
      expect(lintKeys(entry.json)).toEqual(runtimeKeys(entry.json));
    });
  });
});

// property/required mirrors JsonRequiredPropertyError. The deserializer reports the first
// missing property of an object only, so every fixture leaves out one property per object.
describe("linter vs runtime: required properties", () => {
  function runtimeKeys(json: any): Array<string> {
    const survey = new SurveyModel(json);
    return (survey.jsonErrors || [])
      .filter(e => e.type === "requiredproperty")
      .map((e: any) => e.propertyName + "@" + e.className)
      .sort();
  }
  function lintKeys(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "property/required")
      .map(f => f.messageData.key + "@" + f.messageData.className)
      .sort();
  }
  const CASES: Array<LintFixture> = Object.keys(REQUIRED_FIXTURES)
    .map(key => REQUIRED_FIXTURES[key]);
  CASES.forEach(entry => {
    test(entry.title + ": the linter reports what the deserializer requires", () => {
      expect(lintKeys(entry.json)).toEqual(runtimeKeys(entry.json));
    });
  });
});

// The */unknown-type rules mirror JsonMissingTypeError and JsonIncorrectTypeError: an object
// under a baseClassName property (elements, templateElements, triggers, validators) that the
// serializer cannot build - no type, or a type it does not know - is dropped at runtime.
describe("linter vs runtime: missing and unknown types", () => {
  const RUNTIME_KIND: { [baseClassName: string]: string } = {
    question: "element", surveytrigger: "trigger", surveyvalidator: "validator",
  };
  function runtimeTokens(json: any): Array<string> {
    const survey = new SurveyModel(json);
    return (survey.jsonErrors || [])
      .filter(e => e.type === "missingtypeproperty" || e.type === "incorrecttypeproperty")
      .map((e: any) => RUNTIME_KIND[e.baseClassName] + ":" + (e.type === "missingtypeproperty" ? "missing" : "unknown"))
      .sort();
  }
  function lintTokens(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "element/unknown-type" || f.ruleId === "trigger/unknown-type" ||
        f.ruleId === "validator/unknown-type")
      .map(f => f.ruleId.split("/")[0] + ":" +
        (f.reason === "missingType" || f.reason === "noType" ? "missing" : "unknown"))
      .sort();
  }
  const CASES: Array<{ title: string, json: any }> = [
    { title: "a question without a type", json: { pages: [{ name: "p1", elements: [{ name: "q1" }] }] } },
    { title: "a question with an unknown type", json: { elements: [{ type: "text_custom", name: "q1" }] } },
    { title: "inside a panel and a dynamic-panel template", json: {
      elements: [
        { type: "panel", name: "pn", elements: [{ name: "q1" }] },
        { type: "paneldynamic", name: "pd", templateElements: [{ type: "nosuch", name: "q2" }] },
      ],
    } },
    { title: "triggers without a type and with an unknown one", json: {
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ expression: "{q1} = 1" }, { type: "nosuchtrigger", expression: "{q1} = 1" }],
    } },
    { title: "validators without a type and with an unknown one", json: {
      elements: [{ type: "text", name: "q1", validators: [{ minValue: 1 }, { type: "nosuchvalidator" }] }],
    } },
    { title: "a survey the serializer builds whole", json: {
      elements: [
        { type: "text", name: "q1", validators: [{ type: "numeric" }] },
        { type: "panel", name: "pn", elements: [{ type: "comment", name: "q2" }] },
      ],
      triggers: [{ type: "complete", expression: "{q1} = 1" }],
    } },
  ];
  CASES.forEach(entry => {
    test(entry.title + ": the linter reports what the deserializer drops", () => {
      expect(lintTokens(entry.json)).toEqual(runtimeTokens(entry.json));
    });
  });
});

// property/invalid-value (notInChoices) mirrors JsonIncorrectPropertyValueError, which the
// deserializer reports only when asked to validate property values.
describe("linter vs runtime: values outside the allowed set", () => {
  function runtimeKeys(json: any): Array<string> {
    const survey = new SurveyModel();
    const converter = new JsonObject();
    converter.toObject(json, survey, { validatePropertyValues: true });
    return converter.errors
      .filter(e => e.type === "incorrectvalue")
      .map((e: any) => e.property.name + "=" + JSON.stringify(e.value))
      .sort();
  }
  function lintKeys(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "property/invalid-value" && f.reason === "notInChoices")
      .map(f => f.messageData.key + "=" + JSON.stringify(f.messageData.value))
      .sort();
  }
  const CASES: Array<{ title: string, json: any }> = [
    { title: "a misspelled enum value", json: { elements: [{ type: "text", name: "q1", clearIfInvisible: "sss" }] } },
    { title: "an enum value in the wrong case", json: { elements: [{ type: "text", name: "q1", clearIfInvisible: "cOmPlEtE" }] } },
    { title: "a survey-level enum and a question-level one", json: {
      questionTitleLocation: "Left",
      elements: [{ type: "text", name: "q1", titleLocation: "topp" }],
    } },
    { title: "a number spelled as a string is still that number", json: {
      elements: [{ type: "rating", name: "q1", rateMax: "5" }],
    } },
    { title: "the default locale spelled out", json: { locale: "default", elements: [{ type: "text", name: "q1" }] } },
    { title: "a survey the serializer accepts whole", json: {
      locale: "de", questionTitleLocation: "left",
      elements: [{ type: "text", name: "q1", clearIfInvisible: "onComplete", titleLocation: "top" }],
    } },
  ];
  CASES.forEach(entry => {
    test(entry.title + ": the linter reports what the deserializer rejects", () => {
      expect(lintKeys(entry.json)).toEqual(runtimeKeys(entry.json));
    });
  });
  test("\"default\" is an accepted spelling of the survey locale - for both", () => {
    const json = { locale: "default", elements: [{ type: "text", name: "q1" }] };
    expect(runtimeKeys(json)).toEqual([]);
    expect(lintKeys(json)).toEqual([]);
  });
});

describe("linter vs runtime: reserved names", () => {
  // "__proto__" is the one member the runtime singles out - it is never stored under that key -
  // while the other eleven are ordinary keys to it. The two halves below follow that split.
  const MEMBERS = Array.from(OBJECT_PROTOTYPE_MEMBERS).filter(name => name !== "__proto__");
  function keepsAnswer(name: string): boolean {
    try {
      const survey = new SurveyModel({ elements: [{ type: "text", name: name }] });
      survey.setValue(name, 1);
      return survey.getValue(name) === 1;
    } catch{
      return false;
    }
  }

  // --- what the runtime still cannot take ---
  // The survey keys its own hashes by Object.create(null) and skips "__proto__" on the way in
  // (Bug#11856, Bug#11858), so a top-level data key spelled like a prototype member is safe
  // today. The value objects nested inside an answer were left plain: a matrix row value and a
  // multiple text value are still {}, so reading such a key back off one of them hands out the
  // prototype member - a function, which the value cloner turns into a SyntaxError.
  test("a column named after a member throws on the first write", () => {
    MEMBERS.forEach(name => {
      const json = {
        elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "a" }, { name: name }] }],
      };
      const survey = new SurveyModel(json);
      expect(() => { cellQuestion(survey, "m", 0, 1).value = "x"; }, name).toThrow();
      expect(errors(json), name).toEqual(["name/reserved @ elements[0].columns[1].name"]);
    });
  });
  test("a multiple text item named after a member throws on the first write", () => {
    MEMBERS.forEach(name => {
      const json = { elements: [{ type: "multipletext", name: "mt", items: [{ name: "a" }, { name: name }] }] };
      const survey = new SurveyModel(json);
      const question = <any>survey.getQuestionByName("mt");
      expect(() => { question.items[0].value = "x"; question.items[1].value = "y"; }, name).toThrow();
      expect(errors(json), name).toEqual(["name/reserved @ elements[0].items[1].name"]);
    });
  });
  // "__proto__" writes nowhere rather than throwing: the assignment would replace the prototype
  // of the plain object that carries the value, so every slot drops it on the floor instead
  test("a column or an item named __proto__ swallows the value instead of throwing", () => {
    const matrixJson = {
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "a" }, { name: "__proto__" }] }],
    };
    const matrixSurvey = new SurveyModel(matrixJson);
    cellQuestion(matrixSurvey, "m", 0, 1).value = "x";
    expect(matrixSurvey.data).toEqual({});
    expect(errors(matrixJson)).toEqual(["name/reserved @ elements[0].columns[1].name"]);

    const textJson = { elements: [{ type: "multipletext", name: "mt", items: [{ name: "a" }, { name: "__proto__" }] }] };
    const textSurvey = new SurveyModel(textJson);
    const question = <any>textSurvey.getQuestionByName("mt");
    question.items[0].value = "x";
    question.items[1].value = "y";
    expect(textSurvey.data).toEqual({ mt: { a: "x" } });
    expect(errors(textJson)).toEqual(["name/reserved @ elements[0].items[1].name"]);
  });
  test("a question named __proto__ answers itself and never reaches the data", () => {
    const json = { elements: [{ type: "text", name: "__proto__" }] };
    const survey = new SurveyModel(json);
    const question = <any>survey.getQuestionByName("__proto__");
    question.value = 1;
    // the respondent sees the answer in the question and the survey is submitted without it
    expect(question.value).toBe(1);
    expect(Object.keys(survey.data)).toEqual([]);
    expect(keepsAnswer("__proto__")).toBe(false);
    expect(errors(json)).toEqual(["name/reserved @ elements[0].name"]);
  });
  test("a calculated value named __proto__ never reaches the result", () => {
    const json = {
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "__proto__", expression: "1 + 1", includeIntoResult: true }],
    };
    const survey = new SurveyModel(json);
    survey.setValue("q1", 1);
    expect(Object.keys(survey.data)).toEqual(["q1"]);
    expect(errors(json)).toEqual(["name/reserved @ calculatedValues[0].name"]);
  });

  // --- policy rather than parity: the slots the runtime takes today ---
  // The rule reports the whole list in every slot that keys a value, the ones the core fix made
  // safe included. One list, any case, any context is the rule an author can remember - and a
  // name that works as a question and throws as a column of that same question is the confusing
  // part. The findings below are the linter's own claim rather than the runtime's.
  test("a question named after a member keeps its answer today - and is reported all the same", () => {
    MEMBERS.forEach(name => {
      expect(keepsAnswer(name), name).toBe(true);
      expect(errors({ elements: [{ type: "text", name: name }] }), name)
        .toEqual(["name/reserved @ elements[0].name"]);
    });
  });
  test("a matrix row named toString carries its value the way any other row does", () => {
    const json = { elements: [{ type: "matrix", name: "m", rows: ["r1", "toString"], columns: ["c1", "c2"] }] };
    const survey = new SurveyModel(json);
    const matrix = <any>survey.getQuestionByName("m");
    matrix.visibleRows[0].value = "c2";
    matrix.visibleRows[1].value = "c1";
    expect(survey.data).toEqual({ m: { r1: "c2", toString: "c1" } });
    expect(matrix.isAnswered).toBe(true);
    expect(errors(json)).toEqual(["name/reserved @ elements[0].rows[1]"]);
  });
  // the runtime lower-cases its variable names and its question lookup hashes, so a spelling that
  // survives in one slot collides in another ("Constructor" as a question, "__Proto__" as a
  // calculated value); the comparison ignores case for that reason
  test("another spelling of a member is reserved by policy", () => {
    ["ToString", "tostring", "Constructor", "__Proto__"].forEach(name => {
      expect(errors({ elements: [{ type: "text", name: name }] }), name)
        .toEqual(["name/reserved @ elements[0].name"]);
    });
  });
  test("a name padded with spaces is trimmed by the runtime, so it lands in the reserved slot", () => {
    const json = { elements: [{ type: "text", name: " toString " }] };
    const survey = new SurveyModel(json);
    const question = <any>survey.getAllQuestions()[0];
    expect(question.name).toBe("toString");
    question.value = 1;
    expect(survey.data).toEqual({ toString: 1 });
    expect(errors(json)).toEqual(["name/reserved @ elements[0].name"]);
  });
  test("a page and a panel may carry the name - neither keys a plain object", () => {
    const json = {
      pages: [{
        name: "toString",
        elements: [{ type: "panel", name: "valueOf", elements: [{ type: "text", name: "q1" }] }],
      }],
    };
    const survey = new SurveyModel(json);
    survey.setValue("q1", 1);
    expect(survey.data).toEqual({ q1: 1 });
    expect(survey.getPageByName("toString")).toBeTruthy();
    expect(survey.getPanelByName("valueOf")).toBeTruthy();
    expect(errors(json)).toEqual([]);
  });
});

describe("linter vs runtime: a name that is not a string", () => {
  // the runtime trims a name whatever it belongs to, so a page or a panel named by a number
  // stops the survey from loading the way a question does - and neither has a required name
  test("a page and a panel named by a number do not load, and property/required reports them", () => {
    const pageJson = { pages: [{ name: 1, elements: [{ type: "text", name: "q1" }] }] };
    const panelJson = { elements: [{ type: "panel", name: 5, elements: [{ type: "text", name: "q1" }] }] };
    expect(() => new SurveyModel(pageJson)).toThrow();
    expect(() => new SurveyModel(panelJson)).toThrow();
    expect(errors(pageJson)).toEqual(["property/required @ pages[0].name"]);
    expect(errors(panelJson)).toEqual(["property/required @ elements[0].name"]);
  });
});

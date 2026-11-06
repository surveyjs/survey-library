import { describe, test, expect } from "vitest";
import { ConditionsParser } from "../../src/conditions/conditionsParser";
import { FunctionFactory } from "../../src/functionsfactory";
import { settings as surveySettings } from "../../src/settings";
import { SurveyModel } from "../../src/survey";
import { Question } from "../../src/question";
import { ComponentCollection } from "../../src/question_custom";
import {
  buildExpressionSystemPrompt, describeExpressionQuestion, expressionOperatorSpellings, getExpressionFunctions, getExpressionOperators,
  getExpressionValueType, IExpressionContext, IExpressionVariable,
} from "../../src/ai/expression-context";
import { expressionGuideVersion } from "../../src/ai/expression-guide";

// A context of a condition at the survey level, as a product builds it
function createContext(more?: Partial<IExpressionContext>): IExpressionContext {
  return Object.assign(<IExpressionContext>{
    guideVersion: expressionGuideVersion,
    target: { isCondition: true, objects: [{ type: "text", name: "q2", propertyName: "visibleIf" }] },
    variables: [{ name: "q1", kind: "question", type: "text", valueType: "string" }],
    scopes: [],
    functions: getExpressionFunctions(),
    operators: getExpressionOperators(),
    examples: [],
    locales: { survey: "en" },
    truncated: { variables: false, choices: false, examples: false },
  }, more || {});
}

describe("Functions and operators in the AI context (ai-expressions)", () => {
  test("built-ins carry signatures; custom functions with and without metadata; no creator-internal one", () => {
    FunctionFactory.Instance.register("aiexPlain", () => 1);
    FunctionFactory.Instance.register({
      name: "aiexDescribed", func: () => 1, description: "Returns one",
      parameters: [{ name: "value", type: "number", optional: true }], returnType: "number",
    });
    // a function a product registers for its own editors, which it leaves out
    const internalFunctions = ["aiexInternal"];
    FunctionFactory.Instance.register("aiexInternal", () => 1);
    try {
      const functions = getExpressionFunctions(internalFunctions);
      const byName = (name: string) => functions.filter(f => f.name === name)[0];
      expect(byName("iif")).toEqual({
        name: "iif", isCustom: false, isAsync: false,
        signature: "iif(condition: condition, valueIfTrue: any, valueIfFalse: any): any",
        description: "Returns the second argument when the condition holds, otherwise the third.",
      });
      expect(byName("sum").signature).toBe("sum(...values: number|array): number");
      expect(byName("displayValue").isAsync).toBe(true);
      expect(byName("aiexPlain")).toEqual({ name: "aiexPlain", isCustom: true, isAsync: false });
      expect(byName("aiexDescribed")).toEqual({
        name: "aiexDescribed", isCustom: true, isAsync: false, signature: "aiexDescribed(value?: number): number", description: "Returns one",
      });
      internalFunctions.forEach(name => expect(byName(name), name).toBeUndefined());
      expect(getExpressionFunctions().filter(f => f.name === "aiexInternal")).toHaveLength(1);
      expect(functions.filter(f => !f.isCustom && !f.signature).map(f => f.name)).toEqual([]);
    } finally {
      FunctionFactory.Instance.unregister("aiexPlain");
      FunctionFactory.Instance.unregister("aiexDescribed");
      FunctionFactory.Instance.unregister("aiexInternal");
    }
  });
  test("every operator spelling parses to its operator, and the questionTypes follow the settings", () => {
    const operators = getExpressionOperators();
    const parser = new ConditionsParser();
    const failed: Array<string> = [];
    // every spelling the grammar accepts, the advertised ones and those that are not taught
    Object.keys(expressionOperatorSpellings).forEach(name => expressionOperatorSpellings[name].forEach(sp => {
      let text = "{a} " + sp + " {b}";
      if (name === "empty" || name === "notempty") text = "{a} " + sp;
      if (name === "negate") text = sp === "!" ? "!{a}" : sp + " {a}";
      const operand: any = parser.parseExpression(text);
      if (!operand || operand.operator !== name) failed.push(name + ": " + text);
    }));
    expect(failed).toEqual([]);
    expect(expressionOperatorSpellings.negate).toEqual(["!", "negate"]);
    operators.forEach(op => op.spellings.forEach(sp => expect(expressionOperatorSpellings[op.name], op.name).toContain(sp)));
    expect(operators.filter(op => op.name === "allof")[0].questionTypes).toEqual(["checkbox"]);
    const saved = surveySettings.logic.operators.allof;
    surveySettings.logic.operators.allof = ["checkbox", "tagbox"];
    try {
      expect(getExpressionOperators().filter(op => op.name === "allof")[0].questionTypes).toEqual(["checkbox", "tagbox"]);
    } finally {
      surveySettings.logic.operators.allof = saved;
    }
    expect(operators.map(op => op.name)).toContain("and");
    // "negate" parses, but negate(...) calls a function: only ! is taught
    expect(operators.filter(op => op.name === "negate")[0].spellings).toEqual(["!"]);
    const systemPrompt = buildExpressionSystemPrompt(createContext());
    // "negate" is there as the operator's name only, never as a spelling
    expect(systemPrompt.split("\"negate\"").length).toBe(2);
    expect(systemPrompt).toContain("\"name\": \"negate\"");
  });
});

describe("The system prompt of an expression request (ai-expressions)", () => {
  test("without texts the prompt names no product; a product's texts replace the defaults", () => {
    const context = createContext({ locales: { creator: "en", survey: "en" } });
    const neutral = buildExpressionSystemPrompt(context);
    expect(neutral.split("\n")[0]).toBe("You write SurveyJS expressions for the user. The user describes in words what the expression must do; you answer with one expression.");
    expect(neutral).toContain("Write the explanation in English (locale code \"en\"), the language of the user interface, whatever language the request or the survey texts use.");
    expect(neutral).not.toContain("Creator");
    expect(buildExpressionSystemPrompt(context)).toBe(neutral);
    expect(neutral.indexOf(JSON.stringify(context, null, 2))).toBeGreaterThan(-1);

    const own = buildExpressionSystemPrompt(context, {
      intro: "You write expressions for a filter.",
      uiLanguage: "the language of the filter panel",
      getLocaleName: (locale: string) => "Locale " + locale,
    });
    expect(own.split("\n")[0]).toBe("You write expressions for a filter.");
    expect(own).toContain("Write the explanation in Locale en (locale code \"en\"), the language of the filter panel, whatever language");
    // a text that is not passed keeps its default
    expect(buildExpressionSystemPrompt(context, { intro: "Intro." })).toContain(", the language of the user interface, ");
  });
  test("without locales.creator the explanation is written in the survey locale", () => {
    const prompt = buildExpressionSystemPrompt(createContext({ locales: { survey: "de" } }));
    expect(prompt).toContain("Write the explanation in German (locale code \"de\")");
    expect(buildExpressionSystemPrompt(createContext({ locales: { creator: "en", survey: "de" } })))
      .toContain("Write the explanation in English (locale code \"en\")");
    // a locale survey-core has no name for is named by its code
    expect(buildExpressionSystemPrompt(createContext({ locales: { survey: "zz" } })))
      .toContain("Write the explanation in the language with locale code \"zz\"");
  });
});

describe("Question descriptors of the AI context (ai-expressions)", () => {
  test("a question is described by its type, value type, page, choices, rows and columns", () => {
    const survey = new SurveyModel({
      pages: [{
        name: "p1", elements: [
          { type: "dropdown", name: "q1", choices: ["a", "b"], showNoneItem: true },
          { type: "text", name: "q2", inputType: "date" },
          { type: "matrixdropdown", name: "q3", rows: ["r1"], columns: [{ name: "c1", cellType: "text" }] },
        ],
      }],
    });
    const describeByName = (name: string): IExpressionVariable => {
      const variable: IExpressionVariable = { name: name, kind: "question" };
      describeExpressionQuestion(variable, <Question>survey.getQuestionByName(name));
      return variable;
    };
    expect(describeByName("q1")).toEqual({
      name: "q1", kind: "question", type: "dropdown", valueType: "string", page: "p1",
      choices: [{ value: "a", text: "a" }, { value: "b", text: "b" }, { value: "none", text: "None" }],
    });
    expect(describeByName("q2")).toEqual({ name: "q2", kind: "question", type: "text", valueType: "date", page: "p1" });
    expect(describeByName("q3")).toEqual({
      name: "q3", kind: "question", type: "matrixdropdown", valueType: "object", page: "p1",
      rows: [{ value: "r1", text: "r1" }], columns: [{ name: "c1", title: "c1", cellType: "text" }],
    });
  });
  test("the value type is what the question itself reports", () => {
    ComponentCollection.Instance.add({ name: "aiexgrade", questionJSON: { type: "dropdown", choices: [1, 2, 3] } });
    ComponentCollection.Instance.add({ name: "aiexname", elementsJSON: [{ type: "text", name: "first" }] });
    try {
      const survey = new SurveyModel({ elements: [
        { type: "boolean", name: "b1", valueTrue: "yes", valueFalse: "no" },
        { type: "dropdown", name: "d1", choices: [1, 2] },
        { type: "slider", name: "sl1", sliderType: "range" },
        { type: "rating", name: "ra1", rateValues: ["low", "high"] },
        { type: "signaturepad", name: "s1" },
        { type: "aiexgrade", name: "g1" },
        { type: "aiexname", name: "n1" },
        { type: "expression", name: "e1", expression: "1 + 1" },
        { type: "html", name: "h1" },
      ] });
      const names = ["b1", "d1", "sl1", "ra1", "s1", "g1", "n1", "e1", "h1"];
      expect(names.map(name => getExpressionValueType(<Question>survey.getQuestionByName(name))))
        .toEqual(["string", "number", "array", "string", "string", "number", "object", undefined, undefined]);
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
});

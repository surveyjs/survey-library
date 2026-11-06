import { describe, test, expect } from "vitest";
import { parseExpressionResponse } from "../../src/ai/expression-response";
import { ExpressionAIFeature } from "../../src/ai/expression-ai-feature";

describe("Parsing the AI answer (ai-expressions)", () => {
  test("the JSON the system prompt asks for", () => {
    expect(parseExpressionResponse("{\"expression\": \"{q1} = 1\", \"explanation\": \"Shows it when q1 is 1.\"}"))
      .toEqual({ expression: "{q1} = 1", explanation: "Shows it when q1 is 1." });
    expect(parseExpressionResponse("  {\"expression\": \"  {q1} = 1 \"}  ")).toEqual({ expression: "{q1} = 1" });
  });
  test("fenced JSON, and JSON with extra keys", () => {
    expect(parseExpressionResponse("```json\n{\"expression\": \"{q1} = 1\", \"explanation\": \"x\"}\n```"))
      .toEqual({ expression: "{q1} = 1", explanation: "x" });
    expect(parseExpressionResponse("{\"expression\": \"{q1} = 1\", \"confidence\": 0.9, \"notes\": [1]}"))
      .toEqual({ expression: "{q1} = 1" });
  });
  test("a fenced block holding only the expression", () => {
    expect(parseExpressionResponse("```\n{age} >= 18\n```")).toEqual({ expression: "{age} >= 18" });
    expect(parseExpressionResponse("```surveyjs\n{age} >= 18\n```")).toEqual({ expression: "{age} >= 18" });
    expect(parseExpressionResponse("```age({birthdate}) >= 18```")).toEqual({ expression: "age({birthdate}) >= 18" });
  });
  test("an answer inside prose: a JSON fence or a one-line fence", () => {
    expect(parseExpressionResponse("Here is the expression:\n```json\n{\"expression\": \"{age} >= 18\", \"explanation\": \"Adults only.\"}\n```"))
      .toEqual({ expression: "{age} >= 18", explanation: "Adults only." });
    expect(parseExpressionResponse("Try this:\n```\n{age} >= 18\n```\nIt checks the age.")).toEqual({ expression: "{age} >= 18" });
    // a multi-line block does not hide an Expression: line
    expect(parseExpressionResponse("Expression: {a} = 1\n```\nline one\nline two\n```")).toEqual({ expression: "{a} = 1" });
  });
  test("in prose, an Expression: line wins over other blocks, and a block that is no answer is skipped", () => {
    expect(parseExpressionResponse("Expression: {age} >= 18\nUse ```{age}``` to read the age.")).toEqual({ expression: "{age} >= 18" });
    const withContext = "Expression: {a} = 1\n\nThe context:\n```json\n{\"q1\": 1}\n```";
    expect(parseExpressionResponse(withContext)).toEqual({ expression: "{a} = 1" });
    expect(parseExpressionResponse("The values:\n```json\n{\"q1\": 1}\n```\nThe answer:\n```json\n{\"expression\": \"{q1} = 1\"}\n```"))
      .toEqual({ expression: "{q1} = 1" });
    // the session passes the first object it finds as data; one that is no answer leaves the text to read
    expect(new ExpressionAIFeature().parse({ q1: 1 }, withContext)).toEqual({ expression: "{a} = 1", explanation: "" });
  });
  test("a line starting with Expression:", () => {
    expect(parseExpressionResponse("Here it is.\nExpression: {age} >= 18\nIt checks the age.")).toEqual({ expression: "{age} >= 18" });
    expect(parseExpressionResponse("expression: `{age} >= 18`")).toEqual({ expression: "{age} >= 18" });
  });
  test("a bare one-line expression, taken as it is", () => {
    expect(parseExpressionResponse("{age} >= 18")).toEqual({ expression: "{age} >= 18" });
    // never repaired: the check judges it
    expect(parseExpressionResponse("{{age} >= 18}")).toEqual({ expression: "{{age} >= 18}" });
  });
  test("an empty expression keeps the explanation of why", () => {
    expect(parseExpressionResponse("{\"expression\": \"\", \"explanation\": \"The survey has no age question.\"}"))
      .toEqual({ expression: "", explanation: "The survey has no age question." });
  });
  test("anything else is an empty result", () => {
    expect(parseExpressionResponse("Sure! I can help with that.\nWhat should the condition check?")).toBeUndefined();
    expect(parseExpressionResponse("")).toBeUndefined();
    expect(parseExpressionResponse("   ")).toBeUndefined();
    expect(parseExpressionResponse(undefined)).toBeUndefined();
    expect(parseExpressionResponse("{\"expression\": \"\"}")).toBeUndefined();
    expect(parseExpressionResponse("{\"answer\": \"{q1} = 1\"}")).toBeUndefined();
    expect(parseExpressionResponse("```\nline one\nline two\n```")).toBeUndefined();
  });
});

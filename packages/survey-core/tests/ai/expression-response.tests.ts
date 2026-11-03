import { describe, test, expect } from "vitest";
import { parseExpressionResponse } from "../../src/ai/expression-response";

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

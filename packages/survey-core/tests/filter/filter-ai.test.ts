import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { analyzeFilterExpression } from "../../src/filter/filter-conditions";
import { readAIJson } from "../../src/ai/ai-response";
import {
  buildFilterAIContext, buildFilterAISystemPrompt, buildFilterAIInstruction, filterAIGuideExamples, filterAIMaxChoices,
  filterAIResponseFormat, FilterAIFeature, makeFilterAITitle
} from "../../src/filter/filter-ai";

// What the model is told about a Filter Control's fields, and how its answer is read and checked.
describe("buildFilterAIContext", () => {
  test("a field by the name the expression uses, its title, value type, editor, operators and choices", () => {
    const q = createFilter();
    const ctx = buildFilterAIContext(q);
    expect(ctx.fields.map((f) => f.name), "#1").toEqual(["name", "country", "age"]);
    expect(ctx.fields[1], "#2").toEqual({ name: "country", title: "country", valueType: q.getFieldByName("country").valueType,
      editor: q.getFieldEditorKind("country"), operators: q.getFieldOperators("country"),
      choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }, { value: "gb", text: "Great Britain" }] });
    expect(ctx.fields[1].valueType, "#3").toBe("string");
    expect(ctx.fields[0].choices, "#4: no choices to list").toBeUndefined();
    expect([ctx.truncated.choices, ctx.locales.survey, ctx.guideVersion], "#5").toEqual([false, "en", "1"]);
  });
  test("a field with more choices than are listed", () => {
    const choices = [];
    for (let i = 1; i <= filterAIMaxChoices + 1; i++) choices.push(i);
    const ctx = buildFilterAIContext(createFilter({ fields: [{ name: "n", fieldType: "dropdown", choices: choices }] }));
    expect([ctx.fields[0].choices.length, ctx.truncated.choices]).toEqual([filterAIMaxChoices, true]);
  });
});

describe("buildFilterAISystemPrompt", () => {
  test("the same context makes the same prompt, and the prompt holds the context", () => {
    const ctx = buildFilterAIContext(createFilter());
    const prompt = buildFilterAISystemPrompt(ctx);
    expect(buildFilterAISystemPrompt(ctx), "#1").toBe(prompt);
    expect(prompt.indexOf(JSON.stringify(ctx, null, 2)) > -1, "#2").toBe(true);
  });
  test("every guide example is what it says it is", () => {
    const fields = createFilter({ fields: [{ name: "name" },
      { name: "country", fieldType: "dropdown", choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] },
      { name: "price", fieldType: "text", inputType: "number" }, { name: "discontinued", fieldType: "boolean" }] }).getFilterFields();
    expect(filterAIGuideExamples.some((e) => e.isValid) && filterAIGuideExamples.some((e) => !e.isValid), "#0").toBe(true);
    filterAIGuideExamples.forEach((e) => {
      expect("conditions" in analyzeFilterExpression(e.expression, fields), e.expression).toBe(e.isValid);
    });
  });
});

describe("buildFilterAIInstruction", () => {
  test("modify names the current filter and the new description", () => {
    const text = buildFilterAIInstruction("modify", "only Germany", "{age} > 18");
    expect([text.indexOf("only Germany") > -1, text.indexOf("{age} > 18") > -1]).toEqual([true, true]);
  });
  test("fix names the rejected expression and its problems", () => {
    const text = buildFilterAIInstruction("fix", "", "{price} > 1", [{ severity: "error", message: "There is no field \"price\"." }]);
    expect([text.indexOf("{price} > 1") > -1, text.indexOf("There is no field \"price\".") > -1]).toEqual([true, true]);
  });
});

describe("FilterAIFeature", () => {
  const q = createFilter();
  const feature = new FilterAIFeature(() => q.getFilterFields());
  const answer = (expression: string) => ({ expression: expression, title: "", explanation: "" });
  test("the response format", () => {
    expect(feature.responseFormat, "#1").toBe(filterAIResponseFormat);
    expect(filterAIResponseFormat.name, "#2").toBe("survey_filter");
    expect(filterAIResponseFormat.schema.required, "#3").toEqual(["expression", "title", "explanation"]);
    expect(filterAIResponseFormat.schema.additionalProperties, "#4").toBe(false);
  });
  test("parse: the structured answer, trimmed", () => {
    expect(feature.parse({ expression: " {age} > 18 ", title: " Adults ", explanation: "x" }, undefined))
      .toEqual({ expression: "{age} > 18", title: "Adults", explanation: "x" });
  });
  test("parse: plain text, and nothing usable", () => {
    expect(feature.parse(undefined, "Expression: {age} > 18"), "#1").toEqual({ expression: "{age} > 18", title: "", explanation: "" });
    const empty = feature.parse(undefined, "");
    expect([empty, feature.isEmpty(empty)], "#2").toEqual([{ expression: "", title: "", explanation: "" }, true]);
  });
  test("parse: the title comes from the object the expression came from", () => {
    const json = "{\"expression\":\"{age} > 18\",\"title\":\"Adults\"}";
    expect(feature.parse({ foo: 1 }, json), "#1: data that is no answer").toEqual({ expression: "{age} > 18", title: "Adults", explanation: "" });
    const prose = "Example:\n```json\n{\"foo\":1}\n```\nAnswer:\n```json\n" + json + "\n```";
    expect(feature.parse(readAIJson(prose), prose), "#2: an example block before the answer's")
      .toEqual({ expression: "{age} > 18", title: "Adults", explanation: "" });
    expect(feature.parse(undefined, json).title, "#3: the whole text").toBe("Adults");
  });
  test("validate: conditions the control can show have no problems", () => {
    expect(feature.validate(answer("{age} > 18 and {country} anyof ['de', 'fr']"), "generate")).toEqual([]);
  });
  test("validate: what does not decompose", () => {
    const issues = feature.validate(answer("{age} > 1 or {age} < 5"), "generate");
    expect(issues.map((i) => [i.code, i.severity])).toEqual([["filter:not-and", "error"]]);
  });
  test("validate: a field named in the message", () => {
    const issues = feature.validate(answer("{price} > 1"), "generate");
    expect([issues.length, issues[0].code, issues[0].message.indexOf("price") > -1]).toEqual([1, "filter:unknown-field", true]);
  });
  test("validate: a choice compared by its text", () => {
    const issues = feature.validate(answer("{country} = 'Germany'"), "generate");
    expect(issues.map((i) => i.code), "#1").toEqual(["filter:choice"]);
    expect([issues[0].message.indexOf("country") > -1, issues[0].message.indexOf("'de'") > -1], "#2").toEqual([true, true]);
    expect(feature.validate(answer("{country} anyof ['de', 'Italy']"), "generate").map((i) => i.code), "#3").toEqual(["filter:choice"]);
  });
  test("validate: a choice issue quotes the values as the expression writes them", () => {
    const fq = createFilter({ fields: [{ name: "brand", fieldType: "dropdown", choices: ["Macy's", "Gap"] }] });
    const f = new FilterAIFeature(() => fq.getFilterFields());
    const issues = f.validate(answer("{brand} = 'Levi\\'s'"), "generate");
    expect(issues.map((i) => i.code), "#1").toEqual(["filter:choice"]);
    expect([issues[0].message.indexOf("'Levi\\'s' is not") === 0, issues[0].message.indexOf("'Macy\\'s', 'Gap'") > -1], "#2")
      .toEqual([true, true]);
  });
  test("validate: no value where the operator needs one", () => {
    expect(feature.validate(answer("{age} > ''"), "generate").map((i) => i.code)).toEqual(["filter:value"]);
  });
  test("validate: an empty answer has no problems", () => {
    expect(feature.validate(answer(""), "generate")).toEqual([]);
  });
  test("serialize and the fix instruction", () => {
    expect(feature.serialize({ expression: "{age} > 18", title: "Adults", explanation: "" }), "#1")
      .toBe(JSON.stringify({ expression: "{age} > 18", title: "Adults", explanation: "" }));
    const text = feature.buildFixInstruction(answer("{price} > 1"), feature.validate(answer("{price} > 1"), "generate"));
    expect(text.indexOf("{price} > 1") > -1, "#2").toBe(true);
  });
});

describe("makeFilterAITitle", () => {
  test("the model's title, cut to a preset's length", () => {
    expect(makeFilterAITitle("A very long title that is longer than allowed", [], [])).toBe("A very long title that is longer");
  });
  test("the fields' titles when the model gave none", () => {
    expect(makeFilterAITitle("", ["Country", "Age"], [])).toBe("Country, Age");
  });
  test("a taken title gets a number, still within the length", () => {
    expect(makeFilterAITitle("Adults", [], ["adults"]), "#1").toBe("Adults 2");
    expect(makeFilterAITitle("Adults", [], ["Adults", "Adults 2"]), "#2").toBe("Adults 3");
    const long = "x".repeat(32);
    const res = makeFilterAITitle(long, [], [long]);
    expect([res.length, res.substring(res.length - 2)], "#3").toEqual([32, " 2"]);
  });
});

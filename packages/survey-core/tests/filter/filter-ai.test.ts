import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { analyzeFilterExpression } from "../../src/filter/filter-conditions";
import { readAIJson } from "../../src/ai/ai-response";
import {
  buildFilterAIContext, buildFilterAISystemPrompt, buildFilterAIInstruction, filterAIGuideExamples, filterAIMaxChoices,
  filterAIResponseFormat, FilterAIFeature, FilterAIResult, makeFilterAITitle
} from "../../src/filter/filter-ai";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import "../../src/question_matrixdynamic";
import "../../src/question_matrixdropdown";
import "../../src/question_paneldynamic";
import "../../src/question_boolean";

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
    expect([ctx.truncated.choices, ctx.locales.survey, ctx.guideVersion], "#5").toEqual([false, "en", "3"]);
  });
  test("a field with more choices than are listed", () => {
    const choices = [];
    for (let i = 1; i <= filterAIMaxChoices + 1; i++) choices.push(i);
    const ctx = buildFilterAIContext(createFilter({ fields: [{ name: "n", fieldType: "dropdown", choices: choices }] }));
    expect([ctx.fields[0].choices.length, ctx.truncated.choices]).toEqual([filterAIMaxChoices, true]);
  });
});

// The list a control with a target filters: what the model is told about it besides the fields - the
// expression runs over the whole record, so a value that is no field can be read by a text-form filter.
function bound(target: any, fields?: Array<any>): QuestionFilterModel {
  const filter: any = { type: "filter", name: "f1", targetQuestion: target.name };
  if (!!fields) filter.fields = fields;
  const survey = new SurveyModel({ elements: [target, filter] });
  return <QuestionFilterModel>survey.getQuestionByName("f1");
}
const orders = {
  type: "matrixdynamic", name: "orders", title: "Orders",
  columns: [
    { name: "country", title: "Country", cellType: "dropdown", choices: [{ value: "de", text: "Germany" }] },
    { name: "notes", title: "Notes", cellType: "text" },
    { name: "code", cellType: "text", visible: false }
  ],
  detailPanelMode: "underRow",
  detailElements: [{ type: "boolean", name: "urgent", title: "Urgent" }]
};
describe("buildFilterAIContext: the list", () => {
  test("a dynamic matrix: its type, name and title, and the values of a row that are no fields - a hidden column and the detail panel's too", () => {
    const ctx = buildFilterAIContext(bound(orders, [{ name: "country" }]));
    expect(ctx.fields.map((f) => f.name), "#1").toEqual(["country"]);
    expect(ctx.list, "#2").toEqual({ type: "matrixdynamic", name: "orders", title: "Orders", otherValues: [
      { name: "notes", title: "Notes", valueType: "string" },
      { name: "code", title: "code", valueType: "string" },
      { name: "urgent", title: "Urgent", valueType: "boolean", choices: [{ value: true, text: "Yes" }, { value: false, text: "No" }] }] });
  });
  test("with no fields entries the fields are the visible ones, and the other values the hidden ones", () => {
    const ctx = buildFilterAIContext(bound(orders));
    expect(ctx.fields.map((f) => f.name), "#1").toEqual(["country", "notes", "urgent"]);
    expect(ctx.list.otherValues.map((v) => v.name), "#2").toEqual(["code"]);
  });
  test("a matrix with fixed rows lists its rows", () => {
    const ctx = buildFilterAIContext(bound({ type: "matrixdropdown", name: "supplies", title: "Supplies",
      rows: [{ value: "pens", text: "Pens" }, "paper"], columns: [{ name: "price", cellType: "text", inputType: "number" }] }));
    expect(ctx.list, "#1").toEqual({ type: "matrixdropdown", name: "supplies", title: "Supplies",
      rows: [{ value: "pens", text: "Pens" }, { value: "paper", text: "paper" }], otherValues: [] });
    expect(ctx.truncated.rows, "#2").toBe(false);
  });
  test("a matrix with more rows than are listed", () => {
    const rows: Array<string> = [];
    for (let i = 1; i <= filterAIMaxChoices + 1; i++) rows.push("r" + i);
    const ctx = buildFilterAIContext(bound({ type: "matrixdropdown", name: "m", rows: rows, columns: [{ name: "a" }] }));
    expect([ctx.list.rows.length, ctx.truncated.rows]).toEqual([filterAIMaxChoices, true]);
  });
  test("a dynamic panel: the questions of its template", () => {
    const ctx = buildFilterAIContext(bound({ type: "paneldynamic", name: "kids", title: "Kids",
      templateElements: [{ type: "text", name: "kidName" }, { type: "text", name: "age", inputType: "number" }] }, [{ name: "age" }]));
    expect(ctx.list).toEqual({ type: "paneldynamic", name: "kids", title: "Kids", otherValues: [{ name: "kidName", title: "kidName", valueType: "string" }] });
  });
  test("a control with no target has no list", () => {
    const ctx = buildFilterAIContext(createFilter());
    expect(["list" in ctx, ctx.truncated.rows]).toEqual([false, false]);
  });
  test("a text-form filter on a value that is no field filters the rows by it", () => {
    const q = bound(orders, [{ name: "country" }]);
    const matrix: any = q.survey.getQuestionByName("orders");
    matrix.value = [{ country: "de", notes: "call first" }, { country: "de", notes: "express" }, { country: "de", notes: "call back" }];
    (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, o: any): void => {
      o.callback({ data: { expression: "{notes} contains 'call'", title: "Calls", explanation: "" } });
    });
    const results: Array<FilterAIResult> = [];
    q.createAIRequest().generate("orders to call", (res: FilterAIResult): void => { results.push(res); });
    expect(results, "#1").toEqual([{ status: "expression", expression: "{notes} contains 'call'", title: "Calls" }]);
    q.applyFilter("{notes} contains 'call'");
    expect(matrix.visibleRows.length, "#2").toBe(2);
  });
});

describe("buildFilterAISystemPrompt: the list", () => {
  test("names the list and what a record is, and lets a text-form filter read the other values", () => {
    const prompt = buildFilterAISystemPrompt(buildFilterAIContext(bound(orders, [{ name: "country" }])));
    expect([prompt.indexOf("\n## The list\n") > -1, prompt.indexOf("each row of the dynamic matrix \"Orders\"") > -1,
      prompt.indexOf("may also read the names under \"list.otherValues\"") > -1], "#1").toEqual([true, true, true]);
    expect(prompt.indexOf("{rowValue}"), "#2: no rows").toBe(-1);
  });
  test("a matrix with fixed rows: {rowValue} and {rowTitle}; a dynamic panel: each panel", () => {
    const rowsPrompt = buildFilterAISystemPrompt(buildFilterAIContext(bound({ type: "matrixdropdown", name: "s", title: "Supplies",
      rows: ["pens"], columns: [{ name: "price" }] })));
    expect([rowsPrompt.indexOf("each row of the matrix \"Supplies\"") > -1,
      rowsPrompt.indexOf("{rowValue} is a row's value and {rowTitle} its text") > -1], "#1").toEqual([true, true]);
    const panelPrompt = buildFilterAISystemPrompt(buildFilterAIContext(bound({ type: "paneldynamic", name: "kids", title: "Kids",
      templateElements: [{ type: "text", name: "age" }] })));
    expect(panelPrompt.indexOf("each panel of the dynamic panel \"Kids\"") > -1, "#2").toBe(true);
  });
  test("no list, no section: the names are the fields' only", () => {
    const prompt = buildFilterAISystemPrompt(buildFilterAIContext(createFilter()));
    expect([prompt.indexOf("\n## The list\n") > -1, prompt.indexOf("list.otherValues") > -1,
      prompt.indexOf("Use only the names listed under \"fields\"") > -1]).toEqual([false, false, true]);
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
  test("validate: a filter that does not decompose has no problems - it is kept as text; one that does not parse is an error", () => {
    expect(feature.validate(answer("{age} > 1 or {age} < 5"), "generate"), "#1").toEqual([]);
    expect(feature.validate(answer("{age} >"), "generate").map((i) => [i.code, i.severity]), "#2").toEqual([["filter:syntax", "error"]]);
  });
  test("validate: a name the control has no field for is no problem either: the text is kept as written", () => {
    expect(feature.validate(answer("{price} > 1"), "generate")).toEqual([]);
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
    const broken = answer("{age} >");
    const text = feature.buildFixInstruction(broken, feature.validate(broken, "generate"));
    expect([text.indexOf("{age} >") > -1, text.indexOf("not a valid SurveyJS expression") > -1], "#2").toEqual([true, true]);
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

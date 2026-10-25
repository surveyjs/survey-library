// @vitest-environment node
// Input masks and the regional format. A mask shows one text and stores another: "01.05.2024" in
// a de-DE date input is stored as "2024-05-01", "1.234,5" in a numeric input as 1234.5. The
// description and the schema say what is stored, and a write is accepted only when the value
// survives the mask unchanged, so nothing is reformatted or guessed across locales.
import { createInterview, describeQuestion, InterviewErrorCodes } from "survey-core/interview";

import { SurveyModel } from "survey-core";

import { describe, expect, test } from "vitest";

const de = { locale: "de-DE" };
// The de-DE currency texts; the symbol is built from its code, as the linter allows no literal of it.
const EUR = String.fromCharCode(0x20ac);
const EUR_SHOWN = "1.234,5 " + EUR;
const EUR_TRAILING = "1.234,50 " + EUR;

function maskOf(json: any, name: string): any {
  const survey = new SurveyModel(json);
  const constraints = describeQuestion(survey.getQuestionByName(name)).constraints;
  return !!constraints ? constraints.mask : undefined;
}

async function propertyOf(json: any, name: string): Promise<any> {
  return (await createInterview(json)).getAnswerSchema().properties[name];
}

const deJson = {
  regionalFormat: de,
  elements: [
    { type: "text", name: "d", maskType: "datetime", maskSettings: { patternPreset: "localeDate" } },
    { type: "text", name: "dt", maskType: "datetime", maskSettings: { patternPreset: "localeDateTime" } },
    { type: "text", name: "t", maskType: "datetime", maskSettings: { patternPreset: "localeTime" } },
    { type: "text", name: "ym", maskType: "datetime", maskSettings: { pattern: "mm/yyyy" } },
    { type: "text", name: "ts", maskType: "datetime", maskSettings: { pattern: "HH:MM:ss" } },
    { type: "text", name: "y", maskType: "datetime", maskSettings: { pattern: "yyyy" } },
    { type: "text", name: "md", maskType: "datetime", maskSettings: { pattern: "mm/dd" } },
    { type: "text", name: "ds", maskType: "datetime", maskSettings: { patternPreset: "localeDate", saveMaskedValue: true } },
    { type: "text", name: "db", maskType: "datetime",
      maskSettings: { patternPreset: "localeDate", min: "2024-01-01", max: "2024-12-31" } },
    { type: "text", name: "n", maskType: "numeric" },
    { type: "text", name: "nb", maskType: "numeric", maskSettings: { min: 0, max: 100 } },
    { type: "text", name: "pos", maskType: "numeric", maskSettings: { allowNegativeValues: false } },
    { type: "text", name: "c", maskType: "currency" },
    { type: "text", name: "cs", maskType: "currency", maskSettings: { saveMaskedValue: true } },
    { type: "text", name: "chf", maskType: "currency",
      maskSettings: { currencySymbol: "CHF", decimalSeparator: ".", thousandsSeparator: "'" } },
  ],
};

const enJson = {
  elements: [
    { type: "text", name: "d", maskType: "datetime", maskSettings: { patternPreset: "localeDate" } },
    { type: "text", name: "n", maskType: "numeric" },
    { type: "text", name: "cs", maskType: "currency", maskSettings: { saveMaskedValue: true } },
  ],
};

// Each refused value and a value of the same input that is accepted and stored as sent.
const writeCases: Array<{ locale: string, json: any, name: string, value: any, good: any }> = [
  { locale: "de-DE", json: deJson, name: "d", value: "01.05.2024", good: "2024-05-01" },
  { locale: "de-DE", json: deJson, name: "d", value: "2024-05-01T10:30", good: "2024-05-01" },
  { locale: "de-DE", json: deJson, name: "dt", value: "2024-05-01T10:30:00", good: "2024-05-01T10:30" },
  { locale: "de-DE", json: deJson, name: "t", value: "10:30:15", good: "10:30" },
  { locale: "de-DE", json: deJson, name: "ym", value: "05/2024", good: "2024-05" },
  { locale: "de-DE", json: deJson, name: "ts", value: "10:30", good: "10:30:15" },
  { locale: "de-DE", json: deJson, name: "y", value: "24", good: "2024" },
  { locale: "de-DE", json: deJson, name: "ds", value: "1.5.2024", good: "01.05.2024" },
  { locale: "de-DE", json: deJson, name: "db", value: "2025-05-01", good: "2024-05-01" },
  { locale: "de-DE", json: deJson, name: "db", value: "2023-12-31", good: "2024-12-31" },
  { locale: "de-DE", json: deJson, name: "n", value: "1.234,5", good: 1234.5 },
  { locale: "de-DE", json: deJson, name: "n", value: "1234.5", good: 1234.5 },
  { locale: "de-DE", json: deJson, name: "n", value: 1.005, good: 1.25 },
  { locale: "de-DE", json: deJson, name: "nb", value: 150, good: 50 },
  { locale: "de-DE", json: deJson, name: "nb", value: -1, good: 0 },
  { locale: "de-DE", json: deJson, name: "pos", value: -5, good: 5 },
  { locale: "de-DE", json: deJson, name: "c", value: EUR_TRAILING, good: 1234.5 },
  { locale: "de-DE", json: deJson, name: "cs", value: EUR_TRAILING, good: EUR_SHOWN },
  { locale: "de-DE", json: deJson, name: "cs", value: 1.005, good: EUR_SHOWN },
  { locale: "de-DE", json: deJson, name: "chf", value: "1'234.5 CHF", good: 1234.5 },
  { locale: "en", json: enJson, name: "d", value: "05/01/2024", good: "2024-05-01" },
  { locale: "en", json: enJson, name: "n", value: "1,234.5", good: 1234.5 },
  { locale: "en", json: enJson, name: "cs", value: EUR_SHOWN, good: "$1,234.5" },
];

describe("interview input masks and the regional format (issue #11818)", () => {
  test("A datetime mask is described with its display pattern and the shape it stores", () => {
    expect(maskOf(deJson, "d")).toEqual({ type: "datetime", pattern: "dd.mm.yyyy", valueFormat: "YYYY-MM-DD" });
    expect(maskOf(deJson, "dt")).toEqual({ type: "datetime", pattern: "dd.mm.yyyy HH:MM", valueFormat: "YYYY-MM-DDTHH:mm" });
    expect(maskOf(deJson, "t")).toEqual({ type: "datetime", pattern: "HH:MM", valueFormat: "HH:mm" });
    expect(maskOf(deJson, "ym")).toEqual({ type: "datetime", pattern: "mm/yyyy", valueFormat: "YYYY-MM" });
    expect(maskOf(deJson, "ts")).toEqual({ type: "datetime", pattern: "HH:MM:ss", valueFormat: "HH:mm:ss" });
    expect(maskOf(deJson, "y")).toEqual({ type: "datetime", pattern: "yyyy", valueFormat: "YYYY" });
    // A pattern without a year stores nothing the model can read back: no value format.
    expect(maskOf(deJson, "md")).toEqual({ type: "datetime", pattern: "mm/dd" });
    expect(maskOf(deJson, "ds")).toEqual({ type: "datetime", pattern: "dd.mm.yyyy", valueFormat: "YYYY-MM-DD",
      saveMaskedValue: true });
    expect(maskOf(deJson, "db")).toEqual({ type: "datetime", pattern: "dd.mm.yyyy", valueFormat: "YYYY-MM-DD",
      min: "2024-01-01", max: "2024-12-31" });
    expect(maskOf(enJson, "d")).toEqual({ type: "datetime", pattern: "mm/dd/yyyy", valueFormat: "YYYY-MM-DD" });
  });

  test("A numeric or currency mask is described with the separators, symbol and pattern it resolved", () => {
    expect(maskOf(deJson, "n")).toEqual({ type: "numeric", decimalSeparator: ",", thousandsSeparator: ".", precision: 2,
      example: "1.234,5" });
    // 1234.5 is out of the mask's range, so the input has no rendering of it to show.
    expect(maskOf(deJson, "nb")).toEqual({ type: "numeric", decimalSeparator: ",", thousandsSeparator: ".", precision: 2,
      min: 0, max: 100 });
    expect(maskOf(deJson, "pos")).toEqual({ type: "numeric", decimalSeparator: ",", thousandsSeparator: ".", precision: 2,
      allowNegativeValues: false, example: "1.234,5" });
    expect(maskOf(deJson, "c")).toEqual({ type: "currency", decimalSeparator: ",", thousandsSeparator: ".", precision: 2,
      currencySymbol: EUR, currencyPattern: "# @", example: EUR_SHOWN });
    expect(maskOf(deJson, "cs")).toEqual({ type: "currency", decimalSeparator: ",", thousandsSeparator: ".", precision: 2,
      currencySymbol: EUR, currencyPattern: "# @", example: EUR_SHOWN, saveMaskedValue: true });
    // maskSettings outrank the regional format; the de-DE currency pattern stays.
    expect(maskOf(deJson, "chf")).toEqual({ type: "currency", decimalSeparator: ".", thousandsSeparator: "'", precision: 2,
      currencySymbol: "CHF", currencyPattern: "# @", example: "1'234.5 CHF" });
    expect(maskOf(enJson, "n")).toEqual({ type: "numeric", decimalSeparator: ".", thousandsSeparator: ",", precision: 2,
      example: "1,234.5" });
  });

  test("A mask the input type does not use is not described", () => {
    const json = { elements: [
      { type: "text", name: "q", inputType: "date", maskType: "datetime", maskSettings: { pattern: "mm/dd/yyyy" } },
    ] };
    expect(maskOf(json, "q")).toBeUndefined();
  });

  test("The schema takes the stored value of each mask type", async () => {
    expect(await propertyOf(deJson, "d")).toEqual({ title: "d", type: "string",
      description: "YYYY-MM-DD (shown as dd.mm.yyyy)" });
    expect(await propertyOf(deJson, "ds")).toEqual({ title: "ds", type: "string", description: "dd.mm.yyyy" });
    expect(await propertyOf(deJson, "db")).toEqual({ title: "db", type: "string",
      description: "YYYY-MM-DD (shown as dd.mm.yyyy), min 2024-01-01, max 2024-12-31" });
    expect(await propertyOf(deJson, "md")).toEqual({ title: "md", type: "string", description: "mask datetime mm/dd" });
    expect(await propertyOf(deJson, "n")).toEqual({ title: "n", type: "number",
      description: "numeric, shown as 1.234,5 (decimal \",\", thousands \".\")" });
    expect(await propertyOf(deJson, "nb")).toEqual({ title: "nb", type: "number", minimum: 0, maximum: 100,
      description: "numeric (decimal \",\", thousands \".\")" });
    expect(await propertyOf(deJson, "cs")).toEqual({ title: "cs", anyOf: [{ type: "number" }, { type: "string" }],
      description: "currency, as " + EUR_SHOWN + " (decimal \",\", thousands \".\")" });
    expect(await propertyOf(deJson, "chf")).toEqual({ title: "chf", type: "number",
      description: "currency, shown as 1'234.5 CHF (decimal \".\", thousands \"'\")" });
    expect(await propertyOf(enJson, "d")).toEqual({ title: "d", type: "string",
      description: "YYYY-MM-DD (shown as mm/dd/yyyy)" });
  });

  test("The bounds of a mask that saves its text stay in the number branch", async () => {
    const json = { regionalFormat: de, elements: [
      { type: "text", name: "q", maskType: "numeric", maskSettings: { saveMaskedValue: true, min: 0, max: 100 } },
    ] };
    expect((await propertyOf(json, "q")).anyOf).toEqual([{ type: "number", minimum: 0, maximum: 100 }, { type: "string" }]);
  });

  test("A field whose schema is a union is nullable without a nested anyOf, also when two descriptions merge", async () => {
    const fields = await createInterview({ regionalFormat: de, elements: [
      { type: "multipletext", name: "mt", items: [
        { name: "a", maskType: "currency", maskSettings: { saveMaskedValue: true } },
      ] },
    ] });
    expect(fields.getAnswerSchema().properties.mt.properties.a.anyOf)
      .toEqual([{ type: "number" }, { type: "string" }, { type: "null" }]);
    const entries = await createInterview({ regionalFormat: de, elements: [
      { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [
        { type: "text", name: "a", maskType: "currency", maskSettings: { saveMaskedValue: true } },
        { type: "text", name: "b", isRequired: true },
      ] },
    ] });
    // "b" stays unanswered, so the container is still asked for and in the schema.
    await entries.answerAll({ pd: [{ a: 1234.5 }] });
    // The template and the entry describe "a" twice; the union keeps the anyOf.
    expect(entries.getAnswerSchema().properties.pd.items.anyOf[0].properties.a.anyOf)
      .toEqual([{ type: "number" }, { type: "string" }, { type: "null" }]);
  });

  test.each(writeCases)("Single mode ($locale) refuses $value for $name and accepts $good", async (item) => {
    const iv = await createInterview(item.json);
    const res = await iv.answer(item.name, item.value);
    expect(res.errors.map(error => error.name + ":" + error.code)).toEqual([item.name + ":" + InterviewErrorCodes.badFormat]);
    expect(iv.data, "nothing is written").toEqual({});
    const good = await iv.answer(item.name, item.good);
    expect(good.errors).toEqual([]);
    expect(iv.data).toEqual({ [item.name]: item.good });
  });

  test.each(writeCases)("Batch mode ($locale) refuses $value for $name and accepts $good", async (item) => {
    const iv = await createInterview(item.json);
    const res = await iv.answerAll({ [item.name]: item.value });
    expect(res.errors.map(error => error.name + ":" + error.code)).toEqual([item.name + ":" + InterviewErrorCodes.badFormat]);
    expect(iv.data, "nothing is written").toEqual({});
    const good = await iv.answerAll({ [item.name]: item.good });
    expect(good.errors).toEqual([]);
    expect(iv.data).toEqual({ [item.name]: item.good });
  });

  test("With saveMaskedValue a number or an ISO value is stored as the mask formats it", async () => {
    const iv = await createInterview(deJson);
    expect((await iv.answerAll({ cs: 1234.5, ds: "2024-05-01" })).errors).toEqual([]);
    const survey: SurveyModel = (iv as any).survey;
    expect(iv.data.cs).toBe(survey.getQuestionByName("cs").maskInstance.getMaskedValue(1234.5));
    expect(iv.data).toEqual({ cs: EUR_SHOWN, ds: "01.05.2024" });
  });

  test("A multiple text item and a matrix cell are checked like a question", async () => {
    const json = { regionalFormat: de, elements: [
      { type: "multipletext", name: "mt", items: [{ name: "a", maskType: "currency" }] },
      { type: "matrixdropdown", name: "grid", rows: ["r1"], columns: [
        { name: "c1", cellType: "text", maskType: "numeric" },
      ] },
    ] };
    const iv = await createInterview(json);
    const res = await iv.answerAll({ mt: { a: EUR_TRAILING }, grid: { r1: { c1: "1.234,5" } } });
    expect(res.errors.map(error => error.name + ":" + error.code)).toEqual([
      "mt.a:" + InterviewErrorCodes.badFormat,
      "grid.r1.c1:" + InterviewErrorCodes.badFormat,
    ]);
    expect(iv.data).toEqual({});
    expect((await iv.answerAll({ mt: { a: 1234.5 }, grid: { r1: { c1: 1234.5 } } })).errors).toEqual([]);
    expect(iv.data).toEqual({ mt: { a: 1234.5 }, grid: { r1: { c1: 1234.5 } } });

    const single = await createInterview(json);
    expect((await single.answer("mt.a", EUR_TRAILING)).errors.map(error => error.code))
      .toEqual([InterviewErrorCodes.badFormat]);
    expect((await single.answer("mt.a", 1234.5)).errors).toEqual([]);
  });

  test("The messages name the stored shape, the display and the bounds", async () => {
    const iv = await createInterview(deJson);
    const res = await iv.answerAll({ d: "01.05.2024", n: "1.234,5", nb: 150, cs: EUR_TRAILING, db: "2025-05-01" });
    const byName: { [name: string]: string } = {};
    res.errors.forEach(error => byName[error.name] = error.message);
    expect(byName.d).toContain("YYYY-MM-DD");
    expect(byName.d).toContain("dd.mm.yyyy");
    expect(byName.n).toContain("a number");
    expect(byName.n).toContain("1.234,5");
    expect(byName.nb).toContain("from 0 to 100");
    expect(byName.cs, "what the input would store").toContain(JSON.stringify(EUR_SHOWN));
    expect(byName.db).toContain("2024-12-31");
  });

  test("A change of the regional format changes the next description and what is accepted", async () => {
    const survey = new SurveyModel(enJson);
    const iv = await createInterview(survey);
    expect(iv.describeAll()).toContain("mm/dd/yyyy");
    expect((await iv.answerAll({ cs: "$1,234.5" })).errors).toEqual([]);
    survey.regionalFormat.locale = "de-DE";
    expect(iv.describeAll()).toContain("dd.mm.yyyy");
    expect((await iv.answerAll({ cs: "$1,234.5" })).errors.map(error => error.code)).toEqual([InterviewErrorCodes.badFormat]);
    expect((await iv.answerAll({ cs: EUR_SHOWN })).errors).toEqual([]);
    expect(iv.data.cs).toBe(EUR_SHOWN);
  });
});

// @vitest-environment node
// The checks on write that a rendered input makes by itself: a respondent cannot type past
// maxLength, type "tomorrow" into a date picker, fill a pattern mask with letters, or tick more
// boxes than maxSelectedChoices allows. A text consumer has none of those inputs, so the interview
// refuses the same values before they reach the model.
import { createInterview, describeQuestion, InterviewErrorCodes } from "survey-core/interview";
import type { IInterview } from "survey-core/interview";

import { SurveyModel } from "survey-core";

import { describe, expect, test } from "vitest";

const json = {
  elements: [
    { type: "text", name: "d", inputType: "date", min: "2020-01-01" },
    { type: "text", name: "t", inputType: "time" },
    { type: "text", name: "dt", inputType: "datetime-local" },
    { type: "text", name: "m", inputType: "month" },
    { type: "text", name: "w", inputType: "week" },
    { type: "text", name: "short", maxLength: 3 },
    { type: "comment", name: "note", maxLength: 3 },
    { type: "text", name: "code", maskType: "pattern", maskSettings: { pattern: "999" } },
    { type: "checkbox", name: "pick", choices: ["a", "b", "c"], maxSelectedChoices: 1 },
  ],
};

// Each refused value, the code it gets, and a value of the same input that is accepted.
const cases: Array<{ name: string, value: any, code: string, good: any }> = [
  { name: "d", value: "tomorrow", code: InterviewErrorCodes.badFormat, good: "2024-05-01" },
  { name: "d", value: "2024-13-45", code: InterviewErrorCodes.badFormat, good: "2024-05-01" },
  { name: "t", value: "25:00", code: InterviewErrorCodes.badFormat, good: "09:30" },
  { name: "dt", value: "2024-05-01", code: InterviewErrorCodes.badFormat, good: "2024-05-01T09:30" },
  { name: "m", value: "May 2024", code: InterviewErrorCodes.badFormat, good: "2024-05" },
  { name: "w", value: "2024-5", code: InterviewErrorCodes.badFormat, good: "2024-W18" },
  { name: "short", value: "abcdef", code: InterviewErrorCodes.tooLong, good: "abc" },
  { name: "note", value: "abcdef", code: InterviewErrorCodes.tooLong, good: "abc" },
  { name: "code", value: "abc", code: InterviewErrorCodes.badFormat, good: "123" },
  { name: "code", value: "12", code: InterviewErrorCodes.badFormat, good: "123" },
  { name: "pick", value: ["a", "b"], code: InterviewErrorCodes.tooManyChoices, good: ["a"] },
];

describe("interview checks on write (issue #11818)", () => {
  test.each(cases)("Single mode refuses $value for $name with $code", async (item) => {
    const iv = await createInterview(json);
    const res = await iv.answer(item.name, item.value);
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(item.code);
    expect(res.errors[0].name).toBe(item.name);
    expect(iv.data, "nothing is written").toEqual({});
    const good = await iv.answer(item.name, item.good);
    expect(good.errors).toEqual([]);
    expect(iv.data).toEqual({ [item.name]: item.good });
  });

  test.each(cases)("Batch mode refuses $value for $name with $code", async (item) => {
    const iv = await createInterview(json);
    const res = await iv.answerAll({ [item.name]: item.value });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(item.code);
    expect(res.errors[0].name).toBe(item.name);
    expect(iv.data, "nothing is written").toEqual({});
    const good = await iv.answerAll({ [item.name]: item.good });
    expect(good.errors).toEqual([]);
    expect(iv.data).toEqual({ [item.name]: item.good });
  });

  test("A field is checked like a question: multiple text items and matrix cells", async () => {
    const iv = await createInterview({
      elements: [
        { type: "multipletext", name: "mt", items: [
          { name: "zip", maskType: "pattern", maskSettings: { pattern: "99999" } },
          { name: "born", inputType: "date" },
          { name: "nick", maxLength: 2 },
        ] },
        { type: "matrixdropdown", name: "grid", rows: ["r1"], columns: [
          { name: "c1", cellType: "text", inputType: "time" },
          { name: "c2", cellType: "checkbox", choices: ["x", "y"], maxSelectedChoices: 1 },
        ] },
      ],
    });
    const res = await iv.answerAll({
      mt: { zip: "1234a", born: "yesterday", nick: "abc" },
      grid: { r1: { c1: "noon", c2: ["x", "y"] } },
    });
    expect(res.errors.map(error => error.name + ":" + error.code)).toEqual([
      "mt.zip:" + InterviewErrorCodes.badFormat,
      "mt.born:" + InterviewErrorCodes.badFormat,
      "mt.nick:" + InterviewErrorCodes.tooLong,
      "grid.r1.c1:" + InterviewErrorCodes.badFormat,
      "grid.r1.c2:" + InterviewErrorCodes.tooManyChoices,
    ]);
    expect(iv.data).toEqual({});
  });

  test("Single mode checks a nested input of a multiple text", async () => {
    const iv = await createInterview({
      elements: [{ type: "multipletext", name: "mt", items: [{ name: "nick", maxLength: 2 }] }],
    });
    const res = await iv.answer("mt.nick", "abc");
    expect(res.errors.map(error => error.code)).toEqual([InterviewErrorCodes.tooLong]);
    expect(iv.data).toEqual({});
  });

  test("A well-formed date out of bounds is the model's error, not a format error", async () => {
    const iv = await createInterview(json);
    const res = await iv.answerAll({ d: "2019-01-01" });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].name).toBe("d");
    expect(res.errors[0].code, "the model's own validation error carries no code").toBeUndefined();
    expect(iv.data).toEqual({});
  });

  test("A text validator's maxLength stays the model's validator error", async () => {
    const iv = await createInterview({
      elements: [{ type: "text", name: "q", validators: [{ type: "text", maxLength: 3 }] }],
    });
    const res = await iv.answerAll({ q: "abcdef" });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBeUndefined();
    expect(res.errors[0].message).toContain("3");
    expect(iv.data, "a validator error keeps the value, as the model does").toEqual({ q: "abcdef" });
  });

  test("A choice that is not a choice is notAChoice before it is counted", async () => {
    const iv = await createInterview(json);
    const res = await iv.answerAll({ pick: ["a", "zzz"] });
    expect(res.errors.map(error => error.code)).toEqual([InterviewErrorCodes.notAChoice]);
  });

  test("The messages say what the input accepts", async () => {
    const iv: IInterview = await createInterview(json);
    const res = await iv.answerAll({ d: "tomorrow", short: "abcdef", code: "abc", pick: ["a", "b"] });
    const messages = res.errors.map(error => error.message);
    expect(messages[0]).toContain("YYYY-MM-DD");
    expect(messages[1]).toContain("3");
    expect(messages[2]).toContain("999");
    expect(messages[3]).toContain("1");
  });
});

describe("interview: questions disabled by an ancestor (issue #11818)", () => {
  const panelJson = {
    elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "p", enableIf: "{q1} = 'open'", elements: [{ type: "text", name: "inner" }] },
      { type: "panel", name: "locked", readOnly: true,
        elements: [{ type: "text", name: "never", enableIf: "{q1} = 'open'" }] },
    ],
  };

  test("Batch mode lists a question of a disabled panel as disabled, and enabling the panel is not becameVisible", async () => {
    const iv = await createInterview(panelJson);
    const document = iv.getBatchDocument();
    const inner = document.items.filter(item => item.name === "inner")[0];
    expect(inner.disabled).toBe(true);
    expect(document.items.some(item => item.name === "never"), "a read-only panel keeps it read-only for good").toBe(false);
    const refused = await iv.answerAll({ inner: "x" });
    expect(refused.errors.map(error => error.code)).toEqual([InterviewErrorCodes.notAskable]);
    expect(refused.errors[0].message).toContain("enableIf");
    const opened = await iv.answerAll({ q1: "open" });
    // It was listed before - as disabled - so it did not become visible: it became answerable, the
    // way a question with its own enableIf does.
    expect(opened.becameVisible).toEqual([]);
    const after = iv.getBatchDocument().items.filter(item => item.name === "inner")[0];
    expect(after.disabled).toBeUndefined();
    expect(iv.getBatchDocument().items.some(item => item.name === "never")).toBe(false);
    const res = await iv.answerAll({ inner: "x", never: "y" });
    expect(res.errors.map(error => error.name + ":" + error.code)).toEqual(["never:" + InterviewErrorCodes.unknownQuestion]);
    expect(iv.data).toEqual({ q1: "open", inner: "x" });
  });

  test("Single mode refuses a question of a disabled panel as disabled and skips it", async () => {
    const iv = await createInterview(panelJson);
    expect(iv.current().name).toBe("q1");
    const refused = await iv.answer("inner", "x");
    expect(refused.errors.map(error => error.code)).toEqual([InterviewErrorCodes.notAskable]);
    const skipped = await iv.skip();
    expect(skipped.current, "a disabled item is never made current").toBe(null);
    const never = await iv.answer("never", "y");
    expect(never.errors.map(error => error.code)).toEqual([InterviewErrorCodes.unknownQuestion]);
    const opened = await iv.answer("q1", "open");
    expect(opened.becameVisible).toEqual([]);
    expect((await iv.answer("inner", "x")).errors).toEqual([]);
    expect(iv.data).toEqual({ q1: "open", inner: "x" });
  });

  test("A question of a dynamic panel with enableIf is listed disabled in its entry", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "q1" },
        { type: "paneldynamic", name: "dp", panelCount: 1, enableIf: "{q1} = 'open'",
          templateElements: [{ type: "text", name: "inner" }] },
      ],
    });
    const dp = iv.getBatchDocument().items.filter(item => item.name === "dp")[0];
    expect(dp.disabled).toBe(true);
    expect(dp.entries[0].fields.map(field => field.name + ":" + field.disabled)).toEqual(["inner:true"]);
  });
});

describe("interview: choices that are missing (issue #11818)", () => {
  function createFailingSurvey(): SurveyModel {
    const survey = new SurveyModel();
    survey.webProvider = {
      sendRequest: (request, onResponse): void => {
        onResponse({ status: 500, statusText: "Server Error", response: "boom" });
      },
    };
    survey.fromJSON({
      elements: [{ type: "dropdown", name: "city", choicesByUrl: { url: "https://api.example.com/cities" } }],
    });
    return survey;
  }

  test("A failed choicesByUrl request is unknown, names the error, and the value is not checked", async () => {
    const iv = await createInterview(createFailingSurvey());
    const item = iv.getBatchDocument().items[0];
    expect(item.choicesUnknown).toBe(true);
    expect(item.choicesError).toContain("Server Error");
    expect(iv.getAnswerSchema().properties.city.enum).toBeUndefined();
    const res = await iv.answerAll({ city: "zzz" });
    expect(res.errors.filter(error => !!error.code)).toEqual([]);
    // The model keeps a value it cannot judge, and so does the interview.
    expect(iv.data).toEqual({ city: "zzz" });
    expect(describeQuestion(iv.survey.getQuestionByName("city")).choicesError, "the error outlives the write")
      .toContain("Server Error");
  });

  const emptyJson = {
    elements: [
      { type: "checkbox", name: "src", choices: ["a", "b"] },
      { type: "dropdown", name: "dst", choicesFromQuestion: "src", choicesFromQuestionMode: "selected" },
    ],
  };

  test("Batch mode refuses a value for choices that are empty now, instead of writing and clearing it", async () => {
    const iv = await createInterview(emptyJson);
    const dst = iv.getBatchDocument().items.filter(item => item.name === "dst")[0];
    expect(dst.choices).toEqual([]);
    expect(iv.getAnswerSchema().properties.dst.enum, "no enum: [] for a strict validator to choke on").toBeUndefined();
    const res = await iv.answerAll({ dst: "a" });
    expect(res.errors.map(error => error.code)).toEqual([InterviewErrorCodes.notAChoice]);
    expect(res.errors[0].message).toContain("Available choices: none.");
    expect(iv.data).toEqual({});
    const fixed = await iv.answerAll({ src: ["a"], dst: "a" });
    expect(fixed.errors).toEqual([]);
    expect(iv.data).toEqual({ src: ["a"], dst: "a" });
  });

  test("Single mode refuses a value for choices that are empty now", async () => {
    const iv = await createInterview(emptyJson);
    const res = await iv.answer("dst", "a");
    expect(res.errors.map(error => error.code)).toEqual([InterviewErrorCodes.notAChoice]);
    expect(iv.data).toEqual({});
  });
});

describe("interview: the summary key (issue #11818)", () => {
  test("A summary step gets its summary key when it is current, before the error, and never as a placeholder", async () => {
    const iv = await createInterview({
      elements: [{ type: "paneldynamic", name: "people", validators: [{ type: "answercount", minCount: 2 }],
        templateElements: [{ type: "text", name: "n" }] }],
    });
    await iv.answer({ action: "add" });
    await iv.answer("x");
    // Back on the summary step, with the validator's error on it.
    const res = await iv.answer({ action: "done" });
    const keys = Object.keys(res.current);
    expect(keys.slice(keys.indexOf("summary"))).toEqual(["summary", "error"]);
    expect(res.current.summary.canAdd).toBe(true);
    expect(typeof res.current.error).toBe("string");
  });
});

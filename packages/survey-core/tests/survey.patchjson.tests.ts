import { SurveyModel } from "../src/survey";
import { Serializer } from "../src/jsonobject";
import { applyPatch } from "fast-json-patch";
import { JsonPatchError, JsonPatchOperation } from "../src/jsonpatch";
import { describe, test, expect, vi } from "vitest";

function makeSurvey(): SurveyModel {
  return new SurveyModel({
    pages: [
      {
        name: "p1",
        title: "Page one",
        elements: [
          { type: "text", name: "q1", title: "First" },
          { type: "text", name: "q2", title: "Second" },
        ],
      },
      {
        name: "p2",
        elements: [
          { type: "text", name: "q3", title: "Third" },
        ],
      },
    ],
  });
}

describe("SurveyModel.patchJSON", () => {
  test("replaces a scalar without rebuilding the model", () => {
    const survey = makeSurvey();
    const q1Before = survey.getQuestionByName("q1");
    const spy = vi.spyOn(survey, "fromJSON");

    survey.patchJSON([{ op: "replace", path: "/pages/0/elements/0/title", value: "Renamed" }]);

    expect(spy).not.toHaveBeenCalled();
    expect(q1Before).toBe(survey.getQuestionByName("q1"));
    expect(survey.getQuestionByName("q1").title).toBe("Renamed");
  });

  test("fires onPropertyChanged exactly for the touched property", () => {
    const survey = makeSurvey();
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    let q1Events = 0;
    let q2Events = 0;
    let q1LastProp = "";
    q1.onPropertyChanged.add((_s: any, opts: any) => { q1Events++; q1LastProp = opts.name; });
    q2.onPropertyChanged.add(() => { q2Events++; });

    survey.patchJSON([{ op: "replace", path: "/pages/0/elements/0/title", value: "X" }]);

    expect(q1Events).toBe(1);
    expect(q1LastProp).toBe("title");
    expect(q2Events).toBe(0);
  });

  test("appends a new question with `-` and fires onQuestionAdded", () => {
    const survey = makeSurvey();
    let added: string | null = null;
    survey.onQuestionAdded.add((_s, opts) => { added = opts.question.name; });

    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/-",
      value: { type: "text", name: "qNew", title: "New" }
    }]);

    expect(survey.getAllQuestions().length).toBe(4);
    const qNew = survey.getQuestionByName("qNew");
    expect(qNew).toBeTruthy();
    expect(qNew.getType()).toBe("text");
    expect(qNew.title).toBe("New");
    expect((qNew as any).parent).toBe(survey.pages[0]);
    expect(added).toBe("qNew");
  });

  test("inserts at a specific array index", () => {
    const survey = makeSurvey();
    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/1",
      value: { type: "text", name: "qMid" }
    }]);
    const names = survey.pages[0].elements.map(e => e.name);
    expect(names).toEqual(["q1", "qMid", "q2"]);
  });

  test("removes a question and preserves identity of siblings", () => {
    const survey = makeSurvey();
    const q2 = survey.getQuestionByName("q2");
    let removedName = "";
    survey.onQuestionRemoved.add((_s, opts) => { removedName = opts.question.name; });

    survey.patchJSON([{ op: "remove", path: "/pages/0/elements/0" }]);

    expect(removedName).toBe("q1");
    expect(survey.pages[0].elements.length).toBe(1);
    expect(survey.pages[0].elements[0]).toBe(q2);
  });

  test("moves elements within an array", () => {
    const survey = makeSurvey();
    survey.patchJSON([{ op: "move", from: "/pages/0/elements/1", path: "/pages/0/elements/0" }]);
    const names = survey.pages[0].elements.map(e => e.name);
    expect(names).toEqual(["q2", "q1"]);
  });

  test("replaces a localizable string as a whole (string or dictionary)", () => {
    const survey = makeSurvey();
    const page = survey.pages[0];

    // Dict over a string-valued title.
    survey.patchJSON([{
      op: "replace", path: "/pages/0/title",
      value: { default: "A", de: "B" }
    }]);
    expect(page.locTitle.getLocaleText("")).toBe("A");
    expect(page.locTitle.getLocaleText("de")).toBe("B");

    // Plain string over a multi-locale title clears non-default locales.
    survey.patchJSON([{ op: "replace", path: "/pages/0/title", value: "C" }]);
    expect(page.locTitle.getLocaleText("")).toBe("C");
    expect(page.locTitle.getLocales()).toEqual(["default"]);
    const json = page.locTitle.getJson();
    expect(typeof json === "string" ? json : json.default).toBe("C");
    expect(typeof json === "string" ? null : json.de).toBeFalsy();
  });

  test("patches a single locale of a localizable string", () => {
    const survey = makeSurvey();
    const page = survey.pages[0];
    page.locTitle.setJson({ default: "Page one", de: "Seite eins" });

    let events = 0;
    page.onPropertyChanged.add(() => { events++; });

    survey.patchJSON([{ op: "replace", path: "/pages/0/title/de", value: "Frage" }]);
    expect(page.locTitle.getLocaleText("de")).toBe("Frage");
    expect(page.locTitle.getLocaleText("")).toBe("Page one");
    expect(events).toBeGreaterThan(0);
  });

  test("default locale segment is mapped to the default locale", () => {
    const survey = makeSurvey();
    const page = survey.pages[0];
    page.locTitle.setJson({ default: "Page one", de: "Seite eins" });

    survey.patchJSON([{ op: "replace", path: "/pages/0/title/default", value: "Updated" }]);
    expect(page.locTitle.getLocaleText("")).toBe("Updated");
    expect(page.locTitle.getLocaleText("de")).toBe("Seite eins");
  });

  test("remove of a single locale clears that locale only", () => {
    const survey = makeSurvey();
    const page = survey.pages[0];
    page.locTitle.setJson({ default: "Page one", de: "Seite eins" });

    survey.patchJSON([{ op: "remove", path: "/pages/0/title/de" }]);
    expect(page.locTitle.getLocaleText("")).toBe("Page one");
    expect(page.locTitle.getLocales()).toEqual(["default"]);
  });

  test("test op passes and fails", () => {
    const survey = makeSurvey();
    expect(() => survey.patchJSON([
      { op: "test", path: "/pages/0/elements/0/title", value: "First" }
    ])).not.toThrow();

    expect(() => survey.patchJSON([
      { op: "test", path: "/pages/0/elements/0/title", value: "Nope" }
    ])).toThrowError(JsonPatchError);

    try {
      survey.patchJSON([
        { op: "replace", path: "/pages/0/elements/0/title", value: "ok" },
        { op: "test", path: "/pages/0/elements/0/title", value: "Nope" },
      ]);
      throw new Error("expected JsonPatchError");
    } catch(e) {
      expect(e).toBeInstanceOf(JsonPatchError);
      expect((e as JsonPatchError).opIndex).toBe(1);
      expect((e as JsonPatchError).reason).toBe("TEST_FAILED");
    }
  });

  test("invalid path: descending into a scalar throws INVALID_PATH", () => {
    const survey = makeSurvey();
    try {
      survey.patchJSON([{
        op: "replace", path: "/pages/0/title/de/extra", value: "x"
      }]);
      throw new Error("expected JsonPatchError");
    } catch(e) {
      expect(e).toBeInstanceOf(JsonPatchError);
      expect((e as JsonPatchError).reason).toBe("INVALID_PATH");
    }
  });

  test("unknown property throws PATH_NOT_FOUND", () => {
    const survey = makeSurvey();
    try {
      survey.patchJSON([{ op: "replace", path: "/pages/0/elements/0/nopeProp", value: 1 }]);
      throw new Error("expected JsonPatchError");
    } catch(e) {
      expect(e).toBeInstanceOf(JsonPatchError);
      expect((e as JsonPatchError).reason).toBe("PATH_NOT_FOUND");
    }
  });

  test("validateFirst leaves the model untouched if any op fails", () => {
    const survey = makeSurvey();
    const before = JSON.stringify(survey.toJSON());

    expect(() => survey.patchJSON([
      { op: "replace", path: "/pages/0/elements/0/title", value: "Changed" },
      { op: "test", path: "/pages/0/elements/0/title", value: "Nope" },
    ], true)).toThrowError(JsonPatchError);

    expect(JSON.stringify(survey.toJSON())).toBe(before);
  });

  test("without validateFirst, prior ops in the batch remain applied on failure", () => {
    const survey = makeSurvey();
    expect(() => survey.patchJSON([
      { op: "replace", path: "/pages/0/elements/0/title", value: "Changed" },
      { op: "test", path: "/pages/0/elements/1/title", value: "Nope" },
    ])).toThrowError(JsonPatchError);
    expect(survey.getQuestionByName("q1").title).toBe("Changed");
  });

  test("adds and removes choices on a dropdown", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown", name: "d1",
        choices: ["a", "b"]
      }]
    });
    const dropdown: any = survey.getQuestionByName("d1");

    survey.patchJSON([{ op: "add", path: "/pages/0/elements/0/choices/-", value: "c" }]);
    expect(dropdown.choices.map((c: any) => c.value)).toEqual(["a", "b", "c"]);

    survey.patchJSON([{ op: "remove", path: "/pages/0/elements/0/choices/0" }]);
    expect(dropdown.choices.map((c: any) => c.value)).toEqual(["b", "c"]);
  });

  test("oracle: output matches fast-json-patch on representative cases", () => {
    const cases: JsonPatchOperation[][] = [
      [{ op: "replace", path: "/pages/0/elements/0/title", value: "X" }],
      [{ op: "add", path: "/pages/0/elements/-", value: { type: "text", name: "qNew" } }],
      [{ op: "remove", path: "/pages/0/elements/1" }],
      [{ op: "move", from: "/pages/0/elements/0", path: "/pages/0/elements/1" }],
    ];
    for (const patches of cases) {
      const live = makeSurvey();
      const snapshot = JSON.parse(JSON.stringify(live.toJSON()));
      const expected = applyPatch(snapshot, patches as any, false, true).newDocument;
      live.patchJSON(patches);
      expect(live.toJSON()).toEqual(expected);
    }
  });

  test("does not call fromJSON when patching", () => {
    const survey = makeSurvey();
    const spy = vi.spyOn(survey, "fromJSON");
    survey.patchJSON([
      { op: "replace", path: "/pages/0/elements/0/title", value: "A" },
      { op: "add", path: "/pages/0/elements/-", value: { type: "text", name: "qX" } },
      { op: "remove", path: "/pages/0/elements/0" },
    ]);
    expect(spy).not.toHaveBeenCalled();
  });

  test("empty patch list is a no-op", () => {
    const survey = makeSurvey();
    const before = JSON.stringify(survey.toJSON());
    survey.patchJSON([]);
    expect(JSON.stringify(survey.toJSON())).toBe(before);
  });

  test("created item uses the right class via Serializer", () => {
    const survey = makeSurvey();
    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/-",
      value: { type: "dropdown", name: "qd", choices: ["a", "b"] }
    }]);
    const qd = survey.getQuestionByName("qd");
    expect(qd.getType()).toBe("dropdown");
    expect(Serializer.isDescendantOf(qd.getType(), "question")).toBe(true);
  });
});

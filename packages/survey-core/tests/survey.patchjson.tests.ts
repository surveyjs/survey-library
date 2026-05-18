import { SurveyModel } from "../src/survey";
import { Serializer } from "../src/jsonobject";
import { applyPatch, Operation } from "fast-json-patch";
import { JsonPatchError } from "../src/jsonpatch";
import { describe, test, expect, vi } from "vitest";

describe("SurveyModel.patchJSON", () => {
  test("replaces a scalar without rebuilding the model", () => {
    const survey = new SurveyModel({
      title: "Feedback",
      pages: [{
        name: "p1",
        elements: [
          { type: "text", name: "q1", title: "How are you?" },
        ],
      }],
    });
    const q1Before = survey.getQuestionByName("q1");
    const spy = vi.spyOn(survey, "fromJSON");

    survey.patchJSON([{ op: "replace", path: "/pages/0/elements/0/title", value: "Renamed" }]);

    expect(spy).not.toHaveBeenCalled();
    expect(q1Before).toBe(survey.getQuestionByName("q1"));
    expect(survey.getQuestionByName("q1").title).toBe("Renamed");
  });

  test("fires onPropertyChanged exactly for the touched property", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "comment", name: "q2" },
      ],
    });
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
    const survey = new SurveyModel({
      pages: [{
        name: "intro",
        elements: [
          { type: "text", name: "name" },
          { type: "text", name: "email" },
        ],
      }],
    });
    let added: string | null = null;
    survey.onQuestionAdded.add((_s, opts) => { added = opts.question.name; });

    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/-",
      value: { type: "text", name: "qNew", title: "New" }
    }]);

    expect(survey.getAllQuestions().length).toBe(3);
    const qNew = survey.getQuestionByName("qNew");
    expect(qNew).toBeTruthy();
    expect(qNew.getType()).toBe("text");
    expect(qNew.title).toBe("New");
    expect((qNew as any).parent).toBe(survey.pages[0]);
    expect(added).toBe("qNew");
  });

  test("inserts at a specific array index", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b" },
      ],
    });
    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/1",
      value: { type: "text", name: "qMid" }
    }]);
    const names = survey.pages[0].elements.map(e => e.name);
    expect(names).toEqual(["a", "qMid", "b"]);
  });

  test("removes a question and preserves identity of siblings", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "rating", name: "q2" },
      ],
    });
    const q2 = survey.getQuestionByName("q2");
    let removedName = "";
    survey.onQuestionRemoved.add((_s, opts) => { removedName = opts.question.name; });

    survey.patchJSON([{ op: "remove", path: "/pages/0/elements/0" }]);

    expect(removedName).toBe("q1");
    expect(survey.pages[0].elements.length).toBe(1);
    expect(survey.pages[0].elements[0]).toBe(q2);
  });

  test("moves elements within an array", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "first" },
        { type: "text", name: "second" },
        { type: "text", name: "third" },
      ],
    });
    survey.patchJSON([{ op: "move", from: "/pages/0/elements/2", path: "/pages/0/elements/0" }]);
    const names = survey.pages[0].elements.map(e => e.name);
    expect(names).toEqual(["third", "first", "second"]);
  });

  test("replaces a localizable string as a whole (string or dictionary)", () => {
    const survey = new SurveyModel({
      pages: [{ name: "p1", title: "Page one", elements: [{ type: "text", name: "q" }] }],
    });
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
    const survey = new SurveyModel({
      pages: [{ name: "p1", elements: [{ type: "text", name: "q" }] }],
    });
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
    const survey = new SurveyModel({
      pages: [{ name: "p1", elements: [{ type: "text", name: "q" }] }],
    });
    const page = survey.pages[0];
    page.locTitle.setJson({ default: "Page one", de: "Seite eins" });

    survey.patchJSON([{ op: "replace", path: "/pages/0/title/default", value: "Updated" }]);
    expect(page.locTitle.getLocaleText("")).toBe("Updated");
    expect(page.locTitle.getLocaleText("de")).toBe("Seite eins");
  });

  test("remove of a single locale clears that locale only", () => {
    const survey = new SurveyModel({
      pages: [{ name: "p1", elements: [{ type: "text", name: "q" }] }],
    });
    const page = survey.pages[0];
    page.locTitle.setJson({ default: "Page one", de: "Seite eins" });

    survey.patchJSON([{ op: "remove", path: "/pages/0/title/de" }]);
    expect(page.locTitle.getLocaleText("")).toBe("Page one");
    expect(page.locTitle.getLocales()).toEqual(["default"]);
  });

  test("invalid path: descending into a scalar throws INVALID_PATH", () => {
    const survey = new SurveyModel({
      pages: [{ name: "p1", title: "T", elements: [{ type: "text", name: "q" }] }],
    });
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
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }],
    });
    try {
      survey.patchJSON([{ op: "replace", path: "/pages/0/elements/0/nopeProp", value: 1 }]);
      throw new Error("expected JsonPatchError");
    } catch(e) {
      expect(e).toBeInstanceOf(JsonPatchError);
      expect((e as JsonPatchError).reason).toBe("PATH_NOT_FOUND");
    }
  });

  test("validateFirst leaves the model untouched if any op fails", () => {
    const survey = new SurveyModel({
      title: "Atomic",
      elements: [{ type: "text", name: "q1", title: "Q1" }],
    });
    const before = JSON.stringify(survey.toJSON());

    expect(() => survey.patchJSON([
      { op: "replace", path: "/pages/0/elements/0/title", value: "Changed" },
      { op: "replace", path: "/pages/0/elements/0/nopeProp", value: 1 },
    ], true)).toThrowError(JsonPatchError);

    expect(JSON.stringify(survey.toJSON())).toBe(before);
  });

  test("without validateFirst, prior ops in the batch remain applied on failure", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", title: "Q1" },
        { type: "text", name: "q2", title: "Q2" },
      ],
    });
    expect(() => survey.patchJSON([
      { op: "replace", path: "/pages/0/elements/0/title", value: "Changed" },
      { op: "replace", path: "/pages/0/elements/1/nopeProp", value: 1 },
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

  test("adds, replaces and removes choices on a dropdown (object choices)", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown", name: "d1",
        choices: [
          { value: 1, text: "One" },
          { value: 2, text: "Two" },
        ],
      }],
    });
    const dropdown: any = survey.getQuestionByName("d1");
    const firstChoiceBefore = dropdown.choices[0];

    // Append a new choice via "-"
    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/0/choices/-",
      value: { value: 3, text: "Three" },
    }]);
    expect(dropdown.choices.length).toBe(3);
    expect(dropdown.choices[2].value).toBe(3);
    expect(dropdown.choices[2].text).toBe("Three");

    // Insert at a specific index
    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/0/choices/1",
      value: { value: 15, text: "OneAndHalf" },
    }]);
    expect(dropdown.choices.map((c: any) => c.value)).toEqual([1, 15, 2, 3]);

    // Replace the text of an existing choice without recreating the question
    const spy = vi.spyOn(survey, "fromJSON");
    survey.patchJSON([{
      op: "replace", path: "/pages/0/elements/0/choices/0/text",
      value: "FirstUpdated",
    }]);
    expect(spy).not.toHaveBeenCalled();
    expect(dropdown).toBe(survey.getQuestionByName("d1"));
    expect(dropdown.choices[0]).toBe(firstChoiceBefore);
    expect(dropdown.choices[0].text).toBe("FirstUpdated");

    // Replace a whole choice item
    survey.patchJSON([{
      op: "replace", path: "/pages/0/elements/0/choices/1",
      value: { value: 99, text: "Replaced" },
    }]);
    expect(dropdown.choices[1].value).toBe(99);
    expect(dropdown.choices[1].text).toBe("Replaced");

    // Remove a choice
    survey.patchJSON([{ op: "remove", path: "/pages/0/elements/0/choices/0" }]);
    expect(dropdown.choices.map((c: any) => c.value)).toEqual([99, 2, 3]);
  });

  test("oracle: output matches fast-json-patch on representative cases", () => {
    const buildJson = () => ({
      pages: [{
        name: "p1",
        elements: [
          { type: "text", name: "q1", title: "First" },
          { type: "text", name: "q2", title: "Second" },
        ],
      }],
    });
    const cases: Operation[][] = [
      [{ op: "replace", path: "/pages/0/elements/0/title", value: "X" }],
      [{ op: "add", path: "/pages/0/elements/-", value: { type: "text", name: "qNew" } }],
      [{ op: "remove", path: "/pages/0/elements/1" }],
      [{ op: "move", from: "/pages/0/elements/0", path: "/pages/0/elements/1" }],
    ];
    for (const patches of cases) {
      const live = new SurveyModel(buildJson());
      const snapshot = JSON.parse(JSON.stringify(live.toJSON()));
      const expected = applyPatch(snapshot, patches as any, false, true).newDocument;
      live.patchJSON(patches);
      expect(live.toJSON()).toEqual(expected);
    }
  });

  test("does not call fromJSON when patching", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", title: "First" },
        { type: "text", name: "q2" },
      ],
    });
    const spy = vi.spyOn(survey, "fromJSON");
    survey.patchJSON([
      { op: "replace", path: "/pages/0/elements/0/title", value: "A" },
      { op: "add", path: "/pages/0/elements/-", value: { type: "text", name: "qX" } },
      { op: "remove", path: "/pages/0/elements/0" },
    ]);
    expect(spy).not.toHaveBeenCalled();
  });

  test("empty patch list is a no-op", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "only" }],
    });
    const before = JSON.stringify(survey.toJSON());
    survey.patchJSON([]);
    expect(JSON.stringify(survey.toJSON())).toBe(before);
  });

  test("changes inputType of a text question", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", inputType: "text" },
      ],
    });
    const q1 = survey.getQuestionByName("q1");
    const spy = vi.spyOn(survey, "fromJSON");
    let changedProp = "";
    let changedValue: any = undefined;
    q1.onPropertyChanged.add((_s: any, opts: any) => { changedProp = opts.name; changedValue = opts.newValue; });

    survey.patchJSON([{ op: "replace", path: "/pages/0/elements/0/inputType", value: "email" }]);

    expect(spy).not.toHaveBeenCalled();
    expect(q1).toBe(survey.getQuestionByName("q1"));
    expect((q1 as any).inputType).toBe("email");
    expect(changedProp).toBe("inputType");
    expect(changedValue).toBe("email");
  });

  test("adds, modifies and removes validators via patch (numeric + expression)", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "age" }],
    });
    const q: any = survey.getQuestionByName("age");
    expect(q.validators.length).toBe(0);

    // Add a numeric validator (min=18, max=100)
    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/0/validators",
      value: [{ type: "numeric", minValue: 18, maxValue: 100 }],
    }]);
    expect(q.validators.length).toBe(1);
    expect(q.validators[0].getType()).toBe("numericvalidator");

    // Below minimum -> error
    q.value = 10;
    expect(q.hasErrors()).toBe(true);
    // Within range -> no error
    q.value = 25;
    expect(q.hasErrors()).toBe(false);
    // Above maximum -> error
    q.value = 200;
    expect(q.hasErrors()).toBe(true);

    // Append an expression validator (value must be even)
    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/0/validators/-",
      value: { type: "expression", expression: "{age} % 2 = 0", text: "Must be even" },
    }]);
    expect(q.validators.length).toBe(2);
    expect(q.validators[1].getType()).toBe("expressionvalidator");

    // 25 satisfies numeric but fails expression
    q.value = 25;
    expect(q.hasErrors()).toBe(true);
    expect(q.errors.some((e: any) => e.text === "Must be even")).toBe(true);

    // 24 satisfies both
    q.value = 24;
    expect(q.hasErrors()).toBe(false);

    // Tighten the numeric validator: minValue 30
    survey.patchJSON([{
      op: "replace", path: "/pages/0/elements/0/validators/0/minValue",
      value: 30,
    }]);
    expect(q.validators[0].minValue).toBe(30);
    q.value = 24;
    expect(q.hasErrors()).toBe(true);
    q.value = 30;
    expect(q.hasErrors()).toBe(false);

    // Remove the expression validator -> odd values now pass
    survey.patchJSON([{ op: "remove", path: "/pages/0/elements/0/validators/1" }]);
    expect(q.validators.length).toBe(1);
    q.value = 31;
    expect(q.hasErrors()).toBe(false);

    // Remove all validators -> any value passes
    survey.patchJSON([{ op: "remove", path: "/pages/0/elements/0/validators" }]);
    expect(q.validators.length).toBe(0);
    q.value = 1;
    expect(q.hasErrors()).toBe(false);
  });

  test("adds and removes question expressions via patch (visibleIf / requiredIf)", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "trigger" },
        { type: "text", name: "dependent" },
      ],
    });
    const dependent: any = survey.getQuestionByName("dependent");
    expect(dependent.isVisible).toBe(true);
    expect(dependent.isRequired).toBe(false);

    // Add visibleIf: dependent should be hidden until trigger == "show"
    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/1/visibleIf",
      value: "{trigger} = 'show'",
    }]);
    expect(dependent.visibleIf).toBe("{trigger} = 'show'");
    expect(dependent.isVisible).toBe(false);

    survey.setValue("trigger", "show");
    expect(dependent.isVisible).toBe(true);

    survey.setValue("trigger", "hide");
    expect(dependent.isVisible).toBe(false);

    // Add requiredIf
    survey.setValue("trigger", "show");
    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/1/requiredIf",
      value: "{trigger} = 'show'",
    }]);
    expect(dependent.isRequired).toBe(true);
    expect(dependent.hasErrors()).toBe(true);

    dependent.value = "answer";
    expect(dependent.hasErrors()).toBe(false);

    // Replace the expression to a never-true condition
    survey.patchJSON([{
      op: "replace", path: "/pages/0/elements/1/visibleIf",
      value: "{trigger} = 'never'",
    }]);
    expect(dependent.isVisible).toBe(false);

    // Clear visibleIf and requiredIf entirely; verify they are gone from JSON
    survey.patchJSON([
      { op: "replace", path: "/pages/0/elements/1/visibleIf", value: "" },
      { op: "replace", path: "/pages/0/elements/1/requiredIf", value: "" },
    ]);

    // console.info(JSON.stringify(survey.toJSON()));

    expect(dependent.visibleIf).toBeFalsy();
    expect(dependent.requiredIf).toBeFalsy();
    expect(dependent.isVisible).toBe(true);
  });

  test("created item uses the right class via Serializer", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "seed" }],
    });
    survey.patchJSON([{
      op: "add", path: "/pages/0/elements/-",
      value: { type: "dropdown", name: "qd", choices: ["a", "b"] }
    }]);
    const qd = survey.getQuestionByName("qd");
    expect(qd.getType()).toBe("dropdown");
    expect(Serializer.isDescendantOf(qd.getType(), "question")).toBe(true);
  });
});

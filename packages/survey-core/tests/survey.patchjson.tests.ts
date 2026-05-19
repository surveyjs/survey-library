import { SurveyModel } from "../src/survey";
import { applyPatch, Operation, compare } from "fast-json-patch";
import { JsonPatchError } from "../src/jsonpatch";
import { describe, test, expect, vi } from "vitest";

function patchModel(model: SurveyModel, dst: any) {

  let from = model.toJSON();
  let to = new SurveyModel(dst).toJSON();
  let patches = compare(from, to);

  model.patchJSON(patches);
}

describe("SurveyModel.patchJSON", () => {

  test("replaces a scalar without rebuilding the model", () => {

    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", title: "Title" },
      ]
    });

    const q1 = survey.getQuestionByName("q1");
    const spy = vi.spyOn(survey, "fromJSON");

    patchModel(survey, {
      elements: [
        { type: "text", name: "q1", title: "Rename" },
      ]
    });

    expect(spy).not.toHaveBeenCalled();
    expect(q1).toBe(survey.getQuestionByName("q1"));
    expect(survey.getQuestionByName("q1").title).toBe("Rename");
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

    let events: any[] = [];

    q1.onPropertyChanged.add((_: any, opts: any) => { events.push(opts.name); });
    q2.onPropertyChanged.add((_: any, opts: any) => { events.push(opts.name); });

    patchModel(survey, {
      elements: [
        { type: "text", name: "q1", title: "X" },
        { type: "comment", name: "q2" },
      ],
    });

    expect(events.length).toBe(1);
    expect(events).toEqual(["title"]);
  });

  test("add/remove question", () => {

    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
        { type: "text", name: "q4" },
        { type: "text", name: "q5" },
      ],
    });

    patchModel(survey, {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q6", title: "q6title" },
        { type: "text", name: "q3" },
        { type: "text", name: "q5" },
      ],
    });

    expect(survey.getAllQuestions().length).toBe(4);

    const names = survey.pages[0].elements.map((e: any) => [e.name, e.title]);
    expect(names).toEqual([["q1", "q1"], ["q6", "q6title"], ["q3", "q3"], ["q5", "q5"]]);
  });

  test("moves elements within an array", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "comment", name: "q2" },
        { type: "boolean", name: "q3" }
      ],
    });

    patchModel(survey, {
      elements: [
        { type: "boolean", name: "q3" },
        { type: "text", name: "q1" },
        { type: "comment", name: "q2" }
      ]
    });

    const names = survey.pages[0].elements.map(e => [e.name, e.getType()]);
    expect(names).toEqual([["q3", "boolean"], ["q1", "text"], ["q2", "comment"]]);
  });

  test("localizable string", () => {

    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", title: "Title" },
      ]
    });
    const q1 = survey.getQuestionByName("q1");

    patchModel(survey, {
      elements: [
        { type: "text", name: "q1", title: { default: "Title", de: "Title [DE]", fr: "Title [FR]" } },
      ]
    });
    expect(q1.locTitle.getLocales()).toEqual(["default", "de", "fr"]);
    expect(q1.locTitle.getLocaleText("")).toBe("Title");
    expect(q1.locTitle.getLocaleText("de")).toBe("Title [DE]");
    expect(q1.locTitle.getLocaleText("fr")).toBe("Title [FR]");

    patchModel(survey, {
      elements: [
        { type: "text", name: "q1", title: { default: "Title", de: "Title [DE]" } },
      ]
    });
    expect(q1.locTitle.getLocales()).toEqual(["default", "de"]);
    expect(q1.locTitle.getLocaleText("")).toBe("Title");
    expect(q1.locTitle.getLocaleText("de")).toBe("Title [DE]");

    patchModel(survey, {
      elements: [
        { type: "text", name: "q1", title: { default: "Title", de: "Frage" } },
      ]
    });
    expect(q1.locTitle.getLocaleText("")).toBe("Title");
    expect(q1.locTitle.getLocaleText("de")).toBe("Frage");

    patchModel(survey, {
      elements: [
        { type: "text", name: "q1", title: { default: "Question", de: "Frage" } },
      ]
    });
    expect(q1.locTitle.getLocaleText("")).toBe("Question");
    expect(q1.locTitle.getLocaleText("de")).toBe("Frage");

    patchModel(survey, {
      elements: [
        { type: "text", name: "q1", title: "Question" },
      ]
    });
    expect(q1.locTitle.getLocaleText("")).toBe("Question");
    expect(q1.locTitle.getLocales()).toEqual(["default"]);
  });

  test("PATH_NOT_FOUND errors", () => {

    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" }
      ]
    });

    try {
      survey.patchJSON([{ op: "replace", path: "/pages/0/title/de/extra", value: "" }]);
      throw new Error("expected JsonPatchError");
    } catch(e) {
      expect(e).toBeInstanceOf(JsonPatchError);
      expect((e as JsonPatchError).reason).toBe("PATH_NOT_FOUND");
    }

    try {
      survey.patchJSON([{ op: "replace", path: "/pages/0/elements/0/nopeProp", value: 1 }]);
      throw new Error("expected JsonPatchError");
    } catch(e) {
      expect(e).toBeInstanceOf(JsonPatchError);
      expect((e as JsonPatchError).reason).toBe("PATH_NOT_FOUND");
    }

  });

  test("Atomic validateFirst: the model untouched if any op fails", () => {

    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", title: "Title" }
      ],
    });

    const q1 = survey.getQuestionByName("q1");

    try {
      survey.patchJSON([
        { op: "replace", path: "/pages/0/elements/0/title", value: "Changed" },
        { op: "replace", path: "/pages/0/elements/0/nopeProp", value: 1 },
      ], true);
    } catch(e: any) {
      expect(e).toBeInstanceOf(JsonPatchError);
      expect(e.reason).toBe("INVALID_OPERATION");
      expect(q1.title).toBe("Title");
    }

    try {
      survey.patchJSON([
        { op: "replace", path: "/pages/0/elements/0/title", value: "Changed" },
        { op: "replace", path: "/pages/0/elements/0/nopeProp", value: 1 },
      ]);
    } catch(e: any) {
      expect(e).toBeInstanceOf(JsonPatchError);
      expect(e.reason).toBe("PATH_NOT_FOUND");
      expect(q1.title).toBe("Changed");
    }
  });

  test("dropdown choices", () => {

    const survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "q1", choices: ["a", "b"] },
        { type: "dropdown", name: "q2", choices: [{ value: 1, text: "v1" }, { value: 2, text: "v2" }] }
      ]
    });

    const q1: any = survey.getQuestionByName("q1");
    const q2: any = survey.getQuestionByName("q2");

    patchModel(survey, {
      elements: [
        { type: "dropdown", name: "q1", choices: ["a", "b", "c"] },
        { type: "dropdown", name: "q2", choices: [{ value: 1, text: "c1" }, { value: 2, text: "c2" }, { value: 3, text: "c3" }] }
      ],
    });
    expect(q1.choices.map((c: any) => c.value)).toEqual(["a", "b", "c"]);
    expect(q2.choices.map((c: any) => c.value)).toEqual([1, 2, 3]);

    patchModel(survey, {
      elements: [
        { type: "dropdown", name: "q1", choices: ["b", "c"] },
        { type: "dropdown", name: "q2", choices: [{ value: 1, text: "c1" }, { value: 3, text: "c3" }] }
      ],
    });
    expect(q1.choices.map((c: any) => c.value)).toEqual(["b", "c"]);
    expect(q2.choices.map((c: any) => c.value)).toEqual([1, 3]);
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

    patchModel(survey, {
      pages: [{
        name: "page1",
        elements: [
          { type: "text", name: "q2" },
          { type: "text", name: "qX" },
        ],
      }],
    });

    expect(spy).not.toHaveBeenCalled();
  });

  test("text question inputType", () => {

    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }],
    });

    const q1 = survey.getQuestionByName("q1");
    const spy = vi.spyOn(survey, "fromJSON");

    patchModel(survey, {
      elements: [{ type: "text", name: "q1", inputType: "email" }],
    });

    expect(spy).not.toHaveBeenCalled();
    expect(q1).toBe(survey.getQuestionByName("q1"));
    expect(q1.inputType).toBe("email");
  });

  test("adds, modifies and removes validators via patch (numeric + expression)", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "age" }],
    });
    const q: any = survey.getQuestionByName("age");
    expect(q.validators.length).toBe(0);

    // Add a numeric validator (min=18, max=100)
    patchModel(survey, {
      pages: [{
        name: "page1",
        elements: [{
          type: "text", name: "age",
          validators: [{ type: "numeric", minValue: 18, maxValue: 100 }],
        }],
      }],
    });
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
    patchModel(survey, {
      pages: [{
        name: "page1",
        elements: [{
          type: "text", name: "age",
          validators: [
            { type: "numeric", minValue: 18, maxValue: 100 },
            { type: "expression", expression: "{age} % 2 = 0", text: "Must be even" },
          ],
        }],
      }],
    });
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
    patchModel(survey, {
      pages: [{
        name: "page1",
        elements: [{
          type: "text", name: "age",
          validators: [
            { type: "numeric", minValue: 30, maxValue: 100 },
            { type: "expression", expression: "{age} % 2 = 0", text: "Must be even" },
          ],
        }],
      }],
    });
    expect(q.validators[0].minValue).toBe(30);
    q.value = 24;
    expect(q.hasErrors()).toBe(true);
    q.value = 30;
    expect(q.hasErrors()).toBe(false);

    // Remove the expression validator -> odd values now pass
    patchModel(survey, {
      pages: [{
        name: "page1",
        elements: [{
          type: "text", name: "age",
          validators: [
            { type: "numeric", minValue: 30, maxValue: 100 },
          ],
        }],
      }],
    });
    expect(q.validators.length).toBe(1);
    q.value = 31;
    expect(q.hasErrors()).toBe(false);

    // Remove all validators -> any value passes
    patchModel(survey, {
      pages: [{
        name: "page1",
        elements: [{ type: "text", name: "age" }],
      }],
    });
    expect(q.validators.length).toBe(0);
    q.value = 1;
    expect(q.hasErrors()).toBe(false);
  });

  // TODO: Uncomment after merge https://github.com/surveyjs/survey-library/pull/11291
  //   test("visibleIf / requiredIf", () => {

  //     const survey = new SurveyModel({
  //       elements: [
  //         { type: "text", name: "q1" },
  //         { type: "text", name: "q2" },
  //       ],
  //     });

  //     const q1: any = survey.getQuestionByName("q1");
  //     const q2: any = survey.getQuestionByName("q2");

  //     expect(q2.isVisible).toBe(true);
  //     expect(q2.isRequired).toBe(false);

  //     patchModel(survey, {
  //       elements: [
  //         { type: "text", name: "q1" },
  //         { type: "text", name: "q2", visibleIf: "{q1} = 'show'" },
  //       ],
  //     });
  //     expect(q2.visibleIf).toBe("{q1} = 'show'");
  //     expect(q2.isVisible).toBe(false);

  //     q1.value = "show";
  //     expect(q2.isVisible).toBe(true);

  //     q1.value = "hide";
  //     expect(q2.isVisible).toBe(false);

  //     q1.value = "show";
  //     patchModel(survey, {
  //       elements: [
  //         { type: "text", name: "q1" },
  //         {
  //           type: "text",
  //           name: "q2",
  //           visibleIf: "{q1} = 'show'",
  //           requiredIf: "{q1} = 'show'",
  //         },
  //       ],
  //     });

  //     expect(q2.isVisible).toBe(true);
  //     expect(q2.isRequired).toBe(true);
  //     expect(q2.hasErrors()).toBe(true);

  //     q2.value = "answer";
  //     expect(q2.hasErrors()).toBe(false);

  //     patchModel(survey, {
  //       elements: [
  //         { type: "text", name: "q1" },
  //         {
  //           type: "text",
  //           name: "q2",
  //           visibleIf: "{q1} = 'never'",
  //           requiredIf: "{q1} = 'show'",
  //         },
  //       ],
  //     });
  //     expect(q2.isVisible).toBe(false);

  //     patchModel(survey, {
  //       elements: [
  //         { type: "text", name: "q1" },
  //         { type: "text", name: "q2" },
  //       ],
  //     });
  //     expect(q2.isVisible).toBe(true);
  //     expect(q2.isRequired).toBe(false);
  //   });

  test("created item uses the right class via Serializer", () => {

    const survey = new SurveyModel({});

    patchModel(survey, {
      elements: [
        { type: "text", name: "q1" },
        { type: "dropdown", name: "q2", choices: ["a", "b"] },
        { type: "checkbox", name: "q3", choices: ["a", "b"] },
        { type: "radiogroup", name: "q4", choices: ["a", "b"] },
        { type: "comment", name: "q5" },
        { type: "boolean", name: "q6" },
        { type: "rating", name: "q7" },
        { type: "ranking", name: "q8", choices: ["a", "b"] },
        { type: "imagepicker", name: "q9", choices: [{ value: "a", imageLink: "a.png" }] },
        { type: "image", name: "q10", imageLink: "a.png" },
        { type: "html", name: "q11", html: "<div></div>" },
        { type: "expression", name: "q12", expression: "1 + 1" },
        { type: "file", name: "q13" },
        { type: "matrix", name: "q14", columns: ["c1"], rows: ["r1"] },
        { type: "matrixdropdown", name: "q15", columns: [{ name: "c1" }], rows: ["r1"] },
        { type: "matrixdynamic", name: "q16", columns: [{ name: "c1" }], rowCount: 1 },
        { type: "multipletext", name: "q17", items: [{ name: "i1" }] },
        { type: "panel", name: "q18", elements: [{ type: "text", name: "pq1" }] },
        { type: "paneldynamic", name: "q19", templateElements: [{ type: "text", name: "pq1" }] },
        { type: "signaturepad", name: "q20" },
        { type: "tagbox", name: "q21", choices: ["a", "b"] },
        { type: "buttongroup", name: "q22", choices: ["a", "b"] },
        { type: "slider", name: "q23" },
      ],
    });

    const expected: Array<[string, string]> = [
      ["q2", "dropdown"],
      ["q3", "checkbox"],
      ["q4", "radiogroup"],
      ["q5", "comment"],
      ["q6", "boolean"],
      ["q7", "rating"],
      ["q8", "ranking"],
      ["q9", "imagepicker"],
      ["q10", "image"],
      ["q11", "html"],
      ["q12", "expression"],
      ["q13", "file"],
      ["q14", "matrix"],
      ["q15", "matrixdropdown"],
      ["q16", "matrixdynamic"],
      ["q17", "multipletext"],
      ["q18", "panel"],
      ["q19", "paneldynamic"],
      ["q20", "signaturepad"],
      ["q21", "tagbox"],
      ["q22", "buttongroup"],
      ["q23", "slider"],
    ];

    for (const [name, type] of expected) {
      const el: any = survey.getQuestionByName(name) || survey.getPanelByName(name);
      expect(el, `element ${name} not found`).toBeTruthy();
      expect(el.getType()).toBe(type);
    }
  });

  test("matrix: add/remove/modify rows and columns", () => {

    const survey = new SurveyModel({
      elements: [{
        type: "matrix", name: "m",
        columns: ["c1", "c2"],
        rows: ["r1", "r2"],
      }],
    });
    const m: any = survey.getQuestionByName("m");

    // Add a column and a row
    patchModel(survey, {
      elements: [{
        type: "matrix", name: "m",
        columns: ["c1", "c2", "c3"],
        rows: ["r1", "r2", "r3"],
      }],
    });
    expect(m.columns.map((c: any) => c.value)).toEqual(["c1", "c2", "c3"]);
    expect(m.rows.map((r: any) => r.value)).toEqual(["r1", "r2", "r3"]);

    // Remove the middle column and middle row
    patchModel(survey, {
      elements: [{
        type: "matrix", name: "m",
        columns: ["c1", "c3"],
        rows: ["r1", "r3"],
      }],
    });
    expect(m.columns.map((c: any) => c.value)).toEqual(["c1", "c3"]);
    expect(m.rows.map((r: any) => r.value)).toEqual(["r1", "r3"]);

    // Modify column/row text (item with value/text object)
    patchModel(survey, {
      elements: [{
        type: "matrix", name: "m",
        columns: [{ value: "c1", text: "Col 1" }, { value: "c3", text: "Col 3" }],
        rows: [{ value: "r1", text: "Row 1" }, { value: "r3", text: "Row 3" }],
      }],
    });
    expect(m.columns[0].text).toBe("Col 1");
    expect(m.columns[1].text).toBe("Col 3");
    expect(m.rows[0].text).toBe("Row 1");
    expect(m.rows[1].text).toBe("Row 3");

    // Reorder rows
    patchModel(survey, {
      elements: [{
        type: "matrix", name: "m",
        columns: [{ value: "c1", text: "Col 1" }, { value: "c3", text: "Col 3" }],
        rows: [{ value: "r3", text: "Row 3" }, { value: "r1", text: "Row 1" }],
      }],
    });
    expect(m.rows.map((r: any) => r.value)).toEqual(["r3", "r1"]);
  });

  test("matrixdropdown: add/remove/modify columns and rows", () => {

    const survey = new SurveyModel({
      elements: [{
        type: "matrixdropdown", name: "md",
        columns: [
          { name: "col1", cellType: "text", title: "Column 1" },
          { name: "col2", cellType: "dropdown", choices: ["a", "b"] },
        ],
        rows: ["r1", "r2"],
      }],
    });
    const md: any = survey.getQuestionByName("md");
    expect(md.columns.length).toBe(2);
    expect(md.columns[1].cellType).toBe("dropdown");

    // Add a third column and a row
    patchModel(survey, {
      elements: [{
        type: "matrixdropdown", name: "md",
        columns: [
          { name: "col1", cellType: "text", title: "Column 1" },
          { name: "col2", cellType: "dropdown", choices: ["a", "b"] },
          { name: "col3", cellType: "boolean" },
        ],
        rows: ["r1", "r2", "r3"],
      }],
    });
    expect(md.columns.map((c: any) => c.name)).toEqual(["col1", "col2", "col3"]);
    expect(md.columns[2].cellType).toBe("boolean");
    expect(md.rows.map((r: any) => r.value)).toEqual(["r1", "r2", "r3"]);

    // Modify a column: change title and add a choice
    patchModel(survey, {
      elements: [{
        type: "matrixdropdown", name: "md",
        columns: [
          { name: "col1", cellType: "text", title: "Renamed Column 1" },
          { name: "col2", cellType: "dropdown", choices: ["a", "b", "c"] },
          { name: "col3", cellType: "boolean" },
        ],
        rows: ["r1", "r2", "r3"],
      }],
    });
    expect(md.columns[0].title).toBe("Renamed Column 1");
    expect(md.columns[1].choices.map((c: any) => c.value)).toEqual(["a", "b", "c"]);

    // Remove the middle column and the last row
    patchModel(survey, {
      elements: [{
        type: "matrixdropdown", name: "md",
        columns: [
          { name: "col1", cellType: "text", title: "Renamed Column 1" },
          { name: "col3", cellType: "boolean" },
        ],
        rows: ["r1", "r2"],
      }],
    });
    expect(md.columns.map((c: any) => c.name)).toEqual(["col1", "col3"]);
    expect(md.rows.map((r: any) => r.value)).toEqual(["r1", "r2"]);
  });

  test("matrixdynamic: add/remove/modify columns and rowCount", () => {

    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "md",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text" },
        ],
        rowCount: 2,
      }],
    });
    const md: any = survey.getQuestionByName("md");
    expect(md.columns.length).toBe(2);
    expect(md.rowCount).toBe(2);

    // Add a column, change rowCount
    patchModel(survey, {
      elements: [{
        type: "matrixdynamic", name: "md",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text" },
          { name: "col3", cellType: "dropdown", choices: ["x", "y"] },
        ],
        rowCount: 4,
      }],
    });
    expect(md.columns.map((c: any) => c.name)).toEqual(["col1", "col2", "col3"]);
    expect(md.columns[2].cellType).toBe("dropdown");
    expect(md.rowCount).toBe(4);

    // Modify column cellType
    patchModel(survey, {
      elements: [{
        type: "matrixdynamic", name: "md",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "boolean" },
          { name: "col3", cellType: "dropdown", choices: ["x", "y"] },
        ],
        rowCount: 4,
      }],
    });
    expect(md.columns[1].cellType).toBe("boolean");

    // Remove a column, decrease rowCount
    patchModel(survey, {
      elements: [{
        type: "matrixdynamic", name: "md",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col3", cellType: "dropdown", choices: ["x", "y"] },
        ],
        rowCount: 1,
      }],
    });
    expect(md.columns.map((c: any) => c.name)).toEqual(["col1", "col3"]);
    expect(md.rowCount).toBe(1);
  });

  test("panel: add/remove/modify child elements", () => {

    const survey = new SurveyModel({
      elements: [{
        type: "panel", name: "p",
        elements: [
          { type: "text", name: "pq1" },
          { type: "text", name: "pq2" },
        ],
      }],
    });
    const panel: any = survey.getPanelByName("p");
    expect(panel.elements.length).toBe(2);
    const pq1 = survey.getQuestionByName("pq1");

    // Modify a child element title (panel + question identity preserved)
    patchModel(survey, {
      elements: [{
        type: "panel", name: "p",
        elements: [
          { type: "text", name: "pq1", title: "First" },
          { type: "text", name: "pq2" },
        ],
      }],
    });
    expect(survey.getQuestionByName("pq1")).toBe(pq1);
    expect(pq1.title).toBe("First");

    // Add a child element (different type)
    patchModel(survey, {
      elements: [{
        type: "panel", name: "p",
        elements: [
          { type: "text", name: "pq1", title: "First" },
          { type: "text", name: "pq2" },
          { type: "dropdown", name: "pq3", choices: ["a", "b"] },
        ],
      }],
    });
    expect(panel.elements.length).toBe(3);
    expect(panel.elements[2].getType()).toBe("dropdown");

    // Remove the middle child
    patchModel(survey, {
      elements: [{
        type: "panel", name: "p",
        elements: [
          { type: "text", name: "pq1", title: "First" },
          { type: "dropdown", name: "pq3", choices: ["a", "b"] },
        ],
      }],
    });
    expect(panel.elements.map((e: any) => e.name)).toEqual(["pq1", "pq3"]);

    // Reorder children
    patchModel(survey, {
      elements: [{
        type: "panel", name: "p",
        elements: [
          { type: "dropdown", name: "pq3", choices: ["a", "b"] },
          { type: "text", name: "pq1", title: "First" },
        ],
      }],
    });
    expect(panel.elements.map((e: any) => e.name)).toEqual(["pq3", "pq1"]);
  });

  test("paneldynamic: add/remove/modify template elements and panelCount", () => {

    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "pd",
        templateElements: [
          { type: "text", name: "tq1" },
          { type: "text", name: "tq2" },
        ],
        panelCount: 2,
      }],
    });
    const pd: any = survey.getQuestionByName("pd");
    expect(pd.templateElements.length).toBe(2);
    expect(pd.panelCount).toBe(2);

    // Modify template element + increase panelCount
    patchModel(survey, {
      elements: [{
        type: "paneldynamic", name: "pd",
        templateElements: [
          { type: "text", name: "tq1", title: "First" },
          { type: "text", name: "tq2" },
        ],
        panelCount: 3,
      }],
    });
    expect(pd.templateElements[0].title).toBe("First");
    expect(pd.panelCount).toBe(3);

    // Add a template element of a different type
    patchModel(survey, {
      elements: [{
        type: "paneldynamic", name: "pd",
        templateElements: [
          { type: "text", name: "tq1", title: "First" },
          { type: "text", name: "tq2" },
          { type: "dropdown", name: "tq3", choices: ["a", "b"] },
        ],
        panelCount: 3,
      }],
    });
    expect(pd.templateElements.length).toBe(3);
    expect(pd.templateElements[2].getType()).toBe("dropdown");
    // The change should be reflected in instantiated panels
    expect(pd.panels[0].elements.map((e: any) => e.name)).toEqual(["tq1", "tq2", "tq3"]);

    // Remove a template element + decrease panelCount
    patchModel(survey, {
      elements: [{
        type: "paneldynamic", name: "pd",
        templateElements: [
          { type: "text", name: "tq1", title: "First" },
          { type: "dropdown", name: "tq3", choices: ["a", "b"] },
        ],
        panelCount: 1,
      }],
    });
    expect(pd.templateElements.map((e: any) => e.name)).toEqual(["tq1", "tq3"]);
    expect(pd.panelCount).toBe(1);
    expect(pd.panels.length).toBe(1);
    expect(pd.panels[0].elements.map((e: any) => e.name)).toEqual(["tq1", "tq3"]);
  });
});

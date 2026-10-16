import { describe, test, expect } from "vitest";
import { lintSurvey } from "../../src/linter/index";
import { buildIndex } from "../../src/linter/walker";
import { LintMetadata } from "../../src/linter/metadata";
import { getItemFields } from "../../src/linter/record-fields";

// Questions on one data key share one value, and a panel/row object of a dynamic panel or matrix
// then holds the fields every one of them writes (record-fields.ts). The runtime side of every case
// here is pinned in linter-runtime-parity.tests.ts.

// name/shadowing judges the sharing itself, not the fields it brings, so it stays out of these
function findings(json: any): Array<string> {
  return lintSurvey(json).findings
    .filter(f => f.severity !== "info" && f.ruleId !== "name/shadowing")
    .map(f => f.ruleId + "/" + f.reason + " @" + f.path);
}

const KEY = "cars";

const PARTNERS: Array<{ id: string, field: string, json: any }> = [
  { id: "checkbox with valuePropertyName", field: "car",
    json: { type: "checkbox", choices: ["Ford", "BMW"], valuePropertyName: "car" } },
  { id: "tagbox with valuePropertyName", field: "car",
    json: { type: "tagbox", choices: ["Ford", "BMW"], valuePropertyName: "car" } },
  { id: "ranking with valuePropertyName", field: "car",
    json: { type: "ranking", choices: ["Ford", "BMW"], valuePropertyName: "car" } },
  { id: "image map with valuePropertyName", field: "car",
    json: { type: "imagemap", valuePropertyName: "car", imageLink: "x", areas: [{ value: "Ford", coords: "1,1,2,2", shape: "rect" }] } },
  { id: "checkbox with a choice comment (value)", field: "value",
    json: { type: "checkbox", choices: [{ value: "Ford", showCommentArea: true }, "BMW"] } },
  { id: "checkbox with a choice comment (comment)", field: "comment",
    json: { type: "checkbox", choices: [{ value: "Ford", showCommentArea: true }, "BMW"] } },
  { id: "dynamic matrix", field: "pcol",
    json: { type: "matrixdynamic", columns: [{ name: "pcol", cellType: "text" }] } },
  { id: "dynamic panel", field: "ptq",
    json: { type: "paneldynamic", templateElements: [{ type: "text", name: "ptq" }] } },
];

// both declare the valueName, or only one of them does: the runtime binds them either way
const ORIENTATIONS: Array<{ id: string, owner: any, partner: any, ownerName: string }> = [
  { id: "both declare the valueName", owner: { name: "O", valueName: KEY }, partner: { name: "P", valueName: KEY }, ownerName: "O" },
  { id: "the owner declares it", owner: { name: "O", valueName: KEY }, partner: { name: KEY }, ownerName: "O" },
  { id: "the partner declares it", owner: { name: KEY }, partner: { name: "P", valueName: KEY }, ownerName: KEY },
];

function panelOwner(f: string): any {
  return {
    type: "paneldynamic", templateTitle: "Car: {panel." + f + "}", keyName: f, defaultValue: [{ [f]: "Ford" }],
    templateElements: [
      { type: "text", name: "tq", visibleIf: "{panel." + f + "} = 'Ford'" },
      { type: "text", name: "tq2", visibleIf: "{prevPanel." + f + "} = 'Ford'" },
    ],
  };
}

function matrixOwner(f: string): any {
  return {
    type: "matrixdynamic", keyName: f, defaultValue: [{ [f]: "Ford" }],
    columns: [{ name: "own", cellType: "text" }, { name: "c2", cellType: "text", visibleIf: "{row." + f + "} = 'Ford'" }],
  };
}

function survey(owner: any, partner: any, f: string, ownerName: string): any {
  return {
    elements: [owner, partner,
      { type: "expression", name: "eIndex", expression: "{" + KEY + "[0]." + f + "}" },
      { type: "expression", name: "eCount", expression: "countInArray({" + KEY + "}, '" + f + "')" },
      { type: "dropdown", name: "dd", choicesFromQuestion: ownerName, choiceValuesFromQuestion: f },
    ],
  };
}

describe("fields a question sharing the value adds to a panel/row object", () => {
  PARTNERS.forEach(partner => ORIENTATIONS.forEach(or => {
    test("dynamic panel + " + partner.id + ", " + or.id, () => {
      const owner = Object.assign(panelOwner(partner.field), or.owner);
      expect(findings(survey(owner, Object.assign({}, partner.json, or.partner), partner.field, or.ownerName))).toEqual([]);
    });
    test("dynamic matrix + " + partner.id + ", " + or.id, () => {
      const owner = Object.assign(matrixOwner(partner.field), or.owner);
      expect(findings(survey(owner, Object.assign({}, partner.json, or.partner), partner.field, or.ownerName))).toEqual([]);
    });
  }));

  test("a misspelled field is still unknown", () => {
    const res = lintSurvey({
      elements: [
        { type: "checkbox", name: "cars", choices: ["Ford"], valuePropertyName: "car" },
        { type: "paneldynamic", name: "info", valueName: "cars", templateTitle: "Car: {panel.carr}",
          templateElements: [{ type: "text", name: "rating" }] },
      ],
    }).findings.filter(f => f.ruleId === "reference/unknown");
    expect(res.map(f => f.reason + " @" + f.path)).toEqual(["scopedUnknown @elements[1].templateTitle"]);
    expect(res[0].suggestion).toBe("car");
  });

  test("a question on the same key in another data scope adds nothing", () => {
    expect(findings({
      elements: [
        { type: "paneldynamic", name: "cars", templateTitle: "Car: {panel.car}", templateElements: [{ type: "text", name: "tq" }] },
        { type: "paneldynamic", name: "other", templateElements: [
          { type: "checkbox", name: "cb", valueName: "cars", valuePropertyName: "car", choices: ["Ford"] }] },
      ],
    })).toEqual(["reference/unknown/scopedUnknown @elements[0].templateTitle"]);
  });

  test("a question on the same key in the same template adds its fields", () => {
    expect(findings({
      elements: [{ type: "paneldynamic", name: "outer", templateElements: [
        { type: "checkbox", name: "cb", valueName: "cars", valuePropertyName: "car", choices: ["Ford"] },
        { type: "paneldynamic", name: "inner", valueName: "cars", templateTitle: "Car: {panel.car}",
          templateElements: [{ type: "text", name: "tq", visibleIf: "{panel.car} = 'Ford'" }] },
      ] }],
    })).toEqual([]);
  });

  test("a plain checkbox adds no field - its items are no objects", () => {
    expect(findings({
      elements: [
        { type: "checkbox", name: "cars", choices: ["Ford"] },
        { type: "paneldynamic", name: "info", valueName: "cars", templateTitle: "Car: {panel.value}",
          templateElements: [{ type: "text", name: "tq" }] },
      ],
    })).toEqual(["reference/unknown/scopedUnknown @elements[1].templateTitle"]);
  });

  // a column and a detail-panel question on one key both read and write that key of the row record
  const rowShare = (detailValueName: string): any => ({
    elements: [{
      type: "matrixdynamic", name: "m", detailPanelMode: "underRow",
      columns: [{ name: "cars", cellType: "checkbox", choices: ["Ford", "BMW"], valuePropertyName: "car" }],
      detailElements: [{ type: "paneldynamic", name: "pd", valueName: detailValueName, templateTitle: "Car: {panel.car}",
        templateElements: [{ type: "text", name: "tq", visibleIf: "{panel.car} = 'Ford'" }] }],
    }],
  });
  test("a column adds its fields to a detail-panel question on its row key", () => {
    expect(findings(rowShare("cars"))).toEqual([]);
  });
  test("a column on another row key adds nothing", () => {
    expect(findings(rowShare("other"))).toEqual([
      "reference/unknown/scopedUnknown @elements[0].detailElements[0].templateElements[0].visibleIf",
      "reference/unknown/scopedUnknown @elements[0].detailElements[0].templateTitle",
    ]);
  });
  // a tag box keeps a comment on "Other" alone, so a choice comment never makes its items objects
  test("a tag box with a choice comment adds no value/comment field", () => {
    expect(findings({
      elements: [
        { type: "tagbox", name: "cars", choices: [{ value: "Ford", showCommentArea: true }, "BMW"] },
        { type: "paneldynamic", name: "info", valueName: "cars", templateTitle: "Car: {panel.value} {panel.comment}",
          templateElements: [{ type: "text", name: "tq" }] },
      ],
    })).toEqual(["reference/unknown/scopedUnknown @elements[1].templateTitle", "reference/unknown/scopedUnknown @elements[1].templateTitle"]);
  });
  // a single-select image map keeps the area value as it is
  test("a single-select image map adds no valuePropertyName field", () => {
    expect(findings({
      elements: [
        { type: "imagemap", name: "cars", multiSelect: false, valuePropertyName: "car", imageLink: "x",
          areas: [{ value: "Ford", coords: "1,1,2,2", shape: "rect" }] },
        { type: "paneldynamic", name: "info", valueName: "cars", templateTitle: "Car: {panel.car}",
          templateElements: [{ type: "text", name: "tq" }] },
      ],
    })).toEqual(["reference/unknown/scopedUnknown @elements[1].templateTitle"]);
  });
  // the comment of a choice lives under "comment" inside the item object; a "-Comment" key lives
  // next to a question's or column's value only, never next to an item field
  describe("a comment key of an item field is as unknown as a misspelled field", () => {
    const checkbox = { type: "checkbox", name: "cars", valuePropertyName: "car", choices: ["Ford"] };
    const cases: Array<{ id: string, json: (field: string) => any }> = [
      { id: "{panel.x}", json: field => ({ elements: [checkbox, { type: "paneldynamic", name: "info", valueName: "cars",
        templateTitle: "{panel." + field + "}", templateElements: [{ type: "text", name: "tq" }] }] }) },
      { id: "{row.x}", json: field => ({ elements: [checkbox, { type: "matrixdynamic", name: "m", valueName: "cars",
        columns: [{ name: "c", cellType: "text", visibleIf: "{row." + field + "} = 'x'" }] }] }) },
      { id: "a default value key", json: field => ({ elements: [checkbox, { type: "paneldynamic", name: "info", valueName: "cars",
        defaultValue: [{ [field]: "x" }], templateElements: [{ type: "text", name: "tq" }] }] }) },
      // the dynamic panel goes by the key itself: the array source of an inArray function is looked up by name first
      { id: "an inArray condition", json: field => ({ elements: [
        { type: "checkbox", name: "cb", valueName: "cars", valuePropertyName: "car", choices: ["Ford"] },
        { type: "paneldynamic", name: "cars", templateElements: [{ type: "text", name: "tq" }] },
        { type: "expression", name: "e", expression: "countInArray({cars}, 'car', '{" + field + "} notempty')" }] }) },
    ];
    cases.forEach(c => test(c.id, () => {
      const misspelled = findings(c.json("carX"));
      expect(misspelled.length).toBeGreaterThan(0);
      expect(findings(c.json("car-Comment"))).toEqual(misspelled);
    }));
  });
});

describe("a template question is a field under the key it stores its value by", () => {
  const json = (ref: string): any => ({
    elements: [
      { type: "paneldynamic", name: "pd", templateTitle: "T " + ref,
        templateElements: [{ type: "text", name: "tv", valueName: "v1" }] },
    ],
  });
  test("{panel.<valueName>} is the field", () => {
    expect(findings(json("{panel.v1}"))).toEqual([]);
  });
  test("{panel.<name>} of a question with a valueName names no field", () => {
    const res = lintSurvey(json("{panel.tv}")).findings.filter(f => f.ruleId === "reference/unknown");
    expect(res.map(f => f.reason + " @" + f.path)).toEqual(["scopedUnknown @elements[0].templateTitle"]);
  });
  test("{q[0].<name>} and keyName follow the valueName too", () => {
    expect(findings({
      elements: [
        { type: "paneldynamic", name: "pd", keyName: "tv", templateElements: [{ type: "text", name: "tv", valueName: "v1" }] },
        { type: "expression", name: "e1", expression: "{pd[0].v1}" },
        { type: "expression", name: "e2", expression: "{pd[0].tv}" },
      ],
    })).toEqual(["reference/unknown/keyNameNotFound @elements[0].keyName", "reference/unknown/inContainer @elements[2].expression"]);
  });
});

describe("an object value several questions share holds the keys of all of them", () => {
  const TYPES: { [type: string]: (n: any, key: string) => any } = {
    multipletext: (n, key) => Object.assign({ type: "multipletext", items: [{ name: key }] }, n),
    matrixdropdown: (n, key) => Object.assign({ type: "matrixdropdown", rows: [key], columns: [{ name: "c", cellType: "text" }] }, n),
    matrix: (n, key) => Object.assign({ type: "matrix", rows: [key], columns: ["x", "y"] }, n),
  };
  Object.keys(TYPES).forEach(ownerType => Object.keys(TYPES).forEach(partnerType => {
    test(ownerType + " + " + partnerType, () => {
      expect(findings({
        elements: [
          TYPES[ownerType]({ name: "obj" }, "own"),
          TYPES[partnerType]({ name: "p", valueName: "obj" }, "pk"),
          { type: "expression", name: "e", expression: "{obj.pk}" },
        ],
      })).toEqual([]);
    });
  }));
  test("a key no sharing question has is still unknown", () => {
    const res = lintSurvey({
      elements: [
        { type: "multipletext", name: "mt", items: [{ name: "a" }] },
        { type: "multipletext", name: "mt2", valueName: "mt", items: [{ name: "b" }] },
        { type: "expression", name: "e", expression: "{mt.c}" },
      ],
    }).findings.filter(f => f.ruleId === "reference/unknown");
    expect(res.map(f => f.reason + " @" + f.path)).toEqual(["inContainer @elements[2].expression"]);
  });
  test("a matrixdropdown row sees the columns of the matrixdropdown sharing its value", () => {
    expect(findings({
      elements: [
        { type: "matrixdropdown", name: "md", rows: ["r1"], defaultValue: { r2: { c2: "x" } },
          columns: [{ name: "c1", cellType: "text" }, { name: "cv", cellType: "text", visibleIf: "{row.c2} = 'x'" }] },
        { type: "matrixdropdown", name: "md2", valueName: "md", rows: ["r2"], columns: [{ name: "c2", cellType: "text" }] },
        { type: "expression", name: "e", expression: "{md.r2.c2}" },
      ],
    })).toEqual([]);
  });
  // the runtime leaves a key another question on the data key holds to that question
  // (QuestionMatrixModel.verifyValueCore: a row of another matrix that shares the value is checked by that matrix)
  describe("a key another question adds is known, its value is not this question's to check", () => {
    const mt = (valueName: string): any => ({ type: "multipletext", name: "mt", valueName: valueName, items: [{ name: "i1" }] });
    test("a multiple-text item under a single-choice matrix", () => {
      expect(findings({ elements: [
        { type: "matrix", name: "m", rows: ["r1"], columns: ["x", "y"], defaultValue: { r1: "x", i1: "free" } }, mt("m"),
      ] })).toEqual([]);
    });
    test("a row of another single-choice matrix", () => {
      expect(findings({ elements: [
        { type: "matrix", name: "m", rows: ["r1"], columns: ["x", "y"], defaultValue: { r2: "a" } },
        { type: "matrix", name: "m2", valueName: "m", rows: ["r2"], columns: ["a", "b"] },
      ] })).toEqual([]);
    });
    test("a row of another matrixdropdown", () => {
      expect(findings({ elements: [
        { type: "matrixdropdown", name: "md", rows: ["r1"], columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }],
          defaultValue: { r2: { c: "b" } } },
        { type: "matrixdropdown", name: "md2", valueName: "md", rows: ["r2"], columns: [{ name: "c", cellType: "dropdown", choices: ["b"] }] },
      ] })).toEqual([]);
    });
    test("an own row is still checked, an unknown key still reported", () => {
      expect(findings({ elements: [
        { type: "matrix", name: "m", rows: ["r1"], columns: ["x", "y"], defaultValue: { r1: "z", i1: "free", zz: "x" } }, mt("m"),
      ] })).toEqual(["value/not-a-choice/defaultValue @elements[0].defaultValue", "value/not-a-choice/unknownRowKey @elements[0].defaultValue"]);
      expect(findings({ elements: [
        { type: "matrixdropdown", name: "md", rows: ["r1"], columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }],
          defaultValue: { r1: { c: "b" }, i1: { c: "a" } } }, mt("md"),
      ] })).toEqual(["value/not-a-choice/defaultValue @elements[0].defaultValue"]);
    });
  });
});

describe("the merge examples of the documentation", () => {
  test("a dynamic matrix and a dynamic panel on one key (design-survey-merge-question-values.md)", () => {
    expect(findings({
      elements: [{
        type: "matrixdynamic", name: "employees-info", valueName: "employees",
        columns: [{ name: "employee-name", cellType: "text" }],
      }, {
        type: "paneldynamic", name: "employees-details", valueName: "employees",
        templateElements: [{ type: "text", name: "address" }, { type: "text", name: "phone" }],
        templateTitle: "Employee: {panel.employee-name}",
      }],
    })).toEqual([]);
  });
  test("a checkbox with object items and a dynamic panel on one key (design-survey-merge-question-values.md)", () => {
    expect(findings({
      elements: [{
        type: "checkbox", name: "cars", valuePropertyName: "car", choices: ["Ford", "Vauxhall"],
      }, {
        type: "paneldynamic", name: "cars-info", valueName: "cars", templateTitle: "Car: {panel.car}",
        templateElements: [{ type: "dropdown", name: "years-owned", choicesMin: 1, choicesMax: 50 }, { type: "rating", name: "rating" }],
      }],
    })).toEqual([]);
  });
});

describe("the fields of a record are the name map until something re-keys or shares them", () => {
  function index(json: any) {
    return buildIndex(json, {}, new LintMetadata());
  }
  test("a container nothing shares and no valueName re-keys reads its name map", () => {
    const idx = index({ elements: [
      { type: "paneldynamic", name: "pd", templateElements: [{ type: "text", name: "q" }] },
      { type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "text" }] },
    ] });
    const pd = idx.byName.first("pd");
    const m = idx.byName.first("m");
    expect(getItemFields(pd)).toBe(pd.templateNames);
    expect(getItemFields(m)).toBe(m.matrixColumns);
  });
  test("a template valueName re-keys the fields", () => {
    const pd = index({ elements: [
      { type: "paneldynamic", name: "pd", templateElements: [{ type: "text", name: "q", valueName: "v1" }] },
    ] }).byName.first("pd");
    expect(getItemFields(pd)).not.toBe(pd.templateNames);
    expect(getItemFields(pd).has("v1")).toBe(true);
    expect(getItemFields(pd).has("q")).toBe(false);
  });
});

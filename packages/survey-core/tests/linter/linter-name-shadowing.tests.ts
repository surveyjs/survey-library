import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";
import { withSettings } from "./lint-test-helpers";

function byRule(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "name/shadowing");
}

describe("name/shadowing - built-in variables", () => {
  test("a question named after a built-in variable is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "pageno" },
        { type: "text", name: "q2", visibleIf: "{pageno} > 1" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("builtInVariable");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].messageData.builtIn.toLowerCase()).toBe("pageno");
    expect(findings[0].messageData.nameKind).toBe("name");
  });
  test("a valueName shadowing a built-in variable is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", valueName: "locale" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.nameKind).toBe("valueName");
  });
  test("a calculated value shadowing a built-in variable is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "correctAnswers", expression: "1" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.nameKind).toBe("calculatedValue");
  });
  test("a matrix column may carry the name - its scope resolves first", () => {
    expect(byRule({
      elements: [{ type: "matrixdynamic", name: "m1", columns: [{ name: "locale" }] }],
    })).toHaveLength(0);
  });
  test("ordinary names are clean", () => {
    expect(byRule({ elements: [{ type: "text", name: "page" }] })).toHaveLength(0);
  });
});

describe("name/shadowing - valueName over an element name", () => {
  test("a valueName landing on a dynamic panel without one of its own is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "matrixdynamic", name: "q1", valueName: "q2", columns: [{ name: "c1", cellType: "text" }] },
        { type: "paneldynamic", name: "q2", templateElements: [{ type: "text", name: "t1" }] },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("valueNameShadowsElement");
    expect(findings[0].messageData.otherName).toBe("q2");
    expect(findings[0].related.map(r => r.path).sort()).toEqual(["elements[0]", "elements[1]"]);
    expect(findings[0].message).toBe("The valueName \"q2\" of \"q1\" shares the value of paneldynamic \"q2\"," +
      " which has no valueName of its own - \"q2\" treats the fields \"q1\" adds as unknown," +
      " and clearIncorrectValues() deletes them. Set its valueName to \"q2\" too.");
  });
  test("the records questions and checkboxes that add fields are flagged, the rest is a plain share", () => {
    const flagged = (shadowed: any, sharing: any): number => byRule({
      elements: [Object.assign({ name: "q2" }, shadowed), Object.assign({ name: "q1", valueName: "q2" }, sharing)],
    }).length;
    const panel = { type: "paneldynamic", templateElements: [{ type: "text", name: "t1" }] };
    const matrix = { type: "matrixdynamic", columns: [{ name: "c1", cellType: "text" }] };
    const dropdownMatrix = (column: string) => ({ type: "matrixdropdown", rows: ["r1"], columns: [{ name: column, cellType: "text" }] });
    expect(flagged(matrix, panel), "matrix + panel").toBe(1);
    expect(flagged(panel, matrix), "panel + matrix").toBe(1);
    expect(flagged(panel, { type: "checkbox", choices: ["a"], valuePropertyName: "car" }), "checkbox with valuePropertyName").toBe(1);
    expect(flagged(panel, { type: "tagbox", choices: ["a"], valuePropertyName: "car" }), "tagbox with valuePropertyName").toBe(1);
    expect(flagged(panel, { type: "checkbox", choices: [{ value: "a", showCommentArea: true }] }), "checkbox with a choice comment").toBe(1);
    expect(flagged(dropdownMatrix("c1"), dropdownMatrix("c2")), "matrixdropdown + matrixdropdown").toBe(1);
    expect(flagged(panel, { type: "checkbox", choices: ["a"] }), "a plain checkbox adds no field").toBe(0);
    expect(flagged(panel, { type: "imagemap", valuePropertyName: "car", imageLink: "x", areas: [] }), "an image map with valuePropertyName").toBe(1);
    expect(flagged(panel, { type: "imagemap", multiSelect: false, valuePropertyName: "car", imageLink: "x", areas: [] }), "a single-select image map keeps plain values").toBe(0);
    expect(flagged(panel, { type: "text" }), "a scalar is a type conflict, not this").toBe(0);
    expect(flagged({ type: "text" }, { type: "text" }), "two scalars share a value").toBe(0);
    expect(flagged({ type: "multipletext", items: [{ name: "a" }] }, { type: "multipletext", items: [{ name: "b" }] }),
      "multiple texts merge their keys").toBe(0);
  });
  // keyed by its name alone, a dynamic panel or matrix still knows the keys its own questions store
  // (isRecordKeyOfType), and a matrixdropdown keeps a row it does not list (isValueKeyKnown)
  test("a question adding no field the dynamic panel or matrix lacks is a plain share", () => {
    const flagged = (shadowed: any, sharing: any): number => byRule({
      elements: [Object.assign({ name: "q2" }, shadowed), Object.assign({ name: "q1", valueName: "q2" }, sharing)],
    }).length;
    const matrix = (columns: Array<string>) => ({ type: "matrixdynamic", columns: columns.map(name => ({ name: name, cellType: "text" })) });
    const dropdown = (rows: Array<string> | undefined, column: string): any =>
      Object.assign({ type: "matrixdropdown", columns: [{ name: column, cellType: "text" }] }, rows ? { rows: rows } : {});
    expect(flagged(matrix(["first", "last"]), matrix(["first", "last"])), "a copy of the matrix").toBe(0);
    expect(flagged(matrix(["first", "last"]), matrix(["first"])), "a part of its columns").toBe(0);
    expect(flagged(matrix(["first"]), matrix(["first", "last"])), "a column it lacks").toBe(1);
    expect(flagged({ type: "paneldynamic", templateElements: [{ type: "text", name: "carName", valueName: "car" }] },
      { type: "checkbox", choices: ["a"], valuePropertyName: "car" }), "a field its template writes").toBe(0);
    expect(flagged(dropdown(["r2"], "c1"), dropdown(["r1"], "c2")), "no row in common").toBe(0);
    expect(flagged(dropdown(["r1", "r2"], "c1"), dropdown(["r1"], "c2")), "a row in common").toBe(1);
    expect(flagged(dropdown(["r1"], "c1"), dropdown(undefined, "c2")), "rows not listed may be any row").toBe(1);
  });
  test("the merge example of the documentation is clean - the checkbox keeps no records", () => {
    expect(byRule({
      elements: [
        { type: "checkbox", name: "cars", valuePropertyName: "car", choices: ["Ford", "Vauxhall"] },
        { type: "paneldynamic", name: "cars-info", valueName: "cars", templateTitle: "Car: {panel.car}",
          templateElements: [{ type: "rating", name: "rating" }] },
      ],
    })).toHaveLength(0);
  });
  test("two questions deliberately sharing a valueName stay clean", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", valueName: "shared" },
        { type: "text", name: "q2", valueName: "shared" },
      ],
    })).toHaveLength(0);
  });
  test("a valueName repeating the question's own name is clean", () => {
    expect(byRule({ elements: [{ type: "text", name: "q1", valueName: "q1" }] })).toHaveLength(0);
  });
  test("a shadowed question that has its own valueName writes elsewhere", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", valueName: "q2" },
        { type: "text", name: "q2", valueName: "elsewhere" },
      ],
    })).toHaveLength(0);
  });
});

describe("name/shadowing - derived data keys", () => {
  test("a name colliding with a comment key is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "q1", showCommentArea: true },
        { type: "text", name: "q1-Comment" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("commentKeyCollision");
    expect(findings[0].messageData.base).toBe("q1");
  });
  test("the other-item comment counts as a comment writer", () => {
    expect(byRule({
      elements: [
        { type: "dropdown", name: "q1", choices: ["a"], showOtherItem: true },
        { type: "text", name: "q1-Comment" },
      ],
    })).toHaveLength(1);
  });
  test("a question that writes no comment leaves the key free", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q1-Comment" }],
    })).toHaveLength(0);
  });
  test("a customized commentSuffix is honoured", () => {
    withSettings({ commentSuffix: "_note" }, () => {
      expect(byRule({
        elements: [
          { type: "text", name: "q1", showCommentArea: true },
          { type: "text", name: "q1_note" },
        ],
      })).toHaveLength(1);
    });
  });
  test("a name colliding with a matrix totals key is flagged", () => {
    const findings = byRule({
      elements: [
        {
          type: "matrixdynamic", name: "m1",
          columns: [{ name: "c1", cellType: "text", inputType: "number", totalType: "sum" }],
        },
        { type: "text", name: "m1-total" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("totalKeyCollision");
    expect(findings[0].messageData.base).toBe("m1");
  });
  test("a matrix without totals leaves the key free", () => {
    expect(byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }] },
        { type: "text", name: "m1-total" },
      ],
    })).toHaveLength(0);
  });
  test("the collision is found through a valueName too", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", valueName: "shared", showCommentArea: true },
        { type: "text", name: "q2", valueName: "shared-Comment" },
      ],
    })).toHaveLength(1);
  });
});

describe("name/shadowing - data scopes", () => {
  test("a template valueName is no collision with a top-level question (#12014)", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "phone_number" },
        {
          type: "paneldynamic", name: "emergency_contacts",
          templateElements: [{ type: "text", name: "contact_phone_number", valueName: "phone_number" }],
        },
      ],
    })).toHaveLength(0);
  });
  test("a template question spelling a top-level comment key is no collision", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", showCommentArea: true },
        { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "q1-Comment" }] },
      ],
    })).toHaveLength(0);
  });
  test("a template question spelling a top-level totals key is no collision", () => {
    expect(byRule({
      elements: [
        {
          type: "matrixdynamic", name: "m1",
          columns: [{ name: "c1", cellType: "text", inputType: "number", totalType: "sum" }],
        },
        { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "m1-total" }] },
      ],
    })).toHaveLength(0);
  });
  test("a valueName landing on another question of the same template is a share, not reported", () => {
    expect(byRule({
      elements: [{
        type: "paneldynamic", name: "p1", templateElements: [
          { type: "text", name: "x" },
          { type: "text", name: "y", valueName: "x" },
        ],
      }],
    })).toHaveLength(0);
  });
  test("questions of two different templates do not meet", () => {
    expect(byRule({
      elements: [
        { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "x" }] },
        { type: "paneldynamic", name: "p2", templateElements: [{ type: "text", name: "y", valueName: "x" }] },
      ],
    })).toHaveLength(0);
  });
  test("a top-level valueName does not meet a template question", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", valueName: "x" },
        { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "x" }] },
      ],
    })).toHaveLength(0);
  });
  test("a detail-panel valueName landing on a column is a share, not reported", () => {
    expect(byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", detailPanelMode: "underRow",
        columns: [{ name: "c1", cellType: "text" }],
        detailElements: [{ type: "text", name: "d1", valueName: "c1" }],
      }],
    })).toHaveLength(0);
  });
  test("a comment key inside one template is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "paneldynamic", name: "p1", templateElements: [
          { type: "text", name: "q1", showCommentArea: true },
          { type: "text", name: "q1-Comment" },
        ],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("commentKeyCollision");
    expect(findings[0].messageData.base).toBe("q1");
  });
  test("a comment key inside one template is found through a valueName too", () => {
    expect(byRule({
      elements: [{
        type: "paneldynamic", name: "p1", templateElements: [
          { type: "text", name: "q1", valueName: "shared", showCommentArea: true },
          { type: "text", name: "q2", valueName: "shared-Comment" },
        ],
      }],
    })).toHaveLength(1);
  });
  test("a detail-panel question spelling a column comment key is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", detailPanelMode: "underRow",
        columns: [{ name: "c1", cellType: "text", showCommentArea: true }],
        detailElements: [{ type: "text", name: "c1-Comment" }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("commentKeyCollision");
  });
});

// The derived key a question writes - "<data key>-Comment" - and the owner it collides with are
// both found by data key: the valueName when there is one, else the name.
describe("name/shadowing - derived keys by data key", () => {
  const COMMENT_OF_VALUE_NAME = [
    { type: "text", name: "q1", valueName: "v1", showCommentArea: true },
    { type: "text", name: "q1-Comment" },
  ];
  const COMMENT_OF_OTHER_DATA_KEY = [
    { type: "text", name: "x", valueName: "q1", showCommentArea: true },
    { type: "text", name: "q1", valueName: "other" },
    { type: "text", name: "q1-Comment" },
  ];
  test("a question with a valueName writes no comment under its name", () => {
    expect(byRule({ elements: COMMENT_OF_VALUE_NAME })).toHaveLength(0);
  });
  test("the comment key of a valueName collides, whatever question carries the name", () => {
    const findings = byRule({ elements: COMMENT_OF_OTHER_DATA_KEY });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("commentKeyCollision");
    expect(findings[0].path).toBe("elements[2]");
    expect(findings[0].elementName).toBe("q1-Comment");
  });
  test("inside a template, a question with a valueName writes no comment under its name", () => {
    expect(byRule({ elements: [{ type: "paneldynamic", name: "p1", templateElements: COMMENT_OF_VALUE_NAME }] })).toHaveLength(0);
  });
  test("inside a template, the comment key of a valueName collides, whatever question carries the name", () => {
    const findings = byRule({ elements: [{ type: "paneldynamic", name: "p1", templateElements: COMMENT_OF_OTHER_DATA_KEY }] });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("commentKeyCollision");
    expect(findings[0].path).toBe("elements[0].templateElements[2]");
  });
});

describe("name/shadowing - a variable over a question", () => {
  test("a setvalue trigger writing a variable named after a question is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
      triggers: [{
        type: "setvalue", expression: "{q2} = 1", setToName: "q1", setValue: "done", isVariable: true,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("variableShadowsQuestion");
    expect(findings[0].path).toBe("triggers[0].setToName");
    expect(findings[0].messageData.name).toBe("q1");
  });
  test("a trigger writing the question value itself is clean", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
      triggers: [{ type: "setvalue", expression: "{q2} = 1", setToName: "q1", setValue: "done" }],
    })).toHaveLength(0);
  });
  test("a variable that names no question is clean", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q2" }],
      triggers: [{
        type: "setvalue", expression: "{q2} = 1", setToName: "flag", setValue: 1, isVariable: true,
      }],
    })).toHaveLength(0);
  });
});

describe("name/shadowing - configuration", () => {
  test("duplicate names stay with name/duplicate", () => {
    const result = lintSurvey({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q1" }],
    });
    expect(result.findings.filter(f => f.ruleId === "name/shadowing")).toHaveLength(0);
    expect(result.findings.filter(f => f.ruleId === "name/duplicate").length).toBeGreaterThan(0);
  });
  test("the rule can be switched off", () => {
    const result = lintSurvey(
      { elements: [{ type: "text", name: "locale" }] },
      { rules: { "name/shadowing": "off" } });
    expect(result.findings.filter(f => f.ruleId === "name/shadowing")).toHaveLength(0);
  });
});

// A matrixdropdown keeps an object of cells under a row key; a single-choice matrix keeps the column
// value there and a multiple text the item text. One key holds one of them, and the runtime deletes
// the other side.
describe("name/shadowing - a matrixdropdown row a single value takes", () => {
  const md = (rows?: Array<string>): any => Object.assign({ type: "matrixdropdown", name: "md",
    columns: [{ name: "c", cellType: "text" }] }, rows ? { rows: rows } : {});
  const matrix = (rows: Array<string>): any => ({ type: "matrix", name: "m", valueName: "md", rows: rows, columns: ["x", "y"] });
  const conflicts = (json: any): Array<string> => byRule(json).filter(f => f.reason === "dropdownRowConflict")
    .map(f => f.path + " " + f.messageData.key + " " + f.messageData.name + "/" + f.messageData.otherName);
  test("a row of a single-choice matrix on the same data key", () => {
    const findings = byRule({ elements: [md(["r1"]), matrix(["r1"])] });
    expect(findings.map(f => f.reason + " @ " + f.path)).toEqual(["dropdownRowConflict @ elements[1]"]);
    expect(findings[0].messageData).toEqual({ reason: "dropdownRowConflict", key: "r1", name: "m", otherName: "md" });
    expect(findings[0].related.map(r => r.path).sort()).toEqual(["elements[0]", "elements[1]"]);
  });
  test("an item of a multiple text on the same data key", () => {
    expect(conflicts({ elements: [md(["r1"]), { type: "multipletext", name: "mt", valueName: "md", items: [{ name: "r1" }] }] }))
      .toEqual(["elements[1] r1 mt/md"]);
  });
  test("distinct keys, rows not listed and two matrixdropdowns are fine", () => {
    expect(conflicts({ elements: [md(["r1"]), matrix(["r2"])] })).toEqual([]);
    expect(conflicts({ elements: [md(), matrix(["r1"])] })).toEqual([]);
    expect(conflicts({ elements: [md(["r1"]), Object.assign(md(["r1"]), { name: "md2", valueName: "md" })] })).toEqual([]);
  });
  // the runtime compares the keys exactly (hasValueKey: row.value + "" === key)
  test("keys that differ in case are two keys", () => {
    expect(conflicts({ elements: [md(["R1"]), matrix(["r1"])] })).toEqual([]);
    expect(conflicts({ elements: [md(["R1"]), { type: "multipletext", name: "mt", valueName: "md", items: [{ name: "r1" }] }] })).toEqual([]);
  });
  test("inside one template", () => {
    expect(conflicts({ elements: [{ type: "paneldynamic", name: "p", templateElements: [md(["r1"]), matrix(["r1"])] }] }))
      .toEqual(["elements[0].templateElements[1] r1 m/md"]);
  });
});

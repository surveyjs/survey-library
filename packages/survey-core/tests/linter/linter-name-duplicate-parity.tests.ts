import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

// The Creator's JSON tab used to find duplicate names with its own walk over a survey model:
// pages, panels and questions share one namespace across the whole survey - a dynamic-panel
// template or a matrix detail panel is no scope of its own - while matrix columns are unique per
// matrix and multiple-text items per question. These fixtures come from that walk's tests, so the
// linter answers the same way the JSON tab always did.
function duplicates(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "name/duplicate");
}

describe("name/duplicate - parity with the Creator's JSON tab", () => {
  test("a page, a question and another question sharing names: the later ones are reported", () => {
    const findings = duplicates({
      pages: [{
        name: "page1",
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "page1" },
          { type: "text", name: "q1" },
        ],
      }],
    });
    expect(findings.map(f => f.path)).toEqual(["pages[0].elements[1]", "pages[0].elements[2]"]);
  });
  test("the same question name in the templates of two dynamic panels is a duplicate", () => {
    const findings = duplicates({
      elements: [
        { type: "paneldynamic", name: "q1", templateElements: [{ type: "text", name: "q2" }] },
        { type: "paneldynamic", name: "q3", templateElements: [{ type: "text", name: "q2" }] },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[1].templateElements[0]");
    expect(findings[0].messageData.scope).toBeFalsy();
  });
  test("a template question and a survey question sharing a name is a duplicate", () => {
    const findings = duplicates({
      elements: [
        { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "q4" }] },
        { type: "text", name: "q4" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[1]");
  });
  test("a duplicate inside one template is reported once", () => {
    expect(duplicates({
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [{ type: "text", name: "inner" }, { type: "text", name: "inner" }],
      }],
    })).toHaveLength(1);
  });
  test("a detail-panel question and a survey question sharing a name is a duplicate", () => {
    const findings = duplicates({
      elements: [
        {
          type: "matrixdynamic", name: "m1", detailPanelMode: "underRow",
          columns: [{ name: "col1" }], detailElements: [{ type: "text", name: "q2" }],
        },
        { type: "text", name: "q2" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[1]");
  });
  test("column names are unique per matrix", () => {
    expect(duplicates({
      elements: [
        { type: "matrixdynamic", name: "q1", columns: [{ name: "col1" }] },
        { type: "matrixdynamic", name: "q2", columns: [{ name: "col1" }] },
      ],
    })).toHaveLength(0);
    const findings = duplicates({
      elements: [{ type: "matrixdynamic", name: "q1", columns: [{ name: "col1" }, { name: "col1" }] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[0].columns[1]");
  });
  test("item names are unique per multiple-text question", () => {
    expect(duplicates({
      elements: [
        { type: "multipletext", name: "q1", items: [{ name: "col1" }] },
        { type: "multipletext", name: "q2", items: [{ name: "col1" }] },
      ],
    })).toHaveLength(0);
    expect(duplicates({
      elements: [{ type: "multipletext", name: "q1", items: [{ name: "col1" }, { name: "col1" }] }],
    })).toHaveLength(1);
  });
  test("a column and a question may share a name - different namespaces", () => {
    expect(duplicates({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "text", name: "col1" },
      ],
    })).toHaveLength(0);
  });
  test("names are compared case-insensitively, the way the designer compares them", () => {
    expect(duplicates({
      elements: [{ type: "text", name: "Q1" }, { type: "text", name: "q1" }],
    })).toHaveLength(1);
  });
});

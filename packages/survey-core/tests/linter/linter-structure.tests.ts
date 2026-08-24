import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "page/empty");
}

describe("page/empty", () => {
  test("page with no elements is flagged", () => {
    const findings = byRule({ pages: [{ name: "p1", elements: [] }] });
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].path).toBe("pages[0]");
  });
  test("page with only empty panels flags both page and panel", () => {
    const findings = byRule({
      pages: [{ name: "p1", elements: [{ type: "panel", name: "inner", elements: [] }] }],
    });
    expect(findings).toHaveLength(2);
    expect(findings.map(f => f.messageData.kind).sort()).toEqual(["page", "panel"]);
  });
  test("html-only page is clean (html renders)", () => {
    expect(byRule({
      pages: [{ name: "p1", elements: [{ type: "html", name: "h1", html: "<b>x</b>" }] }],
    })).toHaveLength(0);
  });
  test("unknown-type element counts as renderable", () => {
    expect(byRule({
      pages: [{ name: "p1", elements: [{ type: "customwidget", name: "w1" }] }],
    })).toHaveLength(0);
  });
  test("statically hidden elements do not count as renderable", () => {
    const findings = byRule({
      pages: [{ name: "p1", elements: [{ type: "text", name: "q1", visible: false }] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain("statically hidden");
  });
  test("visible:false with a visibleIf still counts as renderable", () => {
    expect(byRule({
      pages: [{
        name: "p1",
        elements: [
          { type: "text", name: "q0" },
          { type: "text", name: "q1", visible: false, visibleIf: "{q0} = 1" },
        ],
      }],
    })).toHaveLength(0);
  });
  test("empty paneldynamic template is flagged", () => {
    const findings = byRule({
      elements: [{ type: "paneldynamic", name: "p1", templateElements: [] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.kind).toBe("emptyTemplate");
  });
  test("nested panel chain resolves renderability transitively", () => {
    expect(byRule({
      pages: [{
        name: "p1",
        elements: [{
          type: "panel", name: "outer",
          elements: [{
            type: "panel", name: "inner",
            elements: [{ type: "text", name: "q1" }],
          }],
        }],
      }],
    })).toHaveLength(0);
  });
  test("legacy top-level elements form an implicit page", () => {
    const findings = byRule({ elements: [] });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements");
  });
});

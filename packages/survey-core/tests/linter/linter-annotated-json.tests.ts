import { describe, test, expect } from "vitest";
import { lintSurvey } from "../../src/linter/index";

// The Creator's JSON tab hands the linter the JSON its own parser annotated: every object literal
// carries its position in the text under "pos". That key is not something an author wrote, so no
// rule may read it as a property, a data key, a binding or a locale.
const pos = { start: 0, end: 1 };

describe("linter over position-annotated JSON", () => {
  test("a pos marker inside a composite default is not a row, column or template key", () => {
    const findings = lintSurvey({
      pos: pos,
      elements: [
        {
          type: "matrixdynamic", name: "m1", defaultRowValue: { c1: "a", pos: pos }, pos: pos,
          columns: [{ name: "c1", cellType: "dropdown", choices: ["a", "b"], pos: pos }],
        },
        {
          type: "matrixdropdown", name: "md", rows: ["r1"], defaultValue: { r1: { c1: "a", pos: pos }, pos: pos }, pos: pos,
          columns: [{ name: "c1", cellType: "dropdown", choices: ["a", "b"], pos: pos }],
        },
        {
          type: "paneldynamic", name: "pd", defaultPanelValue: { t1: "a", pos: pos }, pos: pos,
          templateElements: [{ type: "dropdown", name: "t1", choices: ["a", "b"], pos: pos }],
        },
        {
          type: "matrix", name: "mx", rows: ["r1"], columns: ["c1", "c2"], defaultValue: { r1: "c1", pos: pos }, pos: pos,
        },
      ],
    }).findings;
    expect(findings.map(f => f.ruleId + " " + f.message)).toEqual([]);
  });
  test("a pos marker is not a binding and not a locale", () => {
    const findings = lintSurvey({
      pos: pos,
      elements: [
        { type: "text", name: "q1", pos: pos },
        {
          type: "text", name: "q2", pos: pos,
          bindings: { visible: "q1", pos: pos },
          title: { default: "Hello {q1}", de: "Hallo {q1}", pos: pos },
        },
      ],
    }).findings;
    expect(findings.map(f => f.ruleId + " " + f.message)).toEqual([]);
  });
});

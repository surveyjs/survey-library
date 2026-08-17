import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function unknownRefs(json: any, options?: any): Array<ILintFinding> {
  return lintSurvey(json, options).findings.filter(f => f.ruleId === "reference/unknown");
}

describe("reference/unknown - basics", () => {
  test("unknown root with suggestion", () => {
    const findings = unknownRefs({
      elements: [
        { type: "text", name: "price" },
        { type: "text", name: "q2", visibleIf: "{pric} > 10" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("price");
    expect(findings[0].messageData.name).toBe("pric");
  });
  test("resolution is case-insensitive", () => {
    expect(unknownRefs({
      elements: [
        { type: "text", name: "Price" },
        { type: "text", name: "q2", visibleIf: "{PRICE} > 10" },
      ],
    })).toHaveLength(0);
  });
  test("valueName resolves even when name does not match", () => {
    expect(unknownRefs({
      elements: [
        { type: "text", name: "q1", valueName: "income" },
        { type: "text", name: "q2", visibleIf: "{income} > 10" },
      ],
    })).toHaveLength(0);
  });
  test("calculated value names resolve", () => {
    expect(unknownRefs({
      calculatedValues: [{ name: "total", expression: "1 + 2" }],
      elements: [{ type: "text", name: "q1", visibleIf: "{total} > 10" }],
    })).toHaveLength(0);
  });
  test("options.knownVariables resolve", () => {
    expect(unknownRefs({
      elements: [{ type: "text", name: "q1", visibleIf: "{externalVar} = 1" }],
    }, { knownVariables: ["externalVar"] })).toHaveLength(0);
  });
  test("page names resolve", () => {
    expect(unknownRefs({
      pages: [
        { name: "intro", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2", visibleIf: "{intro} notempty" }] },
      ],
    })).toHaveLength(0);
  });
});

describe("reference/unknown - skip filters", () => {
  test("JSON-object literal names are skipped", () => {
    expect(unknownRefs({
      elements: [{ type: "text", name: "q1", visibleIf: "{\"key\": 1} notempty" }],
    })).toHaveLength(0);
  });
  test("$-prefixed element property refs are skipped", () => {
    expect(unknownRefs({
      elements: [{ type: "text", name: "q1", visibleIf: "{$whatever.isVisible} = true" }],
    })).toHaveLength(0);
  });
  test("#-prefix is stripped before resolution", () => {
    const survey = {
      elements: [
        { type: "text", name: "price" },
        { type: "text", name: "q2", visibleIf: "{#price} > 10" },
      ],
    };
    expect(unknownRefs(survey)).toHaveLength(0);
  });
  test(".length suffix is valid when the base is", () => {
    expect(unknownRefs({
      elements: [
        { type: "checkbox", name: "tags", choices: ["a"] },
        { type: "text", name: "q2", visibleIf: "{tags.length} > 1" },
      ],
    })).toHaveLength(0);
  });
  test("-unwrapped postfix resolves against the base name", () => {
    expect(unknownRefs({
      elements: [
        { type: "checkbox", name: "tags", choices: ["a"] },
        { type: "text", name: "q2", visibleIf: "{tags-unwrapped} contains 'a'" },
      ],
    })).toHaveLength(0);
  });
  test("string constants are never analyzed", () => {
    expect(unknownRefs({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "expression", name: "sum", expression: "sumInArray({m1}, 'col1')" },
      ],
    })).toHaveLength(0);
  });
});

describe("reference/unknown - dynamic panel scope", () => {
  const panelSurvey = (visibleIf: string) => ({
    elements: [{
      type: "paneldynamic", name: "members",
      templateElements: [
        { type: "text", name: "firstName" },
        { type: "text", name: "lastName", visibleIf: visibleIf },
      ],
    }],
  });
  test("{panel.x} against a template sibling is clean", () => {
    expect(unknownRefs(panelSurvey("{panel.firstName} notempty"))).toHaveLength(0);
  });
  test("{panel.x} with a wrong name is flagged with suggestion", () => {
    const findings = unknownRefs(panelSurvey("{panel.firstNam} notempty"));
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("firstName");
  });
  test("{panelIndex} inside a template is clean", () => {
    expect(unknownRefs(panelSurvey("{panelIndex} > 0"))).toHaveLength(0);
  });
  test("{prevPanel.x} inside a template is clean", () => {
    expect(unknownRefs(panelSurvey("{prevPanel.firstName} notempty"))).toHaveLength(0);
  });
  test("{panel.x} outside any panel is flagged with a scope hint", () => {
    const findings = unknownRefs({
      elements: [{ type: "text", name: "q1", visibleIf: "{panel.other} = 1" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain("dynamic panel");
  });
  test("bare template sibling name gets a panel.-prefix suggestion", () => {
    const findings = unknownRefs(panelSurvey("{firstName} notempty"));
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("panel.firstName");
  });
  test("template question referencing a global question is clean", () => {
    expect(unknownRefs({
      elements: [
        { type: "text", name: "globalQ" },
        {
          type: "paneldynamic", name: "members",
          templateElements: [{ type: "text", name: "inner", visibleIf: "{globalQ} = 1" }],
        },
      ],
    })).toHaveLength(0);
  });
  test("indexed access {panel[0].inner} is clean, wrong inner name flagged", () => {
    const base = {
      elements: [
        {
          type: "paneldynamic", name: "members",
          templateElements: [{ type: "text", name: "inner" }],
        },
        { type: "text", name: "q2", visibleIf: "{members[0].inner} = 1" },
      ],
    };
    expect(unknownRefs(base)).toHaveLength(0);
    const bad = JSON.parse(JSON.stringify(base));
    bad.elements[1].visibleIf = "{members[0].nope} = 1";
    const findings = unknownRefs(bad);
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.segment).toBe("nope");
  });
});

describe("reference/unknown - static panel scope", () => {
  test("{panel.sibling} in a static panel is clean", () => {
    expect(unknownRefs({
      elements: [{
        type: "panel", name: "p1",
        elements: [
          { type: "text", name: "a" },
          { type: "text", name: "b", visibleIf: "{panel.a} = 1" },
        ],
      }],
    })).toHaveLength(0);
  });
  test("{panel.missing} in a static panel is flagged", () => {
    const findings = unknownRefs({
      elements: [{
        type: "panel", name: "p1",
        elements: [
          { type: "text", name: "a" },
          { type: "text", name: "b", visibleIf: "{panel.c} = 1" },
        ],
      }],
    });
    expect(findings).toHaveLength(1);
  });
});

describe("reference/unknown - matrix scope", () => {
  const matrixSurvey = (visibleIf: string) => ({
    elements: [{
      type: "matrixdynamic", name: "items",
      columns: [
        { name: "price", cellType: "text", inputType: "number" },
        { name: "qty", cellType: "text", inputType: "number", visibleIf: visibleIf },
      ],
    }],
  });
  test("{row.price} in a column condition is clean", () => {
    expect(unknownRefs(matrixSurvey("{row.price} > 0"))).toHaveLength(0);
  });
  test("{row.pricee} is flagged with suggestion", () => {
    const findings = unknownRefs(matrixSurvey("{row.pricee} > 0"));
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("price");
  });
  test("{rowIndex} in a column condition is clean", () => {
    expect(unknownRefs(matrixSurvey("{rowIndex} > 1"))).toHaveLength(0);
  });
  test("{row.x} outside a matrix is flagged with a scope hint", () => {
    const findings = unknownRefs({
      elements: [{ type: "text", name: "q1", visibleIf: "{row.price} > 0" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain("matrix");
  });
  test("a question literally named row resolves outside a matrix", () => {
    expect(unknownRefs({
      elements: [
        { type: "text", name: "row" },
        { type: "text", name: "q2", visibleIf: "{row} = 1" },
      ],
    })).toHaveLength(0);
  });
  test("bare column name gets a row.-prefix suggestion", () => {
    const findings = unknownRefs(matrixSurvey("{price} > 0"));
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("row.price");
  });
  test("detail elements see the row scope", () => {
    expect(unknownRefs({
      elements: [{
        type: "matrixdynamic", name: "items",
        columns: [{ name: "price" }],
        detailPanelMode: "underRow",
        detailElements: [{ type: "text", name: "why", visibleIf: "{row.price} notempty" }],
      }],
    })).toHaveLength(0);
  });
  test("matrixdropdown deep path {md.row1.col1} is validated", () => {
    const base = {
      elements: [
        {
          type: "matrixdropdown", name: "md",
          rows: ["row1", "row2"],
          columns: [{ name: "col1" }],
        },
        { type: "text", name: "q2", visibleIf: "{md.row1.col1} = 1" },
      ],
    };
    expect(unknownRefs(base)).toHaveLength(0);
    const badRow = JSON.parse(JSON.stringify(base));
    badRow.elements[1].visibleIf = "{md.row9.col1} = 1";
    expect(unknownRefs(badRow)).toHaveLength(1);
    const badCol = JSON.parse(JSON.stringify(base));
    badCol.elements[1].visibleIf = "{md.row1.col9} = 1";
    expect(unknownRefs(badCol)).toHaveLength(1);
  });
  test("matrix total-row reference {md-total.col1} is clean", () => {
    expect(unknownRefs({
      elements: [
        {
          type: "matrixdynamic", name: "md",
          columns: [{ name: "col1", totalType: "sum" }],
        },
        { type: "expression", name: "grand", expression: "{md-total.col1}" },
      ],
    })).toHaveLength(0);
  });
});

describe("reference/unknown - item/choice scope", () => {
  test("{item} in choicesVisibleIf is clean", () => {
    expect(unknownRefs({
      elements: [{
        type: "checkbox", name: "q1", choices: ["a", "b"],
        choicesVisibleIf: "{item} != 'b'",
      }],
    })).toHaveLength(0);
  });
  test("{choice} in an itemvalue visibleIf is clean", () => {
    expect(unknownRefs({
      elements: [{
        type: "radiogroup", name: "q1",
        choices: [{ value: "a", visibleIf: "{choice} notempty" }],
      }],
    })).toHaveLength(0);
  });
  test("{item} outside item conditions is flagged", () => {
    const findings = unknownRefs({
      elements: [{ type: "text", name: "q1", visibleIf: "{item} = 1" }],
    });
    expect(findings).toHaveLength(1);
  });
  test("{item} in matrix rowsVisibleIf is clean", () => {
    expect(unknownRefs({
      elements: [{
        type: "matrix", name: "m1",
        rows: ["r1", "r2"], columns: ["c1"],
        rowsVisibleIf: "{item} != 'r2'",
      }],
    })).toHaveLength(0);
  });
});

describe("reference/unknown - subpath validation", () => {
  test("multipletext item paths validated", () => {
    const base = {
      elements: [
        { type: "multipletext", name: "mt", items: [{ name: "item1" }, { name: "item2" }] },
        { type: "text", name: "q2", visibleIf: "{mt.item1} notempty" },
      ],
    };
    expect(unknownRefs(base)).toHaveLength(0);
    const bad = JSON.parse(JSON.stringify(base));
    bad.elements[1].visibleIf = "{mt.item9} notempty";
    const findings = unknownRefs(bad);
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("item1");
  });
  test("composite field paths validated via options.components", () => {
    const components = { fullname: { elementsJSON: [{ type: "text", name: "firstName" }] } };
    expect(unknownRefs({
      elements: [
        { type: "fullname", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1.firstName} notempty" },
      ],
    }, { components: components })).toHaveLength(0);
    const findings = unknownRefs({
      elements: [
        { type: "fullname", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1.firstNme} notempty" },
      ],
    }, { components: components });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("firstName");
  });
  test("paths into unknown question types are lenient", () => {
    const res = lintSurvey({
      elements: [
        { type: "somecustomwidget", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1.anything.deep} notempty" },
      ],
    });
    expect(res.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
  });
  test("{survey.x} is always lenient", () => {
    expect(unknownRefs({
      elements: [{ type: "text", name: "q1", visibleIf: "{survey.pageCount} > 1" }],
    })).toHaveLength(0);
  });
  test("{self} and {parent.x} are lenient", () => {
    expect(unknownRefs({
      elements: [{
        type: "panel", name: "p1",
        elements: [{ type: "text", name: "q1", enableIf: "{parent.anything} notempty" }],
      }],
    })).toHaveLength(0);
  });
});

describe("reference/unknown - other reference sites", () => {
  test("choicesByUrl url refs are validated", () => {
    const findings = unknownRefs({
      elements: [
        { type: "text", name: "country" },
        {
          type: "dropdown", name: "city",
          choicesByUrl: { url: "https://api.example.com/{countryy}/cities" },
        },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[1].choicesByUrl.url");
    expect(findings[0].suggestion).toBe("country");
  });
  test("bindings are validated", () => {
    const findings = unknownRefs({
      elements: [
        { type: "text", name: "count", inputType: "number" },
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }], bindings: { rowCount: "cnt" } },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[1].bindings.rowCount");
  });
  test("expressions in every question prop are scanned", () => {
    const findings = unknownRefs({
      elements: [
        {
          type: "text", name: "q1",
          enableIf: "{missing1} = 1",
          requiredIf: "{missing2} = 1",
          setValueIf: "{missing3} = 1",
          resetValueIf: "{missing4} = 1",
          defaultValueExpression: "{missing5}",
          setValueExpression: "{missing6}",
          minValueExpression: "{missing7}",
          maxValueExpression: "{missing8}",
        },
      ],
    });
    expect(findings).toHaveLength(8);
  });
  test("triggers, validators, completedHtmlOnCondition are scanned", () => {
    const findings = unknownRefs({
      elements: [{
        type: "text", name: "q1",
        validators: [{ type: "expression", expression: "{missingV} = 1" }],
      }],
      triggers: [{ type: "complete", expression: "{missingT} = 1" }],
      completedHtmlOnCondition: [{ expression: "{missingH} = 1", html: "x" }],
      navigateToUrlOnCondition: [{ expression: "{missingU} = 1", url: "x" }],
    });
    expect(findings.map(f => f.messageData.name).sort()).toEqual(
      ["missingH", "missingT", "missingU", "missingV"]);
  });
  test("legacy trigger form is synthesized and validated", () => {
    const findings = unknownRefs({
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "complete", name: "missingQ", operator: "equal", value: 1 }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("triggers[0]");
  });
  test("questions nested in choice items are indexed and scanned", () => {
    const res = lintSurvey({
      elements: [
        {
          type: "radiogroup", name: "q1",
          choices: [{
            value: "a",
            elements: [{ type: "text", name: "nested", visibleIf: "{q1} = 'a'" }],
          }],
        },
        { type: "text", name: "q2", visibleIf: "{nested} notempty" },
      ],
    });
    expect(res.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
  });
});

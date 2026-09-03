import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";
import { withSettings } from "./lint-test-helpers";

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
  test("built-in variables resolve", () => {
    expect(unknownRefs({
      elements: [
        { type: "text", name: "q1", visibleIf: "{pageno} > 1" },
        { type: "text", name: "q2", visibleIf: "{pageCount} > 2 and {questioncount} > 0" },
        { type: "text", name: "q3", visibleIf: "{locale} = 'de'" },
        { type: "text", name: "q4", visibleIf: "{correctedAnswers} + {incorrectAnswers} > 0" },
      ],
    })).toHaveLength(0);
  });
  test("a built-in variable is a variable, not a container", () => {
    const findings = unknownRefs({
      elements: [{ type: "text", name: "q1", visibleIf: "{pageno.title} notempty" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.name).toBe("pageno.title");
  });
  test("a typo in a built-in variable is suggested", () => {
    const findings = unknownRefs({
      elements: [{ type: "text", name: "q1", visibleIf: "{pagno} > 1" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("pageno");
  });
  test("a question wins over the built-in name it shadows", () => {
    expect(unknownRefs({
      elements: [
        { type: "text", name: "locale" },
        { type: "text", name: "q1", visibleIf: "{locale} = 'de'" },
      ],
    })).toHaveLength(0);
  });
  test("a page name is not an expression value", () => {
    const findings = unknownRefs({
      pages: [
        { name: "intro", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2", visibleIf: "{intro} notempty" }] },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.name).toBe("intro");
  });
  test("a page is not a container for its questions either", () => {
    const findings = unknownRefs({
      pages: [
        { name: "intro", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2", visibleIf: "{intro.q1} notempty" }] },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.name).toBe("intro.q1");
  });
  test("a page property reference is still skipped", () => {
    expect(unknownRefs({
      pages: [
        { name: "intro", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2", visibleIf: "{$intro.isVisible} = true" }] },
      ],
    })).toHaveLength(0);
  });
  test("a question wins over the page name it shares", () => {
    expect(unknownRefs({
      pages: [
        { name: "intro", elements: [{ type: "text", name: "intro" }] },
        { name: "p2", elements: [{ type: "text", name: "q2", visibleIf: "{intro} notempty" }] },
      ],
    })).toHaveLength(0);
  });
  test("a page name is not suggested for a typo in an expression", () => {
    const findings = unknownRefs({
      pages: [
        { name: "price", elements: [{ type: "text", name: "amount" }] },
        { name: "p2", elements: [{ type: "text", name: "q2", visibleIf: "{pric} > 10" }] },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBeUndefined();
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
  test("{item} in a matrix column choicesVisibleIf is clean", () => {
    expect(unknownRefs({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [{
          name: "col2", cellType: "dropdown", choices: ["a", "b"],
          choicesVisibleIf: "{item} != 'b'",
        }],
      }],
    })).toHaveLength(0);
  });
  test("{column} in a matrix column choicesEnableIf is clean", () => {
    expect(unknownRefs({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [{
          name: "col2", cellType: "dropdown", choices: ["a", "b"],
          choicesEnableIf: "{column} notempty",
        }],
      }],
    })).toHaveLength(0);
  });
  test("a column choicesVisibleIf still resolves row. names", () => {
    expect(unknownRefs({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "dropdown", choices: ["a"], choicesVisibleIf: "{row.nosuch} = 1" },
        ],
      }],
    })).toHaveLength(1);
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
  // the url is scanned with TextPreProcessor, the same scanner the runtime uses, so the
  // delimiters an application customizes apply here too
  test("choicesByUrl refs are found through custom expression delimiters", () => {
    withSettings({ expressionVariableDelimiters: { start: "[[", end: "]]" } }, () => {
      const findings = unknownRefs({
        elements: [
          { type: "text", name: "country" },
          {
            type: "dropdown", name: "city",
            choicesByUrl: { url: "https://api.example.com/[[countryy]]/cities" },
          },
        ],
      });
      expect(findings).toHaveLength(1);
      expect(findings[0].path).toBe("elements[1].choicesByUrl.url");
      expect(findings[0].suggestion).toBe("country");
    });
  });
  test("several url refs are reported in document order", () => {
    const findings = unknownRefs({
      elements: [{
        type: "dropdown", name: "city",
        choicesByUrl: { url: "https://api.example.com/{aaa}/{bbb}" },
      }],
    });
    expect(findings).toHaveLength(2);
    expect(findings.map(f => f.messageData.name)).toEqual(["aaa", "bbb"]);
  });
  test("a url placeholder with a colon is not a reference", () => {
    expect(unknownRefs({
      elements: [{
        type: "dropdown", name: "city",
        choicesByUrl: { url: "https://api.example.com/cities?f={\"a\": 1}" },
      }],
    })).toHaveLength(0);
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

describe("reference/unknown - keyName", () => {
  test("a matrixdynamic keyName naming no column is flagged", () => {
    const findings = unknownRefs({
      elements: [{
        type: "matrixdynamic", name: "m6", keyName: "coll",
        columns: [{ name: "col1" }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("keyNameNotFound");
    expect(findings[0].suggestion).toBe("col1");
    expect(findings[0].path).toContain("keyName");
  });
  test("a paneldynamic keyName naming no template question is flagged", () => {
    const findings = unknownRefs({
      elements: [{
        type: "paneldynamic", name: "p4", keyName: "qTypo",
        templateElements: [{ type: "text", name: "q1" }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("keyNameNotFound");
  });
  test("a keyName matching a column is clean", () => {
    expect(unknownRefs({
      elements: [{
        type: "matrixdynamic", name: "m6", keyName: "col1",
        columns: [{ name: "col1" }],
      }],
    })).toHaveLength(0);
  });
  test("a keyName matching a template question valueName is clean", () => {
    expect(unknownRefs({
      elements: [{
        type: "paneldynamic", name: "p4", keyName: "v1",
        templateElements: [{ type: "text", name: "q1", valueName: "v1" }],
      }],
    })).toHaveLength(0);
  });
  test("a keyName matching a question nested in a template panel is clean", () => {
    expect(unknownRefs({
      elements: [{
        type: "paneldynamic", name: "p5", keyName: "q2",
        templateElements: [{ type: "panel", name: "inner", elements: [
          { type: "text", name: "q2" },
        ] }],
      }],
    })).toHaveLength(0);
  });
});

describe("reference/unknown - text piping", () => {
  test("a name in a title is validated", () => {
    const findings = unknownRefs({
      pages: [{
        name: "page1",
        elements: [
          { type: "radiogroup", name: "question3", title: "{someVarIs} is here " },
          { type: "text", name: "question4", visibleIf: "{someVarIs}" },
          {
            type: "paneldynamic", name: "question1", templateTitle: "{someVarIs} is here ",
            templateElements: [{ type: "text", name: "question2" }],
          },
        ],
      }],
    });
    expect(findings.map(f => f.path)).toEqual([
      "pages[0].elements[0].title",
      "pages[0].elements[1].visibleIf",
      "pages[0].elements[2].templateTitle",
    ]);
    expect(findings[0].messageData.refKind).toBe("textPiping");
    expect(findings[0].reason).toBe("notFound");
  });
  test("a title naming an existing question is clean", () => {
    expect(unknownRefs({
      elements: [
        { type: "text", name: "question4" },
        { type: "text", name: "q2", title: "{question4} is here" },
      ],
    })).toHaveLength(0);
  });
  test("piping is validated in every localizable property", () => {
    const findings = unknownRefs({
      elements: [
        { type: "text", name: "q1", description: "{nosuch1}", placeholder: "{nosuch2}" },
        { type: "html", name: "h1", html: "{nosuch3}" },
        { type: "dropdown", name: "d1", choices: [{ value: 1, text: "{nosuch4}" }] },
        {
          type: "matrixdropdown", name: "m1", rows: ["r1"],
          columns: [{ name: "col1", cellHint: "{nosuch5}" }],
        },
        { type: "multipletext", name: "mt1", items: [{ name: "i1", title: "{nosuch6}" }] },
        { type: "panel", name: "p1", title: "{nosuch7}" },
      ],
    });
    expect(findings.map(f => f.messageData.name).sort()).toEqual([
      "nosuch1", "nosuch2", "nosuch3", "nosuch4", "nosuch5", "nosuch6", "nosuch7",
    ]);
  });
  test("piping is validated in page and survey properties", () => {
    const findings = unknownRefs({
      completedHtml: "<b>{nosuch1}</b>",
      pages: [{ name: "page1", title: "{nosuch2}", elements: [{ type: "text", name: "q1" }] }],
    });
    expect(findings.map(f => f.path)).toEqual(["completedHtml", "pages[0].title"]);
  });
  test("a dynamic panel template resolves its own scope", () => {
    expect(unknownRefs({
      elements: [{
        type: "paneldynamic", name: "p1",
        templateTitle: "{panel.q1} {panelIndex} {visiblePanelIndex}",
        templateDescription: "{panel.q1}",
        templateElements: [{ type: "text", name: "q1" }],
      }],
    })).toHaveLength(0);
  });
  test("a template question named without its prefix is reported with a hint", () => {
    const findings = unknownRefs({
      elements: [{
        type: "paneldynamic", name: "p1", templateTitle: "{q1}",
        templateElements: [{ type: "text", name: "q1" }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("panel.q1");
    expect(findings[0].hint.reason).toBe("panelQuestion");
  });
  test("a matrix single input title resolves the row scope", () => {
    expect(unknownRefs({
      elements: [{
        type: "matrixdynamic", name: "m1",
        singleInputTitleTemplate: "Row {rowIndex}: {row.col1}",
        columns: [{ name: "col1" }],
      }],
    })).toHaveLength(0);
  });
  test("an unknown column in a matrix single input title is reported", () => {
    const findings = unknownRefs({
      elements: [{
        type: "matrixdynamic", name: "m1",
        singleInputTitleTemplate: "{row.nosuchcol}",
        columns: [{ name: "col1" }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("scopedUnknown");
  });
  test("a per-locale title object is walked", () => {
    const findings = unknownRefs({
      elements: [{ type: "text", name: "q1", title: { default: "{bad1}", de: "{bad2}" } }],
    });
    expect(findings.map(f => f.path)).toEqual([
      "elements[0].title.de", "elements[0].title.default",
    ]);
  });
  test("format placeholders are not references", () => {
    expect(unknownRefs({
      elements: [
        { type: "expression", name: "e1", expression: "1", format: "{0} items" },
        { type: "text", name: "q1", inputType: "number", min: 1, minErrorText: "at least {0}" },
        {
          type: "matrixdynamic", name: "m1", showTotal: true,
          columns: [{ name: "col1", totalType: "sum", totalFormat: "Total: {0}" }],
        },
      ],
    })).toHaveLength(0);
  });
  // the survey reads these out of the template itself, and processText never sees the string
  test("the question title template is not a piping text", () => {
    expect(unknownRefs({
      questionTitleTemplate: "{no}. {title} {require}",
      elements: [{ type: "text", name: "q1" }],
    })).toHaveLength(0);
  });
  test("a token with a colon is not a reference", () => {
    expect(unknownRefs({
      elements: [{ type: "text", name: "q1", title: "{nosuch:x}" }],
    })).toHaveLength(0);
  });
  test("inline css in html is not a reference", () => {
    expect(unknownRefs({
      elements: [{
        type: "html", name: "h1",
        html: "<style>p { color: red } @media print { .a { margin: 0 } }</style><p>ok</p>",
      }],
    })).toHaveLength(0);
  });
  test("a regex quantifier is not a reference", () => {
    expect(unknownRefs({
      elements: [{
        type: "text", name: "q1",
        validators: [{ type: "regex", regex: "^\d{2,3}$", text: "wrong" }],
      }],
    })).toHaveLength(0);
  });
  test("a dataList entry is not scanned", () => {
    expect(unknownRefs({
      elements: [{ type: "text", name: "q1", dataList: ["{bad}"] }],
    })).toHaveLength(0);
  });
  test("piping names are found through custom expression delimiters", () => {
    withSettings({ expressionVariableDelimiters: { start: "[[", end: "]]" } }, () => {
      const findings = unknownRefs({
        elements: [
          { type: "text", name: "country" },
          { type: "text", name: "q2", title: "[[countryy]]" },
        ],
      });
      expect(findings).toHaveLength(1);
      expect(findings[0].suggestion).toBe("country");
    });
  });
  test("knownVariables and suppress silence a piping finding", () => {
    const json = {
      elements: [{ type: "text", name: "q1", title: "{someVarIs}" }],
    };
    expect(unknownRefs(json, { knownVariables: ["someVarIs"] })).toHaveLength(0);
    expect(unknownRefs(json, { suppress: [{ path: "elements[0].title" }] })).toHaveLength(0);
  });
});

describe("reference/unknown - piped properties outside the localizable ones", () => {
  // path is processed with the very same processor as url, and a name missing from either of
  // them blanks both, so the request never runs
  test("the choicesByUrl path is validated", () => {
    const findings = unknownRefs({
      elements: [
        { type: "text", name: "country" },
        {
          type: "dropdown", name: "city",
          choicesByUrl: { url: "https://api.example.com/{country}/cities", path: "data.{countryy}" },
        },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[1].choicesByUrl.path");
    expect(findings[0].suggestion).toBe("country");
    expect(findings[0].messageData.refKind).toBe("choicesByUrlVariable");
  });
  test("survey navigation and completion texts are validated", () => {
    const findings = unknownRefs({
      navigateToUrl: "https://x/{nosuch1}",
      completedHtmlOnCondition: [{ expression: "{q1} notempty", html: "{nosuch2}" }],
      navigateToUrlOnCondition: [{ expression: "{q1} notempty", url: "https://x/{nosuch3}" }],
      elements: [{ type: "text", name: "q1" }],
    });
    expect(findings.map(f => f.path)).toEqual([
      "completedHtmlOnCondition[0].html",
      "navigateToUrl",
      "navigateToUrlOnCondition[0].url",
    ]);
  });
  test("a known name in those texts is clean", () => {
    expect(unknownRefs({
      navigateToUrl: "https://x/{q1}",
      completedHtmlOnCondition: [{ expression: "{q1} notempty", html: "{q1}" }],
      navigateToUrlOnCondition: [{ expression: "{q1} notempty", url: "https://x/{q1}" }],
      elements: [{ type: "text", name: "q1" }],
    })).toHaveLength(0);
  });
});

describe("reference/unknown - names in function arguments", () => {
  const matrixJson = {
    elements: [
      { type: "text", name: "q1" },
      { type: "matrixdynamic", name: "m1", columns: [{ name: "col1", cellType: "text" }] },
    ],
  };
  function withExpression(expression: string, json: any = matrixJson): Array<ILintFinding> {
    const copy = JSON.parse(JSON.stringify(json));
    copy.elements.push({ type: "expression", name: "e1", expression: expression });
    return unknownRefs(copy);
  }
  test("an unknown column of an inArray function is reported", () => {
    const findings = withExpression("sumInArray({m1}, 'nosuchcol')");
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("functionArgNotFound");
    expect(findings[0].messageData.refKind).toBe("functionArgument");
    expect(findings[0].messageData.containerName).toBe("m1");
    expect(withExpression("sumInArray({m1}, 'col11')")[0].suggestion).toBe("col1");
  });
  test("a listed column of an inArray function is clean", () => {
    expect(withExpression("sumInArray({m1}, 'col1')")).toHaveLength(0);
    expect(withExpression("avgInArray({m1}, 'col1', '{row.col1} > 1')")).toHaveLength(0);
  });
  test("a template question of an inArray function resolves", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [{ type: "text", name: "tq1", inputType: "number" }],
      }],
    };
    expect(withExpression("sumInArray({p1}, 'tq1')", json)).toHaveLength(0);
    expect(withExpression("sumInArray({p1}, 'tq2')", json)).toHaveLength(1);
  });
  test("the return-column argument of an inArray function is resolved too", () => {
    expect(withExpression("minInArray({m1}, 'col1', 'col1')")).toHaveLength(0);
    expect(withExpression("minInArray({m1}, 'col1', 'nosuchcol')")).toHaveLength(1);
  });
  test("an unresolved first argument is reported once", () => {
    const findings = withExpression("sumInArray({nosuchq}, 'anything')");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.name).toBe("nosuchq");
  });
  test("displayValue, getComment, propertyValue and isContainerReady are resolved", () => {
    expect(withExpression("displayValue('q1')")).toHaveLength(0);
    expect(withExpression("displayValue('nosuchq')")).toHaveLength(1);
    expect(withExpression("getComment('nosuchq')")).toHaveLength(1);
    expect(withExpression("propertyValue('nosuchq', 'isVisible')")).toHaveLength(1);
    expect(withExpression("isContainerReady('nosuchpanel')")).toHaveLength(1);
  });
  test("a computed argument is not a name", () => {
    expect(withExpression("displayValue({q1})")).toHaveLength(0);
    expect(withExpression("sumInArray({m1}, {q1})")).toHaveLength(0);
  });
  test("a cell expression names a sibling column without a prefix", () => {
    expect(unknownRefs({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "expression", expression: "displayValue('col1')" },
        ],
      }],
    })).toHaveLength(0);
  });
  test("a page and a panel answer isContainerReady", () => {
    expect(unknownRefs({
      pages: [{
        name: "page1",
        elements: [
          { type: "panel", name: "p1", elements: [{ type: "text", name: "q1" }] },
          { type: "text", name: "q2", visibleIf: "isContainerReady('page1')" },
          { type: "text", name: "q3", visibleIf: "isContainerReady('p1')" },
        ],
      }],
    })).toHaveLength(0);
  });
});

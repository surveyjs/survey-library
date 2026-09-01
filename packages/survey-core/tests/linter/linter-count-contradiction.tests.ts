import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "element/count-contradiction");
}

describe("element/count-contradiction - matrixdynamic", () => {
  test("minRowCount above maxRowCount is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [{ name: "c" }],
        minRowCount: 5, maxRowCount: 3,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("minAboveMax");
    expect(findings[0].severity).toBe("warning");
  });
  test("rowCount above maxRowCount is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [{ name: "c" }],
        rowCount: 10, maxRowCount: 3,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("countOutOfBounds");
  });
  test("rowCount below minRowCount is flagged", () => {
    expect(byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [{ name: "c" }],
        rowCount: 1, minRowCount: 3,
      }],
    })).toHaveLength(1);
  });
  test("a count checked against a default bound stays silent", () => {
    expect(byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c" }], rowCount: 500 },
        { type: "matrixdynamic", name: "m2", columns: [{ name: "c" }], minRowCount: 5 },
      ],
    })).toHaveLength(0);
  });
  test("a consistent authored triple is clean", () => {
    expect(byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [{ name: "c" }],
        rowCount: 3, minRowCount: 1, maxRowCount: 5,
      }],
    })).toHaveLength(0);
  });
});

describe("element/count-contradiction - paneldynamic", () => {
  test("panelCount below minPanelCount is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [{ type: "text", name: "q" }],
        panelCount: 0, minPanelCount: 2,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("countOutOfBounds");
  });
  test("minPanelCount above maxPanelCount is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [{ type: "text", name: "q" }],
        minPanelCount: 5, maxPanelCount: 2,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("minAboveMax");
  });
  test("count props on an unrelated question type are ignored", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", rowCount: 10, maxRowCount: 3 }],
    })).toHaveLength(0);
  });
});

describe("element/count-contradiction - rating bounds", () => {
  test("rateMin above rateMax is flagged", () => {
    const findings = byRule({ elements: [{ type: "rating", name: "r1", rateMin: 5, rateMax: 3 }] });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("minAboveMax");
    expect(findings[0].path).toBe("elements[0].rateMin");
    expect(findings[0].messageData.minProp).toBe("rateMin");
  });
  test("rateMin equal to rateMax leaves no value between them", () => {
    expect(byRule({ elements: [{ type: "rating", name: "r1", rateMin: 3, rateMax: 3 }] })).toHaveLength(1);
  });
  test("a single authored bound stays silent - the model recomputes the other", () => {
    expect(byRule({ elements: [{ type: "rating", name: "r1", rateMin: 8 }] })).toHaveLength(0);
  });
  test("bounds are ignored while rateValues list the scale", () => {
    expect(byRule({
      elements: [{ type: "rating", name: "r1", rateValues: [1, 2, 3], rateMin: 5, rateMax: 3 }],
    })).toHaveLength(0);
  });
  test("a consistent pair is clean", () => {
    expect(byRule({ elements: [{ type: "rating", name: "r1", rateMin: 1, rateMax: 10 }] })).toHaveLength(0);
  });
});

describe("element/count-contradiction - text bounds", () => {
  test("a numeric min above max is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", inputType: "number", min: 10, max: 5 }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("minAboveMax");
  });
  test("a date min above max is flagged", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", inputType: "date", min: "2025-01-01", max: "2020-01-01" }],
    })).toHaveLength(1);
  });
  test("bounds on an inputType that has none are left to property/dead", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", min: 10, max: 5 }],
    })).toHaveLength(0);
  });
  test("a bound computed at runtime is undecidable", () => {
    expect(byRule({
      elements: [{
        type: "text", name: "q1", inputType: "number", min: 10, maxValueExpression: "{other}",
      }],
    })).toHaveLength(0);
  });
  test("time and week are out of scope - the runtime compares them with its own arithmetic", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", inputType: "time", min: "18:00", max: "09:00" },
        { type: "text", name: "q2", inputType: "week", min: "2024-W20", max: "2024-W02" },
      ],
    })).toHaveLength(0);
  });
  test("a matrix column and a multipletext item carry the same bounds", () => {
    const findings = byRule({
      elements: [
        {
          type: "matrixdynamic", name: "m1",
          columns: [{ name: "c1", cellType: "text", inputType: "number", min: 10, max: 5 }],
        },
        {
          type: "multipletext", name: "mt1",
          items: [{ name: "i1", inputType: "number", min: 10, max: 5 }],
        },
      ],
    });
    expect(findings).toHaveLength(2);
    expect(findings.map(f => f.path).sort())
      .toEqual(["elements[0].columns[0].min", "elements[1].items[0].min"]);
  });
});

describe("element/count-contradiction - slider bounds", () => {
  test("min above max is flagged", () => {
    expect(byRule({ elements: [{ type: "slider", name: "s1", min: 100, max: 0 }] })).toHaveLength(1);
  });
  test("minRangeLength above maxRangeLength is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "slider", name: "s1", sliderType: "range", minRangeLength: 10, maxRangeLength: 2,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.minProp).toBe("minRangeLength");
  });
  test("range lengths of a single slider are inert", () => {
    expect(byRule({
      elements: [{ type: "slider", name: "s1", minRangeLength: 10, maxRangeLength: 2 }],
    })).toHaveLength(0);
  });
});

describe("element/count-contradiction - selected choices", () => {
  test("minSelectedChoices above maxSelectedChoices is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "checkbox", name: "q1", choices: ["a", "b", "c"],
        minSelectedChoices: 3, maxSelectedChoices: 2,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("minAboveMax");
  });
  test("a zero bound is switched off, not a conflict", () => {
    expect(byRule({
      elements: [{
        type: "checkbox", name: "q1", choices: ["a", "b"], minSelectedChoices: 2, maxSelectedChoices: 0,
      }],
    })).toHaveLength(0);
  });
  test("a ranking pair counts only while selectToRankEnabled", () => {
    expect(byRule({
      elements: [{
        type: "ranking", name: "q1", choices: ["a", "b", "c"], selectToRankEnabled: true,
        minSelectedChoices: 3, maxSelectedChoices: 2,
      }],
    })).toHaveLength(1);
    expect(byRule({
      elements: [{
        type: "ranking", name: "q1", choices: ["a", "b", "c"],
        minSelectedChoices: 3, maxSelectedChoices: 2,
      }],
    })).toHaveLength(0);
  });
});

describe("element/count-contradiction - fraction digits", () => {
  test("minimumFractionDigits above maximumFractionDigits is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "expression", name: "e1", expression: "1/3",
        minimumFractionDigits: 4, maximumFractionDigits: 2,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.minProp).toBe("minimumFractionDigits");
  });
  test("the -1 default means \"unset\" and never conflicts", () => {
    expect(byRule({
      elements: [{
        type: "expression", name: "e1", expression: "1/3",
        minimumFractionDigits: 4, maximumFractionDigits: -1,
      }],
    })).toHaveLength(0);
  });
  test("the totals of a matrix column carry the same pair", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [{
          name: "c1", cellType: "text", inputType: "number", totalType: "sum",
          totalMinimumFractionDigits: 4, totalMaximumFractionDigits: 2,
        }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[0].columns[0].totalMinimumFractionDigits");
  });
});

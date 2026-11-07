import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { Serializer } from "../../src/jsonobject";
import { getDataNestingKey } from "../../src/panel-data-scope";
import { lintSurvey, ILintFinding, ISurveyLintOptions, SurveyLintHintReasons } from "../../src/linter/index";
import { getLintDataNestingKey } from "../../src/linter/data-nesting";
import { expectFixSettles } from "./lint-test-helpers";

// Nested data (decisions N1-N13 of prompts/nested-data): a panel or a page with a valueName - or every
// panel / page in a by-name dataNesting mode - stores its questions' values in an object under its key.
// The linter reads the JSON, so it has to know the shape the runtime gives the data.

function findingsOf(json: any, ruleId?: string, options?: ISurveyLintOptions): Array<ILintFinding> {
  return lintSurvey(json, options).findings.filter(f => !ruleId || f.ruleId === ruleId);
}
function brief(findings: Array<ILintFinding>): Array<string> {
  return findings.map(f => f.ruleId + "/" + f.reason + " @ " + f.path);
}
function refFindings(json: any): Array<ILintFinding> {
  return findingsOf(json, "reference/unknown");
}
// errors and warnings: a by-name mode under generated names gets its nesting/generated-key hints
function defects(json: any): Array<ILintFinding> {
  return findingsOf(json).filter(f => f.severity !== "info");
}

// The example survey of design-01.
function exampleSurvey(): any {
  return {
    pages: [
      { name: "page1", elements: [
        { type: "text", name: "q0" },
        { type: "panel", name: "panel1", valueName: "address", elements: [
          { type: "text", name: "street" },
          { type: "text", name: "city", showCommentArea: true },
          { type: "panel", name: "panel2", elements: [{ type: "text", name: "zip" }] },
        ] },
      ] },
      { name: "page2", valueName: "step2", elements: [{ type: "text", name: "q3" }] },
    ],
  };
}

describe("linter nested data: the key rule", () => {
  test("the linter's copy of the key rule equals the core's getDataNestingKey", () => {
    const modes = ["auto", "none", "panel", "page", "panelAndPage", "unknownMode", undefined];
    const kinds = ["panel", "page", ""];
    const keys = [["", ""], ["vn", ""], ["", "nm"], ["vn", "nm"]];
    modes.forEach(mode => kinds.forEach(kind => keys.forEach(pair => {
      expect(getLintDataNestingKey(mode, kind, pair[0], pair[1]), mode + "/" + kind + "/" + pair.join(","))
        .toBe(getDataNestingKey(mode, kind, pair[0], pair[1]));
    })));
  });
});

describe("linter nested data: no false findings", () => {
  test("the design-01 example survey is clean, references included", () => {
    const json = exampleSurvey();
    json.pages[1].elements.push(
      { type: "text", name: "r1", visibleIf: "{address.street} = 'Main' and {street} = 'Main'" },
      { type: "text", name: "r2", visibleIf: "{address} notempty and {step2.q3} = 3 and {q3} = 3" },
      { type: "text", name: "r3", visibleIf: "{address.zip} = '1' and {zip} = '1' and {city-Comment} notempty" },
      { type: "text", name: "r4", visibleIf: "{address.city-Comment} notempty", title: "{address.street}, {zip}" },
    );
    expect(brief(findingsOf(json))).toEqual([]);
  });
  test("each by-name mode with its typical references is clean", () => {
    const json: any = {
      dataNesting: "panelAndPage",
      pages: [
        { name: "page1", elements: [
          { type: "text", name: "q0" },
          { type: "panel", name: "info", elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2", visibleIf: "{q1} = 'x' and {info.q1} = 'x' and {page1.info.q1} = 'x'" },
          ] },
          { type: "text", name: "q3", visibleIf: "{info.q1} = 'x' and {page1.q0} = 1" },
        ] },
        { name: "page2", elements: [
          { type: "text", name: "q4", visibleIf: "{page1.info.q1} = 'x' and {q1} = 'x' and {page1} notempty" },
        ] },
      ],
    };
    expect(brief(defects(json))).toEqual([]);
    json.dataNesting = "panel";
    // pages do not nest here: {page1.info.q1} names nothing
    json.pages[0].elements[1].elements[1].visibleIf = "{q1} = 'x' and {info.q1} = 'x'";
    json.pages[0].elements[2].visibleIf = "{info.q1} = 'x' and {q0} = 1";
    json.pages[1].elements[0].visibleIf = "{info.q1} = 'x' and {q1} = 'x'";
    expect(brief(defects(json))).toEqual([]);
    expect(brief(refFindings(Object.assign({}, json, { calculatedValues: [{ name: "c", expression: "{page1.info.q1}" }] }))))
      .toEqual(["reference/unknown/notFound @ calculatedValues[0].expression"]);
    json.dataNesting = "page";
    json.pages[0].elements[1].elements[1].visibleIf = "{q1} = 'x' and {page1.q1} = 'x'";
    json.pages[0].elements[2].visibleIf = "{q1} = 'x' and {page1.q0} = 1";
    json.pages[1].elements[0].visibleIf = "{page1.q1} = 'x' and {q1} = 'x'";
    expect(brief(defects(json))).toEqual([]);
  });
  test("root elements nest under page1 in the page modes", () => {
    const json = {
      dataNesting: "page",
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} = 1 and {page1.q1} = 1" },
      ],
    };
    expect(brief(findingsOf(json, "reference/unknown"))).toEqual([]);
  });
  test("an inner question with its own valueName answers it inside the container", () => {
    const json = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [
          { type: "text", name: "zip", valueName: "z" },
          { type: "text", name: "q1", visibleIf: "{z} = 1 and {zip} = 1 and {address.z} = 1" },
        ] },
        { type: "text", name: "q2", visibleIf: "{zip} = 1 and {address.z} = 1" },
      ],
    };
    expect(brief(refFindings(json))).toEqual([]);
  });
  test("a container key equal to an inner question's name (4.4) is not reported", () => {
    const json = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "text", name: "address" }] },
        { type: "text", name: "q2", visibleIf: "{address.address} = 'x' and {address} notempty" },
      ],
    };
    expect(brief(findingsOf(json))).toEqual([]);
  });
  test("two containers sharing one key share one object (D4)", () => {
    const json = {
      pages: [
        { name: "p1", elements: [{ type: "panel", name: "a1", valueName: "address", elements: [{ type: "text", name: "street" }] }] },
        { name: "p2", elements: [
          { type: "panel", name: "a2", valueName: "address", elements: [{ type: "text", name: "city" }] },
          { type: "text", name: "q", visibleIf: "{address.street} = 'x' and {address.city} = 'y'" },
        ] },
      ],
    };
    expect(brief(findingsOf(json))).toEqual([]);
  });
  test("a dotted container key is addressable (D11)", () => {
    const json = {
      elements: [
        { type: "panel", name: "p", valueName: "a.b", elements: [{ type: "text", name: "w" }] },
        { type: "text", name: "q", visibleIf: "{a.b.w} = 'y'" },
      ],
    };
    expect(brief(findingsOf(json))).toEqual([]);
  });
  test("matrices, multiple texts and comments inside the object", () => {
    const json = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [
          { type: "matrixdropdown", name: "m", rows: ["r"], columns: [{ name: "c", cellType: "text", totalType: "sum" }] },
          { type: "multipletext", name: "mt", items: [{ name: "i1" }] },
          { type: "dropdown", name: "kind", choices: ["a", "b"], showOtherItem: true },
        ] },
        { type: "text", name: "q", visibleIf: "{address.m.r.c} = 1 and {m.r.c} = 1 and {address.mt.i1} = 'z' and {mt.i1} = 'z'" },
        { type: "text", name: "q2", visibleIf: "{kind-Comment} notempty and {address.kind-Comment} notempty and {address.m-total.c} > 1" },
      ],
    };
    expect(brief(findingsOf(json))).toEqual([]);
  });
});

describe("linter nested data: references", () => {
  test("an unknown segment inside a container's object", () => {
    const json = exampleSurvey();
    json.pages[1].elements.push({ type: "text", name: "r1", visibleIf: "{address.stret} = 'Main'" });
    const findings = refFindings(json);
    expect(brief(findings)).toEqual(["reference/unknown/inContainer @ pages[1].elements[1].visibleIf"]);
    expect(findings[0].suggestion).toBe("street");
    expect(findings[0].message).toContain("\"stret\" is not found in \"address\", the object a panel stores its questions' values in");
    const fixed = expectFixSettles(json, findings[0]);
    expect(fixed.pages[1].elements[1].visibleIf).toBe("{address.street} = 'Main'");
  });
  test("an unknown key inside the object is reported though the runtime reads it from the raw data", () => {
    const json = exampleSurvey();
    json.pages[1].elements.push({ type: "text", name: "r1", visibleIf: "{address.foo} = 1" });
    expect(brief(refFindings(json))).toEqual(["reference/unknown/inContainer @ pages[1].elements[1].visibleIf"]);
  });
  test("an inner valueName does not answer at the root (D9)", () => {
    const json = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "text", name: "zip", valueName: "z" }] },
        { type: "text", name: "q", visibleIf: "{z} = 1" },
      ],
    };
    expect(brief(refFindings(json))).toEqual(["reference/unknown/notFound @ elements[1].visibleIf"]);
  });
  test("a key only answers at its own level: no deep search", () => {
    const json: any = {
      dataNesting: "panelAndPage",
      pages: [
        { name: "page1", elements: [{ type: "panel", name: "info", elements: [{ type: "text", name: "q1" }] }] },
        { name: "page2", elements: [{ type: "text", name: "q2", visibleIf: "{info.q1} = 1" }] },
      ],
    };
    expect(brief(refFindings(json))).toEqual(["reference/unknown/notFound @ pages[1].elements[0].visibleIf"]);
  });
  test("a path into a question's own value is still checked inside the object", () => {
    const json = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "multipletext", name: "mt", items: [{ name: "i1" }] }] },
        { type: "text", name: "q", visibleIf: "{address.mt.i2} = 1" },
      ],
    };
    const findings = refFindings(json);
    expect(brief(findings)).toEqual(["reference/unknown/inContainer @ elements[1].visibleIf"]);
    expect(findings[0].suggestion).toBe("i1");
  });
  test("\"none\" keeps the data flat: the path is not found, with a hint naming the container", () => {
    const json = exampleSurvey();
    (<any>json).dataNesting = "none";
    json.pages[1].elements.push({ type: "text", name: "r1", visibleIf: "{address.street} = 'Main' and {street} = 'Main'" });
    const findings = refFindings(json);
    expect(brief(findings)).toEqual(["reference/unknown/notFound @ pages[1].elements[1].visibleIf"]);
    expect(findings[0].hint).toEqual({ reason: SurveyLintHintReasons.containerKeyNotNesting, name: "address" });
    expect(findings[0].message).toContain("\"none\"");
  });
  test("a host default of \"none\" is read from the serializer", () => {
    const prop = Serializer.findProperty("survey", "dataNesting");
    const saved = prop.defaultValue;
    prop.defaultValue = "none";
    try {
      const json = exampleSurvey();
      json.pages[1].elements.push({ type: "text", name: "r1", visibleIf: "{address.street} = 'Main'" });
      expect(brief(refFindings(json))).toEqual(["reference/unknown/notFound @ pages[1].elements[1].visibleIf"]);
    } finally {
      prop.defaultValue = saved;
    }
  });
  test("a valueName inside a dynamic panel keeps the record flat", () => {
    const json = {
      elements: [
        { type: "paneldynamic", name: "pd", templateElements: [
          { type: "panel", name: "inner", valueName: "box", elements: [{ type: "text", name: "t" }] },
          { type: "text", name: "t2", visibleIf: "{panel.t} = 1" },
        ] },
        { type: "text", name: "q", visibleIf: "{pd[0].t} = 1 and {pd[0].box} = 1" },
      ],
    };
    const findings = refFindings(json);
    expect(brief(findings)).toEqual(["reference/unknown/inContainer @ elements[1].visibleIf"]);
  });
  test("an object is checked as an object", () => {
    const json = exampleSurvey();
    json.pages[1].elements.push({ type: "text", name: "r1", visibleIf: "{address} > 3" });
    expect(brief(findingsOf(json, "expression/type-mismatch"))).toEqual(["expression/type-mismatch/non-scalar @ pages[1].elements[1].visibleIf"]);
  });
  test("a path reaches the inner question, so its choices are checked", () => {
    const json = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "dropdown", name: "kind", choices: ["home", "work"] }] },
        { type: "text", name: "q", visibleIf: "{address.kind} = 'hom'" },
      ],
    };
    expect(brief(findingsOf(json, "expression/unknown-choice"))).toEqual(["expression/unknown-choice/notAmongChoices @ elements[1].visibleIf"]);
  });
  test("text piping resolves paths too", () => {
    const json = exampleSurvey();
    json.pages[1].elements.push({ type: "text", name: "r1", title: "{address.street} {address.nope}" });
    expect(brief(refFindings(json))).toEqual(["reference/unknown/inContainer @ pages[1].elements[1].title"]);
  });
});

describe("linter nested data: runtime parity of references", () => {
  const json: any = {
    dataNesting: "panelAndPage",
    pages: [
      { name: "page1", elements: [
        { type: "text", name: "q0" },
        { type: "panel", name: "info", valueName: "address", elements: [
          { type: "text", name: "street" },
          { type: "text", name: "zip", valueName: "z" },
          { type: "panel", name: "deep", elements: [{ type: "text", name: "flat" }] },
        ] },
      ] },
      { name: "page2", elements: [{ type: "text", name: "q3" }] },
    ],
  };
  const data = { page1: { q0: 1, address: { street: "s", z: "1", deep: { flat: "f" } } }, page2: { q3: 3 } };
  const refs = [
    "q0", "street", "zip", "z", "flat", "q3", "address", "page1", "page2",
    "page1.q0", "page1.address", "page1.address.street", "page1.address.z", "page1.address.zip",
    "page1.address.deep.flat", "page1.address.deep", "address.street", "deep.flat", "page2.q3", "page1.q3",
  ];
  test("from the root, the linter resolves a reference exactly when the runtime gives a value", () => {
    const survey = new SurveyModel(json);
    survey.data = data;
    refs.forEach(ref => {
      const runtime = survey.runExpression("{" + ref + "}");
      const lintJson = JSON.parse(JSON.stringify(json));
      lintJson.pages[1].elements.push({ type: "expression", name: "probe", expression: "{" + ref + "}" });
      const resolved = refFindings(lintJson).length === 0;
      expect(resolved, ref + " (runtime: " + JSON.stringify(runtime) + ")").toBe(runtime !== undefined && runtime !== null);
    });
  });
  test("inside a container, the linter resolves a reference exactly when the runtime gives a value", () => {
    // a condition of an inner question runs in the container's scope
    refs.concat(["address.z", "info.street"]).forEach(ref => {
      const runtimeJson = JSON.parse(JSON.stringify(json));
      runtimeJson.pages[0].elements[1].elements[0].visibleIf = "{" + ref + "} notempty";
      const survey = new SurveyModel(runtimeJson);
      survey.data = data;
      const runtimeVisible = survey.getQuestionByName("street").isVisible;
      const resolved = refFindings(runtimeJson).length === 0;
      expect(resolved, ref).toBe(runtimeVisible);
    });
  });
});

describe("linter nested data: collisions", () => {
  test("a container key equal to a question's data key at the same level is an error (4.2)", () => {
    const json = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "text", name: "street" }] },
        { type: "text", name: "address" },
      ],
    };
    const findings = findingsOf(json, "nesting/key-conflict");
    expect(brief(findings)).toEqual(["nesting/key-conflict/questionKey @ elements[0].valueName"]);
    expect(findings[0].severity).toBe("error");
    expect(findings[0].related.map(r => r.elementName)).toEqual(["p", "address"]);
  });
  test("the conflict counts inside one object, with a question's valueName, and in a by-name mode", () => {
    const inner = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [
          { type: "text", name: "zip" },
          { type: "panel", name: "pz", valueName: "zip", elements: [{ type: "text", name: "code" }] },
        ] },
      ],
    };
    expect(brief(findingsOf(inner, "nesting/key-conflict"))).toEqual(["nesting/key-conflict/questionKey @ elements[0].elements[1].valueName"]);
    const byValueName = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "text", name: "street" }] },
        { type: "multipletext", name: "mt", valueName: "address", items: [{ name: "street" }] },
      ],
    };
    expect(brief(findingsOf(byValueName, "nesting/key-conflict"))).toEqual(["nesting/key-conflict/questionKey @ elements[0].valueName"]);
    const byName = {
      dataNesting: "panel",
      elements: [
        { type: "panel", name: "info", elements: [{ type: "text", name: "street" }] },
        { type: "text", name: "info2", valueName: "info" },
      ],
    };
    expect(brief(findingsOf(byName, "nesting/key-conflict"))).toEqual(["nesting/key-conflict/questionKey @ elements[0].name"]);
  });
  test("different levels, two containers on one key and \"none\" are no conflict", () => {
    const json: any = {
      pages: [
        { name: "p1", elements: [
          { type: "panel", name: "a1", valueName: "address", elements: [{ type: "text", name: "street" }] },
          { type: "panel", name: "o", valueName: "outer", elements: [{ type: "text", name: "address2", valueName: "address" }] },
        ] },
        { name: "p2", elements: [{ type: "panel", name: "a2", valueName: "address", elements: [{ type: "text", name: "city" }] }] },
      ],
    };
    expect(brief(findingsOf(json, "nesting/key-conflict"))).toEqual([]);
    json.pages[1].elements.push({ type: "text", name: "address" });
    expect(findingsOf(json, "nesting/key-conflict")).toHaveLength(2);
    json.dataNesting = "none";
    expect(findingsOf(json, "nesting/key-conflict")).toHaveLength(0);
  });
  test("a container key equal to a calculated value, a host variable or a variable trigger is a warning (4.3)", () => {
    const json: any = {
      elements: [{ type: "panel", name: "p", valueName: "address", elements: [{ type: "text", name: "street" }] }],
      calculatedValues: [{ name: "address", expression: "1" }],
    };
    let findings = findingsOf(json, "name/shadowing");
    expect(brief(findings)).toEqual(["name/shadowing/containerKeyShadowed @ elements[0].valueName"]);
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].messageData.kind).toBe("calculatedValue");
    delete json.calculatedValues;
    findings = findingsOf(json, "name/shadowing", { knownVariables: ["Address"] });
    expect(brief(findings)).toEqual(["name/shadowing/containerKeyShadowed @ elements[0].valueName"]);
    expect(findings[0].messageData.kind).toBe("variable");
    findings = findingsOf(json, "name/shadowing", { variablePresets: { definition: { elements: [{ type: "text", name: "address" }] } } });
    expect(brief(findings)).toEqual(["name/shadowing/containerKeyShadowed @ elements[0].valueName"]);
    json.triggers = [{ type: "setvalue", expression: "{street} = 1", setToName: "address", setValue: 1, isVariable: true }];
    findings = findingsOf(json, "name/shadowing");
    expect(brief(findings)).toEqual(["name/shadowing/containerKeyShadowed @ elements[0].valueName"]);
    expect(findings[0].messageData.kind).toBe("trigger");
  });
  test("a container key spelling a built-in variable is reported like a question's valueName", () => {
    const json = { elements: [{ type: "panel", name: "p", valueName: "locale", elements: [{ type: "text", name: "street" }] }] };
    expect(brief(findingsOf(json, "name/shadowing"))).toEqual(["name/shadowing/builtInVariable @ elements[0].valueName"]);
  });
  test("variable/collision skips an inner question, which writes no root key", () => {
    const options = { variablePresets: { definition: { elements: [{ type: "text", name: "street" }] } } };
    expect(findingsOf(exampleSurvey(), "variable/collision", options)).toHaveLength(0);
    const flat = exampleSurvey();
    (<any>flat).dataNesting = "none";
    expect(findingsOf(flat, "variable/collision", options)).toHaveLength(1);
  });
  test("a reserved container key", () => {
    const json: any = { elements: [{ type: "panel", name: "p", valueName: "constructor", elements: [{ type: "text", name: "street" }] }] };
    expect(brief(findingsOf(json, "name/reserved"))).toEqual(["name/reserved/containerKey @ elements[0].valueName"]);
    const byName = { dataNesting: "page", pages: [{ name: "toString", elements: [{ type: "text", name: "street" }] }] };
    expect(brief(findingsOf(byName, "name/reserved"))).toEqual(["name/reserved/containerKey @ pages[0].name"]);
    expect(findingsOf({ pages: byName.pages }, "name/reserved")).toHaveLength(0);
  });
  test("the dotted-valueName warning stays for questions only", () => {
    const json = {
      elements: [
        { type: "panel", name: "p", valueName: "a.b", elements: [{ type: "text", name: "w" }] },
        { type: "text", name: "q", valueName: "c.d" },
      ],
    };
    expect(brief(findingsOf(json, "property/invalid-value"))).toEqual(["property/invalid-value/valueNameDotted @ elements[1].valueName"]);
  });
});

describe("linter nested data: data keys are compared within one object", () => {
  test("questions sharing a valueName in different objects share nothing", () => {
    const json = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "checkbox", name: "c1", valueName: "x", choices: ["a"] }] },
        { type: "multipletext", name: "m1", valueName: "x", items: [{ name: "i" }] },
        { type: "text", name: "t1", valueName: "y-Comment" },
        { type: "panel", name: "p2", valueName: "other", elements: [{ type: "dropdown", name: "d1", valueName: "y", choices: ["a"], showCommentArea: true }] },
      ],
    };
    expect(brief(findingsOf(json, "name/shadowing"))).toEqual([]);
  });
  test("inside one object they share", () => {
    const json = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [
          { type: "checkbox", name: "c1", valueName: "x", choices: ["a"] },
          { type: "multipletext", name: "m1", valueName: "x", items: [{ name: "i" }] },
        ] },
      ],
    };
    expect(brief(findingsOf(json, "name/shadowing"))).toEqual(["name/shadowing/valueShapeConflict @ elements[0].elements[0]"]);
  });
});

describe("linter nested data: ignored and generated keys", () => {
  test("a valueName inside a record is ignored (N5): a warning", () => {
    const json: any = {
      elements: [
        { type: "paneldynamic", name: "pd", templateElements: [
          { type: "panel", name: "inner", valueName: "box", elements: [{ type: "text", name: "t" }] },
        ] },
        { type: "matrixdynamic", name: "m", detailPanelMode: "underRow", columns: [{ name: "c" }], detailElements: [
          { type: "panel", name: "det", valueName: "box2", elements: [{ type: "text", name: "d" }] },
        ] },
      ],
    };
    const findings = findingsOf(json, "nesting/ignored-key");
    expect(brief(findings)).toEqual([
      "nesting/ignored-key/insideRecord @ elements[0].templateElements[0].valueName",
      "nesting/ignored-key/insideRecord @ elements[1].detailElements[0].valueName",
    ]);
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].messageData.recordName).toBe("pd");
    json.dataNesting = "none";
    expect(findingsOf(json, "nesting/ignored-key")).toHaveLength(0);
  });
  test("a valueName inside a composite definition is ignored", () => {
    const options: ISurveyLintOptions = {
      components: { addr: { elementsJSON: [{ type: "panel", name: "pp", valueName: "box", elements: [{ type: "text", name: "t" }] }] } },
    };
    const json = { elements: [{ type: "addr", name: "a1" }] };
    expect(brief(findingsOf(json, "nesting/ignored-key", options))).toEqual(["nesting/ignored-key/insideRecord @ components.addr.elementsJSON[0].valueName"]);
  });
  test("a by-name mode nesting under a generated name: a hint with a fix", () => {
    const json: any = {
      dataNesting: "panel",
      elements: [
        { type: "panel", name: "panel1", elements: [{ type: "text", name: "a" }] },
        { type: "panel", name: "contact", elements: [{ type: "text", name: "b" }] },
        { type: "panel", name: "panel2", valueName: "kept", elements: [{ type: "text", name: "c" }] },
      ],
    };
    const findings = findingsOf(json, "nesting/generated-key");
    expect(brief(findings)).toEqual(["nesting/generated-key/generatedName @ elements[0].name"]);
    expect(findings[0].severity).toBe("info");
    const fixed = expectFixSettles(json, findings[0]);
    expect(fixed.elements[0].valueName).toBe("panel1");
    // the page mode nests the root elements under "page1": always that one page, nothing to name
    expect(brief(findingsOf(Object.assign({}, json, { dataNesting: "page" }), "nesting/generated-key"))).toEqual([]);
  });
  test("an unnamed container and root elements in a by-name mode", () => {
    const json: any = {
      dataNesting: "panelAndPage",
      pages: [
        { elements: [{ type: "panel", elements: [{ type: "text", name: "a" }] }] },
        { name: "page1", elements: [{ type: "panel", name: "panel1", elements: [{ type: "text", name: "b" }] }] },
      ],
    };
    const findings = findingsOf(json, "nesting/generated-key");
    expect(brief(findings)).toEqual([
      "nesting/generated-key/unnamed @ pages[0]",
      "nesting/generated-key/unnamed @ pages[0].elements[0]",
      "nesting/generated-key/generatedName @ pages[1].elements[0].name",
      "nesting/generated-key/generatedName @ pages[1].name",
    ]);
    expect(findings[0].messageData.key).toBe("page1");
    expect(findings[1].messageData.key).toBe("panel1");
    expect(findings.filter(f => !!f.fix).map(f => f.reason)).toEqual(["generatedName", "generatedName"]);
    const root = { dataNesting: "page", elements: [{ type: "text", name: "a" }] };
    expect(brief(findingsOf(root))).toEqual([]);
    // a finding about the key of root elements points at the property that makes them nest
    const shadowed = Object.assign({ calculatedValues: [{ name: "page1", expression: "1" }] }, root);
    expect(brief(findingsOf(shadowed, "name/shadowing"))).toEqual(["name/shadowing/containerKeyShadowed @ dataNesting"]);
  });
  test("the generated names follow the runtime", () => {
    const json: any = {
      dataNesting: "panelAndPage",
      pages: [
        { elements: [
          { type: "paneldynamic", name: "pd", templateElements: [{ type: "panel", name: "panel1", elements: [{ type: "text", name: "t" }] }] },
          { type: "panel", elements: [{ type: "text", name: "a" }] },
          { type: "panel", elements: [{ type: "panel", elements: [{ type: "text", name: "b" }] }] },
        ] },
        { name: "page1", elements: [{ type: "text", name: "c" }] },
        { elements: [{ type: "text", name: "d" }] },
      ],
    };
    const survey = new SurveyModel(json);
    ["a", "b", "c", "d"].forEach(name => survey.getQuestionByName(name).value = name);
    expect(survey.data).toEqual({ page1: { panel2: { a: "a" }, panel3: { panel4: { b: "b" } }, c: "c" }, page2: { d: "d" } });
    const keys = findingsOf(json, "nesting/generated-key").filter(f => f.reason === "unnamed").map(f => f.messageData.key);
    expect(keys).toEqual(["page1", "panel2", "panel3", "panel4", "page2"]);
    json.pages[0].elements.push({ type: "text", name: "q", visibleIf: "{panel3.panel4.b} = 1 and {page2.d} = 1" });
    expect(brief(refFindings(json))).toEqual([]);
  });
});

describe("linter nested data: triggers", () => {
  test("setToName and fromName take a name, a path or a container key", () => {
    const json: any = exampleSurvey();
    json.triggers = [
      { type: "setvalue", expression: "{q0} = 1", setToName: "street", setValue: "a" },
      { type: "setvalue", expression: "{q0} = 2", setToName: "address.street", setValue: "b" },
      { type: "setvalue", expression: "{q0} = 3", setToName: "address", setValue: "c" },
      { type: "copyvalue", expression: "{q0} = 4", setToName: "q3", fromName: "address.city" },
      { type: "setvalue", expression: "{q0} = 5", setToName: "address.stret", setValue: "d" },
    ];
    const findings = findingsOf(json, "trigger/unknown-target");
    expect(brief(findings)).toEqual(["trigger/unknown-target/segmentNotFound @ triggers[4].setToName"]);
    expect(findings[0].suggestion).toBe("street");
  });
  test("a trigger loop through a path is found", () => {
    const json: any = exampleSurvey();
    json.triggers = [
      { type: "setvalue", expression: "{street} = 'a'", setToName: "address.city", setValue: "b" },
      { type: "setvalue", expression: "{address.city} = 'b'", setToName: "street", setValue: "a" },
    ];
    expect(findingsOf(json, "cycle/trigger")).toHaveLength(1);
  });
});

describe("linter nested data: review fixes", () => {
  test("a display-only question stores nothing: no conflict, and the container key answers", () => {
    const json = {
      elements: [
        { type: "html", name: "address", html: "x" },
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "dropdown", name: "street", choices: ["Main", "Side"] }] },
        { type: "text", name: "q", visibleIf: "{address.street} = 'Nope'" },
      ],
    };
    expect(brief(findingsOf(json, "nesting/key-conflict"))).toEqual([]);
    expect(brief(findingsOf(json, "expression/unknown-choice"))).toEqual(["expression/unknown-choice/notAmongChoices @ elements[2].visibleIf"]);
  });
  test("a matrix total is reached by a path from the survey data only, as at runtime", () => {
    const json: any = {
      elements: [{ type: "panel", name: "p", valueName: "address", elements: [
        { type: "matrixdropdown", name: "m", rows: ["r"], columns: [{ name: "c", cellType: "text", inputType: "number", totalType: "sum" }] },
        { type: "text", name: "q", visibleIf: "{m-total.c} > 0" },
        { type: "text", name: "q2", visibleIf: "{address.m-total.c} > 0" },
      ] }],
    };
    const survey = new SurveyModel(json);
    survey.data = { address: { m: { r: { c: 3 } } } };
    expect(survey.getQuestionByName("q").isVisible).toBe(false);
    expect(survey.getQuestionByName("q2").isVisible).toBe(true);
    expect(brief(refFindings(json))).toEqual(["reference/unknown/notFound @ elements[0].elements[1].visibleIf"]);
  });
  test("keys that differ in letter case are one object to a reference", () => {
    const json = {
      elements: [
        { type: "panel", name: "pa", valueName: "Address", elements: [{ type: "text", name: "s1" }] },
        { type: "panel", name: "pb", valueName: "address", elements: [{ type: "text", name: "s2" }] },
        { type: "text", name: "q", visibleIf: "{Address.s2} = 'y' and {address.s1} = 'x'" },
      ],
    };
    const survey = new SurveyModel(json);
    survey.data = { Address: { s1: "x" }, address: { s2: "y" } };
    expect(survey.getQuestionByName("q").isVisible).toBe(true);
    expect(brief(refFindings(json))).toEqual([]);
  });
  test("a container key on another question's comment or totals key", () => {
    const json = {
      elements: [
        { type: "text", name: "q1", showCommentArea: true },
        { type: "panel", name: "p", valueName: "q1-Comment", elements: [{ type: "text", name: "t" }] },
        { type: "matrixdropdown", name: "m", rows: ["r"], columns: [{ name: "c", cellType: "text", totalType: "count" }] },
        { type: "panel", name: "p2", valueName: "m-total", elements: [{ type: "text", name: "t2" }] },
      ],
    };
    expect(brief(findingsOf(json, "name/shadowing"))).toEqual([
      "name/shadowing/commentKeyCollision @ elements[1].valueName",
      "name/shadowing/totalKeyCollision @ elements[3].valueName",
    ]);
  });
  test("a trigger writing a container key replaces the object, though a question inside has the key's name (D13)", () => {
    const json: any = {
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "dropdown", name: "address", choices: ["a"] }] },
        { type: "text", name: "q0" },
      ],
      triggers: [{ type: "setvalue", expression: "{q0} = 1", setToName: "address", setValue: { address: "a" } }],
    };
    expect(brief(findingsOf(json).filter(f => f.severity !== "info"))).toEqual([]);
  });
  test("a built-in name on an inner question: reachable inside its container and by its path", () => {
    const json = {
      elements: [{ type: "panel", name: "p", valueName: "address", elements: [{ type: "text", name: "locale" }] }],
    };
    const findings = findingsOf(json, "name/shadowing");
    expect(brief(findings)).toEqual(["name/shadowing/builtInVariable @ elements[0].elements[0].name"]);
    expect(findings[0].message).toContain("{address.locale}");
    expect(findings[0].messageData.dataPath).toBe("address");
  });
});

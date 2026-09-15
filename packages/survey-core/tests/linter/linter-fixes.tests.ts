import { describe, test, expect } from "vitest";
import { applyFix, ILintFinding, ILintFix, lintSurvey, SurveyLintFixReasons } from "../../src/linter/index";

function findingOf(json: any, ruleId: string): ILintFinding {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId)[0];
}

describe("applyFix", () => {
  test("set writes a value, and a key the object does not have yet", () => {
    const json = { elements: [{ type: "text", name: "q1" }] };
    const fix: ILintFix = { reason: "any", edits: [{ op: "set", path: "elements[0].title", value: "T" }] };
    expect(applyFix(json, fix).elements[0]).toEqual({ type: "text", name: "q1", title: "T" });
    expect(json.elements[0]).toEqual({ type: "text", name: "q1" });
  });
  test("wrap turns the value into a one-item array", () => {
    const json = { pages: [{ name: "p1", elements: { type: "text", name: "q1" } }] };
    const fix: ILintFix = { reason: "any", edits: [{ op: "wrap", path: "pages[0].elements" }] };
    expect(applyFix(json, fix).pages[0].elements).toEqual([{ type: "text", name: "q1" }]);
  });
  test("remove drops a key of an object and splices an item of an array", () => {
    const json = { elements: [{ type: "text", name: "q1", nosuch: 1 }, { type: "text", name: "q2" }] };
    const dropKey: ILintFix = { reason: "any", edits: [{ op: "remove", path: "elements[0].nosuch" }] };
    expect(applyFix(json, dropKey).elements[0]).toEqual({ type: "text", name: "q1" });
    const dropItem: ILintFix = { reason: "any", edits: [{ op: "remove", path: "elements[1]" }] };
    expect(applyFix(json, dropItem).elements).toHaveLength(1);
    expect(json.elements).toHaveLength(2);
  });
  test("rename keeps the key where it was written", () => {
    const json = { elements: [{ type: "text", name: "q1", titel: "T", description: "d" }] };
    const fix: ILintFix = { reason: "any", edits: [{ op: "rename", path: "elements[0].titel", key: "title" }] };
    expect(Object.keys(applyFix(json, fix).elements[0])).toEqual(["type", "name", "title", "description"]);
  });
  test("everything the edit does not touch is shared with the input", () => {
    const json: any = { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] };
    const fix: ILintFix = { reason: "any", edits: [{ op: "set", path: "elements[0].title", value: "T" }] };
    const fixed = applyFix(json, fix);
    expect(fixed).not.toBe(json);
    expect(fixed.elements[1]).toBe(json.elements[1]);
  });
  test("a path that resolves to nothing leaves the document alone", () => {
    const json = { elements: [{ type: "text", name: "q1" }] };
    const fix: ILintFix = { reason: "any", edits: [{ op: "remove", path: "elements[3].name" }] };
    expect(applyFix(json, fix)).toBe(json);
  });
  test("a survey JSON is required, the way lintSurvey requires one", () => {
    const fix: ILintFix = { reason: "any", edits: [{ op: "remove", path: "title" }] };
    expect(() => applyFix(<any>"{}", fix)).toThrow(TypeError);
  });
});

describe("property/not-an-array fix", () => {
  test("a single object written for an array is wrapped", () => {
    const json = { pages: [{ name: "p1", elements: { type: "text", name: "q1" } }] };
    const finding = findingOf(json, "property/not-an-array");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["property/not-an-array"].wrapInArray,
      edits: [{ op: "wrap", path: "pages[0].elements" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.pages[0].elements).toEqual([{ type: "text", name: "q1" }]);
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "property/not-an-array")).toHaveLength(0);
  });
  test("a scalar written for an array is wrapped too", () => {
    const json = { elements: [{ type: "checkbox", name: "q1", choices: "a" }] };
    const finding = findingOf(json, "property/not-an-array");
    expect(finding.fix.edits).toEqual([{ op: "wrap", path: "elements[0].choices" }]);
    expect(applyFix(json, finding.fix).elements[0].choices).toEqual(["a"]);
  });
});

describe("property/invalid-value fix", () => {
  test("the allowed value the author meant replaces the one that was written", () => {
    const json = { elements: [{ type: "text", name: "q1", clearIfInvisible: "cOmPlEtE" }] };
    const finding = findingOf(json, "property/invalid-value");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["property/invalid-value"].useAllowedValue,
      edits: [{ op: "set", path: "elements[0].clearIfInvisible", value: "onComplete" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.elements[0].clearIfInvisible).toBe("onComplete");
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "property/invalid-value")).toHaveLength(0);
  });
  test("the fix carries the allowed value itself, not the spelling of it", () => {
    const json = { elements: [{ type: "checkbox", name: "q1", choices: ["a"], colCount: 7 }] };
    const finding = findingOf(json, "property/invalid-value");
    expect(typeof finding.suggestion).toBe("string");
    expect(finding.fix.edits[0].value).toBe(Number(finding.suggestion));
    expect(typeof finding.fix.edits[0].value).toBe("number");
  });
  test("a value nothing is close to is dropped, and the default takes over", () => {
    const json = { elements: [{ type: "text", name: "q1", clearIfInvisible: "zzzzzzzzzz" }] };
    const finding = findingOf(json, "property/invalid-value");
    expect(finding.suggestion).toBeUndefined();
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["property/invalid-value"].removeKey,
      edits: [{ op: "remove", path: "elements[0].clearIfInvisible" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.elements[0]).toEqual({ type: "text", name: "q1" });
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "property/invalid-value")).toHaveLength(0);
  });
  test("a dotted valueName gets no fix - the flat key it meant is unknowable", () => {
    const json = { elements: [{ type: "text", name: "q1", valueName: "a.b" }] };
    const finding = lintSurvey(json).findings.filter(f => f.reason === "valueNameDotted")[0];
    expect(finding.fix).toBeUndefined();
  });
});

describe("name/duplicate fix", () => {
  const twice = { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q1" }] };

  test("the later element gets a free name of its own kind", () => {
    const finding = findingOf(twice, "name/duplicate");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["name/duplicate"].renameElement,
      edits: [{ op: "set", path: "elements[1].name", value: "question1" }],
    });
    const fixed = applyFix(twice, finding.fix);
    expect(fixed.elements.map((el: any) => el.name)).toEqual(["q1", "question1"]);
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "name/duplicate")).toHaveLength(0);
  });
  test("a page is named after a page and a panel after a panel", () => {
    const pages = {
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1" }] },
        { name: "p1", elements: [{ type: "text", name: "q2" }] },
      ],
    };
    expect(findingOf(pages, "name/duplicate").fix.edits[0].value).toBe("page1");
    const panels = {
      elements: [
        { type: "panel", name: "x", elements: [{ type: "text", name: "q1" }] },
        { type: "panel", name: "x", elements: [{ type: "text", name: "q2" }] },
      ],
    };
    expect(findingOf(panels, "name/duplicate").fix.edits[0].value).toBe("panel1");
  });
  test("one run never hands out the same name twice", () => {
    const thrice = {
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" }],
    };
    const names = lintSurvey(thrice).findings
      .filter(f => f.ruleId === "name/duplicate").map(f => f.fix.edits[0].value);
    expect(names).toEqual(["question1", "question2"]);
  });
  test("a name a matrix column already uses is not handed out", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "question1" }] },
        { type: "text", name: "q1" }, { type: "text", name: "q1" },
      ],
    };
    expect(findingOf(json, "name/duplicate").fix.edits[0].value).toBe("question2");
  });
  test("the host spells the name itself through options.newElementName", () => {
    const seen: Array<any> = [];
    const findings = lintSurvey(twice, {
      newElementName: (kind: string, taken: Array<string>) => {
        seen.push({ kind: kind, taken: taken });
        return "frage1";
      },
    }).findings.filter(f => f.ruleId === "name/duplicate");
    expect(findings[0].fix.edits[0].value).toBe("frage1");
    expect(seen).toHaveLength(1);
    expect(seen[0].kind).toBe("question");
    expect(seen[0].taken).toContain("q1");
  });
  test("a duplicate calculated value gets no fix - a reference cannot tell which one it meant", () => {
    const json = { calculatedValues: [{ name: "c1", expression: "1" }, { name: "c1", expression: "2" }] };
    const finding = lintSurvey(json).findings.filter(f => f.reason === "calculatedValueNames")[0];
    expect(finding.fix).toBeUndefined();
  });
});

describe("property/required fix", () => {
  test("an element with no name gets one", () => {
    const json = { pages: [{ name: "p1", elements: [{ type: "text" }] }] };
    const finding = findingOf(json, "property/required");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["property/required"].setName,
      edits: [{ op: "set", path: "pages[0].elements[0].name", value: "question1" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.pages[0].elements[0]).toEqual({ type: "text", name: "question1" });
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "property/required")).toHaveLength(0);
  });
  test("a matrix column is named the way a question is", () => {
    const json = { elements: [{ type: "matrixdynamic", name: "m1", columns: [{ cellType: "text" }] }] };
    expect(findingOf(json, "property/required").fix.edits[0].value).toBe("question1");
  });
  test("a required property that is not a name gets no fix", () => {
    const json = { triggers: [{ type: "setvalue", setValue: 1 }] };
    const findings = lintSurvey(json).findings.filter(f => f.ruleId === "property/required");
    expect(findings.length).toBeGreaterThan(0);
    findings.forEach(finding => {
      expect(finding.messageData.key).not.toBe("name");
      expect(finding.fix).toBeUndefined();
    });
  });
  test("a name invented here never collides with one invented for a duplicate", () => {
    const json = {
      elements: [{ type: "text" }, { type: "text", name: "q1" }, { type: "text", name: "q1" }],
    };
    const names = lintSurvey(json).findings.filter(f => !!f.fix).map(f => f.fix.edits[0].value);
    expect(names).toHaveLength(2);
    expect(names[0]).not.toBe(names[1]);
  });
});

describe("element/unknown-type fix", () => {
  test("the registered type the author meant replaces the unknown one", () => {
    const json = { elements: [{ type: "textt", name: "q1" }] };
    const finding = findingOf(json, "element/unknown-type");
    expect(finding.suggestion).toBe("text");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["element/unknown-type"].setType,
      edits: [{ op: "set", path: "elements[0].type", value: "text" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.elements[0]).toEqual({ type: "text", name: "q1" });
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "element/unknown-type")).toHaveLength(0);
  });
  test("a type nothing is close to gets no fix", () => {
    const json = { elements: [{ type: "zzzzzzzzzz", name: "q1" }] };
    const finding = findingOf(json, "element/unknown-type");
    expect(finding.suggestion).toBeUndefined();
    expect(finding.fix).toBeUndefined();
  });
  test("an element with no type at all gets no fix - nothing suggests a spelling", () => {
    const json = { elements: [{ name: "q1" }] };
    const finding = lintSurvey(json).findings.filter(f => f.reason === "missingType")[0];
    expect(finding.fix).toBeUndefined();
  });
});

describe("trigger/unknown-type fix", () => {
  test("the registered trigger type the author meant replaces the unknown one", () => {
    const json = {
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
      triggers: [{ type: "setvaluee", setToName: "q2", setValue: 1 }],
    };
    const finding = findingOf(json, "trigger/unknown-type");
    expect(finding.suggestion).toBe("setvalue");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["trigger/unknown-type"].setType,
      edits: [{ op: "set", path: "triggers[0].type", value: "setvalue" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.triggers[0].type).toBe("setvalue");
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "trigger/unknown-type")).toHaveLength(0);
  });
  test("a trigger with no type gets no fix", () => {
    const json = { elements: [{ type: "text", name: "q1" }], triggers: [{ setToName: "q1" }] };
    const finding = lintSurvey(json).findings.filter(f => f.reason === "noType" && f.elementType === "trigger")[0];
    expect(finding.fix).toBeUndefined();
  });
});

describe("validator/unknown-type fix", () => {
  test("the registered validator type the author meant replaces the unknown one", () => {
    const json = {
      elements: [{ type: "text", name: "q1", validators: [{ type: "numericc", minValue: 1 }] }],
    };
    const finding = findingOf(json, "validator/unknown-type");
    expect(finding.suggestion).toBe("numeric");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["validator/unknown-type"].setType,
      edits: [{ op: "set", path: "elements[0].validators[0].type", value: "numeric" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.elements[0].validators[0]).toEqual({ type: "numeric", minValue: 1 });
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "validator/unknown-type")).toHaveLength(0);
  });
  test("a validator with no type gets no fix", () => {
    const json = { elements: [{ type: "text", name: "q1", validators: [{ minValue: 1 }] }] };
    const finding = findingOf(json, "validator/unknown-type");
    expect(finding.reason).toBe("noType");
    expect(finding.fix).toBeUndefined();
  });
});

describe("mask/mismatch fix", () => {
  test("the known mask the author meant replaces the unknown one", () => {
    const json = { elements: [{ type: "text", name: "q1", maskType: "currencyy" }] };
    const finding = findingOf(json, "mask/mismatch");
    expect(finding.suggestion).toBe("currency");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["mask/mismatch"].setMaskType,
      edits: [{ op: "set", path: "elements[0].maskType", value: "currency" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.elements[0].maskType).toBe("currency");
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "mask/mismatch")).toHaveLength(0);
  });
  test("a mask defect that is not a misspelled type gets no fix", () => {
    const json = { elements: [{ type: "text", name: "q1", maskSettings: { pattern: "99" } }] };
    const finding = findingOf(json, "mask/mismatch");
    expect(finding.reason).not.toBe("unknownMaskType");
    expect(finding.fix).toBeUndefined();
  });
});

describe("property/unknown fix", () => {
  test("a misspelled key is renamed where it stands", () => {
    const json = { elements: [{ type: "text", name: "q1", titlee: "T", description: "d" }] };
    const finding = findingOf(json, "property/unknown");
    expect(finding.suggestion).toBe("title");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["property/unknown"].renameKey,
      edits: [{ op: "rename", path: "elements[0].titlee", key: "title" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(Object.keys(fixed.elements[0])).toEqual(["type", "name", "title", "description"]);
    expect(fixed.elements[0].title).toBe("T");
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "property/unknown")).toHaveLength(0);
  });
  test("a key nothing is close to is dropped - the deserializer drops it anyway", () => {
    const json = { elements: [{ type: "text", name: "q1", zzzzzzzzzz: 1 }] };
    const finding = findingOf(json, "property/unknown");
    expect(finding.suggestion).toBeUndefined();
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["property/unknown"].removeKey,
      edits: [{ op: "remove", path: "elements[0].zzzzzzzzzz" }],
    });
    expect(applyFix(json, finding.fix).elements[0]).toEqual({ type: "text", name: "q1" });
  });
  test("a typo written next to the property it misspells is dropped, not renamed over it", () => {
    const json = { elements: [{ type: "text", name: "q1", title: "kept", titlee: "typo" }] };
    const finding = findingOf(json, "property/unknown");
    expect(finding.suggestion).toBe("title");
    expect(finding.fix.edits).toEqual([{ op: "remove", path: "elements[0].titlee" }]);
    expect(applyFix(json, finding.fix).elements[0]).toEqual({ type: "text", name: "q1", title: "kept" });
  });
});

describe("trigger/unknown-target fix", () => {
  test("the question the author meant replaces the missing target", () => {
    const json = {
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
      triggers: [{ type: "setvalue", setToName: "q22", setValue: 1 }],
    };
    const finding = findingOf(json, "trigger/unknown-target");
    expect(finding.suggestion).toBe("q2");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["trigger/unknown-target"].setName,
      edits: [{ op: "set", path: "triggers[0].setToName", value: "q2" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "trigger/unknown-target")).toHaveLength(0);
  });
  test("the page the author meant replaces the missing one", () => {
    const json = {
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2" }] },
      ],
      triggers: [{ type: "visible", expression: "{q1} notempty", pages: ["p22"] }],
    };
    const finding = findingOf(json, "trigger/unknown-target");
    expect(finding.reason).toBe("pageNotFound");
    expect(finding.fix.edits).toEqual([{ op: "set", path: "triggers[0].pages[0]", value: "p2" }]);
    expect(applyFix(json, finding.fix).triggers[0].pages).toEqual(["p2"]);
  });
  test("only the segment that did not resolve is respelled, the index stays", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "text", name: "src" },
      ],
      triggers: [{
        type: "copyvalue", expression: "{src} notempty", setToName: "m1[0].col9", fromName: "src",
      }],
    };
    const finding = lintSurvey(json).findings.filter(f => f.reason === "segmentNotFound")[0];
    expect(finding.fix.edits).toEqual([
      { op: "set", path: "triggers[0].setToName", value: "m1[0].col1" },
    ]);
  });
  test("a target nothing is close to gets no fix", () => {
    const json = {
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "setvalue", setToName: "zzzzzzzzzz", setValue: 1 }],
    };
    const finding = findingOf(json, "trigger/unknown-target");
    expect(finding.suggestion).toBeUndefined();
    expect(finding.fix).toBeUndefined();
  });
});

describe("choices/dead-source fix", () => {
  test("the question the author meant replaces the missing source", () => {
    const json = {
      elements: [
        { type: "dropdown", name: "q1", choices: ["a", "b"] },
        { type: "dropdown", name: "q2", choicesFromQuestion: "q11" },
      ],
    };
    const finding = findingOf(json, "choices/dead-source");
    expect(finding.reason).toBe("missing");
    expect(finding.suggestion).toBe("q1");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["choices/dead-source"].setName,
      edits: [{ op: "set", path: "elements[1].choicesFromQuestion", value: "q1" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "choices/dead-source")).toHaveLength(0);
  });
  test("the column the author meant replaces the missing field", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "src", columns: [{ name: "col1" }] },
        {
          type: "dropdown", name: "q1", choicesFromQuestion: "src",
          choiceValuesFromQuestion: "col9",
        },
      ],
    };
    const finding = findingOf(json, "choices/dead-source");
    expect(finding.reason).toBe("missing-field");
    expect(finding.fix.edits).toEqual([
      { op: "set", path: "elements[1].choiceValuesFromQuestion", value: "col1" },
    ]);
  });
  test("a source that is not a source at all gets no fix", () => {
    const json = {
      elements: [
        { type: "text", name: "src" },
        { type: "dropdown", name: "q1", choicesFromQuestion: "src" },
      ],
    };
    const finding = findingOf(json, "choices/dead-source");
    expect(finding.reason).toBe("not-a-source");
    expect(finding.fix).toBeUndefined();
  });
  test("a question copying its choices from itself gets no fix", () => {
    const json = { elements: [{ type: "dropdown", name: "q1", choicesFromQuestion: "q1" }] };
    const finding = findingOf(json, "choices/dead-source");
    expect(finding.reason).toBe("self");
    expect(finding.fix).toBeUndefined();
  });
});

describe("reference/unknown keyName fix", () => {
  test("the column the author meant replaces the keyName that names nothing", () => {
    const json = {
      elements: [{ type: "matrixdynamic", name: "m1", keyName: "col9", columns: [{ name: "col1" }] }],
    };
    const finding = lintSurvey(json).findings.filter(f => f.reason === "keyNameNotFound")[0];
    expect(finding.suggestion).toBe("col1");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["reference/unknown"].setKeyName,
      edits: [{ op: "set", path: "elements[0].keyName", value: "col1" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.elements[0].keyName).toBe("col1");
    expect(lintSurvey(fixed).findings.filter(f => f.reason === "keyNameNotFound")).toHaveLength(0);
  });
  test("a keyName nothing is close to gets no fix", () => {
    const json = {
      elements: [{ type: "matrixdynamic", name: "m1", keyName: "zzzzzzzzzz", columns: [{ name: "col1" }] }],
    };
    const finding = lintSurvey(json).findings.filter(f => f.reason === "keyNameNotFound")[0];
    expect(finding.suggestion).toBeUndefined();
    expect(finding.fix).toBeUndefined();
  });
});

function refFinding(json: any, path: string): ILintFinding {
  return lintSurvey(json).findings
    .filter(f => f.ruleId === "reference/unknown" && f.path === path)[0];
}

describe("reference/unknown reference fix", () => {
  test("the name the author meant replaces the reference inside the expression", () => {
    const json = {
      elements: [
        { type: "dropdown", name: "fruit", choices: ["a", "b"] },
        { type: "text", name: "q2", visibleIf: "{frut} = 'a'" },
      ],
    };
    const finding = refFinding(json, "elements[1].visibleIf");
    expect(finding.suggestion).toBe("fruit");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["reference/unknown"].renameReference,
      edits: [{ op: "set", path: "elements[1].visibleIf", value: "{fruit} = 'a'" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.elements[1].visibleIf).toBe("{fruit} = 'a'");
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
  });
  test("a reference that is a prefix of another one is left alone", () => {
    const json = {
      elements: [
        { type: "text", name: "q1" }, { type: "text", name: "q10" },
        { type: "text", name: "q3", visibleIf: "{q11} = 1 and {q10} = 2" },
      ],
    };
    const finding = refFinding(json, "elements[2].visibleIf");
    expect(finding.suggestion).toBe("q1");
    expect(finding.fix.edits[0].value).toBe("{q1} = 1 and {q10} = 2");
  });
  test("only the segment that did not resolve is respelled, the scope prefix stays", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [{ name: "col1" }, { name: "col2", visibleIf: "{row.col9} = 1" }],
      }],
    };
    const finding = refFinding(json, "elements[0].columns[1].visibleIf");
    expect(finding.reason).toBe("scopedUnknown");
    expect(finding.fix.edits[0].value).toBe("{row.col1} = 1");
  });
  test("a binding holds the bare name, so the whole value is respelled", () => {
    const json = {
      elements: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "matrixdynamic", name: "m2", columns: [{ name: "c1" }], bindings: { rowCount: "q11" } },
      ],
    };
    const finding = refFinding(json, "elements[1].bindings.rowCount");
    expect(finding.fix.edits).toEqual([
      { op: "set", path: "elements[1].bindings.rowCount", value: "q1" },
    ]);
  });
  test("a name piped into a text is respelled inside that text", () => {
    const json = {
      elements: [
        { type: "dropdown", name: "fruit", choices: ["a", "b"] },
        { type: "text", name: "q2", title: "Hello {frut}!" },
      ],
    };
    const finding = refFinding(json, "elements[1].title");
    expect(finding.messageData.refKind).toBe("textPiping");
    expect(finding.fix.edits).toEqual([
      { op: "set", path: "elements[1].title", value: "Hello {fruit}!" },
    ]);
  });
  test("a reference nothing is close to gets no fix", () => {
    const json = { elements: [{ type: "text", name: "q1", visibleIf: "{zzzzzzzzzz} = 1" }] };
    const finding = refFinding(json, "elements[0].visibleIf");
    expect(finding.suggestion).toBeUndefined();
    expect(finding.fix).toBeUndefined();
  });
  test("a reference inside an inArray filter gets no fix - that string is no property of its own", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "expression", name: "e1", expression: "sumInArray({m1}, 'col1', '{col9} > 5')" },
      ],
    };
    const findings = lintSurvey(json).findings
      .filter(f => f.path.indexOf("inArray") > -1);
    expect(findings.length).toBeGreaterThan(0);
    findings.forEach(finding => expect(finding.fix).toBeUndefined());
  });
});

describe("expression/unknown-function fix", () => {
  test("the registered function the author meant replaces the unknown one", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "expression", name: "e1", expression: "sumInArrey({m1}, 'col1')" },
      ],
    };
    const finding = findingOf(json, "expression/unknown-function");
    expect(finding.suggestion).toBe("sumInArray");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["expression/unknown-function"].renameFunction,
      edits: [{ op: "set", path: "elements[1].expression", value: "sumInArray({m1}, 'col1')" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "expression/unknown-function")).toHaveLength(0);
  });
  test("only the call is renamed, not the same word written as an argument", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "expression", name: "e1", expression: "sumInArrey({m1}, 'sumInArrey')" },
      ],
    };
    const finding = findingOf(json, "expression/unknown-function");
    expect(finding.fix.edits[0].value).toBe("sumInArray({m1}, 'sumInArrey')");
  });
  test("a function nothing is close to gets no fix", () => {
    const json = { elements: [{ type: "expression", name: "e1", expression: "zzzzzzzzzz(1)" }] };
    const finding = findingOf(json, "expression/unknown-function");
    expect(finding.suggestion).toBeUndefined();
    expect(finding.fix).toBeUndefined();
  });
});

describe("choices/duplicate fix", () => {
  test("the repeated item is dropped", () => {
    const json = { elements: [{ type: "dropdown", name: "q1", choices: ["a", "b", "a"] }] };
    const finding = findingOf(json, "choices/duplicate");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["choices/duplicate"].removeItem,
      edits: [{ op: "remove", path: "elements[0].choices[2]" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.elements[0].choices).toEqual(["a", "b"]);
    expect(json.elements[0].choices).toHaveLength(3);
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "choices/duplicate")).toHaveLength(0);
  });
  test("an item that collides with a built-in one gets no fix - the toggle is a repair too", () => {
    const json = {
      elements: [{ type: "checkbox", name: "q1", showNoneItem: true, choices: ["a", "none"] }],
    };
    const finding = findingOf(json, "choices/duplicate");
    expect(finding.reason).toBe("specialItemCollision");
    expect(finding.fix).toBeUndefined();
  });
});

describe("property/dead fix", () => {
  test("a property the serializer drops is dropped from the JSON too", () => {
    const json = { mode: "display", elements: [{ type: "text", name: "q1" }] };
    const finding = findingOf(json, "property/dead");
    expect(finding.reason).toBe("notSerializable");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["property/dead"].removeKey,
      edits: [{ op: "remove", path: "mode" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.mode).toBeUndefined();
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "property/dead")).toHaveLength(0);
  });
  test("the losing half of an alias pair is the one dropped", () => {
    const json = {
      elements: [{
        type: "checkbox", name: "q1", choices: ["a", "b"], showOtherItem: true, hasOther: false,
      }],
    };
    const finding = findingOf(json, "property/dead");
    expect(finding.reason).toBe("aliasDuplicate");
    expect(finding.messageData.winner).toBe("hasOther");
    expect(finding.fix.edits).toEqual([{ op: "remove", path: "elements[0].showOtherItem" }]);
    const fixed = applyFix(json, finding.fix);
    expect(fixed.elements[0].hasOther).toBe(false);
    expect(fixed.elements[0].showOtherItem).toBeUndefined();
  });
  test("a bound the inputType has no use for is dropped", () => {
    const json = { elements: [{ type: "text", name: "q1", inputType: "text", min: 1 }] };
    const finding = findingOf(json, "property/dead");
    expect(finding.reason).toBe("inertMinMax");
    expect(finding.fix.edits).toEqual([{ op: "remove", path: "elements[0].min" }]);
  });
});

describe("property/invalid-value out-of-range fix", () => {
  test("a value below the minimum is pulled up to it", () => {
    const json = {
      elements: [{ type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }], rowCount: -1 }],
    };
    const finding = lintSurvey(json).findings.filter(f => f.reason === "outOfRange")[0];
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["property/invalid-value"].clampToRange,
      edits: [{ op: "set", path: "elements[0].rowCount", value: 0 }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.elements[0].rowCount).toBe(0);
    expect(lintSurvey(fixed).findings.filter(f => f.reason === "outOfRange")).toHaveLength(0);
  });
  test("a value above the maximum is pulled down to it", () => {
    const json = { backgroundOpacity: 5, elements: [{ type: "text", name: "q1" }] };
    const finding = lintSurvey(json).findings.filter(f => f.reason === "outOfRange")[0];
    expect(finding.fix.edits[0].path).toBe("backgroundOpacity");
    expect(finding.fix.edits[0].value).toBe(finding.messageData.max);
    expect(typeof finding.fix.edits[0].value).toBe("number");
  });
});

// One fixture per (ruleId, fix reason) the table declares. A new fix reason without a fixture
// fails the last test of this block, the way linter-reasons pins the message reasons.
const FIX_FIXTURES: Array<{ ruleId: string, fixReason: string, json: any }> = [
  {
    ruleId: "choices/dead-source", fixReason: "setName",
    json: {
      elements: [
        { type: "dropdown", name: "q1", choices: ["a", "b"] },
        { type: "dropdown", name: "q2", choicesFromQuestion: "q11" },
      ],
    },
  },
  {
    ruleId: "choices/duplicate", fixReason: "removeItem",
    json: { elements: [{ type: "dropdown", name: "q1", choices: ["a", "b", "a"] }] },
  },
  {
    ruleId: "element/unknown-type", fixReason: "setType",
    json: { elements: [{ type: "textt", name: "q1" }] },
  },
  {
    ruleId: "expression/unknown-function", fixReason: "renameFunction",
    json: {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "expression", name: "e1", expression: "sumInArrey({m1}, 'col1')" },
      ],
    },
  },
  {
    ruleId: "mask/mismatch", fixReason: "setMaskType",
    json: { elements: [{ type: "text", name: "q1", maskType: "currencyy" }] },
  },
  {
    ruleId: "name/duplicate", fixReason: "renameElement",
    json: { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q1" }] },
  },
  {
    ruleId: "property/dead", fixReason: "removeKey",
    json: { mode: "display", elements: [{ type: "text", name: "q1" }] },
  },
  {
    ruleId: "property/invalid-value", fixReason: "clampToRange",
    json: { elements: [{ type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }], rowCount: -1 }] },
  },
  {
    ruleId: "property/invalid-value", fixReason: "removeKey",
    json: { elements: [{ type: "text", name: "q1", clearIfInvisible: "zzzzzzzzzz" }] },
  },
  {
    ruleId: "property/invalid-value", fixReason: "useAllowedValue",
    json: { elements: [{ type: "text", name: "q1", clearIfInvisible: "cOmPlEtE" }] },
  },
  {
    ruleId: "property/not-an-array", fixReason: "wrapInArray",
    json: { pages: [{ name: "p1", elements: { type: "text", name: "q1" } }] },
  },
  {
    ruleId: "property/required", fixReason: "setName",
    json: { pages: [{ name: "p1", elements: [{ type: "text" }] }] },
  },
  {
    ruleId: "property/unknown", fixReason: "renameKey",
    json: { elements: [{ type: "text", name: "q1", titlee: "T" }] },
  },
  {
    ruleId: "property/unknown", fixReason: "removeKey",
    json: { elements: [{ type: "text", name: "q1", zzzzzzzzzz: 1 }] },
  },
  {
    ruleId: "reference/unknown", fixReason: "renameReference",
    json: {
      elements: [
        { type: "dropdown", name: "fruit", choices: ["a", "b"] },
        { type: "text", name: "q2", visibleIf: "{frut} = 'a'" },
      ],
    },
  },
  {
    ruleId: "reference/unknown", fixReason: "setKeyName",
    json: {
      elements: [{ type: "matrixdynamic", name: "m1", keyName: "col9", columns: [{ name: "col1" }] }],
    },
  },
  {
    ruleId: "trigger/unknown-target", fixReason: "setName",
    json: {
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
      triggers: [{ type: "setvalue", setToName: "q22", setValue: 1 }],
    },
  },
  {
    ruleId: "trigger/unknown-type", fixReason: "setType",
    json: {
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
      triggers: [{ type: "setvaluee", setToName: "q2", setValue: 1 }],
    },
  },
  {
    ruleId: "validator/unknown-type", fixReason: "setType",
    json: { elements: [{ type: "text", name: "q1", validators: [{ type: "numericc", minValue: 1 }] }] },
  },
];

describe("the fix reason table", () => {
  FIX_FIXTURES.forEach(entry => {
    test(entry.ruleId + " reaches " + entry.fixReason, () => {
      const found = lintSurvey(entry.json).findings.filter(f =>
        !!f.fix && f.ruleId === entry.ruleId && f.fix.reason === entry.fixReason);
      expect(found.length).toBeGreaterThan(0);
    });
  });
  test("every declared fix reason has a fixture, and every fixture a declared reason", () => {
    const declared: Array<string> = [];
    Object.keys(SurveyLintFixReasons).forEach(ruleId => {
      const table: any = (<any>SurveyLintFixReasons)[ruleId];
      Object.keys(table).forEach(key => declared.push(ruleId + "/" + table[key]));
    });
    const covered = FIX_FIXTURES.map(entry => entry.ruleId + "/" + entry.fixReason);
    expect(declared.filter(name => covered.indexOf(name) < 0)).toEqual([]);
    expect(covered.filter(name => declared.indexOf(name) < 0)).toEqual([]);
  });
});

describe("applying fixes one after another", () => {
  test("the defects run out and the input is never touched", () => {
    const json = {
      pages: [{
        name: "p1",
        elements: {
          type: "dropdown", name: "q1", choices: ["a", "b", "a"], titlee: "Pick one",
        },
      }],
      mode: "display",
    };
    const before = JSON.stringify(json);
    let current: any = json;
    for (let i = 0; i < 20; i++) {
      const fixable = lintSurvey(current).findings.filter(f => !!f.fix)[0];
      if (!fixable) break;
      current = applyFix(current, fixable.fix);
    }
    expect(lintSurvey(current).findings.filter(f => !!f.fix)).toHaveLength(0);
    expect(JSON.stringify(json)).toBe(before);
    expect(current.pages[0].elements).toEqual([
      { type: "dropdown", name: "q1", choices: ["a", "b"], title: "Pick one" },
    ]);
  });
});

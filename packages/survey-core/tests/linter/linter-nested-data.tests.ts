import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { Serializer } from "../../src/jsonobject";
import { Base } from "../../src/base";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { lintSurvey, ILintFinding, ISurveyLintOptions, SurveyLintHintReasons } from "../../src/linter/index";
import { expectFixSettles } from "./lint-test-helpers";

// Nested data (decisions N1-N13): a panel or a page with a valueName - or every
// panel / page in a by-name dataNesting mode - stores its questions' values in an object under its key.
// The linter reads the JSON, so it has to know the shape the runtime gives the data.

function findingsOf(json: any, ruleId?: string, options?: ISurveyLintOptions): Array<ILintFinding> {
  return lintSurvey(json, options).findings.filter(f => !ruleId || f.ruleId === ruleId);
}
// The mode the nested-data fixtures are linted in: "none" (the default) would keep the data flat.
function auto(json: any): any {
  return Object.assign({ dataNesting: "auto" }, json);
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
// The second parity oracle: the runtime's metadata walk (getQuestionByVariable). It reads no value, so a key that no
// test fills is checked too. Every reference the linter resolves names a question there, except the listed ones, each
// with its reason: those must still name none, so the list shrinks when either side changes. A question the walk finds
// with nothing after it, the linter resolves.
const UNTIL_STEP_07 = "until step 07";
const CONTAINER_KEY = "a container's object: getQuestionByVariable answers questions only";
const TOTALS_KEY = "a matrix totals key: getQuestionByVariable answers questions and comments only";
function expectQuestionFound(survey: SurveyModel, ref: string, context: Base, resolved: boolean,
  known: { [ref: string]: string } = {}): void {
  const info = survey.getQuestionByVariable(ref, context);
  if (!resolved) {
    // the other way round only where the walk ends at a question: a path into a question's value (its rest) is
    // the linter's to check, and the walk stops at a records question with the record's path as its rest
    expect(!!info && !info.rest, ref + ": getQuestionByVariable finds it, the linter does not").toBe(false);
    return;
  }
  const found = !!info;
  if (known[ref]) {
    expect(found, ref + ": the linter only, " + known[ref]).toBe(false);
  } else {
    expect(found, ref + ": getQuestionByVariable finds it").toBe(true);
  }
}
function knownAs(refs: Array<string>, why: string, res: { [ref: string]: string } = {}): { [ref: string]: string } {
  refs.forEach(ref => res[ref] = why);
  return res;
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

describe("linter nested data: no false findings", () => {
  test("the example survey of the nested data design is clean, references included", () => {
    const json = auto(exampleSurvey());
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
    const json = { dataNesting: "auto",
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
    const json = { dataNesting: "auto",
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "text", name: "address" }] },
        { type: "text", name: "q2", visibleIf: "{address.address} = 'x' and {address} notempty" },
      ],
    };
    expect(brief(findingsOf(json))).toEqual([]);
  });
  test("two containers sharing one key share one object (D4)", () => {
    const json = { dataNesting: "auto",
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
    const json = { dataNesting: "auto",
      elements: [
        { type: "panel", name: "p", valueName: "a.b", elements: [{ type: "text", name: "w" }] },
        { type: "text", name: "q", visibleIf: "{a.b.w} = 'y'" },
      ],
    };
    expect(brief(findingsOf(json))).toEqual([]);
  });
  test("matrices, multiple texts and comments inside the object", () => {
    const json = { dataNesting: "auto",
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
    const json = auto(exampleSurvey());
    json.pages[1].elements.push({ type: "text", name: "r1", visibleIf: "{address.stret} = 'Main'" });
    const findings = refFindings(json);
    expect(brief(findings)).toEqual(["reference/unknown/inContainer @ pages[1].elements[1].visibleIf"]);
    expect(findings[0].suggestion).toBe("street");
    expect(findings[0].message).toContain("\"stret\" is not found in \"address\", the object a panel stores its questions' values in");
    const fixed = expectFixSettles(json, findings[0]);
    expect(fixed.pages[1].elements[1].visibleIf).toBe("{address.street} = 'Main'");
  });
  test("an unknown key inside the object is reported though the runtime reads it from the raw data", () => {
    const json = auto(exampleSurvey());
    json.pages[1].elements.push({ type: "text", name: "r1", visibleIf: "{address.foo} = 1" });
    expect(brief(refFindings(json))).toEqual(["reference/unknown/inContainer @ pages[1].elements[1].visibleIf"]);
  });
  test("an inner valueName does not answer at the root (D9)", () => {
    const json = { dataNesting: "auto",
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
    const json = { dataNesting: "auto",
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
  test("a host default of \"auto\" is read from the serializer", () => {
    const json = exampleSurvey();
    json.pages[1].elements.push({ type: "text", name: "r1", visibleIf: "{address.street} = 'Main'" });
    expect(brief(refFindings(json)), "the stock default \"none\" keeps the data flat").toEqual(["reference/unknown/notFound @ pages[1].elements[1].visibleIf"]);
    const prop = Serializer.findProperty("survey", "dataNesting");
    const saved = prop.defaultValue;
    prop.defaultValue = "auto";
    try {
      expect(brief(refFindings(json)), "a host default of \"auto\" nests").toEqual([]);
    } finally {
      prop.defaultValue = saved;
    }
  });
  test("a valueName inside a dynamic panel nests inside the record (records nesting 02)", () => {
    const json: any = {
      elements: [
        { type: "paneldynamic", name: "pd", templateElements: [
          { type: "panel", name: "inner", valueName: "box", elements: [{ type: "text", name: "t" }] },
          { type: "text", name: "t2", visibleIf: "{panel.t} = 1" },
        ] },
        { type: "text", name: "q", visibleIf: "{pd[0].t} = 1 and {pd[0].box} = 1" },
      ],
    };
    // t is a key of the record's box object, not of the record: {pd[0].t} finds nothing, while {panel.t}
    // finds the panel's question by its name at any depth, as the runtime's panel lookup does
    expect(brief(refFindings(json))).toEqual(["reference/unknown/inContainer @ elements[1].visibleIf"]);
    json.dataNesting = "none";
    expect(brief(refFindings(json)), "\"none\" keeps the record flat").toEqual(["reference/unknown/inContainer @ elements[1].visibleIf"]);
  });
  test("an object is checked as an object", () => {
    const json = auto(exampleSurvey());
    json.pages[1].elements.push({ type: "text", name: "r1", visibleIf: "{address} > 3" });
    expect(brief(findingsOf(json, "expression/type-mismatch"))).toEqual(["expression/type-mismatch/non-scalar @ pages[1].elements[1].visibleIf"]);
  });
  test("a path reaches the inner question, so its choices are checked", () => {
    const json = { dataNesting: "auto",
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "dropdown", name: "kind", choices: ["home", "work"] }] },
        { type: "text", name: "q", visibleIf: "{address.kind} = 'hom'" },
      ],
    };
    expect(brief(findingsOf(json, "expression/unknown-choice"))).toEqual(["expression/unknown-choice/notAmongChoices @ elements[1].visibleIf"]);
  });
  test("text piping resolves paths too", () => {
    const json = auto(exampleSurvey());
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
  // Scoped names 05 (O3): the runtime no longer finds a bare name outside its container, nor a question by its
  // name where an expression reads value names (O8). The linter still does, by the old N11; it follows in step 07
  // (O7). These are the references where the two differ until then.
  const linterOnlyFromRoot = ["q0", "street", "zip", "flat", "q3"];
  const linterOnlyInside = ["zip", "flat", "q3"];
  const containersFromRoot = ["page1", "page2", "page1.address", "page1.address.deep"];
  test("from the root, the linter resolves a reference exactly when the runtime gives a value", () => {
    const survey = new SurveyModel(json);
    survey.data = data;
    const known = knownAs(containersFromRoot, CONTAINER_KEY, knownAs(linterOnlyFromRoot, UNTIL_STEP_07));
    refs.forEach(ref => {
      const runtime = survey.runExpression("{" + ref + "}");
      const lintJson = JSON.parse(JSON.stringify(json));
      lintJson.pages[1].elements.push({ type: "expression", name: "probe", expression: "{" + ref + "}" });
      const resolved = refFindings(lintJson).length === 0;
      const hasValue = runtime !== undefined && runtime !== null;
      if (linterOnlyFromRoot.indexOf(ref) > -1) {
        expect([resolved, hasValue], ref + ": the linter only, until step 07").toEqual([true, false]);
      } else {
        expect(resolved, ref + " (runtime: " + JSON.stringify(runtime) + ")").toBe(hasValue);
      }
      expectQuestionFound(survey, ref, undefined, resolved, known);
    });
  });
  test("inside a container, the linter resolves a reference exactly when the runtime gives a value", () => {
    // a condition of an inner question runs in the container's scope
    refs.concat(["address.z", "info.street"]).forEach(ref => {
      const runtimeJson = JSON.parse(JSON.stringify(json));
      runtimeJson.pages[0].elements[1].elements[0].visibleIf = "{" + ref + "} notempty";
      const survey = new SurveyModel(runtimeJson);
      survey.data = data;
      const street = survey.getQuestionByName("page1.info.street");
      const runtimeVisible = street.isVisible;
      const resolved = refFindings(runtimeJson).length === 0;
      if (linterOnlyInside.indexOf(ref) > -1) {
        expect([resolved, runtimeVisible], ref + ": the linter only, until step 07").toEqual([true, false]);
      } else {
        expect(resolved, ref).toBe(runtimeVisible);
      }
      expectQuestionFound(survey, ref, street, resolved,
        knownAs(["address"].concat(containersFromRoot), CONTAINER_KEY, knownAs(linterOnlyInside, UNTIL_STEP_07)));
    });
  });
});

describe("linter nested data: collisions", () => {
  test("a container key equal to a question's data key at the same level is an error (4.2)", () => {
    const json = { dataNesting: "auto",
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
      dataNesting: "auto",
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [
          { type: "text", name: "zip" },
          { type: "panel", name: "pz", valueName: "zip", elements: [{ type: "text", name: "code" }] },
        ] },
      ],
    };
    expect(brief(findingsOf(inner, "nesting/key-conflict"))).toEqual(["nesting/key-conflict/questionKey @ elements[0].elements[1].valueName"]);
    const byValueName = {
      dataNesting: "auto",
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
  test("a by-name container key equal to a question's name is one finding, name/duplicate's", () => {
    const pairOf = (json: any): Array<string> => brief(lintSurvey(json).findings
      .filter(f => f.ruleId === "nesting/key-conflict" || f.ruleId === "name/duplicate"));
    expect(pairOf({
      dataNesting: "panel",
      elements: [
        { type: "panel", name: "info", elements: [{ type: "text", name: "street" }] },
        { type: "text", name: "info" },
      ],
    })).toEqual(["name/duplicate/elementNames @ elements[1]"]);
    // inside a page's object
    expect(pairOf({
      dataNesting: "panelAndPage",
      pages: [{ name: "pg", elements: [
        { type: "panel", name: "info", elements: [{ type: "text", name: "street" }] },
        { type: "text", name: "info" },
      ] }],
    })).toEqual(["name/duplicate/elementNames @ pages[0].elements[1]"]);
    // a valueName key equal to a question's name: the names differ, so only the key conflict reports it
    expect(pairOf({
      dataNesting: "panel",
      elements: [
        { type: "panel", name: "p", valueName: "info", elements: [{ type: "text", name: "street" }] },
        { type: "text", name: "info" },
      ],
    })).toEqual(["nesting/key-conflict/questionKey @ elements[0].valueName"]);
  });
  test("different levels, two containers on one key and \"none\" are no conflict", () => {
    const json: any = { dataNesting: "auto",
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
    const json: any = { dataNesting: "auto",
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
    const json = { dataNesting: "auto", elements: [{ type: "panel", name: "p", valueName: "locale", elements: [{ type: "text", name: "street" }] }] };
    expect(brief(findingsOf(json, "name/shadowing"))).toEqual(["name/shadowing/builtInVariable @ elements[0].valueName"]);
  });
  test("variable/collision skips an inner question, which writes no root key", () => {
    const options = { variablePresets: { definition: { elements: [{ type: "text", name: "street" }] } } };
    expect(findingsOf(auto(exampleSurvey()), "variable/collision", options)).toHaveLength(0);
    const flat = auto(exampleSurvey());
    (<any>flat).dataNesting = "none";
    expect(findingsOf(flat, "variable/collision", options)).toHaveLength(1);
  });
  test("a reserved container key", () => {
    const json: any = { dataNesting: "auto", elements: [{ type: "panel", name: "p", valueName: "constructor", elements: [{ type: "text", name: "street" }] }] };
    expect(brief(findingsOf(json, "name/reserved"))).toEqual(["name/reserved/containerKey @ elements[0].valueName"]);
    const byName = { dataNesting: "page", pages: [{ name: "toString", elements: [{ type: "text", name: "street" }] }] };
    expect(brief(findingsOf(byName, "name/reserved"))).toEqual(["name/reserved/containerKey @ pages[0].name"]);
    expect(findingsOf({ dataNesting: "auto", pages: byName.pages }, "name/reserved")).toHaveLength(0);
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
    const json = { dataNesting: "auto",
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
    const json = { dataNesting: "auto",
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
  test("a valueName inside a dynamic panel or a detail panel nests: nothing is reported (records nesting 02)", () => {
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
    expect(findingsOf(json, "nesting/ignored-key")).toHaveLength(0);
    json.dataNesting = "none";
    expect(findingsOf(json, "nesting/ignored-key"), "\"none\": ignored by the author's choice").toHaveLength(0);
  });
  test("a valueName inside a composite definition is ignored: a warning", () => {
    const options: ISurveyLintOptions = {
      components: { addr: { elementsJSON: [{ type: "panel", name: "pp", valueName: "box", elements: [{ type: "text", name: "t" }] }] } },
    };
    const json: any = { dataNesting: "auto", elements: [{ type: "addr", name: "a1" }] };
    const findings = findingsOf(json, "nesting/ignored-key", options);
    expect(brief(findings)).toEqual(["nesting/ignored-key/insideComposite @ components.addr.elementsJSON[0].valueName"]);
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].messageData.recordName).toBe("addr");
    json.dataNesting = "none";
    expect(findingsOf(json, "nesting/ignored-key", options)).toHaveLength(0);
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
    // Each by its path: in a nesting mode a bare name finds only the survey's own elements (O1). Two pages are
    // named "page1" (one generated): a path follows the first, so c is taken from its page.
    ["page1.panel2.a", "page1.panel3.panel4.b", "page2.d"].forEach(path => survey.getQuestionByName(path).value = path.split(".").pop());
    survey.pages[1].getQuestionByName("c").value = "c";
    expect(survey.data).toEqual({ page1: { panel2: { a: "a" }, panel3: { panel4: { b: "b" } }, c: "c" }, page2: { d: "d" } });
    const keys = findingsOf(json, "nesting/generated-key").filter(f => f.reason === "unnamed").map(f => f.messageData.key);
    expect(keys).toEqual(["page1", "panel2", "panel3", "panel4", "page2"]);
    json.pages[0].elements.push({ type: "text", name: "q", visibleIf: "{panel3.panel4.b} = 1 and {page2.d} = 1" });
    expect(brief(refFindings(json))).toEqual([]);
  });
  test("root elements in a page mode nest under the page the survey generates, as at runtime", () => {
    const json: any = { dataNesting: "page", elements: [{ type: "text", name: "a" }] };
    const survey = new SurveyModel(json);
    survey.getQuestionByName("page1.a").value = "x";
    expect(survey.data).toEqual({ page1: { a: "x" } });
    json.elements.push({ type: "text", name: "q", visibleIf: "{page1.a} = 1" });
    expect(brief(refFindings(json))).toEqual([]);
    json.elements[1].visibleIf = "{page2.a} = 1";
    expect(brief(refFindings(json))).toEqual(["reference/unknown/notFound @ elements[1].visibleIf"]);
  });
});

describe("linter nested data: triggers", () => {
  test("setToName and fromName take a name, a path or a container key", () => {
    const json: any = auto(exampleSurvey());
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

describe("linter nested data: what a key reaches: display-only questions, totals, letter case, comments, triggers, built-in names", () => {
  test("a display-only question stores nothing: no conflict, and the container key answers", () => {
    const json = { dataNesting: "auto",
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
    const json: any = { dataNesting: "auto",
      elements: [{ type: "panel", name: "p", valueName: "address", elements: [
        { type: "matrixdropdown", name: "m", rows: ["r"], columns: [{ name: "c", cellType: "text", inputType: "number", totalType: "sum" }] },
        { type: "text", name: "q", visibleIf: "{m-total.c} > 0" },
        { type: "text", name: "q2", visibleIf: "{address.m-total.c} > 0" },
      ] }],
    };
    const survey = new SurveyModel(json);
    survey.data = { address: { m: { r: { c: 3 } } } };
    expect(survey.getQuestionByName("p.q").isVisible).toBe(false);
    expect(survey.getQuestionByName("p.q2").isVisible).toBe(true);
    expect(brief(refFindings(json))).toEqual(["reference/unknown/notFound @ elements[0].elements[1].visibleIf"]);
  });
  test("keys that differ in letter case are one object to a reference", () => {
    const json = { dataNesting: "auto",
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
    const json = { dataNesting: "auto",
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
    const json: any = { dataNesting: "auto",
      elements: [
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "dropdown", name: "address", choices: ["a"] }] },
        { type: "text", name: "q0" },
      ],
      triggers: [{ type: "setvalue", expression: "{q0} = 1", setToName: "address", setValue: { address: "a" } }],
    };
    expect(brief(findingsOf(json).filter(f => f.severity !== "info"))).toEqual([]);
  });
  test("a built-in name on an inner question: reachable inside its container and by its path", () => {
    const json = { dataNesting: "auto",
      elements: [{ type: "panel", name: "p", valueName: "address", elements: [{ type: "text", name: "locale" }] }],
    };
    const findings = findingsOf(json, "name/shadowing");
    expect(brief(findings)).toEqual(["name/shadowing/builtInVariable @ elements[0].elements[0].name"]);
    expect(findings[0].message).toContain("{address.locale}");
    expect(findings[0].messageData.dataPath).toBe("address");
  });
});

// Records nesting 02 (decisions RN3-RN7): a panel with a valueName inside a dynamic panel's template or a
// matrix detail panel stores its questions' values in an object inside the record. A by-name mode never
// reaches into a record, and "none" switches it off.
function recordsSurvey(): any {
  return {
    elements: [
      { type: "paneldynamic", name: "items", templateElements: [
        { type: "text", name: "title" },
        { type: "panel", name: "p1", valueName: "address", elements: [
          { type: "dropdown", name: "kind", choices: ["home", "work"] },
          { type: "text", name: "street", title: "Street of {kind}", visibleIf: "{kind} = 'home'" },
        ] },
      ] },
      { type: "matrixdynamic", name: "rows", detailPanelMode: "underRow", columns: [{ name: "col1" }], detailElements: [
        { type: "panel", name: "p2", valueName: "home", elements: [{ type: "text", name: "street2" }] },
      ] },
    ],
  };
}
describe("linter nested data: a nesting panel inside a record", () => {
  test("the records survey is clean: paths into the record's object resolve", () => {
    const json = auto(recordsSurvey());
    const tpl = json.elements[0].templateElements;
    tpl.push({ type: "text", name: "t1", visibleIf: "{panel.address.street} = 'Main' and {panel.address} notempty and {prevPanel.address.street} = 'x'" });
    tpl[1].elements.push({ type: "text", name: "t2", visibleIf: "{street} = 'Main' and {panel.title} = 'A'", title: "{street} of {panel.address.kind}" });
    json.elements[0].templateTitle = "{panel.address.street}";
    json.elements[1].detailElements.push({ type: "text", name: "d1", visibleIf: "{row.home.street2} = 'x' and {row.col1} = 1 and {row.home} notempty" });
    json.elements[1].columns.push({ name: "col2", visibleIf: "{row.home.street2} = 'x'" });
    json.elements.push({ type: "text", name: "q", visibleIf: "{items[0].address.street} = 'x' and {items[0].title} = 'A'" });
    expect(brief(defects(json))).toEqual([]);
  });
  test("an unknown field inside the record's object, and a field of the object read off the record", () => {
    const json = auto(recordsSurvey());
    json.elements[0].templateElements.push({ type: "text", name: "t1", visibleIf: "{panel.address.strete} = 1 or {panel.street} = 1 or {panel.nope} = 1" });
    json.elements[1].detailElements.push({ type: "text", name: "d1", visibleIf: "{row.street2} = 1" });
    json.elements.push({ type: "text", name: "q", visibleIf: "{items[0].address.strete} = 'x'" });
    const findings = refFindings(json);
    // {panel.street} works: the runtime's {panel.x} finds a panel question by its name at any depth. A
    // matrix row has no such lookup: {row.street2} gives no value
    expect(brief(findings)).toEqual([
      "reference/unknown/scopedUnknown @ elements[0].templateElements[2].visibleIf",
      "reference/unknown/scopedUnknown @ elements[0].templateElements[2].visibleIf",
      "reference/unknown/scopedUnknown @ elements[1].detailElements[1].visibleIf",
      "reference/unknown/inContainer @ elements[2].visibleIf",
    ]);
    expect(findings[0].suggestion, "the object's keys are suggested").toBe("street");
    expect(findings[3].suggestion).toBe("street");
  });
  test("{panel.x} of an inner question is checked as that question", () => {
    const json = recordsSurvey();
    json.elements[0].templateElements.push({ type: "text", name: "t1", visibleIf: "{panel.kind} = 'hom'" });
    expect(brief(findingsOf(json, "expression/unknown-choice"))).toEqual(["expression/unknown-choice/notAmongChoices @ elements[0].templateElements[2].visibleIf"]);
  });
  test("a path reaches the inner question, so its choices are checked", () => {
    const json = auto(recordsSurvey());
    json.elements[0].templateElements.push({ type: "text", name: "t1", visibleIf: "{panel.address.kind} = 'hom'" });
    json.elements.push({ type: "text", name: "q", visibleIf: "{items[0].address.kind} = 'wrk'" });
    expect(brief(findingsOf(json, "expression/unknown-choice"))).toEqual([
      "expression/unknown-choice/notAmongChoices @ elements[0].templateElements[2].visibleIf",
      "expression/unknown-choice/notAmongChoices @ elements[2].visibleIf",
    ]);
  });
  test("a record's object is no key of the survey data", () => {
    const json = auto(recordsSurvey());
    json.elements.push({ type: "text", name: "q", visibleIf: "{address.street} = 'x'" });
    expect(brief(refFindings(json))).toEqual(["reference/unknown/notFound @ elements[2].visibleIf"]);
  });
  test("by-name modes never reach into a record; \"none\" keeps it flat", () => {
    const json = recordsSurvey();
    json.dataNesting = "panelAndPage";
    json.elements[0].templateElements.push({ type: "panel", name: "plain", elements: [{ type: "text", name: "inPlain" }] });
    json.elements[0].templateElements.push({ type: "text", name: "t1", visibleIf: "{panel.inPlain} = 1 and {panel.address.street} = 1" });
    expect(brief(refFindings(json))).toEqual([]);
    json.dataNesting = "none";
    json.elements[0].templateElements[3].visibleIf = "{panel.inPlain} = 1 and {panel.street} = 1 and {panel.address.street} = 1";
    // the scopedUnknown is {panel.address.street}: there is no object; {panel.street} is a field of the record
    // without the object, {kind} inside p1 is a field of the record: reached as {panel.kind} only
    expect(brief(refFindings(json))).toEqual([
      "reference/unknown/notFound @ elements[0].templateElements[1].elements[1].title",
      "reference/unknown/notFound @ elements[0].templateElements[1].elements[1].visibleIf",
      "reference/unknown/scopedUnknown @ elements[0].templateElements[3].visibleIf",
    ]);
  });
  test("a container key equal to a question's key in the same record is an error (D4)", () => {
    const json = auto(recordsSurvey());
    json.elements[0].templateElements.push({ type: "text", name: "addr", valueName: "address" });
    json.elements[1].columns.push({ name: "home" });
    const findings = findingsOf(json, "nesting/key-conflict");
    expect(brief(findings)).toEqual([
      "nesting/key-conflict/questionKey @ elements[0].templateElements[1].valueName",
      "nesting/key-conflict/questionKey @ elements[1].detailElements[0].valueName",
    ]);
    expect(findings[0].severity).toBe("error");
  });
  test("keys meet within one record level only", () => {
    const json = auto(recordsSurvey());
    // the survey's address, a question inside the record's object keyed like it, and two containers
    // sharing one object (D4) are other levels or a share: none of them is reported
    json.elements.push({ type: "text", name: "address" });
    json.elements[0].templateElements[1].elements.push({ type: "text", name: "addressInner", valueName: "address" });
    json.elements[0].templateElements.push({ type: "panel", name: "p3", valueName: "address", elements: [{ type: "text", name: "zip" }] });
    json.calculatedValues = [{ name: "home", expression: "1" }];
    expect(brief(findingsOf(json, "nesting/key-conflict"))).toEqual([]);
    expect(brief(findingsOf(json, "name/shadowing")), "a key inside a record does not meet the survey's variables").toEqual([]);
    json.elements[0].templateElements.push({ type: "text", name: "t1", visibleIf: "{panel.address.zip} = 1 and {panel.address.street} = 1" });
    expect(brief(refFindings(json)), "both containers answer in the shared object").toEqual([]);
  });
  test("derived keys collide inside the record's object, not across its levels", () => {
    const json = auto(recordsSurvey());
    const inner = json.elements[0].templateElements[1].elements;
    inner.push({ type: "text", name: "n1", showCommentArea: true });
    inner.push({ type: "text", name: "n1c", valueName: "n1-Comment" });
    json.elements[0].templateElements.push({ type: "text", name: "n2", valueName: "n1-Comment" });
    json.elements[0].templateElements[0].showCommentArea = true;
    json.elements[0].templateElements.push({ type: "panel", name: "p4", valueName: "title-Comment", elements: [{ type: "text", name: "z" }] });
    expect(brief(findingsOf(json, "name/shadowing"))).toEqual([
      "name/shadowing/commentKeyCollision @ elements[0].templateElements[1].elements[3]",
      "name/shadowing/commentKeyCollision @ elements[0].templateElements[3].valueName",
    ]);
  });
  test("a reserved container key inside a record is reported", () => {
    const json = auto(recordsSurvey());
    json.elements[0].templateElements[1].valueName = "constructor";
    expect(brief(findingsOf(json, "name/reserved"))).toEqual(["name/reserved/containerKey @ elements[0].templateElements[1].valueName"]);
  });
});

// The paths into a record's object resolve as at runtime. The runtime's answer is the value walk over data
// that fills every key the definition writes: values, comments and totals. A total inside a record is
// stored only once a cell of its matrix changes, so the runtime survey edits one. A display-only question
// has no value: whether the runtime finds it is read off the metadata walk (getQuestionByVariable).
function recordsParitySurvey(): any {
  const json = recordsSurvey();
  const tpl = json.elements[0].templateElements;
  const address = tpl[1].elements;
  address[0].showCommentArea = true;
  address.push(
    { type: "matrixdropdown", name: "m", rows: ["r"], columns: [{ name: "c", cellType: "text", totalType: "sum" }] },
    { type: "multipletext", name: "mt", items: [{ name: "i1" }] },
    { type: "html", name: "h" },
    { type: "panel", name: "pin", valueName: "inner", elements: [{ type: "html", name: "h2" }, { type: "text", name: "w" }] });
  tpl.push(
    { type: "panel", name: "p1b", valueName: "Address", elements: [{ type: "text", name: "zip" }] },
    { type: "panel", name: "pab", valueName: "a.b", elements: [{ type: "dropdown", name: "kind2", choices: ["home", "work"] }] },
    { type: "text", name: "t1" });
  const detail = json.elements[1].detailElements;
  const home = detail[0].elements;
  home[0].showCommentArea = true;
  home.push(
    { type: "matrixdropdown", name: "m2", rows: ["r"], columns: [{ name: "c", cellType: "text", totalType: "sum" }] },
    { type: "multipletext", name: "mt2", items: [{ name: "i1" }] },
    { type: "html", name: "h3" });
  detail.push({ type: "text", name: "d1" });
  json.elements[1].columns.push({ name: "col2" });
  return json;
}
function recordsParityRuntime(json: any): { survey: SurveyModel, panel: any, row: any } {
  const survey = new SurveyModel(json);
  survey.data = {
    items: [{ title: "A", address: { kind: "home", "kind-Comment": "cmt", street: "s", mt: { i1: "v" }, inner: { w: "W" } },
      Address: { zip: "Z" }, "a.b": { kind2: "home" } }],
    rows: [{ col1: 1, home: { street2: "s", "street2-Comment": "C2", mt2: { i1: "v" } } }],
  };
  const panel = (<any>survey.getQuestionByName("items")).panels[0];
  const row = (<any>survey.getQuestionByName("rows")).visibleRows[0];
  row.showDetailPanel();
  panel.getQuestionByName("m").visibleRows[0].cells[0].question.value = 3;
  row.detailPanel.getQuestionByName("m2").visibleRows[0].cells[0].question.value = 3;
  return { survey: survey, panel: panel, row: row };
}
describe("linter nested data: runtime parity inside a record's object", () => {
  test("the parity survey is clean", () => {
    expect(brief(defects(auto(recordsParitySurvey())))).toEqual([]);
  });
  test("a template question: the linter resolves a reference exactly when the runtime gives a value", () => {
    const refs = ["panel.address.street", "panel.address.kind-Comment", "panel.address.m-total.c", "panel.address.m-total.nope",
      "panel.address.zip", "panel.Address.street", "panel.a.b", "panel.a.b.kind2", "panel.address.inner.w", "panel.address.foo",
      "panel.address.mt.i1", "panel.address.mt.nope", "panel.address"];
    const known = knownAs(["panel.address.m-total.c"], TOTALS_KEY, knownAs(["panel.a.b", "panel.address"], CONTAINER_KEY));
    refs.forEach(ref => {
      const json = auto(recordsParitySurvey());
      json.elements[0].templateElements[4].visibleIf = "{" + ref + "} notempty";
      const runtime = recordsParityRuntime(json);
      const t1 = runtime.panel.getQuestionByName("t1");
      const resolved = refFindings(json).length === 0;
      expect(resolved, ref).toBe(t1.isVisible);
      expectQuestionFound(runtime.survey, ref, t1, resolved, known);
    });
  });
  test("a column and a detail panel question: the linter resolves a reference exactly when the runtime gives a value", () => {
    const refs = ["row.home.street2", "row.home.street2-Comment", "row.home.m2-total.c", "row.home.mt2.i1", "row.home.mt2.nope",
      "row.home.foo", "row.home"];
    const known = knownAs(["row.home.m2-total.c"], TOTALS_KEY, knownAs(["row.home"], CONTAINER_KEY));
    refs.forEach(ref => {
      const json = auto(recordsParitySurvey());
      json.elements[1].columns[1].visibleIf = "{" + ref + "} notempty";
      json.elements[1].detailElements[1].visibleIf = "{" + ref + "} notempty";
      const runtime = recordsParityRuntime(json);
      const row = runtime.row;
      const cell = row.getQuestionByColumnName("col2");
      const d1 = row.detailPanel.getQuestionByName("d1");
      const columnVisible = cell.isVisible;
      expect(d1.isVisible, ref).toBe(columnVisible);
      // one finding per site: a site that resolves wrongly is not masked by the other
      expect(refFindings(json).length, ref).toBe(columnVisible ? 0 : 2);
      expectQuestionFound(runtime.survey, ref, cell, columnVisible, known);
      expectQuestionFound(runtime.survey, ref, d1, columnVisible, known);
    });
  });
  test("from the root: the linter resolves an indexed path exactly when the runtime gives a value", () => {
    const refs = ["items[0].address.street", "items[0].address.kind-Comment", "items[0].address.m-total.c",
      "items[0].address.zip", "items[0].a.b.kind2", "items[0].address.foo", "items[0].address.mt.nope",
      "rows[0].home.street2", "rows[0].home.street2-Comment", "rows[0].home.m2-total.c", "rows[0].home.mt2.nope"];
    refs.forEach(ref => {
      const json = auto(recordsParitySurvey());
      json.elements.push({ type: "expression", name: "probe", expression: "{" + ref + "}" });
      const survey = recordsParityRuntime(json).survey;
      const value = survey.runExpression("{" + ref + "}");
      const resolved = refFindings(json).length === 0;
      expect(resolved, ref + " (runtime: " + JSON.stringify(value) + ")").toBe(value !== undefined && value !== null);
      // the metadata walk stops at the records question: the path inside a record is its rest
      expectQuestionFound(survey, ref, undefined, resolved);
    });
  });
  test("objects whose keys differ in letter case are merged at every level", () => {
    const json: any = { dataNesting: "auto", elements: [
      { type: "panel", name: "pa", valueName: "address", elements: [
        { type: "panel", name: "i1", valueName: "inner", elements: [{ type: "text", name: "y" }] }] },
      { type: "panel", name: "pb", valueName: "Address", elements: [
        { type: "panel", name: "i2", valueName: "inner", elements: [{ type: "text", name: "x" }] }] },
    ] };
    ["address.inner.x", "Address.inner.y", "address.inner.nope"].forEach(ref => {
      const lintJson = JSON.parse(JSON.stringify(json));
      lintJson.elements.push({ type: "expression", name: "probe", expression: "{" + ref + "}" });
      const survey = new SurveyModel(lintJson);
      survey.data = { address: { inner: { y: "Y" } }, Address: { inner: { x: "X" } } };
      const value = survey.runExpression("{" + ref + "}");
      const resolved = refFindings(lintJson).length === 0;
      expect(resolved, ref + " (runtime: " + JSON.stringify(value) + ")").toBe(value !== undefined && value !== null);
      expectQuestionFound(survey, ref, undefined, resolved);
    });
  });
  test("a display-only question inside a record's object is found, as the metadata walk finds it", () => {
    const json = auto(recordsParitySurvey());
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    const t1 = (<any>survey.getQuestionByName("items")).template.getQuestionByName("t1");
    const d1 = (<any>survey.getQuestionByName("rows")).detailPanel.getQuestionByName("d1");
    const cases: Array<{ ref: string, context: any, found: string | null }> = [
      { ref: "panel.address.h", context: t1, found: "h" },
      { ref: "panel.address.inner.h2", context: t1, found: "h2" },
      { ref: "panel.address.nope", context: t1, found: null },
      { ref: "row.home.h3", context: d1, found: "h3" },
    ];
    cases.forEach(c => {
      const res = survey.getQuestionByVariable(c.ref, c.context);
      expect(!!res ? res.question.name : null, c.ref).toBe(c.found);
      const lintJson = auto(recordsParitySurvey());
      lintJson.elements[0].templateElements[4].visibleIf = c.context === t1 ? "{" + c.ref + "} notempty" : "";
      lintJson.elements[1].detailElements[1].visibleIf = c.context === d1 ? "{" + c.ref + "} notempty" : "";
      expect(refFindings(lintJson).length === 0, c.ref).toBe(c.found !== null);
    });
    // from the root the metadata walk stops at the records question ({items[0]...}); the path inside the
    // object resolves as a value question's would
    json.elements.push({ type: "expression", name: "probe", expression: "{items[0].address.h} + {rows[0].home.h3}" });
    expect(brief(refFindings(json))).toEqual([]);
  });
  test("an unknown key below a question of a record's object is reported", () => {
    const json = auto(recordsParitySurvey());
    json.elements[0].templateElements[4].visibleIf = "{panel.address.mt.i2} = 1";
    json.elements[1].columns[1].visibleIf = "{row.home.mt2.i2} = 1";
    json.elements.push({ type: "expression", name: "probe", expression: "{items[0].address.mt.i2}" });
    const findings = refFindings(json);
    expect(brief(findings)).toEqual([
      "reference/unknown/scopedUnknown @ elements[0].templateElements[4].visibleIf",
      "reference/unknown/scopedUnknown @ elements[1].columns[1].visibleIf",
      "reference/unknown/inContainer @ elements[2].expression",
    ]);
    expect(findings.map(f => f.suggestion), "the items are suggested").toEqual(["i1", "i1", "i1"]);
  });
  test("a path through a dotted key of a record's object reaches the question, so its choices are checked", () => {
    const json = auto(recordsParitySurvey());
    json.elements[0].templateElements[3].elements.push({ type: "dropdown", name: "xy", valueName: "x.y", choices: ["home"] });
    json.elements.push({ type: "text", name: "q", visibleIf: "{items[0].a.b.kind2} = 'hom' or {items[0].a.b.x.y} = 'hom' or {items[0].a.b.kind2} = 'home'" });
    json.elements[0].templateElements[4].visibleIf = "{panel.a.b.kind2} = 'hom'";
    expect(brief(findingsOf(json, "expression/unknown-choice"))).toEqual([
      "expression/unknown-choice/notAmongChoices @ elements[0].templateElements[4].visibleIf",
      "expression/unknown-choice/notAmongChoices @ elements[2].visibleIf",
      "expression/unknown-choice/notAmongChoices @ elements[2].visibleIf",
    ]);
  });
});

describe("linter nested data: trigger variables and built-in container keys", () => {
  test("cycle/trigger reads a fromName that names a variable or a calculated value", () => {
    const json: any = {
      elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }],
      triggers: [
        { type: "copyvalue", expression: "{b} notempty", setToName: "a", fromName: "v" },
        { type: "setvalue", expression: "{a} notempty", setToName: "v", setValue: 1, isVariable: true },
      ],
    };
    let findings = findingsOf(json, "cycle/trigger", { knownVariables: ["v"] });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.triggerIndexes.slice().sort()).toEqual([0, 1]);
    // a calculated value: the fallback links the trigger reads and writes by name, whatever the name holds
    json.calculatedValues = [{ name: "v", expression: "{b}" }];
    findings = findingsOf(json, "cycle/trigger");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.triggerIndexes.slice().sort()).toEqual([0, 1]);
  });
  test("a container key spelling a built-in variable stays reachable by its path", () => {
    const json: any = { dataNesting: "auto", elements: [{ type: "panel", name: "p", valueName: "pageno", elements: [
      { type: "text", name: "street" }, { type: "text", name: "city" }] }] };
    let findings = findingsOf(json, "name/shadowing");
    expect(brief(findings)).toEqual(["name/shadowing/builtInVariable @ elements[0].valueName"]);
    expect(findings[0].message).toBe("The valueName \"pageno\" of this panel is also a built-in survey variable - " +
      "only the bare {pageno} reads the built-in value; {pageno.street} still reaches the panel's object.");
    expect(findings[0].messageData).toEqual({ name: "pageno", nameKind: "valueName", builtIn: "pageno", examplePath: "pageno.street", reason: "builtInVariable" });
    json.elements[0].elements[0].valueName = "addr1";
    findings = findingsOf(json, "name/shadowing");
    expect(findings[0].messageData.examplePath).toBe("pageno.addr1");
    // a display-only question stores nothing in the object, so it is not the example
    json.elements[0].elements.unshift({ type: "html", name: "h1" });
    findings = findingsOf(json, "name/shadowing");
    expect(findings[0].messageData.examplePath).toBe("pageno.addr1");
    // a variable of the same name may answer the path first: the path clause is left out
    findings = findingsOf(json, "name/shadowing", { knownVariables: ["pageno"] });
    expect(brief(findings)).toEqual(["name/shadowing/builtInVariable @ elements[0].valueName",
      "name/shadowing/containerKeyShadowed @ elements[0].valueName"]);
    expect(findings[0].message).toBe("The valueName \"pageno\" of this panel is also a built-in survey variable - " +
      "only the bare {pageno} reads the built-in value.");
    expect(findings[0].messageData.examplePath).toBeUndefined();
    json.elements[0].elements = [];
    findings = findingsOf(json, "name/shadowing");
    expect(brief(findings)).toEqual(["name/shadowing/builtInVariable @ elements[0].valueName"]);
    expect(findings[0].messageData.examplePath).toBe("pageno.x");
    const byName = { dataNesting: "page", pages: [{ name: "pageno", elements: [{ type: "text", name: "q1" }] }] };
    findings = findingsOf(byName, "name/shadowing");
    expect(brief(findings)).toEqual(["name/shadowing/builtInVariable @ pages[0].name"]);
    expect(findings[0].message).toBe("The name \"pageno\" of this page is also a built-in survey variable - " +
      "only the bare {pageno} reads the built-in value; {pageno.q1} still reaches the page's object.");
  });
});

describe("linter nested data: the totals of a matrix class a host registers", () => {
  test("a subclass of matrixdynamic writes its totals key, at the root and in a container's object", () => {
    Serializer.addClass("lintmatrixsub", [], () => new QuestionMatrixDynamicModel(""), "matrixdynamic");
    try {
      const matrix = (name: string) => ({ type: "lintmatrixsub", name: name, rowCount: 1,
        columns: [{ name: "c", cellType: "text", totalType: "sum" }] });
      const json: any = { dataNesting: "auto",
        elements: [
          matrix("m"),
          { type: "panel", name: "p", valueName: "addr", elements: [matrix("m2")] },
          { type: "text", name: "q", visibleIf: "{m-total.c} > 0 and {addr.m2-total.c} > 0" },
          { type: "text", name: "q2", visibleIf: "{m-total.nope} > 0" },
        ],
      };
      const survey = new SurveyModel(json);
      survey.getQuestionByName("m").visibleRows[0].cells[0].value = 1;
      survey.getQuestionByName("p.m2").visibleRows[0].cells[0].value = 1;
      expect(survey.data["m-total"]).toEqual({ c: 1 });
      expect(survey.data.addr["m2-total"]).toEqual({ c: 1 });
      const findings = refFindings(json);
      expect(brief(findings)).toEqual(["reference/unknown/inContainer @ elements[3].visibleIf"]);
      expect(findings[0].messageData.segment).toBe("nope");
    } finally {
      Serializer.removeClass("lintmatrixsub");
    }
  });
});

describe("linter nested data: the default mode is \"none\"", () => {
  const json = (extra?: any): any => Object.assign({
    elements: [
      { type: "panel", name: "p", valueName: "address", elements: [{ type: "text", name: "street" }] },
      { type: "text", name: "q", visibleIf: "{address.street} = 'a'" },
    ],
  }, extra || {});
  test("a JSON without dataNesting is linted as \"none\"", () => {
    const none = brief(findingsOf(json({ dataNesting: "none" })));
    expect(none, "\"none\" and \"auto\" differ").not.toEqual(brief(findingsOf(json({ dataNesting: "auto" }))));
    expect(brief(findingsOf(json())), "no dataNesting").toEqual(none);
  });
  test("a serializer without a default falls back to \"none\"", () => {
    const prop = Serializer.findProperty("survey", "dataNesting");
    const def = prop.defaultValue;
    const none = brief(findingsOf(json({ dataNesting: "none" })));
    prop.defaultValue = undefined;
    try {
      expect(brief(findingsOf(json()))).toEqual(none);
    } finally {
      prop.defaultValue = def;
    }
  });
});

// Review 04, prompt 01: a choice panel is bound to the survey (ChoiceItem.setPanelSurvey) wherever its select question
// is, so its questions write keys of the survey data, and the path through the select question's container or record
// reads nothing.
const CHOICE_PANEL_IN_RECORD = "a choice panel of a record: the root's metadata walk does not reach it, until a survey-core fix";
function choicePanelQuestion(): any {
  return { type: "checkbox", name: "kind", choices: [{ value: 1, elements: [{ type: "text", name: "detail" }] }, 2] };
}
interface IChoicePanelPlace {
  name: string;
  elements: () => Array<any>;
  // the select question the runtime builds: a record's, not the template's
  kind: (survey: SurveyModel) => any;
  // the path through the select question's container or record
  inside?: string;
  // the elements a container key on "detail" is no conflict in
  own?: (elements: Array<any>) => Array<any>;
  inRecord?: boolean;
}
const choicePanelPlaces: Array<IChoicePanelPlace> = [
  { name: "at the root", elements: () => [choicePanelQuestion()], kind: s => s.getQuestionByName("kind") },
  { name: "inside a nesting panel", elements: () => [{ type: "panel", name: "p", valueName: "address", elements: [choicePanelQuestion()] }],
    kind: s => s.getQuestionByName("p.kind"), inside: "address.detail", own: els => els[0].elements },
  { name: "inside a dynamic panel's template",
    elements: () => [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [choicePanelQuestion()] }],
    kind: s => (<any>s.getQuestionByName("dp")).panels[0].getQuestionByName("kind"), inside: "dp[0].detail",
    own: els => els[0].templateElements, inRecord: true },
  { name: "inside a matrix's detail panel",
    elements: () => [{ type: "matrixdynamic", name: "md", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "c1" }],
      detailElements: [choicePanelQuestion()] }],
    kind: s => {
      const row = (<any>s.getQuestionByName("md")).visibleRows[0];
      row.showDetailPanel();
      return row.detailPanel.getQuestionByName("kind");
    }, inside: "md[0].detail", own: els => els[0].detailElements, inRecord: true },
];
// The JSON object at a finding path such as "elements[1].templateElements[0]".
function jsonAt(json: any, path: string): any {
  return path.split(".").reduce((obj: any, key: string) => {
    const m = /^(\w+)\[(\d+)\]$/.exec(key);
    return m ? obj[m[1]][Number(m[2])] : obj[key];
  }, json);
}
describe("linter nested data: a choice panel's questions are keys of the survey data", () => {
  test("a reference to a choice panel's question resolves as at runtime, in each place", () => {
    choicePanelPlaces.forEach(place => {
      ["detail"].concat(place.inside ? [place.inside] : []).forEach(ref => {
        const json = auto({ elements: place.elements() });
        json.elements.push({ type: "expression", name: "probe", expression: "{" + ref + "}" });
        const survey = new SurveyModel(json);
        const detail = place.kind(survey).choices[0].panel.getQuestionByName("detail");
        detail.value = "x";
        expect(detail.getDataPath(), place.name + ": the data path").toEqual(["detail"]);
        expect(survey.data.detail, place.name + ": a key of the survey data").toBe("x");
        const value = survey.runExpression("{" + ref + "}");
        const resolved = refFindings(json).length === 0;
        expect(resolved, place.name + ", " + ref + " (runtime: " + JSON.stringify(value) + ")").toBe(value !== undefined && value !== null);
        expectQuestionFound(survey, ref, undefined, resolved, place.inRecord ? knownAs(["detail"], CHOICE_PANEL_IN_RECORD) : {});
      });
    });
  });
  test("its key meets a root container key: nesting/key-conflict, in each place; a key of its select question's level does not", () => {
    choicePanelPlaces.forEach(place => {
      const json = auto({ elements: place.elements() });
      json.elements.push({ type: "panel", name: "pd", valueName: "detail", elements: [{ type: "text", name: "z" }] });
      expect(brief(findingsOf(json, "nesting/key-conflict")), place.name).toEqual(["nesting/key-conflict/questionKey @ elements[1].valueName"]);
      if (!place.own) return;
      const ownJson = auto({ elements: place.elements() });
      place.own(ownJson.elements).push({ type: "panel", name: "pd", valueName: "detail", elements: [{ type: "text", name: "z" }] });
      expect(brief(findingsOf(ownJson, "nesting/key-conflict")), place.name + ": the select question's own level").toEqual([]);
    });
  });
  test("a nesting panel inside a choice panel nests in the survey data", () => {
    const choices = [{ value: 1, elements: [{ type: "panel", name: "pp", valueName: "chin", elements: [{ type: "text", name: "detail" }] }] }];
    const json = auto({ elements: [{ type: "panel", name: "p", valueName: "address", elements: [{ type: "checkbox", name: "kind", choices: choices }] }] });
    const survey = new SurveyModel(json);
    const detail = (<any>survey.getQuestionByName("p.kind")).choices[0].panel.elements[0].elements[0];
    detail.value = "x";
    expect(survey.data, "#1").toEqual({ chin: { detail: "x" } });
    ["chin.detail", "address.chin.detail", "detail"].forEach(ref => {
      const lintJson = JSON.parse(JSON.stringify(json));
      lintJson.elements.push({ type: "expression", name: "probe", expression: "{" + ref + "}" });
      const value = survey.runExpression("{" + ref + "}");
      const resolved = refFindings(lintJson).length === 0;
      const hasValue = value !== undefined && value !== null;
      if (ref === "detail") {
        expect([resolved, hasValue], ref + ": the linter only, until step 07").toEqual([true, false]);
        return;
      }
      expect(resolved, ref + " (runtime: " + JSON.stringify(value) + ")").toBe(hasValue);
      expectQuestionFound(survey, ref, undefined, resolved);
    });
  });
  test("a choice panel's own expressions run in the survey data, outside the record", () => {
    const choiceQuestion = (): any => ({ type: "checkbox", name: "kind",
      choices: [{ value: 1, elements: [{ type: "text", name: "detail" }, { type: "text", name: "d2" }] }] });
    const cases: Array<{ elements: () => Array<any>, data: any, sitePath: string, refs: Array<string>, d2: (s: SurveyModel) => any }> = [
      { elements: () => [{ type: "paneldynamic", name: "dp", templateElements: [{ type: "text", name: "ps" }, choiceQuestion()] }],
        data: { top: 1, dp: [{ ps: "p" }], detail: "x" }, sitePath: "elements[1].templateElements[1].choices[0].elements[1]",
        refs: ["panel.ps", "ps", "top", "detail"],
        d2: s => (<any>s.getQuestionByName("dp")).panels[0].getQuestionByName("kind").choices[0].panel.getQuestionByName("d2") },
      { elements: () => [{ type: "matrixdynamic", name: "md", detailPanelMode: "underRow", columns: [{ name: "c1" }], detailElements: [choiceQuestion()] }],
        data: { top: 1, md: [{ c1: "c" }], detail: "x" }, sitePath: "elements[1].detailElements[0].choices[0].elements[1]",
        refs: ["row.c1", "top", "detail", "row.detail"],
        d2: s => {
          const row = (<any>s.getQuestionByName("md")).visibleRows[0];
          row.showDetailPanel();
          return row.detailPanel.getQuestionByName("kind").choices[0].panel.getQuestionByName("d2");
        } },
    ];
    cases.forEach(c => c.refs.forEach(ref => {
      const json = auto({ elements: [{ type: "text", name: "top" }].concat(c.elements()) });
      jsonAt(json, c.sitePath).visibleIf = "{" + ref + "} notempty";
      const survey = new SurveyModel(json);
      survey.data = c.data;
      const resolved = refFindings(json).filter(f => f.path === c.sitePath + ".visibleIf").length === 0;
      expect(resolved, ref).toBe(c.d2(survey).isVisible);
    }));
  });
  test("a valueName panel in a choice panel of a dynamic panel's template nests in the survey data, as at runtime", () => {
    // known since review-02/report-01: the runtime attaches the panel with the place "survey"; the linter follows the data
    const choices = [{ value: 1, elements: [{ type: "panel", name: "cp", valueName: "cpk", elements: [{ type: "text", name: "detail" }] }] }];
    const json = auto({ elements: [{ type: "paneldynamic", name: "dp", panelCount: 1,
      templateElements: [{ type: "checkbox", name: "kind", choices: choices }] }] });
    const survey = new SurveyModel(json);
    const detail = (<any>survey.getQuestionByName("dp")).panels[0].getQuestionByName("kind").choices[0].panel.elements[0].elements[0];
    detail.value = "x";
    expect(survey.data, "#1").toEqual({ dp: [{}], cpk: { detail: "x" } });
    expect(detail.getDataPath(), "#2").toEqual(["cpk", "detail"]);
    ["cpk.detail", "dp[0].cpk.detail", "detail"].forEach(ref => {
      const lintJson = JSON.parse(JSON.stringify(json));
      lintJson.elements.push({ type: "expression", name: "probe", expression: "{" + ref + "}" });
      const value = survey.runExpression("{" + ref + "}");
      const resolved = refFindings(lintJson).length === 0;
      const hasValue = value !== undefined && value !== null;
      if (ref === "detail") {
        expect([resolved, hasValue], ref + ": the linter only, until step 07").toEqual([true, false]);
        return;
      }
      expect(resolved, ref + " (runtime: " + JSON.stringify(value) + ")").toBe(hasValue);
      expectQuestionFound(survey, ref, undefined, resolved, knownAs(["cpk.detail"], CHOICE_PANEL_IN_RECORD));
    });
  });
  test("\"page\" and the by-name panel modes: a choice panel's question is a key of the survey data to the linter", () => {
    // "page": the runtime writes the root key (the data path) but reads the page's object back (scoped-names
    // differences-06, M9). "panel" / "panelAndPage": the runtime nests a choice panel under its generated name
    // choicePanel_sp_N, from the global element id (M9: a choice panel should never nest).
    ["page", "panel", "panelAndPage"].forEach(mode => {
      const json: any = { dataNesting: mode, pages: [{ name: "page1", elements: [choicePanelQuestion()] },
        { name: "page2", elements: [{ type: "expression", name: "probe", expression: "{detail} + {page1.detail}" }] }] };
      const reason = mode === "panel" ? "notFound" : "inContainer";
      expect(brief(refFindings(json)), mode + ": {detail} resolves, {page1.detail} reads nothing")
        .toEqual(["reference/unknown/" + reason + " @ pages[1].elements[0].expression"]);
    });
    ["page", "panel", "panelAndPage"].forEach(mode => {
      const survey = new SurveyModel({ dataNesting: mode, pages: [{ name: "page1", elements: [choicePanelQuestion()] }] });
      const kind: any = survey.getAllQuestions(false, false, true).filter(q => q.name === "kind")[0];
      const detail = kind.choices[0].panel.getQuestionByName("detail");
      detail.value = "x";
      const path = detail.getDataPath();
      const value = survey.runExpression("{detail}");
      const found = !!survey.getQuestionByVariable("detail");
      if (mode === "page") {
        expect([path, value, found], "\"page\": written to the survey data").toEqual([["detail"], "x", true]);
      } else {
        // the known runtime defect (M9): the linter keys the question in the survey data, as the other modes do
        expect([path.length, path[0].indexOf("choicePanel_"), value, found], mode + ": the runtime nests the choice panel")
          .toEqual([2, 0, null, false]);
      }
    });
  });
  test("{panel.x} of a choice panel's question is the choice panel, wherever the select question is", () => {
    // A question's {panel.x} reads its parent panel: for a choice panel's question that is the choice panel itself,
    // not an outer static panel, nor a dynamic panel's record. Values are set through the questions: a nesting
    // panel's choice panel question writes the survey data but loads its value back from the container's object.
    const choiceWith = (els: Array<any>): any => ({ type: "checkbox", name: "kind",
      choices: [{ value: 1, elements: [{ type: "text", name: "detail" }].concat(els) }] });
    const insideChoice = [{ type: "text", name: "c2", visibleIf: "{panel.x} notempty" }, { type: "text", name: "c3", visibleIf: "{panel.detail} notempty" }];
    const inRecord = [{ type: "text", name: "d2", visibleIf: "{panel.ps} notempty" }, { type: "text", name: "d3", visibleIf: "{panel.detail} notempty" },
      { type: "text", name: "d4", visibleIf: "{panel.x} notempty" }];
    const sibling = { type: "text", name: "y", visibleIf: "{panel.detail} notempty" };
    const dp = (): any => ({ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "ps" }, choiceWith(inRecord), sibling] });
    const cases: Array<{ name: string, elements: Array<any>, sites: Array<string> }> = [
      { name: "a static panel", elements: [{ type: "panel", name: "sp", elements: [{ type: "text", name: "x" }, sibling, choiceWith(insideChoice)] }],
        sites: ["y", "c2", "c3"] },
      { name: "a nesting panel", elements: [{ type: "panel", name: "sp", valueName: "address", elements: [{ type: "text", name: "x" }, sibling, choiceWith(insideChoice)] }],
        sites: ["y", "c2", "c3"] },
      { name: "the root", elements: [{ type: "text", name: "x" }, choiceWith(insideChoice)], sites: ["c2", "c3"] },
      { name: "a dynamic panel", elements: [dp()], sites: ["d2", "d3", "d4", "y"] },
      { name: "a dynamic panel in a static panel", elements: [{ type: "panel", name: "sp", elements: [{ type: "text", name: "x" }, dp()] }],
        sites: ["d2", "d3", "d4", "y"] },
    ];
    cases.forEach(c => {
      const json = auto({ elements: c.elements });
      const findings = refFindings(json);
      const survey = new SurveyModel(json);
      const all = survey.getAllQuestions(false, false, true);
      const dynamic: any = all.filter(q => q.name === "dp")[0];
      const holder: any = !!dynamic ? dynamic.panels[0] : undefined;
      const kind: any = !!holder ? holder.getQuestionByName("kind") : all.filter(q => q.name === "kind")[0];
      const choicePanel = kind.choices[0].panel;
      const question = (name: string): any => choicePanel.getQuestionByName(name) || (!!holder ? holder.getQuestionByName(name) : undefined)
        || all.filter(q => q.name === name)[0];
      ["x", "ps", "detail"].forEach(name => { if (question(name)) question(name).value = "v"; });
      // a value set on a choice panel's question does not run the {panel.detail} condition next to it again
      (<any>survey).runConditions();
      c.sites.forEach(name => {
        const q = question(name);
        const ref = q.visibleIf.replace(/^\{|\} notempty$/g, "");
        const resolved = !findings.some(f => /\.visibleIf$/.test(f.path) && jsonAt(json, f.path.replace(/\.visibleIf$/, "")).name === name);
        expect(resolved, c.name + ", " + name + " " + ref).toBe(q.isVisible);
        expectQuestionFound(survey, ref, q, resolved);
      });
    });
  });
});

// Review 04, prompt 01, the owners creator-api/01 settled: a choice, a validator and a trigger are passed as they are
// to getQuestionByVariable, and the linter resolves their sites in their owner question's scope.
describe("linter nested data: the second oracle at a choice, a validator and a trigger", () => {
  const json = (): any => ({ dataNesting: "auto", elements: [
    { type: "text", name: "street", valueName: "topStreet" },
    { type: "text", name: "q1" },
    { type: "panel", name: "panel1", valueName: "address", elements: [
      { type: "text", name: "street" }, { type: "text", name: "zip", valueName: "z" },
      { type: "radiogroup", name: "kind", choices: [{ value: "a", visibleIf: "{X}" }], validators: [{ type: "expression", expression: "{X}" }] },
      { type: "multipletext", name: "mt", items: [{ name: "i1", validators: [{ type: "expression", expression: "{X}" }] }] }] },
    { type: "paneldynamic", name: "dp", templateElements: [
      { type: "text", name: "ps" },
      { type: "panel", name: "inner", valueName: "in", elements: [{ type: "text", name: "st" },
        { type: "radiogroup", name: "rg", choices: [{ value: "a", visibleIf: "{X}" }], validators: [{ type: "expression", expression: "{X}" }] }] }] },
    { type: "matrixdynamic", name: "md", columns: [{ name: "c1", cellType: "dropdown", choices: [{ value: 1, visibleIf: "{X}" }],
      validators: [{ type: "expression", expression: "{X}" }] }, { name: "c2" }] },
    { type: "text", name: "item" }
  ], triggers: [{ type: "setvalue", expression: "{X}", setToName: "q1", setValue: 2 }] });
  const recordRg = (s: SurveyModel): any => {
    const dp: any = s.getQuestionByName("dp");
    dp.panelCount = 1;
    return dp.panels[0].getQuestionByName("rg");
  };
  const templateRg = (s: SurveyModel): any => (<any>s.getQuestionByName("dp")).template.getQuestionByName("rg");
  const ITEM_VARIABLE = "a choice's own {item}: it names no question";
  const ROW_CELL = "a matrix cell: getQuestionByVariable answers element questions only";
  const COLUMN_ITEM = "a column's own {item} ({item} = 'a' fails at runtime), not the root question";
  const sites: Array<{ name: string, path: string, context: (s: SurveyModel) => Base, known: { [ref: string]: string } }> = [
    { name: "a choice's visibleIf, in a nesting panel", path: "elements[2].elements[2].choices[0].visibleIf",
      context: s => (<any>s.getQuestionByName("panel1.kind")).choices[0], known: knownAs(["item"], ITEM_VARIABLE) },
    { name: "a validator's expression, in a nesting panel", path: "elements[2].elements[2].validators[0].expression",
      context: s => (<any>s.getQuestionByName("panel1.kind")).validators[0], known: {} },
    { name: "a choice, in a nesting panel of a dynamic panel's record", path: "elements[3].templateElements[1].elements[1].choices[0].visibleIf",
      context: s => recordRg(s).choices[0], known: knownAs(["item"], ITEM_VARIABLE, knownAs(["street", "mt.i1"], UNTIL_STEP_07)) },
    { name: "a validator, in a nesting panel of a dynamic panel's record", path: "elements[3].templateElements[1].elements[1].validators[0].expression",
      context: s => recordRg(s).validators[0], known: knownAs(["street", "mt.i1"], UNTIL_STEP_07) },
    { name: "a choice, in a nesting panel of a dynamic panel's template", path: "elements[3].templateElements[1].elements[1].choices[0].visibleIf",
      context: s => templateRg(s).choices[0], known: knownAs(["item"], ITEM_VARIABLE, knownAs(["street", "mt.i1"], UNTIL_STEP_07)) },
    { name: "a validator, in a nesting panel of a dynamic panel's template", path: "elements[3].templateElements[1].elements[1].validators[0].expression",
      context: s => templateRg(s).validators[0], known: knownAs(["street", "mt.i1"], UNTIL_STEP_07) },
    { name: "a trigger's expression", path: "triggers[0].expression", context: s => s.triggers[0], known: knownAs(["street", "mt.i1"], UNTIL_STEP_07) },
    { name: "a multiple text item's validator", path: "elements[2].elements[3].items[0].validators[0].expression",
      context: s => (<any>s.getQuestionByName("panel1.mt")).items[0].validators[0], known: knownAs(["street", "mt.i1"], UNTIL_STEP_07) },
    { name: "a matrix column's choice", path: "elements[4].columns[0].choices[0].visibleIf",
      context: s => (<any>s.getQuestionByName("md")).columns[0].templateQuestion.choices[0],
      known: knownAs(["item"], ITEM_VARIABLE, knownAs(["row.c2"], ROW_CELL, knownAs(["street", "mt.i1"], UNTIL_STEP_07))) },
    { name: "a matrix column's validator", path: "elements[4].columns[0].validators[0].expression",
      context: s => (<any>s.getQuestionByName("md")).columns[0].validators[0],
      known: knownAs(["item"], COLUMN_ITEM, knownAs(["row.c2"], ROW_CELL, knownAs(["street", "mt.i1"], UNTIL_STEP_07))) },
  ];
  const refs = ["street", "topStreet", "address.street", "z", "address.z", "q1", "item", "st", "in.st", "panel.in.st", "panel.ps",
    "md", "row.c2", "c2", "mt.i1", "address.mt.i1"];
  test("every reference the linter resolves at the site names a question from the site, as the runtime's metadata walk finds it", () => {
    sites.forEach(site => refs.forEach(ref => {
      const text = JSON.stringify(json()).split("{X}").join("{" + ref + "} notempty");
      const resolved = refFindings(JSON.parse(text)).filter(f => f.path === site.path).length === 0;
      const survey = new SurveyModel(JSON.parse(text));
      expectQuestionFound(survey, ref, site.context(survey), resolved, site.known);
    }));
  });
  test("the oracle agrees with the runtime probe of creator-api/report-01", () => {
    const survey = new SurveyModel(json());
    const name = (ref: string, context: Base): string => {
      const info = survey.getQuestionByVariable(ref, context);
      return !info ? "null" : info.question.getDataPath().join(".") + "|" + info.rest;
    };
    const kind: any = survey.getQuestionByName("panel1.kind");
    expect(name("street", kind.choices[0]), "a choice: the inner street").toBe("address.street|");
    expect(name("street", kind.validators[0]), "a validator: the inner street").toBe("address.street|");
    expect(name("q1", survey.triggers[0]), "a trigger: the root").toBe("q1|");
    expect(name("street", survey.triggers[0]), "a trigger: no inner name from the root").toBe("null");
    expect(name("address.street", survey.triggers[0]), "a trigger: the path").toBe("address.street|");
    const rg: any = (<any>survey.getQuestionByName("dp")).template.getQuestionByName("rg");
    expect(name("st", rg.choices[0]), "{st}: a template's choice").toBe("st|");
    expect(name("st", rg.validators[0]), "{st}: a template's validator").toBe("st|");
    expect(name("st", recordRg(survey).choices[0]), "{st}: a record's choice").toBe("in.st|");
    expect(name("item", kind.choices[0]), "a choice's own {item}").toBe("null");
    const mtValidator = (<any>survey.getQuestionByName("panel1.mt")).items[0].validators[0];
    expect(name("street", mtValidator), "a multiple text item's validator: {street}").toBe("null");
    expect(name("address.street", mtValidator), "a multiple text item's validator: {address.street}").toBe("address.street|");
  });
  test("a multiple text item's validator reads the survey data at runtime", () => {
    const valid = (expression: string): boolean => {
      const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "panel", name: "p", valueName: "address", elements: [
        { type: "text", name: "zip", valueName: "z" },
        { type: "multipletext", name: "mt", items: [{ name: "i1", validators: [{ type: "expression", expression: expression }] }] }] }] });
      survey.data = { address: { z: 1, mt: { i1: "v" } } };
      return survey.getQuestionByName("p.mt").validate(false);
    };
    expect(valid("{z} = 1"), "{z}: reads nothing").toBe(false);
    expect(valid("{address.z} = 1"), "{address.z}").toBe(true);
  });
});

// Review 04, prompt 08: a multiple text item has no context of its own, so its validators, its expressions and its
// piped title run in the survey data wherever its question is (the runtime probe of report-08). Each placement: what
// the linter reports for the item's reference, next to what the runtime reads for it.
describe("linter nested data: a multiple text item's sites run in the survey data, as at runtime", () => {
  const zip = (name = "zip"): any => ({ type: "text", name: name, valueName: "z" });
  const mtOf = (item: any): any => ({ type: "multipletext", name: "mt", items: [Object.assign({ name: "i1" }, item)] });
  const validated = (ref: string, value: number): any => mtOf({ validators: [{ type: "expression", expression: "{" + ref + "} = " + value }] });
  const VALIDATOR_PATH = /items\[0\]\.validators\[0\]\.expression$/;
  const itemFindings = (elements: Array<any>, path: RegExp): Array<ILintFinding> =>
    refFindings(auto({ elements: elements })).filter(f => path.test(f.path));
  type Placement = { elements: (mt: any) => Array<any>, data: any, mt: (s: SurveyModel) => any };
  const isValid = (placement: Placement, ref: string, value: number): boolean => {
    const survey = new SurveyModel(auto({ elements: placement.elements(validated(ref, value)) }));
    survey.data = placement.data;
    const question = placement.mt(survey);
    question.value = { i1: "v" };
    return question.validate(false);
  };
  const expectItemRef = (placement: Placement, ref: string, value: number, known: boolean): void => {
    expect(itemFindings(placement.elements(validated(ref, value)), VALIDATOR_PATH).length, "{" + ref + "}: the linter's finding").toBe(known ? 0 : 1);
    expect(isValid(placement, ref, value), "{" + ref + "} = " + value + ": the runtime").toBe(known);
  };
  const nestingPanel: Placement = {
    elements: mt => [{ type: "panel", name: "p", valueName: "address", elements: [zip(), mt] }],
    data: { address: { z: 1 } }, mt: s => s.getQuestionByName("p.mt"),
  };
  // a record holds z = 1 at the paths the survey data holds z = 2 at: the item reads 2
  const recordElements = (mt: any): Array<any> => [zip("rz"), { type: "panel", name: "p", valueName: "address", elements: [zip(), mt] }];
  const surveyAddress = { type: "panel", name: "ap", valueName: "address", elements: [zip("topZip")] };

  test("at the root: {z} is a key of the survey data", () => {
    const root: Placement = { elements: mt => [zip(), mt], data: { z: 1 }, mt: s => s.getQuestionByName("mt") };
    expectItemRef(root, "z", 1, true);
    expectItemRef(root, "address.z", 1, false);
  });
  test("in a nesting panel: {z} is a key of the panel's object, which the item does not read", () => {
    expectItemRef(nestingPanel, "z", 1, false);
    expectItemRef(nestingPanel, "address.z", 1, true);
    // the suggestion is the data path the runtime reads, as getQuestionVariableName gives it
    const finding = itemFindings(nestingPanel.elements(validated("z", 1)), VALIDATOR_PATH)[0];
    const survey = new SurveyModel(auto({ elements: nestingPanel.elements(validated("z", 1)) }));
    expect(finding.suggestion).toBe(survey.getQuestionVariableName(survey.getQuestionByName("p.zip")));
    expect(finding.suggestion).toBe("address.z");
    expect(finding.fix.edits[0].value).toBe("{address.z} = 1");
  });
  test("in a nesting panel: the item's title and its defaultValueExpression read the survey data too", () => {
    const item = (ref: string): any => mtOf({ title: "T {" + ref + "}", defaultValueExpression: "{" + ref + "}" });
    const findings = (ref: string): Array<string> =>
      itemFindings(nestingPanel.elements(item(ref)), /items\[0\]\./).map(f => f.path.replace(/^.*items\[0\]\./, "") + ":" + f.suggestion);
    expect(findings("z")).toEqual(["defaultValueExpression:address.z", "title:address.z"]);
    expect(findings("address.z")).toEqual([]);
    const read = (ref: string): Array<any> => {
      const survey = new SurveyModel(auto({ elements: nestingPanel.elements(item(ref)) }));
      survey.data = nestingPanel.data;
      const question: any = survey.getQuestionByName("p.mt");
      return [question.items[0].locTitle.renderedHtml, question.items[0].editor.value];
    };
    expect(read("z"), "{z}").toEqual(["T {z}", null]);
    expect(read("address.z"), "{address.z}").toEqual(["T 1", 1]);
  });
  test("in a static panel: {panel.x} names nothing for the item", () => {
    const staticPanel: Placement = {
      elements: mt => [{ type: "panel", name: "p", elements: [{ type: "text", name: "x" }, mt] }], data: { x: 1 }, mt: s => s.getQuestionByName("mt"),
    };
    expectItemRef(staticPanel, "x", 1, true);
    expectItemRef(staticPanel, "panel.x", 1, false);
  });
  test("in a dynamic panel's record: the item reads the survey data, not the record", () => {
    const record: Placement = {
      elements: mt => [surveyAddress, { type: "paneldynamic", name: "dp", templateElements: recordElements(mt) }],
      data: { address: { z: 2 }, dp: [{ z: 1, address: { z: 1 } }] },
      mt: s => (<any>s.getQuestionByName("dp")).panels[0].getQuestionByName("mt"),
    };
    expectItemRef(record, "address.z", 2, true);
    expect(isValid(record, "address.z", 1), "{address.z} = 1: not the record's object").toBe(false);
    expectItemRef(record, "z", 1, false);
    expectItemRef(record, "panel.z", 1, false);
    // no data path from the survey reaches a record's key without the record's index
    expect(itemFindings(record.elements(validated("z", 1)), VALIDATOR_PATH)[0].suggestion).toBeUndefined();
  });
  test("in a matrix's detail panel: the item reads the survey data, not the row", () => {
    const row: Placement = {
      elements: mt => [surveyAddress, { type: "matrixdynamic", name: "md", rowCount: 1, detailPanelMode: "underRow",
        columns: [{ name: "c1" }], detailElements: recordElements(mt) }],
      data: { address: { z: 2 }, md: [{ z: 1, address: { z: 1 } }] },
      mt: s => {
        const matrixRow = (<any>s.getQuestionByName("md")).visibleRows[0];
        matrixRow.showDetailPanel();
        return matrixRow.detailPanel.getQuestionByName("mt");
      },
    };
    expectItemRef(row, "address.z", 2, true);
    expect(isValid(row, "address.z", 1), "{address.z} = 1: not the row's object").toBe(false);
    expectItemRef(row, "z", 1, false);
    expectItemRef(row, "row.z", 1, false);
  });
});

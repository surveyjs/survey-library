import { describe, test, expect } from "vitest";
import { buildIndex } from "../../src/linter/walker";
import { lintSurvey } from "../../src/linter/index";

describe("walker paths and normalization", () => {
  test("paths mirror the pages form", () => {
    const index = buildIndex({
      pages: [{ name: "p1", elements: [{ type: "text", name: "q1", visibleIf: "{x} = 1" }] }],
    }, {});
    expect(index.expressionSites[0].path).toBe("pages[0].elements[0].visibleIf");
  });
  test("paths mirror the legacy questions alias", () => {
    const index = buildIndex({
      questions: [{ type: "text", name: "q1", visibleIf: "{x} = 1" }],
    }, {});
    expect(index.expressionSites[0].path).toBe("questions[0].visibleIf");
  });
  test("questions alias works on pages, panels, and templates", () => {
    const index = buildIndex({
      pages: [{
        questions: [{
          type: "panel", name: "pn",
          questions: [{
            type: "paneldynamic", name: "pd",
            questions: [{ type: "text", name: "inner" }],
          }],
        }],
      }],
    }, {});
    const names = index.allElements.map(el => el.name);
    expect(names).toContain("pn");
    expect(names).toContain("pd");
    expect(names).toContain("inner");
    const inner = index.allElements.filter(el => el.name === "inner")[0];
    expect(inner.path).toBe("pages[0].questions[0].questions[0].questions[0]");
  });
  test("template elements are not registered globally", () => {
    const index = buildIndex({
      elements: [{
        type: "paneldynamic", name: "pd",
        templateElements: [{ type: "text", name: "inner" }],
      }],
    }, {});
    expect(index.byName.has("pd")).toBeTruthy();
    expect(index.byName.has("inner")).toBeFalsy();
    const pd = index.allElements.filter(el => el.name === "pd")[0];
    expect(pd.templateNames.has("inner")).toBeTruthy();
  });
  test("scalar and object choices are normalized", () => {
    const index = buildIndex({
      elements: [{
        type: "radiogroup", name: "q1",
        choices: [1, "two", { value: "three", text: "Three" }],
      }],
    }, {});
    const record = index.allElements[0];
    expect(record.choicesInfo.staticValues).toEqual([1, "two", "three"]);
  });
  test("legacy trigger synthesis matches the runtime form", () => {
    const index = buildIndex({
      triggers: [{ type: "complete", name: "q1", operator: "equal", value: 3 }],
    }, {});
    expect(index.triggers[0].expressionSite.text).toBe("{q1} equal 3");
    expect(index.triggers[0].expressionSite.synthesized).toBe(true);
  });
  test("legacy trigger with a string value quotes it", () => {
    const index = buildIndex({
      triggers: [{ type: "complete", name: "q1", value: "yes" }],
    }, {});
    expect(index.triggers[0].expressionSite.text).toBe("{q1} equal 'yes'");
  });
  test("legacy trigger without a required value produces no site", () => {
    const index = buildIndex({
      triggers: [{ type: "complete", name: "q1", operator: "equal" }],
    }, {});
    expect(index.triggers[0].expressionSite).toBeUndefined();
  });
  test("cyclic JSON objects do not hang the walker", () => {
    const page: any = { name: "p1", elements: [{ type: "text", name: "q1" }] };
    const survey: any = { pages: [page] };
    page.elements.push(page);
    expect(() => lintSurvey(survey)).not.toThrow();
  });
  test("scope frames stack for a matrix inside a dynamic panel", () => {
    const index = buildIndex({
      elements: [{
        type: "paneldynamic", name: "pd",
        templateElements: [{
          type: "matrixdynamic", name: "m1",
          columns: [{ name: "col1", visibleIf: "{row.col1} > 0" }],
        }],
      }],
    }, {});
    const site = index.expressionSites.filter(s => s.prop === "visibleIf")[0];
    expect(site.scope.map(f => f.kind)).toEqual(["panelDynamic", "matrixRow"]);
  });
  test("multipletext items and validators are collected", () => {
    const index = buildIndex({
      elements: [{
        type: "multipletext", name: "mt",
        items: [{
          name: "item1",
          validators: [{ type: "expression", expression: "{mt.item1} > 0" }],
        }],
      }],
    }, {});
    const mt = index.allElements.filter(el => el.name === "mt")[0];
    expect(mt.multipleTextItems.has("item1")).toBeTruthy();
    expect(index.expressionSites).toHaveLength(1);
    expect(index.expressionSites[0].path).toBe("elements[0].items[0].validators[0].expression");
  });
});

describe("validator type spellings", () => {
  // the serializer appends the "validator" suffix only when missing, so both
  // "expression" and "expressionvalidator" load as ExpressionValidator at runtime
  test("the full 'expressionvalidator' type name is linted like 'expression'", () => {
    const res = lintSurvey({
      elements: [{
        type: "text",
        name: "q1",
        validators: [{ type: "expressionvalidator", expression: "{doesNotExist} > 1" }],
      }],
    });
    expect(res.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(1);
  });
});

describe("composite component definitions", () => {
  const fullnameComponent = (visibleIf: string) => ({
    components: {
      fullname: {
        elementsJSON: [
          { type: "text", name: "first" },
          { type: "text", name: "last", visibleIf: visibleIf },
        ],
      },
    },
  });
  test("expressions inside options.components elementsJSON are linted", () => {
    const res = lintSurvey(
      { elements: [{ type: "fullname", name: "fn1" }] },
      fullnameComponent("{composite.fist} notempty"));
    const unknown = res.findings.filter(f => f.ruleId === "reference/unknown");
    expect(unknown).toHaveLength(1);
    expect(unknown[0].suggestion).toBe("first");
    expect(unknown[0].path).toBe("components.fullname.elementsJSON[1].visibleIf");
  });
  test("valid composite references are clean", () => {
    const res = lintSurvey(
      { elements: [{ type: "fullname", name: "fn1" }] },
      fullnameComponent("{composite.first} notempty"));
    expect(res.findings).toHaveLength(0);
  });
});

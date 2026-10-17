import { describe, test, expect } from "vitest";
import { Model } from "survey-core";
import { lintSurvey } from "../../src/linter/index";

describe("inArray conditions match runtime item lookup", () => {
  ["matrixdynamic", "paneldynamic"].forEach(type => {
    test(type + " filters read bare item keys before survey values", () => {
      const container = type === "matrixdynamic"
        ? { type: type, name: "items", columns: [{ name: "amount", cellType: "text", inputType: "number" }] }
        : { type: type, name: "items", templateElements: [{ type: "text", name: "amount", inputType: "number" }] };
      const json: any = {
        elements: [
          container,
          { type: "text", name: "amount", inputType: "number", max: 0 },
          { type: "text", name: "threshold", inputType: "number" },
          { type: "expression", name: "total", expression: "sumInArray({items}, 'amount', '{amount} > {threshold}')" },
        ],
      };
      const survey = new Model(json);
      survey.data = { items: [{ amount: 3 }, { amount: -1 }], amount: -10, threshold: 0 };
      expect(survey.getValue("total")).toBe(3);
      // the clash of the template question with the survey question is the point of this
      // fixture, and name/duplicate rightly reports it; the filter resolution is what is tested
      const others = () => lintSurvey(json).findings.filter(f => f.ruleId !== "name/duplicate");
      expect(others()).toHaveLength(0);
      json.elements[3].expression = "sumInArray({items}, 'amount', '{amount} > 0')";
      expect(others()).toHaveLength(0);
      json.elements[1].name = "surveyAmount";
      expect(lintSurvey(json).findings).toHaveLength(0);
      json.elements[3].expression = "sumInArray({items}, 'amount', '{missing} > 0')";
      expect(lintSurvey(json).findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(1);
    });
  });

  test("a false filter does not make its question or page unreachable", () => {
    const json = {
      pages: [
        { name: "input", elements: [{ type: "matrixdynamic", name: "items", columns: [{ name: "amount", cellType: "text" }] }] },
        { name: "result", elements: [{ type: "text", name: "target", visibleIf: "sumInArray({items}, 'amount', '1 = 2') = 0" }] },
        { name: "next", elements: [{ type: "text", name: "dependent", visibleIf: "{target} notempty" }] },
      ],
    };
    const survey = new Model(json);
    survey.data = { items: [{ amount: 3 }], target: "answer" };
    expect(survey.getQuestionByName("target").isVisible).toBe(true);
    expect(survey.getPageByName("result").isVisible).toBe(true);
    expect(survey.getQuestionByName("dependent").isVisible).toBe(true);
    const findings = lintSurvey(json).findings;
    expect(findings.filter(f => f.ruleId === "page/empty" || f.ruleId === "element/never-visible")).toHaveLength(0);
    const contradictions = findings.filter(f => f.ruleId === "expression/contradiction");
    expect(contradictions).toHaveLength(1);
    expect(contradictions[0].path).toBe("pages[1].elements[0].visibleIf.inArray[0]");
    expect(contradictions[0].message).toContain("filter");
    expect(contradictions[0].message).not.toContain("never shown");
  });
});

// The fields every container of the tables below holds, as question JSON. A matrix takes them
// as columns, a dynamic panel as its template.
const ITEM_FIELDS: Array<any> = [
  { type: "text", name: "product" },
  { type: "text", name: "quantity", inputType: "number" },
  { type: "text", name: "price", inputType: "number" },
  { type: "text", name: "amount", inputType: "number" },
  { type: "boolean", name: "approved" },
  { type: "dropdown", name: "status", choices: [1, 2] },
];
const ITEM_ROWS: Array<any> = [
  { product: "P-100", quantity: 3, price: 5, amount: 2, approved: true, status: 1 },
  { product: "P-200", quantity: 2, price: 7, amount: 8, approved: false, status: 2 },
];
const CONTAINER_TYPES = ["matrixdynamic", "matrixdropdown", "paneldynamic"];

function itemsContainer(type: string): any {
  if (type === "paneldynamic") return { type: type, name: "items", templateElements: ITEM_FIELDS };
  const columns = ITEM_FIELDS.map(field => {
    const column: any = { ...field, cellType: field.type };
    delete column.type;
    return column;
  });
  if (type === "matrixdropdown") return { type: type, name: "items", rows: ["r1", "r2"], columns: columns };
  return { type: type, name: "items", columns: columns };
}
function itemsValue(type: string): any {
  return type === "matrixdropdown" ? { r1: ITEM_ROWS[0], r2: ITEM_ROWS[1] } : ITEM_ROWS;
}
function surveyWith(type: string, expression: string, elements: Array<any> = []): any {
  return { elements: [itemsContainer(type)].concat(elements, [{ type: "expression", name: "total", expression: expression }]) };
}
function runTotal(json: any, data: any): any {
  const survey = new Model(json);
  survey.data = data;
  return survey.getValue("total");
}
function summary(json: any, options?: any): Array<string> {
  return lintSurvey(json, options).findings.map(f => f.ruleId + "/" + f.reason + " @ " + f.path + (f.fix ? " +fix" : ""));
}

describe("unquoted inArray filters", () => {
  CONTAINER_TYPES.forEach(type => {
    test(type + ": an unquoted filter reads the item's fields", () => {
      const cases: Array<{ expression: string, value: any }> = [
        { expression: "sumInArray({items}, 'quantity', {product} = 'P-100')", value: 3 },
        { expression: "sumInArray({items}, 'amount', {approved} = true)", value: 2 },
        { expression: "countInArray({items}, 'quantity', {quantity} > 0)", value: 2 },
        { expression: "sumInArray({items}, 'amount', !({amount} > 5))", value: 2 },
        { expression: "sumInArray({items}, 'amount', {product} notempty and {status} = 2)", value: 8 },
      ];
      cases.forEach(item => {
        const json = surveyWith(type, item.expression);
        expect(runTotal(json, { items: itemsValue(type) }), item.expression).toBe(item.value);
        expect(summary(json), item.expression).toEqual([]);
      });
    });
  });

  test("the return-column form takes the fourth argument as the filter", () => {
    const json = surveyWith("matrixdynamic", "sumInArray({items}, 'quantity', 'price', {product} = 'P-100')");
    expect(runTotal(json, { items: ITEM_ROWS })).toBe(3);
    expect(summary(json)).toEqual([]);
    json.elements[1].expression = "sumInArray({items}, 'quantity', 'price', {missing} = 'P-100')";
    expect(summary(json)).toEqual(["reference/unknown/notFound @ elements[1].expression.inArray[0]"]);
  });

  // what the quoted form reports, the unquoted one reports too - at the same path, once,
  // and never with a fix, because the filter is no property of its own
  const PARITY: Array<{ label: string, filter: string, ruleId: string }> = [
    { label: "an unknown item field", filter: "{missing} > 0", ruleId: "reference/unknown" },
    { label: "an unknown choice value of a column", filter: "{status} = 5", ruleId: "expression/unknown-choice" },
    { label: "a type mismatch", filter: "{approved} = 5", ruleId: "expression/type-mismatch" },
    { label: "a filter that is always false", filter: "1 = 2", ruleId: "expression/contradiction" },
    { label: "a filter no item can meet", filter: "{amount} > 5 and {amount} < 3", ruleId: "expression/contradiction" },
    { label: "an unknown function", filter: "missingFn({amount}) > 0", ruleId: "expression/unknown-function" },
  ];
  CONTAINER_TYPES.forEach(type => {
    PARITY.forEach(item => {
      test(type + ": " + item.label + " is reported in both forms alike", () => {
        const quoted = summary(surveyWith(type, "sumInArray({items}, 'amount', '" + item.filter + "')"));
        const unquoted = summary(surveyWith(type, "sumInArray({items}, 'amount', " + item.filter + ")"));
        expect(quoted).toHaveLength(1);
        expect(quoted[0].indexOf(item.ruleId + "/")).toBe(0);
        expect(quoted[0]).toContain(" @ elements[1].expression.inArray[0]");
        expect(unquoted).toEqual(quoted);
      });
    });
  });

  test("an unquoted filter that never holds does not make its question unreachable", () => {
    const json = {
      pages: [
        { name: "input", elements: [itemsContainer("matrixdynamic")] },
        { name: "result", elements: [{ type: "text", name: "target", visibleIf: "sumInArray({items}, 'amount', 1 = 2) = 0" }] },
      ],
    };
    expect(summary(json)).toEqual(["expression/contradiction/alwaysFalse @ pages[1].elements[0].visibleIf.inArray[0]"]);
  });

  test("an inArray call inside an unquoted filter gets a filter of its own", () => {
    const json = surveyWith("matrixdynamic",
      "sumInArray({items}, 'amount', countInArray({kids}, 'age', {age} > {missing}) > 0)",
      [{ type: "paneldynamic", name: "kids", templateElements: [{ type: "text", name: "age", inputType: "number" }] }]);
    expect(summary(json)).toEqual(["reference/unknown/notFound @ elements[2].expression.inArray[0].inArray[0]"]);
  });

  test("a filter operand that may be a string gets no item site: a bare reference", () => {
    // the runtime takes the question's value when it is a string, so the parent reads it
    const json = surveyWith("matrixdynamic", "sumInArray({items}, 'amount', {filterText})",
      [{ type: "text", name: "filterText" }]);
    expect(runTotal(json, { items: ITEM_ROWS, filterText: "{amount} > 2" })).toBe(8);
    expect(summary(json)).toEqual([]);
    // an item field is not looked up at the parent's scope
    json.elements[2].expression = "sumInArray({items}, 'amount', {amount})";
    expect(summary(json)).toEqual(["reference/unknown/notFound @ elements[2].expression"]);
  });

  test("a filter operand that may be a string gets no item site: iif() with string branches", () => {
    const expression = "sumInArray({items}, 'amount', iif({mode} = 'high', '{amount} > 2', '{amount} > 0'))";
    const json = surveyWith("matrixdynamic", expression, [{ type: "text", name: "mode" }]);
    expect(runTotal(json, { items: ITEM_ROWS, mode: "high" })).toBe(8);
    expect(runTotal(json, { items: ITEM_ROWS, mode: "low" })).toBe(10);
    expect(summary(json)).toEqual([]);
    // each constant string branch is a filter of its own
    json.elements[2].expression = "sumInArray({items}, 'amount', iif({mode} = 'high', '{missing} > 2', '{amount} > {other}'))";
    expect(summary(json)).toEqual([
      "reference/unknown/notFound @ elements[2].expression.inArray[0]",
      "reference/unknown/notFound @ elements[2].expression.inArray[1]",
    ]);
    // the iif() condition runs in the parent's scope, where an item field is unknown
    json.elements[2].expression = "sumInArray({items}, 'amount', iif({amount} = 'high', '{amount} > 2', '{amount} > 0'))";
    expect(summary(json)).toEqual(["reference/unknown/notFound @ elements[2].expression"]);
    // a branch that is not a constant string is not analysed
    json.elements[2].expression = "sumInArray({items}, 'amount', iif({mode} = 'high', {mode}, '{amount} > 0'))";
    expect(summary(json)).toEqual([]);
  });

  test("an array whose items are unknown: the filter's names are not reported", () => {
    const json = { elements: [{ type: "expression", name: "total", expression: "sumInArray({unknownArray}, 'x', {y} > 0)" }] };
    const findings = lintSurvey(json).findings;
    expect(findings.map(f => f.ruleId + "/" + f.reason + " @ " + f.path)).toEqual(["reference/unknown/notFound @ elements[0].expression"]);
    expect(findings[0].messageData.name).toBe("unknownArray");
    const options = { knownVariables: ["hostArray"] };
    json.elements[0].expression = "sumInArray({hostArray}, 'x', {y} > 0 and {z} = 'a')";
    expect(summary(json, options)).toEqual([]);
    json.elements[0].expression = "sumInArray({hostArray}, 'x', 1 = 2)";
    expect(summary(json, options)).toEqual([]);
    // what does not depend on the items is still checked
    json.elements[0].expression = "sumInArray({hostArray}, 'x', missingFn({y}) > 0)";
    expect(summary(json, options)).toEqual(["expression/unknown-function/notRegistered @ elements[0].expression"]);
  });
});

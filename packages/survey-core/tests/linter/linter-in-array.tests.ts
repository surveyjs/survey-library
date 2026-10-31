import { describe, test, expect } from "vitest";
import { Model } from "survey-core";
import { lintSurvey } from "../../src/linter/index";
import { withFunction } from "./lint-test-helpers";

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

  test("a filter with a quote inside a string is not a syntax error", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m", columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }] },
        { type: "expression", name: "e", expression: String.raw`sumInArray({m}, 'a', {b} = 'it\'s')` },
      ],
    };
    expect(lintSurvey(json).findings.filter(f => f.ruleId === "expression/syntax")).toHaveLength(0);
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
  });

  // An operand that cannot give a string in the parent's scope - it reads no name that resolves
  // there and holds no string constant - always runs per item as it is written
  // (getInArrayParams: originalParams[i].toString()), so it is a filter of its own.
  test("an operand that never gives a string is a filter of its own", () => {
    const cases: Array<{ filter: string, value: number }> = [
      { filter: "{approved}", value: 2 },
      { filter: "{price} > 4 and {approved}", value: 2 },
      { filter: "{product} notempty and {approved}", value: 2 },
      { filter: "iif({price} > 6, {approved} = false, {approved})", value: 10 },
    ];
    cases.forEach(item => {
      const json = surveyWith("matrixdynamic", "sumInArray({items}, 'amount', " + item.filter + ")");
      expect(runTotal(json, { items: ITEM_ROWS }), item.filter).toBe(item.value);
      expect(summary(json), item.filter).toEqual([]);
    });
    // a name neither the item nor the survey holds is reported at the filter, not at the parent
    const json = surveyWith("matrixdynamic", "sumInArray({items}, 'amount', {price} > 4 and {aproved})");
    expect(runTotal(json, { items: ITEM_ROWS })).toBe(0);
    expect(summary(json)).toEqual(["reference/unknown/notFound @ elements[1].expression.inArray[0]"]);
    // the runtime counts an item only when the filter gives true, so arithmetic counts none
    json.elements[1].expression = "sumInArray({items}, 'amount', {quantity} - 3)";
    expect(runTotal(json, { items: ITEM_ROWS })).toBe(0);
    expect(summary(json)).toEqual(["expression/meaningless-condition/notABoolean @ elements[1].expression.inArray[0]"]);
  });

  test("an operand that never gives a string: the call sits in a dynamic panel template", () => {
    const json: any = {
      elements: [itemsContainer("matrixdynamic"), {
        type: "paneldynamic", name: "orders", panelCount: 1,
        templateElements: [{ type: "expression", name: "subtotal", expression: "sumInArray({items}, 'amount', {approved})" }],
      }],
    };
    const run = (): any => {
      const survey = new Model(json);
      survey.data = { items: ITEM_ROWS, orders: [{}] };
      return (<any>survey.getQuestionByName("orders")).panels[0].getQuestionByName("subtotal").value;
    };
    expect(run()).toBe(2);
    expect(summary(json)).toEqual([]);
    json.elements[1].templateElements[0].expression = "sumInArray({items}, 'amount', {aproved})";
    expect(run()).toBe(0);
    expect(summary(json)).toEqual(["reference/unknown/notFound @ elements[1].templateElements[0].expression.inArray[0]"]);
  });

  // An operand that reads a survey name may give a string - which text runs then depends on the
  // data. When it reads an item field too, it is not analysed: the item field is no survey name.
  test("an operand that may give a string and reads an item field is not analysed", () => {
    const json = surveyWith("matrixdynamic", "sumInArray({items}, 'amount', {label} or {approved})",
      [{ type: "text", name: "label" }]);
    // the survey value is a string, so it is the filter's text
    expect(runTotal(json, { items: ITEM_ROWS, label: "{amount} > 2" })).toBe(8);
    // the survey value is empty, so the operand's own text runs per item
    expect(runTotal(json, { items: ITEM_ROWS })).toBe(2);
    expect(summary(json)).toEqual([]);
  });

  test("a function without a boolean returnType that reads an item field is not analysed", () => {
    withFunction("firstOf", (params: Array<any>) => params[0] || params[1], () => {
      const json = surveyWith("matrixdynamic", "sumInArray({items}, 'amount', firstOf({rule}, {approved}))",
        [{ type: "text", name: "rule" }]);
      expect(runTotal(json, { items: ITEM_ROWS, rule: "{amount} > 2" })).toBe(8);
      expect(runTotal(json, { items: ITEM_ROWS })).toBe(2);
      expect(summary(json)).toEqual([]);
    });
  });

  test("a null literal in an unquoted filter is reported at the filter", () => {
    const json = surveyWith("matrixdynamic", "sumInArray({items}, 'amount', '{product} != null')");
    expect(runTotal(json, { items: ITEM_ROWS })).toBe(10);
    expect(summary(json)).toEqual([]);
    // the operand's source text drops the null ("({product} != )"), which the runtime cannot run
    json.elements[1].expression = "sumInArray({items}, 'amount', {product} != null)";
    expect(runTotal(json, { items: ITEM_ROWS })).toBe(0);
    expect(summary(json)).toEqual(["expression/syntax/unparsable @ elements[1].expression.inArray[0]"]);
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
    // a branch that reads a survey name may give a string: it stays a part of the parent
    json.elements[2].expression = "sumInArray({items}, 'amount', iif({mode} = 'high', {mode}, '{amount} > 0'))";
    expect(summary(json)).toEqual([]);
  });

  test("an iif() with a string branch: a branch that never gives a string is a filter of its own", () => {
    const expression = "sumInArray({items}, 'amount', iif({mode} = 'high', {amount} > 2, '{amount} > 0'))";
    const json = surveyWith("matrixdynamic", expression, [{ type: "text", name: "mode" }]);
    // the operand branch gives false in the parent's scope, so the whole iif() runs per item
    expect(runTotal(json, { items: ITEM_ROWS, mode: "high" })).toBe(8);
    expect(runTotal(json, { items: ITEM_ROWS, mode: "low" })).toBe(10);
    expect(summary(json)).toEqual([]);
    json.elements[2].expression = "sumInArray({items}, 'amount', iif({mode} = 'high', {missing} > 2, '{amount} > {other}'))";
    expect(runTotal(json, { items: ITEM_ROWS, mode: "high" })).toBe(0);
    expect(runTotal(json, { items: ITEM_ROWS, mode: "low" })).toBe(0);
    expect(summary(json)).toEqual([
      "reference/unknown/notFound @ elements[2].expression.inArray[0]",
      "reference/unknown/notFound @ elements[2].expression.inArray[1]",
    ]);
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

  test("an array whose items are unknown: a call nested in its filter is not analysed either", () => {
    const options = { knownVariables: ["hostArray"] };
    const json = surveyWith("matrixdynamic",
      "sumInArray({hostArray}, 'x', countInArray({items}, 'amount', {amount} > 2) > 0)");
    const run = (): any => {
      const survey = new Model(json);
      survey.setVariable("hostArray", [{ x: 1 }, { x: 5 }]);
      survey.data = { items: ITEM_ROWS };
      return survey.getValue("total");
    };
    expect(run()).toBe(6);
    expect(summary(json, options)).toEqual([]);
    // the nested filter is left alone with the filter that holds it: a misspelt field goes unreported
    json.elements[1].expression = "sumInArray({hostArray}, 'x', countInArray({items}, 'amount', {amout} > 2) > 0)";
    expect(run()).toBe(0);
    expect(summary(json, options)).toEqual([]);
  });
});

// The runtime evaluates an unquoted filter in the scope of the expression first, so the survey
// names it reads are dependencies of the expression; the names inside a string filter are not.
describe("inArray filters as dependencies", () => {
  const calcSurvey = (filter: string): any => ({
    elements: [itemsContainer("matrixdynamic"), { type: "text", name: "limit", inputType: "number" }],
    calculatedValues: [{ name: "c1", expression: "sumInArray({items}, 'amount', " + filter + ")" }],
  });

  test("a survey name read by an unquoted filter re-runs the calculated value", () => {
    const run = (filter: string): Array<any> => {
      const survey = new Model(calcSurvey(filter));
      survey.data = { items: ITEM_ROWS, limit: 0 };
      const before = survey.getVariable("c1");
      survey.setValue("limit", 5);
      return [before, survey.getVariable("c1")];
    };
    expect(run("{amount} > {limit}")).toEqual([10, 8]);
    expect(run("'{amount} > {limit}'")).toEqual([10, 10]);
  });

  test("a calculated value read by its own unquoted filter is a cycle", () => {
    const json = calcSurvey("{amount} > {c1}");
    const survey = new Model(json);
    survey.data = { items: ITEM_ROWS };
    expect(survey.getVariable("c1")).toBe(10);
    expect(summary(json)).toEqual(["cycle/calculated-value/self @ calculatedValues[0].expression"]);
    // the string form does not depend on what it reads
    json.calculatedValues[0].expression = "sumInArray({items}, 'amount', '{amount} > {c1}')";
    expect(summary(json)).toEqual([]);
  });
});

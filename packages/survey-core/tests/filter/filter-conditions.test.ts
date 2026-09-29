import { describe, test, expect } from "vitest";
import {
  getConditionOperatorTitle, getFilterFieldOperators, getFilterFieldDefaultOperator, getFilterValueEditorJson,
  FilterConditionItem, conditionsToExpression
} from "../../src/filter/filter-conditions";
import { FilterField } from "../../src/filter/filter-field";
import { ItemValue } from "../../src/itemvalue";
import { IDynamicDataFilterField } from "../../src/dynamic-data/dynamic-data-fields";
import { IFilterCondition } from "../../src/interfaces/ui-interfaces";
import { ConditionRunner } from "../../src/conditions/conditionRunner";
import "../../src/question_text";
import "../../src/question_dropdown";
import "../../src/question_checkbox";
import "../../src/question_tagbox";
import "../../src/question_radiogroup";
import "../../src/question_expression";

// A plain field descriptor, no FilterField/templateQuestion needed: conditionsToExpression only
// reads name/valueName/valueType off it.
function field(valueName: string, valueType: string = "string"): IDynamicDataFilterField {
  return { name: valueName, valueName: valueName, locTitle: undefined, valueType: <any>valueType,
    fieldType: "text", templateQuestion: undefined };
}
const runs = (record: any, expression: string): boolean => new ConditionRunner(expression).runValues(record);

describe("getConditionOperatorTitle", () => {
  test("returns the English title for each condition operator", () => {
    expect(getConditionOperatorTitle("empty"), "#1").toBe("Empty");
    expect(getConditionOperatorTitle("notempty"), "#2").toBe("Not empty");
    expect(getConditionOperatorTitle("equal"), "#3").toBe("Equals");
    expect(getConditionOperatorTitle("notequal"), "#4").toBe("Does not equal");
    expect(getConditionOperatorTitle("contains"), "#5").toBe("Contains");
    expect(getConditionOperatorTitle("notcontains"), "#6").toBe("Does not contain");
    expect(getConditionOperatorTitle("anyof"), "#7").toBe("Any of");
    expect(getConditionOperatorTitle("noneof"), "#8").toBe("None of");
    expect(getConditionOperatorTitle("allof"), "#9").toBe("All of");
    expect(getConditionOperatorTitle("greater"), "#10").toBe("Greater than");
    expect(getConditionOperatorTitle("less"), "#11").toBe("Less than");
    expect(getConditionOperatorTitle("greaterorequal"), "#12").toBe("Greater than or equal to");
    expect(getConditionOperatorTitle("lessorequal"), "#13").toBe("Less than or equal to");
  });
  // German has no translation of these keys yet, so the lookup must fall back to English rather
  // than return the key name or undefined.
  test("a locale without a translation falls back to English", () => {
    expect(getConditionOperatorTitle("equal", "de")).toBe("Equals");
  });
  // An operator the table does not know (a future operator, a typo) has no title to look up, so the
  // best it can do is echo the operator name back rather than return undefined.
  test("an unknown operator falls back to its own name", () => {
    expect(getConditionOperatorTitle("regex")).toBe("regex");
  });
});

describe("getFilterFieldOperators", () => {
  test("dropdown: no contains, has anyof", () => {
    const field = new FilterField("f");
    field.fieldType = "dropdown";
    const ops = getFilterFieldOperators(field.getFilterField());
    expect(ops).not.toContain("contains");
    expect(ops).toContain("anyof");
  });
  test("checkbox: has contains, the default operator is allof", () => {
    const field = new FilterField("f");
    field.fieldType = "checkbox";
    const descriptor = field.getFilterField();
    expect(getFilterFieldOperators(descriptor)).toContain("contains");
    expect(getFilterFieldDefaultOperator(descriptor)).toBe("allof");
  });
  test("a typeless number or date field takes no contains/notcontains", () => {
    const numberField = new FilterField("n");
    numberField.valueType = "number";
    const dateField = new FilterField("d");
    dateField.valueType = "date";
    [numberField, dateField].forEach((f: FilterField): void => {
      const ops = getFilterFieldOperators(f.getFilterField());
      expect(ops, f.name).not.toContain("contains");
      expect(ops, f.name).not.toContain("notcontains");
    });
  });
  test("a typeless boolean field takes no comparisons at all", () => {
    const field = new FilterField("b");
    field.valueType = "boolean";
    const ops = getFilterFieldOperators(field.getFilterField());
    expect(ops).toEqual(["empty", "notempty", "equal", "notequal"]);
  });
  test("the order follows settings.logic.operators", () => {
    const field = new FilterField("f");
    field.fieldType = "text";
    const ops = getFilterFieldOperators(field.getFilterField());
    expect(ops).toEqual(["empty", "notempty", "equal", "notequal", "contains", "notcontains",
      "greater", "less", "greaterorequal", "lessorequal"]);
  });
});

describe("getFilterValueEditorJson", () => {
  test("a typeless field is always edited as plain text, whatever the operator", () => {
    const field = new FilterField("age");
    expect(getFilterValueEditorJson(field.getFilterField(), "equal")).toEqual({ type: "text" });
    expect(getFilterValueEditorJson(field.getFilterField(), "greater")).toEqual({ type: "text" });
  });
  test("an expression question edits as text", () => {
    const field = new FilterField("f");
    field.fieldType = "expression";
    expect(getFilterValueEditorJson(field.getFilterField(), "equal").type).toBe("text");
  });
  test("anyof/noneof on a non-checkbox select turns the editor into a checkbox, tagbox stays a tagbox", () => {
    const dropdownField = new FilterField("f1");
    dropdownField.fieldType = "dropdown";
    expect(getFilterValueEditorJson(dropdownField.getFilterField(), "anyof").type).toBe("checkbox");
    const tagboxField = new FilterField("f2");
    tagboxField.fieldType = "tagbox";
    expect(getFilterValueEditorJson(tagboxField.getFilterField(), "anyof").type).toBe("tagbox");
  });
  test("contains on a checkbox turns the editor into a radiogroup", () => {
    const field = new FilterField("f");
    field.fieldType = "checkbox";
    expect(getFilterValueEditorJson(field.getFilterField(), "contains").type).toBe("radiogroup");
  });
  test("condition-only properties are cleaned off the editor json", () => {
    const field = new FilterField("f");
    field.fieldType = "text";
    field.templateQuestion.visibleIf = "{other} = 1";
    field.templateQuestion.isRequired = true;
    field.templateQuestion.valueName = "otherName";
    field.templateQuestion.name = "f";
    (<any>field.templateQuestion).showCommentArea = true;
    const json = getFilterValueEditorJson(field.getFilterField(), "equal");
    expect(json.visibleIf, "#1").toBeUndefined();
    expect(json.isRequired, "#2").toBeUndefined();
    expect(json.valueName, "#3").toBeUndefined();
    expect(json.name, "#4").toBeUndefined();
    expect(json.showCommentArea, "#5").toBeUndefined();
  });
  test("field.choices, when given, override the template question's own choices", () => {
    const field = new FilterField("f");
    field.fieldType = "dropdown";
    (<any>field).choices = [1, 2, 3];
    const descriptor = field.getFilterField();
    const choices = [new ItemValue("x", "X"), new ItemValue("y", "Y")];
    descriptor.choices = choices;
    const json = getFilterValueEditorJson(descriptor, "equal");
    expect(json.choices).toEqual(ItemValue.getData(choices));
  });
});

describe("conditionsToExpression", () => {
  const fields = [field("age", "number"), field("name", "string"), field("active", "boolean"), field("mt.city", "string")];
  test("a simple comparison", () => {
    expect(conditionsToExpression([{ field: "age", operator: "greater", value: 18 }], fields)).toBe("{age} > 18");
  });
  test("an apostrophe in the value is escaped", () => {
    const text = conditionsToExpression([{ field: "name", operator: "contains", value: "O'Brien" }], fields);
    expect(text).toBe("{name} contains 'O\\'Brien'");
    expect(runs({ name: "Mr O'Brien" }, text), "the built text still runs").toBe(true);
  });
  test("an anyof value is written as an array", () => {
    expect(conditionsToExpression([{ field: "name", operator: "anyof", value: ["a", "b"] }], fields))
      .toBe("{name} anyof ['a', 'b']");
  });
  test("empty/notempty carry no value", () => {
    expect(conditionsToExpression([{ field: "name", operator: "empty" }], fields)).toBe("{name} empty");
    expect(conditionsToExpression([{ field: "name", operator: "notempty" }], fields)).toBe("{name} notempty");
  });
  test("a numeric string is coerced to a number for a number field", () => {
    expect(conditionsToExpression([{ field: "age", operator: "equal", value: "18" }], fields)).toBe("{age} = 18");
  });
  test("\"true\"/\"false\" are coerced to booleans for a boolean field", () => {
    expect(conditionsToExpression([{ field: "active", operator: "equal", value: "true" }], fields))
      .toBe("{active} = true");
  });
  test("a condition on an unknown field is dropped", () => {
    expect(conditionsToExpression(
      [{ field: "nosuchfield", operator: "equal", value: 1 }, { field: "age", operator: "equal", value: 20 }], fields))
      .toBe("{age} = 20");
  });
  test("an unready first condition does not hide the ones after it", () => {
    const conditions: Array<IFilterCondition> = [
      { field: "name", operator: "equal", value: undefined }, { field: "age", operator: "equal", value: 20 }];
    expect(conditionsToExpression(conditions, fields)).toBe("{age} = 20");
  });
  test("a dotted valueName is written as one variable", () => {
    expect(conditionsToExpression([{ field: "mt.city", operator: "equal", value: "Berlin" }], fields))
      .toBe("{mt.city} = 'Berlin'");
  });
  test("the built expression runs through ConditionRunner", () => {
    const text = conditionsToExpression(
      [{ field: "age", operator: "greater", value: "18" }, { field: "active", operator: "equal", value: "true" }],
      fields);
    expect(text).toBe("{age} > 18 and {active} = true");
    expect(runs({ age: 20, active: true }, text), "#1").toBe(true);
    expect(runs({ age: 10, active: true }, text), "#2").toBe(false);
  });
});

describe("FilterConditionItem", () => {
  test("getValueText uses toExpressionConst, not the legacy valToText", () => {
    const item = new FilterConditionItem(field("name"), { field: "name", operator: "equal", value: "true" });
    // valToText would leave the string "true" unquoted; toExpressionConst quotes a string value
    // whatever it looks like, and only a real boolean is written bare.
    expect(item.getValueText()).toBe("'true'");
  });
});

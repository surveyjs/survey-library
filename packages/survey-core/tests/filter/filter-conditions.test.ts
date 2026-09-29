import { describe, test, expect } from "vitest";
import {
  getConditionOperatorTitle, getFilterFieldOperators, getFilterFieldDefaultOperator, getFilterValueEditorJson,
  FilterConditionItem, conditionsToExpression, parseFilterExpression, normalizeFilterCondition
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
// A typeless field descriptor: getFilterFieldOperators/getFilterValueEditorJson never touch
// templateQuestion for a typeless field, so undefined is safe here too - useful for
// parseFilterExpression tests, which do call getFilterFieldOperators to check the operator.
function typelessField(valueName: string, valueType: string): IDynamicDataFilterField {
  return { ...field(valueName, valueType), isTypeless: true };
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
  test("a blank string on a number field is not coerced to NaN", () => {
    // Number("  ") is 0, and the old parseFloat-based check turned it into NaN either way - both
    // would be wrong: a blank value is not a number at all, so it is left as the string it was.
    expect(conditionsToExpression([{ field: "age", operator: "equal", value: "  " }], fields)).toBe("{age} = '  '");
  });
  test("a hex string on a number field is read as a real number, not truncated", () => {
    // parseFloat("0x1A") reads only up to the "x" and gives 0; Number("0x1A") reads the whole
    // literal and gives 26, which is what the coercion now uses.
    expect(conditionsToExpression([{ field: "age", operator: "equal", value: "0x1A" }], fields)).toBe("{age} = 26");
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

describe("parseFilterExpression", () => {
  const fields = [typelessField("age", "number"), typelessField("name", "string"), typelessField("active", "boolean")];
  test("an empty expression parses to no conditions", () => {
    expect(parseFilterExpression("", fields)).toEqual([]);
  });
  test("an and-chain parses to one condition per field", () => {
    expect(parseFilterExpression("{age} > 18 and {name} = 'Bob'", fields)).toEqual([
      { field: "age", operator: "greater", value: 18 },
      { field: "name", operator: "equal", value: "Bob" }
    ]);
  });
  test("an or chain cannot be decomposed", () => {
    expect(parseFilterExpression("{age} > 18 or {age} < 5", fields)).toBeNull();
  });
  test("a mix of and/or cannot be decomposed", () => {
    expect(parseFilterExpression("{age} > 18 and ({name} = 'a' or {name} = 'b')", fields)).toBeNull();
  });
  test("two conditions on the same field cannot be decomposed", () => {
    expect(parseFilterExpression("{age} > 5 and {age} < 18", fields)).toBeNull();
  });
  test("a condition on an unknown field cannot be decomposed", () => {
    expect(parseFilterExpression("{nosuchfield} = 1", fields)).toBeNull();
  });
  test("a forbidden operator cannot be decomposed", () => {
    // "contains" is not among the operators a typeless boolean field offers.
    expect(parseFilterExpression("{active} contains 'x'", fields)).toBeNull();
  });
  test("a constant on the left is read with the mirrored operator", () => {
    expect(parseFilterExpression("18 < {age}", fields)).toEqual([{ field: "age", operator: "greater", value: 18 }]);
  });
  test("the cache is correct after the field set changes", () => {
    const text = "{age} = 1 and {name} = 'x'";
    expect(parseFilterExpression(text, fields), "#1: both fields known").toEqual([
      { field: "age", operator: "equal", value: 1 }, { field: "name", operator: "equal", value: "x" }]);
    const fewerFields = [typelessField("age", "number")];
    expect(parseFilterExpression(text, fewerFields), "#2: name is unknown now, same cached text").toBeNull();
    expect(parseFilterExpression(text, fields), "#3: back to the full field set").toEqual([
      { field: "age", operator: "equal", value: 1 }, { field: "name", operator: "equal", value: "x" }]);
  });
  test("an array value is copied out of the cache, not shared with it", () => {
    const dropdownField = new FilterField("choice");
    dropdownField.fieldType = "dropdown";
    const dropdownFields = [dropdownField.getFilterField()];
    const text = "{choice} anyof ['a', 'b']";
    const first = parseFilterExpression(text, dropdownFields);
    first[0].value.push("x");
    // The same text is parsed again: if the first result's array were the cached parse's own
    // array, the mutation above would leak into this second, unrelated call.
    const second = parseFilterExpression(text, dropdownFields);
    expect(second[0].value).toEqual(["a", "b"]);
  });
  test("a condition is keyed by valueName, not by the field's name", () => {
    const boundField: IDynamicDataFilterField = { name: "city", valueName: "mt.city", locTitle: undefined,
      valueType: "string", fieldType: "text", templateQuestion: undefined, isTypeless: true };
    expect(parseFilterExpression("{mt.city} = 'Berlin'", [boundField]))
      .toEqual([{ field: "mt.city", operator: "equal", value: "Berlin" }]);
  });
  test("a duplicate valueName: the first field with it owns the condition, including its operator set", () => {
    // A boolean field's operators narrow away "greater"; a number field's do not. If the second,
    // more permissive field secretly decided validity, this would parse instead of failing.
    const first = typelessField("age", "boolean");
    const second = typelessField("age", "number");
    expect(parseFilterExpression("{age} > 5", [first, second]), "the first field's operators decide").toBeNull();
  });
});

describe("normalizeFilterCondition", () => {
  test("coerces the value to the field's type and names the field by its valueName", () => {
    const age = { ...typelessField("age", "number"), name: "Age" };
    expect(normalizeFilterCondition(age, { field: "Age", operator: "greater", value: "18" }), "#1")
      .toEqual({ field: "age", operator: "greater", value: 18 });
    expect(normalizeFilterCondition(typelessField("vip", "boolean"), { field: "vip", operator: "equal", value: "false" }), "#2")
      .toEqual({ field: "vip", operator: "equal", value: false });
  });
  test("refuses a disallowed operator and a condition that is not ready", () => {
    const age = typelessField("age", "number");
    expect(normalizeFilterCondition(age, { field: "age", operator: "contains", value: "1" }) === undefined, "#1").toBe(true);
    expect(normalizeFilterCondition(age, { field: "age", operator: "equal" }) === undefined, "#2").toBe(true);
    expect(normalizeFilterCondition(age, { field: "age", operator: "equal", value: "" }) === undefined, "#3").toBe(true);
    expect(normalizeFilterCondition(age, { field: "age", operator: "anyof", value: [] }) === undefined, "#4").toBe(true);
    expect(normalizeFilterCondition(age, <any>null) === undefined, "#5").toBe(true);
  });
  test("an operator that takes no value keeps none", () => {
    const res = normalizeFilterCondition(typelessField("age", "number"), { field: "age", operator: "notempty", value: 5 });
    expect(res, "#1").toEqual({ field: "age", operator: "notempty", value: undefined });
    expect(res.value === undefined, "#2").toBe(true);
  });
});

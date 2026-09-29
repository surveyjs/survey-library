import { describe, test, expect } from "vitest";
import {
  getConditionOperatorTitle, getFilterFieldOperators, getFilterFieldDefaultOperator, getFilterValueEditorJson
} from "../../src/filter/filter-conditions";
import { FilterField } from "../../src/filter/filter-field";
import { ItemValue } from "../../src/itemvalue";
import "../../src/question_text";
import "../../src/question_dropdown";
import "../../src/question_checkbox";
import "../../src/question_tagbox";
import "../../src/question_radiogroup";
import "../../src/question_expression";

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

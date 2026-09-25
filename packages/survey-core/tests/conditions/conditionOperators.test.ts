import { describe, test, expect } from "vitest";
import { settings } from "../../src/settings";
import {
  isConditionOperatorEnabled, isQuestionTypeInList, isQuestionClassContains,
  getConditionOperatorNames, getConditionDefaultOperator
} from "../../src/conditions/conditionOperators";
import "../../src/question_text";
import "../../src/question_dropdown";
import "../../src/question_radiogroup";
import "../../src/question_checkbox";
import "../../src/question_tagbox";
import "../../src/question_ranking";
import "../../src/question_imagepicker";
import "../../src/question_boolean";
import "../../src/question_rating";
import "../../src/question_file";

const enabledFor = (questionType: string): Array<string> =>
  getConditionOperatorNames().filter((op: string): boolean => isConditionOperatorEnabled(questionType, op));

describe("condition operators", () => {
  test("the operators come in the order the editors list them", () => {
    expect(getConditionOperatorNames()).toEqual(["empty", "notempty", "equal", "notequal", "contains", "notcontains",
      "anyof", "noneof", "allof", "greater", "less", "greaterorequal", "lessorequal"]);
  });
  test("each operator takes the question types the table names", () => {
    expect(enabledFor("text"), "text").toEqual(["empty", "notempty", "equal", "notequal", "contains", "notcontains",
      "greater", "less", "greaterorequal", "lessorequal"]);
    expect(enabledFor("dropdown"), "dropdown").toEqual(["empty", "notempty", "equal", "notequal", "anyof", "noneof",
      "greater", "less", "greaterorequal", "lessorequal"]);
    expect(enabledFor("checkbox"), "checkbox").toEqual(["empty", "notempty", "equal", "notequal", "contains",
      "notcontains", "anyof", "noneof", "allof"]);
    expect(enabledFor("tagbox"), "tagbox inherits checkbox").toEqual(["empty", "notempty", "equal", "notequal",
      "contains", "notcontains", "anyof", "noneof", "allof"]);
    expect(enabledFor("imagepicker"), "imagepicker").toEqual(["empty", "notempty", "equal", "notequal", "anyof",
      "noneof"]);
    expect(enabledFor("boolean"), "boolean").toEqual(["empty", "notempty", "equal", "notequal"]);
    expect(enabledFor("rating"), "rating").toEqual(["empty", "notempty", "equal", "notequal", "greater", "less",
      "greaterorequal", "lessorequal"]);
    expect(enabledFor("file"), "file").toEqual(["empty", "notempty"]);
  });
  test("a class name takes its descendants, !name refuses them, the nearest class decides", () => {
    expect(isQuestionTypeInList("tagbox", ["checkbox"]), "#1").toBe(true);
    expect(isQuestionTypeInList("tagbox", ["!checkbox"]), "#2").toBe(false);
    expect(isQuestionTypeInList("tagbox", ["tagbox", "!checkbox"]), "#3: tagbox is nearer").toBe(true);
    expect(isQuestionTypeInList("text", ["!file"]), "#4: refusals only take the rest").toBe(true);
    expect(isQuestionTypeInList("text", []), "#5: an empty list takes every type").toBe(true);
    expect(isQuestionTypeInList("", ["checkbox"]), "#6: no type takes every operator").toBe(true);
    expect(isQuestionClassContains("radiogroup", ["checkbox"], []), "#7").toBe(false);
    expect(isQuestionClassContains("ranking", ["checkbox"], []), "#8").toBe(true);
  });
  test("an operator the table does not name takes every type", () => {
    expect(isConditionOperatorEnabled("text", "nosuchoperator")).toBe(true);
  });
  test("a change of the table is read at once", () => {
    const prev = settings.logic.operators.contains;
    settings.logic.operators.contains = ["checkbox"];
    try {
      expect(isConditionOperatorEnabled("text", "contains"), "#1").toBe(false);
      expect(isConditionOperatorEnabled("checkbox", "contains"), "#2").toBe(true);
    } finally {
      settings.logic.operators.contains = prev;
    }
  });
  test("the default operator depends on the question type", () => {
    expect(getConditionDefaultOperator(), "#1").toBe("equal");
    expect(getConditionDefaultOperator("text"), "#2").toBe("equal");
    expect(getConditionDefaultOperator("checkbox"), "#3").toBe("allof");
    expect(getConditionDefaultOperator("tagbox"), "#4").toBe("allof");
    const prev = settings.logic.defaultOperators.default;
    settings.logic.defaultOperators.default = "notequal";
    try {
      expect(getConditionDefaultOperator("text"), "#5").toBe("notequal");
    } finally {
      settings.logic.defaultOperators.default = prev;
    }
  });
});

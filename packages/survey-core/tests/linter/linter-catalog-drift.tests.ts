// Drift guard: fails when the library gains an expression-bearing property, a new
// question type, or a new expression scope variable that src/linter/catalog.ts does
// not know about. Importing the package entry (vitest aliases "survey-core" to
// entries/index.ts) populates the Serializer registry.
import "survey-core";
import { Serializer } from "../../src/jsonobject";
import { ElementFactory } from "../../src/questionfactory";
import { settings } from "../../src/settings";
import { describe, test, expect } from "vitest";
import { getCoveredExpressionProps, IGNORED_EXPRESSION_PROPS, isKnownQuestionType } from "../../src/linter/catalog";

describe("linter catalog drift guard", () => {
  test("every expression property in the Serializer is covered by the linter catalog", () => {
    const covered: { [key: string]: boolean } = {};
    getCoveredExpressionProps().forEach(pair => {
      covered[pair.className.toLowerCase() + "." + pair.propName.toLowerCase()] = true;
    });
    IGNORED_EXPRESSION_PROPS.forEach(entry => {
      expect(entry.reason, "IGNORED_EXPRESSION_PROPS entries need a reason").toBeTruthy();
      covered[entry.className.toLowerCase() + "." + entry.propName.toLowerCase()] = true;
    });
    const missing: Array<string> = [];
    const seen: { [key: string]: boolean } = {};
    Serializer.getAllClasses().forEach(className => {
      Serializer.getProperties(className).forEach(prop => {
        if (!prop.isExpression) return;
        // attribute the property to the class that declares it, not every descendant
        const declaringClass = prop.classInfo ? prop.classInfo.name : className;
        const key = declaringClass.toLowerCase() + "." + prop.name.toLowerCase();
        if (seen[key]) return;
        seen[key] = true;
        if (!covered[key]) {
          missing.push(key);
        }
      });
    });
    expect(missing, "Add these expression properties to src/linter/catalog.ts " +
      "(TYPE_EXPRESSION_PROPS/getCoveredExpressionProps) or to IGNORED_EXPRESSION_PROPS with a reason: " +
      missing.join(", ")).toEqual([]);
  });

  test("the questions alias appears only where the walker expects it", () => {
    const expected: { [key: string]: boolean } = {
      "survey.elements": true,
      "panelbase.elements": true,
      "paneldynamic.templateElements": true,
    };
    Serializer.getAllClasses().forEach(className => {
      Serializer.getProperties(className).forEach(prop => {
        if (prop.alternativeName !== "questions") return;
        const declaringClass = prop.classInfo ? prop.classInfo.name : className;
        const key = declaringClass + "." + prop.name;
        expect(expected[key], "Unexpected 'questions' alias at " + key +
          " - teach src/linter/walker.ts about this container").toBeTruthy();
      });
    });
  });

  test("expression scope variables match what the linter resolves", () => {
    const expected = [
      "survey", "self", "parent", "matrix", "composite", "item", "choice", "column",
      "row", "prevRow", "nextRow", "totalRow", "rowIndex", "visibleRowIndex",
      "rowValue", "rowName", "rowTitle",
      "panel", "prevPanel", "nextPanel", "parentPanel", "panelIndex", "visiblePanelIndex",
      "unwrapPostfix",
    ].sort();
    expect(Object.keys(settings.expressionVariables).sort(),
      "settings.expressionVariables changed - update src/linter/expression-utils.ts").toEqual(expected);
  });

  test("every registered element type is known to the linter", () => {
    const missing = ElementFactory.Instance.getAllTypes()
      .filter(type => !isKnownQuestionType(type.toLowerCase()));
    expect(missing, "Add these question types to KNOWN_QUESTION_TYPES in src/linter/catalog.ts: " +
      missing.join(", ")).toEqual([]);
  });

  test("carry-forward and choicesByUrl properties still exist under the expected names", () => {
    ["choicesFromQuestion", "choiceValuesFromQuestion", "choiceTextsFromQuestion", "choicesByUrl"].forEach(name => {
      expect(Serializer.findProperty("selectbase", name), "selectbase." + name + " is gone").toBeTruthy();
    });
    ["setToName", "fromName"].forEach(name => {
      expect(Serializer.findProperty("copyvaluetrigger", name), "copyvaluetrigger." + name + " is gone").toBeTruthy();
    });
    expect(Serializer.findProperty("skiptrigger", "gotoName")).toBeTruthy();
    expect(Serializer.findProperty("survey", "calculatedValues")).toBeTruthy();
  });
});

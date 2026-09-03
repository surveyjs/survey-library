// Drift guard for the little that is still hardcoded. The lists of expression
// properties and of element/trigger types are read from the Serializer at runtime
// (src/linter/metadata.ts), so what needs pinning is the linter-only semantics in
// src/linter/catalog.ts plus the bridge that resolves types through the registry.
// Importing the package entry (vitest aliases "survey-core" to entries/index.ts)
// populates the Serializer registry.
import "survey-core";
import { Serializer } from "../../src/jsonobject";
import { SurveyModel } from "../../src/survey";
import { settings } from "../../src/settings";
import { describe, test, expect } from "vitest";
import {
  ITEMVALUE_SCOPED_PROPS, PROP_KIND_OVERRIDES, TEMPLATE_SCOPED_PROPS, TEXT_SCOPED_PROPS,
  TEXT_TEMPLATE_PROPS, TRIGGER_TARGET_KINDS,
} from "../../src/linter/catalog";
import { LintMetadata } from "../../src/linter/metadata";

// Every element type the core ships. A floor, not a ceiling: the linter accepts any
// type the deserializer can build, but it must never stop accepting these.
const CORE_ELEMENT_TYPES = [
  "boolean", "buttongroup", "checkbox", "comment", "dropdown", "expression",
  "file", "flowpanel", "html", "image", "imagemap", "imagepicker", "matrix",
  "matrixdropdown", "matrixdynamic", "multipletext", "panel", "paneldynamic",
  "radiogroup", "ranking", "rating", "signaturepad", "slider", "tagbox", "text",
];

const CORE_TRIGGER_TYPES = ["complete", "copyvalue", "runexpression", "setvalue", "skip", "visible"];

// A trigger property whose type names an element or a page is a reference the linter
// has to resolve, so an unmapped one is a coverage hole rather than a plain property.
const REFERENCE_PROP_TYPE = /question|page/;

function isLocalizableProp(propName: string): boolean {
  let res = false;
  Serializer.getAllClasses().forEach(className => {
    Serializer.getProperties(className).forEach(prop => {
      if (prop.isLocalizable && prop.name.toLowerCase() === propName) res = true;
    });
  });
  return res;
}

function findExpressionProp(propName: string): Array<string> {
  const types: Array<string> = [];
  Serializer.getAllClasses().forEach(className => {
    Serializer.getProperties(className).forEach(prop => {
      if (!prop.isExpression) return;
      if (prop.name.toLowerCase() !== propName) return;
      if (types.indexOf(prop.type) < 0) types.push(prop.type);
    });
  });
  return types;
}

describe("linter catalog drift guard", () => {
  test("every scoped property in the catalog is still a registered expression property", () => {
    const missing: Array<string> = [];
    ITEMVALUE_SCOPED_PROPS.forEach(propName => {
      if (findExpressionProp(propName).length === 0) missing.push(propName);
    });
    TEMPLATE_SCOPED_PROPS.forEach(propName => {
      if (findExpressionProp(propName).length === 0) missing.push(propName);
    });
    expect(missing, "These properties are gone or no longer expressions; update " +
      "ITEMVALUE_SCOPED_PROPS/TEMPLATE_SCOPED_PROPS in src/linter/catalog.ts: " +
      missing.join(", ")).toEqual([]);
  });

  test("every kind override still contradicts the serializer", () => {
    PROP_KIND_OVERRIDES.forEach((kind, propName) => {
      const types = findExpressionProp(propName);
      expect(types.length, propName + " is no longer a registered expression property - " +
        "drop it from PROP_KIND_OVERRIDES").toBeGreaterThan(0);
      expect(types, propName + " is now registered as \"" + kind +
        "\" - the PROP_KIND_OVERRIDES entry is dead").not.toContain(kind);
    });
  });

  test("every trigger property that names a question or a page is a mapped target", () => {
    const unmapped: Array<string> = [];
    Serializer.getChildrenClasses("surveytrigger", true).forEach(cls => {
      Serializer.getProperties(cls.name).forEach(prop => {
        if (!REFERENCE_PROP_TYPE.test(prop.type) || TRIGGER_TARGET_KINDS.has(prop.type)) return;
        unmapped.push(cls.name + "." + prop.name + ":" + prop.type);
      });
    });
    expect(unmapped, "Map these property types in TRIGGER_TARGET_KINDS in " +
      "src/linter/catalog.ts: " + unmapped.join(", ")).toEqual([]);
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

  test("every core element type resolves through the registry", () => {
    const metadata = new LintMetadata();
    const missing = CORE_ELEMENT_TYPES.filter(type => !metadata.isKnownElementType(type));
    expect(missing, "src/linter/metadata.ts no longer recognizes these element types: " +
      missing.join(", ")).toEqual([]);
  });

  test("every core trigger type resolves through the registry", () => {
    const metadata = new LintMetadata();
    expect(CORE_TRIGGER_TYPES.filter(type => !metadata.getTriggerDef(type))).toEqual([]);
    expect(metadata.getTriggerTypes().slice().sort()).toEqual(CORE_TRIGGER_TYPES);
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

  test("every text-scoped property in the catalog is still a localizable property", () => {
    const missing: Array<string> = [];
    TEXT_SCOPED_PROPS.forEach((scope, propName) => {
      if (!isLocalizableProp(propName)) missing.push(propName);
    });
    expect(missing, "These properties are gone or no longer localizable; update " +
      "TEXT_SCOPED_PROPS in src/linter/catalog.ts: " + missing.join(", ")).toEqual([]);
  });

  // A template property is taken apart by the runtime instead of being piped: the survey
  // reads {no}/{title}/{require} out of questionTitleTemplate into its own title pattern.
  // Pinned by behaviour - the day the string is piped instead, a {...} in it becomes a
  // reference the linter has to report.
  test("template properties are taken apart by the runtime, not piped", () => {
    TEXT_TEMPLATE_PROPS.forEach(propName => {
      expect(isLocalizableProp(propName), "survey." + propName + " is gone or no longer " +
        "localizable - update TEXT_TEMPLATE_PROPS in src/linter/catalog.ts").toBe(true);
    });
    const survey = new SurveyModel({
      questionTitleTemplate: "{no}. {title} {require}",
      elements: [{ type: "text", name: "q1", title: "My title", isRequired: true }],
    });
    // a variable of that name would answer the placeholder if the template were piped
    ["no", "title", "require"].forEach(name => survey.setVariable(name, "substituted"));
    expect(survey.questionTitlePattern, "questionTitleTemplate is no longer parsed into a " +
      "title pattern - drop it from TEXT_TEMPLATE_PROPS in src/linter/catalog.ts")
      .toBe("numTitleRequire");
    expect(survey.getQuestionByName("q1").locTitle.renderedHtml).toBe("My title");
  });
});

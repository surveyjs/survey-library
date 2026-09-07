import { describe, test, expect } from "vitest";
import { Serializer } from "../src/jsonobject";
import { SurveyModel } from "../src/survey";

// Class names, property names and cell types come from the linted/loaded JSON, so a
// name that happens to be an Object.prototype key must not resolve to a member of the
// prototype chain: Serializer.findClass("constructor") used to hand back the Object
// function, and getAllProperties() then threw on it.
const PROTO_KEYS = ["constructor", "__proto__", "toString", "hasOwnProperty", "valueOf"];

describe("Serializer registries and Object.prototype keys", () => {
  PROTO_KEYS.forEach(key => {
    test("findClass(\"" + key + "\") finds nothing", () => {
      expect(Serializer.findClass(key)).toBeFalsy();
      expect(Serializer.findProperty(key, "name")).toBeFalsy();
      expect(Serializer.isDescendantOf(key, "question")).toBe(false);
      expect(Serializer.createClass(key)).toBeFalsy();
      expect(Serializer.getChildrenClasses(key)).toEqual([]);
      expect(Serializer.getProperties(key)).toEqual([]);
      expect(Serializer.getDynamicPropertiesByTypes("matrixdropdowncolumn", key)).toEqual([]);
      expect(Serializer.getAliasByType(key)).toBeFalsy();
      expect(Serializer.getTypeByAlias(key)).toBeFalsy();
    });
  });

  PROTO_KEYS.forEach(key => {
    test("findProperty(\"question\", \"" + key + "\") finds nothing", () => {
      expect(Serializer.findProperty("question", key)).toBeFalsy();
      expect(Serializer.getObjPropertyValue).toBeDefined();
    });
  });

  test("a question type from Object.prototype does not break loading a survey", () => {
    const survey = new SurveyModel({
      elements: [{ type: "constructor", name: "q1" }, { type: "text", name: "q2" }],
    });
    expect(survey.getAllQuestions()).toHaveLength(1);
    expect(survey.getQuestionByName("q2")).toBeTruthy();
  });

  test("a property named like a prototype key is not silently inherited", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", constructor: "boom", toString: "boom" }],
    });
    const q = survey.getQuestionByName("q1");
    expect(q).toBeTruthy();
    expect(typeof q.toString).toBe("function");
  });

  test("a registered class is still found through its alternative name", () => {
    expect(Serializer.findClass("questionbase")).toBeTruthy();
    expect(Serializer.findClass("question")).toBeTruthy();
  });
});

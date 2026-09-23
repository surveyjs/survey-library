import { describe, test, expect } from "vitest";
import { FilterField } from "../../src/filter/filter-field";
import { JsonObject } from "../../src/jsonobject";

describe("FilterField: fieldType", () => {
  test("a field without fieldType has no question properties", () => {
    const field = new FilterField("country");
    expect(field.valueType).toBe("string");
    expect(field.getValueName()).toBe("country");
    expect((<any>field).inputType).toBe(undefined);
    expect(new JsonObject().toJsonObject(field)).toEqual({ name: "country" });
  });
  test("fieldType adds the question type properties and takes over valueType", () => {
    const field = new FilterField("country");
    field.fieldType = "dropdown";
    (<any>field).choices = [1, 2, 3];
    expect(field.valueType, "#1: the created question answers it").toBe("number");
    field.valueType = "string";
    expect(field.valueType, "#2: read-only while fieldType is set").toBe("number");
    expect(new JsonObject().toJsonObject(field).valueType, "#3: and not serialized").toBe(undefined);
  });
  test("clearing fieldType removes the properties and restores the authored valueType", () => {
    const field = new FilterField("age");
    field.valueType = "number";
    field.fieldType = "dropdown";
    expect(field.valueType, "#1: a dropdown with no choices").toBe("string");
    field.fieldType = "";
    expect((<any>field).choices, "#2").toBe(undefined);
    expect(field.valueType, "#3").toBe("number");
  });
  test("name, title and valueName survive a fieldType change", () => {
    const field = new FilterField("country");
    field.title = "Country";
    field.valueName = "countryCode";
    field.fieldType = "dropdown";
    expect(field.name, "#1").toBe("country");
    expect(field.title, "#2").toBe("Country");
    expect(field.getValueName(), "#3").toBe("countryCode");
  });
  test("an unregistered fieldType falls back to a text question", () => {
    const field = new FilterField("f");
    field.fieldType = "nosuchtype";
    expect(field.templateQuestion.getType()).toBe("text");
  });
  // The transition the empty fieldType makes and no other test covers: the question type does not
  // change - a field with no fieldType already runs on a text question - while the dynamic type goes
  // from "" to "text". A guard that compares question types would skip it and borrow nothing.
  test("fieldType \"text\" borrows the text question properties although the question type is unchanged", () => {
    const field = new FilterField("q");
    expect(field.templateQuestion.getType(), "#1: it already runs on a text question").toBe("text");
    field.fieldType = "text";
    expect(Object.prototype.hasOwnProperty.call(field, "inputType"), "#2: the property is on the field").toBe(true);
    (<any>field).inputType = "number";
    expect(field.valueType, "#3: and it reaches the question").toBe("number");
    expect(new JsonObject().toJsonObject(field), "#4").toEqual({ name: "q", fieldType: "text", inputType: "number" });
  });
  test("a field with a fieldType round-trips through JSON", () => {
    const field = new FilterField("country");
    field.title = "Country";
    field.valueName = "code";
    field.fieldType = "dropdown";
    (<any>field).choices = [1, 2, 3];
    const json = new JsonObject().toJsonObject(field);
    expect(json, "#1").toEqual({ name: "country", title: "Country", valueName: "code", fieldType: "dropdown", choices: [1, 2, 3] });
    const loaded = new FilterField("");
    new JsonObject().toObject(json, loaded);
    expect(loaded.title, "#2").toBe("Country");
    expect((<any>loaded).choices, "#3").toHaveLength(3);
    // The end of the load has to reach the template question: a select question that is still
    // loading has no visibleChoices and answers the wrong value type.
    expect(loaded.valueType, "#4").toBe("number");
  });
  test("the descriptor names the field the way a bound one is named", () => {
    const field = new FilterField("country");
    field.valueName = "code";
    field.fieldType = "dropdown";
    const descriptor = field.getFilterField();
    expect(descriptor.name, "#1").toBe("country");
    expect(descriptor.valueName, "#2").toBe("code");
    expect(descriptor.fieldType, "#3").toBe("dropdown");
    expect(descriptor.templateQuestion, "#4").toBe(field.templateQuestion);
  });
  test("fieldType is read before the type-specific keys whatever the JSON order", () => {
    const field = new FilterField("");
    new JsonObject().toObject({ choices: [1, 2], name: "country", fieldType: "dropdown" }, field);
    expect((<any>field).choices).toHaveLength(2);
  });
});

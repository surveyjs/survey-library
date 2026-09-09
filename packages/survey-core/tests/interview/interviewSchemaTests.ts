// @vitest-environment node
import { createInterview } from "survey-core/interview";
import { ComponentCollection, settings } from "survey-core";

import { afterEach, describe, expect, test } from "vitest";

const petJson = {
  title: "Pet survey",
  clearInvisibleValues: "onHidden",
  elements: [
    { type: "radiogroup", name: "hasPet", title: "Do you have a pet?", isRequired: true, choices: ["Yes", "No"] },
    { type: "dropdown", name: "petType", title: "What kind?", isRequired: true, visibleIf: "{hasPet} = 'Yes'",
      choices: ["Dog", "Cat", "Other"] },
    { type: "text", name: "petAge", title: "Pet age (years)", inputType: "number", min: 0, max: 40,
      visibleIf: "{hasPet} = 'Yes'" },
  ],
};

async function schemaOf(json: any): Promise<any> {
  return (await createInterview(json)).getAnswerSchema();
}

async function propertyOf(element: any): Promise<any> {
  const schema = await schemaOf({ elements: [element] });
  return schema.properties[element.name];
}

const customComponents: Array<string> = [];
afterEach(() => {
  while(customComponents.length > 0) {
    ComponentCollection.Instance.remove(customComponents.pop());
  }
  settings.commentSuffix = "-Comment";
});

describe("interview answer schema (issue #11818)", () => {
  test("The pet survey, at each stage of the conversation", async () => {
    const iv = await createInterview(petJson);
    expect(iv.getAnswerSchema()).toEqual({
      type: "object",
      properties: {
        hasPet: { title: "Do you have a pet?", enum: ["Yes", "No"] },
      },
      required: ["hasPet"],
      additionalProperties: false,
    });

    // The schema is the state, so a question a condition has not revealed yet is not in it.
    await iv.answerAll({ hasPet: "Yes" });
    expect(iv.getAnswerSchema()).toEqual({
      type: "object",
      properties: {
        petType: { title: "What kind?", enum: ["Dog", "Cat", "Other"] },
        petAge: { title: "Pet age (years)", type: "number", minimum: 0, maximum: 40 },
      },
      required: ["petType"],
      additionalProperties: false,
    });

    await iv.answerAll({ petType: "Dog", petAge: 4 });
    expect(iv.getAnswerSchema()).toEqual({
      type: "object", properties: {}, required: [], additionalProperties: false,
    });
  });

  test("A boolean question is an enum of its two values, not a boolean type", async () => {
    // In the model's own order, the one a rendered question offers them in.
    expect(await propertyOf({ type: "boolean", name: "agree", title: "Agree?" }))
      .toEqual({ title: "Agree?", enum: [false, true] });
    expect(await propertyOf({ type: "boolean", name: "agree", title: "Agree?",
      valueTrue: "yes", valueFalse: "no" }))
      .toEqual({ title: "Agree?", enum: ["no", "yes"] });
  });

  test("A date question is a string with the format its input type implies", async () => {
    expect(await propertyOf({ type: "text", name: "born", title: "Born", inputType: "date" }))
      .toEqual({ title: "Born", type: "string", format: "date" });
    expect(await propertyOf({ type: "text", name: "at", title: "At", inputType: "datetime-local" }))
      .toEqual({ title: "At", type: "string", format: "date-time" });
    expect(await propertyOf({ type: "text", name: "at", title: "At", inputType: "time" }))
      .toEqual({ title: "At", type: "string", format: "time" });
  });

  test("A date bound has no keyword, so it is said in the description", async () => {
    expect(await propertyOf({ type: "text", name: "born", title: "Born", inputType: "date",
      min: "2020-01-01", max: "2030-12-31" }))
      .toEqual({ title: "Born", type: "string", format: "date",
        description: "min 2020-01-01, max 2030-12-31" });
    // With a description of its own the bounds follow it, in brackets.
    expect(await propertyOf({ type: "text", name: "born", title: "Born", description: "Your birthday",
      inputType: "date", min: "2020-01-01" }))
      .toEqual({ title: "Born", type: "string", format: "date",
        description: "Your birthday (min 2020-01-01)" });
  });

  test("An array question carries its choices as the element schema", async () => {
    expect(await propertyOf({ type: "checkbox", name: "pets", title: "Pets", choices: ["Dog", "Cat"],
      minSelectedChoices: 1, maxSelectedChoices: 2 }))
      .toEqual({ title: "Pets", type: "array", items: { enum: ["Dog", "Cat"] }, uniqueItems: true,
        minItems: 1, maxItems: 2 });
    // Nothing to enumerate: the array stays, the element schema goes.
    expect(await propertyOf({ type: "tagbox", name: "cities", title: "Cities", choicesLazyLoadEnabled: true }))
      .toEqual({ title: "Cities", type: "array", uniqueItems: true });
  });

  test("A rating question is an enum of its items", async () => {
    expect(await propertyOf({ type: "rating", name: "score", title: "Score", rateMin: 1, rateMax: 3 }))
      .toEqual({ title: "Score", enum: [1, 2, 3] });
    expect(await propertyOf({ type: "rating", name: "mood", title: "Mood",
      rateValues: ["bad", "good"] }))
      .toEqual({ title: "Mood", enum: ["bad", "good"] });
  });

  test("Text constraints become their JSON Schema keywords", async () => {
    expect(await propertyOf({ type: "text", name: "code", title: "Code",
      validators: [{ type: "text", minLength: 3, maxLength: 8 }, { type: "regex", regex: "^[A-Z]+$" }] }))
      .toEqual({ title: "Code", type: "string", minLength: 3, maxLength: 8, pattern: "^[A-Z]+$" });
    // Both ways of declaring an address: the validator, and the input type that validates as one
    // without ever putting a validator in the list.
    expect(await propertyOf({ type: "text", name: "mail", title: "Mail",
      validators: [{ type: "email" }] }))
      .toEqual({ title: "Mail", type: "string", format: "email" });
    expect(await propertyOf({ type: "text", name: "mail", title: "Mail", inputType: "email" }))
      .toEqual({ title: "Mail", type: "string", format: "email" });
  });

  test("A step becomes multipleOf only where the two count from the same place", async () => {
    expect(await propertyOf({ type: "text", name: "n", title: "N", inputType: "number", step: 5 }))
      .toEqual({ title: "N", type: "number", multipleOf: 5 });
    expect(await propertyOf({ type: "text", name: "n", title: "N", inputType: "number", min: 0, step: 5 }))
      .toEqual({ title: "N", type: "number", minimum: 0, multipleOf: 5 });
    // The model steps from min, multipleOf counts from zero: 3, 8, 13 are not multiples of 5, so the
    // step goes unreported rather than wrong.
    expect(await propertyOf({ type: "text", name: "n", title: "N", inputType: "number", min: 3, step: 5 }))
      .toEqual({ title: "N", type: "number", minimum: 3 });
  });

  test("A mask and an expression validator are said in the description", async () => {
    expect(await propertyOf({ type: "text", name: "phone", title: "Phone",
      maskType: "pattern", maskSettings: { pattern: "+9 (999) 999-99-99" } }))
      .toEqual({ title: "Phone", type: "string", description: "mask pattern +9 (999) 999-99-99" });
    expect(await propertyOf({ type: "text", name: "n", title: "N", inputType: "number",
      validators: [{ type: "expression", expression: "{n} > 0" }] }))
      .toEqual({ title: "N", type: "number", description: "expression {n} > 0" });
  });

  test("The \"other\" choice brings a comment property of its own", async () => {
    const schema = await schemaOf({
      elements: [{ type: "dropdown", name: "petType", title: "What kind?", isRequired: true,
        choices: ["Dog"], showOtherItem: true }],
    });
    expect(schema.properties.petType).toEqual({ title: "What kind?", enum: ["Dog", "other"] });
    expect(schema.properties["petType-Comment"]).toEqual({
      type: "string",
      description: "The free-text comment that belongs with the answer to petType.",
    });
    // The model demands the text only once "other" is the answer, which no schema keyword says.
    expect(schema.required).toEqual(["petType"]);
  });

  test("A disabled item is offered read-only and never demanded", async () => {
    const schema = await schemaOf({
      elements: [
        { type: "text", name: "q1", title: "Q1" },
        { type: "text", name: "off", title: "Off", isRequired: true, enableIf: "{q1} = 'open'" },
        { type: "text", name: "ro", title: "RO", readOnly: true },
      ],
    });
    expect(schema.properties.off).toEqual({ title: "Off", type: "string", readOnly: true });
    expect(schema.properties.ro, "read-only by property is not an item at all").toBeUndefined();
    expect(schema.required).toEqual([]);
    expect(schema.additionalProperties).toBe(false);
  });

  test("Containers and questions with no plain input are not in the schema", async () => {
    ComponentCollection.Instance.add(<any>{
      name: "fullname",
      elementsJSON: [{ type: "text", name: "first" }, { type: "text", name: "last" }],
    });
    customComponents.push("fullname");
    const schema = await schemaOf({
      elements: [
        { type: "text", name: "q1", title: "Q1" },
        { type: "paneldynamic", name: "meds", templateElements: [{ type: "text", name: "dose" }] },
        { type: "matrixdynamic", name: "rows", columns: [{ name: "col" }] },
        { type: "matrix", name: "grid", rows: ["r1"], columns: ["c1"] },
        { type: "multipletext", name: "contact", items: [{ name: "email" }] },
        { type: "fullname", name: "who" },
        { type: "file", name: "photo" },
      ],
    });
    expect(Object.keys(schema.properties)).toEqual(["q1"]);
  });

  test("A custom single component is described through the question it wraps", async () => {
    ComponentCollection.Instance.add(<any>{
      name: "shortage",
      questionJSON: { type: "dropdown", choices: ["a", "b"] },
    });
    customComponents.push("shortage");
    expect(await propertyOf({ type: "shortage", name: "pick", title: "Pick" }))
      .toEqual({ title: "Pick", enum: ["a", "b"] });
  });
});

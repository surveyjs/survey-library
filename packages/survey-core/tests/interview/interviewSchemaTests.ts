// @vitest-environment node
import { createInterview, InterviewErrorCodes } from "survey-core/interview";
import { ComponentCollection, SurveyModel, settings } from "survey-core";

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

  test("A question with no plain input is not in the schema, and every container is", async () => {
    const schema = await schemaOf({
      elements: [
        { type: "text", name: "q1", title: "Q1" },
        { type: "paneldynamic", name: "meds", templateElements: [{ type: "text", name: "dose" }] },
        { type: "matrixdynamic", name: "rows", columns: [{ name: "col" }] },
        { type: "file", name: "photo" },
      ],
    });
    // The fixed-shape containers are objects of fields (tier 07) and the dynamic ones are lists of
    // entry records (tier 08); a file has no property at all - there is no value an agent could send.
    // The dynamic matrix is not there because it is not listed: two rows, nothing required in them,
    // so it is answered and valid already.
    expect(Object.keys(schema.properties)).toEqual(["q1", "meds"]);
    expect(schema.properties.meds.type).toBe("array");
  });

  const FIELDS_TEXT = "An object of fields. Send only the fields to change; the others are left as " +
    "they are.";
  const ROWS_TEXT = "An object of rows, each an object of fields. Send only the fields to change; " +
    "the others are left as they are.";
  const NESTED_RECORDS_TEXT = "A list of entries by position. An object updates the entry at that " +
    "position (send only the fields to change); a position past the entries the document lists for " +
    "this entry adds one; null removes the entry at that position; positions not sent are left as " +
    "they are.";

  test("A multiple text is an object of nullable field properties", async () => {
    expect(await propertyOf({
      type: "multipletext", name: "contact", title: "Contact", isRequired: true,
      items: [
        { name: "email", title: "Email", inputType: "email" },
        { name: "phone", title: "Phone" },
      ],
    })).toEqual({
      title: "Contact",
      description: FIELDS_TEXT,
      type: "object",
      // Every field is nullable: the interview clears a field by sending null for it, and a schema that forbade
      // null would refuse the agent before the interview could. No "required" inside - a patch sends
      // only what changes, and what is required is in the document and enforced at complete().
      properties: {
        email: { anyOf: [{ title: "Email", type: "string", format: "email" }, { type: "null" }] },
        phone: { anyOf: [{ title: "Phone", type: "string" }, { type: "null" }] },
      },
      additionalProperties: false,
    });
    const schema = await schemaOf({
      elements: [{ type: "multipletext", name: "contact", isRequired: true, items: [{ name: "email" }] }],
    });
    expect(schema.required).toEqual(["contact"]);
  });

  test("A matrix dropdown nests one object per row", async () => {
    expect(await propertyOf({
      type: "matrixdropdown", name: "matrix", title: "Matrix",
      columns: [{ name: "column1", title: "Rating", cellType: "dropdown", choices: ["low", "high"] }],
      rows: [{ value: "row1", text: "First row" }, { value: "row2", text: "Second row" }],
    })).toEqual({
      title: "Matrix",
      description: ROWS_TEXT,
      type: "object",
      properties: {
        row1: {
          title: "First row",
          type: "object",
          properties: { column1: { anyOf: [{ title: "Rating", enum: ["low", "high"] }, { type: "null" }] } },
          additionalProperties: false,
        },
        row2: {
          title: "Second row",
          type: "object",
          properties: { column1: { anyOf: [{ title: "Rating", enum: ["low", "high"] }, { type: "null" }] } },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    });
  });

  test("A single-choice matrix is one property per row", async () => {
    expect(await propertyOf({
      type: "matrix", name: "satisfaction", title: "Satisfaction",
      rows: [{ value: "price", text: "Price" }], columns: ["bad", "good"],
    })).toEqual({
      title: "Satisfaction",
      description: FIELDS_TEXT,
      type: "object",
      properties: { price: { anyOf: [{ title: "Price", enum: ["bad", "good"] }, { type: "null" }] } },
      additionalProperties: false,
    });
  });

  test("A composite is an object of its content questions, and a nested container is a nested property", async () => {
    ComponentCollection.Instance.add(<any>{
      name: "addressc",
      elementsJSON: [
        { type: "dropdown", name: "kind", title: "Kind", choices: ["home"], showOtherItem: true },
        { type: "paneldynamic", name: "nested", panelCount: 0, templateElements: [{ type: "text", name: "x" }] },
      ],
    });
    customComponents.push("addressc");
    expect(await propertyOf({ type: "addressc", name: "address", title: "Address",
      description: "Where you live" })).toEqual({
      title: "Address",
      // The question's own description first, then the fixed English an agent's model reads.
      description: "Where you live " + FIELDS_TEXT,
      type: "object",
      properties: {
        kind: { anyOf: [{ title: "Kind", enum: ["home", "other"] }, { type: "null" }] },
        // The comment key of a field is a property of the same object, nullable like the field.
        "kind-Comment": {
          anyOf: [
            { type: "string", description: "The free-text comment that belongs with the answer to kind." },
            { type: "null" },
          ],
        },
        // The nested dynamic panel is the array property its root twin would be, nullable like every
        // field, with the count-less text of a nested list.
        nested: {
          anyOf: [
            {
              title: "nested",
              description: NESTED_RECORDS_TEXT,
              type: "array",
              items: {
                anyOf: [
                  {
                    type: "object",
                    properties: { x: { anyOf: [{ title: "x", type: "string" }, { type: "null" }] } },
                    additionalProperties: false,
                  },
                  { type: "null" },
                ],
              },
            },
            { type: "null" },
          ],
        },
      },
      additionalProperties: false,
    });
  });

  test("A disabled container is offered read-only and never demanded", async () => {
    const schema = await schemaOf({
      elements: [
        { type: "text", name: "q1" },
        { type: "multipletext", name: "contact", title: "Contact", isRequired: true,
          enableIf: "{q1} = 'open'", items: [{ name: "email" }] },
      ],
    });
    // An enableIf that is false makes the whole container read-only, its editors with it: there is
    // no field left to offer, and the property says only that the question exists and is refused
    // for now.
    expect(schema.properties.contact).toEqual({
      title: "Contact",
      description: FIELDS_TEXT,
      type: "object",
      properties: {},
      additionalProperties: false,
      readOnly: true,
    });
    expect(schema.required).toEqual([]);
  });

  test("The schema and answerAll agree that a field is cleared with null", async () => {
    const iv = await createInterview({
      elements: [{ type: "multipletext", name: "contact", items: [{ name: "email" }, { name: "phone" }] }],
    });
    // Checked by hand against the shape rather than with a validator: survey-core ships no runtime
    // dependency and the tests add none for this.
    const property = iv.getAnswerSchema().properties.contact;
    expect(property.properties.phone.anyOf[1]).toEqual({ type: "null" });
    await iv.answerAll({ contact: { email: "a@b.c", phone: "123" } });
    const res = await iv.answerAll({ contact: { phone: null } });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ contact: { email: "a@b.c" } });
  });

  const RECORDS_TEXT = "A list of entries by position. An object updates the entry at that position " +
    "(send only the fields to change); a position past the current 1 entry adds one; null removes " +
    "the entry at that position; positions not sent are left as they are.";
  const ROOT_RECORDS_TEXT_0 = "A list of entries by position. An object updates the entry at that position " +
    "(send only the fields to change); a position past the current 0 entries adds one; null removes " +
    "the entry at that position; positions not sent are left as they are.";

  test("A dynamic container is a list of entry records", async () => {
    const iv = await createInterview({
      elements: [
        { type: "paneldynamic", name: "medications", title: "Medications", isRequired: true,
          panelCount: 1, minPanelCount: 1, maxPanelCount: 5, templateElements: [
            { type: "text", name: "name", title: "Name", isRequired: true },
            { type: "dropdown", name: "kind", title: "Kind", choices: ["pill"], showOtherItem: true },
            { type: "file", name: "photo", title: "Photo" },
          ] },
      ],
    });
    const schema = iv.getAnswerSchema();
    expect(schema.properties.medications).toEqual({
      title: "Medications",
      description: RECORDS_TEXT + " (min 1, max 5)",
      type: "array",
      // A position past the maximum can never exist. No minItems: a patch is legitimately shorter
      // than the minimum, and the minimum is in the description instead.
      maxItems: 5,
      items: {
        anyOf: [
          {
            type: "object",
            properties: {
              name: { anyOf: [{ title: "Name", type: "string" }, { type: "null" }] },
              kind: { anyOf: [{ title: "Kind", enum: ["pill", "other"] }, { type: "null" }] },
              "kind-Comment": { anyOf: [{ type: "string",
                description: "The free-text comment that belongs with the answer to kind." },
              { type: "null" }] },
            },
            additionalProperties: false,
          },
          { type: "null" },
        ],
      },
    });
    // The container itself is demanded when it is required; a file inside an entry has no property
    // at all - there is no value an agent could send for it.
    expect(schema.required).toEqual(["medications"]);
  });

  test("Two descriptions of one field widen the element schema, never narrow it", async () => {
    const iv = await createInterview({
      elements: [
        { type: "paneldynamic", name: "meds", panelCount: 1, templateElements: [
          { type: "boolean", name: "all", title: "All" },
          { type: "dropdown", name: "pick", title: "Pick", isRequired: true, choices: ["A", "B"],
            choicesVisibleIf: "{panel.all} = true or {item} = 'A'" },
          { type: "text", name: "limit", title: "Limit", inputType: "number" },
          { type: "text", name: "qty", title: "Qty", inputType: "number", isRequired: true, max: 10,
            maxValueExpression: "{panel.limit}" },
        ] },
      ],
    });
    await iv.answerAll({ meds: [{ all: false, limit: 20 }] });
    const properties = iv.getAnswerSchema().properties.meds.items.anyOf[0].properties;
    // The one entry offers "A" alone - its choicesVisibleIf ran - and the template offers both. One
    // element schema serves every position, so the enum is the union: a schema that rejected a value
    // some entry accepts would refuse the agent before the interview could.
    expect(properties.pick.anyOf[0].enum).toEqual(["A", "B"]);
    // And the interview is still the gate: what the schema allows, the entry's own choices may not.
    const refused = await iv.answerAll({ meds: [{ pick: "B" }] });
    expect(refused.errors[0].code).toBe(InterviewErrorCodes.notAChoice);
    expect(refused.errors[0].name).toBe("meds[0].pick");
    // A bound one of the two descriptions does not carry is a bound neither can impose: the entry
    // says 20 (maxValueExpression) and the template says nothing, so no "maximum" is written.
    expect(properties.qty.anyOf[0].maximum).toBeUndefined();
  });

  test("A disabled dynamic container is offered read-only and never demanded", async () => {
    const schema = await schemaOf({
      elements: [
        { type: "text", name: "q1", title: "Q1" },
        { type: "paneldynamic", name: "meds", title: "Meds", isRequired: true, panelCount: 0,
          enableIf: "{q1} = 'open'", templateElements: [{ type: "text", name: "dose" }] },
      ],
    });
    expect(schema.properties.meds.readOnly).toBe(true);
    expect(schema.properties.meds.type).toBe("array");
    expect(schema.required).toEqual([]);
  });

  test("A nested container is the property its root twin would be, nested where it sits", async () => {
    const nullable = (property: any): any => ({ anyOf: [property, { type: "null" }] });
    const list = (title: string, description: string, element: any, extra?: any): any => Object.assign({
      title: title, description: description, type: "array",
      items: { anyOf: [{ type: "object", properties: element, additionalProperties: false }, { type: "null" }] },
    }, extra || {});
    const schema = await schemaOf({
      elements: [{
        type: "paneldynamic", name: "orders", title: "Orders", panelCount: 0, templateElements: [
          { type: "text", name: "ref", title: "Reference" },
          { type: "matrixdynamic", name: "items", title: "Items", minRowCount: 1, rowCount: 1,
            columns: [{ name: "sku", title: "SKU", cellType: "text", isRequired: true }],
            detailPanelMode: "underRow", detailElements: [
              { type: "paneldynamic", name: "notes", title: "Notes", panelCount: 0,
                templateElements: [{ type: "text", name: "text", title: "Note" }] },
            ] },
        ],
      }],
    });
    // The root names its current count; a nested list serves every entry of its owner and names none.
    // additionalProperties: false and nullable at every level, and no "required" inside any object.
    expect(schema.properties.orders).toEqual(list("Orders", ROOT_RECORDS_TEXT_0, {
      ref: nullable({ title: "Reference", type: "string" }),
      items: nullable(list("Items", NESTED_RECORDS_TEXT + " (min 1)", {
        sku: nullable({ title: "SKU", type: "string" }),
        notes: nullable(list("Notes", NESTED_RECORDS_TEXT, {
          text: nullable({ title: "Note", type: "string" }),
        })),
      })),
    }));
    expect(schema.required).toEqual([]);
  });

  test("The union of a nested list: every entry's choices, the loosest bound, a nested object", async () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "orders", panelCount: 2, templateElements: [
          { type: "text", name: "kind" },
          { type: "matrixdynamic", name: "items", rowCount: 1, maxRowCount: 3, columns: [
            { name: "pick", cellType: "dropdown", isRequired: true, choices: ["A", "B"],
              choicesVisibleIf: "{panel.kind} = {item}" },
          ] },
          { type: "multipletext", name: "contact", items: [{ name: "email" }] },
        ],
      }],
    });
    const iv = await createInterview(survey);
    await iv.answerAll({ orders: [{ kind: "A" }, { kind: "B" }] });
    // One entry's matrix allows more rows than the template's does; the loosest bound is the schema's.
    (<any>survey.getQuestionByName("orders")).panels[1].getQuestionByName("items").maxRowCount = 5;
    const element = iv.getAnswerSchema().properties.orders.items.anyOf[0].properties;
    // Entry 0 offers A and entry 1 offers B: two levels down, the element schema offers both.
    const items = element.items.anyOf[0];
    expect(items.items.anyOf[0].properties.pick.anyOf[0].enum).toEqual(["A", "B"]);
    expect(items.maxItems).toBe(5);
    // A multiple text in a template is a nested object, with no "required" inside.
    expect(element.contact).toEqual({
      anyOf: [{
        title: "contact",
        description: "An object of fields. Send only the fields to change; the others are left as they are.",
        type: "object",
        properties: { email: { anyOf: [{ title: "email", type: "string" }, { type: "null" }] } },
        additionalProperties: false,
      }, { type: "null" }],
    });
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

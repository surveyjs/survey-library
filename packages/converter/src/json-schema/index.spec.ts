import { describe, it, expect } from "vitest";
import { PanelModel } from "survey-core";
import { convert, JsonSchemaCodes } from "./index";
import { UnparseableInputError, WrongFormatError } from "../errors";
import { ReportEntry } from "../report";
import { SurveyJSONElement } from "../types";
import { assertConstructsCleanly, lintOutput } from "../testing/oracle";
import simpleSchema from "./fixtures/simple-schema.json";
import dataTypes from "./fixtures/data-types-schema.json";
import jsonforms from "./fixtures/jsonforms-schema.json";
import jsonformsCategorization from "./fixtures/jsonforms-categorization.json";
import rjsf from "./fixtures/rjsf-schema.json";
import composition from "./fixtures/composition-schema.json";
import oneof from "./fixtures/oneof-schema.json";

function entry(entries: ReportEntry[], code: string): ReportEntry | undefined {
  return entries.find((e) => e.code === code);
}

/** Depth-first find of the first element with the given `name` in a survey JSON. */
function findElement(node: unknown, name: string): SurveyJSONElement | undefined {
  if (!node || typeof node !== "object") return undefined;
  const obj = node as Record<string, unknown>;
  if (obj.name === name && typeof obj.type === "string") return obj as SurveyJSONElement;
  for (const key of ["pages", "elements", "templateElements"]) {
    const arr = obj[key];
    if (Array.isArray(arr)) {
      for (const child of arr) {
        const found = findElement(child, name);
        if (found) return found;
      }
    }
  }
  return undefined;
}

describe("json-schema convert - format detection", () => {
  it("throws UnparseableInputError on non-objects", () => {
    expect(() => convert(null)).toThrow(UnparseableInputError);
    expect(() => convert("nope")).toThrow(UnparseableInputError);
    expect(() => convert([])).toThrow(UnparseableInputError);
  });

  it("throws WrongFormatError on a Form.io form", () => {
    expect(() => convert({ display: "form", components: [] })).toThrow(WrongFormatError);
  });

  it("accepts a bare JSON Schema", () => {
    const { output, report } = convert(simpleSchema);
    expect(output).toBeTypeOf("object");
    expect(report.source).toBe("json-schema");
    // Loads into a SurveyModel with zero errors AND that model materializes the
    // schema's properties as questions (not just valid-but-empty JSON).
    const survey = assertConstructsCleanly(output, "simple-schema");
    expect(survey.getAllQuestions().length).toBeGreaterThan(0);
  });

  it("accepts a { schema, uiSchema } envelope", () => {
    const { report } = convert({ schema: simpleSchema, uiSchema: { type: "VerticalLayout", elements: [] } });
    expect(report.source).toBe("json-schema");
  });
});

describe("json-schema convert - data walk (baseline type table)", () => {
  it("constructs cleanly", () => {
    assertConstructsCleanly(convert(dataTypes).output, "data-types");
  });

  it("maps title/description to the survey", () => {
    const { output } = convert(dataTypes);
    expect(output.title).toBe("Data types");
    expect(output.description).toBe("One property per baseline type-mapping row.");
  });

  it("maps string + length/pattern + default", () => {
    const { output } = convert(dataTypes);
    expect(findElement(output, "fullName")).toMatchObject({ type: "text", title: "Full name", isRequired: true });
    expect(findElement(output, "fullName")?.validators).toEqual([{ type: "text", minLength: 2, maxLength: 80 }]);
    const nickname = findElement(output, "nickname");
    expect(nickname?.defaultValue).toBe("anon");
    expect(nickname?.validators).toEqual([{ type: "regex", regex: "^[a-z]+$" }]);
  });

  it("maps string + enum -> dropdown with choices", () => {
    const country = findElement(convert(dataTypes).output, "country");
    expect(country?.type).toBe("dropdown");
    expect(country?.choices).toEqual([{ value: "us" }, { value: "ee" }, { value: "de" }]);
  });

  it("maps string + format -> text inputType", () => {
    const { output } = convert(dataTypes);
    expect(findElement(output, "email")).toMatchObject({ type: "text", inputType: "email", isRequired: true });
    expect(findElement(output, "birthDate")).toMatchObject({ type: "text", inputType: "date" });
    expect(findElement(output, "homepage")).toMatchObject({ type: "text", inputType: "url" });
  });

  it("maps integer/number -> text number with numeric validators", () => {
    const { output } = convert(dataTypes);
    expect(findElement(output, "age")).toMatchObject({ type: "text", inputType: "number" });
    expect(findElement(output, "age")?.validators).toEqual([{ type: "numeric", minValue: 0, maxValue: 130 }]);
    expect(findElement(output, "score")?.validators).toEqual([{ type: "numeric", minValue: 0 }]);
  });

  it("maps boolean -> boolean", () => {
    expect(findElement(convert(dataTypes).output, "subscribe")?.type).toBe("boolean");
  });

  it("maps array + items.enum -> checkbox, array of scalars -> tagbox", () => {
    const { output } = convert(dataTypes);
    const hobbies = findElement(output, "hobbies");
    expect(hobbies?.type).toBe("checkbox");
    expect(hobbies?.choices).toEqual([{ value: "sports" }, { value: "music" }, { value: "reading" }]);
    expect(findElement(output, "tags")?.type).toBe("tagbox");
  });

  it("maps array + items.object -> paneldynamic with template elements", () => {
    const contacts = findElement(convert(dataTypes).output, "contacts");
    expect(contacts?.type).toBe("paneldynamic");
    expect((contacts?.templateElements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["kind", "value"]);
    expect(findElement(contacts, "value")?.isRequired).toBe(true);
  });

  it("maps nested object -> panel and recurses", () => {
    const address = findElement(convert(dataTypes).output, "address");
    expect(address?.type).toBe("panel");
    expect((address?.elements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["street", "city", "zip"]);
    // `address` is optional: its required city is required while the address holds a value.
    expect(findElement(address, "city")?.requiredIf).toBe("{street} notempty or {zip} notempty");
    expect(findElement(address, "zip")?.validators).toEqual([{ type: "regex", regex: "^[0-9]{5}$" }]);
  });
});

describe("json-schema convert - JSONForms UI layer", () => {
  it("constructs cleanly", () => {
    assertConstructsCleanly(convert(jsonforms).output, "jsonforms");
  });

  it("nests Group/Layout into panels and places controls", () => {
    const { output } = convert(jsonforms);
    const group = (output.elements as SurveyJSONElement[]).find((e) => e.title === "Name");
    expect(group?.type).toBe("panel");
    expect(findElement(group, "firstName")).toBeDefined();
    expect(findElement(group, "lastName")).toBeDefined();
    // firstName is required in the data schema.
    expect(findElement(output, "firstName")?.isRequired).toBe(true);
  });

  it("refines question type from Control options", () => {
    const { output } = convert(jsonforms);
    // { format: "radio" } -> radiogroup
    expect(findElement(output, "gender")?.type).toBe("radiogroup");
    // no hint -> dropdown
    expect(findElement(output, "nationality")?.type).toBe("dropdown");
    // { multi: true } on an enum array -> tagbox
    expect(findElement(output, "skills")?.type).toBe("tagbox");
  });

  it("reports an unmapped Control option as UNSUPPORTED_UI_HINT", () => {
    const { report } = convert(jsonforms);
    expect(entry(report.entries, JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.bucket).toBe("unsupported");
  });

  it("maps Categorization/Category -> pages", () => {
    const { output } = convert(jsonformsCategorization);
    expect(output.pages?.length).toBe(2);
    expect(output.pages?.[0]).toMatchObject({ title: "Personal" });
    expect(findElement(output.pages?.[0], "firstName")).toBeDefined();
    expect(findElement(output.pages?.[1], "city")).toBeDefined();
    assertConstructsCleanly(output, "jsonforms-categorization");
  });
});

describe("json-schema convert - RJSF uiSchema", () => {
  it("constructs cleanly", () => {
    assertConstructsCleanly(convert(rjsf).output, "rjsf");
  });

  it("applies ui:order, ui:widget and ui:placeholder", () => {
    const { output } = convert(rjsf);
    expect((output.elements as SurveyJSONElement[]).map((e) => e.name)).toEqual([
      "rating",
      "name",
      "bio",
      "password",
      "secret"
    ]);
    expect(findElement(output, "rating")?.type).toBe("radiogroup");
    expect(findElement(output, "bio")).toMatchObject({ type: "comment", placeholder: "Tell us about yourself" });
    expect(findElement(output, "password")).toMatchObject({ type: "text", inputType: "password" });
    expect(findElement(output, "secret")?.visible).toBe(false);
  });
});

describe("json-schema convert - composition (allOf / if-then-else / deps / $ref)", () => {
  it("constructs cleanly", () => {
    assertConstructsCleanly(convert(composition).output, "composition");
  });

  it("shallow-merges allOf properties/required into the parent", () => {
    const { output } = convert(composition);
    expect(findElement(output, "firstName")).toMatchObject({ type: "text", isRequired: true });
    expect(findElement(output, "lastName")?.type).toBe("text");
  });

  it("models if/then/else as visibleIf/requiredIf on affected questions", () => {
    const { output } = convert(composition);
    const ssn = findElement(output, "ssn");
    // The `if` holds while `country` is empty: it does not require it.
    expect(ssn?.visibleIf).toBe("({country} empty or {country} = 'us')");
    expect(ssn?.requiredIf).toBe("({country} empty or {country} = 'us')");
    expect(findElement(output, "postalCode")?.visibleIf).toBe("({country} notempty and {country} <> 'us')");
  });

  it("resolves a local $ref and drops a remote $ref with the alarm", () => {
    const { output, report } = convert(composition);
    // Local #/definitions/phone resolved -> text with the pattern validator.
    expect(findElement(output, "phone")?.validators).toEqual([{ type: "regex", regex: "^[0-9+ ]+$" }]);
    // Remote $ref -> bare text so the form still builds, plus DROPPED_REMOTE_REF.
    const avatar = findElement(output, "avatar");
    expect(avatar).toMatchObject({ type: "text", title: "Avatar" });
    expect(entry(report.entries, JsonSchemaCodes.DROPPED_REMOTE_REF)?.bucket).toBe("dropped");
  });

  it("models a property dependency as requiredIf and flags it assumed", () => {
    const { output, report } = convert(composition);
    expect(findElement(output, "username")?.requiredIf).toBe("{hasAccount} notempty");
    expect(entry(report.entries, JsonSchemaCodes.ASSUMED_DEPENDENCIES)?.bucket).toBe("assumed");
  });
});

describe("json-schema convert - discriminated oneOf", () => {
  it("constructs cleanly", () => {
    assertConstructsCleanly(convert(oneof).output, "oneof");
  });

  it("emits a discriminator selector plus one gated panel per variant", () => {
    const { output, report } = convert(oneof);
    const method = findElement(output, "method");
    expect(method?.type).toBe("panel");
    const kids = method?.elements as SurveyJSONElement[];
    // selector + 2 variant panels
    const selector = kids.find((e) => e.name === "kind");
    expect(selector?.type).toBe("dropdown");
    expect(selector?.choices).toEqual([{ value: "card" }, { value: "bank" }]);
    const cardPanel = kids.find((e) => e.type === "panel" && e.visibleIf === "{kind} = 'card'");
    expect(cardPanel).toBeDefined();
    expect(findElement(cardPanel, "cardNumber")).toBeDefined();
    // Inference (no explicit `discriminator`) is flagged assumed.
    expect(entry(report.entries, JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR)?.bucket).toBe("assumed");
  });
});

describe("json-schema convert - condition literals", () => {
  const ifConst = (value: string) => ({
    type: "object",
    properties: { a: { type: "string" }, b: { type: "string" } },
    if: { properties: { a: { const: value } } },
    then: { properties: { b: { type: "string" } } }
  });

  for (const value of ["O'Brien", "x\\y"]) {
    it(`matches an if const of ${JSON.stringify(value)} exactly`, () => {
      const survey = assertConstructsCleanly(convert(ifConst(value)).output, "if const literal");
      survey.data = { a: value };
      expect(survey.getQuestionByName("b").isVisible).toBe(true);
      survey.data = { a: value.replace(/['\\]/g, "") };
      expect(survey.getQuestionByName("b").isVisible).toBe(false);
    });
  }

  it("does not express an if const ending in a backslash, and reports it assumed", () => {
    const { output, report } = convert(ifConst("c:\\"));
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    expect(entry(report.entries, JsonSchemaCodes.ASSUMED_IF_THEN_ELSE)?.sourcePointer).toBe("#/if");
    assertConstructsCleanly(output, "if const trailing backslash");
  });

  // JavaScript writes 1e-7 in exponent notation, which survey-core's expressions cannot parse.
  for (const [what, cond] of [["const", { const: 1e-7 }], ["enum", { enum: [2, 1e-7] }]] as const) {
    it(`does not express an if ${what} holding 1e-7, and reports it assumed`, () => {
      const schema = {
        type: "object",
        properties: { a: { type: "number" }, b: { type: "string" } },
        if: { properties: { a: cond } },
        then: { properties: { b: { type: "string" } } }
      };
      const { output, report } = convert(schema);
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(entry(report.entries, JsonSchemaCodes.ASSUMED_IF_THEN_ELSE)?.sourcePointer).toBe("#/if");
      assertConstructsCleanly(output, `if ${what} 1e-7`);
    });
  }

  it("does not express a JSONForms rule whose schema const is 1e-7, and reports it assumed", () => {
    const schema = { type: "object", properties: { a: { type: "number" }, b: { type: "string" } } };
    const uiSchema = { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/a" },
      { type: "Control", scope: "#/properties/b", rule: { effect: "SHOW", condition: { scope: "#/properties/a", schema: { const: 1e-7 } } } }
    ] };
    const { output, report } = convert({ schema, uiSchema });
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    expect(entry(report.entries, JsonSchemaCodes.ASSUMED_UI_RULE)).toBeDefined();
    assertConstructsCleanly(output, "rule const 1e-7");
  });
});

describe("json-schema convert - an if on an empty key", () => {
  // `properties` constrains only the keys present, so an `if` holds while its keys are empty, unless
  // its `required` lists them.
  const properties = { a: { type: "string" }, d: { type: "string" }, b: { type: "string" }, c: { type: "string" } };
  const branches = { then: { properties: { b: { type: "string" } }, required: ["b"] }, else: { properties: { c: { type: "string" } } } };
  // [b shown, b required, c shown] for each data set.
  const state = (ifSchema: object, ...data: Record<string, unknown>[]) => {
    const survey = assertConstructsCleanly(convert({ type: "object", properties, if: ifSchema, ...branches }).output, "if on an empty key");
    return data.map((d) => {
      survey.data = d;
      return [survey.getQuestionByName("b").isVisible, survey.getQuestionByName("b").isRequired, survey.getQuestionByName("c").isVisible];
    });
  };
  const thenHolds = [true, true, false];
  const elseHolds = [false, false, true];

  it("takes then while a const's key is empty", () => {
    expect(state({ properties: { a: { const: "x" } } }, {}, { a: "x" }, { a: "y" })).toEqual([thenHolds, thenHolds, elseHolds]);
  });

  it("takes then while an enum's key is empty", () => {
    expect(state({ properties: { a: { enum: ["x", "z"] } } }, {}, { a: "z" }, { a: "y" })).toEqual([thenHolds, thenHolds, elseHolds]);
  });

  it("takes else while a key the if requires is empty", () => {
    expect(state({ properties: { a: { const: "x" } }, required: ["a"] }, {}, { a: "x" }, { a: "y" })).toEqual([elseHolds, thenHolds, elseHolds]);
  });

  it("takes else while a required key the if does not constrain is empty", () => {
    expect(state({ properties: { a: { const: "x" } }, required: ["d"] }, { a: "x" }, { a: "x", d: "1" }, { d: "1" }, { a: "y", d: "1" }))
      .toEqual([elseHolds, thenHolds, thenHolds, elseHolds]);
  });

  const reported = (schema: object) => {
    const { output, report } = convert(schema);
    return { conditions: JSON.stringify(output).match(/"(visibleIf|requiredIf)"/g) ?? [], codes: report.entries.map((e) => [e.code, e.sourcePointer]) };
  };
  const refusedIf = { conditions: [], codes: [[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/if"]] };

  const untranslated: [string, object][] = [
    ["not", { properties: { a: { const: "x" } }, not: { required: ["d"] } }],
    ["minProperties", { properties: { a: { const: "x" } }, minProperties: 2 }],
    ["anyOf", { properties: { a: { const: "x" } }, anyOf: [{ required: ["d"] }] }],
    ["an if-level const", { properties: { a: { const: "x" } }, const: {} }],
    ["dependentRequired", { properties: { a: { const: "x" } }, dependentRequired: { a: ["d"] } }],
    ["a property keyword besides const", { properties: { a: { const: "x", minLength: 2 } } }],
    ["a property type the const does not have", { properties: { a: { const: "x", type: "number" } } }],
    ["an empty enum", { properties: { a: { enum: [] } } }]
  ];
  for (const [what, ifSchema] of untranslated) {
    it(`does not express an if with ${what}, and reports it`, () => {
      expect(reported({ type: "object", properties, if: ifSchema, ...branches })).toEqual(refusedIf);
      expect(state(ifSchema, {}, { a: "x" }, { a: "y" })).toEqual([[true, false, true], [true, false, true], [true, false, true]]);
    });
  }

  it("expresses an if with annotations, type object, and a property type its const has", () => {
    const ifSchema = { title: "T", description: "D", $comment: "C", type: "object", properties: { a: { const: "x", type: "string", title: "A" } }, required: ["a"] };
    expect(reported({ type: "object", properties, if: ifSchema, ...branches }).codes).toEqual([]);
    expect(state(ifSchema, {}, { a: "x" }, { a: "y" })).toEqual([elseHolds, thenHolds, elseHolds]);
  });

  it("does not hide a branch property the if reads by its own value, and keeps its requiredIf", () => {
    const schema = { type: "object", properties: { a: { type: "string" }, b: { type: "string" } },
      if: { properties: { a: { const: "x" } }, required: ["a"] }, then: { properties: { b: {} } }, else: { properties: { a: { minLength: 1 } }, required: ["a"] } };
    const { output } = convert(schema);
    expect(findElement(output, "a")?.visibleIf).toBeUndefined();
    const survey = assertConstructsCleanly(output, "branch on the if's own key");
    for (const [data, required] of [[{ a: "y" }, true], [{ a: "x" }, false]] as const) {
      survey.data = data;
      expect(survey.getQuestionByName("a").isVisible).toBe(true);
      expect(survey.getQuestionByName("a").isRequired).toBe(required);
    }
    survey.data = { a: "y" };
    survey.doComplete();
    expect(survey.data).toEqual({ a: "y" });
  });

  it("requires a field both branches require, whatever the if gives", () => {
    const schema = { type: "object", properties, if: { properties: { a: { const: "x" } }, required: ["a"] }, then: { required: ["b"] }, else: { required: ["b"] } };
    const survey = assertConstructsCleanly(convert(schema).output, "both branches require");
    for (const data of [{}, { a: "x" }, { a: "y" }]) {
      survey.data = data;
      expect(survey.getQuestionByName("b").isRequired).toBe(true);
    }
  });

  it("requires a field when either of two conditionals requires it", () => {
    const schema = { type: "object", properties, dependentRequired: { a: ["b"], d: ["b"] } };
    const survey = assertConstructsCleanly(convert(schema).output, "either conditional");
    for (const [data, required] of [[{}, false], [{ a: "1" }, true], [{ d: "1" }, true], [{ a: "1", d: "1" }, true]] as const) {
      survey.data = data;
      expect(survey.getQuestionByName("b").isRequired, JSON.stringify(data)).toBe(required);
    }
  });

  it("gives no condition for a presence survey-core reads as empty, an if key or a dependency trigger holding null", () => {
    const nullable = { ...properties, a: { enum: [null, "x"] } };
    const ifOnly = { type: "object", properties: nullable, if: { required: ["a"] }, then: { required: ["b"] } };
    expect(reported(ifOnly)).toEqual(refusedIf);
    const dependency = { type: "object", properties: nullable, dependentRequired: { a: ["b"] } };
    const { output } = convert(dependency);
    expect(findElement(output, "b")?.requiredIf).toBeUndefined();
    for (const schema of [ifOnly, dependency]) {
      const survey = assertConstructsCleanly(convert(schema).output, "presence of null");
      survey.data = { a: null };
      expect(survey.getQuestionByName("b").isRequired).toBe(false);
    }
  });

  it("keeps a field the object requires required when a conditional also requires it", () => {
    const schema = { type: "object", properties, required: ["b"], if: { properties: { a: { const: "x" } }, required: ["a"] }, then: { required: ["b"] } };
    const { output } = convert(schema);
    expect(findElement(output, "b")).toMatchObject({ isRequired: true });
    expect(findElement(output, "b")?.requiredIf).toBeUndefined();
    const survey = assertConstructsCleanly(output, "required anyway");
    for (const data of [{ a: "x" }, { a: "y" }]) {
      survey.data = data;
      expect(survey.getQuestionByName("b").isRequired).toBe(true);
    }
  });

  it("requires a then field at a JSONForms root while the key is empty, unless the if requires it", () => {
    const uiSchema = { type: "VerticalLayout", elements: ["a", "b", "c"].map((k) => ({ type: "Control", scope: `#/properties/${k}` })) };
    const required = (ifSchema: object, data: Record<string, unknown>) => {
      const schema = { type: "object", properties, if: ifSchema, then: { required: ["b"] }, else: { required: ["c"] } };
      const survey = loadJsonForms(schema, uiSchema, data);
      return [survey.getQuestionByName("b").isRequired, survey.getQuestionByName("c").isRequired];
    };
    expect(required({ properties: { a: { const: "x" } } }, {})).toEqual([true, false]);
    expect(required({ properties: { a: { const: "x" } } }, { a: "y" })).toEqual([false, true]);
    expect(required({ properties: { a: { const: "x" } }, required: ["a"] }, {})).toEqual([false, true]);
    expect(required({ properties: { a: { const: "x" } }, required: ["a"] }, { a: "x" })).toEqual([true, false]);
  });
});

describe("json-schema convert - literals survey-core reads like other values", () => {
  // survey-core's `=` compares texts trimmed and without case, a numeric text as a number, and
  // "true" as a boolean; JSON Schema's `const` and `enum` are strict.
  const ifOn = (k: object, cond: object) => ({ type: "object", properties: { k, b: { type: "string" } },
    if: { properties: { k: cond }, required: ["k"] }, then: { properties: { b: { type: "string" } } } });
  const shown = (schema: object, ...values: unknown[]) => {
    const survey = assertConstructsCleanly(convert(schema).output, "literal");
    return values.map((v) => {
      survey.data = v === undefined ? {} : { k: v };
      return survey.getQuestionByName("b").isVisible;
    });
  };

  const refused: [string, object, object, unknown[]][] = [
    ["a const that matches another choice without case", { type: "string", enum: ["a", "A"] }, { const: "a" }, ["A"]],
    ["a const that matches another choice once trimmed", { type: "string", enum: ["a", " a"] }, { const: "a" }, [" a"]],
    ["a number const beside its text", { enum: [1, "1"] }, { const: 1 }, ["1"]],
    ["a text const on a boolean", { type: "boolean" }, { const: "true" }, [true]],
    ["an enum that matches another choice without case", { type: "string", enum: ["a", "B", "b"] }, { enum: ["a", "b"] }, ["B"]],
    ["an empty text const", { type: "string" }, { const: "" }, [undefined]],
    ["an object const", { type: "object", properties: { x: { type: "string" } } }, { const: { x: "1" } }, []]
  ];
  for (const [what, k, cond, misread] of refused) {
    it(`does not express ${what}, and reports it assumed`, () => {
      const schema = ifOn(k, cond);
      const { output, report } = convert(schema);
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(entry(report.entries, JsonSchemaCodes.ASSUMED_IF_THEN_ELSE)?.sourcePointer).toBe("#/if");
      // The question stays visible, where survey-core would have shown it for these values too.
      expect(shown(schema, ...misread)).toEqual(misread.map(() => true));
    });
  }

  it("does not express a const survey-core does not read as equal to itself, and reports it", () => {
    // survey-core reads the literal '1,000' as text and the value "1,000" as the number 1.
    const schema = ifOn({ const: "1,000" }, { const: "1,000" });
    const { output, report } = convert(schema);
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    expect(entry(report.entries, JsonSchemaCodes.ASSUMED_IF_THEN_ELSE)?.sourcePointer).toBe("#/if");
    expect(shown(schema, "1,000")).toEqual([true]);
  });

  it("does not express a const that survey-core releases read differently, and reports it", () => {
    // Releases before survey-core #12234 read "0x1g" as the number 1, later ones as text.
    const schema = ifOn({ enum: ["0x1g", "x"] }, { const: "0x1g" });
    const { output, report } = convert(schema);
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    expect(entry(report.entries, JsonSchemaCodes.ASSUMED_IF_THEN_ELSE)?.sourcePointer).toBe("#/if");
    expect(shown(schema, "0x1g", "x")).toEqual([true, true]);
  });

  it("does not express an if on a field whose enum holds null, which survey-core reads as empty", () => {
    const schema = { type: "object", properties: { k: { enum: [null, "x"] }, b: { type: "string" } },
      if: { properties: { k: { const: "x" } } }, then: { properties: { b: { type: "string" } } } };
    const { output, report } = convert(schema);
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    expect(entry(report.entries, JsonSchemaCodes.ASSUMED_IF_THEN_ELSE)?.sourcePointer).toBe("#/if");
    expect(shown(schema, null, "x")).toEqual([true, true]);
  });

  const kept: [string, object, object, unknown[], boolean[]][] = [
    ["a const among choices survey-core tells apart", { type: "string", enum: ["a", "b"] }, { const: "a" }, ["a", "b", undefined], [true, false, false]],
    ["a boolean const", { type: "boolean" }, { const: true }, [true, false, undefined], [true, false, false]],
    ["a numeric choice", { type: "integer", enum: [1, 2, 10] }, { const: 1 }, [1, 2, 10], [true, false, false]],
    ["a const on a free text", { type: "string" }, { const: "a" }, ["a", "b"], [true, false]]
  ];
  for (const [what, k, cond, values, expected] of kept) {
    it(`expresses ${what}`, () => {
      const schema = ifOn(k, cond);
      expect(findElement(convert(schema).output, "b")?.visibleIf).toBeDefined();
      expect(shown(schema, ...values)).toEqual(expected);
    });
  }

  describe("in JSONForms rules", () => {
    const schema = { type: "object", properties: { k: { type: "string", enum: ["x", "X"] }, t: { type: "string" }, a: { type: "string" } } };
    const ui = (condition: object) => ({ type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/k" }, { type: "Control", scope: "#/properties/t" },
      { type: "Control", scope: "#/properties/a", rule: { effect: "SHOW", condition } }] });
    const conditions: [string, object][] = [
      ["a LEAF", { type: "LEAF", scope: "#/properties/k", expectedValue: "x" }],
      ["a const schema", { scope: "#/properties/k", schema: { const: "x" } }],
      ["an enum schema", { scope: "#/properties/k", schema: { enum: ["x"] } }],
      ["a LEAF on an empty text", { type: "LEAF", scope: "#/properties/t", expectedValue: "" }]
    ];
    for (const [what, condition] of conditions) {
      it(`does not express ${what} survey-core reads like another value, and reports it`, () => {
        const { output, report } = convert({ schema, uiSchema: ui(condition) });
        expect(findElement(output, "a")?.visibleIf).toBeUndefined();
        expect(entry(report.entries, JsonSchemaCodes.ASSUMED_UI_RULE)?.sourcePointer).toBe("#/uiSchema/elements/2/rule");
        expect(loadJsonForms(schema, ui(condition), { k: "X" }).getQuestionByName("a").isVisible).toBe(true);
      });
    }

    it("does not express failWhenUndefined on a field that can hold null, which JSONForms reads as a value", () => {
      const s = { type: "object", properties: { k: { enum: [null, "x", "y"] }, a: { type: "string" } } };
      const u = ui({ scope: "#/properties/k", schema: { not: { const: "x" } }, failWhenUndefined: true });
      const { output, report } = convert({ schema: s, uiSchema: u });
      expect(findElement(output, "a")?.visibleIf).toBeUndefined();
      expect(entry(report.entries, JsonSchemaCodes.ASSUMED_UI_RULE)?.sourcePointer).toBe("#/uiSchema/elements/2/rule");
      expect(loadJsonForms(s, u, { k: null }).getQuestionByName("a").isVisible).toBe(true);
    });

    it("expresses a LEAF on choices survey-core tells apart", () => {
      const s = { type: "object", properties: { k: { type: "string", enum: ["x", "y"] }, a: { type: "string" } } };
      const u = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/k" },
        { type: "Control", scope: "#/properties/a", rule: { effect: "SHOW", condition: { type: "LEAF", scope: "#/properties/k", expectedValue: "x" } } }] };
      expect(loadJsonForms(s, u, { k: "x" }).getQuestionByName("a").isVisible).toBe(true);
      expect(loadJsonForms(s, u, { k: "y" }).getQuestionByName("a").isVisible).toBe(false);
      expect(loadJsonForms(s, u, {}).getQuestionByName("a").isVisible).toBe(false);
    });
  });

  it("does not gate discriminated variants survey-core reads alike, and reports each", () => {
    const schema = { type: "object", properties: { pet: { type: "object", oneOf: [
      { properties: { kind: { const: "a" }, onlyA: { type: "string" } } },
      { properties: { kind: { const: "A" }, onlyB: { type: "string" } } }
    ] } } };
    const { output, report } = convert(schema);
    const panels = (findElement(output, "pet")?.elements as SurveyJSONElement[]).filter((e) => e.type === "panel");
    expect(panels.map((p) => p.visibleIf)).toEqual([undefined, undefined]);
    expect(report.entries.filter((e) => e.code === JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR).map((e) => e.sourcePointer))
      .toEqual(["#/properties/pet/oneOf", "#/properties/pet/oneOf/0", "#/properties/pet/oneOf/1"]);
    const survey = assertConstructsCleanly(output, "variants read alike");
    survey.data = { kind: "A" };
    expect(survey.getQuestionByName("onlyA").isParentVisible).toBe(true);
  });
});

describe("json-schema convert - references to renamed questions", () => {
  // `home` and `work` each hold `c` and `s`; the second pair is renamed `c_1` and `s_1`.
  const twoObjects = (rules: Record<string, unknown>) => {
    const object = { type: "object", properties: { c: { type: "string" }, s: { type: "string" } }, ...rules };
    return { type: "object", properties: { home: object, work: object } };
  };
  // Load the converted survey with `data` and read the named question.
  const question = (schema: object, data: Record<string, unknown>, name: string) => {
    const survey = assertConstructsCleanly(convert(schema).output, "renamed references");
    survey.data = data;
    return survey.getQuestionByName(name);
  };

  it("drives work's s from work's c in an if/then required", () => {
    const schema = twoObjects({ if: { properties: { c: { const: "y" } } }, then: { required: ["s"] } });
    // `work` is optional: the condition holds while it holds a value.
    expect(findElement(convert(schema).output, "s_1")?.requiredIf).toBe("({c_1} notempty) and (({c_1} empty or {c_1} = 'y'))");
    expect(question(schema, { c_1: "y" }, "s_1").isRequired).toBe(true);
    expect(question(schema, { c: "y", c_1: "n" }, "s_1").isRequired).toBe(false);
  });

  it("drives work's s from work's c in if/then properties", () => {
    const schema = twoObjects({ if: { properties: { c: { const: "y" } } }, then: { properties: { s: { type: "string" } } } });
    expect(question(schema, { c_1: "y" }, "s_1").isVisible).toBe(true);
    expect(question(schema, { c: "y", c_1: "n" }, "s_1").isVisible).toBe(false);
  });

  it("drives work's s from work's c in dependentRequired", () => {
    const schema = twoObjects({ dependentRequired: { c: ["s"] } });
    expect(question(schema, { c_1: "x" }, "s_1").isRequired).toBe(true);
    expect(question(schema, { c: "x" }, "s_1").isRequired).toBe(false);
  });

  it("drives work's s from work's c in dependentSchemas", () => {
    const schema = twoObjects({ dependentSchemas: { c: { properties: { s: { type: "string" } } } } });
    expect(question(schema, { c_1: "x" }, "s_1").isVisible).toBe(true);
    expect(question(schema, { c: "x" }, "s_1").isVisible).toBe(false);
  });

  it("drives work's variant from work's discriminator", () => {
    const object = { type: "object", oneOf: [
      { properties: { kind: { const: "a" }, onlyA: { type: "string" } } },
      { properties: { kind: { const: "b" }, onlyB: { type: "string" } } }
    ] };
    const schema = { type: "object", properties: { home: object, work: object } };
    // `work`'s variant questions are the renamed ones.
    expect(question(schema, { kind_1: "a" }, "onlyA_1").isParentVisible).toBe(true);
    expect(question(schema, { kind: "a" }, "onlyA_1").isParentVisible).toBe(false);
  });

  it("gives no expression for an if on a property the object does not have, and reports it", () => {
    const schema = { type: "object", properties: { s: { type: "string" } },
      if: { properties: { missing: { const: "y" } } }, then: { required: ["s"] } };
    const { output, report } = convert(schema);
    expect(findElement(output, "s")?.requiredIf).toBeUndefined();
    expect(entry(report.entries, JsonSchemaCodes.ASSUMED_IF_THEN_ELSE)?.sourcePointer).toBe("#/if");
  });
});

describe("json-schema convert - references inside array items", () => {
  // Load the converted survey with `data` and read a question from row `row` of each grid in `path`.
  const rowQuestion = (schema: object, data: Record<string, unknown>, path: [string, number][], name: string) => {
    const survey = assertConstructsCleanly(convert(schema).output, "item references");
    survey.data = data;
    let container: any = survey;
    for (const [grid, row] of path) container = container.getQuestionByName(grid).panels[row];
    return container.getQuestionByName(name);
  };
  const ifThen = { if: { properties: { c: { const: "y" } } }, then: { properties: { s: { type: "string" } } } };

  it("reads an if/then from each row", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: {
      type: "object", properties: { c: { type: "string" }, s: { type: "string" } }, ...ifThen
    } } } };
    expect(findElement(convert(schema).output, "s")?.visibleIf).toBe("({panel.c} empty or {panel.c} = 'y')");
    const data = { rows: [{ c: "y" }, { c: "n" }] };
    expect(rowQuestion(schema, data, [["rows", 0]], "s").isVisible).toBe(true);
    expect(rowQuestion(schema, data, [["rows", 1]], "s").isVisible).toBe(false);
  });

  it("reads a discriminated oneOf from each row", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object", oneOf: [
      { properties: { kind: { const: "a" }, onlyA: { type: "string" } } },
      { properties: { kind: { const: "b" }, onlyB: { type: "string" } } }
    ] } } } };
    const data = { rows: [{ kind: "a" }, { kind: "b" }] };
    expect(rowQuestion(schema, data, [["rows", 0]], "onlyA").isParentVisible).toBe(true);
    expect(rowQuestion(schema, data, [["rows", 1]], "onlyA").isParentVisible).toBe(false);
    expect(rowQuestion(schema, data, [["rows", 1]], "onlyB").isParentVisible).toBe(true);
  });

  it("reads a nested object inside a row from that row", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object", properties: {
      inner: { type: "object", properties: { c: { type: "string" }, s: { type: "string" } }, ...ifThen }
    } } } } };
    const data = { rows: [{ c: "y" }, { c: "n" }] };
    expect(rowQuestion(schema, data, [["rows", 0]], "s").isVisible).toBe(true);
    expect(rowQuestion(schema, data, [["rows", 1]], "s").isVisible).toBe(false);
  });

  it("reads a nested array's rows from their own row", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object", properties: {
      subrows: { type: "array", items: { type: "object", properties: { c: { type: "string" }, s: { type: "string" } }, ...ifThen } }
    } } } } };
    const data = { rows: [{ subrows: [{ c: "n" }, { c: "y" }] }] };
    expect(rowQuestion(schema, data, [["rows", 0], ["subrows", 0]], "s").isVisible).toBe(false);
    expect(rowQuestion(schema, data, [["rows", 0], ["subrows", 1]], "s").isVisible).toBe(true);
  });
});

describe("json-schema convert - exclusive bounds", () => {
  // The numeric validator a property schema converts to, and the report.
  const bound = (prop: Record<string, unknown>) => {
    const { output, report } = convert({ type: "object", properties: { n: prop } });
    assertConstructsCleanly(output, "bounds");
    const validators = (findElement(output, "n")?.validators ?? []) as Record<string, unknown>[];
    return { numeric: validators.find((v) => v.type === "numeric"), assumed: entry(report.entries, JsonSchemaCodes.ASSUMED_EXCLUSIVE_BOUND) };
  };

  // [schema, minValue, maxValue, assumed pointer]
  const rows: [Record<string, unknown>, number | undefined, number | undefined, string | undefined][] = [
    [{ type: "integer", exclusiveMinimum: 0 }, 1, undefined, undefined],
    [{ type: "number", exclusiveMinimum: 0 }, 0, undefined, "#/properties/n/exclusiveMinimum"],
    [{ type: "integer", minimum: 1, exclusiveMinimum: 5 }, 6, undefined, undefined],
    [{ type: "number", minimum: 1, exclusiveMinimum: 5 }, 5, undefined, "#/properties/n/exclusiveMinimum"],
    [{ type: "number", minimum: 5, exclusiveMinimum: 1 }, 5, undefined, undefined],
    [{ type: "integer", minimum: 1, exclusiveMinimum: true }, 2, undefined, undefined],
    [{ type: "number", minimum: 1, exclusiveMinimum: false }, 1, undefined, undefined],
    [{ type: "integer", exclusiveMaximum: 10 }, undefined, 9, undefined],
    [{ type: "number", exclusiveMaximum: 10 }, undefined, 10, "#/properties/n/exclusiveMaximum"],
    [{ type: "integer", maximum: 20, exclusiveMaximum: 10 }, undefined, 9, undefined],
    [{ type: "number", maximum: 5, exclusiveMaximum: 10 }, undefined, 5, undefined],
    [{ type: "integer", maximum: 10, exclusiveMaximum: true }, undefined, 9, undefined],
    [{ type: "number", maximum: 10, exclusiveMaximum: false }, undefined, 10, undefined]
  ];
  for (const [prop, minValue, maxValue, assumedPtr] of rows) {
    it(`bounds ${JSON.stringify(prop)} to ${JSON.stringify({ minValue, maxValue })}`, () => {
      const { numeric, assumed } = bound(prop);
      expect(numeric?.minValue).toBe(minValue);
      expect(numeric?.maxValue).toBe(maxValue);
      expect(assumed?.sourcePointer).toBe(assumedPtr);
    });
  }
});

describe("json-schema convert - array metadata", () => {
  const arrays = {
    picks: { type: "array", items: { enum: ["a", "b"] }, default: ["b"], readOnly: true },
    rows: { type: "array", items: { type: "object", properties: { x: { type: "string" } } }, default: [{ x: "1" }], readOnly: true },
    tags: { type: "array", items: { type: "string" }, default: ["t"], readOnly: true }
  };

  for (const [name, expected] of [["picks", ["b"]], ["rows", [{ x: "1" }]], ["tags", ["t"]]] as const) {
    it(`carries default and readOnly on the ${name} branch`, () => {
      const { output } = convert({ type: "object", properties: arrays });
      expect(findElement(output, name)).toMatchObject({ defaultValue: expected, readOnly: true });
      const survey = assertConstructsCleanly(output, "array metadata");
      expect(JSON.parse(JSON.stringify(survey.getQuestionByName(name).value))).toEqual(expected);
      expect(survey.getQuestionByName(name).isReadOnly).toBe(true);
    });
  }

  it("hides an array with ui:widget hidden", () => {
    const { output } = convert({ schema: { type: "object", properties: arrays }, uiSchema: {
      picks: { "ui:widget": "hidden" }, rows: { "ui:widget": "hidden" }, tags: { "ui:widget": "hidden" }
    } });
    const survey = assertConstructsCleanly(output, "hidden arrays");
    for (const name of ["picks", "rows", "tags"]) expect(survey.getQuestionByName(name).isVisible).toBe(false);
  });
});

// Convert a JSONForms schema and UI schema, and load the survey with `data`.
function loadJsonForms(schema: object, uiSchema: object, data: Record<string, unknown> = {}) {
  const { output } = convert({ schema, uiSchema });
  const survey = assertConstructsCleanly(output, "jsonforms");
  survey.data = data;
  return survey;
}

describe("json-schema convert - JSONForms rules", () => {
  const schema = { type: "object", properties: { t: { type: "boolean" }, a: { type: "string" } } };
  const condition = { scope: "#/properties/t", schema: { const: true } };
  const control = (rule?: object) => ({ type: "Control", scope: "#/properties/a", ...(rule ? { rule } : {}) });
  const toggle = { type: "Control", scope: "#/properties/t" };

  // Each node kind carrying a rule, as a UI schema.
  const carriers: Record<string, (rule: object) => object> = {
    Control: (rule) => ({ type: "VerticalLayout", elements: [toggle, control(rule)] }),
    Group: (rule) => ({ type: "VerticalLayout", elements: [toggle, { type: "Group", label: "G", rule, elements: [control()] }] }),
    Category: (rule) => ({ type: "Categorization", elements: [
      { type: "Category", label: "One", elements: [toggle] },
      { type: "Category", label: "Two", rule, elements: [control()] }
    ] }),
    "nested layout": (rule) => ({ type: "VerticalLayout", elements: [toggle, { type: "HorizontalLayout", rule, elements: [control()] }] })
  };
  // Whether `a` shows and is editable, with `t` true and false.
  const state = (ui: object, t: boolean) => {
    const survey = loadJsonForms(schema, ui, { t });
    const a = survey.getQuestionByName("a");
    const shown = a.isVisible && a.isParentVisible && survey.visiblePages.some((p) => p.containsElement(a));
    return { shown, editable: !a.isReadOnly };
  };

  // [effect, with t true, with t false]
  const effects: [string, { shown: boolean, editable: boolean }, { shown: boolean, editable: boolean }][] = [
    ["SHOW", { shown: true, editable: true }, { shown: false, editable: true }],
    ["HIDE", { shown: false, editable: true }, { shown: true, editable: true }],
    ["ENABLE", { shown: true, editable: true }, { shown: true, editable: false }],
    ["WRITABLE", { shown: true, editable: true }, { shown: true, editable: false }],
    ["DISABLE", { shown: true, editable: false }, { shown: true, editable: true }],
    ["READONLY", { shown: true, editable: false }, { shown: true, editable: true }]
  ];
  for (const [carrier, build] of Object.entries(carriers)) {
    for (const [effect, whenTrue, whenFalse] of effects) {
      it(`applies ${effect} on a ${carrier}`, () => {
        const ui = build({ effect, condition });
        expect(state(ui, true)).toEqual(whenTrue);
        expect(state(ui, false)).toEqual(whenFalse);
      });
    }
  }
});

describe("json-schema convert - JSONForms rule conditions", () => {
  const schema = { type: "object", properties: {
    c: { type: "string" }, d: { type: "string" },
    obj: { type: "object", properties: { x: { type: "string" } } },
    a: { type: "string" }
  }, required: [] };
  const controls = ["#/properties/c", "#/properties/d", "#/properties/obj/properties/x"].map((scope) => ({ type: "Control", scope }));
  // Whether `a` shows under a SHOW rule with `condition`, for each data set.
  const shows = (condition: object, ...data: Record<string, unknown>[]) => data.map((d) =>
    loadJsonForms(schema, { type: "VerticalLayout", elements: [...controls, { type: "Control", scope: "#/properties/a", rule: { effect: "SHOW", condition } }] }, d)
      .getQuestionByName("a").isVisible);

  it("compares a LEAF with its expected value", () => {
    expect(shows({ type: "LEAF", scope: "#/properties/c", expectedValue: "x" }, { c: "x" }, { c: "y" })).toEqual([true, false]);
  });

  it("joins AND and OR, and AND nested in OR", () => {
    const leaf = (scope: string, expectedValue: string) => ({ type: "LEAF", scope, expectedValue });
    const and = { type: "AND", conditions: [leaf("#/properties/c", "x"), leaf("#/properties/d", "y")] };
    expect(shows(and, { c: "x", d: "y" }, { c: "x", d: "z" })).toEqual([true, false]);
    const or = { type: "OR", conditions: [and, leaf("#/properties/c", "w")] };
    expect(shows(or, { c: "w" }, { c: "x", d: "y" }, { c: "x", d: "z" })).toEqual([true, true, false]);
  });

  it("validates a const, an enum and a not", () => {
    expect(shows({ scope: "#/properties/c", schema: { const: "x" } }, { c: "x" }, { c: "y" }, {})).toEqual([true, false, false]);
    expect(shows({ scope: "#/properties/c", schema: { enum: ["x", "y"] } }, { c: "y" }, { c: "z" })).toEqual([true, false]);
    // An absent value passes `not`, as `ajv.validate(schema, undefined)` does.
    expect(shows({ scope: "#/properties/c", schema: { not: { const: "x" } } }, { c: "y" }, { c: "x" }, {})).toEqual([true, false, true]);
  });

  it("fails an absent value first with failWhenUndefined", () => {
    expect(shows({ scope: "#/properties/c", schema: { not: { const: "x" } }, failWhenUndefined: true }, { c: "y" }, {})).toEqual([true, false]);
  });

  it("validates the root object, one term per property", () => {
    const condition = { scope: "#", schema: { properties: { c: { const: "x" }, d: { const: "y" } }, required: ["c"] } };
    // `d` is optional, so an absent `d` passes; `c` is required.
    expect(shows(condition, { c: "x" }, { c: "x", d: "y" }, { c: "x", d: "z" }, { d: "y" })).toEqual([true, true, false, false]);
  });

  it("validates a parent object's properties", () => {
    const condition = { scope: "#/properties/obj", schema: { properties: { x: { const: "x" } }, required: ["x"] } };
    expect(shows(condition, { x: "x" }, { x: "y" })).toEqual([true, false]);
  });
});

describe("json-schema convert - JSONForms rule references", () => {
  it("reads a Control declared after the rule", () => {
    const schema = { type: "object", properties: { a: { type: "string" }, c: { type: "string" } } };
    const ui = { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/a", rule: { effect: "SHOW", condition: { scope: "#/properties/c", schema: { const: "x" } } } },
      { type: "Control", scope: "#/properties/c" }
    ] };
    expect(loadJsonForms(schema, ui, { c: "x" }).getQuestionByName("a").isVisible).toBe(true);
    expect(loadJsonForms(schema, ui, { c: "y" }).getQuestionByName("a").isVisible).toBe(false);
  });

  it("reads a renamed Control by its output name", () => {
    const object = { type: "object", properties: { c: { type: "string" } } };
    const schema = { type: "object", properties: { home: object, work: object, a: { type: "string" } } };
    const ui = { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/home/properties/c" },
      { type: "Control", scope: "#/properties/work/properties/c" },
      { type: "Control", scope: "#/properties/a", rule: { effect: "SHOW", condition: { scope: "#/properties/work/properties/c", schema: { const: "x" } } } }
    ] };
    expect(findElement(convert({ schema, uiSchema: ui }).output, "a")?.visibleIf).toBe("{c_1} = 'x'");
    expect(loadJsonForms(schema, ui, { c_1: "x" }).getQuestionByName("a").isVisible).toBe(true);
    expect(loadJsonForms(schema, ui, { c: "x" }).getQuestionByName("a").isVisible).toBe(false);
  });

  it("shares one value between two Controls on the same scope", () => {
    const schema = { type: "object", properties: { c: { type: "string", enum: ["x", "y"] }, a: { type: "string" } } };
    const ui = { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/c" },
      { type: "Control", scope: "#/properties/c", options: { format: "radio" } },
      { type: "Control", scope: "#/properties/a", rule: { effect: "SHOW", condition: { scope: "#/properties/c", schema: { const: "x" } } } }
    ] };
    expect(findElement(convert({ schema, uiSchema: ui }).output, "c_1")?.valueName).toBe("c");
    const survey = loadJsonForms(schema, ui);
    survey.getQuestionByName("c_1").value = "x";
    expect(survey.getQuestionByName("c").value).toBe("x");
    expect(survey.getQuestionByName("a").isVisible).toBe(true);
  });

  const unexpressed: [string, object][] = [
    ["a rule on the root layout", { type: "VerticalLayout", rule: { effect: "HIDE", condition: { scope: "#/properties/c", schema: { const: "x" } } },
      elements: [{ type: "Control", scope: "#/properties/c" }, { type: "Control", scope: "#/properties/a" }] }],
    ["a validate condition", { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/c" },
      { type: "Control", scope: "#/properties/a", rule: { effect: "HIDE", condition: { scope: "#/properties/c", validate: () => true } } }] }],
    ["a scope with no Control", { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/a", rule: { effect: "HIDE", condition: { scope: "#/properties/c", schema: { const: "x" } } } }] }]
  ];
  for (const [what, ui] of unexpressed) {
    it(`reports ${what} and keeps the element visible`, () => {
      const schema = { type: "object", properties: { c: { type: "string" }, a: { type: "string" } } };
      const { report } = convert({ schema, uiSchema: ui });
      expect(entry(report.entries, JsonSchemaCodes.ASSUMED_UI_RULE)?.bucket).toBe("assumed");
      expect(loadJsonForms(schema, ui, { c: "x" }).getQuestionByName("a").isVisible).toBe(true);
    });
  }

  it("reads a rule inside a detail layout from the row", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object",
      properties: { kind: { type: "string" }, note: { type: "string" } } } } } };
    const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/rows", options: { detail: { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/kind" },
      { type: "Control", scope: "#/properties/note", rule: { effect: "SHOW", condition: { scope: "#/properties/kind", schema: { const: "x" } } } }
    ] } } }] };
    expect(findElement(convert({ schema, uiSchema: ui }).output, "note")?.visibleIf).toBe("{panel.kind} = 'x'");
    const survey = loadJsonForms(schema, ui, { rows: [{ kind: "x" }, { kind: "y" }] });
    const rows = (survey.getQuestionByName("rows") as any).panels;
    expect(rows[0].getQuestionByName("note").isVisible).toBe(true);
    expect(rows[1].getQuestionByName("note").isVisible).toBe(false);
  });
});

describe("json-schema convert - JSONForms readonly", () => {
  const schema = (readOnly: boolean) => ({ type: "object", properties: { t: { type: "boolean" }, a: { type: "string", ...(readOnly ? { readOnly: true } : {}) } } });
  const ui = (options: object, rule?: object) => ({ type: "VerticalLayout", elements: [
    { type: "Control", scope: "#/properties/t" },
    { type: "Control", scope: "#/properties/a", options, ...(rule ? { rule } : {}) }
  ] });
  const editable = (s: object, u: object, data: Record<string, unknown> = {}) => !loadJsonForms(s, u, data).getQuestionByName("a").isReadOnly;

  it("makes a Control read-only with options.readonly", () => {
    expect(editable(schema(false), ui({ readonly: true }))).toBe(false);
  });

  it("lets options.readonly: false override schema.readOnly", () => {
    expect(editable(schema(true), ui({}))).toBe(false);
    expect(editable(schema(true), ui({ readonly: false }))).toBe(true);
  });

  it("lets an enable rule decide over options.readonly", () => {
    const rule = { effect: "ENABLE", condition: { scope: "#/properties/t", schema: { const: true } } };
    const { output } = convert({ schema: schema(true), uiSchema: ui({ readonly: true }, rule) });
    expect(findElement(output, "a")?.readOnly).toBeUndefined();
    expect(editable(schema(true), ui({ readonly: true }, rule), { t: true })).toBe(true);
    expect(editable(schema(true), ui({ readonly: true }, rule), { t: false })).toBe(false);
  });
});

describe("json-schema convert - JSONForms options and labels", () => {
  const schema = { type: "object", properties: {
    picks: { type: "array", items: { type: "string", enum: ["a", "b"] }, uniqueItems: true },
    text: { type: "string" }
  } };
  const typeOf = (control: object) => {
    const { output } = convert({ schema, uiSchema: { type: "VerticalLayout", elements: [control] } });
    return (output.elements as SurveyJSONElement[])[0].type;
  };

  it("gives a tagbox for format multiselect", () => {
    expect(typeOf({ type: "Control", scope: "#/properties/picks", options: { format: "multiselect" } })).toBe("tagbox");
  });

  it("gives a comment for multi on a string", () => {
    expect(typeOf({ type: "Control", scope: "#/properties/text", options: { multi: true } })).toBe("comment");
  });

  it("keeps a tagbox for multi on an enum array", () => {
    expect(typeOf({ type: "Control", scope: "#/properties/picks", options: { multi: true } })).toBe("tagbox");
  });

  const labelled = (label: unknown) => {
    const { output } = convert({ schema, uiSchema: { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/text", label },
      { type: "Group", label, elements: [{ type: "Control", scope: "#/properties/picks" }] }
    ] } });
    const [control, group] = output.elements as SurveyJSONElement[];
    return { control: { title: control.title, titleLocation: control.titleLocation }, groupTitle: group.title };
  };

  it("titles a Control and a Group with a string label", () => {
    expect(labelled("Shown")).toEqual({ control: { title: "Shown", titleLocation: undefined }, groupTitle: "Shown" });
  });

  it("titles a Control and a Group with a label object's text", () => {
    expect(labelled({ text: "Shown" })).toEqual({ control: { title: "Shown", titleLocation: undefined }, groupTitle: "Shown" });
  });

  it("hides a Control title and gives a Group none for label false", () => {
    expect(labelled(false)).toEqual({ control: { title: undefined, titleLocation: "hidden" }, groupTitle: undefined });
  });

  it("hides a Control title and gives a Group none for show: false", () => {
    expect(labelled({ text: "Hidden", show: false })).toEqual({ control: { title: "Hidden", titleLocation: "hidden" }, groupTitle: undefined });
  });
});

describe("json-schema convert - JSONForms Categorization", () => {
  const schema = { type: "object", properties: { a: { type: "string" }, b: { type: "string" } } };
  const categories = [
    { type: "Category", label: "First", elements: [{ type: "Control", scope: "#/properties/a" }] },
    { type: "Category", label: "Second", elements: [{ type: "Control", scope: "#/properties/b" }] }
  ];

  it("gives pages at the root", () => {
    const { output } = convert({ schema, uiSchema: { type: "Categorization", elements: categories } });
    expect(output.pages?.map((p) => p.title)).toEqual(["First", "Second"]);
  });

  it("gives pages as the only child of the root layout", () => {
    const { output } = convert({ schema, uiSchema: { type: "VerticalLayout", elements: [{ type: "Categorization", elements: categories }] } });
    expect(output.pages?.map((p) => p.title)).toEqual(["First", "Second"]);
  });

  it("gives a panel per Category inside a Category", () => {
    const { output, report } = convert({ schema, uiSchema: { type: "Categorization", elements: [
      { type: "Category", label: "Outer", elements: [{ type: "Categorization", elements: categories }] }
    ] } });
    const survey = assertConstructsCleanly(output, "nested categorization");
    expect(survey.getQuestionByName("a")).toBeDefined();
    const titles = (output.pages?.[0].elements[0] as SurveyJSONElement).elements as SurveyJSONElement[];
    expect(titles.map((p) => [p.type, p.title])).toEqual([["panel", "First"], ["panel", "Second"]]);
    expect(entry(report.entries, JsonSchemaCodes.UNSUPPORTED_UI_HINT)).toBeUndefined();
  });

  it("gives a panel per Category elsewhere", () => {
    const { output } = convert({ schema, uiSchema: { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/a" },
      { type: "Categorization", elements: [categories[1]] }
    ] } });
    expect(output.pages).toBeUndefined();
    const nested = (output.elements as SurveyJSONElement[])[1].elements as SurveyJSONElement[];
    expect(nested.map((p) => p.title)).toEqual(["Second"]);
  });
});

describe("json-schema convert - JSONForms detail", () => {
  const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object",
    properties: { message: { type: "string" }, extra: { type: "string" } }, required: ["message"] } } } };
  const ui = (detail?: unknown) => ({ type: "VerticalLayout", elements: [
    { type: "Control", scope: "#/properties/rows", ...(detail === undefined ? {} : { options: { detail } }) }
  ] });
  const template = (detail?: unknown) => {
    const { output, report } = convert({ schema, uiSchema: ui(detail) });
    assertConstructsCleanly(output, "detail");
    return { names: (findElement(output, "rows")?.templateElements as SurveyJSONElement[]).map((e) => e.name), report };
  };

  for (const detail of [undefined, "GENERATED", "DEFAULT"]) {
    it(`walks the items schema for detail ${JSON.stringify(detail)}`, () => {
      const { names, report } = template(detail);
      expect(names).toEqual(["message", "extra"]);
      expect(entry(report.entries, JsonSchemaCodes.UNSUPPORTED_UI_HINT)).toBeUndefined();
    });
  }

  it("walks a detail layout with scopes relative to the items, taking required from them", () => {
    const { output } = convert({ schema, uiSchema: ui({ type: "Group", label: "Row", elements: [{ type: "Control", scope: "#/properties/message" }] }) });
    const row = (findElement(output, "rows")?.templateElements as SurveyJSONElement[])[0];
    expect(row).toMatchObject({ type: "panel", title: "Row" });
    expect((row.elements as SurveyJSONElement[])[0]).toMatchObject({ name: "message", isRequired: true });
  });

  describe("a rule on the detail layout's root", () => {
    const s = { type: "object", properties: {
      rows: { type: "array", items: { type: "object", properties: { kind: { type: "string" }, note: { type: "string" } } } },
      user: { type: "object", properties: { kind: { type: "string" }, note: { type: "string" } } }
    } };
    const detailUi = (scope: string, rule: object) => ({ type: "VerticalLayout", elements: [
      { type: "Control", scope, options: { detail: { type: "VerticalLayout", rule, elements: [
        { type: "Control", scope: "#/properties/kind" }, { type: "Control", scope: "#/properties/note" }
      ] } } }
    ] });
    const condition = { scope: "#/properties/kind", schema: { const: "x" } };

    it("hides each row's detail whose own value matches", () => {
      const u = detailUi("#/properties/rows", { effect: "HIDE", condition });
      expect(convert({ schema: s, uiSchema: u }).report.entries).toEqual([]);
      const panels = (loadJsonForms(s, u, { rows: [{ kind: "x" }, { kind: "y" }] }).getQuestionByName("rows") as any).panels;
      expect(panels.map((p: any) => p.getQuestionByName("note").isVisible && p.getQuestionByName("note").isParentVisible)).toEqual([false, true]);
    });

    it("disables an object's detail by the object's own value", () => {
      const u = detailUi("#/properties/user", { effect: "DISABLE", condition });
      expect(convert({ schema: s, uiSchema: u }).report.entries).toEqual([]);
      expect(loadJsonForms(s, u, { kind: "x" }).getQuestionByName("note").isReadOnly).toBe(true);
      expect(loadJsonForms(s, u, { kind: "y" }).getQuestionByName("note").isReadOnly).toBe(false);
    });

    it("still reports a rule whose condition cannot be expressed, and keeps the detail visible", () => {
      const u = detailUi("#/properties/user", { effect: "HIDE", condition: { scope: "#/properties/missing", schema: { const: "x" } } });
      const { report } = convert({ schema: s, uiSchema: u });
      expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_UI_RULE, "#/uiSchema/elements/0/options/detail/rule"]]);
      expect(loadJsonForms(s, u, { kind: "x" }).getQuestionByName("note").isVisible).toBe(true);
    });
  });

  it("walks the items schema for REGISTERED, and reports it", () => {
    const { names, report } = template("REGISTERED");
    expect(names).toEqual(["message", "extra"]);
    expect(entry(report.entries, JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.sourcePointer).toBe("#/uiSchema/elements/0/options/detail");
  });

  it("walks a detail layout inside a Categorization", () => {
    const { output } = convert({ schema, uiSchema: { type: "Categorization", elements: [{ type: "Category", label: "Items", elements: [
      { type: "Control", scope: "#/properties/rows", options: { detail: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/extra" }] } } }
    ] }] } });
    assertConstructsCleanly(output, "detail in categorization");
    expect((findElement(output, "rows")?.templateElements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["extra"]);
  });
});

describe("json-schema convert - RJSF nested uiSchema", () => {
  it("applies a widget two objects down", () => {
    const schema = { type: "object", properties: { a: { type: "object", properties: { b: { type: "object", properties: { note: { type: "string" } } } } } } };
    const { output } = convert({ schema, uiSchema: { a: { b: { note: { "ui:widget": "textarea" } } } } });
    expect(findElement(output, "note")?.type).toBe("comment");
  });

  it("orders a nested object's properties by its ui:order", () => {
    const schema = { type: "object", properties: { box: { type: "object", properties: { x: { type: "string" }, y: { type: "string" }, z: { type: "string" } } } } };
    const { output } = convert({ schema, uiSchema: { box: { "ui:order": ["z", "*"] } } });
    expect((findElement(output, "box")?.elements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["z", "x", "y"]);
  });

  it("applies items to an array's template", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object", properties: { note: { type: "string" } } } } } };
    const { output } = convert({ schema, uiSchema: { rows: { items: { note: { "ui:widget": "textarea", "ui:placeholder": "More" } } } } });
    expect(findElement(output, "note")).toMatchObject({ type: "comment", placeholder: "More" });
  });

  it("applies the object's node to a oneOf variant", () => {
    const schema = { type: "object", properties: { kind: { type: "string" } }, oneOf: [
      { properties: { kind: { const: "a" }, note: { type: "string" } } },
      { properties: { kind: { const: "b" }, other: { type: "string" } } }
    ] };
    const { output } = convert({ schema, uiSchema: { note: { "ui:widget": "textarea" } } });
    expect(findElement(output, "note")?.type).toBe("comment");
  });

  it("applies the object's node to a question an if/then creates", () => {
    const schema = { type: "object", properties: { c: { type: "string" } },
      if: { properties: { c: { const: "y" } } }, then: { properties: { note: { type: "string" } } } };
    const { output } = convert({ schema, uiSchema: { note: { "ui:widget": "textarea" } } });
    expect(findElement(output, "note")).toMatchObject({ type: "comment", visibleIf: "({c} empty or {c} = 'y')" });
  });
});

describe("json-schema convert - RJSF options", () => {
  const schema = { type: "object", properties: { a: { type: "string" } } };
  const element = (ui: object) => findElement(convert({ schema, uiSchema: { a: ui } }).output, "a");

  it("reads ui:options like the matching ui: keys", () => {
    const viaKeys = element({ "ui:widget": "textarea", "ui:title": "T", "ui:placeholder": "P" });
    const viaOptions = element({ "ui:options": { widget: "textarea", title: "T", placeholder: "P" } });
    expect(viaOptions).toEqual(viaKeys);
  });

  it("lets a later key win", () => {
    expect(element({ "ui:title": "First", "ui:options": { title: "Second" } })?.title).toBe("Second");
    expect(element({ "ui:options": { title: "First" }, "ui:title": "Second" })?.title).toBe("Second");
  });

  it("reports a ui:widget object and ignores it", () => {
    const { output, report } = convert({ schema, uiSchema: { a: { "ui:widget": { component: "textarea" } } } });
    expect(findElement(output, "a")?.type).toBe("text");
    expect(entry(report.entries, JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.sourcePointer).toBe("#/uiSchema/a/ui:widget");
  });

  for (const key of ["ui:disabled", "ui:readonly"]) {
    it(`makes a question and an object read-only with ${key}`, () => {
      const nested = { type: "object", properties: { a: { type: "string" }, box: { type: "object", properties: { b: { type: "string" } } } } };
      const { output } = convert({ schema: nested, uiSchema: { a: { [key]: true }, box: { [key]: true } } });
      const survey = assertConstructsCleanly(output, key);
      expect(survey.getQuestionByName("a").isReadOnly).toBe(true);
      expect(survey.getQuestionByName("b").isReadOnly).toBe(true);
    });
  }

  it("hides a scalar with ui:widget hidden and keeps its type", () => {
    const { output } = convert({ schema: { type: "object", properties: { n: { type: "integer" }, f: { type: "boolean" } } },
      uiSchema: { n: { "ui:widget": "hidden" }, f: { "ui:widget": "hidden" } } });
    expect(findElement(output, "n")).toMatchObject({ type: "text", inputType: "number", visible: false });
    expect(findElement(output, "f")).toMatchObject({ type: "boolean", visible: false });
  });

  it("hides an object and an array with ui:widget hidden", () => {
    const { output } = convert({ schema: { type: "object", properties: {
      box: { type: "object", properties: { b: { type: "string" } } },
      tags: { type: "array", items: { type: "string" } }
    } }, uiSchema: { box: { "ui:widget": "hidden" }, tags: { "ui:widget": "hidden" } } });
    const survey = assertConstructsCleanly(output, "hidden containers");
    expect(survey.getQuestionByName("b").isParentVisible).toBe(false);
    expect(survey.getQuestionByName("tags").isVisible).toBe(false);
  });
});

describe("json-schema convert - RJSF report", () => {
  const schema = { type: "object", properties: { a: { type: "string" } } };
  const reported = (ui: object) => convert({ schema, uiSchema: { a: ui } }).report.entries;

  it("reports nothing for the options it maps", () => {
    expect(reported({ "ui:widget": "textarea", "ui:title": "T", "ui:description": "D", "ui:placeholder": "P", "ui:disabled": false, "ui:readonly": false })).toEqual([]);
  });

  // [option, code]
  const rows: [string, string][] = [
    ["ui:classNames", JsonSchemaCodes.DROPPED_STYLING],
    ["ui:autofocus", JsonSchemaCodes.DROPPED_STYLING],
    ["ui:field", JsonSchemaCodes.DROPPED_CUSTOM_RENDERER],
    ["ui:FieldTemplate", JsonSchemaCodes.DROPPED_CUSTOM_RENDERER],
    ["ui:enumDisabled", JsonSchemaCodes.UNSUPPORTED_UI_HINT],
    ["ui:orderable", JsonSchemaCodes.UNSUPPORTED_UI_HINT],
    ["ui:futureKey", JsonSchemaCodes.UNSUPPORTED_UI_HINT]
  ];
  for (const [key, code] of rows) {
    it(`reports ${key} as ${code}`, () => {
      expect(entry(reported({ [key]: "x" }), code)?.sourcePointer).toBe(`#/uiSchema/a/${key}`);
    });
  }

  it("reports an option inside ui:options at its own pointer", () => {
    expect(entry(reported({ "ui:options": { futureKey: 1 } }), JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.sourcePointer)
      .toBe("#/uiSchema/a/ui:options/futureKey");
  });

  it("reports the root node's own options", () => {
    const { report } = convert({ schema, uiSchema: { "ui:submitButtonOptions": { norender: true }, "ui:order": ["a"] } });
    expect(entry(report.entries, JsonSchemaCodes.DROPPED_STYLING)?.sourcePointer).toBe("#/uiSchema/ui:submitButtonOptions");
    expect(report.entries).toHaveLength(1);
  });

  it("reports a node shared by oneOf variants under its one pointer", () => {
    const shared = { type: "object", properties: { kind: { type: "string" } }, oneOf: [
      { properties: { kind: { const: "a" }, note: { type: "string" } } },
      { properties: { kind: { const: "b" }, note: { type: "string" } } }
    ] };
    const { report } = convert({ schema: shared, uiSchema: { note: { "ui:orderable": false } } });
    expect(report.entries.filter((e) => e.code === JsonSchemaCodes.UNSUPPORTED_UI_HINT)).toHaveLength(1);
  });
});

describe("json-schema convert - RJSF widgets", () => {
  const schema = { type: "object", properties: {
    when: { type: "string" },
    pick: { type: "string", enum: ["a", "b"] },
    picks: { type: "array", items: { type: "string", enum: ["a", "b"] }, uniqueItems: true },
    flag: { type: "boolean" },
    text: { type: "string" }
  } };
  const widgetReports = (ui: object) => convert({ schema, uiSchema: ui }).report.entries.filter((e) => e.sourcePointer.endsWith("/ui:widget"));

  it("reports an unknown widget value", () => {
    expect(widgetReports({ text: { "ui:widget": "fancySlider" } }).map((e) => e.sourcePointer)).toEqual(["#/uiSchema/text/ui:widget"]);
  });

  it("does not report a widget that restates the default", () => {
    expect(widgetReports({ picks: { "ui:widget": "checkboxes" }, flag: { "ui:widget": "checkbox" }, pick: { "ui:widget": "select" } })).toEqual([]);
  });

  it("reports a default widget on a field it does not fit", () => {
    expect(widgetReports({ text: { "ui:widget": "checkboxes" } })).toHaveLength(1);
  });

  it("maps alt-date and alt-datetime like date and date-time", () => {
    const { output, report } = convert({ schema, uiSchema: { when: { "ui:widget": "alt-date" }, text: { "ui:widget": "alt-datetime" } } });
    expect(findElement(output, "when")?.inputType).toBe("date");
    expect(findElement(output, "text")?.inputType).toBe("datetime-local");
    expect(report.entries).toEqual([]);
  });
});

describe("json-schema convert - JSONForms scopes", () => {
  const control = (scope: string) => ({ type: "VerticalLayout", elements: [{ type: "Control", scope }] });
  // The question a single Control on `scope` gives, loaded in a SurveyModel.
  const question = (schema: object, scope: string) => loadJsonForms(schema, control(scope)).getAllQuestions()[0];

  it("reports a scope that resolves nowhere as an unresolved scope, not a remote reference", () => {
    const schema = { type: "object", properties: { a: { type: "string" } } };
    const { output, report } = convert({ schema, uiSchema: control("#/properties/missing") });
    const unresolved = entry(report.entries, JsonSchemaCodes.UNRESOLVED_SCOPE);
    expect(unresolved?.bucket).toBe("unsupported");
    expect(unresolved?.sourcePointer).toBe("#/uiSchema/elements/0/scope");
    expect(entry(report.entries, JsonSchemaCodes.DROPPED_REMOTE_REF)).toBeUndefined();
    expect(assertConstructsCleanly(output, "unresolved scope").getAllQuestions()).toHaveLength(0);
  });

  it("follows a $ref in the middle of a scope, and reads required from the referenced object", () => {
    const schema = { type: "object",
      definitions: { order: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      properties: { order: { $ref: "#/definitions/order" } }, required: ["order"] };
    const q = question(schema, "#/properties/order/properties/id");
    expect(q?.name).toBe("id");
    expect(q?.isRequired).toBe(true);
  });

  it("follows a $ref on the scope's target", () => {
    const schema = { type: "object", definitions: { flag: { type: "boolean" } }, properties: { f: { $ref: "#/definitions/flag" } } };
    expect(question(schema, "#/properties/f")?.getType()).toBe("boolean");
  });

  const branches: [string, object][] = [
    ["allOf", { allOf: [{ properties: { b: { type: "string" } } }] }],
    ["anyOf", { anyOf: [{ properties: { b: { type: "string" } } }] }],
    ["oneOf", { oneOf: [{ properties: { b: { type: "string" } } }] }],
    ["then", { if: { properties: { a: { const: "x" } } }, then: { properties: { b: { type: "string" } } } }],
    ["else", { if: { properties: { a: { const: "x" } } }, else: { properties: { b: { type: "string" } } } }],
    ["a $ref inside allOf", { definitions: { base: { properties: { b: { type: "string" } } } }, allOf: [{ $ref: "#/definitions/base" }] }],
    ["allOf nested in anyOf", { anyOf: [{ allOf: [{ properties: { b: { type: "string" } } }] }] }]
  ];
  for (const [where, composition] of branches) {
    it(`gives a question for a property found in ${where}`, () => {
      const schema = { type: "object", properties: { a: { type: "string" } }, ...composition };
      const { report } = convert({ schema, uiSchema: control("#/properties/b") });
      expect(report.entries).toEqual([]);
      expect(question(schema, "#/properties/b")?.name).toBe("b");
    });
  }

  it("takes the first match in the order oneOf, allOf, anyOf, then, else", () => {
    const all: [string, object, string][] = [
      ["oneOf", { oneOf: [{ properties: { b: { type: "boolean" } } }] }, "boolean"],
      ["allOf", { allOf: [{ properties: { b: { type: "string", enum: ["x", "y"] } } }] }, "dropdown"],
      ["anyOf", { anyOf: [{ properties: { b: { type: "array", items: { type: "string", enum: ["x"] } } } }] }, "checkbox"],
      ["then", { if: { properties: { a: { const: "x" } } }, then: { properties: { b: { type: "string", format: "date" } } } }, "date"],
      ["else", { else: { properties: { b: { type: "number" } } } }, "number"]
    ];
    // Drop the winner each time, so every combinator wins once over those after it.
    for (let i = 0; i < all.length; i++) {
      const schema: Record<string, unknown> = { type: "object", properties: { a: { type: "string" } } };
      for (const [, composition] of all.slice(i)) Object.assign(schema, composition);
      const q = question(schema, "#/properties/b");
      const kind = q.getType() === "text" ? q.inputType : q.getType();
      expect(kind, all[i][0]).toBe(all[i][2]);
    }
  });

  it("prefers a property found directly over one in a combinator", () => {
    const schema = { type: "object", properties: { b: { type: "boolean" } }, allOf: [{ properties: { b: { type: "string" } } }] };
    expect(question(schema, "#/properties/b")?.getType()).toBe("boolean");
  });

  it("reads required from the scope's parent, not from the branch that holds the property", () => {
    const schema = { type: "object", required: ["inAllOf"],
      allOf: [{ properties: { inAllOf: { type: "string" } } }],
      if: { properties: { a: { const: "x" } } },
      then: { properties: { inThen: { type: "string" } }, required: ["inThen"] } };
    expect(question(schema, "#/properties/inAllOf")?.isRequired).toBe(true);
    expect(question(schema, "#/properties/inThen")?.isRequired).toBe(false);
  });

  it("resolves a scope that names a combinator branch's path", () => {
    const schema = { type: "object", anyOf: [{ then: { properties: { last: { type: "string" } } } }] };
    expect(question(schema, "#/anyOf/0/then/properties/last")?.name).toBe("last");
  });

  describe("a scope written through a combinator path", () => {
    const schema = { type: "object", properties: { x: { type: "string" }, y: { type: "string" } },
      anyOf: [{ then: { properties: { x: { type: "string" } } } }] };

    it("shares one value with a Control on the same data written directly", () => {
      const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/x" }, { type: "Control", scope: "#/anyOf/0/then/properties/x" }] };
      expect(findElement(convert({ schema, uiSchema: ui }).output, "x_1")?.valueName).toBe("x");
      const survey = loadJsonForms(schema, ui);
      survey.getQuestionByName("x_1").value = "a";
      expect(survey.getQuestionByName("x").value).toBe("a");
    });

    it("is read by a rule that names the data directly", () => {
      const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/anyOf/0/then/properties/x" },
        { type: "Control", scope: "#/properties/y", rule: { effect: "SHOW", condition: { scope: "#/properties/x", schema: { const: "a" } } } }] };
      const { report } = convert({ schema, uiSchema: ui });
      expect(entry(report.entries, JsonSchemaCodes.ASSUMED_UI_RULE)).toBeUndefined();
      expect(loadJsonForms(schema, ui, { x: "a" }).getQuestionByName("y").isVisible).toBe(true);
      expect(loadJsonForms(schema, ui, { x: "b" }).getQuestionByName("y").isVisible).toBe(false);
    });

    it("is found by the root's conditionals", () => {
      const s = { type: "object", allOf: [{ properties: { x: { type: "string" }, y: { type: "string" } } }],
        if: { properties: { x: { const: "a" } }, required: ["x"] }, then: { required: ["y"] } };
      const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/allOf/0/properties/x" }, { type: "Control", scope: "#/allOf/0/properties/y" }] };
      const { report } = convert({ schema: s, uiSchema: ui });
      expect(report.entries).toEqual([]);
      expect(loadJsonForms(s, ui, { x: "a" }).getQuestionByName("y").isRequired).toBe(true);
      expect(loadJsonForms(s, ui, { x: "b" }).getQuestionByName("y").isRequired).toBe(false);
    });
  });

  it("still reports a remote $ref on the scope's target as a remote reference", () => {
    const schema = { type: "object", properties: { r: { $ref: "https://example.com/r.json" } } };
    const { output, report } = convert({ schema, uiSchema: control("#/properties/r") });
    expect(entry(report.entries, JsonSchemaCodes.DROPPED_REMOTE_REF)?.bucket).toBe("dropped");
    expect(entry(report.entries, JsonSchemaCodes.UNRESOLVED_SCOPE)).toBeUndefined();
    expect(findElement(output, "r")?.type).toBe("text");
    expect(assertConstructsCleanly(output, "remote target").getQuestionByName("r").getType()).toBe("text");
  });

  it("reports a scope through a remote $ref in the middle of its path as unresolved", () => {
    const schema = { type: "object", properties: { a: { type: "string" }, r: { $ref: "https://example.com/r.json" } } };
    const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/a" }, { type: "Control", scope: "#/properties/r/properties/z" }] };
    const { output, report } = convert({ schema, uiSchema: ui });
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.UNRESOLVED_SCOPE, "#/uiSchema/elements/1/scope"]]);
    expect(assertConstructsCleanly(output, "remote mid-path").getAllQuestions().map((q) => q.name)).toEqual(["a"]);
  });

  describe("a combinator that leads back to a schema being searched", () => {
    // Pet's oneOf names Cat and Dog, whose allOf names Pet again before their own properties.
    const pets = { type: "object", properties: { pet: { $ref: "#/definitions/Pet" } }, definitions: {
      Pet: { type: "object", properties: { kind: { type: "string" } }, oneOf: [{ $ref: "#/definitions/Cat" }, { $ref: "#/definitions/Dog" }] },
      Cat: { allOf: [{ $ref: "#/definitions/Pet" }, { properties: { meow: { type: "boolean" } } }] },
      Dog: { allOf: [{ $ref: "#/definitions/Pet" }, { properties: { bark: { type: "boolean" } } }] }
    } };

    for (const name of ["kind", "meow", "bark"]) {
      it(`finds ${name} past the cycle`, () => {
        const scope = `#/properties/pet/properties/${name}`;
        expect(() => convert({ schema: pets, uiSchema: control(scope) })).not.toThrow();
        expect(question(pets, scope)?.name).toBe(name);
      });
    }

    it("reports a property it never finds as an unresolved scope", () => {
      const run = () => convert({ schema: pets, uiSchema: control("#/properties/pet/properties/nope") });
      expect(run).not.toThrow();
      expect(entry(run().report.entries, JsonSchemaCodes.UNRESOLVED_SCOPE)?.sourcePointer).toBe("#/uiSchema/elements/0/scope");
      expect(assertConstructsCleanly(run().output, "never found").getAllQuestions()).toHaveLength(0);
    });

    it("reports an unresolved scope under a root anyOf that names the root", () => {
      const schema = { type: "object", properties: { a: { type: "string" } }, anyOf: [{ $ref: "#" }] };
      const run = () => convert({ schema, uiSchema: control("#/properties/missing") });
      expect(run).not.toThrow();
      expect(entry(run().report.entries, JsonSchemaCodes.UNRESOLVED_SCOPE)?.bucket).toBe("unsupported");
      expect(question(schema, "#/properties/a")?.name).toBe("a");
    });
  });
});

describe("json-schema convert - array items composed of objects", () => {
  const objects = [{ properties: { foo: { type: "string" } } }, { properties: { bar: { type: "string" } } }];
  const keywordReports = (items: object) => convert({ type: "object", properties: { rows: { type: "array", items } } })
    .report.entries.filter((e) => e.code === JsonSchemaCodes.UNSUPPORTED_KEYWORD).map((e) => e.sourcePointer);

  it("reports items that are an anyOf of objects", () => {
    expect(keywordReports({ type: "object", anyOf: objects })).toEqual(["#/properties/rows/items/anyOf"]);
    const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object", anyOf: objects } } } };
    assertConstructsCleanly(convert(schema).output, "items anyOf");
  });

  it("reports items that are a oneOf of objects with no discriminator", () => {
    expect(keywordReports({ type: "object", oneOf: objects })).toEqual(["#/properties/rows/items/oneOf"]);
  });

  it("reports untyped items that are an anyOf or a oneOf of objects", () => {
    expect(keywordReports({ anyOf: objects })).toEqual(["#/properties/rows/items/anyOf"]);
    expect(keywordReports({ oneOf: objects })).toEqual(["#/properties/rows/items/oneOf"]);
  });

  it("does not report items with properties of their own, a discriminated oneOf, or a choice set", () => {
    expect(keywordReports({ type: "object", properties: { foo: { type: "string" } }, anyOf: [{ required: ["foo"] }] })).toEqual([]);
    expect(keywordReports({ type: "object", oneOf: [
      { properties: { kind: { const: "a" }, onlyA: { type: "string" } } },
      { properties: { kind: { const: "b" }, onlyB: { type: "string" } } }
    ] })).toEqual([]);
    expect(keywordReports({ anyOf: [{ const: "a" }, { const: "b" }] })).toEqual([]);
  });
});

describe("json-schema convert - bundled schema references", () => {
  const bundle = (properties: object) => ({
    $id: "https://example.com/schemas/root",
    type: "object",
    $defs: {
      "https://example.com/schemas/count": { $id: "https://example.com/schemas/count", type: "integer", minimum: 0 },
      nested: { definitions: { flag: { $id: "urn:example:flag", type: "boolean" } } },
      both: { allOf: [{ $ref: "/schemas/count" }, { $ref: "https://example.com/schemas/count" }] }
    },
    properties
  });

  it("resolves a $ref to an $id declared in the document, absolute or relative to the base", () => {
    const schema = bundle({ rel: { $ref: "/schemas/count" }, abs: { $ref: "https://example.com/schemas/count" },
      urn: { $ref: "urn:example:flag" }, merged: { $ref: "#/$defs/both" } });
    const { output, report } = convert(schema);
    expect(report.entries).toEqual([]);
    const survey = assertConstructsCleanly(output, "bundled");
    for (const name of ["rel", "abs"]) {
      const q = survey.getQuestionByName(name);
      expect(q.inputType, name).toBe("number");
      q.value = -1;
      expect(q.hasErrors(), name).toBe(true);
      q.value = 1;
      expect(q.hasErrors(), name).toBe(false);
    }
    expect(survey.getQuestionByName("urn").getType()).toBe("boolean");
    // The allOf of two references to one resource gives its question once, bounds included.
    const merged = survey.getQuestionByName("merged");
    expect(merged.getType()).toBe("text");
    expect(merged.inputType).toBe("number");
    merged.value = -1;
    expect(merged.hasErrors()).toBe(true);
    merged.value = 1;
    expect(merged.hasErrors()).toBe(false);
  });

  it("resolves a $ref beside a constraint against the base it sits under, and applies both", () => {
    const schema = bundle({ c: { $ref: "https://other.example/forms/form" } });
    (schema.$defs as Record<string, object>).form = { $id: "https://other.example/forms/form", type: "object",
      properties: { n: { $ref: "counter", maximum: 5 } }, $defs: { counter: { $id: "https://other.example/forms/counter", type: "integer", minimum: 0 } } };
    const { output, report } = convert(schema);
    expect(report.entries).toEqual([]);
    const q = assertConstructsCleanly(output, "relative $ref beside a constraint").getQuestionByName("n");
    expect(q.inputType).toBe("number");
    for (const [value, fails] of [[-1, true], [6, true], [3, false]] as const) {
      q.value = value;
      expect(q.hasErrors(), String(value)).toBe(fails);
    }
  });

  it("resolves a JSON Pointer fragment after an $id", () => {
    const schema = bundle({ p: { $ref: "https://example.com/schemas/root#/$defs/nested/definitions/flag" } });
    const { output, report } = convert(schema);
    expect(report.entries).toEqual([]);
    expect(findElement(output, "p")?.type).toBe("boolean");
    expect(assertConstructsCleanly(output, "fragment after $id").getQuestionByName("p").getType()).toBe("boolean");
  });

  it("still reports a $ref to a URI no $id declares as a remote reference", () => {
    const { output, report } = convert(bundle({ other: { $ref: "https://example.com/schemas/unknown" } }));
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.DROPPED_REMOTE_REF, "#/properties/other"]]);
    expect(findElement(output, "other")?.type).toBe("text");
    expect(assertConstructsCleanly(output, "unknown $id").getQuestionByName("other").getType()).toBe("text");
  });
});

describe("json-schema convert - JSONForms ListWithDetail", () => {
  const schema = { type: "object",
    definitions: { order: { type: "object", properties: { title: { type: "string" }, kind: { type: "string" }, note: { type: "string" } }, required: ["title"] } },
    properties: { orders: { type: "array", items: { $ref: "#/definitions/order" } } } };
  const templateNames = (output: unknown) => (findElement(output, "orders")?.templateElements as SurveyJSONElement[]).map((e) => e.name);
  const rows = (survey: { getQuestionByName(name: string): unknown }) => (survey.getQuestionByName("orders") as any).panels;

  it("gives a dynamic panel from the items schema with no detail, and reports the master list", () => {
    const uiSchema = { type: "ListWithDetail", scope: "#/properties/orders" };
    const { output, report } = convert({ schema, uiSchema });
    expect(findElement(output, "orders")?.type).toBe("paneldynamic");
    expect(templateNames(output)).toEqual(["title", "kind", "note"]);
    expect(report.entries.map((e) => [e.code, e.bucket, e.sourcePointer])).toEqual([[JsonSchemaCodes.DROPPED_STYLING, "dropped", "#/uiSchema/type"]]);
    const survey = loadJsonForms(schema, uiSchema, { orders: [{ title: "First" }, { title: "Second", note: "n" }] });
    expect(rows(survey).map((p: any) => p.getQuestionByName("title").value)).toEqual(["First", "Second"]);
    expect(rows(survey)[0].getQuestionByName("title").isRequired).toBe(true);
    expect(survey.data).toEqual({ orders: [{ title: "First" }, { title: "Second", note: "n" }] });
  });

  it("builds the template from a detail layout with scopes relative to the items, and reads a rule from the row", () => {
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "ListWithDetail", scope: "#/properties/orders", options: { detail: { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/kind" },
      { type: "Control", scope: "#/properties/note", rule: { effect: "SHOW", condition: { scope: "#/properties/kind", schema: { const: "x" } } } }
    ] } } }] };
    const { output, report } = convert({ schema, uiSchema });
    expect(templateNames(output)).toEqual(["kind", "note"]);
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.DROPPED_STYLING, "#/uiSchema/elements/0/type"]]);
    const survey = loadJsonForms(schema, uiSchema, { orders: [{ kind: "x" }, { kind: "y" }] });
    expect(rows(survey).map((p: any) => p.getQuestionByName("note").isVisible)).toEqual([true, false]);
  });

  it("keeps a page name apart from a question name that differs only in case", () => {
    const camel = { type: "object", properties: { sourceItems: schema.properties.orders }, definitions: schema.definitions };
    const uiSchema = { type: "Categorization", elements: [{ type: "Category", label: "SourceItems", elements: [{ type: "ListWithDetail", scope: "#/properties/sourceItems" }] }] };
    const { output } = convert({ schema: camel, uiSchema });
    assertConstructsCleanly(output, "case-only names");
    expect(lintOutput(output).filter((f) => f.ruleId === "name/duplicate")).toHaveLength(0);
  });

  it("maps a ListWithDetail on primitive items as an array Control maps them", () => {
    const primitives = { type: "object", properties: { tags: { type: "array", items: { type: "string" } } } };
    const { output, report } = convert({ schema: primitives, uiSchema: { type: "ListWithDetail", scope: "#/properties/tags" } });
    const control = convert({ schema: primitives, uiSchema: { type: "Control", scope: "#/properties/tags" } }).output;
    expect(output).toEqual(control);
    expect(report.entries.map((e) => e.code)).toEqual([JsonSchemaCodes.DROPPED_STYLING]);
    expect(loadJsonForms(primitives, { type: "ListWithDetail", scope: "#/properties/tags" }, { tags: ["a", "b"] }).getQuestionByName("tags").value.slice()).toEqual(["a", "b"]);
  });
});

describe("json-schema convert - JSONForms detail on an object Control", () => {
  const user = { type: "object", properties: { kind: { type: "string" }, note: { type: "string" } }, required: ["kind"] };
  const detail = { type: "Group", label: "User data", elements: [
    { type: "Control", scope: "#/properties/kind" },
    { type: "Control", scope: "#/properties/note", rule: { effect: "SHOW", condition: { scope: "#/properties/kind", schema: { const: "x" } } } }
  ] };

  it("walks the detail layout with scopes relative to the object, and branches on a rule inside it", () => {
    const schema = { type: "object", properties: { user } };
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/user", options: { detail } }] };
    const { output, report } = convert({ schema, uiSchema });
    expect(report.entries).toEqual([]);
    const panel = findElement(output, "user");
    expect(panel?.type).toBe("panel");
    const group = (panel?.elements as SurveyJSONElement[])[0];
    expect(group).toMatchObject({ type: "panel", title: "User data" });
    expect((group.elements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["kind", "note"]);
    // `user` is optional: kind is required while the user holds a value.
    expect(findElement(output, "kind")?.requiredIf).toBe("{note} notempty");
    expect(loadJsonForms(schema, uiSchema, { kind: "x" }).getQuestionByName("note").isVisible).toBe(true);
    expect(loadJsonForms(schema, uiSchema, { kind: "y" }).getQuestionByName("note").isVisible).toBe(false);
  });

  it("reads a field of the object's detail from a rule outside it", () => {
    const schema = { type: "object", properties: { user, a: { type: "string" } } };
    const uiSchema = { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/user", options: { detail } },
      { type: "Control", scope: "#/properties/a", rule: { effect: "HIDE", condition: { scope: "#/properties/user/properties/kind", schema: { const: "x" } } } }
    ] };
    expect(entry(convert({ schema, uiSchema }).report.entries, JsonSchemaCodes.ASSUMED_UI_RULE)).toBeUndefined();
    expect(loadJsonForms(schema, uiSchema, { kind: "x" }).getQuestionByName("a").isVisible).toBe(false);
    expect(loadJsonForms(schema, uiSchema, { kind: "y" }).getQuestionByName("a").isVisible).toBe(true);
  });

  it("keeps the row's reference prefix for an object detail inside an array's detail", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object", properties: { user } } } } };
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/rows", options: { detail: { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/user", options: { detail } }
    ] } } }] };
    expect(findElement(convert({ schema, uiSchema }).output, "note")?.visibleIf).toBe("{panel.kind} = 'x'");
    const survey = loadJsonForms(schema, uiSchema, { rows: [{ kind: "x" }, { kind: "y" }] });
    const panels = (survey.getQuestionByName("rows") as any).panels;
    expect(panels.map((p: any) => p.getQuestionByName("note").isVisible)).toEqual([true, false]);
  });
});

describe("json-schema convert - JSONForms object Control fields", () => {
  const address = { type: "object", properties: { street: { type: "string" }, state: { type: "string" },
    geo: { type: "object", properties: { zone: { type: "string" } } } } };
  const schema = { type: "object", properties: { address, a: { type: "string" } } };
  const showA = (scope: string) => ({ type: "Control", scope: "#/properties/a", rule: { effect: "SHOW", condition: { type: "LEAF", scope, expectedValue: "DC" } } });

  it("reads a field the object Control's data walk created from a rule", () => {
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/address" }, showA("#/properties/address/properties/state")] };
    const { output, report } = convert({ schema, uiSchema });
    expect(report.entries).toEqual([]);
    expect(findElement(output, "a")?.visibleIf).toBe("{state} = 'DC'");
    expect(loadJsonForms(schema, uiSchema, { state: "DC" }).getQuestionByName("a").isVisible).toBe(true);
    expect(loadJsonForms(schema, uiSchema, { state: "NY" }).getQuestionByName("a").isVisible).toBe(false);
  });

  it("reads a field of a nested object the data walk created", () => {
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/address" }, showA("#/properties/address/properties/geo/properties/zone")] };
    expect(entry(convert({ schema, uiSchema }).report.entries, JsonSchemaCodes.ASSUMED_UI_RULE)).toBeUndefined();
    expect(loadJsonForms(schema, uiSchema, { zone: "DC" }).getQuestionByName("a").isVisible).toBe(true);
    expect(loadJsonForms(schema, uiSchema, { zone: "NY" }).getQuestionByName("a").isVisible).toBe(false);
  });

  it("shares the value between the data walk's field and a second Control on it", () => {
    const field = { type: "Control", scope: "#/properties/address/properties/state" };
    const object = { type: "Control", scope: "#/properties/address" };
    for (const elements of [[object, field], [field, object]]) {
      const uiSchema = { type: "VerticalLayout", elements: [...elements, showA("#/properties/address/properties/state")] };
      expect(findElement(convert({ schema, uiSchema }).output, "state_1")?.valueName).toBe("state");
      const survey = loadJsonForms(schema, uiSchema);
      survey.getQuestionByName("state_1").value = "DC";
      expect(survey.getQuestionByName("state").value).toBe("DC");
      expect(survey.getQuestionByName("a").isVisible).toBe(true);
      survey.getQuestionByName("state").value = "NY";
      expect(survey.getQuestionByName("state_1").value).toBe("NY");
      expect(survey.getQuestionByName("a").isVisible).toBe(false);
    }
  });

  it("keeps the object's own if/then working on a field shared with an earlier Control", () => {
    const zoned = { type: "object", properties: { state: { type: "string" }, zip: { type: "string" } },
      if: { properties: { state: { const: "DC" } }, required: ["state"] }, then: { required: ["zip"] } };
    const s = { type: "object", properties: { address: zoned } };
    const uiSchema = { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/address/properties/state" }, { type: "Control", scope: "#/properties/address" }
    ] };
    expect(findElement(convert({ schema: s, uiSchema }).output, "state_1")?.valueName).toBe("state");
    expect(loadJsonForms(s, uiSchema, { state: "DC" }).getQuestionByName("zip").isRequired).toBe(true);
    expect(loadJsonForms(s, uiSchema, { state: "NY" }).getQuestionByName("zip").isRequired).toBe(false);
  });

  it("renames a shared field's references, and leaves a literal holding the same text", () => {
    const zoned = { type: "object", properties: { state: { type: "string" }, zip: { type: "string" } },
      if: { properties: { zip: { const: "{state_1}" }, state: { const: "it's {state_1}" } }, required: ["zip", "state"] }, then: { required: ["zip"] } };
    const s = { type: "object", properties: { address: zoned } };
    const uiSchema = { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/address/properties/state" }, { type: "Control", scope: "#/properties/address" }
    ] };
    expect(findElement(convert({ schema: s, uiSchema }).output, "zip")?.requiredIf)
      .toBe("({state} notempty) and ({zip} = '{state_1}' and {state} = 'it\\'s {state_1}')");
    expect(loadJsonForms(s, uiSchema, { zip: "{state_1}", state: "it's {state_1}" }).getQuestionByName("zip").isRequired).toBe(true);
    expect(loadJsonForms(s, uiSchema, { zip: "{state}", state: "it's {state}" }).getQuestionByName("zip").isRequired).toBe(false);
  });

  it("keeps the object's discriminated oneOf working on a selector shared with an earlier Control", () => {
    const pet = { type: "object", properties: { kind: { type: "string", enum: ["cat", "dog"] } },
      oneOf: [{ properties: { kind: { const: "cat" }, purr: { type: "string" } } }, { properties: { kind: { const: "dog" }, bark: { type: "string" } } }] };
    const s = { type: "object", properties: { pet } };
    const uiSchema = { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/pet/properties/kind" }, { type: "Control", scope: "#/properties/pet" }
    ] };
    const shown = (kind: string) => {
      const survey = loadJsonForms(s, uiSchema, { kind });
      return ["purr", "bark"].map((n) => survey.getQuestionByName(n).isVisible && survey.getQuestionByName(n).isParentVisible);
    };
    expect(shown("cat")).toEqual([true, false]);
    expect(shown("dog")).toEqual([false, true]);
  });

  const objectConditions: [string, object][] = [
    ["a LEAF", { type: "LEAF", scope: "#/properties/address/properties/geo", expectedValue: "x" }],
    ["failWhenUndefined", { scope: "#/properties/address/properties/geo", schema: { not: { const: "x" } }, failWhenUndefined: true }],
    ["a const schema", { scope: "#/properties/address/properties/geo", schema: { const: "x" } }]
  ];
  for (const [what, condition] of objectConditions) {
    it(`reports ${what} on a nested object the data walk created, and keeps the element visible`, () => {
      const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/address" },
        { type: "Control", scope: "#/properties/a", rule: { effect: "SHOW", condition } }] };
      const { output, report } = convert({ schema, uiSchema });
      expect(entry(report.entries, JsonSchemaCodes.ASSUMED_UI_RULE)?.bucket).toBe("assumed");
      expect(findElement(output, "a")?.visibleIf).toBeUndefined();
      expect(loadJsonForms(schema, uiSchema, { zone: "x" }).getQuestionByName("a").isVisible).toBe(true);
      expect(loadJsonForms(schema, uiSchema, {}).getQuestionByName("a").isVisible).toBe(true);
    });
  }
});

describe("json-schema convert - JSONForms container names", () => {
  it("keeps a property's question name and data key when a Category or Group is labelled like it", () => {
    const schema = { type: "object",
      definitions: { place: { type: "object", properties: { street: { type: "string" } } } },
      properties: { rows: { type: "string" }, sourceItems: { type: "string" }, home: { $ref: "#/definitions/place" } } };
    const uiSchema = { type: "Categorization", elements: [
      { type: "Category", label: "Rows", elements: [{ type: "Control", scope: "#/properties/rows" }] },
      { type: "Category", label: "SourceItems", elements: [
        { type: "Group", label: "Street", elements: [{ type: "Control", scope: "#/properties/home/properties/street" }] },
        { type: "Control", scope: "#/properties/sourceItems" }
      ] }
    ] };
    const { output } = convert({ schema, uiSchema });
    expect(output.pages?.map((p) => p.name)).toEqual(["rows_1", "sourceitems_1"]);
    expect(findElement(output, "street_1")?.type).toBe("panel");
    expect(["rows", "sourceItems", "street"].map((n) => findElement(output, n)?.type)).toEqual(["text", "text", "text"]);
    expect(lintOutput(output).filter((f) => f.ruleId === "name/duplicate")).toHaveLength(0);
    const survey = loadJsonForms(schema, uiSchema, { rows: "r", sourceItems: "s", street: "t" });
    expect(["rows", "sourceItems", "street"].map((n) => survey.getQuestionByName(n).value)).toEqual(["r", "s", "t"]);
  });

  it("keeps the names of properties declared inline in a nested object, in array items and in a branch", () => {
    const schema = { type: "object",
      properties: { home: { type: "object", properties: { street: { type: "string" } } },
        rows: { type: "array", items: { type: "object", properties: { city: { type: "string" } } } }, zip: { type: "string" } },
      if: { properties: { zip: { const: "0" } } }, then: { properties: { country: { type: "string" } } } };
    const uiSchema = { type: "Categorization", elements: [
      { type: "Category", label: "Street", elements: [{ type: "Group", label: "City", elements: [{ type: "Control", scope: "#/properties/home/properties/street" }] }] },
      { type: "Category", label: "Country", elements: [{ type: "Control", scope: "#/properties/rows" }, { type: "Control", scope: "#/properties/zip" }] }
    ] };
    const { output } = convert({ schema, uiSchema });
    expect(output.pages?.map((p) => p.name)).toEqual(["street_1", "country_1"]);
    expect(findElement(output, "city_1")?.type).toBe("panel");
    expect(["street", "rows", "city", "zip"].map((n) => findElement(output, n)?.type)).toEqual(["text", "paneldynamic", "text", "text"]);
    expect(lintOutput(output).filter((f) => f.ruleId === "name/duplicate")).toHaveLength(0);
    const survey = loadJsonForms(schema, uiSchema, { street: "s", rows: [{ city: "c" }], zip: "1" });
    expect(survey.getQuestionByName("street").value).toBe("s");
    expect(survey.getQuestionByName("rows").value).toEqual([{ city: "c" }]);
  });
});

describe("json-schema convert - JSONForms schema conditionals", () => {
  const properties = { kind: { type: "string", enum: ["x", "y"] }, note: { type: "string" } };
  const controls = [{ type: "Control", scope: "#/properties/kind" }, { type: "Control", scope: "#/properties/note" }];
  const uiSchema = { type: "VerticalLayout", elements: controls };
  const ifKindX = { if: { properties: { kind: { const: "x" } } } };
  const note = (schema: object, data: Record<string, unknown>, ui: object = uiSchema) => loadJsonForms(schema, ui, data).getQuestionByName("note");
  const conditions = (output: unknown) => JSON.stringify(output).match(/"(visibleIf|requiredIf)"/g) ?? [];

  it("requires a field under a root then.required, and hides nothing", () => {
    const schema = { type: "object", properties, ...ifKindX,
      then: { required: ["note"], properties: { note: { minLength: 2 }, extra: { type: "string" } } },
      else: { required: ["kind"] } };
    const { output, report } = convert({ schema, uiSchema });
    expect(report.entries).toEqual([]);
    expect(findElement(output, "extra")).toBeUndefined();
    expect(conditions(output)).toEqual(["\"requiredIf\"", "\"requiredIf\""]);
    expect(note(schema, { kind: "x" }).isRequired).toBe(true);
    expect(note(schema, { kind: "y" }).isRequired).toBe(false);
    expect(note(schema, { kind: "y" }).isVisible).toBe(true);
    expect(loadJsonForms(schema, uiSchema, { kind: "x" }).getQuestionByName("kind").isRequired).toBe(false);
  });

  it("requires a field under a root else.required while the if does not hold", () => {
    const schema = { type: "object", properties, if: { properties: { kind: { const: "x" } }, required: ["kind"] }, else: { required: ["note"] } };
    const { output, report } = convert({ schema, uiSchema });
    expect(report.entries).toEqual([]);
    expect(findElement(output, "note")?.requiredIf).toBe("{kind} <> 'x'");
    expect(note(schema, { kind: "y" }).isRequired).toBe(true);
    expect(note(schema, {}).isRequired).toBe(true);
    expect(note(schema, { kind: "x" }).isRequired).toBe(false);
    expect(note(schema, { kind: "y" }).isVisible).toBe(true);
  });

  it("reads a root conditional from an allOf entry and a single anyOf or oneOf entry", () => {
    for (const key of ["allOf", "anyOf", "oneOf"]) {
      const schema = { type: "object", properties, [key]: [{ ...ifKindX, then: { required: ["note"] } }] };
      expect(findElement(convert({ schema, uiSchema }).output, "note")?.requiredIf).toBe("({kind} empty or {kind} = 'x')");
      expect(note(schema, { kind: "x" }).isRequired).toBe(true);
      expect(note(schema, { kind: "y" }).isRequired).toBe(false);
    }
  });

  it("reports a conditional in an anyOf of several entries and emits nothing for it", () => {
    const schema = { type: "object", properties,
      anyOf: [{ ...ifKindX, then: { required: ["note"] } }, { dependentRequired: { kind: ["note"] } }] };
    const { output, report } = convert({ schema, uiSchema });
    expect(conditions(output)).toEqual([]);
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([
      [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/anyOf/1/dependentRequired/kind"],
      [JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/anyOf/0/if"]
    ]);
  });

  it("requires a field a then and an else both require, whatever the value of the if", () => {
    const schema = { type: "object", properties, if: { properties: { kind: { const: "x" } }, required: ["kind"] },
      then: { required: ["note"] }, else: { required: ["note"] } };
    const { output, report } = convert({ schema, uiSchema });
    expect(report.entries).toEqual([]);
    expect(findElement(output, "note")?.isRequired).toBe(true);
    expect(findElement(output, "note")?.requiredIf).toBeUndefined();
    for (const data of [{ kind: "x" }, { kind: "y" }, {}]) expect(note(schema, data).isRequired).toBe(true);
  });

  it("keeps a requiredIf when the then and else require different fields", () => {
    const schema = { type: "object", properties, if: { properties: { kind: { const: "x" } }, required: ["kind"] },
      then: { required: ["note"] }, else: { required: ["kind"] } };
    const { output } = convert({ schema, uiSchema });
    expect(findElement(output, "note")?.requiredIf).toBe("{kind} = 'x'");
    expect(note(schema, { kind: "x" }).isRequired).toBe(true);
    expect(note(schema, { kind: "y" }).isRequired).toBe(false);
  });

  it("reads the condition from the data key of a Control shared with a second Control", () => {
    const schema = { type: "object", properties, ...ifKindX, then: { required: ["note"] } };
    const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/kind" }, ...controls] };
    expect(findElement(convert({ schema, uiSchema: ui }).output, "kind_1")?.valueName).toBe("kind");
    const survey = loadJsonForms(schema, ui);
    survey.getQuestionByName("kind_1").value = "x";
    expect(survey.getQuestionByName("note").isRequired).toBe(true);
    survey.getQuestionByName("kind_1").value = "y";
    expect(survey.getQuestionByName("note").isRequired).toBe(false);
  });

  const dependencies: [string, object, string][] = [
    ["a property dependency", { dependencies: { kind: ["note"] } }, "#/dependencies/kind"],
    ["dependentRequired", { dependentRequired: { kind: ["note"] } }, "#/dependentRequired/kind"],
    ["a schema dependency", { dependencies: { kind: { required: ["note"], properties: { extra: { type: "string" } } } } }, "#/dependencies/kind"],
    ["dependentSchemas", { dependentSchemas: { kind: { required: ["note"], properties: { note: { minLength: 2 } } } } }, "#/dependentSchemas/kind"]
  ];
  for (const [what, keywords, pointer] of dependencies) {
    it(`requires a field under ${what} at the root, reported assumed`, () => {
      const schema = { type: "object", properties, ...keywords };
      const { output, report } = convert({ schema, uiSchema });
      expect(report.entries.map((e) => [e.code, e.bucket, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "assumed", pointer]]);
      expect(findElement(output, "note")?.requiredIf).toBe("{kind} notempty");
      expect(findElement(output, "extra")).toBeUndefined();
      expect(conditions(output)).toEqual(["\"requiredIf\""]);
      expect(note(schema, { kind: "x" }).isRequired).toBe(true);
      expect(note(schema, {}).isRequired).toBe(false);
    });
  }

  it("gives no condition for a key with no Control, and reports it", () => {
    const schema = { type: "object", properties, ...ifKindX, then: { required: ["note"] }, dependentRequired: { kind: ["note"] } };
    const ui = { type: "VerticalLayout", elements: [controls[1]] };
    const { output, report } = convert({ schema, uiSchema: ui });
    expect(findElement(output, "note")?.requiredIf).toBeUndefined();
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([
      [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentRequired/kind"],
      [JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/if"]
    ]);
    expect(note(schema, { kind: "x" }, ui).isRequired).toBe(false);
  });

  it("reports nothing for an if whose branches require nothing, as it hides nothing", () => {
    const schema = { type: "object", properties, if: { properties: { missing: { const: "x" } } },
      then: { properties: { note: { minLength: 2 } } }, anyOf: [{ ...ifKindX, then: { properties: { extra: { type: "string" } } } }] };
    const { output, report } = convert({ schema, uiSchema });
    expect(report.entries).toEqual([]);
    expect(conditions(output)).toEqual([]);
    expect(note(schema, { kind: "y" }).isVisible).toBe(true);
  });

  const nested = { type: "object", properties: { kind: { type: "string" }, note: { type: "string" } }, ...ifKindX,
    then: { required: ["note"], properties: { note: { type: "string" }, extra: { type: "string" } } } };

  it("hides nothing for an if/then inside an object Control, and still applies its then.required", () => {
    const schema = { type: "object", properties: { user: nested } };
    const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/user" }] };
    const { output, report } = convert({ schema, uiSchema: ui });
    expect(report.entries).toEqual([]);
    expect(findElement(output, "extra")).toBeUndefined();
    expect(conditions(output)).toEqual(["\"requiredIf\""]);
    expect(note(schema, { kind: "x" }, ui).isRequired).toBe(true);
    expect(note(schema, { kind: "y" }, ui).isRequired).toBe(false);
    expect(note(schema, { kind: "y" }, ui).isVisible).toBe(true);
  });

  it("requires a field under an object's if/then read through the object Control's detail layout", () => {
    const object = { ...nested, dependentRequired: { missing: ["note"] } };
    const schema = { type: "object", properties: { user: object } };
    const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/user", options: { detail: { type: "Group", label: "User", elements: controls } } }] };
    const { output, report } = convert({ schema, uiSchema: ui });
    expect(report.entries.map((e) => [e.code, e.sourcePointer, e.count])).toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/properties/user/dependentRequired/missing", 1]]);
    expect(findElement(output, "extra")).toBeUndefined();
    expect(conditions(output)).toEqual(["\"requiredIf\""]);
    expect(note(schema, { kind: "x" }, ui).isRequired).toBe(true);
    expect(note(schema, { kind: "y" }, ui).isRequired).toBe(false);
  });

  describe("every Control on the same object scope", () => {
    const schema = { type: "object", properties: { user: nested } };
    const detailed = { type: "Control", scope: "#/properties/user", options: { detail: { type: "VerticalLayout", elements: controls } } };
    const walked = { type: "Control", scope: "#/properties/user" };
    // Whether each question made on `note` is required, with `kind` set to x and to y.
    const notes = (elements: readonly object[]) => ["x", "y"].map((kind) => {
      const survey = loadJsonForms(schema, { type: "VerticalLayout", elements }, { kind });
      return survey.getAllQuestions().filter((q) => q.name.startsWith("note")).map((q) => q.isRequired);
    });

    for (const [what, elements] of [["two detail layouts", [detailed, detailed]], ["a data walk, then a detail layout", [walked, detailed]],
      ["a detail layout, then a data walk", [detailed, walked]]] as const) {
      it(`requires the field in ${what}`, () => {
        const { output, report } = convert({ schema, uiSchema: { type: "VerticalLayout", elements } });
        expect(report.entries).toEqual([]);
        expect(notes(elements)).toEqual([[true, true], [false, false]]);
        // Each question carries the condition once, while the optional user holds a value.
        for (const name of ["note", "note_1"]) expect((findElement(output, name)?.requiredIf as string).split("{kind} = 'x'")).toHaveLength(2);
      });
    }

    for (const [what, elements] of [["two detail layouts", [detailed, detailed]], ["a detail layout, then a data walk", [detailed, walked]],
      ["a data walk, then a detail layout", [walked, detailed]]] as const) {
      it(`reports the object's conditionals once for ${what}`, () => {
        const s = { type: "object", properties: { user: { ...nested, dependentRequired: { missing: ["note"] } } } };
        const { report } = convert({ schema: s, uiSchema: { type: "VerticalLayout", elements } });
        expect(report.entries.map((e) => [e.code, e.count])).toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, 1]]);
      });
    }
  });

  it("requires a field under the items' if/then in each row of an array Control's detail layout", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: nested } } };
    const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/rows", options: { detail: { type: "VerticalLayout", elements: controls } } }] };
    const { output, report } = convert({ schema, uiSchema: ui });
    expect(report.entries).toEqual([]);
    expect(findElement(output, "note")?.requiredIf).toBe("({panel.kind} empty or {panel.kind} = 'x')");
    const panels = (loadJsonForms(schema, ui, { rows: [{ kind: "x" }, { kind: "y" }] }).getQuestionByName("rows") as any).panels;
    expect(panels.map((p: any) => p.getQuestionByName("note").isRequired)).toEqual([true, false]);
  });

  it("follows the root schema's own $ref to its conditionals", () => {
    const schema = { $ref: "#/definitions/u", definitions: { u: { type: "object", properties, ...ifKindX, then: { required: ["note"] } } } };
    expect(findElement(convert({ schema, uiSchema }).output, "note")?.requiredIf).toBe("({kind} empty or {kind} = 'x')");
    expect(note(schema, { kind: "x" }).isRequired).toBe(true);
    expect(note(schema, { kind: "y" }).isRequired).toBe(false);
  });

  it("applies the root's conditionals once under a Control on the whole form", () => {
    const schema = { type: "object", properties, ...ifKindX, then: { required: ["note"] }, dependentRequired: { missing: ["note"] } };
    const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#" }] };
    const { output, report } = convert({ schema, uiSchema: ui });
    expect(findElement(output, "note")?.requiredIf).toBe("({kind} empty or {kind} = 'x')");
    expect(report.entries.map((e) => [e.code, e.count])).toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, 1]]);
    expect(note(schema, { kind: "x" }, ui).isRequired).toBe(true);
    expect(note(schema, { kind: "y" }, ui).isRequired).toBe(false);
  });

  it("reports a remote $ref among the root's allOf entries once", () => {
    const schema = { type: "object", properties, allOf: [{ $ref: "http://example.com/s.json" }] };
    for (const ui of [uiSchema, { type: "VerticalLayout", elements: [{ type: "Control", scope: "#" }] }]) {
      const { report } = convert({ schema, uiSchema: ui });
      expect(report.entries.map((e) => [e.code, e.sourcePointer, e.count])).toEqual([[JsonSchemaCodes.DROPPED_REMOTE_REF, "#/allOf/0", 1]]);
    }
  });

  it("keeps visibleIf for the same schema with no UI schema", () => {
    const schema = { type: "object", properties: { user: nested } };
    const survey = assertConstructsCleanly(convert(schema).output, "bare if/then");
    survey.data = { kind: "y" };
    expect(survey.getQuestionByName("note").isVisible).toBe(false);
    expect(survey.getQuestionByName("extra").isVisible).toBe(false);
    survey.data = { kind: "x" };
    expect(survey.getQuestionByName("note").isVisible).toBe(true);
    expect(survey.getQuestionByName("note").isRequired).toBe(true);
    expect(survey.getQuestionByName("extra").isVisible).toBe(true);
  });
});

describe("json-schema convert - RJSF mapped options", () => {
  const convertField = (field: object, ui: object) => {
    const { output, report } = convert({ schema: { type: "object", properties: { a: field } }, uiSchema: { a: ui } });
    return { survey: assertConstructsCleanly(output, "rjsf option"), report: report.entries, output };
  };
  const rows = { type: "array", items: { type: "object", properties: { n: { type: "string" } } } };

  it("gives a text question the inputType", () => {
    const { survey, report } = convertField({ type: "string" }, { "ui:options": { inputType: "tel" } });
    expect(survey.getQuestionByName("a").inputType).toBe("tel");
    expect(report).toEqual([]);
  });

  it("reports an inputType survey-core has no equivalent of", () => {
    const { report } = convertField({ type: "string" }, { "ui:options": { inputType: "bogus" } });
    expect(entry(report, JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.sourcePointer).toBe("#/uiSchema/a/ui:options/inputType");
  });

  it("removes the add button with addable false", () => {
    const { survey, report } = convertField(rows, { "ui:options": { addable: false } });
    const q = survey.getQuestionByName("a");
    expect(q.allowAddPanel).toBe(false);
    expect(q.canAddPanel).toBe(false);
    expect(q.allowRemovePanel).toBe(true);
    expect(report).toEqual([]);
  });

  it("removes the remove button with removable false", () => {
    const { survey } = convertField(rows, { "ui:removable": false });
    const q = survey.getQuestionByName("a");
    expect(q.allowRemovePanel).toBe(false);
    expect(q.allowAddPanel).toBe(true);
  });

  it("keeps the buttons with addable true", () => {
    const { survey, report } = convertField(rows, { "ui:addable": true, "ui:removable": true });
    expect(survey.getQuestionByName("a").allowAddPanel).toBe(true);
    expect(report).toEqual([]);
  });

  it("reports addable false on a list that has no add button", () => {
    const { report } = convertField({ type: "array", items: { type: "string", enum: ["x", "y"] } }, { "ui:addable": false });
    expect(entry(report, JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.sourcePointer).toBe("#/uiSchema/a/ui:addable");
  });

  it("still reports orderable", () => {
    const { report } = convertField(rows, { "ui:orderable": false });
    expect(entry(report, JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.sourcePointer).toBe("#/uiSchema/a/ui:orderable");
  });

  it("reads enumNames as an array by index, null included", () => {
    const { survey, report } = convertField({ type: "string", enum: ["x", null, "y"] }, { "ui:enumNames": ["Ex", "Nothing", "Why"] });
    const q = survey.getQuestionByName("a");
    expect(q.choices.map((c: { value: unknown }) => c.value)).toEqual(["x", "y"]);
    expect(q.choices.map((c: { text: string }) => c.text)).toEqual(["Ex", "Why"]);
    expect(report).toEqual([]);
  });

  it("reads enumNames as an object by value", () => {
    const { survey } = convertField({ type: "number", enum: [1, 2] }, { "ui:options": { enumNames: { 2: "Two" } } });
    const q = survey.getQuestionByName("a");
    expect(q.choices.map((c: { text: string }) => c.text)).toEqual(["1", "Two"]);
  });

  it("names the choices of an enum array", () => {
    const { survey } = convertField({ type: "array", items: { type: "string", enum: ["x", "y"] } }, { "ui:enumNames": ["Ex", "Why"] });
    expect(survey.getQuestionByName("a").choices.map((c: { text: string }) => c.text)).toEqual(["Ex", "Why"]);
  });

  it("disables the choices named by enumDisabled", () => {
    const { survey, report } = convertField({ type: "string", enum: ["x", "y", "z"] }, { "ui:enumDisabled": ["y"] });
    const q = survey.getQuestionByName("a");
    expect(q.choices.map((c: { isEnabled: boolean }) => c.isEnabled)).toEqual([true, false, true]);
    expect(report).toEqual([]);
  });

  it("makes help the description of a field that has none", () => {
    const { survey, report } = convertField({ type: "string" }, { "ui:help": "Hint" });
    expect(survey.getQuestionByName("a").description).toBe("Hint");
    expect(report).toEqual([]);
  });

  it("keeps the description and reports help when the field has one", () => {
    const { survey, report } = convertField({ type: "string", description: "Own" }, { "ui:help": "Hint" });
    expect(survey.getQuestionByName("a").description).toBe("Own");
    expect(entry(report, JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.sourcePointer).toBe("#/uiSchema/a/ui:help");
  });

  it("keeps a ui:description and reports help", () => {
    const { survey, report } = convertField({ type: "string" }, { "ui:description": "Own", "ui:help": "Hint" });
    expect(survey.getQuestionByName("a").description).toBe("Own");
    expect(report).toHaveLength(1);
  });
});

describe("json-schema convert - JSONForms mapped options", () => {
  const control = (field: object, options: object) => {
    const { output, report } = convert({
      schema: { type: "object", properties: { a: field } },
      uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/a", options }] }
    });
    return { survey: assertConstructsCleanly(output, "jsonforms option"), report: report.entries };
  };

  it("limits the input to maxLength with restrict", () => {
    const { survey, report } = control({ type: "string", maxLength: 5 }, { restrict: true });
    expect(survey.getQuestionByName("a").maxLength).toBe(5);
    expect(report).toEqual([]);
  });

  it("limits a multi-line input with restrict", () => {
    const { survey } = control({ type: "string", maxLength: 9 }, { restrict: true, multi: true });
    expect(survey.getQuestionByName("a").maxLength).toBe(9);
  });

  it("leaves the length alone with no restrict", () => {
    const { survey } = control({ type: "string", maxLength: 5 }, {});
    expect(survey.getQuestionByName("a").maxLength).toBe(-1);
  });

  it("gives a numeric text the step", () => {
    const { survey, report } = control({ type: "number" }, { step: 0.5 });
    const q = survey.getQuestionByName("a");
    expect(q.inputType).toBe("number");
    expect(q.step).toBe(0.5);
    expect(report).toEqual([]);
  });

  it("reports a step on a question with no step", () => {
    const { report } = control({ type: "string" }, { step: 2 });
    expect(entry(report, JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.sourcePointer).toBe("#/uiSchema/elements/0/options/step");
  });

  it("makes a slider question from slider", () => {
    const { survey, report } = control({ type: "integer", minimum: 10, maximum: 50, default: 20 }, { slider: true, step: 5 });
    const q = survey.getQuestionByName("a");
    expect(q.getType()).toBe("slider");
    expect([q.min, q.max, q.step]).toEqual([10, 50, 5]);
    expect(q.value).toBe(20);
    expect(report).toEqual([]);
  });

  it("reports slider on a question that cannot be one", () => {
    const { survey, report } = control({ type: "string" }, { slider: true });
    expect(survey.getQuestionByName("a").getType()).toBe("text");
    expect(entry(report, JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.sourcePointer).toBe("#/uiSchema/elements/0/options/slider");
  });

  it("reports nothing for toggle on a boolean, which is already a switch", () => {
    const { survey, report } = control({ type: "boolean" }, { toggle: true });
    expect(survey.getQuestionByName("a").getType()).toBe("boolean");
    expect(report).toEqual([]);
  });

  const orders = { type: "array", items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" } } } };

  it("titles the rows from elementLabelProp", () => {
    const { survey, report } = control(orders, { elementLabelProp: "name" });
    const q = survey.getQuestionByName("a");
    expect(q.templateTitle).toBe("{panel.name}");
    survey.data = { a: [{ id: "1", name: "First" }, { id: "2", name: "Second" }] };
    expect(q.panels.map((p: { locTitle: { renderedHtml: string } }) => p.locTitle.renderedHtml)).toEqual(["First", "Second"]);
    expect(report).toEqual([]);
  });

  it("titles the rows of a ListWithDetail from labelRef", () => {
    const { output, report } = convert({
      schema: { type: "object", properties: { a: orders } },
      uiSchema: { type: "VerticalLayout", elements: [{ type: "ListWithDetail", scope: "#/properties/a", options: { labelRef: "#/items/properties/name" } }] }
    });
    const survey = assertConstructsCleanly(output, "labelRef");
    const q = survey.getQuestionByName("a");
    expect(q.templateTitle).toBe("{panel.name}");
    survey.data = { a: [{ id: "1", name: "First" }] };
    expect(q.panels[0].locTitle.renderedHtml).toBe("First");
    expect(report.entries.filter((e) => e.code === JsonSchemaCodes.UNSUPPORTED_UI_HINT)).toEqual([]);
  });

  it("reports a label property the rows do not have", () => {
    const { report } = control(orders, { elementLabelProp: "missing" });
    expect(entry(report, JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.sourcePointer).toBe("#/uiSchema/elements/0/options/elementLabelProp");
  });
});

describe("json-schema convert - JSONForms presentation options", () => {
  const control = (options: object) => convert({
    schema: { type: "object", properties: { a: { type: "string" } } },
    uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/a", options }] }
  });

  for (const key of ["trim", "showUnfocusedDescription", "hideRequiredAsterisk", "autocomplete", "clearable", "orientation", "ampm",
    "okLabel", "cancelLabel", "clearLabel", "dateFormat", "dateTimeFormat", "views"]) {
    it(`reports ${key} as dropped styling`, () => {
      const { output, report } = control({ [key]: true });
      assertConstructsCleanly(output, key);
      expect(report.entries).toHaveLength(1);
      expect(entry(report.entries, JsonSchemaCodes.DROPPED_STYLING)?.sourcePointer).toBe(`#/uiSchema/elements/0/options/${key}`);
    });
  }

  for (const key of ["dateSaveFormat", "dateTimeSaveFormat", "showSortButtons"]) {
    it(`keeps reporting ${key} as an unsupported hint`, () => {
      const { report } = control({ [key]: true });
      expect(entry(report.entries, JsonSchemaCodes.UNSUPPORTED_UI_HINT)?.sourcePointer).toBe(`#/uiSchema/elements/0/options/${key}`);
    });
  }
});

describe("json-schema convert - option review fixes", () => {
  const jf = (field: object, options: object) => {
    const { output, report } = convert({
      schema: { type: "object", properties: { a: field } },
      uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/a", options }] }
    });
    return { survey: assertConstructsCleanly(output, "option fix"), report: report.entries };
  };
  const rjsfConvert = (schema: object, uiSchema: object) => {
    const { output, report } = convert({ schema, uiSchema });
    return { survey: assertConstructsCleanly(output, "option fix"), report: report.entries, output };
  };
  const pointers = (entries: ReportEntry[]) => entries.filter((e) => e.code === JsonSchemaCodes.UNSUPPORTED_UI_HINT).map((e) => e.sourcePointer);

  it("keeps a number input and reports slider when the schema has no bounds", () => {
    const { survey, report } = jf({ type: "number" }, { slider: true });
    expect(survey.getQuestionByName("a").getType()).toBe("text");
    expect(pointers(report)).toEqual(["#/uiSchema/elements/0/options/slider"]);
  });

  it("keeps a number input and reports slider when the schema has no default", () => {
    const { survey, report } = jf({ type: "number", minimum: 0, maximum: 10 }, { slider: true });
    expect(survey.getQuestionByName("a").getType()).toBe("text");
    expect(pointers(report)).toHaveLength(1);
  });

  it("reads slider bounds and restrict from an allOf", () => {
    const slider = jf({ allOf: [{ type: "number" }, { minimum: 1, maximum: 9, default: 3 }] }, { slider: true });
    const q = slider.survey.getQuestionByName("a");
    expect([q.getType(), q.min, q.max]).toEqual(["slider", 1, 9]);
    const restrict = jf({ allOf: [{ type: "string" }, { maxLength: 4 }] }, { restrict: true });
    expect(restrict.survey.getQuestionByName("a").maxLength).toBe(4);
    expect(restrict.report).toEqual([]);
  });

  it("does not take an enumNames key from the object prototype", () => {
    const { survey } = rjsfConvert({ type: "object", properties: { a: { type: "string", enum: ["constructor", "x"] } } },
      { a: { "ui:enumNames": { x: "Ex" } } });
    expect(survey.getQuestionByName("a").choices.map((c: { text: string }) => c.text)).toEqual(["constructor", "Ex"]);
  });

  it("makes a root ui:help the form description, and reports it when the form has one", () => {
    const bare = rjsfConvert({ type: "object", properties: { a: { type: "string" } } }, { "ui:help": "Form help" });
    expect(bare.output.description).toBe("Form help");
    expect(bare.report).toEqual([]);
    const described = rjsfConvert({ type: "object", description: "Own", properties: { a: { type: "string" } } }, { "ui:help": "Form help" });
    expect(described.output.description).toBe("Own");
    expect(pointers(described.report)).toEqual(["#/uiSchema/ui:help"]);
  });

  it("reports an inputType a number question cannot take", () => {
    const { report } = rjsfConvert({ type: "object", properties: { a: { type: "number" } } }, { a: { "ui:options": { inputType: "range" } } });
    expect(pointers(report)).toEqual(["#/uiSchema/a/ui:options/inputType"]);
  });

  it("reports enumDisabled and enumNames on a boolean", () => {
    const { report } = rjsfConvert({ type: "object", properties: { a: { type: "boolean" } } },
      { a: { "ui:widget": "radio", "ui:enumDisabled": [false], "ui:enumNames": ["Y", "N"] } });
    expect(pointers(report).sort()).toEqual(["#/uiSchema/a/ui:enumDisabled", "#/uiSchema/a/ui:enumNames"]);
  });

  it("reports enumNames on a oneOf of consts, which carries its own titles", () => {
    const { report } = rjsfConvert({ type: "object", properties: { a: { oneOf: [{ const: "x", title: "X" }] } } }, { a: { "ui:enumNames": ["Ex"] } });
    expect(pointers(report)).toEqual(["#/uiSchema/a/ui:enumNames"]);
  });
});

describe("json-schema convert - nested scopes outside their object", () => {
  const schema = { type: "object", properties: {
    element: { type: "object", properties: { width: { type: "number" } } },
    rows: { type: "array", items: { type: "object", properties: { customer: { type: "object", properties: { id: { type: "string" } } } } } }
  } };

  it("reports a Control on a nested scope, whose value survey-core keeps under its own key", () => {
    const uiSchema = { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/element/properties/width" },
      { type: "Control", scope: "#/properties/rows", options: { detail: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/customer/properties/id" }] } } }
    ] };
    const { output, report } = convert({ schema, uiSchema });
    expect(report.entries.map((e) => [e.code, e.bucket, e.sourcePointer, e.targetPath])).toEqual([
      [JsonSchemaCodes.ASSUMED_NESTED_SCOPE, "assumed", "#/uiSchema/elements/0/scope", "elements[0]"],
      [JsonSchemaCodes.ASSUMED_NESTED_SCOPE, "assumed", "#/uiSchema/elements/1/options/detail/elements/0/scope", "elements[1].templateElements[0]"]
    ]);
    const survey = assertConstructsCleanly(output, "nested scope");
    survey.getQuestionByName("width").value = 3;
    // The change the entry reports: JSONForms writes { element: { width: 3 } }.
    expect(survey.data).toEqual({ width: 3 });
  });

  it("does not report a Control on a direct property, or one inside its object's detail", () => {
    const uiSchema = { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/element", options: { detail: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/width" }] } } },
      { type: "Control", scope: "#/properties/rows" }
    ] };
    const { output, report } = convert({ schema, uiSchema });
    assertConstructsCleanly(output, "direct scopes");
    expect(report.entries).toEqual([]);
  });
});

describe("json-schema convert - objects with no properties", () => {
  const shapes: [string, object][] = [
    ["a free-form object", { type: "object", title: "Ids" }],
    ["an object with additionalProperties only", { type: "object", title: "Ids", additionalProperties: { type: "string" } }],
    ["an object with patternProperties only", { type: "object", title: "Ids", patternProperties: { "^x": { type: "string" } } }]
  ];
  for (const [what, ids] of shapes) {
    it(`keeps the titled panel of ${what}, as JSONForms and RJSF render an empty group, and reports it`, () => {
      const { output, report } = convert({ type: "object", properties: { ids, a: { type: "string" } } });
      expect(findElement(output, "ids")).toEqual({ type: "panel", name: "ids", title: "Ids" });
      expect(report.entries.map((e) => [e.code, e.bucket, e.sourcePointer, e.targetPath]))
        .toEqual([[JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "unsupported", "#/properties/ids", "elements[0]"]]);
      assertConstructsCleanly(output, what);
    });
  }

  it("reports the items of an array of free-form objects", () => {
    const { output, report } = convert({ type: "object", properties: { list: { type: "array", items: { $ref: "#/definitions/id" } } }, definitions: { id: { type: "object" } } });
    assertConstructsCleanly(output, "free-form items");
    expect(findElement(output, "list")).toEqual({ type: "paneldynamic", name: "list" });
    expect(report.entries.map((e) => [e.code, e.sourcePointer, e.targetPath])).toEqual([[JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/properties/list/items", "elements[0]"]]);
  });

  it("reports a free-form object in a row a ListWithDetail generates", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object", properties: { a: { type: "string" }, ids: { type: "object" } } } } } };
    const { output, report } = convert({ schema, uiSchema: { type: "ListWithDetail", scope: "#/properties/rows" } });
    assertConstructsCleanly(output, "free-form in a row");
    expect(report.entries.filter((e) => e.code === JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT).map((e) => [e.sourcePointer, e.targetPath]))
      .toEqual([["#/properties/rows/items/properties/ids", "elements[0].templateElements[1]"]]);
  });

  it("does not report an object whose properties come from allOf, or a variant", () => {
    const { output, report } = convert({ type: "object", properties: {
      merged: { type: "object", allOf: [{ properties: { a: { type: "string" } } }] },
      variants: { type: "object", oneOf: [{ properties: { k: { const: "x" }, a: { type: "string" } } }, { properties: { k: { const: "y" } } }] }
    } });
    assertConstructsCleanly(output, "declared keys");
    expect(report.entries.filter((e) => e.code === JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT)).toEqual([]);
  });
});

describe("json-schema convert - allOf conflicts", () => {
  const codes = (schema: object) => {
    const { output, report } = convert(schema);
    assertConstructsCleanly(output, "allOf conflict");
    return report.entries.map((e) => [e.code, e.bucket, e.sourcePointer]);
  };

  it("reports a keyword two entries set differently, and keeps the first", () => {
    const schema = { type: "object", properties: { n: { allOf: [{ type: "integer", minimum: 1 }, { minimum: 5 }] } } };
    expect(codes(schema)).toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "assumed", "#/properties/n/allOf/1/minimum"]]);
    expect(findElement(convert(schema).output, "n")?.validators).toEqual([{ type: "numeric", minValue: 1 }]);
  });

  it("reports a keyword an entry sets differently from the schema itself", () => {
    expect(codes({ type: "object", properties: { x: { type: "string", format: "email", allOf: [{ format: "uri" }] } } }))
      .toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "assumed", "#/properties/x/allOf/0/format"]]);
  });

  it("reports a keyword two entries set differently on one property", () => {
    expect(codes({ type: "object", allOf: [{ properties: { a: { type: "string", maxLength: 3 } } }, { properties: { a: { maxLength: 5 } } }] }))
      .toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "assumed", "#/allOf/1/properties/a/maxLength"]]);
  });

  it("does not report a keyword set alike, or an annotation set differently", () => {
    expect(codes({ type: "object", properties: { x: { allOf: [{ type: "string", title: "A", minLength: 1 }, { type: "string", title: "B", description: "D", minLength: 1 }] } } })).toEqual([]);
  });
});

describe("json-schema convert - conditionals in allOf entries", () => {
  const animal = (cat: object, fish: object) => ({ type: "object", properties: { animal: { enum: ["Cat", "Fish", "Dog"] } }, required: ["animal"],
    allOf: [{ if: { properties: { animal: { const: "Cat" } } }, then: cat }, { if: { properties: { animal: { const: "Fish" } } }, then: fish }] });
  // [visible, required] of each question, for each animal.
  const states = (schema: object, names: string[]) => {
    const survey = assertConstructsCleanly(convert(schema).output, "allOf conditionals");
    return ["Cat", "Fish", "Dog"].map((value) => {
      survey.data = { animal: value };
      return names.map((name) => [survey.getQuestionByName(name).isVisible, survey.getQuestionByName(name).isRequired]);
    });
  };

  it("applies the if/then of every entry", () => {
    const schema = animal({ properties: { food: { type: "string" } }, required: ["food"] }, { properties: { water: { type: "string" } }, required: ["water"] });
    expect(convert(schema).report.entries).toEqual([]);
    expect(states(schema, ["food", "water"])).toEqual([
      [[true, true], [false, false]],
      [[false, false], [true, true]],
      [[false, false], [false, false]]
    ]);
  });

  it("shows a property two entries' branches give alike under either", () => {
    const branch = { properties: { note: { type: "string" } } };
    const schema = animal(branch, branch);
    expect(convert(schema).report.entries).toEqual([]);
    expect(states(schema, ["note"])).toEqual([[[true, false]], [[true, false]], [[false, false]]]);
  });

  it("does not show a property under a second branch that gives it another schema, and reports it", () => {
    const schema = animal({ properties: { food: { enum: ["meat"] } }, required: ["food"] }, { properties: { food: { enum: ["worms"] } }, required: ["food"] });
    expect(convert(schema).report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/allOf/1/then/properties/food"]]);
    expect(findElement(convert(schema).output, "food")?.choices).toEqual([{ value: "meat" }]);
    expect(states(schema, ["food"]).map(([[visible]]) => visible)).toEqual([true, false, false]);
  });

  it("requires a field under each entry's if/then in an object Control under JSONForms", () => {
    const user = { type: "object", properties: { kind: { type: "string" }, a: { type: "string" }, b: { type: "string" } },
      allOf: [{ if: { properties: { kind: { const: "x" } }, required: ["kind"] }, then: { required: ["a"] } },
        { if: { properties: { kind: { const: "y" } }, required: ["kind"] }, then: { required: ["b"] } }] };
    const schema = { type: "object", properties: { user } };
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/user" }] };
    expect(convert({ schema, uiSchema }).report.entries).toEqual([]);
    expect(["x", "y", "z"].map((kind) => {
      const survey = loadJsonForms(schema, uiSchema, { kind });
      return [survey.getQuestionByName("a").isRequired, survey.getQuestionByName("b").isRequired];
    })).toEqual([[true, false], [false, true], [false, false]]);
  });
});

describe("json-schema convert - an unresolved $id fragment", () => {
  const schema = (properties: object) => ({ $id: "https://example.com/schemas/root", type: "object", $defs: { a: { type: "string" } }, properties });

  it("reports a $ref whose $id matches and whose fragment names nothing as unresolved", () => {
    const { output, report } = convert(schema({ bad: { $ref: "https://example.com/schemas/root#/$defs/missing" } }));
    assertConstructsCleanly(output, "unresolved fragment");
    expect(report.entries.map((e) => [e.code, e.bucket, e.sourcePointer])).toEqual([[JsonSchemaCodes.UNRESOLVED_REF, "unsupported", "#/properties/bad"]]);
    expect(findElement(output, "bad")?.type).toBe("text");
  });

  it("reports such a $ref on a JSONForms scope's target, and a scope through it as unresolved", () => {
    const s = schema({ bad: { $ref: "https://example.com/schemas/root#/$defs/missing" } });
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/bad" }, { type: "Control", scope: "#/properties/bad/properties/x" }] };
    const { output, report } = convert({ schema: s, uiSchema });
    assertConstructsCleanly(output, "unresolved fragment scope");
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([
      [JsonSchemaCodes.UNRESOLVED_REF, "#/properties/bad"],
      [JsonSchemaCodes.UNRESOLVED_SCOPE, "#/uiSchema/elements/1/scope"]
    ]);
  });
});

describe("json-schema convert - JSONForms ListWithDetail on objects, detail layouts through allOf, row labels and toggle", () => {
  const user = { type: "object", properties: { kind: { type: "string" }, note: { type: "string" } } };

  for (const [what, scoped] of [["an object", user], ["an object given through allOf", { allOf: [user] }]] as const) {
    it(`gives no element for a ListWithDetail on ${what}, as no JSONForms renderer takes it, and reports it`, () => {
      const schema = { type: "object", properties: { user: scoped, b: { type: "string" } } };
      const uiSchema = { type: "VerticalLayout", elements: [{ type: "ListWithDetail", scope: "#/properties/user" }, { type: "Control", scope: "#/properties/b" }] };
      const { output, report } = convert({ schema, uiSchema });
      expect(assertConstructsCleanly(output, what).getAllQuestions().map((q) => q.name)).toEqual(["b"]);
      expect(report.entries.map((e) => [e.code, e.bucket, e.sourcePointer])).toEqual([[JsonSchemaCodes.UNSUPPORTED_UI_HINT, "unsupported", "#/uiSchema/elements/0/type"]]);
    });
  }

  it("walks a detail layout on an object or an array given through allOf", () => {
    const schema = { type: "object", properties: { user: { allOf: [user] }, rows: { allOf: [{ type: "array", items: user }] } } };
    const detail = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/note" }] };
    const uiSchema = { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/user", options: { detail } }, { type: "Control", scope: "#/properties/rows", options: { detail } }] };
    const { output, report } = convert({ schema, uiSchema });
    expect(report.entries).toEqual([]);
    expect((findElement(output, "user")?.elements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["note"]);
    expect((findElement(output, "rows")?.templateElements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["note_1"]);
  });

  const rows = { type: "array", items: { type: "object", properties: { name: { type: "string" }, customer: { type: "object", properties: { name: { type: "string" } } } } } };
  const titles = (uiSchema: object, data: unknown[]) => {
    const { output, report } = convert({ schema: { type: "object", properties: { rows } }, uiSchema });
    const survey = assertConstructsCleanly(output, "row titles");
    const q = survey.getQuestionByName("rows");
    survey.data = { rows: data };
    return { templateTitle: q.templateTitle, titles: q.panels.map((p: { locTitle: { renderedHtml: string } }) => p.locTitle.renderedHtml),
      hints: report.entries.filter((e) => e.code === JsonSchemaCodes.UNSUPPORTED_UI_HINT).map((e) => e.sourcePointer) };
  };

  it("titles the rows from a nested labelRef by its full path", () => {
    const detail = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/name" }, { type: "Control", scope: "#/properties/customer/properties/name" }] };
    for (const options of [{ labelRef: "#/items/properties/customer/properties/name", detail }, { labelRef: "#/items/properties/customer/properties/name" }, { elementLabelProp: "customer.name" }]) {
      expect(titles({ type: "ListWithDetail", scope: "#/properties/rows", options }, [{ name: "Row", name_1: "Customer" }]), JSON.stringify(options))
        .toEqual({ templateTitle: "{panel.name_1}", titles: ["Customer"], hints: [] });
    }
  });

  it("does not take an unrelated renamed question for a label property the rows do not have, and reports it", () => {
    const { output, report } = convert({ schema: { type: "object", properties: { rows: { type: "array", items: { type: "object", properties: { name_1: { type: "string" } } } } } },
      uiSchema: { type: "Control", scope: "#/properties/rows", options: { elementLabelProp: "name" } } });
    assertConstructsCleanly(output, "unrelated label");
    expect(findElement(output, "rows")?.templateTitle).toBeUndefined();
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.UNSUPPORTED_UI_HINT, "#/uiSchema/options/elementLabelProp"]]);
  });

  it("reports toggle on a question that is not a boolean, as JSONForms applies it to booleans only", () => {
    const { output, report } = convert({ schema: { type: "object", properties: { a: { type: "string" }, t: { type: "boolean" } } },
      uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/a", options: { toggle: true } }, { type: "Control", scope: "#/properties/t", options: { toggle: true } }] } });
    expect(assertConstructsCleanly(output, "toggle").getQuestionByName("t").getType()).toBe("boolean");
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.UNSUPPORTED_UI_HINT, "#/uiSchema/elements/0/options/toggle"]]);
  });

  it("reports a detail's schema entries at their pointer from the schema root", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object",
      properties: { r: { $ref: "https://remote.example/r" }, obj: { type: "object", properties: { s: { $ref: "https://remote.example/s" } }, dependentRequired: { s: ["t"] } } },
      dependentRequired: { r: ["x"] } } } } };
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/rows", options: { detail: { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/r" },
      { type: "Control", scope: "#/properties/obj", options: { detail: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/s" }] } } }
    ] } } }] };
    const { output, report } = convert({ schema, uiSchema });
    assertConstructsCleanly(output, "detail pointers");
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([
      [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/properties/rows/items/dependentRequired/r"],
      // `x` and `t` are declared nowhere: required, they have no question.
      [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/properties/rows/items/dependentRequired/r/0"],
      [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/properties/rows/items/properties/obj/dependentRequired/s"],
      [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/properties/rows/items/properties/obj/dependentRequired/s/0"],
      [JsonSchemaCodes.DROPPED_REMOTE_REF, "#/properties/rows/items/properties/obj/properties/s"],
      [JsonSchemaCodes.DROPPED_REMOTE_REF, "#/properties/rows/items/properties/r"]
    ]);
  });

  it("reports a nested object's conditionals once, whichever of its detail layout and the data walk comes first", () => {
    const addr = { type: "object", properties: { street: { type: "string" }, zip: { type: "string" } }, dependentRequired: { street: ["zip"] } };
    const schema = { type: "object", properties: { user: { type: "object", properties: { name: { type: "string" }, note: { type: "string" }, addr }, dependentRequired: { name: ["note"] } } } };
    const addrDetail = { type: "Control", scope: "#/properties/addr", options: { detail: { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/street" }, { type: "Control", scope: "#/properties/zip" }] } } };
    const detailed = { type: "Control", scope: "#/properties/user", options: { detail: { type: "VerticalLayout", elements: [
      { type: "Control", scope: "#/properties/name" }, { type: "Control", scope: "#/properties/note" }, addrDetail] } } };
    const walked = { type: "Control", scope: "#/properties/user" };
    for (const elements of [[detailed, walked], [walked, detailed], [detailed, detailed]]) {
      const { output, report } = convert({ schema, uiSchema: { type: "VerticalLayout", elements } });
      assertConstructsCleanly(output, "nested once");
      expect(report.entries.map((e) => [e.code, e.sourcePointer, e.count])).toEqual([
        [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/properties/user/dependentRequired/name", 1],
        [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/properties/user/properties/addr/dependentRequired/street", 1]
      ]);
    }
  });
});

describe("json-schema convert - a uiSchema node shared by oneOf variants", () => {
  const variants = (a: object, b: object) => ({ type: "object", properties: { kind: { type: "string" } }, oneOf: [
    { properties: { kind: { const: "a" }, note: a } }, { properties: { kind: { const: "b" }, note: b } }] });
  const hints = (schema: object, uiSchema: object) => {
    const { output, report } = convert({ schema, uiSchema });
    assertConstructsCleanly(output, "shared node");
    return report.entries.filter((e) => e.code === JsonSchemaCodes.UNSUPPORTED_UI_HINT).map((e) => [e.sourcePointer, e.count]);
  };

  it("reports an option every variant loses once for each variant", () => {
    expect(hints(variants({ type: "string" }, { type: "string" }), { note: { "ui:orderable": false } })).toEqual([["#/uiSchema/note/ui:orderable", 2]]);
  });

  it("makes help the description of every variant's field that has none, and reports it for the one that has", () => {
    const descriptions = (schema: object) => {
      const { output, report } = convert({ schema, uiSchema: { note: { "ui:help": "h" } } });
      const survey = assertConstructsCleanly(output, "shared help");
      return [["note", "note_1"].map((n) => survey.getQuestionByName(n).description),
        report.entries.filter((e) => e.code === JsonSchemaCodes.UNSUPPORTED_UI_HINT).map((e) => [e.sourcePointer, e.count])];
    };
    expect(descriptions(variants({ type: "string" }, { type: "string" }))).toEqual([["h", "h"], []]);
    expect(descriptions(variants({ type: "string" }, { type: "string", description: "d" }))).toEqual([["h", "d"], [["#/uiSchema/note/ui:help", 1]]]);
  });

  it("reports an option only for the variant that cannot apply it", () => {
    const schema = variants({ type: "string" }, { type: "number" });
    expect(hints(schema, { note: { "ui:inputType": "email" } })).toEqual([["#/uiSchema/note/ui:inputType", 1]]);
    expect(findElement(convert({ schema, uiSchema: { note: { "ui:inputType": "email" } } }).output, "note")?.inputType).toBe("email");
  });
});

describe("json-schema convert - a dependency on its own trigger", () => {
  for (const key of ["dependentSchemas", "dependencies"]) {
    it(`does not hide the trigger of ${key} by its own presence, and keeps its requiredIf`, () => {
      const schema = { type: "object", properties: { a: { type: "string" }, b: { type: "string" } },
        [key]: { a: { properties: { a: { minLength: 1 }, b: { type: "string" } }, required: ["a", "b"] } } };
      const { output } = convert(schema);
      expect(findElement(output, "a")?.visibleIf).toBeUndefined();
      expect(findElement(output, "a")?.requiredIf).toBe("{a} notempty");
      const survey = assertConstructsCleanly(output, key);
      for (const [data, shown] of [[{}, false], [{ a: "x" }, true]] as const) {
        survey.data = data;
        expect(survey.getQuestionByName("a").isVisible).toBe(true);
        expect([survey.getQuestionByName("b").isVisible, survey.getQuestionByName("b").isRequired]).toEqual([shown, shown]);
      }
      survey.data = { a: "x", b: "y" };
      survey.doComplete();
      expect(survey.data).toEqual({ a: "x", b: "y" });
    });
  }
});

describe("json-schema convert - a boolean if", () => {
  const properties = { a: { type: "string" }, b: { type: "string" }, c: { type: "string" } };
  const branches = { then: { properties: { b: { type: "string" } }, required: ["b"] }, else: { properties: { c: { type: "string" }, d: { type: "string" } }, required: ["c"] } };
  // [visible, required] of b, c and d for each data set.
  const states = (schema: object) => {
    const { output, report } = convert(schema);
    const survey = assertConstructsCleanly(output, "boolean if");
    return { report: report.entries, states: [{}, { a: "x" }].map((data) => {
      survey.data = data;
      return ["b", "c", "d"].map((name) => {
        const q = survey.getQuestionByName(name);
        return q ? [q.isVisible, q.isRequired] : null;
      });
    }) };
  };

  it("applies else to every value when if is false", () => {
    const always = [[true, false], [true, true], [true, false]];
    expect(states({ type: "object", properties, if: false, ...branches })).toEqual({ report: [], states: [always, always] });
  });

  for (const ifSchema of [true, {}, { title: "Always" }]) {
    it(`applies then to every value when if is ${JSON.stringify(ifSchema)}`, () => {
      const always = [[true, true], [true, false], null];
      expect(states({ type: "object", properties, if: ifSchema, ...branches })).toEqual({ report: [], states: [always, always] });
    });
  }

  it("keeps a field required for every value when a conditional also requires it, in either order", () => {
    const conditional = { if: { properties: { a: { const: "x" } }, required: ["a"] }, then: { required: ["b"] } };
    const always = { if: true, then: { properties: { b: { type: "string" } }, required: ["b"] } };
    for (const allOf of [[conditional, always], [always, conditional]]) {
      const { output } = convert({ type: "object", properties, allOf });
      expect(findElement(output, "b")).toMatchObject({ isRequired: true });
      expect(findElement(output, "b")?.requiredIf).toBeUndefined();
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      const survey = assertConstructsCleanly(output, "required always");
      for (const data of [{}, { a: "x" }, { a: "y" }]) {
        survey.data = data;
        expect([survey.getQuestionByName("b").isVisible, survey.getQuestionByName("b").isRequired]).toEqual([true, true]);
      }
    }
  });

  it("requires an else field under a JSONForms root when if is false", () => {
    const uiSchema = { type: "VerticalLayout", elements: ["a", "b", "c"].map((k) => ({ type: "Control", scope: `#/properties/${k}` })) };
    const survey = loadJsonForms({ type: "object", properties, if: false, ...branches }, uiSchema, { a: "x" });
    expect([survey.getQuestionByName("b").isRequired, survey.getQuestionByName("c").isRequired]).toEqual([false, true]);
  });

  it("reports an else under an anyOf of several entries when if is false", () => {
    const { output, report } = convert({ schema: { type: "object", properties, anyOf: [{ if: false, else: { required: ["c"] } }, { required: ["a"] }] },
      uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/c" }] } });
    expect(assertConstructsCleanly(output, "if false in anyOf").getQuestionByName("c").isRequired).toBe(false);
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/anyOf/0/if"]]);
  });
});

describe("json-schema convert - a presence test on a field whose type allows null", () => {
  const properties = { a: { type: ["string", "null"] }, b: { type: "string" } };
  const required = (schema: object, data: Record<string, unknown>) => {
    const survey = assertConstructsCleanly(convert(schema).output, "nullable");
    survey.data = data;
    return survey.getQuestionByName("b").isRequired;
  };

  it("does not express an if that requires the key, or reads it while empty, and reports it", () => {
    for (const ifSchema of [{ required: ["a"] }, { properties: { a: { const: "x" } } }]) {
      const schema = { type: "object", properties, if: ifSchema, then: { required: ["b"] } };
      expect(convert(schema).report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/if"]]);
      expect(required(schema, { a: null })).toBe(false);
    }
  });

  it("still expresses an if that requires the key and compares its value", () => {
    const schema = { type: "object", properties, if: { properties: { a: { const: "x" } }, required: ["a"] }, then: { required: ["b"] } };
    expect(convert(schema).report.entries).toEqual([]);
    expect([required(schema, { a: null }), required(schema, { a: "x" })]).toEqual([false, true]);
  });

  it("gives a dependency on the key no condition", () => {
    const schema = { type: "object", properties, dependentRequired: { a: ["b"] } };
    expect(findElement(convert(schema).output, "b")?.requiredIf).toBeUndefined();
    expect(required(schema, { a: null })).toBe(false);
  });

  it("does not express failWhenUndefined on the key, and reports it", () => {
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/a" },
      { type: "Control", scope: "#/properties/b", rule: { effect: "SHOW", condition: { scope: "#/properties/a", schema: { not: { const: "x" } }, failWhenUndefined: true } } }] };
    const { output, report } = convert({ schema: { type: "object", properties }, uiSchema });
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_UI_RULE, "#/uiSchema/elements/1/rule"]]);
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    const survey = assertConstructsCleanly(output, "nullable rule");
    survey.data = { a: null };
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
  });
});

describe("json-schema convert - conditionals that require and show one property", () => {
  const A = { properties: { k: { const: "a" } }, required: ["k"] };
  const B = { properties: { j: { const: "b" } }, required: ["j"] };
  const base = { k: { type: "string", enum: ["a", "z"] }, j: { type: "string", enum: ["b", "y"] } };
  const datas = [{}, { k: "a" }, { j: "b" }, { k: "a", j: "b" }, { k: "z", j: "y" }];
  // [visible, required] of x for each data set.
  const states = (schema: object) => {
    const { output, report } = convert(schema);
    const survey = assertConstructsCleanly(output, "require and show");
    return { report: report.entries, states: datas.map((data) => {
      survey.data = data;
      const x = survey.getQuestionByName("x");
      return [x.isVisible, x.isRequired];
    }) };
  };
  // JSON Schema requires x for k = a; a branch shows it for j = b.
  const expected = [[false, false], [true, true], [true, false], [true, true], [false, false]];

  it("shows a field one entry requires and another shows whenever it is required, in either order", () => {
    const requires = { if: A, then: { required: ["x"] } };
    const shows = { if: B, then: { properties: { x: { type: "string" } } } };
    for (const allOf of [[requires, shows], [shows, requires]]) {
      expect(states({ type: "object", properties: base, allOf })).toEqual({ report: [], states: expected });
    }
  });

  it("shows a declared field one entry requires and another shows whenever it is required", () => {
    const schema = { type: "object", properties: { ...base, x: { type: "string" } },
      allOf: [{ if: A, then: { required: ["x"] } }, { if: B, then: { properties: { x: {} } } }] };
    expect(states(schema)).toEqual({ report: [], states: expected });
  });

  it("shows a field then shows and else requires for every value", () => {
    const schema = { type: "object", properties: { ...base, x: { type: "string" } }, if: A, then: { properties: { x: {} } }, else: { required: ["x"] } };
    // JSON Schema requires x unless k = a, where then shows it.
    expect(states(schema)).toEqual({ report: [], states: [[true, true], [true, false], [true, true], [true, false], [true, true]] });
  });

  it("requires a field an if requires and a dependency shows, whichever comes first", () => {
    const schema = { type: "object", properties: base, if: A, then: { required: ["x"] }, dependencies: { j: { properties: { x: { type: "string" } } } } };
    const { output, report } = convert(schema);
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependencies/j"]]);
    const survey = assertConstructsCleanly(output, "if and dependency");
    expect([{}, { k: "a" }, { j: "y" }].map((data) => {
      survey.data = data;
      return [survey.getQuestionByName("x").isVisible, survey.getQuestionByName("x").isRequired];
    })).toEqual([[false, false], [true, true], [true, false]]);
  });

  it("writes a condition two entries give alike once", () => {
    const schema = { type: "object", properties: base, definitions: { D: { if: A, then: { properties: { x: { type: "string" } }, required: ["x"] } } },
      allOf: [{ $ref: "#/definitions/D" }, { $ref: "#/definitions/D" }] };
    expect(findElement(convert(schema).output, "x")).toMatchObject({ visibleIf: "{k} = 'a'", requiredIf: "{k} = 'a'" });
  });

  it("shows a property two branches give with different annotations under either", () => {
    const schema = { type: "object", properties: base,
      allOf: [{ if: A, then: { properties: { x: { type: "string", title: "X" } } } }, { if: B, then: { properties: { x: { type: "string", title: "Other" } } } }] };
    const { output, report } = convert(schema);
    expect(report.entries).toEqual([]);
    expect(findElement(output, "x")).toMatchObject({ title: "X", visibleIf: "({k} = 'a') or ({j} = 'b')" });
  });
});

describe("json-schema convert - conditionals of a property several allOf entries declare", () => {
  const ab = { k: { enum: ["a", "b"] } };
  const A = { properties: { k: { const: "a" } }, required: ["k"] };
  const B = { properties: { k: { const: "b" } }, required: ["k"] };
  // [visible, required] of each question, for each data set.
  const states = (schema: object, names: string[], datas: object[]) => {
    const { output, report } = convert(schema);
    const survey = assertConstructsCleanly(output, "property conditionals");
    return { report: report.entries.map((e) => [e.code, e.sourcePointer]), states: datas.map((data) => {
      survey.data = data;
      return names.map((name) => [survey.getQuestionByName(name).isVisible, survey.getQuestionByName(name).isRequired]);
    }) };
  };

  it("applies the if/then of each declaration", () => {
    const schema = { type: "object", allOf: [
      { properties: { o: { type: "object", properties: ab, if: A, then: { properties: { x: { type: "string" } }, required: ["x"] } } } },
      { properties: { o: { type: "object", if: B, then: { properties: { y: { type: "string" } }, required: ["y"] } } } }] };
    expect(states(schema, ["x", "y"], [{ k: "a" }, { k: "b" }])).toEqual({ report: [], states: [[[true, true], [false, false]], [[false, false], [true, true]]] });
  });

  it("applies the dependencies of each declaration, and reports each at its own pointer", () => {
    const schema = { type: "object", allOf: [
      { properties: { o: { type: "object", properties: { k: { type: "string" }, x: { type: "string" } }, dependentRequired: { k: ["x"] } } } },
      { properties: { o: { type: "object", dependentRequired: { x: ["k"] } } } }] };
    expect(states(schema, ["k", "x"], [{}, { k: "1" }, { x: "1" }])).toEqual({
      report: [[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/allOf/0/properties/o/dependentRequired/k"], [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/allOf/1/properties/o/dependentRequired/x"]],
      states: [[[true, false], [true, false]], [[true, false], [true, true]], [[true, true], [true, false]]]
    });
  });

  it("applies the parent's if and an entry's if on one property", () => {
    const schema = { type: "object", properties: { o: { type: "object", properties: { ...ab, z: { type: "string" } }, if: A, then: { required: ["z"] } } },
      allOf: [{ properties: { o: { if: B, then: { properties: { y: { type: "string" } } } } } }] };
    expect(states(schema, ["z", "y"], [{ k: "a" }, { k: "b" }])).toEqual({ report: [], states: [[[true, true], [false, false]], [[true, false], [true, false]]] });
  });

  for (const [what, first, second] of [["a $ref first", "ref", "cond"], ["a $ref second", "cond", "ref"]] as const) {
    it(`follows a declaration that is a $ref, with ${what}`, () => {
      const decl = { ref: { $ref: "#/definitions/D" }, cond: { if: A, then: { required: ["x"] } } };
      const schema = { type: "object", definitions: { D: { type: "object", properties: { ...ab, x: { type: "string" } } } },
        allOf: [{ properties: { o: decl[first] } }, { properties: { o: decl[second] } }] };
      expect(states(schema, ["x"], [{ k: "a" }, { k: "b" }])).toEqual({ report: [], states: [[[true, true]], [[true, false]]] });
    });
  }

  it("does not report a type written as a one-item list against the same type", () => {
    const { output, report } = convert({ type: "object", properties: { n: { type: ["string"], allOf: [{ type: "string" }] } } });
    assertConstructsCleanly(output, "type list");
    expect(report.entries).toEqual([]);
  });
});

describe("json-schema convert - free keys beside properties", () => {
  const props = { a: { type: "string" } };
  const pointers = (input: unknown) => {
    const { output, report } = convert(input);
    assertConstructsCleanly(output, "free keys");
    return report.entries.map((e) => [e.code, e.sourcePointer]);
  };

  it("reports additionalProperties and patternProperties at their pointer", () => {
    expect(pointers({ type: "object", properties: { o: { type: "object", properties: props, additionalProperties: { type: "string" }, patternProperties: { "^x": {} } } } })).toEqual([
      [JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/properties/o/additionalProperties"],
      [JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/properties/o/patternProperties"]
    ]);
  });

  it("does not report additionalProperties false, which allows no other key", () => {
    expect(pointers({ type: "object", properties: props, additionalProperties: false })).toEqual([]);
  });

  it("reports them at the allOf entry that sets them, and at a JSONForms root", () => {
    expect(pointers({ type: "object", properties: props, allOf: [{ additionalProperties: true }] }))
      .toEqual([[JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/allOf/0/additionalProperties"]]);
    expect(pointers({ schema: { type: "object", properties: props, additionalProperties: true },
      uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/a" }] } }))
      .toEqual([[JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/additionalProperties"]]);
  });

  it("reports them once for an object a detail layout and a data walk both read", () => {
    const schema = { type: "object", properties: { o: { type: "object", properties: props, additionalProperties: true } } };
    const detailed = { type: "Control", scope: "#/properties/o", options: { detail: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/a" }] } } };
    const walked = { type: "Control", scope: "#/properties/o" };
    for (const elements of [[detailed, walked], [walked, detailed]]) {
      const { report } = convert({ schema, uiSchema: { type: "VerticalLayout", elements } });
      expect(report.entries.map((e) => [e.code, e.sourcePointer, e.count])).toEqual([[JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/properties/o/additionalProperties", 1]]);
    }
  });
});

describe("json-schema convert - a $ref that names nothing", () => {
  for (const [what, ref, definitions] of [["a pointer to nothing", "#/definitions/missing", {}], ["a cycle", "#/definitions/a", { a: { $ref: "#/definitions/b" }, b: { $ref: "#/definitions/a" } }]] as const) {
    it(`reports ${what} as an unresolved reference, and gives a text question`, () => {
      const { output, report } = convert({ type: "object", definitions, properties: { p: { $ref: ref } } });
      assertConstructsCleanly(output, what);
      expect(report.entries.map((e) => [e.code, e.bucket, e.sourcePointer])).toEqual([[JsonSchemaCodes.UNRESOLVED_REF, "unsupported", "#/properties/p"]]);
      expect(findElement(output, "p")?.type).toBe("text");
    });
  }
});

describe("json-schema convert - a ListWithDetail on a scalar", () => {
  it("gives no element, as no JSONForms renderer lists a scalar, and reports it", () => {
    const schema = { type: "object", properties: { s: { type: "string" }, b: { type: "string" } } };
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "ListWithDetail", scope: "#/properties/s" }, { type: "Control", scope: "#/properties/b" }] };
    const { output, report } = convert({ schema, uiSchema });
    expect(assertConstructsCleanly(output, "scalar list").getAllQuestions().map((q) => q.name)).toEqual(["b"]);
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.UNSUPPORTED_UI_HINT, "#/uiSchema/elements/0/type"]]);
  });
});

describe("json-schema convert - a presence test on an object", () => {
  const properties = { o: { type: "object", properties: { z: { type: "string" } } }, x: { type: "string" } };
  const required = (schema: object, data: Record<string, unknown>) => {
    const survey = assertConstructsCleanly(convert(schema).output, "object trigger");
    survey.data = data;
    return survey.getQuestionByName("x").isRequired;
  };

  it("gives a dependency on an object no condition, as a panel holds no value", () => {
    const schema = { type: "object", properties, dependentRequired: { o: ["x"] } };
    expect(findElement(convert(schema).output, "x")?.requiredIf).toBeUndefined();
    expect(convert(schema).report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentRequired/o"]]);
    expect(required(schema, { z: "filled" })).toBe(false);
  });

  it("does not express an if that requires an object, and reports it", () => {
    const schema = { type: "object", properties, if: { required: ["o"] }, then: { required: ["x"] } };
    expect(convert(schema).report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/if"]]);
    expect(findElement(convert(schema).output, "x")?.requiredIf).toBeUndefined();
  });
});

describe("json-schema convert - an if that gives one branch for every object", () => {
  const properties = { a: { type: "string" }, b: { type: "string" }, c: { type: "string" } };
  const branches = { then: { required: ["b"] }, else: { required: ["c"] } };
  const required = (ifSchema: unknown) => {
    const { output, report } = convert({ type: "object", properties, if: ifSchema, ...branches });
    const survey = assertConstructsCleanly(output, "constant if");
    survey.data = { a: "x" };
    return { report: report.entries, required: [survey.getQuestionByName("b").isRequired, survey.getQuestionByName("c").isRequired] };
  };

  for (const ifSchema of [{ properties: {} }, { required: [] }, { properties: { a: true } }, { properties: { a: {} } }, { not: false }]) {
    it(`takes then for ${JSON.stringify(ifSchema)}`, () => {
      expect(required(ifSchema)).toEqual({ report: [], required: [true, false] });
    });
  }

  for (const ifSchema of [{ not: {} }, { not: true }, { type: "string" }, { properties: { a: { const: "x" } }, type: "string" }]) {
    it(`takes else for ${JSON.stringify(ifSchema)}`, () => {
      expect(required(ifSchema)).toEqual({ report: [], required: [false, true] });
    });
  }
});

describe("json-schema convert - a Control on the whole form", () => {
  it("reports the root's entries at the root's pointer for scope #/", () => {
    const { output, report } = convert({ schema: { type: "object", properties: { a: { type: "string" } }, additionalProperties: true }, uiSchema: { type: "Control", scope: "#/" } });
    assertConstructsCleanly(output, "root scope");
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/additionalProperties"]]);
  });
});

describe("json-schema convert - a JSONForms Control on a property several allOf entries declare", () => {
  const o = (more: object) => ({ properties: { o: more } });
  const schema = { type: "object", allOf: [
    o({ type: "object", properties: { k: { type: "string", enum: ["a", "b", "c"] }, x: { type: "string" }, y: { type: "string" }, z: { type: "string" } },
      if: { properties: { k: { const: "a" } }, required: ["k"] }, then: { required: ["x"] } }),
    o({ if: { properties: { k: { const: "b" } }, required: ["k"] }, then: { required: ["y"] }, dependentRequired: { x: ["z"] } })
  ] };
  const detail = { type: "VerticalLayout", elements: ["k", "x", "y", "z"].map((p) => ({ type: "Control", scope: `#/properties/${p}` })) };
  const uis: [string, object][] = [
    ["a data walk", { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/o" }] }],
    ["a detail layout", { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/o", options: { detail } }] }]
  ];
  // Whether x, y and z are required, as AJV reads every entry: x when k = a, y when k = b, z when x is there.
  const datas: [object, boolean[]][] = [[{ k: "a" }, [true, false, false]], [{ k: "b" }, [false, true, false]], [{ k: "c", x: "1" }, [false, false, true]], [{}, [false, false, false]]];

  for (const [what, uiSchema] of uis) {
    it(`applies the conditionals of every declaration through ${what}`, () => {
      const { report } = convert({ schema, uiSchema });
      expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/allOf/1/properties/o/dependentRequired/x"]]);
      for (const [data, required] of datas) {
        const survey = loadJsonForms(schema, uiSchema, data as Record<string, unknown>);
        expect(["x", "y", "z"].map((name) => survey.getQuestionByName(name).isRequired), JSON.stringify(data)).toEqual(required);
      }
    });
  }
});

describe("json-schema convert - a required key no schema declares", () => {
  const properties = { a: { type: "string" }, b: { type: "string" } };
  const read = (input: unknown) => {
    const { output, report } = convert(input);
    const survey = assertConstructsCleanly(output, "undeclared key");
    return { names: survey.getAllQuestions().map((q) => q.name), report: report.entries.map((e) => [e.code, e.sourcePointer]) };
  };

  it("reports a then or else that requires it, and makes no question", () => {
    expect(read({ type: "object", properties, if: { properties: { a: { const: "x" } } }, then: { required: ["b", "x"] }, else: { required: ["y"] } })).toEqual({
      names: ["a", "b"],
      report: [[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/else/required/0"], [JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/required/1"]]
    });
  });

  it("reports a dependency that requires it, at the key's place in the list", () => {
    expect(read({ type: "object", properties, dependentRequired: { a: ["b", "x"] }, dependentSchemas: { b: { required: ["y"] } } })).toEqual({
      names: ["a", "b"],
      report: [
        [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentRequired/a"],
        [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentRequired/a/1"],
        [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentSchemas/b"],
        [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentSchemas/b/required/0"]
      ]
    });
  });

  it("does not report a key another branch declares, or one a JSONForms UI schema has no Control for", () => {
    expect(read({ type: "object", properties, if: { properties: { a: { const: "x" } } }, then: { properties: { c: { type: "string" } } }, else: { required: ["c"] } }).report).toEqual([]);
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/a" }] };
    expect(read({ schema: { type: "object", properties, if: { properties: { a: { const: "x" } } }, then: { required: ["b"] } }, uiSchema }).report).toEqual([]);
    expect(read({ schema: { type: "object", properties, if: { properties: { a: { const: "x" } } }, then: { required: ["x"] } }, uiSchema }).report)
      .toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/required/0"]]);
  });
});

describe("json-schema convert - a ListWithDetail on a remote $ref", () => {
  it("is mapped as a Control on it is, and the reference reported", () => {
    const { output, report } = convert({ schema: { type: "object", properties: { p: { $ref: "https://remote.example/p" } } },
      uiSchema: { type: "VerticalLayout", elements: [{ type: "ListWithDetail", scope: "#/properties/p" }] } });
    assertConstructsCleanly(output, "remote list");
    expect(findElement(output, "p")?.type).toBe("text");
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.DROPPED_REMOTE_REF, "#/properties/p"], [JsonSchemaCodes.DROPPED_STYLING, "#/uiSchema/elements/0/type"]]);
  });
});

describe("json-schema convert - a condition on a key a branch shows", () => {
  const base = { k: { type: "string", enum: ["a", "b"] }, j: { type: "string", enum: ["a", "b"] } };
  const showsX = { if: { properties: { j: { const: "a" } }, required: ["j"] }, then: { properties: { x: { type: "string", enum: ["p", "q"] } } } };
  // [visible, required] of each question for each data set.
  const states = (schema: object, names: string[], datas: object[]) => {
    const { output, report } = convert(schema);
    const survey = assertConstructsCleanly(output, "condition on a shown key");
    return { report: report.entries.map((e) => [e.code, e.sourcePointer]), states: datas.map((data) => {
      survey.data = data;
      return names.map((name) => [survey.getQuestionByName(name).isVisible, survey.getQuestionByName(name).isRequired]);
    }) };
  };

  it("requires a dependency's key when the trigger a branch shows is there", () => {
    const schema = { type: "object", properties: base, ...showsX, dependentRequired: { x: ["k"] } };
    expect(states(schema, ["k"], [{ j: "a" }, { j: "a", x: "p" }])).toEqual({ report: [[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentRequired/x"]], states: [[[true, false]], [[true, true]]] });
  });

  it("shows a schema dependency's property when the trigger a branch shows is there", () => {
    const schema = { type: "object", properties: base, ...showsX, dependencies: { x: { properties: { y: { type: "string" } }, required: ["y"] } } };
    expect(states(schema, ["y"], [{ j: "a" }, { j: "a", x: "p" }])).toEqual({ report: [[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependencies/x"]], states: [[[false, false]], [[true, true]]] });
  });

  it("reads an if on a key another entry's branch shows, in either order", () => {
    const reads = { if: { properties: { x: { const: "p" } }, required: ["x"] }, then: { required: ["k"] } };
    for (const allOf of [[showsX, reads], [reads, showsX]]) {
      expect(states({ type: "object", properties: base, allOf }, ["k"], [{ j: "a", x: "q" }, { j: "a", x: "p" }])).toEqual({ report: [], states: [[[true, false]], [[true, true]]] });
    }
  });
});

describe("json-schema convert - a required key only a branch shows", () => {
  const base = { k: { type: "string", enum: ["a", "b"] } };
  const showsX = { if: { properties: { k: { const: "a" } }, required: ["k"] }, then: { properties: { x: { type: "string" } } } };
  const x = (schema: object) => {
    const { output, report } = convert(schema);
    const survey = assertConstructsCleanly(output, "required and shown");
    return { report: report.entries, states: [{}, { k: "a" }, { k: "b" }].map((data) => {
      survey.data = data;
      return [survey.getQuestionByName("x").isVisible, survey.getQuestionByName("x").isRequired];
    }) };
  };
  const always = { report: [], states: [[true, true], [true, true], [true, true]] };

  it("shows and requires it always, for the object's required", () => {
    expect(x({ type: "object", properties: base, required: ["x"], ...showsX })).toEqual(always);
  });

  it("shows and requires it always, for an allOf entry's required", () => {
    expect(x({ type: "object", properties: base, allOf: [{ required: ["x"] }, showsX] })).toEqual(always);
  });

  it("shows a declared required key a branch also shows always", () => {
    expect(x({ type: "object", properties: { ...base, x: { type: "string" } }, required: ["x"], ...showsX })).toEqual(always);
  });

  it("reports a required key no schema declares, at the object or the allOf entry", () => {
    const { output, report } = convert({ type: "object", properties: base, required: ["x"], allOf: [{ required: ["y"] }] });
    assertConstructsCleanly(output, "required undeclared");
    expect(findElement(output, "x")).toBeUndefined();
    expect(report.entries.map((e) => [e.code, e.bucket, e.sourcePointer])).toEqual([
      [JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "unsupported", "#/allOf/0/required/0"],
      [JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "unsupported", "#/required/0"]
    ]);
  });

  const own = { x: { type: "string" } };
  const readsY = { required: ["y"] };
  for (const [what, schema] of [
    ["an if that reads it shows only in an allOf entry of its then",
      { type: "object", properties: own, required: ["y"], if: readsY, then: { allOf: [{ properties: { y: { type: "string" } } }] } }],
    ["an if that reads it shows only in a nested if's then",
      { type: "object", properties: own, required: ["y"], if: readsY, then: { if: { required: ["x"] }, then: { properties: { y: { type: "string" } } } } }],
    ["its own dependency shows only in an allOf entry",
      { type: "object", properties: own, required: ["y"], dependencies: { y: { allOf: [{ properties: { y: { type: "string" } } }] } } }],
    ["its own dependency shows only in an anyOf entry",
      { type: "object", properties: own, required: ["y"], dependentSchemas: { y: { anyOf: [{ properties: { y: { type: "string" } } }] } } }]
  ] as [string, object][]) {
    it(`reports a required key that ${what}, and makes no question`, () => {
      const { output, report } = convert(schema);
      const survey = assertConstructsCleanly(output, "required key a branch cannot show");
      expect(survey.getQuestionByName("y")).toBeFalsy();
      expect(survey.getQuestionByName("x")).toBeTruthy();
      expect(report.entries.filter((e) => e.code === JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT).map((e) => e.sourcePointer)).toEqual(["#/required/0"]);
    });
  }

  it("shows a key then shows and else shows too always", () => {
    const schema = { type: "object", properties: base, if: { properties: { k: { const: "a" } }, required: ["k"] },
      then: { properties: { x: { type: "string" } } }, else: { properties: { x: { type: "string" } } } };
    expect(findElement(convert(schema).output, "x")?.visibleIf).toBeUndefined();
    expect(x(schema).states.map(([visible]) => visible)).toEqual([true, true, true]);
  });
});

describe("json-schema convert - JSONForms and every allOf entry's required", () => {
  const properties = { k: { type: "string", enum: ["a", "b"] }, x: { type: "string" }, y: { type: "string" } };
  const ui = (keys: string[]) => ({ type: "VerticalLayout", elements: keys.map((p) => ({ type: "Control", scope: `#/properties/${p}` })) });

  it("requires a Control's key an allOf entry requires", () => {
    const schema = { type: "object", properties, allOf: [{ required: ["x"] }] };
    const survey = loadJsonForms(schema, ui(["k", "x", "y"]));
    expect([survey.getQuestionByName("x").isRequired, survey.getQuestionByName("y").isRequired]).toEqual([true, false]);
  });

  it("reports a key an allOf entry requires that no schema declares", () => {
    const { report } = convert({ schema: { type: "object", properties, allOf: [{ required: ["z"] }] }, uiSchema: ui(["k"]) });
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/allOf/0/required/0"]]);
  });

  const o = (more: object) => ({ properties: { o: more } });
  const kx = { k: { type: "string", enum: ["a", "b"] }, x: { type: "string" } };
  const cond = { if: { properties: { k: { const: "a" } }, required: ["k"] }, then: { required: ["x"] } };
  const xAt = (schema: object, uiSchema: object, data: Record<string, unknown>) => loadJsonForms(schema, uiSchema, data).getQuestionByName("x").isRequired;
  const control = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/o" }] };

  // AJV: x is required once the optional o holds a value.
  it("requires a key another declaration of the object requires", () => {
    const schema = { type: "object", allOf: [o({ type: "object", properties: kx }), o({ required: ["x"] })] };
    expect([xAt(schema, control, { k: "b" }), xAt(schema, control, {})]).toEqual([true, false]);
  });

  it("applies the conditionals of a declaration that is a $ref, either first or second", () => {
    for (const [first, second] of [[{ $ref: "#/definitions/D" }, cond], [{ type: "object", properties: kx }, { $ref: "#/definitions/C" }]]) {
      const schema = { type: "object", definitions: { D: { type: "object", properties: kx }, C: cond }, allOf: [o(first), o(second)] };
      expect(convert({ schema, uiSchema: control }).report.entries).toEqual([]);
      expect([xAt(schema, control, { k: "a" }), xAt(schema, control, { k: "b" })]).toEqual([true, false]);
    }
  });

  it("applies the conditionals one level down: a nested property, and array items", () => {
    const deeper = { type: "object", allOf: [o({ type: "object", properties: { p: { type: "object", properties: kx } } }), o({ properties: { p: cond } })] };
    expect([xAt(deeper, control, { k: "a" }), xAt(deeper, control, { k: "b" })]).toEqual([true, false]);
    const rows = { type: "object", allOf: [{ properties: { rows: { type: "array", items: { type: "object", properties: kx } } } }, { properties: { rows: { items: cond } } }] };
    const detail = { type: "VerticalLayout", elements: ["k", "x"].map((p) => ({ type: "Control", scope: `#/properties/${p}` })) };
    for (const options of [undefined, { detail }]) {
      const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/rows", ...(options ? { options } : {}) }] };
      expect(convert({ schema: rows, uiSchema }).report.entries).toEqual([]);
      const panels = (loadJsonForms(rows, uiSchema, { rows: [{ k: "a" }, { k: "b" }] }).getQuestionByName("rows") as any).panels;
      expect(panels.map((p: any) => p.getQuestionByName("x").isRequired)).toEqual([true, false]);
    }
  });
});

describe("json-schema convert - a boolean declaration of a property", () => {
  const age = (schema: object, data: Record<string, unknown>) => {
    const { output, report } = convert(schema);
    const survey = assertConstructsCleanly(output, "boolean declaration");
    survey.data = data;
    const q = survey.getQuestionByName("age");
    return { report: report.entries, inputType: q.inputType, required: q.isRequired, errors: q.hasErrors() };
  };

  it("takes the other declaration as it is beside true, with additionalProperties false", () => {
    const schema = { type: "object", additionalProperties: false, properties: { age: true, mail: true },
      allOf: [{ properties: { age: { type: "integer", minimum: 18 }, mail: { type: "string", format: "email" } }, required: ["age"] }] };
    expect(age(schema, { age: 17 })).toEqual({ report: [], inputType: "number", required: true, errors: true });
    expect(age(schema, { age: 18 }).errors).toBe(false);
    expect(findElement(convert(schema).output, "mail")?.inputType).toBe("email");
  });

  it("keeps a declaration that another declares true, in either place", () => {
    const constrained = { type: "integer", minimum: 18 };
    for (const schema of [{ type: "object", properties: { age: constrained }, allOf: [{ properties: { age: true } }] },
      { type: "object", allOf: [{ properties: { age: true } }, { properties: { age: constrained } }] }]) {
      expect(age(schema, { age: 17 })).toMatchObject({ report: [], inputType: "number", errors: true });
    }
  });

  it("makes no question for a property one declaration makes false, and reports the dropped one", () => {
    const { output, report } = convert({ type: "object", properties: { a: { type: "string" }, x: { type: "string" } }, allOf: [{ properties: { x: false } }] });
    expect(assertConstructsCleanly(output, "false declaration").getAllQuestions().map((q) => q.name)).toEqual(["a"]);
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/allOf/0/properties/x"]]);
  });

  it("makes no question for a false property, and reports a key that requires it", () => {
    const { output, report } = convert({ type: "object", properties: { a: { type: "string" }, x: false }, required: ["x"] });
    expect(assertConstructsCleanly(output, "false property").getAllQuestions().map((q) => q.name)).toEqual(["a"]);
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/required/0"]]);
  });

  it("merges another declaration's constraint under a JSONForms Control on the object", () => {
    const schema = { type: "object", properties: { o: { type: "object", properties: { age: true } } },
      allOf: [{ properties: { o: { properties: { age: { type: "integer", minimum: 18 } } } } }] };
    const uiSchema = { type: "Control", scope: "#/properties/o" };
    expect(convert({ schema, uiSchema }).report.entries).toEqual([]);
    const q = loadJsonForms(schema, uiSchema, { age: 17 }).getQuestionByName("age");
    expect([q.inputType, q.hasErrors()]).toEqual(["number", true]);
  });
});

describe("json-schema convert - a required key whose only declaration makes no question", () => {
  const base = { k: { type: "string", enum: ["a", "b"] } };
  const pointers = (schema: object) => {
    const { output, report } = convert(schema);
    assertConstructsCleanly(output, "never declared");
    expect(findElement(output, "y")).toBeUndefined();
    return report.entries.map((e) => [e.code, e.sourcePointer]);
  };

  it("reports the key where its own dependency declares it", () => {
    expect(pointers({ type: "object", properties: base, required: ["y"], dependencies: { y: { properties: { y: { type: "string" } } } } }))
      .toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependencies/y"], [JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/required/0"]]);
  });

  it("reports the key where a branch of an if that reads it declares it", () => {
    expect(pointers({ type: "object", properties: base, required: ["y"], if: { required: ["y"] }, then: { properties: { y: { type: "string" } } } }))
      .toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/if"], [JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/required/0"]]);
    expect(pointers({ type: "object", properties: base, if: { properties: { k: { const: "a" } }, required: ["k"] }, then: { required: ["y"] },
      allOf: [{ if: { required: ["y"] }, then: { properties: { y: { type: "string" } } } }] }))
      .toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/allOf/0/if"], [JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/required/0"]]);
  });
});

describe("json-schema convert - a property a branch declares false", () => {
  const k = { type: "string", enum: ["a", "b"] };
  const kIsA = { properties: { k: { const: "a" } }, required: ["k"] };
  const pointers = (schema: object) => convert(schema).report.entries.map((e) => [e.code, e.sourcePointer]);
  // Whether x is visible with `data`, and the data the survey completes with.
  const run = (schema: object, data: Record<string, unknown>) => {
    const survey = assertConstructsCleanly(convert(schema).output, "branch false");
    survey.data = data;
    const visible = survey.getQuestionByName("x").isVisible;
    survey.doComplete();
    return [visible, survey.data];
  };

  // AJV: x may not be there while the branch holds, and may otherwise.
  it("hides the property while a then holds, and completes without it", () => {
    const schema = { type: "object", properties: { k, x: { type: "string" } }, if: kIsA, then: { properties: { x: false } } };
    expect(pointers(schema)).toEqual([]);
    expect(run(schema, { k: "a", x: "1" })).toEqual([false, { k: "a" }]);
    expect(run(schema, { k: "b", x: "1" })).toEqual([true, { k: "b", x: "1" }]);
    expect(run(schema, { x: "1" })).toEqual([true, { x: "1" }]);
  });

  it("hides the property while an else holds", () => {
    const schema = { type: "object", properties: { k, x: { type: "string" } }, if: kIsA, else: { properties: { x: false } } };
    expect(pointers(schema)).toEqual([]);
    expect(run(schema, { k: "a", x: "1" })).toEqual([true, { k: "a", x: "1" }]);
    expect(run(schema, { k: "b", x: "1" })).toEqual([false, { k: "b" }]);
    expect(run(schema, { x: "1" })).toEqual([false, {}]);
  });

  it("hides the property while a schema dependency's trigger is there", () => {
    for (const keyword of ["dependentSchemas", "dependencies"]) {
      const schema = { type: "object", properties: { k, x: { type: "string" } }, [keyword]: { k: { properties: { x: false } } } };
      expect(pointers(schema)).toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, `#/${keyword}/k`]]);
      expect(run(schema, { k: "b", x: "1" })).toEqual([false, { k: "b" }]);
      expect(run(schema, { x: "1" })).toEqual([true, { x: "1" }]);
    }
  });

  it("hides the property while an allOf entry's then holds", () => {
    const schema = { type: "object", properties: { k, x: { type: "string" } }, allOf: [{ if: kIsA, then: { properties: { x: false } } }] };
    expect(pointers(schema)).toEqual([]);
    expect(run(schema, { k: "a", x: "1" })).toEqual([false, { k: "a" }]);
    expect(run(schema, { k: "b", x: "1" })).toEqual([true, { k: "b", x: "1" }]);
  });

  it("shows a property one branch shows only while another does not forbid it", () => {
    const schema = { type: "object", properties: { k, j: k }, if: kIsA, then: { properties: { x: { type: "string" } } },
      allOf: [{ if: { properties: { j: { const: "a" } }, required: ["j"] }, then: { properties: { x: false } } }] };
    expect(pointers(schema)).toEqual([]);
    expect(run(schema, { k: "a", x: "1" })).toEqual([true, { k: "a", x: "1" }]);
    expect(run(schema, { k: "a", j: "a", x: "1" })).toEqual([false, { k: "a", j: "a" }]);
    expect(run(schema, { k: "b", j: "b", x: "1" })).toEqual([false, { k: "b", j: "b" }]);
  });

  it("reports a key one branch both requires and forbids", () => {
    const schema = { type: "object", properties: { k, x: { type: "string" } }, if: kIsA, then: { properties: { x: false }, required: ["x"] } };
    expect(pointers(schema)).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/properties/x"]]);
    expect(run(schema, { k: "a", x: "1" })[0]).toBe(false);
  });

  it("reports a key the branch's own condition reads, which would hide on its own value", () => {
    const schema = { type: "object", properties: { k, x: { type: "string" } }, if: { required: ["x"] }, then: { properties: { x: false } } };
    expect(pointers(schema)).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/properties/x"]]);
    expect(findElement(convert(schema).output, "x")?.visibleIf).toBeUndefined();
  });

  it("reports the property under JSONForms, which shows a Control while the branch forbids its value", () => {
    const schema = { type: "object", properties: { k, x: { type: "string" } }, if: kIsA, then: { properties: { x: false } } };
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/k" }, { type: "Control", scope: "#/properties/x" }] };
    const { output, report } = convert({ schema, uiSchema });
    expect(findElement(output, "x")?.visibleIf).toBeUndefined();
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/properties/x"]]);
  });
});

describe("json-schema convert - a false declaration and a branch that declares the key", () => {
  const k = { type: "string", enum: ["a", "b"] };
  const kIsA = { properties: { k: { const: "a" } }, required: ["k"] };
  const questions = (schema: object) => {
    const { output, report } = convert(schema);
    const survey = assertConstructsCleanly(output, "false and a branch");
    survey.data = { k: "a" };
    return [survey.getAllQuestions().map((q) => q.name), report.entries.map((e) => [e.code, e.sourcePointer])];
  };

  it("makes no question for a key the object declares false, and reports the branch's declaration", () => {
    expect(questions({ type: "object", properties: { k, x: false }, if: kIsA, then: { properties: { x: { type: "string" } } } }))
      .toEqual([["k"], [[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/properties/x"]]]);
    expect(questions({ type: "object", properties: { k, x: false }, dependentSchemas: { k: { properties: { x: { type: "string" } } } } }))
      .toEqual([["k"], [[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentSchemas/k"], [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentSchemas/k/properties/x"]]]);
  });

  it("makes no question for a key an allOf entry declares false, and reports both dropped declarations", () => {
    expect(questions({ type: "object", properties: { k, x: { type: "string" } }, allOf: [{ properties: { x: false } }], if: kIsA, then: { properties: { x: { type: "string" } } } }))
      .toEqual([["k"], [[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/allOf/0/properties/x"], [JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/properties/x"]]]);
  });

  it("makes no question for a key a branch that applies always declares false", () => {
    expect(questions({ type: "object", properties: { k, x: { type: "string" } }, if: true, then: { properties: { x: false } } }))
      .toEqual([["k"], [[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/properties/x"]]]);
  });
});

describe("json-schema convert - a JSONForms Control on a property another declaration makes false or conflicts with", () => {
  const ui = (...scopes: string[]) => ({ type: "VerticalLayout", elements: scopes.map((scope) => ({ type: "Control", scope })) });
  const result = (schema: object, uiSchema: object) => {
    const { output, report } = convert({ schema, uiSchema });
    return [assertConstructsCleanly(output, "jsonforms false").getAllQuestions().map((q) => q.name), report.entries.map((e) => [e.code, e.sourcePointer, e.count])];
  };

  it("makes no question for a Control on a property an allOf entry declares false, and reports the entry", () => {
    const schema = { type: "object", properties: { a: { type: "string" }, x: { type: "string" } }, allOf: [{ properties: { x: false } }] };
    expect(result(schema, ui("#/properties/a", "#/properties/x"))).toEqual([["a"], [[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/allOf/0/properties/x", 1]]]);
  });

  it("makes no question for a nested scope on such a property, and reports the entry once", () => {
    const schema = { type: "object", properties: { o: { type: "object", properties: { a: { type: "string" }, x: { type: "string" } } } },
      allOf: [{ properties: { o: { properties: { x: false } } } }] };
    expect(result(schema, ui("#/properties/o/properties/a", "#/properties/o/properties/x"))).toEqual([["a"], [
      [JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/allOf/0/properties/o/properties/x", 1], [JsonSchemaCodes.ASSUMED_NESTED_SCOPE, "#/uiSchema/elements/0/scope", 1]]]);
    expect(result(schema, ui("#/properties/o", "#/properties/o/properties/x"))).toEqual([["a"], [[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/allOf/0/properties/o/properties/x", 1]]]);
  });

  it("reports a declaration whose type conflicts with the one a Control maps", () => {
    const schema = { type: "object", properties: { o: { type: "object", properties: { age: true } } }, allOf: [{ properties: { o: { type: "string" } } }] };
    expect(result(schema, ui("#/properties/o"))).toEqual([["age"], [[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/allOf/0/properties/o", 1]]]);
  });
});

describe("json-schema convert - a JSONForms Control on a property whose key holds / or ~", () => {
  const ui = (...scopes: string[]) => ({ type: "VerticalLayout", elements: scopes.map((scope) => ({ type: "Control", scope })) });
  const result = (schema: object, uiSchema: object) => {
    const { output, report } = convert({ schema, uiSchema });
    return [assertConstructsCleanly(output, "escaped key").getAllQuestions().map((q) => q.name), report.entries.map((e) => [e.code, e.sourcePointer, e.count])];
  };

  for (const key of ["x/y", "x~y"]) {
    const escaped = key.replace(/~/g, "~0").replace(/\//g, "~1");
    const scope = `#/properties/${escaped}`;

    it(`makes no question for a Control on ${key}, which an allOf entry declares false, and reports the entry`, () => {
      const schema = { type: "object", properties: { a: { type: "string" }, [key]: { type: "string" } }, allOf: [{ properties: { [key]: false } }] };
      expect(result(schema, ui("#/properties/a", scope))).toEqual([["a"], [[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, `#/allOf/0/properties/${escaped}`, 1]]]);
    });

    it(`reports a declaration of ${key} whose type conflicts with the one a Control maps`, () => {
      const schema = { type: "object", properties: { [key]: { type: "string" } }, allOf: [{ properties: { [key]: { type: "number" } } }] };
      const [names, entries] = result(schema, ui(scope));
      expect(names).toEqual([key]);
      expect(entries).toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, `#/allOf/0/properties/${escaped}`, 1]]);
      // The data walk reports the same declaration.
      expect(convert(schema).report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, `#/allOf/0/properties/${escaped}`]]);
    });
  }
});

describe("json-schema convert - a branch given as a $ref, an allOf, a nested if or a not", () => {
  const k = { type: "string", enum: ["a", "b"] };
  const kIsA = { properties: { k: { const: "a" } }, required: ["k"] };
  const jIsA = { properties: { j: { const: "a" } }, required: ["j"] };
  const y = { type: "string" };
  const pointers = (input: object) => convert(input).report.entries.map((e) => [e.code, e.sourcePointer]);
  // Whether `name` is visible and has a required error with `data`, and the data the survey completes with.
  const run = (input: object, data: Record<string, unknown>, name: string) => {
    const survey = assertConstructsCleanly(convert(input).output, "branch shape");
    survey.data = data;
    const q = survey.getQuestionByName(name);
    const state = [q?.isVisible ?? false, q ? q.isVisible && q.hasErrors(false) : false];
    survey.doComplete();
    return [...state, survey.data];
  };

  // AJV: y is required while k is "a", and is not otherwise.
  const requiresY: [string, object][] = [
    ["then $ref", { type: "object", properties: { k }, if: kIsA, then: { $ref: "#/$defs/d" }, $defs: { d: { properties: { y }, required: ["y"] } } }],
    ["then allOf", { type: "object", properties: { k }, if: kIsA, then: { allOf: [{ properties: { y } }, { required: ["y"] }] } }],
    ["then allOf of a $ref", { type: "object", properties: { k }, if: kIsA, then: { allOf: [{ $ref: "#/$defs/d" }] }, $defs: { d: { properties: { y }, required: ["y"] } } }],
    ["else $ref", { type: "object", properties: { k }, if: { properties: { k: { const: "b" } }, required: ["k"] }, else: { $ref: "#/$defs/d" },
      $defs: { d: { properties: { y }, required: ["y"] } } }]
  ];
  for (const [where, schema] of requiresY) {
    it(`shows and requires a property a ${where} branch declares and requires`, () => {
      expect(pointers(schema)).toEqual([]);
      expect(run(schema, { k: "a" }, "y")).toEqual([true, true, { k: "a" }]);
      expect(run(schema, { k: "a", y: "1" }, "y")).toEqual([true, false, { k: "a", y: "1" }]);
      expect(run(schema, { k: "b", y: "1" }, "y")).toEqual([false, false, { k: "b" }]);
    });
  }

  it("requires a property a dependency given as a $ref or an allOf requires", () => {
    for (const dep of [{ $ref: "#/$defs/d" }, { allOf: [{ $ref: "#/$defs/d" }] }]) {
      const schema = { type: "object", properties: { k }, dependentSchemas: { k: dep }, $defs: { d: { properties: { y }, required: ["y"] } } };
      expect(pointers(schema)).toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentSchemas/k"]]);
      expect(run(schema, { k: "b" }, "y")).toEqual([true, true, { k: "b" }]);
      expect(run(schema, {}, "y")).toEqual([false, false, {}]);
    }
  });

  // AJV: x may not be there while the branch holds.
  it("hides a property a $ref or an allOf branch declares false while it holds", () => {
    const base = { type: "object", properties: { k, x: { type: "string" } }, $defs: { d: { properties: { x: false } } } };
    for (const branch of [{ $ref: "#/$defs/d" }, { allOf: [{ $ref: "#/$defs/d" }] }, { allOf: [{ properties: { x: false } }] }]) {
      const schema = { ...base, if: kIsA, then: branch };
      expect(pointers(schema)).toEqual([]);
      expect(run(schema, { k: "a", x: "1" }, "x")).toEqual([false, false, { k: "a" }]);
      expect(run(schema, { k: "b", x: "1" }, "x")).toEqual([true, false, { k: "b", x: "1" }]);
    }
    const dep = { ...base, dependentSchemas: { k: { $ref: "#/$defs/d" } } };
    expect(pointers(dep)).toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentSchemas/k"]]);
    expect(run(dep, { k: "b", x: "1" }, "x")).toEqual([false, false, { k: "b" }]);
    expect(run(dep, { x: "1" }, "x")).toEqual([true, false, { x: "1" }]);
  });

  // AJV: y is required while both k and j are "a"; x may not be there while k is "a" and j is not.
  it("applies a nested if under both conditions", () => {
    const schema = { type: "object", properties: { k, j: k, x: { type: "string" } }, if: kIsA,
      then: { if: jIsA, then: { properties: { y }, required: ["y"] }, else: { properties: { x: false } } } };
    expect(pointers(schema)).toEqual([]);
    expect(run(schema, { k: "a", j: "a" }, "y")).toEqual([true, true, { k: "a", j: "a" }]);
    expect(run(schema, { k: "a", j: "b", y: "1" }, "y")).toEqual([false, false, { k: "a", j: "b" }]);
    expect(run(schema, { k: "b", j: "a", y: "1" }, "y")).toEqual([false, false, { k: "b", j: "a" }]);
    expect(run(schema, { k: "a", j: "b", x: "1" }, "x")).toEqual([false, false, { k: "a", j: "b" }]);
    expect(run(schema, { k: "a", j: "a", x: "1" }, "x")).toEqual([true, false, { k: "a", j: "a", x: "1" }]);
    expect(run(schema, { k: "b", j: "b", x: "1" }, "x")).toEqual([true, false, { k: "b", j: "b", x: "1" }]);
  });

  it("applies an if nested in an allOf branch and in a dependency", () => {
    const allOf = { type: "object", properties: { k, j: k }, if: kIsA, then: { allOf: [{ if: jIsA, then: { properties: { y }, required: ["y"] } }] } };
    expect(pointers(allOf)).toEqual([]);
    expect(run(allOf, { k: "a", j: "a" }, "y")).toEqual([true, true, { k: "a", j: "a" }]);
    expect(run(allOf, { k: "a", j: "b", y: "1" }, "y")).toEqual([false, false, { k: "a", j: "b" }]);
    const dep = { type: "object", properties: { k, j: k }, dependentSchemas: { k: { if: jIsA, then: { properties: { y }, required: ["y"] } } } };
    expect(pointers(dep)).toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentSchemas/k"]]);
    expect(run(dep, { k: "b", j: "a" }, "y")).toEqual([true, true, { k: "b", j: "a" }]);
    expect(run(dep, { j: "a", y: "1" }, "y")).toEqual([false, false, { j: "a" }]);
  });

  it("reports a nested if that cannot be expressed, and applies nothing of it", () => {
    const schema = { type: "object", properties: { k, j: { type: "string" }, y }, if: kIsA, then: { if: { properties: { j: { minLength: 2 } } }, then: { required: ["y"] } } };
    expect(pointers(schema)).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/if"]]);
    expect(run(schema, { k: "a", j: "abc" }, "y")).toEqual([true, false, { k: "a", j: "abc" }]);
  });

  it("reports a not branch and any other keyword a branch holds, and applies the rest", () => {
    const schema = { type: "object", properties: { k, x: { type: "string" } }, if: kIsA,
      then: { not: { required: ["x"] }, minProperties: 2, required: ["x"] }, else: { anyOf: [{ required: ["x"] }] } };
    expect(pointers(schema)).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/else/anyOf"], [JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/minProperties"],
      [JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/not"]]);
    expect(run(schema, { k: "a" }, "x")).toEqual([true, true, { k: "a" }]);
    expect(pointers({ type: "object", properties: { k, x: { type: "string" } }, dependentSchemas: { k: { not: { required: ["x"] } } } }))
      .toEqual([[JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentSchemas/k"], [JsonSchemaCodes.ASSUMED_DEPENDENCIES, "#/dependentSchemas/k/not"]]);
  });

  it("reports a false branch, which no object meets while it holds", () => {
    expect(pointers({ type: "object", properties: { k }, if: kIsA, then: false })).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then"]]);
    expect(pointers({ type: "object", properties: { k }, if: kIsA, then: true })).toEqual([]);
  });

  it("reports a false allOf entry of a branch", () => {
    expect(pointers({ type: "object", properties: { k }, if: kIsA, then: { allOf: [{ required: ["k"] }, false] } }))
      .toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/allOf/1"]]);
  });

  // AJV: no object with k "a" and j "a" is valid, as x is both required and forbidden there.
  it("reports a key a nested branch forbids while the branch it sits in requires it, and the other way round", () => {
    const base = { type: "object", properties: { k, j: k, x: { type: "string" } }, if: kIsA };
    const inner = { ...base, then: { required: ["x"], if: jIsA, then: { properties: { x: false } } } };
    expect(pointers(inner)).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/then/properties/x"]]);
    expect(run(inner, { k: "a", j: "a", x: "1" }, "x")).toEqual([false, false, { k: "a", j: "a" }]);
    expect(run(inner, { k: "a", j: "b" }, "x")).toEqual([true, true, { k: "a", j: "b" }]);
    const outer = { ...base, then: { properties: { x: false }, if: jIsA, then: { required: ["x"] } } };
    expect(pointers(outer)).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/properties/x"]]);
    expect(run(outer, { k: "a", j: "b", x: "1" }, "x")).toEqual([false, false, { k: "a", j: "b" }]);
    expect(run(outer, { k: "b", x: "1" }, "x")).toEqual([true, false, { k: "b", x: "1" }]);
  });

  // AJV 8 applies the keywords beside a $ref with its target's: y is required while k is "a".
  it("applies a required beside a branch's $ref with the $ref's target", () => {
    const schema = { type: "object", properties: { k, y }, if: kIsA, then: { $ref: "#/$defs/d", required: ["y"], title: "t" }, $defs: { d: { required: ["k"] } } };
    expect(pointers(schema)).toEqual([]);
    expect(run(schema, { k: "a" }, "y")).toEqual([true, true, { k: "a" }]);
    expect(run(schema, { k: "b" }, "y")).toEqual([true, false, { k: "b" }]);
  });

  it("reports a keyword beside a branch's $ref that the branch cannot apply, once", () => {
    const schema = { type: "object", properties: { k, y }, if: kIsA, then: { $ref: "#/$defs/d", minProperties: 2 }, $defs: { d: { required: ["y"] } } };
    expect(pointers(schema)).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/minProperties"]]);
  });

  it("reports a branch given as a remote $ref", () => {
    const schema = { type: "object", properties: { k }, if: kIsA, then: { $ref: "https://example.com/d.json" } };
    expect(pointers(schema)).toEqual([[JsonSchemaCodes.DROPPED_REMOTE_REF, "#/then"]]);
  });

  it("stops at a branch whose $ref leads back to it", () => {
    const schema = { type: "object", properties: { k, j: k, y }, if: kIsA, then: { $ref: "#/$defs/d" },
      $defs: { d: { required: ["y"], if: jIsA, then: { $ref: "#/$defs/d" }, else: { $ref: "#/$defs/d" } } } };
    expect(() => convert(schema)).not.toThrow();
    expect(run(schema, { k: "a" }, "y")).toEqual([true, true, { k: "a" }]);
  });

  it("requires a property a $ref branch or a nested if requires under JSONForms", () => {
    const ui = { type: "VerticalLayout", elements: ["k", "j", "y"].map((key) => ({ type: "Control", scope: `#/properties/${key}` })) };
    const refSchema = { type: "object", properties: { k, j: k, y }, if: kIsA, then: { $ref: "#/$defs/d" }, $defs: { d: { required: ["y"] } } };
    expect(pointers({ schema: refSchema, uiSchema: ui })).toEqual([]);
    expect(loadJsonForms(refSchema, ui, { k: "a" }).getQuestionByName("y").isRequired).toBe(true);
    expect(loadJsonForms(refSchema, ui, { k: "b" }).getQuestionByName("y").isRequired).toBe(false);
    const nested = { type: "object", properties: { k, j: k, y }, if: kIsA, then: { if: jIsA, then: { required: ["y"] } } };
    expect(pointers({ schema: nested, uiSchema: ui })).toEqual([]);
    expect(loadJsonForms(nested, ui, { k: "a", j: "a" }).getQuestionByName("y").isRequired).toBe(true);
    expect(loadJsonForms(nested, ui, { k: "a", j: "b" }).getQuestionByName("y").isRequired).toBe(false);
    expect(loadJsonForms(nested, ui, { k: "b", j: "a" }).getQuestionByName("y").isRequired).toBe(false);
    // A not branch is reported there too: JSONForms validates it.
    const not = { type: "object", properties: { k, j: k, y }, if: kIsA, then: { not: { required: ["y"] } } };
    expect(pointers({ schema: not, uiSchema: ui })).toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/not"]]);
  });
});

describe("json-schema convert - branches and allOf entries shared along many paths", () => {
  const k = { type: "string", enum: ["a", "b"] };
  // d_i: an if on k_i whose then and else both name d_{i+1}; the last one requires y.
  const branchDag = (depth: number) => {
    const $defs: Record<string, object> = {};
    const properties: Record<string, object> = { y: { type: "string" } };
    for (let i = 0; i < depth; i++) {
      properties[`k${i}`] = k;
      $defs[`d${i}`] = { if: { properties: { [`k${i}`]: { const: "a" } }, required: [`k${i}`] }, then: { $ref: `#/$defs/d${i + 1}` }, else: { $ref: `#/$defs/d${i + 1}` } };
    }
    $defs[`d${depth}`] = { required: ["y"] };
    return { type: "object", properties, if: true, then: { $ref: "#/$defs/d0" }, $defs };
  };
  // d_i: an allOf naming d_{i+1} twice, beside a property of its own.
  const allOfDag = (depth: number) => {
    const $defs: Record<string, object> = {};
    for (let i = 0; i < depth; i++) $defs[`d${i}`] = { allOf: [{ $ref: `#/$defs/d${i + 1}` }, { $ref: `#/$defs/d${i + 1}` }], properties: { [`p${i}`]: { type: "string" } } };
    $defs[`d${depth}`] = { properties: { y: { type: "string" } } };
    return { type: "object", allOf: [{ $ref: "#/$defs/d0" }], $defs };
  };

  it("stops expanding branches a $ref names along many paths, and reports the if it stops at", () => {
    const { output, report } = convert(branchDag(14));
    // Read along every path, the branches give a requiredIf of some 4.5 MB; the budget bounds them.
    expect(JSON.stringify(output).length).toBeLessThan(16000);
    expect(report.entries.length).toBeGreaterThan(0);
    expect(report.entries.every((e) => e.code === JsonSchemaCodes.ASSUMED_IF_THEN_ELSE && e.sourcePointer.endsWith("/if"))).toBe(true);
    const survey = assertConstructsCleanly(output, "branch DAG");
    // Every path ends in d14, so AJV requires y always. The paths read before the stop require it;
    // nothing of a branch past the stop applies, so y is not required on the last path.
    survey.data = Object.fromEntries(Array.from({ length: 14 }, (_, i) => [`k${i}`, "a"]));
    expect(survey.getQuestionByName("y").isRequired).toBe(true);
    survey.data = Object.fromEntries(Array.from({ length: 14 }, (_, i) => [`k${i}`, "b"]));
    expect(survey.getQuestionByName("y").isRequired).toBe(false);
  });

  // A chain of `depth` nested ifs, one key each, each continuing in its `else` and with no `then`; the
  // last requires y. AJV requires y while no key is "a".
  const elseChain = (depth: number) => {
    const properties: Record<string, object> = { y: { type: "string" } };
    const isA = (i: number) => ({ properties: { [`k${i}`]: { const: "a" } }, required: [`k${i}`] });
    for (let i = 0; i < depth; i++) properties[`k${i}`] = { type: "string", enum: ["a", "b"] };
    let branch: object = { required: ["y"] };
    for (let i = depth - 1; i >= 1; i--) branch = { if: isA(i), else: branch };
    return { type: "object", properties, if: isA(0), else: branch };
  };
  const keys = (depth: number, value: string) => Object.fromEntries(Array.from({ length: depth }, (_, i) => [`k${i}`, value]));

  it("expresses a chain of else-only ifs well past the number of branches an if with both would allow", () => {
    const { output, report } = convert(elseChain(50));
    expect(report.entries).toEqual([]);
    const survey = assertConstructsCleanly(output, "else chain");
    survey.data = keys(50, "b");
    expect(survey.getQuestionByName("y").isRequired).toBe(true);
    survey.data = { ...keys(50, "b"), k30: "a" };
    expect(survey.getQuestionByName("y").isRequired).toBe(false);
  });

  it("still reports a chain of else-only ifs past the branch limit, and applies nothing of the if it stops at", () => {
    const { output, report } = convert(elseChain(80));
    expect(report.entries.length).toBeGreaterThan(0);
    expect(report.entries.every((e) => e.code === JsonSchemaCodes.ASSUMED_IF_THEN_ELSE && e.sourcePointer.endsWith("/if"))).toBe(true);
    const survey = assertConstructsCleanly(output, "long else chain");
    survey.data = keys(80, "b");
    expect(survey.getQuestionByName("y").isRequired).toBe(false);
  });

  it("expresses more than 32 side-by-side ifs that have a then only", () => {
    const properties: Record<string, object> = { y: { type: "string" } };
    const allOf: object[] = [];
    for (let i = 0; i < 40; i++) {
      properties[`k${i}`] = { type: "string", enum: ["a", "b"] };
      properties[`y${i}`] = { type: "string" };
      allOf.push({ if: { properties: { [`k${i}`]: { const: "a" } }, required: [`k${i}`] }, then: { required: [`y${i}`] } });
    }
    const schema = { type: "object", properties, if: { properties: { y: { const: "go" } }, required: ["y"] }, then: { allOf } };
    const { output, report } = convert(schema);
    expect(report.entries).toEqual([]);
    const survey = assertConstructsCleanly(output, "side by side");
    survey.data = { y: "go", k39: "a" };
    expect(survey.getQuestionByName("y39").isRequired).toBe(true);
    expect(survey.getQuestionByName("y38").isRequired).toBe(false);
  });

  it("applies a branch a $ref names along a few paths exactly", () => {
    const { output, report } = convert(branchDag(3));
    expect(report.entries).toEqual([]);
    const survey = assertConstructsCleanly(output, "small branch DAG");
    survey.data = { k0: "a", k1: "b" };
    expect(survey.getQuestionByName("y").isRequired).toBe(true);
  });

  it("merges an allOf entry named along many paths once, and does not throw", () => {
    const run = () => convert(allOfDag(16));
    expect(run).not.toThrow();
    const { output, report } = run();
    // One question per property, each once.
    expect(JSON.stringify(output).length).toBeLessThan(1000);
    expect(report.entries).toEqual([]);
    expect(assertConstructsCleanly(output, "allOf DAG").getAllQuestions().map((q) => q.name).sort())
      .toEqual([...Array.from({ length: 16 }, (_, i) => `p${i}`), "y"].sort());
  });
});

describe("json-schema convert - a branch that never applies", () => {
  const k = { type: "string", enum: ["a", "b"] };
  const x = { type: "string" };
  const y = { type: "string" };
  const kIsA = { properties: { k: { const: "a" } }, required: ["k"] };
  const pointers = (schema: object) => convert(schema).report.entries.map((e) => [e.code, e.sourcePointer]);

  it("does not count a key only a dead branch declares as declared, and reports a required on it", () => {
    expect(pointers({ type: "object", properties: { k, x }, if: kIsA, then: { required: ["x", "y"], if: false, then: { properties: { y } } } }))
      .toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/required/1"]]);
    expect(pointers({ type: "object", properties: { k, x }, if: kIsA, then: { $ref: "#/$defs/d" }, $defs: { d: { required: ["x", "y"], if: false, then: { properties: { y } } } } }))
      .toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/then/required/1"]]);
    expect(pointers({ type: "object", properties: { k }, allOf: [{ if: false, then: { properties: { y } } }, { if: kIsA, then: { required: ["y"] } }] }))
      .toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/allOf/1/then/required/0"]]);
    expect(pointers({ type: "object", properties: { k }, allOf: [{ if: true, else: { properties: { y } } }, { if: kIsA, then: { required: ["y"] } }] }))
      .toEqual([[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/allOf/1/then/required/0"]]);
  });

  it("still shows a key a branch that applies always declares", () => {
    const schema = { type: "object", properties: { k }, allOf: [{ if: true, then: { properties: { y } } }, { if: kIsA, then: { required: ["y"] } }] };
    expect(pointers(schema)).toEqual([]);
    const survey = assertConstructsCleanly(convert(schema).output, "live branch");
    survey.data = { k: "a" };
    expect(survey.getQuestionByName("y").isRequired).toBe(true);
  });

  it("reads definitions beside a branch's $ref as constraining nothing", () => {
    expect(pointers({ type: "object", properties: { k }, if: kIsA, then: { $ref: "#/then/$defs/d", $defs: { d: { required: ["k"] } } } })).toEqual([]);
  });
});

// The visible questions and panels with an error of their own for `data` (questions first), and the data
// the survey completes with. A dynamic panel's rows list their questions' errors.
function completeWith(input: object, data: Record<string, unknown>): [string[], Record<string, unknown>] {
  const survey = assertConstructsCleanly(convert(input).output, "complete");
  survey.data = data;
  const errors: string[] = [];
  for (const q of survey.getAllQuestions(true, false, true)) {
    if (q.getType() !== "paneldynamic" && q.isVisible && q.isParentVisible && q.hasErrors(false)) errors.push(q.name);
  }
  for (const p of survey.getAllPanels(true) as PanelModel[]) {
    p.hasErrors(true);
    if (p.isVisible && p.errors.length > 0) errors.push(p.name);
  }
  survey.doComplete();
  return [errors, survey.data];
}

describe("json-schema convert - the tagbox of an array of primitives", () => {
  const req = (items: object) => ({ type: "object", required: ["t"], properties: { t: { type: "array", items } } });
  const tagbox = (input: object) => findElement(convert(input).output, "t");
  const pointers = (input: object) => {
    const { output, report } = convert(input);
    assertConstructsCleanly(output, "tagbox");
    return report.entries.map((e) => [e.code, e.sourcePointer]);
  };

  it("allows custom choices, so a required one keeps the items it holds", () => {
    const input = req({ type: "string" });
    expect(tagbox(input)).toMatchObject({ type: "tagbox", allowCustomChoices: true, isRequired: true });
    expect(completeWith(input, { t: ["a", "b"] })).toEqual([[], { t: ["a", "b"] }]);
    expect(completeWith(input, {})[0]).toEqual(["t"]);
  });

  it("keeps the fixed choices of a tagbox on an enum array", () => {
    const input = req({ type: "string", enum: ["a", "b"] });
    const el = findElement(convert({ schema: input, uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/t", options: { multi: true } }] } }).output, "t");
    expect(el?.type).toBe("tagbox");
    expect(el?.allowCustomChoices).toBeUndefined();
    expect(tagbox(input)?.type).toBe("checkbox");
    expect(completeWith(input, { t: ["a"] })).toEqual([[], { t: ["a"] }]);
  });

  it("reports number, integer and boolean items, whose values the tagbox stores as text", () => {
    for (const type of ["number", "integer", "boolean"]) {
      const input = req({ type });
      expect(tagbox(input)).toMatchObject({ type: "tagbox", allowCustomChoices: true });
      expect(pointers(input)).toEqual([[JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/properties/t/items/type"]]);
    }
    expect(pointers(req({ type: ["number", "null"] }))).toEqual([[JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/properties/t/items/type"]]);
    expect(pointers(req({ type: ["string", "number"] }))).toEqual([]);
    expect(pointers(req({}))).toEqual([]);
  });

  it("reports a tuple-form items and keeps the tagbox", () => {
    const input = req([{ type: "string" }, { type: "number" }]);
    expect(tagbox(input)).toMatchObject({ type: "tagbox", allowCustomChoices: true });
    expect(pointers(input)).toEqual([[JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/properties/t/items"]]);
    assertConstructsCleanly(convert(input).output, "tuple");
  });

  it("reports a prefixItems, with or without items, and keeps the tagbox", () => {
    const prefixItems = [{ type: "string" }, { type: "string", maxLength: 2 }];
    const without = { type: "object", required: ["t"], properties: { t: { type: "array", prefixItems } } };
    const withItems = { type: "object", required: ["t"], properties: { t: { type: "array", prefixItems, items: { type: "string" } } } };
    const closed = { type: "object", required: ["t"], properties: { t: { type: "array", prefixItems, items: false } } };
    const untyped = { type: "object", required: ["t"], properties: { t: { prefixItems } } };
    for (const input of [without, withItems, closed, untyped]) {
      expect(tagbox(input)).toMatchObject({ type: "tagbox", allowCustomChoices: true });
      expect(pointers(input)).toEqual([[JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/properties/t/prefixItems"]]);
      expect(completeWith(input, { t: ["a", "bcd"] })).toEqual([[], { t: ["a", "bcd"] }]);
    }
  });
});

describe("json-schema convert - JSONForms Controls on the fields of an object no Control walks", () => {
  const ui = (...scopes: string[]) => ({ type: "VerticalLayout", elements: scopes.map((scope) => ({ type: "Control", scope })) });
  const p = { type: "string", enum: ["a", "b"] };
  const q = { type: "string" };
  const o = { type: "object", properties: { p, q }, if: { properties: { p: { const: "a" } }, required: ["p"] }, then: { required: ["q"] } };
  const codes = (input: object) => convert(input).report.entries.map((e) => [e.code, e.sourcePointer]);

  // AJV: q is required while p is "a".
  it("applies the object's if/then to the Controls on its fields", () => {
    const input = { schema: { type: "object", properties: { o }, required: ["o"] }, uiSchema: ui("#/properties/o/properties/p", "#/properties/o/properties/q") };
    expect(completeWith(input, { p: "a" })[0]).toEqual(["q"]);
    expect(completeWith(input, { p: "b" })[0]).toEqual([]);
    expect(completeWith(input, { p: "a", q: "1" })[0]).toEqual([]);
    expect(codes(input)).toEqual([
      [JsonSchemaCodes.ASSUMED_NESTED_SCOPE, "#/uiSchema/elements/0/scope"],
      [JsonSchemaCodes.ASSUMED_NESTED_SCOPE, "#/uiSchema/elements/1/scope"]
    ]);
  });

  // AJV: p is required whenever o is there.
  it("applies the object's allOf required to a Control on its field", () => {
    const required = { type: "object", properties: { p: { type: "string" } }, allOf: [{ required: ["p"] }] };
    const input = { schema: { type: "object", properties: { o: required }, required: ["o"] }, uiSchema: ui("#/properties/o/properties/p") };
    expect(completeWith(input, {})[0]).toEqual(["p"]);
    expect(completeWith(input, { p: "1" })[0]).toEqual([]);
  });

  it("reports the object's if once, when it cannot be expressed", () => {
    const unread = { ...o, if: { properties: { p: { const: "a" } }, required: ["p"], minProperties: 1 } };
    const input = { schema: { type: "object", properties: { o: unread }, required: ["o"] }, uiSchema: ui("#/properties/o/properties/p", "#/properties/o/properties/q") };
    expect(convert(input).report.entries.map((e) => [e.code, e.sourcePointer, e.count])).toEqual([
      [JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/properties/o/if", 1],
      [JsonSchemaCodes.ASSUMED_NESTED_SCOPE, "#/uiSchema/elements/0/scope", 1],
      [JsonSchemaCodes.ASSUMED_NESTED_SCOPE, "#/uiSchema/elements/1/scope", 1]
    ]);
  });

  it("applies them in an array's detail", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object", properties: { o }, required: ["o"] } } } };
    const detail = ui("#/properties/o/properties/p", "#/properties/o/properties/q");
    const input = { schema, uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/rows", options: { detail } }] } };
    expect(completeWith(input, { rows: [{ p: "a" }] })[0]).toEqual(["q"]);
    expect(completeWith(input, { rows: [{ p: "b" }] })[0]).toEqual([]);
  });

  it("applies them in an object's detail", () => {
    const schema = { type: "object", properties: { outer: { type: "object", properties: { o }, required: ["o"] } }, required: ["outer"] };
    const detail = ui("#/properties/o/properties/p", "#/properties/o/properties/q");
    const input = { schema, uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/outer", options: { detail } }] } };
    expect(completeWith(input, { p: "a" })[0]).toEqual(["q"]);
    expect(completeWith(input, { p: "b" })[0]).toEqual([]);
  });
});

describe("json-schema convert - requirements inside an optional nested object", () => {
  const country = { type: "string", enum: ["US", "CA"] };
  const zip = { type: "string" };
  const name = { type: "string" };
  const address = { type: "object", properties: { country, zip }, if: { properties: { country: { const: "US" } } }, then: { required: ["zip"] } };

  // AJV: an absent address is valid; one that is there requires zip while its country is absent or "US".
  it("requires a branch's key only while the object holds a value", () => {
    const schema = { type: "object", properties: { address, name } };
    expect(completeWith(schema, {})).toEqual([[], {}]);
    expect(completeWith(schema, { name: "n" })[0]).toEqual([]);
    expect(completeWith(schema, { country: "US" })[0]).toEqual(["zip"]);
    expect(completeWith(schema, { country: "CA" })[0]).toEqual([]);
    expect(completeWith(schema, { zip: "1" })[0]).toEqual([]);
    const survey = assertConstructsCleanly(convert(schema).output, "optional object");
    expect(["country", "zip"].map((n) => survey.getQuestionByName(n).isVisible)).toEqual([true, true]);
  });

  // AJV: country is required once address is there.
  it("requires the object's own required keys only while it holds a value", () => {
    const schema = { type: "object", properties: { address: { type: "object", properties: { country, zip }, required: ["country"] } } };
    expect(completeWith(schema, {})[0]).toEqual([]);
    expect(completeWith(schema, { zip: "1" })[0]).toEqual(["country"]);
    expect(completeWith(schema, { country: "US" })[0]).toEqual([]);
  });

  it("gates a dependency's and an allOf entry's required too", () => {
    const schema = { type: "object", properties: { address: { type: "object", properties: { country, zip },
      dependentRequired: { country: ["zip"] }, allOf: [{ required: ["country"] }] } } };
    expect(completeWith(schema, {})[0]).toEqual([]);
    expect(completeWith(schema, { zip: "1" })[0]).toEqual(["country"]);
    expect(completeWith(schema, { country: "US" })[0]).toEqual(["zip"]);
    expect(completeWith(schema, { country: "US", zip: "1" })[0]).toEqual([]);
  });

  it("leaves a required object's requirements as they are", () => {
    const schema = { type: "object", properties: { address: { ...address, required: ["country"] } }, required: ["address"] };
    const { output } = convert(schema);
    expect(findElement(output, "address")?.isRequired).toBe(true);
    expect(findElement(output, "country")?.isRequired).toBe(true);
    expect(findElement(output, "zip")?.requiredIf).toBe("({country} empty or {country} = 'US')");
  });

  // AJV: b is required once p is there; p is required once o is there, when o requires it.
  it("composes the presence of nested optional objects", () => {
    const p = { type: "object", properties: { b: name, c: name }, required: ["b"] };
    const optional = { type: "object", properties: { o: { type: "object", properties: { a: name, p } } } };
    expect(completeWith(optional, {})[0]).toEqual([]);
    expect(completeWith(optional, { a: "1" })[0]).toEqual([]);
    expect(completeWith(optional, { c: "1" })[0]).toEqual(["b"]);
    expect(completeWith(optional, { b: "1" })[0]).toEqual([]);
    const requiredInner = { type: "object", properties: { o: { type: "object", properties: { a: name, p }, required: ["p"] } } };
    expect(completeWith(requiredInner, {})[0]).toEqual([]);
    expect(completeWith(requiredInner, { a: "1" })[0]).toEqual(["b", "p"]);
    expect(completeWith(requiredInner, { a: "1", c: "1" })[0]).toEqual(["b"]);
    expect(completeWith(requiredInner, { a: "1", b: "1" })[0]).toEqual([]);
  });

  it("gates them inside an array's rows", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: { type: "object",
      properties: { o: { type: "object", properties: { a: name, b: name }, required: ["a"] } } } } } };
    expect(completeWith(schema, { rows: [{}] })[0]).toEqual([]);
    expect(completeWith(schema, { rows: [{ b: "1" }] })[0]).toEqual(["a"]);
  });

  it("gates them under JSONForms, for an object Control and for Controls on the object's fields", () => {
    const o = { type: "object", properties: { p: { type: "string", enum: ["a", "b"] }, q: name, r: name }, required: ["r"],
      if: { properties: { p: { const: "a" } }, required: ["p"] }, then: { required: ["q"] } };
    const schema = { type: "object", properties: { o } };
    const object = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/o" }] };
    const fields = { type: "VerticalLayout", elements: ["p", "q", "r"].map((k) => ({ type: "Control", scope: `#/properties/o/properties/${k}` })) };
    for (const uiSchema of [object, fields]) {
      const input = { schema, uiSchema };
      expect(completeWith(input, {})[0]).toEqual([]);
      expect(completeWith(input, { q: "1" })[0]).toEqual(["r"]);
      expect(completeWith(input, { p: "a", r: "1" })[0]).toEqual(["q"]);
      expect(completeWith(input, { p: "b", r: "1" })[0]).toEqual([]);
    }
  });
});

describe("json-schema convert - a JSONForms object Control and a required key only a branch declares", () => {
  it("reports the key, which no Control holds", () => {
    const o = { type: "object", properties: { k: { type: "string", enum: ["a", "b"] } }, required: ["y"],
      if: { properties: { k: { const: "a" } }, required: ["k"] }, then: { properties: { y: { type: "string" } } } };
    const { output, report } = convert({ schema: { type: "object", properties: { o }, required: ["o"] },
      uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/o" }] } });
    assertConstructsCleanly(output, "branch-only required key");
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.UNSUPPORTED_FREE_FORM_OBJECT, "#/properties/o/required/0"]]);
  });
});

describe("json-schema convert - a JSONForms oneOf or anyOf entry that constrains a Control's property", () => {
  const ui = (keys: string[]) => ({ type: "VerticalLayout", elements: keys.map((k) => ({ type: "Control", scope: `#/properties/${k}` })) });
  const properties = { x: { type: "string" }, k: { type: "string" } };
  const pointers = (input: object) => convert(input).report.entries.map((e) => [e.code, e.sourcePointer]);

  for (const key of ["oneOf", "anyOf"]) {
    it(`reports each property and required key of a ${key} entry that a Control names, and applies none`, () => {
      const schema = { type: "object", properties, [key]: [
        { properties: { x: { maxLength: 3 }, z: { type: "number" } }, required: ["x", "z"] },
        { properties: { k: { const: "a" } } }
      ] };
      const input = { schema, uiSchema: ui(["x", "k"]) };
      expect(pointers(input)).toEqual([
        [JsonSchemaCodes.UNSUPPORTED_KEYWORD, `#/${key}/0/properties/x`],
        [JsonSchemaCodes.UNSUPPORTED_KEYWORD, `#/${key}/0/required/0`],
        [JsonSchemaCodes.UNSUPPORTED_KEYWORD, `#/${key}/1/properties/k`]
      ]);
      // Neither entry is known to hold, so neither constrains the questions.
      expect(completeWith(input, {})).toEqual([[], {}]);
      expect(completeWith(input, { x: "abcd", k: "b" })).toEqual([[], { x: "abcd", k: "b" }]);
    });
  }

  it("reports an entry's properties in an allOf inside it", () => {
    const schema = { type: "object", properties, oneOf: [{ allOf: [{ properties: { x: { maxLength: 3 } } }] }, { required: ["k"] }] };
    expect(pointers({ schema, uiSchema: ui(["x", "k"]) })).toEqual([
      [JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/oneOf/0/allOf/0/properties/x"],
      [JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/oneOf/1/required/0"]
    ]);
  });

  it("does not report what constrains nothing more than the object", () => {
    const schema = { type: "object", properties, required: ["x"], anyOf: [
      { properties: { x: { type: "string", title: "X" }, k: true }, required: ["x"] },
      { properties: { k: {} } }
    ] };
    expect(pointers({ schema, uiSchema: ui(["x", "k"]) })).toEqual([]);
  });

  it("reports the properties of the only entry, and applies its required", () => {
    const schema = { type: "object", properties, anyOf: [{ properties: { x: { maxLength: 3 } }, required: ["x"] }] };
    const input = { schema, uiSchema: ui(["x", "k"]) };
    expect(pointers(input)).toEqual([[JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/anyOf/0/properties/x"]]);
    expect(completeWith(input, {})[0]).toEqual(["x"]);
    expect(completeWith(input, { x: "abcd" })).toEqual([[], { x: "abcd" }]);
  });
});

describe("json-schema convert - an if literal the field's type excludes", () => {
  const x = { type: "string" };
  const run = (k: object, ifK: object, required = true) => {
    const schema = { type: "object", properties: { k, x }, if: { properties: { k: ifK }, ...(required ? { required: ["k"] } : {}) }, then: { required: ["x"] } };
    const { output, report } = convert(schema);
    return { requiredIf: findElement(output, "x")?.requiredIf, entries: report.entries.map((e) => [e.code, e.sourcePointer]), schema };
  };

  // AJV: a valid k is a text, which never equals the number 1 or the boolean true.
  it("refuses an if left with no value of the field's type, and reports it", () => {
    for (const ifK of [{ const: 1 }, { const: true }, { enum: [1, false] }]) {
      expect(run({ type: "string" }, ifK), JSON.stringify(ifK)).toMatchObject({ requiredIf: undefined, entries: [[JsonSchemaCodes.ASSUMED_IF_THEN_ELSE, "#/if"]] });
    }
  });

  it("drops the values the type excludes", () => {
    const { requiredIf, entries, schema } = run({ type: "string" }, { enum: ["true", true] });
    expect([requiredIf, entries]).toEqual(["{k} = 'true'", []]);
    expect(completeWith(schema, { k: "1" })[0]).toEqual([]);
    expect(completeWith(schema, { k: "true" })[0]).toEqual(["x"]);
  });

  // AJV: an absent k meets the if; a text k never does.
  it("reads an optional key left with no value as absent", () => {
    expect(run({ type: "string" }, { const: 1 }, false)).toMatchObject({ requiredIf: "{k} empty", entries: [] });
  });

  it("keeps a value of a type the field allows", () => {
    expect(run({ type: ["string", "number"] }, { const: 1 })).toMatchObject({ requiredIf: "{k} = 1", entries: [] });
  });
});

describe("json-schema convert - a nested scope whose property name ends in then or else", () => {
  it("is reported as a nested scope", () => {
    const { report } = convert({ schema: { type: "object", properties: { strengthen: { type: "object", properties: { x: { type: "string" } } } } },
      uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/strengthen/properties/x" }] } });
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.ASSUMED_NESTED_SCOPE, "#/uiSchema/elements/0/scope"]]);
  });
});

describe("json-schema convert - schemas that allow no value or no field", () => {
  const pointers = (input: object) => convert(input).report.entries.map((e) => [e.code, e.sourcePointer]);
  const names = (input: object) => assertConstructsCleanly(convert(input).output, "no value").getAllQuestions().map((q) => q.name);

  it("gives no question for a root anyOf of object variants, and reports the anyOf", () => {
    for (const schema of [{ anyOf: [{ properties: { a: { type: "string" } } }, { properties: { b: { type: "string" } } }] },
      { type: "object", anyOf: [{ properties: { a: { type: "string" } } }, { properties: { b: { type: "string" } } }] }]) {
      expect(names(schema)).toEqual([]);
      expect(pointers(schema)).toEqual([[JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/anyOf"]]);
    }
  });

  it("reports a false allOf entry of an object, which no instance meets", () => {
    const nested = { type: "object", properties: { o: { type: "object", properties: { a: { type: "string" } }, allOf: [false] } } };
    expect(pointers(nested)).toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/properties/o/allOf/0"]]);
    const root = { type: "object", properties: { a: { type: "string" } }, allOf: [{ required: ["a"] }, false] };
    expect(pointers(root)).toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/allOf/1"]]);
    expect(pointers({ schema: root, uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/a" }] } }))
      .toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/allOf/1"]]);
  });

  it("gives no question for an array whose items are false, and reports them", () => {
    const schema = { type: "object", properties: { t: { type: "array", items: false }, a: { type: "string" } } };
    expect(names(schema)).toEqual(["a"]);
    expect(pointers(schema)).toEqual([[JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/properties/t/items"]]);
  });

  it("reports the constraints of an array's primitive items, which its tagbox does not keep", () => {
    const schema = { type: "object", properties: { t: { type: "array", items: { type: "string", maxLength: 3, pattern: "^a", title: "T" } },
      u: { type: "array", items: { allOf: [{ type: "string" }, { minLength: 1 }] } }, v: { type: "array", items: { type: "string" } } } };
    expect(names(schema)).toEqual(["t", "u", "v"]);
    expect(pointers(schema)).toEqual([
      [JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/properties/t/items/maxLength"],
      [JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/properties/t/items/pattern"],
      [JsonSchemaCodes.UNSUPPORTED_KEYWORD, "#/properties/u/items/allOf/1/minLength"]
    ]);
  });
});

describe("json-schema convert - keywords beside a $ref", () => {
  const S = { type: "string" };
  const pointers = (input: object) => convert(input).report.entries.map((e) => [e.code, e.sourcePointer]);
  const names = (input: object) => assertConstructsCleanly(convert(input).output, "beside a $ref").getAllQuestions().map((q) => q.name);

  // AJV 8, which JSONForms and RJSF use, applies the keywords beside a $ref with its target's.
  it("applies a constraint beside a property's $ref", () => {
    const schema = { type: "object", $defs: { S }, properties: { s: { $ref: "#/$defs/S", maxLength: 3 } } };
    expect(pointers(schema)).toEqual([]);
    expect(completeWith(schema, { s: "abc" })).toEqual([[], { s: "abc" }]);
    expect(completeWith(schema, { s: "abcd" })[0]).toEqual(["s"]);
  });

  it("applies a constraint beside a $ref under a JSONForms Control", () => {
    const schema = { type: "object", $defs: { S }, properties: { s: { $ref: "#/$defs/S", maxLength: 3 } } };
    const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/s" }] };
    expect(pointers({ schema, uiSchema: ui })).toEqual([]);
    expect(loadJsonForms(schema, ui, { s: "abcd" }).getQuestionByName("s").hasErrors(false)).toBe(true);
    expect(loadJsonForms(schema, ui, { s: "abc" }).getQuestionByName("s").hasErrors(false)).toBe(false);
  });

  it("adds the properties and the required beside a $ref in an allOf entry", () => {
    const schema = { type: "object", $defs: { base: { type: "object", properties: { x: S } } },
      allOf: [{ $ref: "#/$defs/base", properties: { y: S }, required: ["y"] }] };
    expect(pointers(schema)).toEqual([]);
    expect(names(schema)).toEqual(["x", "y"]);
    expect(completeWith(schema, { x: "1" })).toEqual([["y"], { x: "1" }]);
    expect(completeWith(schema, { y: "1" })).toEqual([[], { y: "1" }]);
  });

  it("adds the properties and the required beside a nested object's $ref", () => {
    const schema = { type: "object", required: ["o"], $defs: { base: { type: "object", properties: { x: S } } },
      properties: { o: { $ref: "#/$defs/base", properties: { y: S }, required: ["y"] } } };
    expect(pointers(schema)).toEqual([]);
    expect(names(schema)).toEqual(["x", "y"]);
    expect(completeWith(schema, { x: "1" })).toEqual([["y"], { x: "1" }]);
  });

  it("applies the required beside the $ref of an array's items in each row", () => {
    const schema = { type: "object", $defs: { row: { type: "object", properties: { y: S } } },
      properties: { rows: { type: "array", items: { $ref: "#/$defs/row", required: ["y"] } } } };
    const { output, report } = convert(schema);
    expect(report.entries).toEqual([]);
    expect(findElement(output, "y")?.isRequired).toBe(true);
    const survey = assertConstructsCleanly(output, "rows");
    survey.data = { rows: [{}] };
    expect((survey.getQuestionByName("rows") as any).panels[0].getQuestionByName("y").hasErrors(false)).toBe(true);
  });

  it("applies the keywords beside each $ref of a chain", () => {
    const schema = { type: "object", $defs: { a: { $ref: "#/$defs/b", minLength: 2 }, b: { type: "string", maxLength: 3 } },
      properties: { s: { $ref: "#/$defs/a", pattern: "^a" } } };
    expect(pointers(schema)).toEqual([]);
    expect(completeWith(schema, { s: "ab" })).toEqual([[], { s: "ab" }]);
    for (const s of ["a", "abcd", "bc"]) expect(completeWith(schema, { s })[0]).toEqual(["s"]);
  });

  it("keeps the target's value of a keyword set beside its $ref otherwise, and reports the other", () => {
    const schema = { type: "object", $defs: { S5: { type: "string", maxLength: 5 } }, properties: { s: { $ref: "#/$defs/S5", maxLength: 3 } } };
    expect(pointers(schema)).toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/properties/s/maxLength"]]);
    expect(completeWith(schema, { s: "abcd" })).toEqual([[], { s: "abcd" }]);
  });

  // RJSF reads a property `{ ...target, ...beside }`: the annotations beside the $ref win.
  it("applies the annotations beside a $ref over the target's, with or without a constraint", () => {
    const $defs = { T: { type: "string", title: "Target", default: "t" } };
    for (const extra of [{}, { maxLength: 3 }]) {
      const schema = { type: "object", $defs, properties: { s: { $ref: "#/$defs/T", title: "Beside", description: "d", default: "b", readOnly: true, ...extra } } };
      expect(pointers(schema)).toEqual([]);
      const survey = assertConstructsCleanly(convert(schema).output, "annotations beside a $ref");
      const q = survey.getQuestionByName("s");
      expect([q.title, q.description, q.readOnly, q.value]).toEqual(["Beside", "d", true, "b"]);
      survey.doComplete();
      expect(survey.data).toEqual({ s: "b" });
    }
  });

  // JSONForms takes a Control's label, default and readonly from the $ref's resolved target; AJV still
  // validates the constraint beside it.
  it("reads the annotations of a $ref's target under a JSONForms UI schema, and applies a constraint beside it", () => {
    const $defs = { T: { type: "string", title: "Target", default: "t" } };
    const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/s" }] };
    for (const extra of [{}, { maxLength: 3 }]) {
      const schema = { type: "object", $defs, properties: { s: { $ref: "#/$defs/T", title: "Beside", description: "d", default: "b", readOnly: true, ...extra } } };
      expect(pointers({ schema, uiSchema: ui })).toEqual([]);
      const survey = assertConstructsCleanly(convert({ schema, uiSchema: ui }).output, "annotations beside a $ref under JSONForms");
      const q = survey.getQuestionByName("s");
      expect([q.title, q.description, q.readOnly, q.value]).toEqual(["Target", "", false, "t"]);
      q.value = "abcd";
      expect(q.hasErrors(false)).toBe("maxLength" in extra);
    }
    const bare = { type: "object", $defs: { T: { type: "string" } }, properties: { s: { $ref: "#/$defs/T", title: "Beside", default: "b" } } };
    expect(findElement(convert({ schema: bare, uiSchema: ui }).output, "s")).toEqual({ type: "text", name: "s" });
  });

  it("titles a discriminated variant by the title beside its $ref", () => {
    const $defs = { Cat: { type: "object", title: "Cat", properties: { kind: { const: "cat" }, meow: S } }, Dog: { type: "object", properties: { kind: { const: "dog" }, bark: S } } };
    const schema = { type: "object", $defs, discriminator: { propertyName: "kind" }, oneOf: [{ $ref: "#/$defs/Cat", title: "Kitty" }, { $ref: "#/$defs/Dog" }] };
    expect(pointers(schema)).toEqual([]);
    expect(convert(schema).output.pages?.map((p) => p.title)).toEqual([undefined, "Kitty", undefined]);
  });

  it("still reports a remote or a cyclic $ref beside a constraint", () => {
    const remote = { type: "object", properties: { s: { $ref: "https://example.com/s.json", maxLength: 3 } } };
    expect(pointers(remote)).toEqual([[JsonSchemaCodes.DROPPED_REMOTE_REF, "#/properties/s"]]);
    const cycle = { type: "object", $defs: { a: { $ref: "#/$defs/a", maxLength: 3 } }, properties: { s: { $ref: "#/$defs/a" } } };
    expect(pointers(cycle)).toEqual([[JsonSchemaCodes.UNRESOLVED_REF, "#/properties/s"]]);
  });

  it("applies the required beside the $ref of a discriminated oneOf variant", () => {
    const $defs = { Cat: { type: "object", properties: { kind: { const: "cat" }, meow: S } }, Dog: { type: "object", properties: { kind: { const: "dog" }, bark: S } } };
    const oneOf = [{ $ref: "#/$defs/Cat", required: ["meow"] }, { $ref: "#/$defs/Dog" }];
    const top = { type: "object", $defs, discriminator: { propertyName: "kind" }, oneOf };
    const nested = { type: "object", $defs, required: ["pet"], properties: { pet: { type: "object", discriminator: { propertyName: "kind" }, oneOf } } };
    for (const schema of [top, nested]) {
      expect(pointers(schema)).toEqual([]);
      expect(completeWith(schema, { kind: "cat" })[0]).toContain("meow");
      expect(completeWith(schema, { kind: "cat", meow: "m" })[0]).not.toContain("meow");
      expect(completeWith(schema, { kind: "dog" })[0]).not.toContain("meow");
    }
  });

  it("reads the keywords beside a $ref anew when the same schema object is edited and converted again", () => {
    const s: Record<string, unknown> = { $ref: "#/$defs/S", maxLength: 3 };
    const schema = { type: "object", $defs: { S }, properties: { s } };
    expect(completeWith(schema, { s: "abcd" })[0]).toEqual(["s"]);
    s.maxLength = 10;
    expect(completeWith(schema, { s: "abcd" })).toEqual([[], { s: "abcd" }]);
    delete s.maxLength;
    s.minLength = 2;
    expect(completeWith(schema, { s: "a" })[0]).toEqual(["s"]);
    expect(completeWith(schema, { s: "abcdefghijkl" })).toEqual([[], { s: "abcdefghijkl" }]);
    const o: Record<string, unknown> = { $ref: "#/$defs/base", required: ["x"] };
    const nested = { type: "object", required: ["o"], $defs: { base: { type: "object", properties: { x: S, y: S } } }, properties: { o } };
    expect(completeWith(nested, { y: "1" })[0]).toEqual(["x"]);
    o.required = ["y"];
    expect(completeWith(nested, { y: "1" })).toEqual([[], { y: "1" }]);
    expect(completeWith(nested, { x: "1" })[0]).toEqual(["y"]);
  });

  it("merges a $ref beside a constraint whose target leads back to it once", () => {
    const schema = { type: "object", $defs: { a: { $ref: "#/$defs/b", maxLength: 3 }, b: { type: "string", allOf: [{ $ref: "#/$defs/a" }] } },
      properties: { s: { $ref: "#/$defs/a" } } };
    expect(() => convert(schema)).not.toThrow();
    expect(pointers(schema)).toEqual([]);
    expect(completeWith(schema, { s: "abcd" })[0]).toEqual(["s"]);
  });
});

describe("json-schema convert - a root $ref", () => {
  const S = { type: "string" };
  const definitions = { A: { type: "object", properties: { x: S }, required: ["x"] } };
  const pointers = (input: object) => convert(input).report.entries.map((e) => [e.code, e.sourcePointer]);
  const names = (input: object) => assertConstructsCleanly(convert(input).output, "root $ref").getAllQuestions().map((q) => q.name);

  // AJV: the root is the object A names, whose x is required.
  it("walks the object a root $ref names as the form, its required kept", () => {
    const schema = { definitions, $ref: "#/definitions/A" };
    expect(pointers(schema)).toEqual([]);
    expect(convert(schema).output.elements).toEqual([{ type: "text", name: "x", isRequired: true }]);
    expect(completeWith(schema, {})[0]).toEqual(["x"]);
    expect(completeWith(schema, { x: "1" })).toEqual([[], { x: "1" }]);
  });

  // AJV: the root holds A's x, required, and its own y beside the $ref.
  it("keeps the fields of a root $ref's target beside the root's own properties", () => {
    const schema = { definitions, $ref: "#/definitions/A", properties: { y: S }, required: ["y"] };
    expect(pointers(schema)).toEqual([]);
    expect(names(schema)).toEqual(["x", "y"]);
    expect(completeWith(schema, {})[0]).toEqual(["x", "y"]);
    expect(completeWith(schema, { x: "1", y: "2" })).toEqual([[], { x: "1", y: "2" }]);
  });

  it("still gives one question for a root $ref to a scalar", () => {
    const schema = { definitions: { S: { type: "string", maxLength: 2 } }, $ref: "#/definitions/S", title: "Name" };
    expect(pointers(schema)).toEqual([]);
    expect(names(schema)).toEqual(["Name"]);
  });

  it("reports a keyword beside a scalar root's $ref that its target sets otherwise once", () => {
    const schema = { $defs: { S: { type: "string", maxLength: 5 } }, $ref: "#/$defs/S", maxLength: 3 };
    expect(convert(schema).report.entries.map((e) => [e.code, e.sourcePointer, e.count])).toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/maxLength", 1]]);
    expect(completeWith(schema, { value: "abcd" })).toEqual([[], { value: "abcd" }]);
  });

  it("reports a remote root $ref beside the root's own properties", () => {
    const schema = { $ref: "https://example.com/root.json", properties: { y: S } };
    expect(pointers(schema)).toEqual([[JsonSchemaCodes.DROPPED_REMOTE_REF, "#"]]);
    expect(names(schema)).toEqual(["y"]);
  });
});

describe("json-schema convert - a JSONForms Control on a property several schemas declare", () => {
  const S = { type: "string" };
  const ui = (scope: string) => ({ type: "VerticalLayout", elements: [{ type: "Control", scope }] });
  const pointers = (input: object) => convert(input).report.entries.map((e) => [e.code, e.sourcePointer]);
  const fails = (schema: object, scope: string, x: string) => loadJsonForms(schema, ui(scope), { x }).getQuestionByName("x").hasErrors(false);

  // AJV: x is at most 3 long, as the second allOf entry says.
  it("merges every declaration of the property under a scope through an allOf entry", () => {
    const schema = { type: "object", allOf: [{ properties: { x: S } }, { properties: { x: { maxLength: 3 } } }] };
    expect(pointers({ schema, uiSchema: ui("#/allOf/0/properties/x") })).toEqual([]);
    expect(fails(schema, "#/allOf/0/properties/x", "abcd")).toBe(true);
    expect(fails(schema, "#/allOf/0/properties/x", "abc")).toBe(false);
  });

  // JSONForms finds x in the oneOf, and AJV validates it with the allOf's maxLength too. The data walk's
  // pointer of the merged object's property names the declaration.
  it("reports a declaration the schema the scope found does not hold", () => {
    const schema = { type: "object", oneOf: [{ properties: { x: S } }], allOf: [{ properties: { x: { maxLength: 3 } } }] };
    expect(pointers({ schema, uiSchema: ui("#/properties/x") })).toEqual([[JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/properties/x"]]);
    const two = { type: "object", oneOf: [{ properties: { x: S } }], allOf: [{ properties: { x: { maxLength: 3 } } }, { properties: { x: { minLength: 1 } } }] };
    expect(pointers({ schema: two, uiSchema: ui("#/properties/x") })).toEqual([
      [JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/allOf/0/properties/x"],
      [JsonSchemaCodes.ASSUMED_ALLOF_MERGE, "#/allOf/1/properties/x"]
    ]);
    expect(fails(schema, "#/properties/x", "abcd")).toBe(false);
  });

  // The data path JSONForms binds drops a then/ inside the property name; the declaration is the property's.
  it("merges every declaration of a property under an object whose name ends in then", () => {
    const schema = { type: "object", properties: { strengthen: { type: "object", properties: { x: S }, allOf: [{ properties: { x: { maxLength: 3 } } }] } } };
    expect(fails(schema, "#/properties/strengthen/properties/x", "abcd")).toBe(true);
    expect(fails(schema, "#/properties/strengthen/properties/x", "abc")).toBe(false);
  });

  // AJV validates x with the maxLength beside its $ref, whichever schema the scope finds it in.
  it("applies a constraint beside the $ref of the schema a scope finds through a combinator", () => {
    const schema = { type: "object", $defs: { S }, oneOf: [{ properties: { x: { $ref: "#/$defs/S", maxLength: 3 } } }] };
    const withAllOf = { ...schema, allOf: [{ properties: { x: { type: "string" } } }] };
    for (const s of [schema, withAllOf]) {
      for (const scope of ["#/oneOf/0/properties/x", "#/properties/x"]) {
        expect(pointers({ schema: s, uiSchema: ui(scope) }), scope).toEqual([]);
        expect(fails(s, scope, "abcd"), scope).toBe(true);
        expect(fails(s, scope, "abc"), scope).toBe(false);
      }
    }
  });

  it("reports nothing for a declaration that sets nothing the found schema does not", () => {
    const schema = { type: "object", properties: { x: S }, anyOf: [{ then: { properties: { x: { type: "string", title: "X" } } } }] };
    expect(pointers({ schema, uiSchema: ui("#/anyOf/0/then/properties/x") })).toEqual([]);
  });
});

describe("json-schema convert - keywords a question cannot hold", () => {
  const pointers = (input: object) => convert(input).report.entries.map((e) => [e.code, e.sourcePointer]);
  const unsupported = (...ptrs: string[]) => ptrs.map((ptr) => [JsonSchemaCodes.UNSUPPORTED_KEYWORD, ptr]);
  const one = (p: object, required = false) => ({ type: "object", properties: { p }, ...(required ? { required: ["p"] } : {}) });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const question = (input: object) => assertConstructsCleanly(convert(input).output, "keywords").getQuestionByName("p") as any;

  it("reports multipleOf, unless every integer meets it", () => {
    expect(pointers(one({ type: "number", multipleOf: 0.5 }))).toEqual(unsupported("#/properties/p/multipleOf"));
    expect(pointers(one({ type: "integer", multipleOf: 3 }))).toEqual(unsupported("#/properties/p/multipleOf"));
    expect(pointers(one({ type: "integer", multipleOf: 1 }))).toEqual([]);
    expect(pointers(one({ type: "number", allOf: [{ multipleOf: 2 }] }))).toEqual(unsupported("#/properties/p/allOf/0/multipleOf"));
    expect(completeWith(one({ type: "number", multipleOf: 0.5 }), { p: 0.3 })).toEqual([[], { p: 0.3 }]);
  });

  it("reports not on a field, an array and an object", () => {
    expect(pointers(one({ type: "string", not: { const: "a" } }))).toEqual(unsupported("#/properties/p/not"));
    expect(pointers(one({ type: "array", items: { enum: ["a", "b"] }, not: { maxItems: 0 } }))).toEqual(unsupported("#/properties/p/not"));
    expect(pointers(one({ type: "object", properties: { a: { type: "string" } }, not: { required: ["a"] } }))).toEqual(unsupported("#/properties/p/not"));
    expect(pointers({ type: "object", properties: { a: { type: "string" } }, not: { required: ["a"] } })).toEqual(unsupported("#/not"));
  });

  it("reports a keyword an allOf merge already reported once, as the merge's", () => {
    const { report } = convert(one({ type: "number", multipleOf: 3, allOf: [{ multipleOf: 5 }] }));
    expect(report.entries.filter((e) => e.sourcePointer === "#/properties/p/allOf/0/multipleOf").map((e) => e.code)).toEqual([JsonSchemaCodes.ASSUMED_ALLOF_MERGE]);
  });

  it("reports nothing for a not false, which constrains nothing", () => {
    const properties = { a: { type: "string" } };
    expect(pointers(one({ type: "string", not: false }))).toEqual([]);
    expect(pointers(one({ type: "array", items: { enum: ["a", "b"] }, not: false }))).toEqual([]);
    expect(pointers(one({ type: "object", properties, not: false }))).toEqual([]);
    expect(pointers({ type: "object", properties, not: false })).toEqual([]);
  });

  // Pydantic v2 and OpenAPI 3.1 write an optional string so: a text question holds exactly that.
  it("reports nothing for a text field's anyOf or oneOf of a string and null", () => {
    for (const key of ["anyOf", "oneOf"]) {
      for (const branches of [[{ type: "string" }, { type: "null" }], [{ type: "null" }, { type: "string" }]]) {
        const schema = one({ [key]: branches, title: "P" });
        expect(pointers(schema), key).toEqual([]);
        expect(question(schema).getType()).toBe("text");
      }
    }
  });

  it("reports an anyOf or oneOf of another type and null on a field that does not hold it", () => {
    expect(pointers(one({ anyOf: [{ type: "integer" }, { type: "null" }] }))).toEqual(unsupported("#/properties/p/anyOf"));
    expect(pointers(one({ oneOf: [{ type: "null" }, { type: "integer" }] }))).toEqual(unsupported("#/properties/p/oneOf"));
    expect(pointers(one({ anyOf: [{ type: "string", format: "date" }, { type: "null" }] }))).toEqual(unsupported("#/properties/p/anyOf"));
    expect(pointers(one({ type: "integer", anyOf: [{ type: "string" }, { type: "null" }] }))).toEqual(unsupported("#/properties/p/anyOf"));
  });

  it("reports a const on a field, which takes any value", () => {
    expect(pointers(one({ type: "string", const: "a" }))).toEqual(unsupported("#/properties/p/const"));
    expect(pointers(one({ type: "boolean", const: true }))).toEqual(unsupported("#/properties/p/const"));
    expect(question(one({ const: "a" })).getType()).toBe("text");
  });

  it("reports type null, which no question holds", () => {
    expect(pointers(one({ type: "null" }))).toEqual(unsupported("#/properties/p/type"));
  });

  it("reports a field's oneOf or anyOf that is not a set of choices", () => {
    expect(pointers(one({ anyOf: [{ type: "string", maxLength: 3 }, { type: "null" }] }))).toEqual(unsupported("#/properties/p/anyOf"));
    expect(pointers(one({ anyOf: [{ type: "array", items: { type: "string" } }, { type: "null" }] }))).toEqual(unsupported("#/properties/p/anyOf"));
    expect(pointers(one({ oneOf: [{ type: "object", properties: { a: { type: "string" } } }, { type: "object", properties: { b: { type: "string" } } }] })))
      .toEqual(unsupported("#/properties/p/oneOf"));
    expect(pointers(one({ type: "array", items: { type: "string" }, anyOf: [{ maxItems: 1 }, { minItems: 3 }] }))).toEqual(unsupported("#/properties/p/anyOf"));
    expect(pointers(one({ oneOf: [{ const: "a" }, { const: "b" }] }))).toEqual([]);
    expect(pointers(one({ enum: ["a", "b"], oneOf: [{ const: "a" }, { const: "b" }] }))).toEqual(unsupported("#/properties/p/oneOf"));
  });

  const choices = { type: "array", items: { enum: ["a", "b", "c"] } };

  it("limits a checkbox to maxItems choices", () => {
    const schema = one({ ...choices, maxItems: 2 });
    expect(pointers(schema)).toEqual([]);
    const q = question(schema);
    expect(q.maxSelectedChoices).toBe(2);
    q.value = ["a", "b"];
    expect(q.visibleChoices.map((c: { isEnabled: boolean }) => c.isEnabled)).toEqual([true, true, false]);
  });

  it("limits a tagbox of choices to maxItems choices", () => {
    const schema = { schema: one({ ...choices, maxItems: 2 }), uiSchema: { p: { "ui:widget": "tagbox" } } };
    expect(pointers(schema)).toEqual([]);
    expect(question(schema).getType()).toBe("tagbox");
    expect(question(schema).maxSelectedChoices).toBe(2);
  });

  it("reports maxItems 0, which allows only an empty array", () => {
    expect(pointers(one({ ...choices, maxItems: 0 }))).toEqual(unsupported("#/properties/p/maxItems"));
    expect(question(one({ ...choices, maxItems: 0 })).maxSelectedChoices).toBe(0);
  });

  // survey-core checks minSelectedChoices on an empty question too, where AJV checks minItems only on
  // an array that is there: only a required array is there whenever the data is valid.
  it("checks minSelectedChoices on an empty question, as survey-core does", () => {
    const survey = assertConstructsCleanly({ elements: [{ type: "checkbox", name: "p", choices: ["a", "b", "c"], minSelectedChoices: 2 }] }, "min");
    expect(survey.getQuestionByName("p").hasErrors(false)).toBe(true);
  });

  it("asks a required array for minItems choices", () => {
    const schema = one({ ...choices, minItems: 2 }, true);
    expect(pointers(schema)).toEqual([]);
    expect(question(schema).minSelectedChoices).toBe(2);
    expect(completeWith(schema, {})[0]).toEqual(["p"]);
    expect(completeWith(schema, { p: ["a"] })[0]).toEqual(["p"]);
    expect(completeWith(schema, { p: ["a", "b"] })).toEqual([[], { p: ["a", "b"] }]);
  });

  it("reports minItems on an optional array, which may be absent", () => {
    const schema = one({ ...choices, minItems: 2 });
    expect(pointers(schema)).toEqual(unsupported("#/properties/p/minItems"));
    expect(question(schema).minSelectedChoices).toBe(0);
    expect(completeWith(schema, {})).toEqual([[], {}]);
  });

  it("reports minItems on a required array of an optional object, which may be absent", () => {
    const schema = { type: "object", properties: { o: { type: "object", properties: { p: { ...choices, minItems: 2 }, t: { type: "string" } }, required: ["p"] } } };
    expect(pointers(schema)).toEqual(unsupported("#/properties/o/properties/p/minItems"));
    expect(completeWith(schema, {})).toEqual([[], {}]);
    expect(completeWith(schema, { t: "x" })[0]).toEqual(["p"]);
  });

  it("holds minItems 0 and uniqueItems on a checkbox without a report", () => {
    expect(pointers(one({ ...choices, minItems: 0, uniqueItems: true }))).toEqual([]);
  });

  it("reports contains on an array", () => {
    expect(pointers(one({ ...choices, contains: { const: "a" } }))).toEqual(unsupported("#/properties/p/contains"));
  });

  it("asks a required tagbox of free items for minItems, and reports what custom items can exceed", () => {
    const free = { type: "array", items: { type: "string" } };
    const required = one({ ...free, minItems: 2 }, true);
    expect(pointers(required)).toEqual([]);
    expect(question(required).minSelectedChoices).toBe(2);
    expect(completeWith(required, { p: ["x"] })[0]).toEqual(["p"]);
    expect(completeWith(required, { p: ["x", "y"] })).toEqual([[], { p: ["x", "y"] }]);
    expect(pointers(one({ ...free, maxItems: 2, uniqueItems: true }))).toEqual(unsupported("#/properties/p/maxItems", "#/properties/p/uniqueItems"));
  });

  it("reports the item counts of a dynamic panel, and sets no panel count", () => {
    const rows = { type: "array", items: { type: "object", properties: { a: { type: "string" } } } };
    const schema = one({ ...rows, minItems: 1, maxItems: 3, uniqueItems: true, contains: { required: ["a"] } }, true);
    expect(pointers(schema)).toEqual(unsupported("#/properties/p/contains", "#/properties/p/maxItems", "#/properties/p/minItems", "#/properties/p/uniqueItems"));
    const q = question(schema);
    expect([q.getType(), q.minPanelCount, q.maxPanelCount]).toEqual(["paneldynamic", 0, 100]);
  });

  it("reports propertyNames, and minProperties and maxProperties that its required keys do not meet", () => {
    const properties = { a: { type: "string" }, b: { type: "string" } };
    expect(pointers(one({ type: "object", properties, propertyNames: { maxLength: 3 } }))).toEqual(unsupported("#/properties/p/propertyNames"));
    expect(pointers(one({ type: "object", properties, minProperties: 1 }))).toEqual(unsupported("#/properties/p/minProperties"));
    expect(pointers(one({ type: "object", properties, required: ["a"], minProperties: 1 }))).toEqual([]);
    expect(pointers(one({ type: "object", properties, maxProperties: 1 }))).toEqual(unsupported("#/properties/p/maxProperties"));
    expect(pointers(one({ type: "object", properties, maxProperties: 2 }))).toEqual([]);
    expect(pointers({ type: "object", properties, minProperties: 1 })).toEqual(unsupported("#/minProperties"));
  });

  it("reports them on a JSONForms form too", () => {
    const schema = { type: "object", properties: { p: { type: "number", multipleOf: 2 } }, minProperties: 1 };
    const uiSchema = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/p" }] };
    expect(pointers({ schema, uiSchema })).toEqual(unsupported("#/minProperties", "#/properties/p/multipleOf"));
  });
});

describe("json-schema convert - report accuracy", () => {
  const where = (report: { entries: ReportEntry[] }, code: string) => report.entries.filter((e) => e.code === code).map((e) => [e.sourcePointer, e.targetPath]);
  const jf = (schema: unknown, scope: string) => convert({ schema, uiSchema: { type: "VerticalLayout", elements: [{ type: "Control", scope }] } });

  it("targets no element for a oneOf of object shapes it cannot model", () => {
    const shape = (k: string) => ({ type: "object", properties: { [k]: { type: "string" } }, required: [k] });
    const root = convert({ type: "object", properties: { a: { type: "string" } }, oneOf: [shape("x"), shape("y")] });
    assertConstructsCleanly(root.output, "oneof-root");
    expect(where(root.report, JsonSchemaCodes.UNSUPPORTED_KEYWORD)).toEqual([["#/oneOf", ""]]);
    const nested = convert({ type: "object", properties: { o: { type: "object", properties: { a: { type: "string" } }, oneOf: [shape("x"), shape("y")] } } });
    assertConstructsCleanly(nested.output, "oneof-nested");
    expect(where(nested.report, JsonSchemaCodes.UNSUPPORTED_KEYWORD)).toEqual([["#/properties/o/oneOf", ""]]);
  });

  it("targets no element for a root anyOf", () => {
    const { output, report } = convert({ type: "object", anyOf: [{ properties: { a: { type: "string" } } }, { properties: { b: { type: "string" } } }] });
    assertConstructsCleanly(output, "anyof-root");
    expect(where(report, JsonSchemaCodes.UNSUPPORTED_KEYWORD)).toEqual([["#/anyOf", ""]]);
  });

  it("targets the selector for an inferred discriminator", () => {
    const variant = (k: string, extra: string) => ({ type: "object", properties: { kind: { const: k }, [extra]: { type: "string" } } });
    const nested = convert({ type: "object", properties: { first: { type: "string" }, o: { type: "object", oneOf: [variant("a", "x"), variant("b", "y")] } } });
    assertConstructsCleanly(nested.output, "inferred-nested");
    expect(where(nested.report, JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR)).toEqual([["#/properties/o/oneOf", "elements[1].elements[0]"]]);
    const root = convert({ type: "object", oneOf: [variant("a", "x"), variant("b", "y")] });
    assertConstructsCleanly(root.output, "inferred-root");
    expect(where(root.report, JsonSchemaCodes.ASSUMED_ONEOF_DISCRIMINATOR)).toEqual([["#/oneOf", "pages[0].elements[0]"]]);
  });

  it("reports a Control on a true property as an unsupported keyword at the property", () => {
    const root = jf({ type: "object", properties: { a: true } }, "#/properties/a");
    assertConstructsCleanly(root.output, "true-root");
    expect(where(root.report, JsonSchemaCodes.UNRESOLVED_SCOPE)).toEqual([]);
    expect(where(root.report, JsonSchemaCodes.UNSUPPORTED_KEYWORD)).toEqual([["#/properties/a", ""]]);
    const nested = jf({ type: "object", properties: { o: { type: "object", properties: { a: true } } } }, "#/properties/o/properties/a");
    assertConstructsCleanly(nested.output, "true-nested");
    expect(where(nested.report, JsonSchemaCodes.UNRESOLVED_SCOPE)).toEqual([]);
    expect(where(nested.report, JsonSchemaCodes.UNSUPPORTED_KEYWORD)).toEqual([["#/properties/o/properties/a", ""]]);
  });

  it("maps a Control on a true property from the declaration that constrains it", () => {
    const { output, report } = jf({ type: "object", allOf: [{ properties: { a: true } }, { properties: { a: { type: "string", maxLength: 3 } } }] }, "#/properties/a");
    const survey = assertConstructsCleanly(output, "true-declared");
    expect(where(report, JsonSchemaCodes.UNRESOLVED_SCOPE)).toEqual([]);
    const q = survey.getQuestionByName("a");
    expect(q.getType()).toBe("text");
    q.value = "abcd";
    expect(q.hasErrors()).toBe(true);
    q.value = "abc";
    expect(q.hasErrors()).toBe(false);
  });

  it("writes the same escaped pointer for a key holding a slash or a tilde in the data walk and the JSONForms walk", () => {
    for (const key of ["a/b", "e~f"]) {
      const escaped = key.replace(/~/g, "~0").replace(/\//g, "~1");
      const schema = { type: "object", properties: { [key]: { type: "number", multipleOf: 2 } } };
      const data = convert(schema);
      assertConstructsCleanly(data.output, "escaped-data");
      const form = jf(schema, `#/properties/${escaped}`);
      assertConstructsCleanly(form.output, "escaped-forms");
      expect(where(data.report, JsonSchemaCodes.UNSUPPORTED_KEYWORD).map((p) => p[0])).toEqual([`#/properties/${escaped}/multipleOf`]);
      expect(where(form.report, JsonSchemaCodes.UNSUPPORTED_KEYWORD).map((p) => p[0])).toEqual([`#/properties/${escaped}/multipleOf`]);
    }
  });

  it("escapes keys in dependency, allOf merge and branch pointers", () => {
    const { output, report } = convert({
      type: "object",
      properties: { "a/b": { type: "string" }, c: { type: "string" } },
      dependencies: { "a/b": { properties: { c: { type: "number" } } } },
      allOf: [{ properties: { "e~f": { type: "string", minLength: 1 } } }, { properties: { "e~f": { type: "string", minLength: 2 } } }]
    });
    assertConstructsCleanly(output, "escaped-more");
    const pointers = report.entries.map((e) => e.sourcePointer);
    expect(pointers.filter((p) => p.includes("a/b") || p.includes("e~f"))).toEqual([]);
    expect(pointers.some((p) => p.includes("a~1b") || p.includes("e~0f"))).toBe(true);
  });
});

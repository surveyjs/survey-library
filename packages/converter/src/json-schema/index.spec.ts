import { describe, it, expect } from "vitest";
import { convert, JsonSchemaCodes } from "./index";
import { UnparseableInputError, WrongFormatError } from "../errors";
import { ReportEntry } from "../report";
import { SurveyJSONElement } from "../types";
import { assertConstructsCleanly } from "../testing/oracle";
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
    expect(findElement(address, "city")?.isRequired).toBe(true);
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
    expect(ssn?.visibleIf).toBe("{country} = 'us'");
    expect(ssn?.requiredIf).toBe("{country} = 'us'");
    expect(findElement(output, "postalCode")?.visibleIf).toBe("{country} <> 'us'");
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
    expect(findElement(convert(schema).output, "s_1")?.requiredIf).toBe("{c_1} = 'y'");
    expect(question(schema, { c_1: "y" }, "s_1").isRequired).toBe(true);
    expect(question(schema, { c: "y" }, "s_1").isRequired).toBe(false);
  });

  it("drives work's s from work's c in if/then properties", () => {
    const schema = twoObjects({ if: { properties: { c: { const: "y" } } }, then: { properties: { s: { type: "string" } } } });
    expect(question(schema, { c_1: "y" }, "s_1").isVisible).toBe(true);
    expect(question(schema, { c: "y" }, "s_1").isVisible).toBe(false);
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
    expect(findElement(convert(schema).output, "s")?.visibleIf).toBe("{panel.c} = 'y'");
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

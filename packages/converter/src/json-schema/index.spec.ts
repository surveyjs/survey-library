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

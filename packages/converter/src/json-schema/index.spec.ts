import { describe, it, expect } from "vitest";
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
    expect(findElement(output, "note")).toMatchObject({ type: "comment", visibleIf: "{c} = 'y'" });
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

  it("reports a node shared by oneOf variants once", () => {
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
      properties: { order: { $ref: "#/definitions/order" } } };
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

  it("still reports a remote $ref on the scope's target as a remote reference", () => {
    const schema = { type: "object", properties: { r: { $ref: "https://example.com/r.json" } } };
    const { output, report } = convert({ schema, uiSchema: control("#/properties/r") });
    expect(entry(report.entries, JsonSchemaCodes.DROPPED_REMOTE_REF)?.bucket).toBe("dropped");
    expect(entry(report.entries, JsonSchemaCodes.UNRESOLVED_SCOPE)).toBeUndefined();
    expect(findElement(output, "r")?.type).toBe("text");
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
    // allOf merges properties and required only, so the merged reference gives a plain question.
    expect(survey.getQuestionByName("merged")).toBeTruthy();
  });

  it("resolves a JSON Pointer fragment after an $id", () => {
    const schema = bundle({ p: { $ref: "https://example.com/schemas/root#/$defs/nested/definitions/flag" } });
    const { output, report } = convert(schema);
    expect(report.entries).toEqual([]);
    expect(findElement(output, "p")?.type).toBe("boolean");
  });

  it("still reports a $ref to a URI no $id declares as a remote reference", () => {
    const { output, report } = convert(bundle({ other: { $ref: "https://example.com/schemas/unknown" } }));
    expect(report.entries.map((e) => [e.code, e.sourcePointer])).toEqual([[JsonSchemaCodes.DROPPED_REMOTE_REF, "#/properties/other"]]);
    expect(findElement(output, "other")?.type).toBe("text");
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
    expect(findElement(output, "kind")?.isRequired).toBe(true);
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

  it("reads a root conditional from an allOf entry and a single anyOf or oneOf entry", () => {
    for (const key of ["allOf", "anyOf", "oneOf"]) {
      const schema = { type: "object", properties, [key]: [{ ...ifKindX, then: { required: ["note"] } }] };
      expect(findElement(convert({ schema, uiSchema }).output, "note")?.requiredIf).toBe("{kind} = 'x'");
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

  it("requires a field under the items' if/then in each row of an array Control's detail layout", () => {
    const schema = { type: "object", properties: { rows: { type: "array", items: nested } } };
    const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#/properties/rows", options: { detail: { type: "VerticalLayout", elements: controls } } }] };
    const { output, report } = convert({ schema, uiSchema: ui });
    expect(report.entries).toEqual([]);
    expect(findElement(output, "note")?.requiredIf).toBe("{panel.kind} = 'x'");
    const panels = (loadJsonForms(schema, ui, { rows: [{ kind: "x" }, { kind: "y" }] }).getQuestionByName("rows") as any).panels;
    expect(panels.map((p: any) => p.getQuestionByName("note").isRequired)).toEqual([true, false]);
  });

  it("follows the root schema's own $ref to its conditionals", () => {
    const schema = { $ref: "#/definitions/u", definitions: { u: { type: "object", properties, ...ifKindX, then: { required: ["note"] } } } };
    expect(findElement(convert({ schema, uiSchema }).output, "note")?.requiredIf).toBe("{kind} = 'x'");
    expect(note(schema, { kind: "x" }).isRequired).toBe(true);
    expect(note(schema, { kind: "y" }).isRequired).toBe(false);
  });

  it("applies the root's conditionals once under a Control on the whole form", () => {
    const schema = { type: "object", properties, ...ifKindX, then: { required: ["note"] }, dependentRequired: { missing: ["note"] } };
    const ui = { type: "VerticalLayout", elements: [{ type: "Control", scope: "#" }] };
    const { output, report } = convert({ schema, uiSchema: ui });
    expect(findElement(output, "note")?.requiredIf).toBe("{kind} = 'x'");
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

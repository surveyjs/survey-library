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
    assertConstructsCleanly(output, "simple-schema");
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

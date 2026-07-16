import { describe, it, expect } from "vitest";
import { convert } from "./index";
import { UnparseableInputError, WrongFormatError } from "../errors";
import simpleSchema from "./fixtures/simple-schema.json";

describe("json-schema convert - format detection", () => {
  it("throws UnparseableInputError on non-objects", () => {
    expect(() => convert(null)).toThrow(UnparseableInputError);
    expect(() => convert("nope")).toThrow(UnparseableInputError);
  });

  it("throws WrongFormatError on a Form.io form", () => {
    expect(() => convert({ display: "form", components: [] })).toThrow(WrongFormatError);
  });

  it("accepts a bare JSON Schema", () => {
    const { output, report } = convert(simpleSchema);
    expect(output).toBeTypeOf("object");
    expect(report.source).toBe("json-schema");
  });

  it("accepts a { schema, uiSchema } envelope", () => {
    const { report } = convert({ schema: simpleSchema, uiSchema: { type: "VerticalLayout" } });
    expect(report.source).toBe("json-schema");
  });
});

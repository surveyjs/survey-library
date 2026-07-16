import { describe, it, expect } from "vitest";
import { convert } from "./index";
import { UnparseableInputError, WrongFormatError } from "../errors";
import simpleForm from "./fixtures/simple-form.json";

describe("formio convert - format detection", () => {
  it("throws UnparseableInputError on non-objects", () => {
    expect(() => convert(null)).toThrow(UnparseableInputError);
    expect(() => convert(42)).toThrow(UnparseableInputError);
    expect(() => convert([])).toThrow(UnparseableInputError);
  });

  it("throws WrongFormatError on a JSON Schema", () => {
    expect(() => convert({ type: "object", properties: {} })).toThrow(WrongFormatError);
  });

  it("throws WrongFormatError on a SurveyJS survey", () => {
    expect(() => convert({ pages: [] })).toThrow(WrongFormatError);
  });

  it("accepts a Form.io form and returns a result + report", () => {
    const { output, report } = convert(simpleForm);
    expect(output).toBeTypeOf("object");
    expect(report.source).toBe("formio");
    expect(Array.isArray(report.entries)).toBe(true);
  });
});

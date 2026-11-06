// The scorer's count of JSON Schema leaves: a key that only a conditional branch declares is a field
// the converter can emit, so the input side of the fidelity ratio counts it once.

import { describe, it, expect } from "vitest";
import { countJsonSchemaLeafProps } from "./scoring.mjs";

describe("countJsonSchemaLeafProps", () => {
  it("counts a key only a then or else branch declares", () => {
    const schema = {
      type: "object",
      properties: { kind: { type: "string" } },
      if: { properties: { kind: { const: "a" } } },
      then: { properties: { onlyThen: { type: "string" } } },
      else: { properties: { onlyElse: { type: "number" } } }
    };
    expect(countJsonSchemaLeafProps(schema)).toBe(3);
  });

  it("counts a key both branches declare, and a key the object declares, once", () => {
    const schema = {
      type: "object",
      properties: { kind: { type: "string" } },
      if: { properties: { kind: { const: "a" } } },
      then: { properties: { shared: { type: "string" }, kind: { type: "string" } } },
      else: { properties: { shared: { type: "string" } } }
    };
    expect(countJsonSchemaLeafProps(schema)).toBe(2);
  });

  it("counts a key only dependentSchemas or dependencies declare", () => {
    const schema = {
      type: "object",
      properties: { card: { type: "string" } },
      dependentSchemas: { card: { properties: { billing: { type: "string" } } } },
      dependencies: { card: { properties: { security: { type: "string" } } }, other: ["card"] }
    };
    expect(countJsonSchemaLeafProps(schema)).toBe(3);
  });

  it("counts a key a branch of an allOf entry declares", () => {
    const schema = {
      type: "object",
      properties: { kind: { type: "string" } },
      allOf: [{ if: { properties: { kind: { const: "a" } } }, then: { properties: { extra: { type: "string" } } } }]
    };
    expect(countJsonSchemaLeafProps(schema)).toBe(2);
  });
});

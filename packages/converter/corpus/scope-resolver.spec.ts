// The scope resolver `corpus/lib.mjs` keeps for the refresh job's pairing (`uiSchemaFitsSchema`)
// against the converter's. lib.mjs cannot import the converter's: refresh runs without a build, and
// the converter publishes `convert` only. So the two must agree on whether a scope resolves, which
// is all the pairing reads: lib.mjs finds a schema exactly when the converter makes no
// `unresolved-scope` entry for a Control on that scope.

import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { convert, JsonSchemaCodes } from "../src/json-schema/index";
import { collectUiScopes, resolveScopeIn } from "./lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "json-schema");

// Whether the converter resolves `scope` in `schema`.
function converterResolves(schema: unknown, scope: string): boolean {
  const { report } = convert({ schema, uiSchema: { type: "Control", scope } });
  return !report.entries.some((e) => e.code === JsonSchemaCodes.UNRESOLVED_SCOPE);
}

// Every scope the pairing reads, in every corpus definition that has a UI schema.
const cases: { file: string, schema: unknown, scope: string }[] = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "_manifest.json").sort()) {
  const def = JSON.parse(readFileSync(join(dir, file), "utf8"));
  if (!def || typeof def !== "object" || def.uiSchema === undefined || def.uiSchema === null) continue;
  for (const scope of new Set(collectUiScopes(def.uiSchema) as string[])) cases.push({ file, schema: def.schema, scope });
}

// Scopes the corpus does not hold, through each path the resolvers take.
const pets = { type: "object", properties: { pet: { $ref: "#/definitions/Pet" } }, definitions: {
  Pet: { type: "object", properties: { kind: { type: "string" } }, oneOf: [{ $ref: "#/definitions/Cat" }] },
  Cat: { allOf: [{ $ref: "#/definitions/Pet" }, { properties: { meow: { type: "boolean" } } }] }
} };
const composed = { type: "object", properties: { a: { type: "string" }, "x/y": { type: "string" }, "t~n": { type: "string" },
  o: { $ref: "#/$defs/o" }, r: { $ref: "https://example.com/r.json" }, list: { type: "array", items: { $ref: "#/$defs/o" } } },
$defs: { o: { type: "object", properties: { id: { type: "string" } } } },
allOf: [{ properties: { inAllOf: { type: "string" } } }], anyOf: [{ then: { properties: { inThen: { type: "string" } } } }],
if: { properties: { a: { const: "x" } } }, else: { properties: { inElse: { type: "string" } } } };
const synthetic: [object, string][] = [
  [pets, "#/properties/pet/properties/kind"], [pets, "#/properties/pet/properties/meow"], [pets, "#/properties/pet/properties/nope"],
  ...["a", "x~1y", "t~0n", "o/properties/id", "o/properties/nope", "r", "r/properties/z", "list/items/properties/id", "inAllOf", "inThen", "inElse",
    "missing"].map((path): [object, string] => [composed, `#/properties/${path}`]),
  [composed, "#/anyOf/0/then/properties/inThen"], [composed, "#"], [composed, "#/"]
];

describe("corpus scope resolver agrees with the converter's", () => {
  it("has corpus scopes to check", () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  it("on every scope of the corpus", () => {
    const disagree = cases.filter(({ schema, scope }) => (resolveScopeIn(schema, scope) !== undefined) !== converterResolves(schema, scope))
      .map(({ file, scope }) => `${file} ${scope}`);
    expect(disagree).toEqual([]);
  });

  for (const [schema, scope] of synthetic) {
    it(`on ${scope}`, () => {
      expect(resolveScopeIn(schema, scope) !== undefined).toBe(converterResolves(schema, scope));
    });
  }
});

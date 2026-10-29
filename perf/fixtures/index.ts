import { FIXTURE_KEYS } from "../harness/ids.ts";
import type { FixtureKey } from "../harness/ids.ts";
import { generateLarge, largeDefaults } from "./large.ts";
import { generateExpressions, expressionsDefaults } from "./expression-heavy.ts";
import { generateCalculations, calculationsDefaults } from "./calculations.ts";
import { generateComplexLogic, complexLogicDefaults } from "./complex-logic.ts";
import { generateManyPages, manyPagesDefaults } from "./many-pages.ts";
import { generateRecords, recordsDefaults } from "./records.ts";
import { countJson } from "./count.ts";

export { FIXTURE_KEYS };
export type { FixtureKey };

export interface Fixture {
  key: string;
  json: any;
  data?: any;
  meta: any;
  options: any;
}

// The options of each key over the generator's defaults; Fixture.options holds the full set, seed included.
export const fixtureOptions: { [key: string]: any } = {
  "large": {},
  "expressions": {},
  "calculations": {},
  "complexLogic": {},
  "manyPages": {},
  "records-1k": { records: 1000 },
  "records-10k": { records: 10000 }
};

export function isFixtureKey(key: string): key is FixtureKey {
  return (FIXTURE_KEYS as ReadonlyArray<string>).indexOf(key) > -1;
}

export function getFixture(key: string, options?: any): Fixture {
  if (!isFixtureKey(key)) throw new Error("Unknown fixture: " + key);
  const defaults: { [key: string]: any } = { "large": largeDefaults, "expressions": expressionsDefaults, "calculations": calculationsDefaults,
    "complexLogic": complexLogicDefaults, "manyPages": manyPagesDefaults, "records-1k": recordsDefaults, "records-10k": recordsDefaults };
  const o = Object.assign({}, defaults[key], fixtureOptions[key], options || {});
  let res: { json: any, data?: any, meta: any };
  if (key === "large") res = generateLarge(o);
  else if (key === "expressions") res = generateExpressions(o);
  else if (key === "calculations") res = generateCalculations(o);
  else if (key === "complexLogic") res = generateComplexLogic(o);
  else if (key === "manyPages") res = generateManyPages(o);
  else res = generateRecords(o);
  // Every meta has the choice-question and expression counts of its JSON; a generator may plan its own.
  const counted = countJson(res.json);
  const meta = Object.assign({ choiceQuestions: counted.choiceQuestions, expressionsPerProperty: counted.expressionsPerProperty }, res.meta);
  return { key: key, json: res.json, data: res.data, meta: meta, options: o };
}

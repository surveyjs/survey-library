import type { PerfScenario } from "../harness/scenario.ts";
import { defineScenarios } from "../harness/scenario.ts";
import * as helpers from "./helpers.ts";
import * as common from "./common.ts";
import * as large from "./large.ts";
import * as expressions from "./expressions.ts";
import * as calculations from "./calculations.ts";
import * as complexLogic from "./complex-logic.ts";
import * as manyPages from "./many-pages.ts";
import * as records from "./records.ts";
import * as extra from "./extra.ts";

// Every scenario of perf/scenarios, the same list in core and in the page (03).
export function allScenarios(): Array<PerfScenario> {
  return defineScenarios(([] as Array<PerfScenario>).concat(
    large.largeScenarios(),
    expressions.expressionsScenarios(),
    calculations.calculationsScenarios(),
    complexLogic.complexLogicScenarios(),
    manyPages.manyPagesScenarios(),
    records.recordsScenarios()
  ));
}

export function scenarioById(id: string): PerfScenario | undefined {
  if (id.indexOf("extra/") === 0) {
    const key = id.split("/").slice(0, 2).join("/");
    return extra.extraScenarios(key).filter((s: PerfScenario) => s.id === id)[0];
  }
  return allScenarios().filter((s: PerfScenario) => s.id === id)[0];
}

export function extraScenarioIds(key: string): Array<string> {
  return extra.extraScenarios(key).map((s: PerfScenario) => s.id);
}

// The functions a scenario may name in `uses`, for its rev hash (revs.ts).
export function helperFunctions(): { [name: string]: Function } {
  const res: { [name: string]: Function } = {};
  [helpers, common, large, expressions, calculations, complexLogic, manyPages, records, extra].forEach((mod: any) => {
    for (const key of Object.keys(mod)) if (typeof mod[key] === "function") res[key] = mod[key];
  });
  return res;
}

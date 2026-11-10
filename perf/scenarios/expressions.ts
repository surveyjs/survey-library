import type { PerfScenario } from "../harness/scenario.ts";
import { loadModel, answerFirst, answerNext, plannedHidden, nextPlannedVisible, nextPlannedHidden } from "./common.ts";

export function expressionsScenarios(): Array<PerfScenario> {
  return [
    loadModel("expressions"),
    answerFirst("expressions", ["plannedHidden"], plannedHidden),
    answerNext("expressions", ["nextPlannedVisible", "nextPlannedHidden", "expectHidden"], nextPlannedHidden, nextPlannedVisible)
  ];
}

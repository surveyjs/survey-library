import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { loadModel, loadDesign, outputScenarios } from "./common.ts";

// large (D02): load, design mode and output. Its pages are hidden at load, so it has no page scenarios (00).
export function answerLarge(ctx: PerfContext, survey: any): void {
  survey.setValue(ctx.fixture.meta.firstAnswer.name, ctx.fixture.meta.firstAnswer.value);
}

export function largeScenarios(): Array<PerfScenario> {
  return [loadModel("large"), loadDesign("large")].concat(outputScenarios("large", "answerLarge", answerLarge));
}

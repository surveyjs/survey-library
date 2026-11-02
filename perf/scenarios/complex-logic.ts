import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { loadModel, loadDesign, answerFirst, answerNext10, plannedHidden, nextPlannedVisible, nextPlannedHidden, outputScenarios } from "./common.ts";

export function answerComplexLogic(ctx: PerfContext, survey: any): void {
  survey.setValue(ctx.fixture.meta.firstAnswer.name, ctx.fixture.meta.firstAnswer.value);
  ctx.fixture.meta.nextAnswers.forEach((a: any) => survey.setValue(a.name, a.value));
}

export function complexLogicScenarios(): Array<PerfScenario> {
  return [
    loadModel("complexLogic"),
    loadDesign("complexLogic"),
    answerFirst("complexLogic", ["plannedHidden"], plannedHidden),
    answerNext10("complexLogic", ["nextPlannedVisible", "nextPlannedHidden", "expectHidden"], nextPlannedHidden, nextPlannedVisible)
  ].concat(outputScenarios("complexLogic", "answerComplexLogic", answerComplexLogic));
}

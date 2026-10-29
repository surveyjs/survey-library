import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { expectThat } from "../harness/scenario.ts";
import { loadModel, answerFirst, answerNext10 } from "./common.ts";

// The answers reach the ends of their chains: the check reads the last value of each chain the answers start.
export function chainEnd(ctx: PerfContext, start: string): string {
  const chain = ctx.fixture.meta.chains.filter((c: any) => c.start === start)[0];
  return chain.steps[chain.steps.length - 1].name;
}

export function chainEndsBefore(ctx: PerfContext, survey: any): any {
  const res: { [name: string]: any } = {};
  [ctx.fixture.meta.firstAnswer].concat(ctx.fixture.meta.nextAnswers.slice(0, 10)).forEach((a: any) => {
    const end = chainEnd(ctx, a.name);
    res[end] = survey.getVariable(end);
  });
  return res;
}

export function firstChainChanged(ctx: PerfContext, survey: any, before: any): void {
  const end = chainEnd(ctx, ctx.fixture.meta.firstAnswer.name);
  expectThat(survey.getVariable(end) !== before[end], "the end of the answered chain changed (" + end + ")");
}

export function nextChainsChanged(ctx: PerfContext, survey: any, before: any): void {
  ctx.fixture.meta.nextAnswers.slice(0, 10).forEach((a: any) => {
    const end = chainEnd(ctx, a.name);
    expectThat(survey.getVariable(end) !== before[end], "the end of the chain of " + a.name + " changed (" + end + ")");
  });
}

export function calculationsScenarios(): Array<PerfScenario> {
  return [
    loadModel("calculations"),
    answerFirst("calculations", ["chainEnd", "chainEndsBefore", "firstChainChanged"], firstChainChanged, chainEndsBefore),
    answerNext10("calculations", ["chainEnd", "chainEndsBefore", "nextChainsChanged"], nextChainsChanged, chainEndsBefore)
  ];
}

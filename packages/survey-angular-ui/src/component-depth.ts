import { InjectionToken, Optional, Provider, SkipSelf } from "@angular/core";

export const COMPONENT_DEPTH = new InjectionToken<number>("SurveyComponentDepth");

export function getComponentDepth(parentDepth: number | null): number {
  return parentDepth === null ? 0 : parentDepth + 1;
}
export const ComponentDepthProvider: Provider = {
  provide: COMPONENT_DEPTH,
  useFactory: getComponentDepth,
  deps: [[new Optional(), new SkipSelf(), COMPONENT_DEPTH]]
};

export const SurveyBaseProviders = [ComponentDepthProvider];
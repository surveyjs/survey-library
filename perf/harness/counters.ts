// Call counts through a few funnels of survey-core, read in the untimed counter run. Only these methods are
// wrapped; a funnel the build lacks gives null, not 0. On master element conditions (visibleIf, enableIf, ...) run
// through ExpressionRunner, so expressionRuns counts them; conditionRuns counts ConditionRunner runs (filters of the
// array functions, triggers and the callers that still use it).
// What a counter is, not how to judge it (the caller decides): work: calls through the funnels; dom: elements under
// #root; render: layouts and style recalcs; leak: growth of listeners and nodes; heap: growth of a heap in KB (CDP,
// browser suites only, cdp.ts).
export type CounterKind = "work" | "dom" | "render" | "leak" | "heap";

export interface CounterValue {
  value: number | null;
  kind: CounterKind;
}

export type Counters = { [name: string]: CounterValue };

export interface Funnel {
  name: string;
  className: string;
  method: string;
}

export const funnels: ReadonlyArray<Funnel> = [
  { name: "conditionRuns", className: "ConditionRunner", method: "runContext" },
  { name: "expressionRuns", className: "ExpressionRunner", method: "runContextCore" },
  { name: "rowsCreated", className: "QuestionMatrixDynamicModel", method: "createMatrixRow" },
  { name: "panelsCreated", className: "QuestionPanelDynamicModel", method: "createNewPanel" }
];

export interface FunnelCounters {
  reset(): void;
  read(): { [name: string]: number | null };
  uninstall(): void;
}

export function installFunnels(Survey: any, list: ReadonlyArray<Funnel> = funnels): FunnelCounters {
  const counts: { [name: string]: number | null } = {};
  const restore: Array<() => void> = [];
  list.forEach((funnel: Funnel) => {
    const cls = Survey[funnel.className];
    const proto = cls && cls.prototype;
    const original = proto ? proto[funnel.method] : undefined;
    if (typeof original !== "function") {
      counts[funnel.name] = null;
      return;
    }
    counts[funnel.name] = 0;
    const hadOwn = Object.prototype.hasOwnProperty.call(proto, funnel.method);
    proto[funnel.method] = function(this: any, ...args: Array<any>): any {
      (counts[funnel.name] as number)++;
      return original.apply(this, args);
    };
    restore.push(() => {
      if (hadOwn) proto[funnel.method] = original;
      else delete proto[funnel.method];
    });
  });
  return {
    reset: (): void => {
      for (const key in counts) if (counts[key] !== null) counts[key] = 0;
    },
    read: (): { [name: string]: number | null } => Object.assign({}, counts),
    uninstall: (): void => { restore.forEach((fn: () => void) => fn()); }
  };
}

export function work(value: number | null): CounterValue {
  return { value: value, kind: "work" };
}

export function dom(value: number | null): CounterValue {
  return { value: value, kind: "dom" };
}

export function render(value: number | null): CounterValue {
  return { value: value, kind: "render" };
}

export function leak(value: number | null): CounterValue {
  return { value: value, kind: "leak" };
}

export function heap(value: number | null): CounterValue {
  return { value: value, kind: "heap" };
}

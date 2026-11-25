import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { expectThat, expectEqual } from "../harness/scenario.ts";
import type { Counters } from "../harness/counters.ts";
import { work } from "../harness/counters.ts";
import { loadModel } from "./common.ts";
import { loadSurvey, releaseSurvey } from "./helpers.ts";

// D03: load/model and answer/first for each PERF_EXTRA_JSON file, local only. The first answer is the first
// choice of the first question with choices; its counts are recorded, never asserted against a plan.
export function firstChoiceQuestion(survey: any): any {
  return survey.getAllQuestions(false).filter((q: any) => Array.isArray(q.visibleChoices) && q.visibleChoices.length > 0)[0];
}

// The operations of an extra file's <base>.ops.json, one scenario each: extra/<base>/ops/<id>. Every op but `data`
// runs on a fresh model with the fixture data already assigned (untimed setup), after the `before` answers.
// samples: the samples kept (all of them when 5 or fewer); warmup: the warm-ups (default 2). A slow op sets both low.
export interface ExtraOp {
  id: string;
  op: string;
  samples?: number;
  warmup?: number;
  // set, panel-question: the value name; cell, row-cell, panel-question, type: the question.
  name?: string;
  question?: string;
  row?: string | number;
  column?: string;
  panelIndex?: number;
  value?: any;
  text?: string;
  // setValue(name, value) calls after the data, in the untimed setup: the state the op starts from.
  before?: Array<{ name: string, value: any }>;
}

interface OpKind {
  // The fields the op needs besides id and op.
  fields: Array<string>;
  // The number of data assignments in the setup.
  dataTimes: number;
  prepare(survey: any, op: ExtraOp): any;
  run(state: any): void;
  check(state: any): void;
  counters?(state: any): Counters;
}

const copy = (v: any): any => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

function sameValue(ctx: PerfContext, actual: any, expected: any, message: string): void {
  expectThat(ctx.Survey.Helpers.isTwoValueEquals(actual, expected), message + ": expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual));
}

function expectMerged(ctx: PerfContext, actual: any, merged: any, path: string): void {
  if (!merged || typeof merged !== "object" || Array.isArray(merged)) return sameValue(ctx, actual, merged, path);
  expectThat(!!actual && typeof actual === "object", path + " is an object");
  Object.keys(merged).forEach((k: string) => expectMerged(ctx, actual[k], merged[k], path + "." + k));
}

// The top-level keys of the data whose value in the survey differs from the data assigned (a load that rewrites
// answers shows here).
function dataDiffs(ctx: PerfContext, survey: any, data: any): number {
  return Object.keys(data).filter((k: string) => !ctx.Survey.Helpers.isTwoValueEquals(survey.getValue(k), data[k])).length;
}

function question(survey: any, name: string): any {
  const q = survey.getQuestionByName(name);
  expectThat(!!q, "the survey has the question " + name);
  return q;
}

function matrixRow(matrix: any, row: string | number): any {
  const rows = matrix.visibleRows;
  const res = typeof row === "number" ? rows[row] : rows.filter((r: any) => r.rowName === row)[0];
  expectThat(!!res, matrix.name + " has the visible row " + row);
  return res;
}

const assignData: Omit<OpKind, "dataTimes"> = {
  fields: [],
  prepare: (): any => ({}),
  run: (s: any): void => { s.survey.data = s.data; },
  check: (s: any): void => {
    const keys = Object.keys(s.ctx.fixture.data);
    expectThat(keys.length === 0 || dataDiffs(s.ctx, s.survey, s.ctx.fixture.data) < keys.length, "the data is set");
  },
  counters: (s: any): Counters => ({ dataDiffs: work(dataDiffs(s.ctx, s.survey, s.ctx.fixture.data)) })
};

const opKinds: { [kind: string]: OpKind } = {
  "data": Object.assign({ dataTimes: 0 }, assignData),
  "data-again": Object.assign({ dataTimes: 1 }, assignData),
  "merge": {
    fields: ["value"], dataTimes: 1,
    prepare: (survey: any, op: ExtraOp): any => ({ value: copy(op.value) }),
    run: (s: any): void => { s.survey.mergeData(s.value); },
    // mergeData merges objects key by key: each merged leaf is set, the keys it does not name stay.
    check: (s: any): void => expectMerged(s.ctx, s.survey.data, s.op.value, "merged")
  },
  "set": {
    fields: ["name", "value"], dataTimes: 1,
    prepare: (survey: any, op: ExtraOp): any => ({ value: copy(op.value) }),
    run: (s: any): void => { s.survey.setValue(s.op.name, s.value); },
    check: (s: any): void => sameValue(s.ctx, s.survey.getValue(s.op.name), s.op.value, "the value of " + s.op.name)
  },
  // matrix.value with one cell changed: a dropdown matrix by row value, a dynamic matrix by row index.
  "cell": {
    fields: ["question", "row", "column", "value"], dataTimes: 1,
    prepare: (survey: any, op: ExtraOp): any => {
      const m = question(survey, op.question as string);
      const value = copy(m.value) || (typeof op.row === "number" ? [] : {});
      value[op.row as any] = Object.assign({}, value[op.row as any], { [op.column as string]: copy(op.value) });
      return { m: m, value: value };
    },
    run: (s: any): void => { s.m.value = s.value; },
    check: (s: any): void => sameValue(s.ctx, (s.m.value || {})[s.op.row] && s.m.value[s.op.row][s.op.column], s.op.value, "the cell " + s.op.row + "." + s.op.column)
  },
  // The cell question of a visible row: a dropdown matrix row by its value, a dynamic matrix row by index.
  "row-cell": {
    fields: ["question", "row", "column", "value"], dataTimes: 1,
    prepare: (survey: any, op: ExtraOp): any => {
      const row = matrixRow(question(survey, op.question as string), op.row as any);
      const q = row.getQuestionByColumnName(op.column);
      expectThat(!!q, "the row has the column " + op.column);
      return { row: row, q: q, value: copy(op.value) };
    },
    run: (s: any): void => { s.q.value = s.value; },
    check: (s: any): void => {
      sameValue(s.ctx, s.q.value, s.op.value, "the cell question");
      sameValue(s.ctx, s.row.getValue(s.op.column), s.op.value, "the row value");
    }
  },
  "panel-question": {
    fields: ["question", "panelIndex", "name", "value"], dataTimes: 1,
    prepare: (survey: any, op: ExtraOp): any => {
      const panel = question(survey, op.question as string).panels[op.panelIndex as number];
      expectThat(!!panel, op.question + " has the panel " + op.panelIndex);
      const q = panel.getQuestionByName(op.name);
      expectThat(!!q, "the panel has the question " + op.name);
      return { q: q, value: copy(op.value) };
    },
    run: (s: any): void => { s.q.value = s.value; },
    check: (s: any): void => sameValue(s.ctx, s.q.value, s.op.value, "the panel question")
  },
  // One value assignment per character, as textUpdateMode: "onTyping" makes them.
  "type": {
    fields: ["question", "text"], dataTimes: 1,
    prepare: (survey: any, op: ExtraOp): any => {
      const q = question(survey, op.question as string);
      expectThat(q.value !== op.text, op.question + " differs from the text before the sample");
      return { q: q };
    },
    run: (s: any): void => {
      let text = "";
      for (const ch of s.op.text) {
        text += ch;
        s.q.value = text;
      }
    },
    check: (s: any): void => expectEqual(s.q.value, s.op.text, "the typed text")
  }
};

export const extraOpKinds = Object.keys(opKinds);

function validateOps(ops: Array<ExtraOp>): void {
  const seen: { [id: string]: boolean } = {};
  ops.forEach((op: ExtraOp, index: number) => {
    const where = "ops[" + index + "]" + (op && op.id ? " (" + op.id + ")" : "");
    if (!op || typeof op.id !== "string" || !/^[A-Za-z0-9-]+$/.test(op.id)) throw new Error("PERF_EXTRA_JSON ops: " + where + ": id must match [A-Za-z0-9-]+");
    if (seen[op.id]) throw new Error("PERF_EXTRA_JSON ops: duplicate id " + op.id);
    seen[op.id] = true;
    const kind = opKinds[op.op];
    if (!kind) throw new Error("PERF_EXTRA_JSON ops: " + where + ": op must be one of " + extraOpKinds.join(", ") + ", got " + op.op);
    const missing = kind.fields.filter((f: string) => !(f in op));
    if (missing.length > 0) throw new Error("PERF_EXTRA_JSON ops: " + where + ": " + op.op + " needs " + missing.join(", "));
    ["samples", "warmup"].forEach((f: string) => {
      const v = (op as any)[f];
      if (v !== undefined && !(Number.isInteger(v) && v >= (f === "samples" ? 1 : 0))) throw new Error("PERF_EXTRA_JSON ops: " + where + ": bad " + f + " " + v);
    });
  });
}

export function extraOpScenario(key: string, op: ExtraOp): PerfScenario {
  const kind = opKinds[op.op];
  return {
    id: key + "/ops/" + op.id, rev: 1, fixture: key, kind: "action", uses: ["loadSurvey", "releaseSurvey"], samples: op.samples, warmup: op.warmup,
    setup: async(ctx: PerfContext): Promise<any> => {
      // Every op assigns the data or starts from it.
      expectThat(ctx.fixture.data !== undefined, "the fixture has a data file (" + op.op + ")");
      const survey = await loadSurvey(ctx, (s: any) => {
        for (let i = 0; i < kind.dataTimes; i++) s.data = copy(ctx.fixture.data);
        (op.before || []).forEach((b: { name: string, value: any }) => s.setValue(b.name, copy(b.value)));
      });
      return Object.assign({ ctx: ctx, op: op, survey: survey, data: copy(ctx.fixture.data) }, kind.prepare(survey, op));
    },
    run: (ctx: PerfContext, s: any): void => kind.run(s),
    check: (ctx: PerfContext, s: any): void => kind.check(s),
    counters: kind.counters ? (ctx: PerfContext, s: any): Counters => (kind.counters as (s: any) => Counters)(s) : undefined,
    teardown: (ctx: PerfContext, s: any): void => releaseSurvey(ctx, s.survey)
  };
}

export function extraScenarios(key: string, ops: Array<ExtraOp> = []): Array<PerfScenario> {
  validateOps(ops);
  return [loadModel(key), {
    id: key + "/answer/first", rev: 1, fixture: key, kind: "action", uses: ["loadSurvey", "releaseSurvey", "firstChoiceQuestion"],
    setup: async(ctx: PerfContext): Promise<any> => {
      const survey = await loadSurvey(ctx);
      const q = firstChoiceQuestion(survey);
      expectThat(!!q, "the survey has a question with choices");
      // A checkbox or tagbox keeps an array: the first choice alone.
      const choice = q.visibleChoices[0].value;
      return { survey: survey, q: q, value: q.isValueArray ? [choice] : choice };
    },
    run: (ctx: PerfContext, s: any): void => { s.q.value = s.value; },
    check: (ctx: PerfContext, s: any): void => sameValue(ctx, s.q.value, s.value, "the answer is set"),
    teardown: (ctx: PerfContext, s: any): void => releaseSurvey(ctx, s.survey)
  }].concat(ops.map((op: ExtraOp) => extraOpScenario(key, op)));
}

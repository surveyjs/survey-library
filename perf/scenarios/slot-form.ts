import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { expectThat, expectEqual } from "../harness/scenario.ts";
import type { Counters } from "../harness/counters.ts";
import { work } from "../harness/counters.ts";
import { loadModel } from "./common.ts";
import { loadSurvey, releaseSurvey } from "./helpers.ts";

// The keyed slot form (fixtures/slot-form.ts): its data loads and the answers that reach the slot machinery. Every
// sample starts from a fresh model; an answer starts from the model with the data assigned (untimed), so it is the
// first change after a load.

export function copyValue(v: any): any {
  return v === undefined ? undefined : JSON.parse(JSON.stringify(v));
}

// Whether a value holds every leaf of the expected one: the slot records also hold what their expression questions
// computed, and a matrix its default cells.
export function holdsValue(ctx: PerfContext, actual: any, expected: any): boolean {
  if (expected === null || typeof expected !== "object") return ctx.Survey.Helpers.isTwoValueEquals(actual, expected);
  if (Array.isArray(expected) && (!Array.isArray(actual) || actual.length < expected.length)) return false;
  if (!actual || typeof actual !== "object") return false;
  return Object.keys(expected).every((k: string) => holdsValue(ctx, actual[k], expected[k]));
}

// The top-level data keys whose loaded answer the survey does not hold, except the "who" answers a data load
// overwrites before 02 (meta.overwrittenBefore02): 02 removes the overwrite, and then the skip.
export function lostAnswers(ctx: PerfContext, survey: any): Array<string> {
  const skip = ctx.fixture.meta.overwrittenBefore02;
  return Object.keys(ctx.fixture.data).filter((k: string) => skip.indexOf(k) < 0 && !holdsValue(ctx, survey.getValue(k), ctx.fixture.data[k]));
}

// A counter: the top-level data keys whose loaded answer differs after the load, the overwritten ones included.
export function dataDiffs(ctx: PerfContext, survey: any): Counters {
  return { dataDiffs: work(Object.keys(ctx.fixture.data).filter((k: string) => !holdsValue(ctx, survey.getValue(k), ctx.fixture.data[k])).length) };
}

export function slotPanel(survey: any, index: number): any {
  const panel = survey.getQuestionByName("slots").panels[index];
  expectThat(!!panel, "the slot panel " + index + " exists");
  return panel;
}

// The slots that are on: the count value and whether the slot's panel and grid row are shown.
export function expectSlots(ctx: PerfContext, survey: any, on: number): void {
  const meta = ctx.fixture.meta;
  expectEqual(survey.getVariable(meta.count), on, "slots on");
  const grid = survey.getQuestionByName("grid");
  meta.slots.forEach((k: string, i: number) => {
    expectEqual(survey.getVariable(meta.slotActive[i]), i < on, "slot " + k + " is on");
    if (i > on + 1) return;
    expectEqual(slotPanel(survey, i).isVisible, i < on, "the panel of slot " + k + " is shown");
    expectEqual(grid.visibleRows.some((r: any) => r.rowName === k), i < on, "the grid row of slot " + k + " is shown");
  });
}

// load/data and load/data-again: `survey.data =` once or a second time on a fresh model.
// data-again assigns the data once in the untimed setup. That load warms the code the timed one runs, so data-again
// has no warm-ups: with them a process ran 8 samples of two loads each and passed the 300 s hang guard.
export function assignDataFirst(ctx: PerfContext, survey: any): void {
  survey.data = copyValue(ctx.fixture.data);
}

export function slotDataLoad(fixture: string, op: string, before?: (ctx: PerfContext, survey: any) => void): PerfScenario {
  return {
    id: fixture + "/load/" + op, rev: 1, fixture: fixture, kind: "load", warmup: before ? 0 : undefined,
    uses: ["loadSurvey", "releaseSurvey", "copyValue", "lostAnswers", "dataDiffs", "expectSlots"].concat(before ? [before.name] : []),
    setup: async(ctx: PerfContext): Promise<any> => {
      const survey = await loadSurvey(ctx, (s: any) => { if (before) before(ctx, s); });
      return { survey: survey, data: copyValue(ctx.fixture.data) };
    },
    run: (ctx: PerfContext, s: any): void => { s.survey.data = s.data; },
    check: (ctx: PerfContext, s: any): void => {
      const lost = lostAnswers(ctx, s.survey);
      expectThat(lost.length === 0, "the loaded answers are there, lost: " + lost.slice(0, 5).join(", "));
      expectSlots(ctx, s.survey, ctx.fixture.meta.activeSlots);
    },
    counters: (ctx: PerfContext, s: any): Counters => dataDiffs(ctx, s.survey),
    teardown: (ctx: PerfContext, s: any): void => releaseSurvey(ctx, s.survey)
  };
}

// The answer scenarios: a fresh model with the data assigned (and `before` answers), then one timed change.
export interface SlotAnswer {
  op: string;
  before?: (ctx: PerfContext, survey: any) => void;
  prepare?: (ctx: PerfContext, survey: any) => any;
  run: (ctx: PerfContext, s: any) => void;
  check: (ctx: PerfContext, s: any) => void;
  uses: Array<string>;
}

export function slotAnswerScenario(fixture: string, group: string, a: SlotAnswer): PerfScenario {
  return {
    id: fixture + "/" + group + "/" + a.op, rev: 1, fixture: fixture, kind: "action", uses: ["loadSurvey", "releaseSurvey", "copyValue"].concat(a.uses),
    setup: async(ctx: PerfContext): Promise<any> => {
      const survey = await loadSurvey(ctx, (s: any) => {
        s.data = copyValue(ctx.fixture.data);
        if (a.before) a.before(ctx, s);
      });
      return Object.assign({ survey: survey }, a.prepare ? a.prepare(ctx, survey) : {});
    },
    run: a.run,
    check: a.check,
    teardown: (ctx: PerfContext, s: any): void => releaseSurvey(ctx, s.survey)
  };
}

// The values the answers write.
export const slotAnswerValues = {
  name: { i1: "w1", i2: "w2", i3: "w3", i4: "w4" },
  merged: { i1: "m1", i3: "m3" },
  cell: "cell k2",
  date: "2012-01-01",
  slotText: "Edited 1",
  typed: "abcdefghij"
};

export function mergeName(ctx: PerfContext, s: any): void {
  s.survey.mergeData({ [ctx.fixture.meta.sharedName]: copyValue(slotAnswerValues.merged) });
}

export function checkMergedName(ctx: PerfContext, s: any): void {
  const name = s.survey.getValue(ctx.fixture.meta.sharedName);
  expectEqual(name.i1, slotAnswerValues.merged.i1, "the merged part 1");
  expectEqual(name.i3, slotAnswerValues.merged.i3, "the merged part 3");
  expectThat(name.i2 === ctx.fixture.data[ctx.fixture.meta.sharedName].i2, "part 2 stays");
}

export function setName(ctx: PerfContext, s: any): void {
  s.survey.setValue(ctx.fixture.meta.sharedName, copyValue(slotAnswerValues.name));
}

// The shared text reaches the grid row of k0 (a column setValueIf) and part 2 of slot k0 (a template one).
export function checkName(ctx: PerfContext, s: any): void {
  const meta = ctx.fixture.meta;
  expectThat(holdsValue(ctx, s.survey.getValue(meta.sharedName), slotAnswerValues.name), "the shared text is set");
  expectEqual(s.survey.getValue("grid").k0.col1, slotAnswerValues.name.i1, "the grid row of k0 copies part 1");
  expectEqual(slotPanel(s.survey, 0).getQuestionByName(meta.slotPart2).value, slotAnswerValues.name.i2, "slot k0 copies part 2");
}

export function setToggleOff(ctx: PerfContext, s: any): void {
  s.survey.setValue(ctx.fixture.meta.toggle, false);
}

// count-on starts with the boolean off (untimed), so the timed answer turns slot k1 on.
export function toggleOffFirst(ctx: PerfContext, survey: any): void {
  survey.setValue(ctx.fixture.meta.toggle, false);
}

export function setToggleOn(ctx: PerfContext, s: any): void {
  s.survey.setValue(ctx.fixture.meta.toggle, true);
}

// Turning slot k1 off leaves k0, k2 and k3 on: the count is one less and k1's panel and row are hidden.
export function checkToggleOff(ctx: PerfContext, s: any): void {
  const meta = ctx.fixture.meta;
  expectEqual(s.survey.getValue(meta.toggle), false, "the boolean is off");
  expectEqual(s.survey.getVariable(meta.count), meta.activeSlots - 1, "slots on");
  expectEqual(slotPanel(s.survey, 1).isVisible, false, "the panel of slot k1 is hidden");
  expectEqual(slotPanel(s.survey, 2).isVisible, true, "the panel of slot k2 is shown");
}

export function checkToggleOn(ctx: PerfContext, s: any): void {
  expectEqual(s.survey.getValue(ctx.fixture.meta.toggle), true, "the boolean is on");
  expectSlots(ctx, s.survey, ctx.fixture.meta.activeSlots);
}

export function setCountUp(ctx: PerfContext, s: any): void {
  s.survey.setValue(ctx.fixture.meta.countB, ctx.fixture.meta.activeSlots - 1);
}

export function checkCountUp(ctx: PerfContext, s: any): void {
  expectEqual(s.survey.getValue(ctx.fixture.meta.countB), ctx.fixture.meta.activeSlots - 1, "the count");
  expectSlots(ctx, s.survey, ctx.fixture.meta.activeSlots + 1);
}

// A screen answer that selects a choice the data does not: a "who" of that choice is shown.
export function screenAnswer(ctx: PerfContext): any {
  const meta = ctx.fixture.meta;
  return { name: meta.screens[1], value: ctx.fixture.data[meta.screens[1]].concat([meta.screenAdded.choice]) };
}

export function setScreen(ctx: PerfContext, s: any): void {
  const a = screenAnswer(ctx);
  s.survey.setValue(a.name, a.value);
}

export function checkScreen(ctx: PerfContext, s: any): void {
  const a = screenAnswer(ctx);
  expectThat(holdsValue(ctx, s.survey.getValue(a.name), a.value), "the screen answer is set");
  expectEqual(s.survey.getQuestionByName(ctx.fixture.meta.screenAdded.who).isVisible, true, "the \"who\" of the selected choice is shown");
}

// The grid cell of slot k2's text A through matrix.value: the slot's panel copies it.
export function prepareCell(ctx: PerfContext, survey: any): any {
  const grid = survey.getQuestionByName("grid");
  const value = copyValue(grid.value);
  value.k2 = Object.assign({}, value.k2, { col1: slotAnswerValues.cell });
  return { grid: grid, value: value };
}

export function setCell(ctx: PerfContext, s: any): void {
  s.grid.value = s.value;
}

export function checkCell(ctx: PerfContext, s: any): void {
  expectEqual(s.grid.value.k2.col1, slotAnswerValues.cell, "the grid cell");
  expectEqual(slotPanel(s.survey, 2).getQuestionByName(ctx.fixture.meta.slotTextA).value, slotAnswerValues.cell, "slot k2 copies text A");
}

// The date cell question of slot k3's grid row: the slot's date expression and an age follow.
export function prepareRowCell(ctx: PerfContext, survey: any): any {
  const row = survey.getQuestionByName("grid").visibleRows.filter((r: any) => r.rowName === "k3")[0];
  expectThat(!!row, "the grid row of k3 is shown");
  return { row: row, q: row.getQuestionByColumnName("col3") };
}

export function setRowCell(ctx: PerfContext, s: any): void {
  s.q.value = slotAnswerValues.date;
}

export function checkRowCell(ctx: PerfContext, s: any): void {
  expectEqual(s.row.getValue("col3"), slotAnswerValues.date, "the row value");
  expectEqual(slotPanel(s.survey, 3).getQuestionByName(ctx.fixture.meta.slotDate).value, slotAnswerValues.date, "slot k3's date follows");
}

// Text A of slot k0's panel: the slot's joined text expression follows.
export function prepareSlotQuestion(ctx: PerfContext, survey: any): any {
  const panel = slotPanel(survey, 0);
  return { panel: panel, q: panel.getQuestionByName(ctx.fixture.meta.slotTextA) };
}

export function setSlotQuestion(ctx: PerfContext, s: any): void {
  s.q.value = slotAnswerValues.slotText;
}

export function checkSlotQuestion(ctx: PerfContext, s: any): void {
  const meta = ctx.fixture.meta;
  expectEqual(s.q.value, slotAnswerValues.slotText, "the slot question");
  const full = String(s.panel.getQuestionByName(meta.slotJoined).value);
  expectEqual(full.substring(0, slotAnswerValues.slotText.length + 1), slotAnswerValues.slotText + " ", "slot k0's joined text follows");
}

// Typing into a text no expression reads, one value per character (textUpdateMode: "onTyping").
export function prepareTyped(ctx: PerfContext, survey: any): any {
  const q = survey.getQuestionByName(ctx.fixture.meta.typed);
  expectThat(q.value !== slotAnswerValues.typed, "the text differs before the sample");
  return { q: q };
}

export function typeText(ctx: PerfContext, s: any): void {
  let text = "";
  for (const ch of slotAnswerValues.typed) {
    text += ch;
    s.q.value = text;
  }
}

export function checkTyped(ctx: PerfContext, s: any): void {
  expectEqual(s.q.value, slotAnswerValues.typed, "the typed text");
}

export function slotFormScenarios(fixture: string): Array<PerfScenario> {
  const answer = (a: SlotAnswer): PerfScenario => slotAnswerScenario(fixture, "answer", a);
  return [
    loadModel(fixture),
    slotDataLoad(fixture, "data"),
    slotDataLoad(fixture, "data-again", assignDataFirst),
    slotAnswerScenario(fixture, "load", { op: "merge", run: mergeName, check: checkMergedName, uses: ["mergeName", "checkMergedName", "slotAnswerValues"] }),
    answer({ op: "shared-name", run: setName, check: checkName, uses: ["setName", "checkName", "holdsValue", "slotPanel", "slotAnswerValues"] }),
    answer({ op: "count-off", run: setToggleOff, check: checkToggleOff, uses: ["setToggleOff", "checkToggleOff", "slotPanel"] }),
    answer({ op: "count-on", before: toggleOffFirst, run: setToggleOn, check: checkToggleOn, uses: ["toggleOffFirst", "setToggleOn", "checkToggleOn", "expectSlots"] }),
    answer({ op: "count-up", run: setCountUp, check: checkCountUp, uses: ["setCountUp", "checkCountUp", "expectSlots"] }),
    answer({ op: "screen", run: setScreen, check: checkScreen, uses: ["setScreen", "checkScreen", "screenAnswer", "holdsValue"] }),
    answer({ op: "cell", prepare: prepareCell, run: setCell, check: checkCell, uses: ["prepareCell", "setCell", "checkCell", "slotPanel", "slotAnswerValues"] }),
    answer({ op: "row-cell", prepare: prepareRowCell, run: setRowCell, check: checkRowCell, uses: ["prepareRowCell", "setRowCell", "checkRowCell", "slotPanel", "slotAnswerValues"] }),
    answer({ op: "slot-question", prepare: prepareSlotQuestion, run: setSlotQuestion, check: checkSlotQuestion,
      uses: ["prepareSlotQuestion", "setSlotQuestion", "checkSlotQuestion", "slotPanel", "slotAnswerValues"] }),
    answer({ op: "type", prepare: prepareTyped, run: typeText, check: checkTyped, uses: ["prepareTyped", "typeText", "checkTyped", "slotAnswerValues"] })
  ];
}

// The full-size form, local only (ids.ts LOCAL_IDS): a sample takes minutes at the baseline, so one sample and no
// warm-up; PERF_EXTRA_TIMEOUT_MS raises its hang guard.
export function slotFormFullScenarios(): Array<PerfScenario> {
  return slotFormScenarios("slotForm-full").map((s: PerfScenario) => Object.assign({}, s, { samples: 1, warmup: 0 }));
}

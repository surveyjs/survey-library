import type { PerfContext } from "../harness/scenario.ts";
import { expectThat } from "../harness/scenario.ts";
import type { Counters } from "../harness/counters.ts";
import { work } from "../harness/counters.ts";

// Helpers the scenarios call. A scenario lists the ones it calls in `uses`: their source is part of its rev hash
// (00, Ids), so a change here shows as a changed hash.

// A fresh survey from the fixture text, prepared (answers, data) before it is shown; in a page it is rendered and
// settled. Records the jsonErrors count of the last survey loaded.
export async function loadSurvey(ctx: PerfContext, prepare?: (survey: any) => void): Promise<any> {
  const survey = new ctx.Survey.Model(JSON.parse(ctx.fixture.text));
  ctx.cache.jsonErrors = survey.jsonErrors ? survey.jsonErrors.length : 0;
  if (prepare) prepare(survey);
  if (ctx.page) await ctx.page.show(survey);
  return survey;
}

// One survey per process or page, kept between samples, for scenarios whose setup restores the state instead of
// reloading (00, Budgets).
export async function cachedSurvey(ctx: PerfContext, prepare?: (survey: any) => void): Promise<any> {
  if (!ctx.cache.survey) ctx.cache.survey = await loadSurvey(ctx, prepare);
  return ctx.cache.survey;
}

// The page of the survey an element is on, shown before an action in the page (untimed).
export async function showPageOf(ctx: PerfContext, survey: any, name: string): Promise<void> {
  const el = survey.getQuestionByName(name) || survey.getPanelByName(name);
  const page = el.page;
  if (survey.currentPage !== page) {
    survey.currentPage = page;
    if (ctx.page) await ctx.page.updated();
  }
}

// The element of a question in the page.
export function questionElement(ctx: PerfContext, question: any): any {
  return ctx.page ? ctx.page.query("[data-name=\"" + question.name + "\"]") : undefined;
}

// The text of the first data row's cell of a column of a rendered matrix (03: record a DOM fact).
export function renderedCell(ctx: PerfContext, question: any, column: string): string | undefined {
  if (!ctx.page) return undefined;
  const index = question.renderedTable.headerRow.cells.map((c: any) => c.column && c.column.name).indexOf(column);
  const row = ctx.page.query("[data-name=\"" + question.name + "\"] tbody tr.sd-table__row");
  const cell = row ? row.children[index] : undefined;
  if (!cell) return undefined;
  const input = cell.querySelector("input, textarea");
  return input ? input.value : (cell.textContent || "").trim();
}

// The end of a sample. In a page the shown survey stays until show() replaces it, which disposes it.
export function releaseSurvey(ctx: PerfContext, survey: any): void {
  if (!ctx.page && survey && !survey.isDisposed) survey.dispose();
}

// Every planned element is hidden after the answer that hides it (01 check 6).
export function expectHidden(survey: any, names: Array<string>, what: string): void {
  names.forEach((name: string) => {
    const el = survey.getQuestionByName(name) || survey.getPanelByName(name);
    expectThat(!!el, what + ": " + name + " exists");
    expectThat(!el.isVisible, what + ": " + name + " is hidden");
  });
}

export function visibleElementCount(survey: any): number {
  return survey.getAllQuestions(true).length + survey.getAllPanels(true).length;
}

// The records of data.orders sorted as the question sorts them: numbers by value, strings by localeCompare.
export function sortRecords(records: Array<any>, criteria: Array<{ field: string, direction: string }>): Array<any> {
  const list = records.slice();
  list.sort((a: any, b: any): number => {
    for (const c of criteria) {
      const x = a[c.field];
      const y = b[c.field];
      let r = 0;
      if (typeof x === "number" && typeof y === "number") r = x - y;
      else r = String(x).localeCompare(String(y));
      if (r !== 0) return c.direction === "desc" ? -r : r;
    }
    return 0;
  });
  return list;
}

// The records the filter of the records scenarios keeps: "{status} = '<status>' and {total} > <min>".
export function filterRecords(records: Array<any>, status: string, minTotal: number): Array<any> {
  return records.filter((r: any) => r.status === status && r.total > minTotal);
}

export function sum(list: Array<any>, field: string): number {
  return list.reduce((s: number, r: any) => s + (typeof r[field] === "number" ? r[field] : 0), 0);
}

// The ids of the shown page of a records question, in order.
export function shownIds(question: any): Array<any> {
  if (question.getType() === "paneldynamic") return question.panels.map((p: any) => p.getQuestionByName("id").value);
  return question.visibleRows.map((r: any) => r.getValue("id"));
}

// The shown page is the first page of the records sorted by the criteria (ties in data order), and it differs from
// the page the starting sort shows, so a sort that did nothing fails.
export function expectSortedPage(question: any, records: Array<any>, criteria: Array<any>, starting: Array<any>, what: string): void {
  const size = question.pageSize;
  const expected = sortRecords(records, criteria).slice(0, size).map((r: any) => r.id);
  const before = sortRecords(records, starting).slice(0, size).map((r: any) => r.id);
  expectThat(JSON.stringify(expected) !== JSON.stringify(before), what + ": the sort changes the first page");
  const shown = shownIds(question);
  expectThat(JSON.stringify(shown) === JSON.stringify(expected), what + ": the first page in sort order, got " + JSON.stringify(shown.slice(0, 3)));
}

// The value of a records question's first shown row (a matrix row) or panel.
export function firstShown(question: any, field: string): any {
  if (question.getType() === "paneldynamic") {
    const panel = question.panels[0];
    return panel ? panel.getQuestionByName(field).value : undefined;
  }
  const row = question.visibleRows[0];
  return row ? row.getValue(field) : undefined;
}

// Public-model counters (02, Counters), read after the counter run: what the action left shown.
export function recordsShown(ctx: PerfContext, state: any): Counters {
  const q = state.q;
  return { shown: work(q.getType() === "paneldynamic" ? q.panels.length : q.visibleRows.length), pageIndex: work(q.pageIndex), records: work(q.rowCount !== undefined ? q.rowCount : q.panelCount) };
}

export function pagesShown(ctx: PerfContext, state: any): Counters {
  return { currentPageNo: work(state.survey.currentPageNo), visiblePages: work(state.survey.visiblePageCount) };
}

// Whether the question's rendered root has the class the framework adds once it is answered (F2 of the step-3
// review: a fact the framework renders, not one the browser or the harness wrote).
export function renderedAnswered(ctx: PerfContext, name: string): boolean | undefined {
  if (!ctx.page) return undefined;
  const root = ctx.page.query("[data-name=\"" + name + "\"]");
  return !!root && (" " + root.className + " ").indexOf(" sd-question--answered ") > -1;
}

import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { expectThat, expectEqual } from "../harness/scenario.ts";
import { loadModel, outputScenarios } from "./common.ts";
import { loadSurvey, cachedSurvey, releaseSurvey, sortRecords, filterRecords, sum, firstShown, renderedCell, showPageOf, expectSortedPage, recordsShown, shownIds } from "./helpers.ts";

// Records on the matrix orders (1k and 10k) and a few on the bound panel ordersPanel (1k). One survey with the data
// per process or page; setup restores the page, the sort and the filter instead of reloading (00, Budgets). Every
// check compares with values computed from the data; in a page it also checks the DOM fact the action recorded.
// In a page the pager, the add-row button, the sort header and the cell input are used; the filter has no element,
// so it is a model call there too.
const requires = ["matrixdynamic.pageSize", "paneldynamic.pageSize"];
export const defaultSort = [{ field: "total", direction: "desc" }];
export const panelSort = [{ field: "qty", direction: "asc" }];
export const filterA = "{status} = 'open' and {total} > 500";
export const filterB = "{status} = 'shipped' and {total} > 500";

export async function recordsSurvey(ctx: PerfContext): Promise<any> {
  if (!ctx.cache.survey) {
    ctx.cache.survey = await loadSurvey(ctx, (survey: any) => {
      survey.data = ctx.fixture.data;
      // The first visit builds the first sorted page; first-visit measures it on its own survey.
      survey.getQuestionByName("orders").visibleRows;
    });
  }
  return ctx.cache.survey;
}

export function currentOrders(survey: any): Array<any> {
  return survey.getValue("orders") || [];
}

// Puts the matrix (or the panel) back on page 0 with its starting sort and no filter.
export async function resetView(ctx: PerfContext, question: any, sort: Array<any>): Promise<void> {
  let changed = false;
  if (question.filterExpression) { question.filterExpression = ""; changed = true; }
  const current = JSON.stringify(question.sortCriteria.map((c: any) => ({ field: c.field, direction: c.direction })));
  if (current !== JSON.stringify(sort)) { question.sortCriteria = sort; changed = true; }
  if (question.pageIndex !== 0) { question.pageIndex = 0; changed = true; }
  if (changed && ctx.page) await ctx.page.updated();
}

// The state every matrix scenario starts from: page 0, sorted by total desc, no filter.
export async function ordersReady(ctx: PerfContext): Promise<any> {
  const survey = await recordsSurvey(ctx);
  const q = survey.getQuestionByName("orders");
  await showPageOf(ctx, survey, "orders");
  await resetView(ctx, q, defaultSort);
  return { survey: survey, q: q, records: currentOrders(survey), dom: undefined };
}

export async function panelReady(ctx: PerfContext): Promise<any> {
  const survey = await recordsSurvey(ctx);
  const q = survey.getQuestionByName("ordersPanel");
  await showPageOf(ctx, survey, "ordersPanel");
  await resetView(ctx, q, panelSort);
  return { survey: survey, q: q, records: currentOrders(survey), dom: undefined };
}

export function totalAt(records: Array<any>, index: number, direction: string): number {
  return sortRecords(records, [{ field: "total", direction: direction }])[index].total;
}

// A pager button of a records question: "Next", "Previous", "First" or "Last".
export function pagerSelector(question: any, title: string): string {
  return "[data-name=\"" + question.name + "\"] .sd-pager button[title=\"" + title + "\"]";
}

// The ids the page renders for a records question, in order: the matrix rows' id cells, or the panels' id inputs.
export function renderedIds(ctx: PerfContext, question: any): Array<string> | undefined {
  if (!ctx.page) return undefined;
  const root = "[data-name=\"" + question.name + "\"] ";
  if (question.getType() !== "paneldynamic") {
    const index = question.renderedTable.headerRow.cells.map((c: any) => c.column && c.column.name).indexOf("id");
    return ctx.page.queryAll(root + "tbody tr.sd-table__row").map((tr: any) => {
      const input = tr.children[index] ? tr.children[index].querySelector("input") : undefined;
      return input ? input.value : undefined;
    });
  }
  // Every panel's question is named id: all of them, in DOM order.
  return ctx.page.queryAll(root + "[data-name=\"id\"] input").map((input: any) => input.value);
}

// The first shown value in the page: the matrix's first row cell, or the first panel's question input.
export function renderedFirst(ctx: PerfContext, question: any, field: string): string | undefined {
  if (!ctx.page) return undefined;
  if (question.getType() !== "paneldynamic") return renderedCell(ctx, question, field);
  const panel = question.panels[0];
  const q = panel ? panel.getQuestionByName(field) : undefined;
  const input = q ? ctx.page.query("[data-name=\"" + q.name + "\"] input") : undefined;
  return input ? input.value : undefined;
}

function base(fixture: string, op: string, target: string, uses: Array<string>): any {
  const ready = target === "orders" ? "ordersReady" : "panelReady";
  const sort = target === "orders" ? "defaultSort" : "panelSort";
  return { id: fixture + "/records/" + op + "@" + target, rev: 1, fixture: fixture, kind: "action", requires: requires,
    uses: ["loadSurvey", "recordsSurvey", "resetView", "currentOrders", "firstShown", "showPageOf", "renderedFirst", "renderedCell", "expectRendered", "shownIds", ready, sort].concat(uses), counters: recordsShown };
}

// The DOM fact of a page: the shown first value, read once the update ended; the check compares it with the model.
export function expectRendered(ctx: PerfContext, s: any, expected: any, what: string): void {
  if (ctx.page) expectEqual(s.dom, String(expected), what + " in the page");
}

function matrixScenarios(fixture: string): Array<PerfScenario> {
  const ready = ordersReady;
  return [
    Object.assign(base(fixture, "next", "orders", ["sortRecords", "totalAt", "pagerSelector"]), {
      setup: ready,
      run: async(ctx: PerfContext, s: any): Promise<void> => {
        if (!ctx.page) { s.q.nextPage(); return; }
        await ctx.page.click(pagerSelector(s.q, "Next"));
      },
      record: (ctx: PerfContext, s: any): void => { s.dom = renderedFirst(ctx, s.q, "total"); },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.q.pageIndex, 1, "page index");
        const expected = totalAt(s.records, s.q.pageSize, "desc");
        expectEqual(firstShown(s.q, "total"), expected, "the first row of page 2");
        expectRendered(ctx, s, expected, "the first row of page 2");
      }
    }),
    Object.assign(base(fixture, "prev", "orders", ["sortRecords", "totalAt"]), {
      setup: async(ctx: PerfContext): Promise<any> => {
        const s = await ready(ctx);
        s.q.pageIndex = 1;
        return s;
      },
      run: (ctx: PerfContext, s: any): void => { s.q.prevPage(); },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.q.pageIndex, 0, "page index");
        expectEqual(firstShown(s.q, "total"), totalAt(s.records, 0, "desc"), "the first row of page 1");
      }
    }),
    Object.assign(base(fixture, "last", "orders", ["sortRecords", "totalAt", "pagerSelector"]), {
      setup: ready,
      run: async(ctx: PerfContext, s: any): Promise<void> => {
        if (!ctx.page) { s.q.pageIndex = s.q.pageCount - 1; return; }
        await ctx.page.click(pagerSelector(s.q, "Last"));
      },
      record: (ctx: PerfContext, s: any): void => { s.dom = renderedFirst(ctx, s.q, "total"); },
      check: (ctx: PerfContext, s: any): void => {
        const last = Math.ceil(s.records.length / s.q.pageSize) - 1;
        expectEqual(s.q.pageIndex, last, "page index");
        const expected = totalAt(s.records, last * s.q.pageSize, "desc");
        expectEqual(firstShown(s.q, "total"), expected, "the first row of the last page");
        expectRendered(ctx, s, expected, "the first row of the last page");
      }
    }),
    Object.assign(base(fixture, "first-visit", "orders", ["sortRecords", "totalAt", "releaseSurvey"]), {
      // A survey of its own: loaded with the data, visibleRows not read yet.
      setup: async(ctx: PerfContext): Promise<any> => {
        const survey = await loadSurvey(ctx, (sv: any) => { sv.data = ctx.fixture.data; });
        return { survey: survey, q: survey.getQuestionByName("orders"), rows: undefined };
      },
      run: (ctx: PerfContext, s: any): void => { s.rows = s.q.visibleRows; },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.rows.length, s.q.pageSize, "rows on the first page");
        expectEqual(s.rows[0].getValue("total"), totalAt(ctx.fixture.data.orders, 0, "desc"), "the first row has the largest total");
      },
      teardown: (ctx: PerfContext, s: any): void => releaseSurvey(ctx, s.survey)
    }),
    Object.assign(base(fixture, "sort-1", "orders", ["sortRecords", "expectSortedPage", "shownIds"]), {
      setup: ready,
      // A single level on a data field, other than the starting sort.
      run: (ctx: PerfContext, s: any): void => { s.q.sortCriteria = [{ field: "price", direction: "desc" }]; },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.q.pageIndex, 0, "page index");
        expectSortedPage(s.q, s.records, [{ field: "price", direction: "desc" }], defaultSort, "price desc");
      }
    }),
    Object.assign(base(fixture, "sort-3", "orders", ["sortRecords"]), {
      setup: ready,
      run: (ctx: PerfContext, s: any): void => {
        s.q.sortCriteria = [{ field: "status", direction: "asc" }, { field: "customer", direction: "asc" }, { field: "total", direction: "desc" }];
      },
      check: (ctx: PerfContext, s: any): void => {
        const first = sortRecords(s.records, [{ field: "status", direction: "asc" }, { field: "customer", direction: "asc" }, { field: "total", direction: "desc" }])[0];
        expectEqual(firstShown(s.q, "status"), first.status, "status of the first row");
        expectEqual(firstShown(s.q, "customer"), first.customer, "customer of the first row");
        expectEqual(firstShown(s.q, "total"), first.total, "total of the first row");
      }
    }),
    Object.assign(base(fixture, "sort-reverse", "orders", ["sortRecords", "totalAt"]), {
      setup: ready,
      run: (ctx: PerfContext, s: any): void => { s.q.sortCriteria = [{ field: "total", direction: "asc" }]; },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(firstShown(s.q, "total"), totalAt(s.records, 0, "asc"), "the first row has the smallest total");
      }
    }),
    Object.assign(base(fixture, "filter-set", "orders", ["filterRecords", "filterA", "renderedIds"]), {
      setup: async(ctx: PerfContext): Promise<any> => {
        const s = await ready(ctx);
        s.before = renderedIds(ctx, s.q);
        return s;
      },
      run: async(ctx: PerfContext, s: any): Promise<void> => {
        s.q.filterExpression = filterA;
        if (ctx.page) await ctx.page.updated();
      },
      record: (ctx: PerfContext, s: any): void => { s.dom = renderedIds(ctx, s.q); },
      check: (ctx: PerfContext, s: any): void => {
        const kept = filterRecords(s.records, "open", 500);
        expectThat(kept.length > 0 && kept.length < s.records.length, "the filter keeps some records");
        expectEqual(s.q.pageCount, Math.ceil(kept.length / s.q.pageSize), "pages of the filtered view");
        expectEqual(firstShown(s.q, "status"), "open", "the first row is open");
        if (ctx.page) {
          // The rendered page is the model's filtered page, and differs from the unfiltered one.
          expectEqual(JSON.stringify(s.dom), JSON.stringify(shownIds(s.q)), "rendered ids of the filtered page");
          expectThat(JSON.stringify(s.dom) !== JSON.stringify(s.before), "the filter changed the rendered page");
        }
      }
    }),
    Object.assign(base(fixture, "filter-change", "orders", ["filterRecords", "filterA", "filterB"]), {
      setup: async(ctx: PerfContext): Promise<any> => {
        const s = await ready(ctx);
        s.q.filterExpression = filterA;
        return s;
      },
      run: (ctx: PerfContext, s: any): void => { s.q.filterExpression = filterB; },
      check: (ctx: PerfContext, s: any): void => {
        const kept = filterRecords(s.records, "shipped", 500);
        expectEqual(s.q.pageCount, Math.ceil(kept.length / s.q.pageSize), "pages of the filtered view");
        expectEqual(firstShown(s.q, "status"), "shipped", "the first row is shipped");
      }
    }),
    Object.assign(base(fixture, "filter-clear", "orders", ["filterA"]), {
      setup: async(ctx: PerfContext): Promise<any> => {
        const s = await ready(ctx);
        s.q.filterExpression = filterA;
        s.filtered = s.q.pageCount;
        return s;
      },
      run: (ctx: PerfContext, s: any): void => { s.q.filterExpression = ""; },
      check: (ctx: PerfContext, s: any): void => {
        expectThat(s.filtered < s.q.pageCount, "the filter had fewer pages");
        expectEqual(s.q.pageCount, Math.ceil(s.records.length / s.q.pageSize), "pages of every record");
      }
    }),
    Object.assign(base(fixture, "edit-cell", "orders", []), {
      // qty of the first shown row, to a value that differs. The re-sort is part of the timed work. In a page the
      // value is committed to the cell input.
      setup: async(ctx: PerfContext): Promise<any> => {
        const s = await ready(ctx);
        const row = s.q.visibleRows[0];
        s.id = row.getValue("id");
        s.qty = row.getValue("qty");
        s.price = row.getValue("price");
        s.newQty = s.qty >= 20 ? s.qty - 1 : s.qty + 1;
        s.total = s.survey.getVariable("ordersTotal");
        s.cell = row.getQuestionByColumnName("qty");
        s.input = ctx.page ? ctx.page.query("[data-name=\"orders\"] tbody tr.sd-table__row input[id=\"" + s.cell.inputId + "\"]") : undefined;
        if (ctx.page) expectThat(!!s.input, "the qty input of the first row");
        return s;
      },
      run: async(ctx: PerfContext, s: any): Promise<void> => {
        if (!ctx.page) { s.cell.value = s.newQty; return; }
        await ctx.page.commit(s.input, String(s.newQty));
      },
      record: (ctx: PerfContext, s: any): void => {
        const shown = ctx.page ? ctx.page.query("[data-name=\"ordersTotalShown\"] .sd-expression") : undefined;
        s.dom = shown ? (shown.textContent || "").replace(/[^0-9.-]/g, "") : undefined;
      },
      check: (ctx: PerfContext, s: any): void => {
        const total = s.total + (s.newQty - s.qty) * s.price;
        expectEqual(s.survey.getVariable("ordersTotal"), total, "ordersTotal changed by dqty x price");
        const record = currentOrders(s.survey).filter((r: any) => r.id === s.id)[0];
        expectEqual(record && record.qty, s.newQty, "the shared value has the new qty");
        if (ctx.page) expectEqual(s.dom, String(total), "ordersTotalShown in the page");
      }
    }),
    Object.assign(base(fixture, "add-row", "orders", ["renderedIds"]), {
      // On the last page; teardown removes the new record again.
      setup: async(ctx: PerfContext): Promise<any> => {
        const s = await ready(ctx);
        s.q.pageIndex = s.q.pageCount - 1;
        if (ctx.page) await ctx.page.updated();
        s.count = s.q.rowCount;
        s.before = renderedIds(ctx, s.q);
        return s;
      },
      run: async(ctx: PerfContext, s: any): Promise<void> => {
        if (!ctx.page) { s.q.addRow(); return; }
        await ctx.page.click("[data-name=\"orders\"] .sd-matrixdynamic__add-btn");
      },
      record: (ctx: PerfContext, s: any): void => { s.dom = ctx.page ? ctx.page.queryAll("[data-name=\"orders\"] tbody tr.sd-table__row").length : undefined; },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.q.rowCount, s.count + 1, "row count");
        expectEqual(currentOrders(s.survey).length, s.count + 1, "records in the value");
        if (ctx.page) {
          // The full last page of 10,000 records moves to a new page with the one new row.
          expectEqual(s.dom, s.q.visibleRows.length, "rendered rows equal the shown rows");
          expectThat(JSON.stringify(renderedIds(ctx, s.q)) !== JSON.stringify(s.before), "the rendered rows changed");
        }
      },
      teardown: (ctx: PerfContext, s: any): void => {
        s.survey.setValue("orders", currentOrders(s.survey).slice(0, s.count));
      }
    }),
    Object.assign(base(fixture, "remove-row", "orders", []), {
      // The first shown record; teardown puts it back at the end of the value.
      setup: async(ctx: PerfContext): Promise<any> => {
        const s = await ready(ctx);
        s.count = s.q.rowCount;
        s.id = s.q.visibleRows[0].getValue("id");
        s.record = currentOrders(s.survey).filter((r: any) => r.id === s.id)[0];
        return s;
      },
      run: (ctx: PerfContext, s: any): void => { s.q.removeRow(0, false); },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.q.rowCount, s.count - 1, "row count");
        expectThat(currentOrders(s.survey).every((r: any) => r.id !== s.id), "the record is gone from the value");
      },
      teardown: (ctx: PerfContext, s: any): void => {
        s.survey.setValue("orders", currentOrders(s.survey).concat([s.record]));
      }
    })
  ];
}

// Browser only: a click on the sort button of the total header (03, sort-header). total is an expression column, so a
// header click cycles asc -> desc -> none and a click from desc clears the sort: the sample starts unsorted and the click
// sorts asc, the end state 03 asks for (aria-sort ascending, the smallest total first).
export function sortHeaderScenario(fixture: string): PerfScenario {
  return Object.assign(base(fixture, "sort-header", "orders", ["sortRecords", "totalAt"]), {
    setup: async(ctx: PerfContext): Promise<any> => {
      const s = await ordersReady(ctx);
      s.q.sortCriteria = [];
      await (ctx.page as any).updated();
      const index = s.q.renderedTable.headerRow.cells.map((c: any) => c.column && c.column.name).indexOf("total");
      s.selector = "[data-name=\"orders\"] thead th:nth-child(" + (index + 1) + ")";
      expectThat(index > -1 && !!(ctx.page && ctx.page.query(s.selector + " button.sd-table__header-sort-button")), "the sort button of total");
      return s;
    },
    run: async(ctx: PerfContext, s: any): Promise<void> => {
      await (ctx.page as any).click(s.selector + " button.sd-table__header-sort-button");
    },
    record: (ctx: PerfContext, s: any): void => {
      const th = (ctx.page as any).query(s.selector);
      s.dom = { sort: th ? th.getAttribute("aria-sort") : null, first: renderedFirst(ctx, s.q, "total") };
    },
    check: (ctx: PerfContext, s: any): void => {
      expectEqual(s.q.sortCriteria[0].direction, "asc", "the sort direction");
      const min = totalAt(s.records, 0, "asc");
      expectEqual(firstShown(s.q, "total"), min, "the first row has the smallest total");
      expectEqual(s.dom.sort, "ascending", "aria-sort");
      expectEqual(s.dom.first, String(min), "the first rendered total");
    }
  });
}

// records-plain: a sort of a plain matrix (no calculated values, nothing that makes a sort rebuild the rows rather
// than rebind them), 30 rows with no paging (orders30) and a page of 10 of 1,000 records (ordersPaged). A sample
// starts unsorted on page 0 and sorts by id ascending: in core by sortCriteria, as sort-1 does; in a page by a click
// on the sort button of the id header (sort-header; id is a text column, so the first click sorts ascending). The ids
// are distinct, so the expected rows have no ties.
const plainRequires = ["matrixdynamic.pageSize", "matrixdynamic.allowSort"];
export const plainSort = [{ field: "id", direction: "asc" }];

// The state every records-plain sample starts from: the matrix's page shown, page 0, no sort, the rendered table
// built. In core nothing renders, so the table is read here and again in run: the sort keeps or rebuilds it there,
// as it does in a page.
export async function plainReady(ctx: PerfContext, name: string): Promise<any> {
  const survey = await cachedSurvey(ctx, (sv: any) => { sv.data = ctx.fixture.data; });
  const q = survey.getQuestionByName(name);
  await showPageOf(ctx, survey, name);
  await resetView(ctx, q, []);
  q.renderedTable;
  return { survey: survey, q: q, records: survey.getValue(name) || [], dom: undefined };
}

// The ids of the rows a matrix shows first under a sort: its first page, or every record when it does not page.
export function plainPageIds(question: any, records: Array<any>, criteria: Array<any>): Array<string> {
  const size = question.pageSize > 0 ? question.pageSize : records.length;
  return sortRecords(records, criteria).slice(0, size).map((r: any) => r.id);
}

// Sorted by id ascending on page 0: the shown rows in id order, each cell showing its record (a kept row that kept a
// value of the record it showed before fails); in a page also aria-sort, the first rendered id and every rendered id.
export function expectPlainSorted(ctx: PerfContext, s: any): void {
  const sort = s.q.sortCriteria.map((c: any) => ({ field: c.field, direction: c.direction }));
  expectEqual(JSON.stringify(sort), JSON.stringify(plainSort), "the sort");
  expectEqual(s.q.pageIndex, 0, "page index");
  const expected = plainPageIds(s.q, s.records, plainSort);
  expectThat(JSON.stringify(expected) !== JSON.stringify(plainPageIds(s.q, s.records, [])), "the sort changes the shown rows");
  expectEqual(JSON.stringify(shownIds(s.q)), JSON.stringify(expected), "the shown rows in id order");
  const byId: { [id: string]: any } = {};
  s.records.forEach((r: any) => { byId[r.id] = r; });
  s.q.visibleRows.forEach((row: any) => {
    const record = byId[row.getValue("id")];
    expectEqual(row.getQuestionByColumnName("title").value, record.title, "the title cell of " + record.id);
    expectEqual(row.getQuestionByColumnName("qty").value, record.qty, "the qty cell of " + record.id);
  });
  if (!ctx.page) return;
  expectEqual(s.dom.sort, "ascending", "aria-sort");
  expectEqual(s.dom.first, expected[0], "the first rendered id");
  expectEqual(JSON.stringify(s.dom.ids), JSON.stringify(expected), "the rendered ids");
}

function plainBase(op: string, name: string, uses: Array<string>): any {
  return { id: "records-plain/records/" + op + "@" + name, rev: 1, fixture: "records-plain", kind: "action", requires: plainRequires,
    uses: ["plainReady", "expectPlainSorted"].concat(uses), counters: recordsShown };
}

// Core: the sort from code, then the rendered table read, as a page reads it to render the sort.
export function plainSortScenario(name: string): PerfScenario {
  return Object.assign(plainBase("sort-1", name, []), {
    setup: (ctx: PerfContext): Promise<any> => plainReady(ctx, name),
    run: (ctx: PerfContext, s: any): void => {
      s.q.sortCriteria = [{ field: "id", direction: "asc" }];
      s.table = s.q.renderedTable;
    },
    check: (ctx: PerfContext, s: any): void => expectPlainSorted(ctx, s)
  });
}

// Browser: a click on the sort button of the id header, as sortHeaderScenario clicks total's.
export function plainSortHeaderScenario(name: string): PerfScenario {
  return Object.assign(plainBase("sort-header", name, ["renderedFirst", "renderedIds"]), {
    setup: async(ctx: PerfContext): Promise<any> => {
      const s = await plainReady(ctx, name);
      const index = s.q.renderedTable.headerRow.cells.map((c: any) => c.column && c.column.name).indexOf("id");
      s.selector = "[data-name=\"" + name + "\"] thead th:nth-child(" + (index + 1) + ")";
      expectThat(index > -1 && !!(ctx.page && ctx.page.query(s.selector + " button.sd-table__header-sort-button")), "the sort button of id");
      return s;
    },
    run: async(ctx: PerfContext, s: any): Promise<void> => {
      await (ctx.page as any).click(s.selector + " button.sd-table__header-sort-button");
    },
    record: (ctx: PerfContext, s: any): void => {
      const th = (ctx.page as any).query(s.selector);
      s.dom = { sort: th ? th.getAttribute("aria-sort") : null, first: renderedFirst(ctx, s.q, "id"), ids: renderedIds(ctx, s.q) };
    },
    check: (ctx: PerfContext, s: any): void => expectPlainSorted(ctx, s)
  });
}

// records-plain: the plain dynamic panels panels30 (30 records, no paging) and panelsPaged (a page of 10 of 1,000
// records), in list mode, where a sort and a page move keep the panels (rebind) rather than rebuild them. A sample
// starts unsorted on page 0. The panel has no header to click: in a page the sort is a model call too, as filter-set
// is, and the page shows it. Next is a click on the pager button.
export async function plainPanelReady(ctx: PerfContext, name: string): Promise<any> {
  const survey = await cachedSurvey(ctx, (sv: any) => { sv.data = ctx.fixture.data; });
  const q = survey.getQuestionByName(name);
  await showPageOf(ctx, survey, name);
  await resetView(ctx, q, []);
  q.renderedPanels;
  return { survey: survey, q: q, records: survey.getValue(name) || [], dom: undefined };
}

// The panels a sort or a page move left: the ids of the records the view shows from index on, each panel showing
// its record (a kept panel that kept a value of the record it showed before fails); in a page every rendered id too.
export function expectPlainPanels(ctx: PerfContext, s: any, criteria: Array<any>, index: number): void {
  const size = s.q.pageSize > 0 ? s.q.pageSize : s.records.length;
  const expected = sortRecords(s.records, criteria).slice(index, index + size).map((r: any) => r.id);
  expectEqual(JSON.stringify(shownIds(s.q)), JSON.stringify(expected), "the shown panels");
  const byId: { [id: string]: any } = {};
  s.records.forEach((r: any) => { byId[r.id] = r; });
  s.q.panels.forEach((panel: any) => {
    const record = byId[panel.getQuestionByName("id").value];
    expectEqual(panel.getQuestionByName("title").value, record.title, "the title question of " + record.id);
    expectEqual(panel.getQuestionByName("qty").value, record.qty, "the qty question of " + record.id);
  });
  if (ctx.page) expectEqual(JSON.stringify(s.dom), JSON.stringify(expected), "the rendered ids");
}

function plainPanelBase(op: string, name: string, uses: Array<string>): any {
  return { id: "records-plain/records/" + op + "@" + name, rev: 1, fixture: "records-plain", kind: "action",
    requires: ["paneldynamic.pageSize", "paneldynamic.allowSort"],
    uses: ["plainPanelReady", "expectPlainPanels", "renderedIds"].concat(uses), counters: recordsShown };
}

// A sort by id ascending, from code; the page renders it.
export function plainPanelSortScenario(name: string): PerfScenario {
  return Object.assign(plainPanelBase("sort-1", name, ["plainSort", "plainPageIds"]), {
    setup: (ctx: PerfContext): Promise<any> => plainPanelReady(ctx, name),
    run: async(ctx: PerfContext, s: any): Promise<void> => {
      s.q.sortCriteria = [{ field: "id", direction: "asc" }];
      if (ctx.page) await ctx.page.updated();
    },
    record: (ctx: PerfContext, s: any): void => { s.dom = renderedIds(ctx, s.q); },
    check: (ctx: PerfContext, s: any): void => {
      expectEqual(s.q.pageIndex, 0, "page index");
      expectThat(JSON.stringify(plainPageIds(s.q, s.records, plainSort)) !== JSON.stringify(plainPageIds(s.q, s.records, [])), "the sort changes the shown panels");
      expectPlainPanels(ctx, s, plainSort, 0);
    }
  });
}

// Next on page 0, unsorted: in a page a click on the pager's Next button.
export function plainPanelNextScenario(name: string): PerfScenario {
  return Object.assign(plainPanelBase("next", name, ["pagerSelector"]), {
    setup: (ctx: PerfContext): Promise<any> => plainPanelReady(ctx, name),
    run: async(ctx: PerfContext, s: any): Promise<void> => {
      if (!ctx.page) { s.q.nextPage(); return; }
      await ctx.page.click(pagerSelector(s.q, "Next"));
    },
    record: (ctx: PerfContext, s: any): void => { s.dom = renderedIds(ctx, s.q); },
    check: (ctx: PerfContext, s: any): void => {
      expectEqual(s.q.pageIndex, 1, "page index");
      expectPlainPanels(ctx, s, [], s.q.pageSize);
    }
  });
}

function panelScenarios(fixture: string): Array<PerfScenario> {
  const ready = panelReady;
  return [
    Object.assign(base(fixture, "next", "ordersPanel", ["sortRecords", "pagerSelector", "renderedIds"]), {
      setup: async(ctx: PerfContext): Promise<any> => {
        const s = await ready(ctx);
        s.before = renderedIds(ctx, s.q);
        return s;
      },
      run: async(ctx: PerfContext, s: any): Promise<void> => {
        if (!ctx.page) { s.q.nextPage(); return; }
        await ctx.page.click(pagerSelector(s.q, "Next"));
      },
      record: (ctx: PerfContext, s: any): void => { s.dom = renderedIds(ctx, s.q); },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.q.pageIndex, 1, "page index");
        const expected = sortRecords(s.records, panelSort)[s.q.pageSize].qty;
        expectEqual(firstShown(s.q, "qty"), expected, "the first panel of page 2");
        expectEqual(JSON.stringify(shownIds(s.q)), JSON.stringify(sortRecords(s.records, panelSort).slice(s.q.pageSize, 2 * s.q.pageSize).map((r: any) => r.id)), "the ids of page 2");
        if (ctx.page) {
          expectEqual(JSON.stringify(s.dom), JSON.stringify(shownIds(s.q)), "rendered panel ids");
          expectThat(JSON.stringify(s.dom) !== JSON.stringify(s.before), "the rendered panels changed");
        }
      }
    }),
    Object.assign(base(fixture, "sort-1", "ordersPanel", ["sortRecords", "expectSortedPage", "shownIds"]), {
      setup: ready,
      run: (ctx: PerfContext, s: any): void => { s.q.sortCriteria = [{ field: "price", direction: "desc" }]; },
      check: (ctx: PerfContext, s: any): void => {
        expectSortedPage(s.q, s.records, [{ field: "price", direction: "desc" }], panelSort, "price desc");
      }
    })
  ];
}

export function recordsLoadData(fixture: string): PerfScenario {
  return {
    id: fixture + "/load/data", rev: 1, fixture: fixture, kind: "load", requires: requires, uses: ["loadSurvey", "sum", "releaseSurvey"],
    setup: async(ctx: PerfContext): Promise<any> => ({ survey: await loadSurvey(ctx) }),
    run: (ctx: PerfContext, s: any): void => { s.survey.data = ctx.fixture.data; },
    check: (ctx: PerfContext, s: any): void => {
      expectEqual(s.survey.getVariable("ordersTotal"), sum(ctx.fixture.data.orders, "total"), "ordersTotal after survey.data =");
    },
    teardown: (ctx: PerfContext, s: any): void => releaseSurvey(ctx, s.survey)
  };
}

export function answerRecords(ctx: PerfContext, survey: any): void {
  survey.data = ctx.fixture.data;
}

export function recordsScenarios(): Array<PerfScenario> {
  const res: Array<PerfScenario> = [];
  for (const fixture of ["records-1k", "records-10k"]) {
    res.push(Object.assign(loadModel(fixture), { requires: requires }));
    res.push(recordsLoadData(fixture));
    matrixScenarios(fixture).forEach((s: PerfScenario) => res.push(s));
  }
  panelScenarios("records-1k").forEach((s: PerfScenario) => res.push(s));
  res.push(sortHeaderScenario("records-10k"));
  ["orders30", "ordersPaged"].forEach((name: string) => res.push(plainSortScenario(name), plainSortHeaderScenario(name)));
  ["panels30", "panelsPaged"].forEach((name: string) => res.push(plainPanelSortScenario(name)));
  res.push(plainPanelNextScenario("panelsPaged"));
  // toJSON of the small records JSON takes ~7 ms: two in a sample. dispose (~4 ms) cannot repeat: counterOnly.
  outputScenarios("records-10k", "answerRecords", answerRecords).forEach((s: PerfScenario) => {
    const extra: any = { requires: requires };
    if (s.id.indexOf("/toJSON") > 0) extra.repeat = 2;
    if (s.id.indexOf("/dispose") > 0) extra.counterOnly = true;
    res.push(Object.assign(s, extra));
  });
  return res;
}

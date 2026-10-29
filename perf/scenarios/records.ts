import type { PerfContext, PerfScenario } from "../harness/scenario.ts";
import { expectThat, expectEqual } from "../harness/scenario.ts";
import { loadModel, outputScenarios } from "./common.ts";
import { loadSurvey, disposeSurvey, sortRecords, filterRecords, sum, firstShown, expectSortedPage, recordsShown } from "./helpers.ts";

// Records on the matrix orders (1k and 10k) and a few on the bound panel ordersPanel (1k). One survey with the data
// per process; setup restores the page, the sort and the filter instead of reloading (00, Budgets). Every check
// compares with values computed from the data.
const requires = ["matrixdynamic.pageSize", "paneldynamic.pageSize"];
export const defaultSort = [{ field: "total", direction: "desc" }];
export const panelSort = [{ field: "qty", direction: "asc" }];
export const filterA = "{status} = 'open' and {total} > 500";
export const filterB = "{status} = 'shipped' and {total} > 500";

export function recordsSurvey(ctx: PerfContext): any {
  if (!ctx.cache.survey) {
    const survey = loadSurvey(ctx);
    survey.data = ctx.fixture.data;
    // The first visit builds the first sorted page; first-visit measures it on its own survey.
    survey.getQuestionByName("orders").visibleRows;
    ctx.cache.survey = survey;
  }
  return ctx.cache.survey;
}

export function currentOrders(survey: any): Array<any> {
  return survey.getValue("orders") || [];
}

// Puts the matrix (or the panel) back on page 0 with its starting sort and no filter.
export function resetView(question: any, sort: Array<any>): void {
  if (question.filterExpression) question.filterExpression = "";
  const current = JSON.stringify(question.sortCriteria.map((c: any) => ({ field: c.field, direction: c.direction })));
  if (current !== JSON.stringify(sort)) question.sortCriteria = sort;
  if (question.pageIndex !== 0) question.pageIndex = 0;
}

export function pageSize(question: any): number {
  return question.pageSize;
}

// The state every matrix scenario starts from: page 0, sorted by total desc, no filter.
export function ordersReady(ctx: PerfContext): any {
  const survey = recordsSurvey(ctx);
  const q = survey.getQuestionByName("orders");
  resetView(q, defaultSort);
  return { survey: survey, q: q, records: currentOrders(survey) };
}

export function panelReady(ctx: PerfContext): any {
  const survey = recordsSurvey(ctx);
  const q = survey.getQuestionByName("ordersPanel");
  resetView(q, panelSort);
  return { survey: survey, q: q, records: currentOrders(survey) };
}

export function totalAt(records: Array<any>, index: number, direction: string): number {
  return sortRecords(records, [{ field: "total", direction: direction }])[index].total;
}

function base(fixture: string, op: string, target: string, uses: Array<string>): any {
  const ready = target === "orders" ? "ordersReady" : "panelReady";
  const sort = target === "orders" ? "defaultSort" : "panelSort";
  return { id: fixture + "/records/" + op + "@" + target, rev: 1, fixture: fixture, kind: "action", requires: requires,
    uses: ["loadSurvey", "recordsSurvey", "resetView", "currentOrders", "firstShown", ready, sort].concat(uses), counters: recordsShown };
}

function matrixScenarios(fixture: string): Array<PerfScenario> {
  const ready = ordersReady;
  return [
    Object.assign(base(fixture, "next", "orders", ["sortRecords", "totalAt"]), {
      setup: ready,
      run: (ctx: PerfContext, s: any): void => { s.q.nextPage(); },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.q.pageIndex, 1, "page index");
        expectEqual(firstShown(s.q, "total"), totalAt(s.records, s.q.pageSize, "desc"), "the first row of page 2");
      }
    }),
    Object.assign(base(fixture, "prev", "orders", ["sortRecords", "totalAt"]), {
      setup: (ctx: PerfContext): any => {
        const s = ready(ctx);
        s.q.pageIndex = 1;
        return s;
      },
      run: (ctx: PerfContext, s: any): void => { s.q.prevPage(); },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.q.pageIndex, 0, "page index");
        expectEqual(firstShown(s.q, "total"), totalAt(s.records, 0, "desc"), "the first row of page 1");
      }
    }),
    Object.assign(base(fixture, "last", "orders", ["sortRecords", "totalAt"]), {
      setup: ready,
      run: (ctx: PerfContext, s: any): void => { s.q.pageIndex = s.q.pageCount - 1; },
      check: (ctx: PerfContext, s: any): void => {
        const last = Math.ceil(s.records.length / s.q.pageSize) - 1;
        expectEqual(s.q.pageIndex, last, "page index");
        expectEqual(firstShown(s.q, "total"), totalAt(s.records, last * s.q.pageSize, "desc"), "the first row of the last page");
      }
    }),
    Object.assign(base(fixture, "first-visit", "orders", ["sortRecords", "totalAt", "disposeSurvey"]), {
      // A survey of its own: loaded with the data, visibleRows not read yet.
      setup: (ctx: PerfContext): any => {
        const survey = loadSurvey(ctx);
        survey.data = ctx.fixture.data;
        return { survey: survey, q: survey.getQuestionByName("orders"), rows: undefined };
      },
      run: (ctx: PerfContext, s: any): void => { s.rows = s.q.visibleRows; },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.rows.length, s.q.pageSize, "rows on the first page");
        expectEqual(s.rows[0].getValue("total"), totalAt(ctx.fixture.data.orders, 0, "desc"), "the first row has the largest total");
      },
      teardown: (ctx: PerfContext, s: any): void => disposeSurvey(s.survey)
    }),
    Object.assign(base(fixture, "sort-1", "orders", ["sortRecords", "totalAt", "expectSortedPage", "shownIds"]), {
      setup: ready,
      // A single level on a data field, other than the starting sort.
      run: (ctx: PerfContext, s: any): void => { s.q.sortCriteria = [{ field: "price", direction: "desc" }]; },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.q.pageIndex, 0, "page index");
        expectSortedPage(s.q, s.records, [{ field: "price", direction: "desc" }], defaultSort, "price desc");
      }
    }),
    Object.assign(base(fixture, "sort-3", "orders", ["sortRecords", "totalAt"]), {
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
    Object.assign(base(fixture, "filter-set", "orders", ["filterRecords", "filterA"]), {
      setup: ready,
      run: (ctx: PerfContext, s: any): void => { s.q.filterExpression = filterA; },
      check: (ctx: PerfContext, s: any): void => {
        const kept = filterRecords(s.records, "open", 500);
        expectThat(kept.length > 0 && kept.length < s.records.length, "the filter keeps some records");
        expectEqual(s.q.pageCount, Math.ceil(kept.length / s.q.pageSize), "pages of the filtered view");
        expectEqual(firstShown(s.q, "status"), "open", "the first row is open");
      }
    }),
    Object.assign(base(fixture, "filter-change", "orders", ["filterRecords", "filterA", "filterB"]), {
      setup: (ctx: PerfContext): any => {
        const s = ready(ctx);
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
      setup: (ctx: PerfContext): any => {
        const s = ready(ctx);
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
      // qty of the first shown row, to a value that differs. The re-sort is part of the timed work.
      setup: (ctx: PerfContext): any => {
        const s = ready(ctx);
        const row = s.q.visibleRows[0];
        s.id = row.getValue("id");
        s.qty = row.getValue("qty");
        s.price = row.getValue("price");
        s.newQty = s.qty >= 20 ? s.qty - 1 : s.qty + 1;
        s.total = s.survey.getVariable("ordersTotal");
        s.cell = row.getQuestionByColumnName("qty");
        return s;
      },
      run: (ctx: PerfContext, s: any): void => { s.cell.value = s.newQty; },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.survey.getVariable("ordersTotal"), s.total + (s.newQty - s.qty) * s.price, "ordersTotal changed by dqty x price");
        const record = currentOrders(s.survey).filter((r: any) => r.id === s.id)[0];
        expectEqual(record && record.qty, s.newQty, "the shared value has the new qty");
      }
    }),
    Object.assign(base(fixture, "add-row", "orders", []), {
      // On the last page; teardown removes the new record again.
      setup: (ctx: PerfContext): any => {
        const s = ready(ctx);
        s.q.pageIndex = s.q.pageCount - 1;
        s.count = s.q.rowCount;
        return s;
      },
      run: (ctx: PerfContext, s: any): void => { s.q.addRow(); },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.q.rowCount, s.count + 1, "row count");
        expectEqual(currentOrders(s.survey).length, s.count + 1, "records in the value");
      },
      teardown: (ctx: PerfContext, s: any): void => {
        const value = currentOrders(s.survey).slice(0, s.count);
        s.survey.setValue("orders", value);
      }
    }),
    Object.assign(base(fixture, "remove-row", "orders", []), {
      // The first shown record; teardown puts it back at the end of the value.
      setup: (ctx: PerfContext): any => {
        const s = ready(ctx);
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

function panelScenarios(fixture: string): Array<PerfScenario> {
  const ready = panelReady;
  return [
    Object.assign(base(fixture, "next", "ordersPanel", ["sortRecords", "totalAt"]), {
      setup: ready,
      run: (ctx: PerfContext, s: any): void => { s.q.nextPage(); },
      check: (ctx: PerfContext, s: any): void => {
        expectEqual(s.q.pageIndex, 1, "page index");
        expectEqual(firstShown(s.q, "qty"), sortRecords(s.records, panelSort)[s.q.pageSize].qty, "the first panel of page 2");
      }
    }),
    Object.assign(base(fixture, "sort-1", "ordersPanel", ["sortRecords", "totalAt", "expectSortedPage", "shownIds"]), {
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
    id: fixture + "/load/data", rev: 1, fixture: fixture, kind: "load", requires: requires, uses: ["loadSurvey", "sum", "disposeSurvey"],
    setup: (ctx: PerfContext): any => ({ survey: loadSurvey(ctx) }),
    run: (ctx: PerfContext, s: any): void => { s.survey.data = ctx.fixture.data; },
    check: (ctx: PerfContext, s: any): void => {
      expectEqual(s.survey.getVariable("ordersTotal"), sum(ctx.fixture.data.orders, "total"), "ordersTotal after survey.data =");
    },
    teardown: (ctx: PerfContext, s: any): void => disposeSurvey(s.survey)
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
  // toJSON of the small records JSON takes ~7 ms: two in a sample. dispose (~4 ms) cannot repeat: counterOnly.
  outputScenarios("records-10k", "answerRecords", answerRecords).forEach((s: PerfScenario) => {
    const extra: any = { requires: requires };
    if (s.id.indexOf("/toJSON") > 0) extra.repeat = 2;
    if (s.id.indexOf("/dispose") > 0) extra.counterOnly = true;
    res.push(Object.assign(s, extra));
  });
  return res;
}

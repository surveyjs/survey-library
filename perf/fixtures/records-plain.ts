import { createRng, isoDate } from "./random.ts";
import type { Rng } from "./random.ts";

// Two plain dynamic matrices of one 9-column record, each on a page of its own: orders30 with 30 records and no
// paging, ordersPaged with 1,000 records and pageSize 10. No calculated values and no question that reads the
// matrices, so a sort measures the matrix alone. Nothing in it makes a sort rebuild the rows rather than rebind
// them: no detail panel, no column default or default row value, no showInMultipleColumns, no file or signature
// cell, no row reorder. The id is distinct and shuffled, so a sort by id reorders every page.
export interface RecordsPlainOptions {
  seed?: number;
  rows?: number;
  pagedRecords?: number;
  pageSize?: number;
}

export const recordsPlainDefaults = { seed: 3000, rows: 30, pagedRecords: 1000, pageSize: 10 };

const statuses = ["open", "shipped", "closed"];

function columns(customers: Array<any>): Array<any> {
  return [
    { name: "id", cellType: "text" },
    { name: "title", cellType: "text" },
    { name: "customer", cellType: "dropdown", choices: customers },
    { name: "status", cellType: "dropdown", choices: statuses },
    { name: "qty", cellType: "text", inputType: "number" },
    { name: "total", cellType: "expression", expression: "{row.qty} * 10" },
    { name: "due", cellType: "text", inputType: "date" },
    { name: "paid", cellType: "boolean" },
    { name: "note", cellType: "comment" }
  ];
}

function records(rng: Rng, count: number, customers: number): Array<any> {
  const order: Array<number> = [];
  for (let i = 0; i < count; i++) order.push(i);
  rng.shuffle(order);
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    const qty = rng.int(1, 20);
    const row: any = {
      id: "r" + String(order[i]).padStart(4, "0"),
      title: rng.words(2),
      customer: "c" + rng.int(0, customers - 1),
      status: rng.pick(statuses),
      qty: qty,
      // The data carries the expression column's value, so building a row writes nothing.
      total: qty * 10,
      due: isoDate(2026, rng.int(1, 12), rng.int(1, 28)),
      paid: rng.chance(0.5)
    };
    if (rng.chance(0.3)) row.note = rng.words(rng.int(2, 6));
    res.push(row);
  }
  return res;
}

export function generateRecordsPlain(options?: RecordsPlainOptions): { json: any, data: any, meta: any } {
  const o = Object.assign({}, recordsPlainDefaults, options || {});
  const rng = createRng(o.seed);
  const customers: Array<any> = [];
  for (let i = 0; i < 50; i++) customers.push({ value: "c" + i, text: rng.words(2) });
  const matrix = (name: string, title: string, extra: any): any => Object.assign({ type: "matrixdynamic", name: name, title: title,
    columns: columns(customers), rowCount: 0, allowSort: true }, extra);
  const json = {
    title: "Plain records",
    pages: [
      { name: "orders30", elements: [matrix("orders30", "Orders", {})] },
      { name: "ordersPaged", elements: [matrix("ordersPaged", "Orders by page", { pageSize: o.pageSize })] }
    ]
  };
  const data = { orders30: records(rng, o.rows, customers.length), ordersPaged: records(rng, o.pagedRecords, customers.length) };
  const meta = {
    records: o.rows,
    pagedRecords: o.pagedRecords,
    pageSize: o.pageSize,
    pages: 2,
    panels: 0,
    questionsWithCells: 2,
    questions: 2,
    visibleQuestions: 2,
    calculatedValues: 0,
    matrices: ["orders30", "ordersPaged"],
    sortField: "id",
    expectedLintFindings: []
  };
  return { json: json, data: data, meta: meta };
}

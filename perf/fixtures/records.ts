import { createRng } from "./random.ts";

// A dynamic matrix and a dynamic panel on one valueName, with paging, sort, aggregates and choicesFromQuestion,
// plus a customers panel with nested matrices. Returns the JSON and the data assigned with survey.data.
export interface RecordsOptions {
  seed?: number;
  records?: number;
  pages?: number;
  customers?: number;
}

export const recordsDefaults = { seed: 1000, records: 1000, pages: 30, customers: 200 };

const statuses = ["open", "shipped", "closed"];

function orderFields(prefix: string): Array<any> {
  const customers: Array<any> = [];
  for (let i = 0; i < 200; i++) customers.push({ value: "cid" + i, text: "Customer " + i });
  const products: Array<any> = [];
  for (let i = 0; i < 100; i++) products.push({ value: "p" + i, text: "Product " + i });
  const isColumn = prefix === "row";
  const typeKey = isColumn ? "cellType" : "type";
  const field = (name: string, type: string, extra: any): any => {
    const res: any = { name: name };
    res[typeKey] = type;
    return Object.assign(res, extra);
  };
  return [
    field("id", "text", isColumn ? { isUnique: true } : {}),
    field("customer", "dropdown", { choices: customers }),
    field("product", "dropdown", { choices: products }),
    field("qty", "text", { inputType: "number" }),
    field("price", "text", { inputType: "number" }),
    field("total", "expression", { expression: "{" + prefix + ".qty} * {" + prefix + ".price}" }),
    field("discount", "text", { inputType: "number", visibleIf: "{" + prefix + ".total} > 1000" }),
    field("status", "dropdown", { choices: ["open", "shipped", { value: "closed", visibleIf: "{" + prefix + ".qty} > 0" }] }),
    field("note", "comment", {})
  ];
}

export function generateRecords(options?: RecordsOptions): { json: any, data: any, meta: any } {
  const o = Object.assign({}, recordsDefaults, options || {});
  const rng = createRng(o.seed + o.records);
  const orders: Array<any> = [];
  for (let i = 0; i < o.records; i++) {
    const qty = rng.int(1, 20);
    const price = rng.int(5, 200);
    const row: any = {
      id: "o" + String(i + 1).padStart(5, "0"),
      customer: "cid" + rng.int(0, 199),
      product: "p" + rng.int(0, 99),
      qty: qty,
      price: price,
      // The expression column recomputes total only for the rows that exist (the shown page), so the data carries
      // it (#12156): without it, the sort by total and sumInArray would see the shown page only.
      total: qty * price,
      status: rng.pick(statuses)
    };
    if (row.total > 1000) row.discount = rng.int(0, 50);
    if (rng.chance(0.3)) row.note = rng.words(rng.int(2, 6));
    orders.push(row);
  }
  const customers: Array<any> = [];
  for (let i = 0; i < o.customers; i++) {
    const contacts: Array<any> = [];
    const count = rng.int(3, 5);
    for (let c = 0; c < count; c++) contacts.push({ cname: rng.words(2), phone: String(rng.int(1000000, 9999999)) });
    customers.push({ cid: "cid" + i, cname: rng.words(2), contacts: contacts });
  }
  const pages: Array<any> = [];
  pages.push({ name: "orders", elements: [
    { type: "matrixdynamic", name: "orders", title: "Orders", columns: orderFields("row"), rowCount: 0, pageSize: 20, allowSort: true,
      maxSortLevel: 3, sortCriteria: [{ field: "total", direction: "desc" }] },
    { type: "expression", name: "ordersTotalShown", title: "Total", expression: "{ordersTotal}" }
  ] });
  pages.push({ name: "ordersPanel", elements: [
    { type: "paneldynamic", name: "ordersPanel", valueName: "orders", title: "Orders as panels", templateElements: orderFields("panel"),
      templateTitle: "Order {panel.id}", panelCount: 0, pageSize: 10, allowSort: true, sortCriteria: [{ field: "qty", direction: "asc" }] }
  ] });
  pages.push({ name: "customers", elements: [
    { type: "paneldynamic", name: "customers", title: "Customers", pageSize: 10, panelCount: 0, templateElements: [
      { type: "text", name: "cid", title: "Id" },
      { type: "text", name: "cname", title: "Name" },
      { type: "matrixdynamic", name: "contacts", title: "Contacts", rowCount: 0, columns: [
        { name: "cname", cellType: "text" }, { name: "phone", cellType: "text" }] },
      { type: "expression", name: "contactCount", title: "Contacts", expression: "countInArray({panel.contacts}, 'cname')" }
    ] },
    { type: "expression", name: "cid0Orders", title: "Orders of cid0", expression: "countInArray({orders}, 'id', {customer} = 'cid0')" },
    { type: "dropdown", name: "selectedOrder", title: "Order", choicesFromQuestion: "orders", choiceValuesFromQuestion: "id",
      choiceTextsFromQuestion: "customer" }
  ] });
  const laterVisible: Array<string> = [];
  for (let p = 4; p <= o.pages; p++) {
    const elements: Array<any> = [];
    const prefix = "p" + p + "_";
    const byTotal = p % 2 === 0;
    const boundName = prefix + "bound";
    elements.push({ type: "text", name: boundName, title: rng.words(3),
      visibleIf: byTotal ? "{ordersTotal} > 1000" : "{openCount} > 0" });
    if (byTotal) laterVisible.push(boundName);
    elements.push({ type: "expression", name: prefix + "aggregate", title: rng.words(2),
      expression: byTotal ? "round({avgTotal}, 2)" : "{orderScore}" });
    for (let i = 2; i < 10; i++) {
      const kind = i % 4;
      const name = prefix + "q" + i;
      if (kind === 0) elements.push({ type: "text", name: name, title: rng.words(3) });
      else if (kind === 1) elements.push({ type: "radiogroup", name: name, title: rng.words(3), choices: ["a", "b", "c"] });
      else if (kind === 2) elements.push({ type: "text", name: name, title: rng.words(2), inputType: "number" });
      else elements.push({ type: "comment", name: name, title: rng.words(2) });
    }
    pages.push({ name: "page" + p, elements: elements });
  }
  const json = {
    title: "Records",
    pages: pages,
    calculatedValues: [
      { name: "ordersTotal", expression: "sumInArray({orders}, 'total')" },
      { name: "openCount", expression: "countInArray({orders}, 'id', {status} = 'open')" },
      { name: "avgTotal", expression: "avgInArray({orders}, 'total')" },
      { name: "orderScore", expression: "round({ordersTotal} / 1000 + {openCount}, 2)" }
    ]
  };
  const questions = 2 + 1 + 3 + (o.pages - 3) * 10;
  const meta = {
    records: o.records,
    pages: o.pages,
    panels: 0,
    questionsWithCells: questions,
    questions: questions,
    visibleQuestions: questions - (o.pages - 3),
    calculatedValues: 4,
    matrix: "orders",
    panel: "ordersPanel",
    customers: o.customers,
    // A question on a later page bound to {ordersTotal}: visible with the data, hidden with no orders.
    boundToTotal: laterVisible[0],
    expectedLintFindings: []
  };
  return { json: json, data: { orders: orders, customers: customers }, meta: meta };
}

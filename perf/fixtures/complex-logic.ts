import { createRng } from "./random.ts";
import { createExpressionGenerator, sampleLength, customerForwardShare } from "./expressions.ts";
import type { Ref, ConditionRequest, Weights } from "./expressions.ts";
import { countJson } from "./count.ts";

// Shaped after the counts of the customer file (D03): three hidden computational pages (476, 31 and 938 elements
// with default values), 108 small pages, 34 single-select matrices whose rows have conditions, 18 dynamic panels,
// 965 default value expressions, 202 calculated values (most of them long sums of iif over dynamic panel items)
// that element conditions read, about 4,300 expressions in all. Only counts and shapes come from the file; every
// name and text is generated.
export interface ComplexLogicOptions {
  seed?: number;
}

export const complexLogicDefaults = { seed: 4300 };

// Columns x rows of the 30 single-select matrices on pages, and of the 4 in dynamic panel templates.
const pageMatrixShapes: Array<[number, number]> = [[2, 5], [5, 8], [5, 3], [5, 3], [5, 3], [4, 116], [4, 3], [11, 116], [4, 115],
  [3, 115], [3, 3], [6, 3], [17, 3], [3, 99], [5, 6], [8, 99], [5, 116], [3, 116], [12, 100], [6, 116], [17, 116], [5, 99], [8, 13],
  [7, 3], [6, 11], [5, 20], [6, 7], [5, 13], [5, 81], [7, 1]];
const templateMatrixShapes: Array<[number, number]> = [[7, 6], [7, 5], [5, 4], [5, 18]];
// The top-level template elements of the 18 dynamic panels, in the file's order. A panel holds a radiogroup, a
// text and a boolean.
const templateLayouts = [
  "html,matrix", "html,matrix,radiogroup,radiogroup,checkbox", "radiogroup,radiogroup,radiogroup,radiogroup,text", "html,radiogroup,panel",
  "matrix", "radiogroup,panel", "html,checkbox,radiogroup,checkbox,radiogroup,checkbox,checkbox", "html,checkbox,checkbox", "html,checkbox",
  "html,checkbox,radiogroup,radiogroup,checkbox,radiogroup,text,checkbox,checkbox", "html,checkbox,checkbox", "matrix",
  "html,checkbox,text,checkbox", "html,dropdown,dropdown,radiogroup,panel,radiogroup,checkbox,radiogroup",
  "html,dropdown,dropdown,radiogroup,matrixdropdown,panel,radiogroup", "checkbox,text", "radiogroup,checkbox,text", "checkbox,checkbox"];
// The 108 small pages: html + matrix, matrix, checkbox, radiogroup, dynamic panel, html + checkbox, two checkboxes,
// multiple text, text, html + html + matrix, a panel.
const smallPages: Array<[string, number]> = [["hm", 4], ["m", 25], ["c", 29], ["r", 22], ["p", 18], ["hc", 2], ["cc", 1], ["mt", 2],
  ["t", 3], ["hhm", 1], ["panel", 1]];
// The file's operators (counted in D03); it has no contains, notcontains or arithmetic.
const ops: Weights = { "=": 27753, "noneof": 15531, "anyof": 16000, "empty": 3000, "<>": 5800, ">": 5600, "<": 3400, "notempty": 158,
  ">=": 54, "<=": 5 };
const andShare = 34411 / (34411 + 20186);
const elementShapes: Weights = { "a": 55, "a.b": 45 };
const sumShapes: Weights = { "a[i].b": 10379, "a[i].b.c": 22781 };
const forwardShare = customerForwardShare;
// Lengths per property (D03: p50, p90, max).
const lengths: { [prop: string]: { p50: number, p90: number, max: number } } = {
  defaultValueExpression: { p50: 286, p90: 1978, max: 10300 },
  visibleIf: { p50: 110, p90: 343, max: 3233 },
  rowVisibleIf: { p50: 172, p90: 282, max: 417 },
  choiceVisibleIf: { p50: 143, p90: 278, max: 376 },
  templateVisibleIf: { p50: 133, p90: 225, max: 671 },
  templateChoiceVisibleIf: { p50: 28, p90: 452, max: 461 },
  columnVisibleIf: { p50: 19, p90: 51, max: 67 },
  validator: { p50: 60, p90: 200, max: 400 },
  short: { p50: 22, p90: 27, max: 27 },
  calculated: { p50: 300, p90: 900, max: 2000 }
};
// The shares of atoms that read a calculated value (D03: 1,116 reads in visibleIf, 372 in defaults, 13 in
// completedHtmlOnCondition).
const calcShare = { visibleIf: 0.075, defaultValueExpression: 0.01, completed: 0.5 };
// The hot questions sit on visible pages after the computational ones, so defaults read them less (a forward read).
const hotShare = { elements: 0.1, defaultValueExpression: 0.02 };
// The calculated values: depths (D03: 176 of depth 1, then 7, 9, 7, 1, 1, 1 of depths 2..7), sums over panel items
// with these term counts, and a few getComment calls.
const calcChainDepths = [2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7];
const calcSums = [{ count: 1, terms: 2, length: 38683 }, { count: 98, terms: 2, length: 8976 }, { count: 17, terms: 6, length: 9500 },
  { count: 17, terms: 5, length: 9000 }];
const calcTotal = 202;
const calcGetComment = 7;
const calcIncludedIntoResult = 26;
const hotQuestions = 20;
const plannedFirst = 40;
const plannedNext = 4;
const elementVisibleIfs = 116;
const hiddenWithVisibleIf = 98;
const rowConditions = 1474;
const templateRowConditions = 13;
const pageValidators = 22;
const templateValidators = 6;

export function generateComplexLogic(options?: ComplexLogicOptions): { json: any, meta: any } {
  const o = Object.assign({}, complexLogicDefaults, options || {});
  const rng = createRng(o.seed);
  const gen = createExpressionGenerator(rng);
  const values = [1, 2, 3, 4, 5];
  let order = 0;
  let counter = 0;
  const nextName = (prefix: string): string => prefix + (++counter);
  const title = (): string => rng.words(rng.int(2, 8));
  const choices = (n: number): Array<any> => {
    const res: Array<any> = [];
    for (let i = 1; i <= n; i++) res.push({ value: i, text: rng.words(rng.int(1, 3)) });
    return res;
  };
  // Elements are created first, then their expressions, so a reference can point forward.
  interface Item { q: any, order: number, role: string, page: number, template?: Array<any> }
  const items: Array<Item> = [];
  const pages: Array<any> = [];
  const add = (page: any, q: any, role: string, ref?: Partial<Ref>): Item => {
    order++;
    page.elements.push(q);
    const item: Item = { q: q, order: order, role: role, page: pages.length - 1 };
    items.push(item);
    if (ref) gen.add(Object.assign({ path: q.name, root: q.name, shape: "a", order: order }, ref) as Ref);
    return item;
  };
  const newPage = (hidden?: boolean): any => {
    const page: any = { name: "page" + (pages.length + 1), elements: [] as Array<any> };
    if (hidden) page.visible = false;
    pages.push(page);
    return page;
  };

  // Pages 1-3, hidden: computational questions with default values.
  let page = newPage(true);
  for (let i = 0; i < 476; i++) {
    if (i % 2 === 0 && i < 452) {
      const value = rng.int(0, 20);
      const isNumber = i % 4 === 0 && i < 408;
      const q: any = { type: "text", name: nextName("t"), title: title(), defaultValue: isNumber ? value : String(value) };
      if (isNumber) { q.inputType = "number"; q.step = 1; }
      add(page, q, "default", { kind: isNumber ? "number" : "text", initial: q.defaultValue });
    } else if (i % 18 === 1) {
      add(page, { type: "radiogroup", name: nextName("r"), title: title(), choices: choices(3) }, "radioExpression",
        { kind: "choice", values: [1, 2, 3], unknownAtLoad: true, writesDefault: true });
    } else {
      const value = rng.int(1, 3);
      add(page, { type: "radiogroup", name: nextName("r"), title: title(), choices: choices(3), defaultValue: value }, "default",
        { kind: "choice", values: [1, 2, 3], initial: value });
    }
  }
  page = newPage(true);
  for (let i = 0; i < 31; i++) {
    const q: any = { type: "radiogroup", name: nextName("r"), title: title(), choices: choices(3) };
    if (i < 26) q.defaultValue = rng.int(1, 3);
    add(page, q, "default", { kind: "choice", values: [1, 2, 3], initial: q.defaultValue });
  }
  page = newPage(true);
  for (let i = 0; i < 938; i++) {
    add(page, { type: "checkbox", name: nextName("k"), title: title(), choices: choices(rng.int(2, 5)) }, "checkboxExpression",
      { kind: "multi", values: [1, 2], unknownAtLoad: true, writesDefault: true });
  }
  // The 108 small pages, in a fixed shuffled order.
  const small: Array<string> = [];
  smallPages.forEach((p: [string, number]) => { for (let i = 0; i < p[1]; i++) small.push(p[0]); });
  rng.shuffle(small);
  let matrixIndex = 0;
  let templateIndex = 0;
  let templateMatrix = 0;
  const matrixItems: Array<Item> = [];
  const templates: Array<Item> = [];
  const hot: Array<Ref> = [];
  const addMatrix = (pg: any): void => {
    const shape = pageMatrixShapes[matrixIndex++];
    const name = nextName("m");
    const rows: Array<any> = [];
    for (let r = 1; r <= shape[1]; r++) rows.push({ value: "r" + r, text: title() });
    const q = { type: "matrix", name: name, title: title(), columns: choices(shape[0]), rows: rows, isRequired: true, eachRowRequired: true };
    const item = add(pg, q, "matrix");
    rows.forEach((row: any) => gen.add({ path: name + "." + row.value, root: name, shape: "a.b", kind: "choice", values: values.slice(0, Math.min(5, shape[0])), order: item.order }));
    matrixItems.push(item);
  };
  const addCheckbox = (pg: any): void => {
    add(pg, { type: "checkbox", name: nextName("c"), title: title(), choices: choices(rng.int(3, 8)), isRequired: true, minSelectedChoices: 1 }, "element",
      { kind: "multi", values: [1, 2, 3] });
  };
  const addHtml = (pg: any): void => {
    add(pg, { type: "html", name: nextName("x"), html: "<p>" + rng.words(6) + "</p>" }, "html");
  };
  const templateElement = (kind: string, name: string): any => {
    if (kind === "matrix") {
      const shape = templateMatrixShapes[templateMatrix++];
      const rows: Array<any> = [];
      for (let r = 1; r <= shape[1]; r++) rows.push({ value: "r" + r, text: rng.words(2) });
      return { type: "matrix", name: name, columns: values.slice(0, Math.min(5, shape[0])).concat([6, 7].slice(0, Math.max(0, shape[0] - 5))), rows: rows };
    }
    if (kind === "html") return { type: "html", name: name, html: "<p>" + rng.words(4) + "</p>" };
    if (kind === "radiogroup" || kind === "checkbox") return { type: kind, name: name, choices: choices(rng.int(11, 13)) };
    if (kind === "dropdown") return { type: "dropdown", name: name, choices: choices(3), placeholder: rng.words(2) };
    if (kind === "text") return { type: "text", name: name, inputType: "number", max: 100, step: 1 };
    if (kind === "matrixdropdown") {
      return { type: "matrixdropdown", name: name, columns: [{ name: "c1", cellType: "dropdown", choices: [1, 2, 3] }], rows: ["r1", "r2", "r3", "r4", "r5", "r6"] };
    }
    return { type: "panel", name: name, elements: [{ type: "radiogroup", name: name + "r", choices: choices(4) }, { type: "text", name: name + "t" },
      { type: "boolean", name: name + "b", displayMode: "segmented" }] };
  };
  small.forEach((kind: string) => {
    page = newPage();
    if (kind === "hm") { addHtml(page); addMatrix(page); }
    if (kind === "m") addMatrix(page);
    if (kind === "c") addCheckbox(page);
    if (kind === "cc") { addCheckbox(page); addCheckbox(page); }
    if (kind === "hc") { addHtml(page); addCheckbox(page); }
    if (kind === "hhm") { addHtml(page); addHtml(page); addMatrix(page); }
    if (kind === "r") {
      // The first 20 radiogroups of their own visible pages are the questions most conditions read.
      const isHot = hot.length < hotQuestions;
      const item = add(page, { type: "radiogroup", name: nextName(isHot ? "h" : "r"), title: title(), choices: choices(rng.int(3, 6)), isRequired: true },
        isHot ? "hot" : "element", { kind: "choice", values: [1, 2] });
      if (isHot) hot.push({ path: item.q.name, root: item.q.name, shape: "a", kind: "choice", values: [1, 2, 3], order: item.order });
    }
    if (kind === "t") add(page, { type: "text", name: nextName("t"), title: title(), isRequired: true }, "element", { kind: "text" });
    if (kind === "mt") {
      const items12: Array<any> = [];
      for (let i = 1; i <= 12; i++) items12.push({ name: "i" + i });
      add(page, { type: "multipletext", name: nextName("mt"), title: title(), items: items12 }, "element");
    }
    if (kind === "panel") {
      add(page, { type: "panel", name: nextName("panel"), title: title(), elements: [
        { type: "radiogroup", name: nextName("pr"), title: title(), choices: choices(3) },
        { type: "text", name: nextName("pt"), title: title() },
        { type: "boolean", name: nextName("pb"), title: title() }] }, "panel");
    }
    if (kind === "p") {
      const name = nextName("pd");
      // Template names are unique in the survey: the linter reads them as survey names.
      const template = templateLayouts[templateIndex++].split(",").map((k: string, i: number) => templateElement(k, name + "_f" + (i + 1)));
      const q = { type: "paneldynamic", name: name, title: title(), templateElements: template, isRequired: true, allowAddPanel: false,
        allowRemovePanel: false, displayMode: "list", titleLocation: "hidden" };
      const item = add(page, q, "paneldynamic");
      item.template = template;
      templates.push(item);
      // Item references with literal indexes, as the file's sums read them.
      for (let k = 0; k < 10; k++) {
        template.forEach((t: any) => {
          if (t.type === "text") gen.add({ path: name + "[" + k + "]." + t.name, root: name, shape: "a[i].b", kind: "number", order: item.order });
          if (t.type === "radiogroup") gen.add({ path: name + "[" + k + "]." + t.name, root: name, shape: "a[i].b", kind: "choice", values: [1, 2, 3, 4], order: item.order });
          if (t.type === "panel") gen.add({ path: name + "[" + k + "]." + t.name + "t", root: name, shape: "a[i].b", kind: "number", order: item.order });
          if (t.type === "matrix") t.rows.forEach((row: any) => gen.add({ path: name + "[" + k + "]." + t.name + "." + row.value, root: name,
            shape: "a[i].b.c", kind: "number", order: item.order }));
        });
      }
    }
  });

  // The calculated values, named before any expression so element conditions can read them.
  const calcNames: Array<string> = [];
  for (let i = 1; i <= calcTotal; i++) calcNames.push("cv" + i);
  const calcRefs: Array<Ref> = calcNames.map((name: string): Ref => ({ path: name, root: name, shape: "calc", kind: "number", order: order + 1, unknownAtLoad: true }));

  // The expressions.
  const counts: { [prop: string]: number } = {};
  const count = (prop: string): void => { counts[prop] = (counts[prop] || 0) + 1; };
  const req = (item: Item, prop: string, extra?: Partial<ConditionRequest>): ConditionRequest => {
    const share = prop === "defaultValueExpression" ? calcShare.defaultValueExpression : prop === "calculated" ? 0 : calcShare.visibleIf;
    return Object.assign({
      owner: item.order, self: item.q.name, length: sampleLength(rng, lengths[prop]), forward: forwardShare, shapes: elementShapes,
      ops: ops, andShare: andShare, notShare: 0.015, arithmeticShare: 0,
      scopes: [{ refs: hot, share: prop === "defaultValueExpression" ? hotShare.defaultValueExpression : hotShare.elements }, { refs: calcRefs, share: share }] }, extra || {});
  };
  const cond = (item: Item, prop: string, extra?: Partial<ConditionRequest>): string => gen.condition(req(item, prop, extra)).text;
  const iifOf = (item: Item, prop: string, extra?: Partial<ConditionRequest>): string => {
    const total = sampleLength(rng, lengths[prop]);
    if (total < 400) return "iif(" + cond(item, prop, Object.assign({ length: Math.max(16, total - 12) }, extra || {})) + ", 1, 0)";
    // A long default is a sum of iif terms, as in the file.
    const terms: Array<string> = [];
    let length = 0;
    while(length < total) {
      const t = "iif(" + cond(item, prop, Object.assign({ length: rng.int(60, 300) }, extra || {})) + ", " + rng.int(1, 5) + ", 0)";
      terms.push(t);
      length += t.length + 3;
    }
    return terms.join(" + ");
  };
  // The question with a setValueIf gets its value at load when the condition holds, so a condition that reads it
  // has no value the generator knows.
  const texts = items.filter((it: Item) => it.role === "element" && it.q.type === "text");
  gen.refs("a").forEach((r: Ref) => { if (r.path === texts[2].q.name) r.unknownAtLoad = true; });
  // Element conditions; the first 98 elements that get one are also visible: false, as in the file.
  let hiddenAtLoad = 0;
  let withVisibleIf = 0;
  const setVisibleIf = (it: Item, text: string): void => {
    it.q.visibleIf = text;
    if (withVisibleIf++ < hiddenWithVisibleIf) it.q.visible = false;
    count("visibleIf");
  };
  const hotPaths = hot.map((r: Ref) => r.path);
  // The conditions that decide the visible count read no question with a defaultValue: in this survey a visibleIf
  // over a default on a hidden page can be evaluated before the default is applied and keep that value (seen on
  // master, not reduced to a smaller survey), so its value at load is not the one the generator computes.
  const noDefault = (r: Ref): boolean => r.initial === undefined;
  // Planned: the first hot question hides 40 elements, the next ten hide 4 each (answer/first, answer/next10).
  const planned: Array<{ name: string, value: number, elements: Array<string> }> = [];
  // Hot questions past the eleventh answer no scenario: they may get a condition, as the file's radiogroups do.
  const elementItems = items.filter((it: Item) => ["element", "matrix", "paneldynamic", "panel", "html"].indexOf(it.role) > -1 ||
    (it.role === "hot" && hotPaths.indexOf(it.q.name) > 10));
  const plannedSet = new Set<Item>();
  for (let h = 0; h < 11; h++) {
    const list: Array<string> = [];
    const n = h === 0 ? plannedFirst : plannedNext;
    while(list.length < n) {
      const it = rng.pick(elementItems);
      if (plannedSet.has(it)) continue;
      plannedSet.add(it);
      const rest = gen.conditionAtLoad(req(it, "visibleIf", { length: rng.int(20, 160), exclude: hotPaths, accept: noDefault }), true);
      setVisibleIf(it, "{" + hot[h].path + "} <> 2 and (" + rest.text + ")");
      list.push(it.q.name);
    }
    planned.push({ name: hot[h].path, value: 2, elements: list });
  }
  elementItems.forEach((it: Item) => {
    if (it.q.visibleIf || counts.visibleIf >= elementVisibleIfs) return;
    // An element condition must have a value known at load, so the planned visible count is exact.
    const c = gen.condition(req(it, "visibleIf", { knownAtLoad: true, accept: noDefault }));
    if (c.atLoad === undefined) return;
    setVisibleIf(it, c.text);
    // A hidden panel hides its three questions; the panel itself is not a question.
    if (c.atLoad === false) hiddenAtLoad += it.role === "panel" ? 3 : 1;
  });
  let rowIndex = 0;
  items.forEach((it: Item) => {
    const q = it.q;
    if (it.role === "checkboxExpression" || it.role === "radioExpression") {
      // Defaults read no other default value expression: the linter reports such a chain as a write loop.
      q.defaultValueExpression = iifOf(it, "defaultValueExpression", { accept: (r: Ref): boolean => !r.writesDefault });
      count("defaultValueExpression");
    }
    if (q.type === "matrix" && q.rows) {
      q.rows.forEach((row: any) => {
        if (rowIndex++ % 40 === 39 || counts["rows.visibleIf"] >= rowConditions) return;
        row.visibleIf = cond(it, "rowVisibleIf");
        count("rows.visibleIf");
      });
    }
    // The hot questions keep every choice, so a page can always commit their answers.
    if ((q.type === "checkbox" || q.type === "radiogroup") && it.role === "element") {
      q.choices.forEach((ch: any, i: number) => {
        if (i === 0 || counts["choices.visibleIf"] >= 926) return;
        ch.visibleIf = cond(it, "choiceVisibleIf");
        count("choices.visibleIf");
      });
    }
  });
  // Checkboxes of page 3 with choice conditions, until the file's count.
  items.filter((it: Item) => it.role === "checkboxExpression").forEach((it: Item) => {
    if (counts["choices.visibleIf"] >= 926) return;
    it.q.choices[1].visibleIf = cond(it, "choiceVisibleIf");
    count("choices.visibleIf");
  });
  let templateBooleans = 0;
  let templateTextConditions = 0;
  let templateRows = templateRowConditions;
  let templateValidatorsLeft = templateValidators;
  templates.forEach((it: Item) => {
    const scope: Array<Ref> = [];
    (it.template as Array<any>).forEach((t: any) => {
      if (t.type === "radiogroup") scope.push({ path: "panel." + t.name, root: "panel." + t.name, shape: "panel.a", kind: "choice", values: [1, 2, 3, 4], order: 0 });
      if (t.type === "text") scope.push({ path: "panel." + t.name, root: "panel." + t.name, shape: "panel.a", kind: "number", order: 0 });
      if (t.type === "matrix") scope.push({ path: "panel." + t.name + ".r1", root: "panel." + t.name, shape: "panel.a.b", kind: "choice", values: [1, 2], order: 0, noOrder: true });
    });
    const tReq = (self: string): Partial<ConditionRequest> => ({
      scopes: [{ refs: scope.filter((r: Ref) => r.root !== "panel." + self), share: 0.3 }, { refs: hot, share: 0.1 }, { refs: calcRefs, share: calcShare.visibleIf }],
      self: self });
    (it.template as Array<any>).forEach((t: any) => {
      t.visibleIf = cond(it, "templateVisibleIf", tReq(t.name));
      count("templateElements.visibleIf");
      const choiceHolders = t.type === "panel" ? [t.elements[0]] : [t];
      choiceHolders.forEach((holder: any) => {
        if (!holder.choices || holder.type === "dropdown") return;
        holder.choices.forEach((ch: any, c: number) => {
          if (c === 0 || counts["templateElements.choices.visibleIf"] >= 443) return;
          ch.visibleIf = cond(it, "templateChoiceVisibleIf", tReq(holder.name));
          count("templateElements.choices.visibleIf");
        });
      });
      if (t.type === "matrix") {
        t.rows.forEach((row: any) => {
          if (templateRows <= 0) return;
          templateRows--;
          row.visibleIf = "!(" + cond(it, "short", tReq(t.name)) + ")";
          count("templateElements.rows.visibleIf");
        });
      }
      if ((t.type === "matrix" || t.type === "text") && templateValidatorsLeft > 0) {
        templateValidatorsLeft--;
        t.validators = [{ type: "expression", text: rng.words(5), expression: cond(it, "validator", tReq(t.name)) }];
        count("templateElements.validators.expression");
      }
      if (t.type === "panel" && templateBooleans++ < 4) {
        const b = t.elements[2];
        b.requiredIf = cond(it, "short", tReq(b.name)); count("templateElements.requiredIf");
        b.resetValueIf = cond(it, "short", tReq(b.name)); count("templateElements.resetValueIf");
      }
      if (t.type === "text" && templateTextConditions++ < 4) {
        t.requiredIf = cond(it, "short", tReq(t.name)); count("templateElements.requiredIf");
        t.setValueIf = cond(it, "short", tReq(t.name)); count("templateElements.setValueIf");
        t.setValueExpression = String(rng.int(1, 9));
      }
    });
  });
  // Column conditions and validators on the page matrices; the survey-level requiredIf, setValueIf and resetValueIf.
  let columnConditions = 48;
  let validators = pageValidators;
  matrixItems.forEach((it: Item) => {
    it.q.columns.forEach((col: any, i: number) => {
      if (i === 0 || columnConditions <= 0) return;
      col.visibleIf = "!(" + cond(it, "columnVisibleIf") + ")";
      count("columns.visibleIf");
      columnConditions--;
    });
    if (validators > 0) {
      it.q.validators = [{ type: "expression", text: rng.words(5), expression: cond(it, "validator") }];
      count("validators.expression");
      validators--;
    }
  });
  texts[0].q.requiredIf = cond(texts[0], "short"); count("requiredIf");
  texts[1].q.requiredIf = cond(texts[1], "short"); count("requiredIf");
  texts[2].q.setValueIf = cond(texts[2], "short"); texts[2].q.setValueExpression = "'" + rng.word() + "'"; count("setValueIf");
  texts[2].q.resetValueIf = cond(texts[2], "short"); count("resetValueIf");

  // The calculated values. Their own conditions read answers whose value at load is known: no calculated value and
  // no default value expression, which reads calculated values (the linter reports such a loop as cycle/value-write).
  // A deeper value reads one value a level up.
  const calculatedValues: Array<any> = [];
  const calcOwner: Item = { q: { name: "" }, order: order + 1, role: "calc", page: 0 };
  let calcIndex = 0;
  for (const sum of calcSums) {
    for (let i = 0; i < sum.count; i++) {
      const terms: Array<string> = [];
      let length = 0;
      const target = sum.count === 1 ? sum.length : Math.floor(sum.length * (0.8 + rng.next() * 0.4));
      while(length < target) {
        const used = new Set<string>();
        const head = gen.pickRef(calcOwner.order, 0, { "a[i].b": 1 }, used, ["choice"]) as Ref;
        const parts: Array<string> = [];
        for (let k = 0; k < sum.terms; k++) parts.push("{" + (gen.pickRef(calcOwner.order, 0, sumShapes, used, ["number"]) as Ref).path + "}");
        const t = "iif({" + head.path + "} = " + rng.int(1, 4) + ", " + parts.join(" + ") + ", 0)";
        terms.push(t);
        length += t.length + 3;
      }
      calculatedValues.push({ name: calcNames[calcIndex++], expression: terms.join(" + ") });
    }
  }
  for (let i = 0; i < calcGetComment; i++) {
    const r = rng.pick(items.filter((it: Item) => it.role === "element" && it.q.type === "checkbox"));
    calculatedValues.push({ name: calcNames[calcIndex++], expression: "getComment('" + r.q.name + "', 1)" });
  }
  const depthOne: Array<string> = [];
  while(calcIndex < calcTotal - calcChainDepths.length) {
    const name = calcNames[calcIndex++];
    calculatedValues.push({ name: name, expression: "iif(" + cond(calcOwner, "calculated", { self: name, knownAtLoad: true }) + ", 1, 0)" });
    depthOne.push(name);
  }
  const byDepth: { [depth: number]: Array<string> } = { 1: depthOne };
  const chainNames: Array<string> = [];
  for (const depth of calcChainDepths) {
    const name = calcNames[calcIndex++];
    const prev = rng.pick(byDepth[depth - 1]);
    const condition = cond(calcOwner, "calculated", { self: name, length: rng.int(40, 200), knownAtLoad: true });
    calculatedValues.push({ name: name, expression: "iif(" + condition + ", {" + prev + "} + 1, {" + prev + "})" });
    (byDepth[depth] = byDepth[depth] || []).push(name);
    chainNames.push(name);
  }
  for (let i = 0; i < calcIncludedIntoResult; i++) calculatedValues[i * 7 % calculatedValues.length].includeIntoResult = true;
  rng.shuffle(calculatedValues);
  const completedHtmlOnCondition: Array<any> = [];
  for (let i = 0; i < 5; i++) {
    completedHtmlOnCondition.push({ expression: cond(calcOwner, "visibleIf", { scopes: [{ refs: calcRefs, share: calcShare.completed }] }),
      html: "<p>" + rng.words(8) + "</p>" });
    count("completedHtmlOnCondition");
  }
  counts.calculatedValues = calculatedValues.length;
  let expressions = 0;
  for (const key in counts) expressions += counts[key];

  const json = { title: rng.words(3), pages: pages, calculatedValues: calculatedValues, completedHtmlOnCondition: completedHtmlOnCondition,
    showQuestionNumbers: "off", showPageTitles: false, clearInvisibleValues: "none", requiredMark: "" };
  // The page-level panel holds three questions.
  const questions = items.filter((it: Item) => it.role !== "panel").length + 3;
  const onHiddenPages = items.filter((it: Item) => it.page < 3).length;
  const firstHot = items.filter((it: Item) => it.q.name === planned[0].name)[0];
  const counted = countJson(json);
  const meta = {
    pages: pages.length,
    panels: 1,
    questions: questions,
    // Multiple text items (2 x 12).
    questionsWithCells: questions + 24,
    // Questions on the three hidden pages are not visible; nor are the elements whose condition is false at load.
    visibleQuestions: questions - onHiddenPages - hiddenAtLoad,
    calculatedValues: calculatedValues.length,
    choiceQuestions: counted.choiceQuestions,
    expressions: expressions,
    expressionsPerProperty: counts,
    chainStarts: hot.map((r: Ref) => r.path),
    firstAnswer: { name: planned[0].name, value: planned[0].value, page: firstHot.page },
    nextAnswers: planned.slice(1).map((p: any) => ({ name: p.name, value: p.value })),
    planned: planned.map((p: any) => ({ start: p.name, value: p.value, hides: p.elements.length })),
    plannedElements: planned[0].elements,
    plannedByStart: planned.map((p: any) => p.elements),
    calculatedChains: chainNames.length,
    expectedLintFindings: []
  };
  return { json: json, meta: meta };
}

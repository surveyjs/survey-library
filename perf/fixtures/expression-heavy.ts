import { createRng, isoDate } from "./random.ts";
import { createExpressionGenerator, sampleLength, customerForwardShare } from "./expressions.ts";
import type { Ref, ConditionRequest } from "./expressions.ts";

// About 3,000 questions and 6,000 expressions on elements, choices, matrix columns and rows, validators and
// triggers, most of them short with a long tail. 20 chain-start questions on page 1 are read far more than the rest.
export interface ExpressionsOptions {
  seed?: number;
  pages?: number;
}

export const expressionsDefaults = { seed: 6000, pages: 60 };

const forwardShare = customerForwardShare;
// The lengths of the customer file's element expressions (D03): p90 946, max 10,300 (a default value expression).
const lengthMix = { p50: 60, p90: 946, max: 10300 };
const chainStarts = 20;
// The elements whose visibility the first chain-start answer changes (01 check 6).
const plannedPerStart = [200, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
// "fn": the function atoms of 01 (iif, round, sumInArray, countInArray with a filter, avgInArray, dateDiff).
const shapes = { "a": 50, "a.b": 15, "a.b.c": 8, "a[i].b": 11, "a[i].b.c": 9, "fn": 2 };
// The two fixed dates dateDiff reads; on page 1, in place of two text questions.
const dateSlots: { [index: number]: string } = { 32: isoDate(2024, 1, 15), 45: isoDate(2024, 3, 1) };

// The question types of one page, in order: 50 questions.
const pageLayout = ["radiogroup", "checkbox", "dropdown", "number", "radiogroup", "boolean", "text", "matrix", "radiogroup", "checkbox",
  "number", "matrixdropdown", "radiogroup", "dropdown", "checkbox", "number", "radiogroup", "target", "text", "boolean",
  "radiogroup", "checkbox", "matrix", "number", "dropdown", "radiogroup", "paneldynamic", "checkbox", "number", "radiogroup",
  "dropdown", "boolean", "text", "radiogroup", "checkbox", "matrix", "number", "radiogroup", "dropdown", "checkbox",
  "matrixdropdown", "number", "radiogroup", "target", "boolean", "text", "dropdown", "radiogroup", "checkbox", "number"];

export function generateExpressions(options?: ExpressionsOptions): { json: any, meta: any } {
  const o = Object.assign({}, expressionsDefaults, options || {});
  const rng = createRng(o.seed);
  const gen = createExpressionGenerator(rng);
  const pages: Array<any> = [];
  const elements: Array<{ q: any, order: number, kind: string }> = [];
  const targets: Array<string> = [];
  const values = [1, 2, 3, 4];
  let order = 0;
  const startRefs: Array<Ref> = [];
  const addPlain = (name: string, kind: any, vals?: Array<number | string>): void => {
    gen.add({ path: name, root: name, shape: "a", kind: kind, values: vals, order: order });
  };
  // A function atom over one question, with its value at load (every answer empty).
  let fnCount = 0;
  const addFn = (root: string, text: string, atLoad: boolean): void => {
    gen.add({ path: "fn" + (++fnCount), root: root, shape: "fn", kind: "number", order: order, fixed: { text: text, atLoad: atLoad } });
  };
  const dates: Array<string> = [];
  // Pass 1: every element and every name it offers, so a reference can point forward.
  for (let p = 0; p < o.pages; p++) {
    const page: any = { name: "page" + (p + 1), elements: [] };
    pages.push(page);
    const layout = p === 0 ? pageLayout.map((kind: string, i: number): string => i < chainStarts ? "start" : dateSlots[i] ? "date" : kind) : pageLayout;
    layout.forEach((kind: string, i: number) => {
      order++;
      const name = (kind === "start" ? "start" + i : "e" + p + "_" + i);
      const title = rng.words(rng.int(2, 6));
      let q: any;
      if (kind === "start" || kind === "radiogroup" || kind === "dropdown" || kind === "checkbox") {
        const type = kind === "start" ? "radiogroup" : kind;
        q = { type: type, name: name, title: title, choices: values.map((v: number): any => ({ value: v, text: rng.words(rng.int(1, 3)) })) };
        const ref: Ref = { path: name, root: name, shape: "a", kind: type === "checkbox" ? "multi" : "choice", values: values, order: order };
        if (kind === "start") startRefs.push(ref); else gen.add(ref);
        if (type === "radiogroup" && kind !== "start") addFn(name, "iif({" + name + "} = 2, 5, 0) > 1", false);
      } else if (kind === "date") {
        q = { type: "text", name: name, title: title, inputType: "date", defaultValue: dateSlots[i] };
        dates.push(name);
      } else if (kind === "number") {
        q = { type: "text", name: name, title: title, inputType: "number" };
        addPlain(name, "number");
        const k = rng.int(1, 50);
        addFn(name, "round({" + name + "} * 1.5, 1) > " + k, false);
      } else if (kind === "boolean") {
        q = { type: "boolean", name: name, title: title };
        addPlain(name, "boolean");
      } else if (kind === "text") {
        q = { type: "text", name: name, title: title };
        addPlain(name, "text");
      } else if (kind === "target") {
        // Trigger targets: no expression reads them, so a trigger never starts another one.
        q = { type: "text", name: name, title: title };
        targets.push(name);
      } else if (kind === "matrix") {
        const rows: Array<any> = [];
        for (let r = 1; r <= 5; r++) rows.push({ value: "r" + r, text: rng.words(2) });
        q = { type: "matrix", name: name, title: title, columns: values.map((v: number): any => ({ value: v, text: rng.words(1) })), rows: rows };
        rows.forEach((row: any) => gen.add({ path: name + "." + row.value, root: name, shape: "a.b", kind: "choice", values: values, order: order }));
      } else if (kind === "matrixdropdown") {
        const rows = ["r1", "r2", "r3", "r4"];
        q = { type: "matrixdropdown", name: name, title: title, rows: rows, columns: [
          { name: "c1", cellType: "dropdown", choices: values },
          { name: "c2", cellType: "checkbox", choices: values },
          { name: "c3", cellType: "text", inputType: "number" }] };
        rows.forEach((row: string) => {
          gen.add({ path: name + "." + row + ".c1", root: name, shape: "a.b.c", kind: "choice", values: values, order: order });
          gen.add({ path: name + "." + row + ".c2", root: name, shape: "a.b.c", kind: "multi", values: values, order: order });
          gen.add({ path: name + "." + row + ".c3", root: name, shape: "a.b.c", kind: "number", order: order });
        });
        addFn(name, "sumInArray({" + name + "}, 'c3') > " + rng.int(1, 50), false);
      } else {
        // Template names are unique in the survey: the linter reads them as survey names.
        q = { type: "paneldynamic", name: name, title: title, panelCount: 2, templateElements: [
          { type: "dropdown", name: name + "_f1", choices: values },
          { type: "text", name: name + "_f2", inputType: "number" },
          { type: "matrix", name: name + "_tm", columns: values, rows: ["r1", "r2", "r3"] }] };
        for (let k = 0; k < 2; k++) {
          gen.add({ path: name + "[" + k + "]." + name + "_f1", root: name, shape: "a[i].b", kind: "choice", values: values, order: order });
          gen.add({ path: name + "[" + k + "]." + name + "_f2", root: name, shape: "a[i].b", kind: "number", order: order });
          gen.add({ path: name + "[" + k + "]." + name + "_tm.r" + (k + 1), root: name, shape: "a[i].b.c", kind: "choice", values: values, order: order });
        }
        // The filter is an unquoted condition over the item's own fields.
        addFn(name, "countInArray({" + name + "}, '" + name + "_f2', {" + name + "_f1} = " + rng.int(1, 4) + ") > 0", false);
        addFn(name, "avgInArray({" + name + "}, '" + name + "_f2') < " + rng.int(1, 50), true);
      }
      page.elements.push(q);
      elements.push({ q: q, order: order, kind: kind });
    });
  }
  startRefs.forEach((ref: Ref) => gen.add(Object.assign({}, ref, { order: 0 })));
  // 46 days between the two fixed dates.
  for (let i = 0; i < 20; i++) {
    const k = rng.int(1, 90);
    gen.add({ path: "dateDiff" + i, root: dates[0], shape: "fn", kind: "number", order: rng.int(1, order),
      fixed: { text: "dateDiff({" + dates[0] + "}, {" + dates[1] + "}, 'days') > " + k, atLoad: 46 > k } });
  }

  // Pass 2: the expressions.
  const counts: { [prop: string]: number } = {};
  const count = (prop: string): void => { counts[prop] = (counts[prop] || 0) + 1; };
  const request = (owner: number, self: string): ConditionRequest => ({ owner: owner, self: self, length: sampleLength(rng, lengthMix),
    forward: forwardShare, shapes: shapes, notShare: 0.05, iifShare: 0.04, scope: startRefs, scopeShare: 0.08 });
  const condition = (owner: number, self: string): string => gen.condition(request(owner, self)).text;
  // Planned: "{startK} <> 2 and (C)", where C is true while every answer is empty, so answering startK = 2 hides the
  // element and nothing else is needed to know it.
  const planned: Array<{ start: string, value: number, elements: Array<string> }> = [];
  const candidates = elements.filter((e: any) => e.order > 50 && e.kind !== "target" && e.kind !== "paneldynamic");
  const plannedSet = new Set<string>();
  plannedPerStart.forEach((n: number, k: number) => {
    const start = "start" + k;
    const list: Array<string> = [];
    while(list.length < n) {
      const e = rng.pick(candidates);
      if (plannedSet.has(e.q.name)) continue;
      plannedSet.add(e.q.name);
      const rest = gen.conditionAtLoad(Object.assign(request(e.order, e.q.name), { length: rng.int(20, 200), exclude: startRefs.map((r: Ref) => r.path) }), true);
      e.q.visibleIf = "{" + start + "} <> 2 and (" + rest.text + ")";
      count("visibleIf");
      list.push(e.q.name);
    }
    planned.push({ start: start, value: 2, elements: list });
  });
  const triggers: Array<any> = [];
  let hiddenAtLoad = 0;
  let unknownAtLoad = 0;
  elements.forEach((e: any) => {
    const q = e.q;
    if (e.kind === "start") return;
    if (!q.visibleIf && rng.chance(0.5)) {
      const visibleIf = gen.condition(request(e.order, q.name));
      q.visibleIf = visibleIf.text;
      count("visibleIf");
      if (visibleIf.atLoad === false) hiddenAtLoad++;
      if (visibleIf.atLoad === undefined) unknownAtLoad++;
    }
    if (rng.chance(0.2)) { q.enableIf = condition(e.order, q.name); count("enableIf"); }
    if (rng.chance(0.13)) { q.requiredIf = condition(e.order, q.name); count("requiredIf"); }
    if (q.choices && q.type !== "matrix") {
      if (rng.chance(0.8)) { q.choices[2].visibleIf = condition(e.order, q.name); count("choices.visibleIf"); }
      if (rng.chance(0.3)) { q.choices[3].enableIf = condition(e.order, q.name); count("choices.enableIf"); }
    }
    if (q.type === "matrix") {
      q.rows.forEach((row: any) => { row.visibleIf = condition(e.order, q.name); count("rows.visibleIf"); });
    }
    if (q.type === "matrixdropdown") {
      q.columns[0].visibleIf = condition(e.order, q.name); count("columns.visibleIf");
      q.columns[2].visibleIf = condition(e.order, q.name); count("columns.visibleIf");
    }
    if (q.type === "paneldynamic") {
      q.templateElements[1].visibleIf = "{panel." + q.name + "_f1} <> 3 or " + gen.atom(gen.pickRef(e.order, forwardShare, shapes, new Set<string>(["root:" + q.name])) as Ref).text;
      count("templateElements.visibleIf");
    }
    if ((q.inputType === "number" || q.type === "text") && rng.chance(0.4)) {
      q.validators = [{ type: "expression", text: rng.words(4), expression: condition(e.order, q.name) }];
      count("validators.expression");
    }
  });
  elements.filter((e: any) => e.kind === "target").forEach((e: any, i: number) => {
    const kind = i % 3;
    const expression = condition(e.order, e.q.name);
    count("triggers");
    if (kind === 0) triggers.push({ type: "setvalue", expression: expression, setToName: e.q.name, setValue: rng.words(1) });
    else if (kind === 1) {
      const from = gen.pickRef(e.order, 0, { "a": 1 }, new Set<string>(), ["choice", "number"]) as Ref;
      triggers.push({ type: "copyvalue", expression: expression, setToName: e.q.name, fromName: from.path });
    } else {
      const from = gen.pickRef(e.order, 0, { "a": 1 }, new Set<string>(), ["number"]) as Ref;
      triggers.push({ type: "runexpression", expression: expression, setToName: e.q.name, runExpression: "{" + from.path + "} * 2" });
    }
  });
  let expressionCount = 0;
  for (const key in counts) expressionCount += counts[key];
  const questions = elements.length;
  const matrixDropdownCells = elements.filter((e: any) => e.kind === "matrixdropdown").length * 12;
  const panelQuestions = elements.filter((e: any) => e.kind === "paneldynamic").length * 2 * 3;
  const json = { title: rng.words(3), pages: pages, triggers: triggers };
  const meta = {
    pages: o.pages,
    panels: 0,
    questions: questions,
    questionsWithCells: questions + matrixDropdownCells + panelQuestions,
    // Every condition reads answers only, so its value at load is known.
    visibleQuestions: unknownAtLoad === 0 ? questions - hiddenAtLoad : undefined,
    calculatedValues: 0,
    expressions: expressionCount,
    expressionsPerProperty: counts,
    chainStarts: startRefs.map((r: Ref) => r.path),
    // answer/first sets the most-read chain-start question; answer/next10 answers the next ten.
    firstAnswer: { name: "start0", value: 2 },
    nextAnswers: planned.slice(1).map((p: any) => ({ name: p.start, value: p.value })),
    planned: planned.map((p: any) => ({ start: p.start, value: p.value, hides: p.elements.length })),
    plannedElements: planned[0].elements,
    plannedByStart: planned.map((p: any) => p.elements),
    expectedLintFindings: []
  };
  return { json: json, meta: meta };
}

import { createRng, isoDate } from "./random.ts";
import type { Rng } from "./random.ts";
import { createExpressionGenerator } from "./expressions.ts";
import type { Weights } from "./expressions.ts";

// A form of fixed keyed slots: a few count answers switch on slots k0, k1, ..., each slot has a keyed row in a grid
// (a matrixdropdown) and a keyed panel in a dynamic panel whose template holds nested dynamic panels and nested
// matrices with one item at least, "who" checkboxes offer one choice per slot and set themselves through setValueIf
// when one slot is active, and a large set of calculated values reads all of it: values per slot, values per row that
// pick a slot, values that read other values several levels deep, and long nested iif expressions over the slots,
// over indexed paths ({slotValues[2].nestB[0].q}) and over keyed grid cells ({grid.k2.col1}). One conditions pass
// costs a lot, and one data load runs many of them: every nested item copies its slot key in, and every copy writes
// the slot record back.
export interface SlotFormOptions {
  seed?: number;
  // The number of keyed slots.
  slots?: number;
  // The share of the full form: calculated values and plain questions. The slots, their grid rows, the nested
  // containers and the "who" checkboxes are the same at every scale.
  scale?: number;
  // The number of calculated values; by default 2,400 x scale.
  calculatedValues?: number;
}

export const slotFormDefaults = { seed: 2026, slots: 20, scale: 1 };

const fullCalculatedValues = 2400;
// The slots a data load switches on: k0 always, k1 by the boolean, two of the first counted group.
const activeSlotCount = 4;
// Six screen checkboxes; each "who" checkbox asks which slots have one screen choice.
const screenCount = 6;
const screenChoices = 12;
const whoCount = 63;
// The screen choices a data load selects in each screen checkbox.
const selectedPerScreen = 3;
// Top-level questions besides the slot machinery at scale 1.
const plainTopQuestions = 112;
const questionsPerPage = 13;
// Per slot at scale 1: plain questions in the three sections of the template, and in each nested dynamic panel.
const plainSlotQuestions = 90;
const nestedPanelQuestions = [9, 18, 7, 8, 4, 11];
const nestedMatrixColumns = [5, 4, 4, 4, 4, 3];
// The calculated value families at scale 1 (each count is a number of families or of fields per row).
const perSlotSumFamilies = 33;
const sumTermsByFamily = (f: number): number => (f === 0 ? 18 : f === 1 ? 12 : f < 4 ? 1 : f === 4 ? 5 : 6);
const fixedRowSlots = 8;
const fixedRowFields = 40;
const pickRows = 4;
const pickRowFields = 30;
const digitValues = 9;
const digitFamilies = 13;
// The long one-off values at scale 1, by length: the first of the longest bucket has its maximum, about 53,000
// characters.
const longSingles: Array<{ count: number, min: number, max: number }> = [
  { count: 37, min: 10000, max: 53000 }, { count: 229, min: 2000, max: 10000 }, { count: 48, min: 500, max: 2000 }, { count: 106, min: 100, max: 500 }];

export function slotKeys(slots: number): Array<string> {
  const res: Array<string> = [];
  for (let i = 0; i < slots; i++) res.push("k" + i);
  return res;
}

// The slot groups: k0 is always on, k1 by a boolean, groupB and groupC by a count each (a slot is on when the count
// reaches its position in the group).
function slotGroups(slots: number): { b: number, c: number } {
  const rest = Math.max(0, slots - 2);
  const b = Math.round(rest * 10 / 18);
  return { b: b, c: rest - b };
}

const at = (rng: Rng, values: Array<string>): string => values[rng.int(0, values.length - 1)];
const str = (v: string): string => "'" + v + "'";

export function generateSlotForm(options?: SlotFormOptions): { json: any, data: any, meta: any } {
  const o = Object.assign({}, slotFormDefaults, options || {});
  const rng = createRng(o.seed);
  const gen = createExpressionGenerator(rng);
  // The data switches on k0 to k3, and count-up one more of the counted group: that group needs three slots.
  if (!(o.slots >= 7)) throw new Error("slotForm: slots must be 7 or more, got " + o.slots);
  const keys = slotKeys(o.slots);
  const groups = slotGroups(o.slots);
  const scaled = (n: number, min: number = 1): number => Math.max(min, Math.round(n * o.scale));
  let qCounter = 0;
  const q = (): string => "q" + (++qCounter);
  let cCounter = 0;
  const c = (): string => "c" + (++cCounter);
  const title = (): string => rng.words(rng.int(2, 7));
  const choiceList = (n: number, start: number = 1): Array<any> => {
    const res: Array<any> = [];
    for (let i = start; i < start + n; i++) res.push({ value: "v" + i, text: rng.words(rng.int(1, 4)) });
    return res;
  };
  const values = (n: number): Array<string> => choiceList(n).map((ch: any) => ch.value);

  // --- The top-level questions.
  const top: Array<any> = [];
  const data: any = {};
  const sharedName = q();
  top.push({ type: "multipletext", name: sharedName, title: title(), items: [{ name: "i1" }, { name: "i2" }, { name: "i3" }, { name: "i4" }] });
  data[sharedName] = { i1: "t1", i2: "t2", i3: "t3", i4: "t4" };
  const toggle = q();
  const countB = q();
  const countC = q();
  top.push({ type: "boolean", name: toggle, title: title(), isRequired: true });
  top.push({ type: "dropdown", name: countB, title: title(), choices: Array.from({ length: groups.b + 1 }, (v: any, i: number) => i), isRequired: true });
  top.push({ type: "dropdown", name: countC, title: title(), choices: Array.from({ length: groups.c + 1 }, (v: any, i: number) => i), isRequired: true });
  data[toggle] = true;
  data[countB] = activeSlotCount - 2;
  data[countC] = 0;
  // The condition that switches each slot on, and its count answer.
  const slotOn = (i: number): string => {
    if (i === 0) return "";
    if (i === 1) return "{" + toggle + "} = true";
    if (i < 2 + groups.b) return "{" + countB + "} >= " + (i - 1);
    return "{" + countC + "} >= " + (i - 1 - groups.b);
  };

  // The keyed grid: one row per slot, shown by the count answers. Columns: two texts (k0's copied from the shared
  // four-part text), a date, a kind, a flag, a choice (one choice takes the slot out of the count), an "off" flag, an id.
  const where = values(6);
  const rowKinds = values(12);
  const gridColumns = [
    { name: "col1", cellType: "text", isRequired: true, setValueIf: "{rowName} = 'k0'", setValueExpression: "{" + sharedName + ".i1}" },
    { name: "col2", cellType: "text", isRequired: true, setValueIf: "{rowName} = 'k0'", setValueExpression: "{" + sharedName + ".i3}" },
    { name: "col3", cellType: "text", inputType: "date", isRequired: true },
    { name: "col4", cellType: "dropdown", isRequired: true, enableIf: "{rowName} <> 'k0'", choices: choiceList(12) },
    { name: "col5", cellType: "boolean", isRequired: true, enableIf: "{rowName} <> 'k0'" },
    { name: "col6", cellType: "dropdown", isRequired: true, choices: choiceList(6) },
    { name: "col7", cellType: "boolean", enableIf: "{rowName} <> 'k0'" },
    { name: "col8", cellType: "text", visible: false }
  ];
  const gridQuestion = { type: "matrixdropdown", name: "grid", title: title(), isRequired: true, columns: gridColumns,
    rows: keys.map((k: string, i: number) => (i === 0 ? { value: k, text: rng.words(2) } : { value: k, text: rng.words(2), visibleIf: slotOn(i) })),
    defaultValue: { k0: { col6: where[0], col5: true, col4: rowKinds[0] } } };
  top.push(gridQuestion);
  data.grid = {};
  for (let i = 0; i < activeSlotCount; i++) {
    data.grid[keys[i]] = { col1: i === 0 ? data[sharedName].i1 : rng.word(3, 7), col2: i === 0 ? data[sharedName].i3 : rng.word(3, 7),
      col3: isoDate(1975 + i * 9, 2 + i * 2, 4 + i), col4: rowKinds[Math.min(i, 2)], col5: true, col6: where[0] };
  }

  // The calculated values that switch slots on (act), make them count (elig), and count them (cnt).
  const calculatedValues: Array<any> = [];
  const depthOf: { [name: string]: number } = {};
  const addValue = (name: string, expression: string, depth: number): string => {
    calculatedValues.push({ name: name, expression: expression });
    depthOf[name] = depth;
    return name;
  };
  const act: Array<string> = [];
  const elig: Array<string> = [];
  keys.forEach((k: string, i: number) => {
    act.push(addValue(c(), i === 0 ? "true" : slotOn(i) + " and {grid." + k + ".col7} <> true", 0));
  });
  keys.forEach((k: string, i: number) => {
    elig.push(addValue(c(), "{" + act[i] + "} = true and {grid." + k + ".col6} <> " + str(where[5]), 1));
  });
  const cnt = addValue(c(), act.map((a: string) => "iif({" + a + "} = true, 1, 0)").join(" + "), 1);
  // The shared name as one text: k0's grid row and k0's "who" choice show it.
  const displayName = addValue(c(), "iif({" + sharedName + ".i1} notempty, {" + sharedName + ".i1} + ' ' + {" + sharedName + ".i3}, '')", 0);

  // Screen checkboxes and the "who" checkboxes: a "who" is shown when its screen choice is selected and more than
  // one slot is on; with one slot on it sets itself to the first slot.
  const screens: Array<string> = [];
  for (let s = 0; s < screenCount; s++) {
    const name = q();
    screens.push(name);
    top.push({ type: "checkbox", name: name, title: title(), choices: choiceList(screenChoices) });
    data[name] = values(screenChoices).slice(0, selectedPerScreen);
  }
  const whoChoices = (): Array<any> => keys.map((k: string, i: number) => ({ value: k, text: i === 0 ? "{" + displayName + "}" : "{grid." + k + ".col1} {grid." + k + ".col2}",
    visibleIf: "{" + elig[i] + "} = true" }));
  gridQuestion.rows[0].text = "{" + displayName + "}";
  // Per screen checkbox, a list of codes of its selected choices.
  screens.forEach((s: string) => addValue(c(), values(screenChoices).map((v: string) => "iif({" + s + "} contains " + str(v) + ", '" + v + ";', '')").join(" + "), 0));
  const whos: Array<{ name: string, screen: string, choice: string }> = [];
  for (let w = 0; w < whoCount; w++) {
    const name = q();
    const screen = screens[w % screenCount];
    const choice = "v" + (1 + Math.floor(w / screenCount) % screenChoices);
    whos.push({ name: name, screen: screen, choice: choice });
    top.push({ type: "checkbox", name: name, title: title(), choices: whoChoices(), hideIfChoicesEmpty: true, isRequired: true,
      visibleIf: "{" + screen + "} contains " + str(choice) + " and {" + cnt + "} > 1",
      setValueIf: "{" + cnt + "} = 1 and {" + screen + "} contains " + str(choice), setValueExpression: "['k0']" });
    data[name] = ["k0", "k1"];
  }
  // A data load writes ['k0'] over the "who" answers whose screen choice the data selects: in a nested cycle of
  // the load only one slot is counted yet (02 removes the overwrite).
  const overwrittenBefore02 = whos.filter((w: any) => data[w.screen].indexOf(w.choice) > -1).map((w: any) => w.name);
  // Two texts copy a part of the shared name when a choice is set.
  const copyFrom = q();
  top.push({ type: "radiogroup", name: copyFrom, title: title(), choices: choiceList(3) });
  data[copyFrom] = "v2";
  for (let i = 0; i < 2; i++) {
    const name = q();
    top.push({ type: "text", name: name, title: title(), setValueIf: "{" + copyFrom + "} = 'v1'", setValueExpression: "{" + sharedName + ".i" + (i === 0 ? 2 : 4) + "}" });
  }
  // The text the typing op types into: no expression reads it.
  const typed = q();
  top.push({ type: "text", name: typed, title: title() });
  data[typed] = rng.words(1);
  // Plain top-level questions; some are read by the expressions below, some are shown by other answers.
  const plainTop: Array<{ name: string, kind: string, values?: Array<string> }> = [];
  const nPlainTop = scaled(plainTopQuestions);
  for (let i = 0; i < nPlainTop; i++) {
    const name = q();
    const kind = rng.pick(["boolean", "boolean", "dropdown", "text", "text", "checkbox", "checkbox", "comment"]);
    const el: any = { type: kind, name: name, title: title() };
    if (kind === "dropdown" || kind === "checkbox") el.choices = choiceList(rng.int(3, 8));
    if (kind === "checkbox") el.choices.slice(1).forEach((ch: any, j: number) => { if (j % 2 === 0) ch.visibleIf = "{" + rng.pick(elig) + "} = true"; });
    top.push(el);
    plainTop.push({ name: name, kind: kind, values: el.choices ? el.choices.map((ch: any) => ch.value) : undefined });
    if (kind === "boolean") data[name] = rng.chance(0.6);
    else if (kind === "dropdown") data[name] = el.choices[rng.int(0, el.choices.length - 1)].value;
    else if (kind === "checkbox") data[name] = [el.choices[0].value];
    else data[name] = rng.words(2);
  }
  // Visibility of plain questions: a boolean, a non-empty answer or a screen choice.
  let hiddenAtLoad = 0;
  plainTop.forEach((p: any, i: number) => {
    if (i % 3 !== 1) return;
    const src = plainTop[(i + 7) % plainTop.length];
    const el = top.filter((e: any) => e.name === p.name)[0];
    if (src === p) return;
    if (src.kind === "boolean") el.visibleIf = "{" + src.name + "} = true";
    else if (i % 2 === 0) el.visibleIf = "{" + rng.pick(screens) + "} contains " + str("v" + rng.int(1, screenChoices));
    else el.visibleIf = "{" + src.name + "} notempty";
    hiddenAtLoad++;
  });

  // The references the long expressions read: top-level answers (the expression generator's refs) and paths.
  let order = 0;
  screens.forEach((s: string) => gen.add({ path: s, root: s, shape: "a", kind: "multi", values: values(screenChoices), order: ++order }));
  whos.forEach((w: any) => gen.add({ path: w.name, root: w.name, shape: "a", kind: "multi", values: keys.slice(0, 4), order: ++order }));
  plainTop.forEach((p: any) => {
    if (p.kind === "boolean") gen.add({ path: p.name, root: p.name, shape: "a", kind: "boolean", order: ++order });
    if (p.kind === "dropdown") gen.add({ path: p.name, root: p.name, shape: "a", kind: "choice", values: p.values, order: ++order });
    if (p.kind === "checkbox") gen.add({ path: p.name, root: p.name, shape: "a", kind: "multi", values: p.values, order: ++order });
    if (p.kind === "text" || p.kind === "comment") gen.add({ path: p.name, root: p.name, shape: "a", kind: "text", order: ++order });
  });
  const conditionOps: Weights = { "=": 30, "contains": 25, "anyof": 10, "notempty": 12, "empty": 6, "<>": 8, "notcontains": 5 };
  const topCondition = (length: number): string => gen.condition({ owner: order + 1, length: length, ops: conditionOps, andShare: 0.6 }).text;

  // --- The slot template.
  const keyQ = q();
  const tq = (): string => q();
  const template: Array<any> = [{ type: "text", name: keyQ, title: title(), readOnly: true }];
  // Expressions that read the slot's grid row through a nested iif over all slots, and two that read the panel.
  const overSlots = (cell: (k: string, i: number) => string, cond?: (k: string, i: number) => string): string =>
    keys.reduceRight((acc: string, k: string, i: number) => "iif({panel." + keyQ + "} = " + str(k) + " and {" + act[i] + "} = true" + (cond ? " and " + cond(k, i) : "") + ", " + cell(k, i) + ", " + acc + ")", "''");
  const slotDate = tq();
  const slotKind = tq();
  const slotFlag = tq();
  const slotWhere = tq();
  [[slotDate, "col3"], [slotKind, "col4"], [slotFlag, "col5"], [slotWhere, "col6"], [tq(), "col8"]].forEach((p: Array<string>) => {
    template.push({ type: "expression", name: p[0], title: title(), expression: overSlots((k: string) => "{grid." + k + "." + p[1] + "}") });
  });
  const textA = tq();
  const part2 = tq();
  const textB = tq();
  const part4 = tq();
  const joined = tq();
  template.push({ type: "expression", name: joined, title: title(),
    expression: "iif({panel." + part4 + "} notempty, {panel." + textA + "} + ' ' + {panel." + textB + "} + ' ' + {panel." + part4 + "}, {panel." + textA + "} + ' ' + {panel." + textB + "})" });
  template.push({ type: "expression", name: tq(), title: title(),
    expression: rowKinds.slice(0, 8).reduceRight((acc: string, r: string, i: number) => "iif({panel." + slotKind + "} = " + str(r) + ", '" + rng.words(1) + "', " + acc + ")", "iif({panel." + slotFlag + "} <> true, 'x', 'y')") });
  // The slot's texts: A and B copied from its grid row, parts 2 and 4 from the shared text for k0.
  const sections: Array<Array<any>> = [[], [], []];
  sections[0].push({ type: "text", name: textA, title: title(), setValueExpression: overSlots((k: string) => "{grid." + k + ".col1}") });
  sections[0].push({ type: "text", name: part2, title: title(), setValueIf: "{panel." + slotKind + "} = " + str(rowKinds[0]), setValueExpression: "{" + sharedName + ".i2}" });
  sections[0].push({ type: "text", name: textB, title: title(), setValueExpression: overSlots((k: string) => "{grid." + k + ".col2}") });
  sections[0].push({ type: "text", name: part4, title: title(), setValueIf: "{panel." + slotKind + "} = " + str(rowKinds[0]), setValueExpression: "{" + sharedName + ".i4}" });
  // Plain slot questions, spread over the three sections; a third of them shown by another panel answer or a "who".
  interface SlotField { name: string, kind: string, values?: Array<string> }
  const slotFields: Array<SlotField> = [];
  const plainQuestion = (kind: string, name: string): any => {
    const el: any = { type: kind, name: name, title: title() };
    if (kind === "dropdown" || kind === "checkbox" || kind === "radiogroup") el.choices = choiceList(rng.int(3, 9));
    if (kind === "number") { el.type = "text"; el.inputType = "number"; }
    if (kind === "date") { el.type = "text"; el.inputType = "date"; }
    if (kind === "multipletext") el.items = [{ name: "i1" }, { name: "i2" }, { name: "i3" }];
    return el;
  };
  const slotKinds = ["text", "text", "text", "dropdown", "dropdown", "boolean", "boolean", "number", "date", "checkbox", "radiogroup", "multipletext", "comment"];
  const nSlotPlain = scaled(plainSlotQuestions, 6);
  for (let i = 0; i < nSlotPlain; i++) {
    const kind = slotKinds[i % slotKinds.length];
    const el = plainQuestion(kind, tq());
    slotFields.push({ name: el.name, kind: kind, values: el.choices ? el.choices.map((ch: any) => ch.value) : undefined });
    sections[i % 3].push(el);
  }
  const whoOf = (i: number): any => whos[i % whos.length];
  slotFields.forEach((f: SlotField, i: number) => {
    if (i % 3 !== 2) return;
    const el = sections[i % 3].filter((e: any) => e.name === f.name)[0];
    const prev = slotFields[i - 1];
    if (i % 2 === 0 && (prev.kind === "boolean")) el.visibleIf = "{panel." + prev.name + "} = true";
    else if (i % 4 === 1) el.visibleIf = "age({panel." + slotDate + "}) >= 14 and {" + whoOf(i).name + "} contains {panel." + keyQ + "}";
    else el.visibleIf = "{" + whoOf(i).screen + "} contains " + str(whoOf(i).choice) + " and {" + whoOf(i).name + "} contains {panel." + keyQ + "}";
  });
  // The nested containers: dynamic panels with one item at least, each item copying its slot key in, and matrices
  // with one row at least.
  interface Nested { name: string, type: string, amount: string, source: string, fields: Array<SlotField> }
  const nested: Array<Nested> = [];
  const panelLetters = ["A", "B", "C", "D", "E", "F"];
  const matrixLetters = ["G", "H", "I", "J", "K", "L"];
  const sources = values(8);
  const templateOf: { [name: string]: Array<any> } = {};
  panelLetters.forEach((letter: string, i: number) => {
    const name = "nest" + letter;
    const amount = tq();
    const source = tq();
    const fields: Array<SlotField> = [{ name: source, kind: "dropdown", values: sources }, { name: amount, kind: "number" }];
    const tmpl: Array<any> = [{ type: "dropdown", name: source, title: title(), choices: sources.map((v: string) => ({ value: v, text: rng.words(2) })) },
      { type: "text", name: amount, title: title(), inputType: "number" }, { type: "expression", name: tq(), title: title(), expression: "{parentPanel." + keyQ + "}" }];
    const n = Math.max(1, scaled(nestedPanelQuestions[i]) - 2);
    for (let j = 0; j < n; j++) {
      const kind = ["text", "dropdown", "boolean", "number", "date"][j % 5];
      const el = plainQuestion(kind, tq());
      tmpl.push(el);
      fields.push({ name: el.name, kind: kind, values: el.choices ? el.choices.map((ch: any) => ch.value) : undefined });
    }
    const w = whoOf(i * 7 + 3);
    templateOf[name] = tmpl;
    sections[1 + (i > 0 ? 1 : 0)].push({ type: "paneldynamic", name: name, title: title(), templateElements: tmpl, panelCount: 1, minPanelCount: 1,
      templateTitle: rng.words(1) + " {panelIndex}", visibleIf: i % 2 === 0 ? "{" + w.screen + "} contains " + str(w.choice) + " and {" + w.name + "} contains {panel." + keyQ + "}" :
        "age({panel." + slotDate + "}) >= 14 and {" + w.name + "} contains {panel." + keyQ + "}" });
    nested.push({ name: name, type: "paneldynamic", amount: amount, source: source, fields: fields });
  });
  matrixLetters.forEach((letter: string, i: number) => {
    const name = "nest" + letter;
    const columns: Array<any> = [{ name: "col1", cellType: "dropdown", choices: sources }, { name: "col2", cellType: "text", inputType: "number" }];
    for (let j = 2; j < nestedMatrixColumns[i]; j++) columns.push(j === 4 || (j === 3 && i < 3) ? { name: "col" + (j + 1), cellType: "expression", expression: "{row.col2} * 3" } : { name: "col" + (j + 1), cellType: "text" });
    const w = whoOf(i * 5 + 1);
    sections[i < 2 ? 0 : 2].push({ type: "matrixdynamic", name: name, title: title(), columns: columns, rowCount: 1, minRowCount: 1,
      visibleIf: "{" + w.screen + "} contains " + str(w.choice) + " and {" + w.name + "} contains {panel." + keyQ + "}" });
    nested.push({ name: name, type: "matrixdynamic", amount: "col2", source: "col1", fields: [] });
  });
  // The sections: the second and the third are shown by a nested iif over the slots, as the panel title reads.
  template.push({ type: "panel", name: "section1", title: title(), elements: sections[0] });
  template.push({ type: "panel", name: "section2", title: title(), elements: sections[1], state: "collapsed",
    visibleIf: keys.map((k: string, i: number) => "({panel." + keyQ + "} = " + str(k) + " and {" + elig[i] + "} = true)").join(" or ") });
  template.push({ type: "panel", name: "section3", title: title(), elements: sections[2], state: "collapsed",
    visibleIf: keys.map((k: string, i: number) => "({panel." + keyQ + "} = " + str(k) + " and {" + elig[i] + "} = true and {grid." + k + ".col5} = true)").join(" or ") });
  const slotsQuestion = { type: "paneldynamic", name: "slots", title: title(), valueName: "slotValues", keyName: keyQ, clearIfInvisible: "none",
    defaultValue: keys.map((k: string) => ({ [keyQ]: k })), templateElements: template, allowAddPanel: false, allowRemovePanel: false,
    maxPanelCount: keys.length, displayMode: "tab", templateTabTitle: "{panel." + textA + "} ({panel." + slotKind + "})",
    templateVisibleIf: keys.map((k: string, i: number) => "({panel." + keyQ + "} = " + str(k) + " and {" + act[i] + "} = true)").join(" or ") };

  // The slot data: every question of the active slots answered, two items in every nested container.
  const answer = (f: SlotField, i: number): any => {
    if (f.kind === "number") return rng.int(10, 900);
    if (f.kind === "date") return isoDate(1990 + i % 20, 1 + i % 12, 1 + i % 27);
    if (f.kind === "boolean") return rng.chance(0.5);
    if (f.kind === "dropdown" || f.kind === "radiogroup") return at(rng, f.values as Array<string>);
    if (f.kind === "checkbox") return (f.values as Array<string>).slice(0, 2);
    if (f.kind === "multipletext") return { i1: rng.word(), i2: rng.word() };
    return rng.words(2);
  };
  data.slotValues = keys.map((k: string, s: number) => {
    const rec: any = { [keyQ]: k };
    if (s >= activeSlotCount) return rec;
    // The slot's texts A and B are answered like its other text questions, not as its grid row has them: the first answer
    // after a load that reaches the slots' name expressions rewrites them, one write-back per name.
    rec[textA] = rng.words(2);
    rec[textB] = rng.words(2);
    if (s === 0) {
      rec[part2] = data[sharedName].i2;
      rec[part4] = data[sharedName].i4;
    }
    slotFields.forEach((f: SlotField, i: number) => { rec[f.name] = answer(f, i + s); });
    nested.forEach((n: Nested) => {
      const items: Array<any> = [];
      for (let r = 0; r < 2; r++) {
        if (n.type === "matrixdynamic") items.push({ col1: at(rng, sources), col2: rng.int(10, 900), col3: rng.word() });
        else {
          const item: any = {};
          n.fields.forEach((f: SlotField, i: number) => { item[f.name] = answer(f, i + r); });
          items.push(item);
        }
      }
      rec[n.name] = items;
    });
    return rec;
  });

  // --- The calculated values.
  const total = o.calculatedValues || Math.round(fullCalculatedValues * o.scale);
  const idx = (s: number, path: string): string => "{slotValues[" + s + "]." + path + "}";
  // The nested dynamic panels whose first item the values read, per slot: all of them in k0, three in the others. A
  // read builds the slot's panels and that nested item at load; each built item copies its slot key in and writes
  // the slot record back during a data load.
  const nestedPanels = nested.filter((n: Nested) => n.type === "paneldynamic");
  const readPanels = (s: number): Array<Nested> => (s === 0 ? nestedPanels : [nestedPanels[0], nestedPanels[1], nestedPanels[3]]);
  const itemRead = (s: number, t: number): string => {
    const n = readPanels(s)[t % readPanels(s).length];
    return idx(s, n.name + "[0]." + n.fields[2 + t % (n.fields.length - 2) || 1].name);
  };
  const textField = (s: number): string => idx(s, (slotFields.filter((f: SlotField) => f.kind === "text")[s % 3] || slotFields[0]).name);
  const dateText = (path: string): string => "substring(" + path + ", 5, 7) + '/' + substring(" + path + ", 8, 10) + '/' + substring(" + path + ", 0, 4)";
  // Per slot: sums over the slot's nested containers, filtered by an item field (one family is a value per slot).
  const sumFamilies = scaled(perSlotSumFamilies);
  const slotSums: Array<Array<string>> = [];
  for (let f = 0; f < sumFamilies; f++) {
    const terms = sumTermsByFamily(f);
    slotSums.push(keys.map((k: string, s: number) => {
      const parts: Array<string> = [];
      for (let t = 0; t < terms; t++) {
        const n = nested[(f + t) % nested.length];
        const other = n.fields[2 + (f + t) % Math.max(1, n.fields.length - 2)] || n.fields[0];
        const filter = n.type === "paneldynamic" ? "({" + n.source + "} = " + str(sources[(f + t) % sources.length]) + " or {" + n.source + "} = " + str(sources[(f + t + 5) % sources.length]) +
          ") and {" + n.amount + "} notempty and {" + n.amount + "} > 0 and {" + n.source + "} <> " + str(sources[(f + t + 3) % sources.length]) + " and {" + other.name + "} notempty" :
          "({col1} = " + str(sources[(f + t) % sources.length]) + " or {col1} = " + str(sources[(f + t + 5) % sources.length]) + ") and {col2} > 0 and {col2} notempty and {col1} <> " +
          str(sources[(f + t + 3) % sources.length]);
        parts.push("sumInArray(" + idx(s, n.name) + ", '" + n.amount + "', " + filter + ")");
      }
      return addValue(c(), "iif({" + elig[s] + "} = true and {grid." + k + ".col5} = true, " + parts.join(" + ") + ", 0)", 2);
    }));
  }
  // Per slot: a code built from substrings of its answers, a flag, and a list of codes.
  const raws = keys.map((k: string, s: number) => addValue(c(), "iif({" + elig[s] + "} = true and " + textField(s) + " notempty, substring(" + textField(s) + ", 0, 2) + '.' + substring(" +
    textField(s) + ", 2, 6) + '.' + substring(" + idx(s, slotFields[0].name) + ", 0, 3) + substring(" + idx(s, slotFields[1].name) + ", 0, 2) + substring(" + textField(s) + ", 6, 9), '')", 2));
  const flags = keys.slice(0, fixedRowSlots).map((k: string, s: number) => addValue(c(), "({" + elig[s] + "} = true and {grid." + k + ".col6} = " + str(where[0]) + " and " + idx(s, slotFlag) + " = true)", 2));
  const multiFields = slotFields.filter((f: SlotField) => f.kind === "checkbox");
  // Per slot: a list of codes from the slot's answers and from the first item of each nested dynamic panel. Reading
  // {slotValues[s].nestA[0].q} builds the slot's panels and their nested items at load, so every nested item exists.
  keys.forEach((k: string, s: number) => {
    const parts: Array<string> = [];
    for (let t = 0; t < 14; t++) {
      const f = multiFields[t % multiFields.length] || slotFields[0];
      parts.push("iif(" + idx(s, f.name) + " contains " + str((f.values || ["v1"])[t % (f.values || ["v1"]).length]) + ", '" + rng.word(2, 4) + ";', '')");
    }
    readPanels(s).forEach((n: Nested) => {
      parts.push("iif(" + idx(s, n.name + "[0]." + n.source) + " notempty, '" + rng.word(2, 4) + ";', '')");
    });
    addValue(c(), "iif({" + elig[s] + "} = true, " + parts.join(" + ") + ", '')", 2);
  });
  // Ages: is any counted slot at or over an age.
  [10, 21, 50, 70].forEach((years: number) => addValue(c(), keys.map((k: string, s: number) => "iif({" + elig[s] + "} = true and age({grid." + k + ".col3}) >= " + years + ", 1, 0)").join(" + ") + " > 0", 2));
  // One character of a code per value.
  const nDigitFamilies = scaled(digitFamilies);
  for (let f = 0; f < nDigitFamilies; f++) {
    const raw = raws[f % raws.length];
    for (let d = 0; d < digitValues; d++) addValue(c(), "iif({" + raw + "} notempty, substring({" + raw + "}, " + d + ", " + (d + 1) + "), '')", 3);
  }
  // Rows of a fixed slot each (row r reads slot r): a name, a date, flags.
  const nFixedFields = scaled(fixedRowFields);
  for (let field = 0; field < nFixedFields; field++) {
    for (let r = 0; r < Math.min(fixedRowSlots, keys.length); r++) {
      const k = keys[r];
      const form = field % 4;
      const expr = form === 0 ? "iif({" + flags[r] + "} = true, {grid." + k + ".col1} + ' ' + substring(" + idx(r, part2) + ", 0, 1) + ' ' + {grid." + k + ".col2}, '')" :
        form === 1 ? "iif({" + flags[r] + "} = true, " + dateText("{grid." + k + ".col3}") + ", '')" :
          form === 2 ? "iif({" + flags[r] + "} = true and {grid." + k + ".col4} = " + str(rowKinds[field % 12]) + ", 'X', '')" :
            "iif({" + flags[r] + "} = true and " + idx(r, slotFields[field % slotFields.length].name) + " notempty, iif(" + idx(r, slotFields[(field + 1) % slotFields.length].name) +
            " notempty, 'X', 'Y'), '')";
      addValue(c(), expr, 3);
    }
  }
  // Rows that pick a slot: a nested iif over every slot.
  const nPickFields = scaled(pickRowFields);
  for (let field = 0; field < nPickFields; field++) {
    for (let r = 0; r < pickRows; r++) {
      const cell = field % 3 === 0 ? (k: string, s: number): string => "{grid." + k + ".col1} + ' ' + {grid." + k + ".col2}" :
        field % 3 === 1 ? (k: string, s: number): string => dateText("{grid." + k + ".col3}") : (k: string, s: number): string => "substring(" + textField(s) + ", 0, 1)";
      const expr = keys.reduceRight((acc: string, k: string, s: number) => "iif(({" + elig[s] + "} = true and {grid." + k + ".col4} = " + str(rowKinds[2 + r % 3]) +
        " and {grid." + k + ".col6} = " + str(where[0]) + " and " + idx(s, slotFields[(field + s) % slotFields.length].name) + " notempty and " +
        idx(s, slotFields[(field + s + 1) % slotFields.length].name) + " notempty) and " + (r === 0 ? "age({grid." + k + ".col3}) < 16" : "{grid." + k + ".col3} notempty") +
        ", " + cell(k, s) + ", " + acc + ")", "''");
      addValue(c(), expr, 2);
    }
  }
  // Lines per sum family: which slot has it (two rows: a slot's joined text), the sum scaled by 100, and a text of its parts.
  slotSums.forEach((family: Array<string>, f: number) => {
    for (let r = 0; r < 2; r++) {
      addValue(c(), keys.reduceRight((acc: string, k: string, s: number) => "iif({" + family[s] + "} > 0 and " + idx(s, slotFields[f % slotFields.length].name) + " notempty, substring(" +
        idx(s, joined) + ", 0, 12), " + acc + ")", "''"), 3);
      const hundredths = addValue(c(), "round((" + family.map((v: string) => "iif({" + v + "} > 0, {" + v + "}, 0)").join(" + ") + ") * 100)", 3);
      addValue(c(), "iif({" + hundredths + "} > 0, trunc({" + hundredths + "} / 100) + '.' + substring('' + {" + hundredths + "}, 0, 2), '')", 4);
    }
  });
  // Long one-off values over the slots: per slot an iif with a condition over the answers, an indexed path and a keyed
  // cell, and in turn a count over a nested container, an age, a date as text, an integer part, a substring, a cell.
  const numberField = (slotFields.filter((f: SlotField) => f.kind === "number")[0] || slotFields[0]).name;
  const longPart = (s: number, slot: number, k: string, n: Nested): string => {
    const kind = s % 12;
    if (kind % 6 === 0) return "countInArray(" + idx(slot, n.name) + ", '" + n.amount + "', {" + n.amount + "} > 0) + ' '";
    if (kind === 1) return "'' + age({grid." + k + ".col3})";
    if (kind % 6 === 2) return dateText("{grid." + k + ".col3}");
    if (kind === 3) return "'' + trunc(" + idx(slot, numberField) + " / 12)";
    if (kind % 6 === 4) return "substring({grid." + k + ".col3}, 0, 4)";
    return "{grid." + k + ".col1}";
  };
  const longValue = (target: number, s0: number): string => {
    const parts: Array<string> = [];
    let length = 0;
    let s = s0;
    while(length < target) {
      const k = keys[s % keys.length];
      const slot = s % keys.length;
      const n = nested[s % nested.length];
      const cond = topCondition(rng.int(40, 140));
      // Every other part reads a field of the first item of a nested dynamic panel ({slotValues[2].nestB[0].q}).
      const read = s % 2 === 0 ? itemRead(slot, s) : idx(slot, slotFields[s % slotFields.length].name);
      const part = "iif({" + elig[slot] + "} = true and (" + cond + ") and " + read + " notempty, " + longPart(s, slot, k, n) + ", '')";
      parts.push(part);
      length += part.length + 3;
      s++;
    }
    return parts.join(" + ");
  };
  longSingles.forEach((bucket: { count: number, min: number, max: number }, b: number) => {
    const n = scaled(bucket.count, b === 0 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const r = rng.next();
      const target = b === 0 && i === 0 ? bucket.max : Math.floor(bucket.min * Math.pow(bucket.max / bucket.min, b === 0 ? r * r : r));
      addValue(c(), longValue(target, i), 2);
    }
  });
  // Short values over the answers fill the rest: an iif over one answer or one value.
  while(calculatedValues.length < total) {
    const i = calculatedValues.length;
    const readsValue = i % 3 === 0;
    const v = readsValue ? calculatedValues[rng.int(0, calculatedValues.length - 1)].name : undefined;
    const expr = readsValue ? "iif({" + v + "} notempty, 'X', '')" : "iif(" + topCondition(rng.int(20, 60)) + ", 'X', '')";
    addValue(c(), expr, readsValue ? depthOf[v as string] + 1 : 0);
  }
  // The families above are the structure the scenarios and the mechanisms need: a total below them is an error, and
  // at a small scale the total is theirs.
  if (o.calculatedValues && calculatedValues.length > o.calculatedValues) {
    throw new Error("slotForm: " + o.calculatedValues + " calculated values are fewer than the " + calculatedValues.length + " its structure needs");
  }
  // Three values of every five go into the result.
  calculatedValues.forEach((cv: any, i: number) => { if (i % 5 < 3) cv.includeIntoResult = true; });

  // --- Pages: the top-level questions in pages of about questionsPerPage, the slot panel on a page of its own.
  const pages: Array<any> = [];
  for (let i = 0; i < top.length; i += questionsPerPage) pages.push({ name: "page" + (pages.length + 1), elements: top.slice(i, i + questionsPerPage) });
  pages.splice(Math.min(3, pages.length), 0, { name: "page" + (pages.length + 1), elements: [slotsQuestion] });

  const json = { title: rng.words(3), pages: pages, calculatedValues: calculatedValues, showQuestionNumbers: "off", showPageTitles: false,
    clearInvisibleValues: "none", checkErrorsMode: "onComplete", textUpdateMode: "onTyping" };

  // --- meta: the planned counts and what the scenarios change.
  const allValues = calculatedValues.map((cv: any) => cv.name);
  const valueSet = new Set<string>(allValues);
  let valueReferences = 0;
  let indexedReaders = 0;
  let keyedReaders = 0;
  const lengths: Array<number> = [];
  calculatedValues.forEach((cv: any) => {
    const refs = (cv.expression.match(/\{[^}]+\}/g) || []).map((r: string) => r.slice(1, -1));
    valueReferences += new Set(refs.filter((r: string) => valueSet.has(r))).size;
    if (refs.some((r: string) => r.indexOf("slotValues[") === 0)) indexedReaders++;
    if (refs.some((r: string) => r.indexOf("grid.") === 0)) keyedReaders++;
    lengths.push(cv.expression.length);
  });
  lengths.sort((a: number, b: number) => a - b);
  const depths: { [depth: number]: number } = {};
  allValues.forEach((n: string) => { depths[depthOf[n]] = (depths[depthOf[n]] || 0) + 1; });
  // Questions: getAllQuestions(false) counts the top-level questions and the slot panel; with nested, each slot panel
  // adds its template's questions, multiple text items, the nested panels' one item and the nested matrices' cells,
  // and the grid the cells of the rows shown at load (k0's). With a type, the questions of that type only.
  const countNested = (els: Array<any>, type?: string): number => els.reduce((sum: number, el: any) => {
    if (el.type === "panel") return sum + countNested(el.elements, type);
    const is = (t: string): number => (!type || t === type ? 1 : 0);
    const cells = (columns: Array<any>, rows: number): number => columns.reduce((x: number, col: any) => x + is(col.cellType) * rows, 0);
    let n = is(el.type);
    if (el.type === "multipletext") n += is("text") * el.items.length;
    if (el.type === "paneldynamic") n += countNested(el.templateElements, type) * (el.panelCount || 0);
    if (el.type === "matrixdynamic") n += cells(el.columns, el.rowCount);
    if (el.type === "matrixdropdown") n += cells(el.columns, el.rows.filter((r: any) => !r.visibleIf).length);
    return sum + n;
  }, 0);
  const questions = top.length + 1;
  // A slot panel: its template without the nested panels' items, plus the items the values build (readPanels).
  const slotQuestions = (type?: string): number => {
    const base = countNested(template, type) - nestedPanels.reduce((sum: number, n: Nested) => sum + countNested(templateOf[n.name], type), 0);
    return keys.reduce((sum: number, k: string, s: number) => sum + base + readPanels(s).reduce((x: number, n: Nested) => x + countNested(templateOf[n.name], type), 0), 0);
  };
  const choiceQuestions: { [type: string]: number } = {};
  ["radiogroup", "checkbox", "dropdown"].forEach((t: string) => { choiceQuestions[t] = countNested(top, t) + slotQuestions(t); });
  const meta = {
    pages: pages.length,
    panels: 0,
    questions: questions,
    questionsWithCells: countNested(top) + 1 + slotQuestions(),
    choiceQuestions: choiceQuestions,
    // At load no slot but k0 is on: every "who" is hidden, as are the plain questions shown by another answer.
    visibleQuestions: questions - whos.length - hiddenAtLoad,
    calculatedValues: calculatedValues.length,
    slots: keys,
    activeSlots: activeSlotCount,
    toggle: toggle,
    countB: countB,
    countC: countC,
    sharedName: sharedName,
    typed: typed,
    screens: screens,
    whos: whos.map((w: any) => w.name),
    slotKey: keyQ,
    slotTextA: textA,
    slotPart2: part2,
    slotDate: slotDate,
    slotTextB: textB,
    slotJoined: joined,
    slotActive: act,
    slotCounted: elig,
    slotIds: raws,
    count: cnt,
    // A screen choice the data does not select, and the "who" it shows.
    screenAdded: { choice: whos[screenCount * selectedPerScreen + 1].choice, who: whos[screenCount * selectedPerScreen + 1].name },
    overwrittenBefore02: overwrittenBefore02,
    // The counts of the mechanisms (01, M1-M8).
    mechanisms: {
      calculatedValues: calculatedValues.length,
      valueReferences: valueReferences,
      depths: depths,
      medianLength: lengths[Math.floor((lengths.length - 1) / 2)],
      p90Length: lengths[Math.floor((lengths.length - 1) * 0.9)],
      over10k: lengths.filter((l: number) => l > 10000).length,
      maxLength: lengths[lengths.length - 1],
      expressionText: lengths.reduce((a: number, b: number) => a + b, 0),
      nestedPanels: panelLetters.length,
      nestedMatrices: matrixLetters.length,
      indexedReaders: indexedReaders,
      keyedReaders: keyedReaders,
      setValueIf: whos.length + 2,
      gridRows: keys.length,
      textUpdateMode: "onTyping"
    },
    // k0 is always on: the count's iif over it always takes its first branch.
    expectedLintFindings: [{ ruleId: "expression/meaningless-condition" }]
  };
  return { json: json, data: data, meta: meta };
}

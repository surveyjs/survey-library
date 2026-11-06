import { createRng } from "./random.ts";
import type { Rng } from "./random.ts";

// Parity with Survey Creator's e2e/questions_4114.ts (D02): page 1 holds five multi-select matrices whose cells
// show the other 108 pages, and each of those pages repeats one block of 38 questions with many short conditions.
export interface LargeOptions {
  seed?: number;
}

export const largeDefaults = { seed: 4114 };

// The rows of the page-1 matrices: q2 and q4 show a page per row ("contains 1"), q3 and q5 have a count column
// that shows six pages per row.
const matrixRows = [2, 6, 4, 11, 2];
const matrixHasCount = [false, true, false, true, false];
const countVisibleIfs = ["anyof [1, 2, 3, 4, 5, 6]", "anyof [2, 3, 4, 5, 6]", "anyof [3, 4, 5, 6]", "anyof [4, 5, 6]", "anyof [5, 6]", "= 6"];
// 100 checkboxes of the 2,268 have no choicesEnableIf in the original.
const checkboxesWithoutEnableIf = 100;

function yesNo(rng: Rng, withUnknown: boolean): Array<any> {
  const res: Array<any> = [{ value: "1", text: rng.textOfLength(3) }, { value: "0", text: rng.textOfLength(2) }];
  if (withUnknown) res.push({ value: "77", text: rng.textOfLength(9) });
  return res;
}

export function generateLarge(options?: LargeOptions): { json: any, meta: any } {
  const rng = createRng(options && options.seed !== undefined ? options.seed : largeDefaults.seed);
  let counter = 0;
  const nextName = (): string => "q" + (++counter);
  const title = (min: number, max: number): string => rng.textOfLength(rng.int(min, max));
  const pages: Array<any> = [];
  const pageVisibleIfs: Array<string> = [];

  // Page 1.
  const q1 = { type: "radiogroup", name: nextName(), title: title(60, 172), isRequired: true, choices: yesNo(rng, false) };
  const matrices: Array<any> = [];
  let rowCounter = 0;
  for (let m = 0; m < matrixRows.length; m++) {
    const name = nextName();
    const rows: Array<any> = [];
    for (let r = 0; r < matrixRows[m]; r++) rows.push({ value: "r" + (++rowCounter), text: title(4, 20) });
    const columns: Array<any> = [{ name: "YN", title: title(20, 25), cellType: "checkbox", choices: [{ value: "1", text: " " }] }];
    if (matrixHasCount[m]) {
      columns.push({ name: "CNT", title: title(30, 37), cellType: "dropdown", isRequired: true, visibleIf: "{row.YN} contains 1",
        choices: ["1", "2", "3", "4", "5", { value: "6", text: title(8, 11) }] });
    }
    matrices.push({ type: "matrixdropdown", name: name, title: title(10, 14), titleLocation: "hidden", columns: columns, rows: rows, rowTitleWidth: "150" });
  }
  // The last matrix holds the "none" and "unknown" rows that exclude every other row.
  const last = matrices[matrices.length - 1];
  const noneRow = last.rows[0].value;
  const unknownRow = last.rows[1].value;
  last.rows[0].enableIf = "{" + last.name + "." + unknownRow + ".YN} notcontains 1";
  last.rows[1].enableIf = "{" + last.name + "." + noneRow + ".YN} notcontains 1";
  const exclusive = "{" + last.name + "." + noneRow + ".YN} notcontains 1 and {" + last.name + "." + unknownRow + ".YN} notcontains 1";
  const otherRows: Array<string> = [];
  for (let m = 0; m < matrices.length - 1; m++) {
    matrices[m].columns[0].choicesEnableIf = exclusive;
    matrices[m].rows.forEach((row: any) => otherRows.push("{" + matrices[m].name + "." + row.value + ".YN} notcontains 1"));
  }
  last.columns[0].choicesEnableIf = otherRows.join(" and ");
  const panel1 = { type: "panel", name: "panel1", elements: matrices, visible: false, visibleIf: "{" + q1.name + "} = 1", isRequired: true,
    requiredErrorText: title(40, 46) };
  const countRef = "{" + matrices[3].name + "." + matrices[3].rows[matrices[3].rows.length - 1].value + ".CNT}";
  const page1Texts: Array<any> = [];
  for (let i = 0; i < 6; i++) {
    page1Texts.push({ type: "text", name: nextName(), visible: false, visibleIf: countRef + " " + countVisibleIfs[i].replace(" [", "["),
      title: title(28, 32), description: title(40, 49), isRequired: true });
  }
  pages.push({ name: "1", elements: [q1, panel1].concat(page1Texts) });

  // The conditions that show pages 2..109, in the original's order: a "contains 1" page per row of a matrix without
  // a count column, six pages per row of a matrix with one.
  for (let m = 0; m < matrices.length - 1; m++) {
    for (const row of matrices[m].rows) {
      if (!matrixHasCount[m]) {
        pageVisibleIfs.push("{" + matrices[m].name + "." + row.value + ".YN} contains 1");
      } else {
        countVisibleIfs.forEach((cond: string) => pageVisibleIfs.push("{" + matrices[m].name + "." + row.value + ".CNT} " + cond));
      }
    }
  }
  let withoutEnableIf = checkboxesWithoutEnableIf;
  const checkboxPanel = (size: number, exclusiveCount: number): { panel: any, names: Array<string> } => {
    const names: Array<string> = [];
    for (let i = 0; i < size; i++) names.push(nextName());
    const elements = names.map((name: string, i: number): any => {
      const t = title(4, 49);
      const q: any = { type: "checkbox", name: name, title: t, titleLocation: "hidden", choices: [{ value: "1", text: t }] };
      if (i < size - exclusiveCount) {
        if (i === 0 && withoutEnableIf > 0) {
          withoutEnableIf--;
        } else {
          q.choicesEnableIf = names.slice(size - exclusiveCount).map((n: string): string => "{" + n + "} notcontains 1").join(" and ");
        }
      } else {
        q.choicesEnableIf = names.filter((n: string): boolean => n !== name).map((n: string): string => "{" + n + "} notcontains 1").join(" and ");
      }
      return q;
    });
    return { panel: { type: "panel", name: "panel" + (pages.length * 2), elements: elements, isRequired: true, requiredErrorText: title(40, 46) }, names: names };
  };
  for (let p = 0; p < pageVisibleIfs.length; p++) {
    const els: Array<any> = [];
    els.push({ type: "text", name: nextName(), title: title(15, 23), isRequired: true, maxLength: 5 });
    for (let i = 0; i < 3; i++) els.push({ type: "radiogroup", name: nextName(), title: title(40, 66), isRequired: true, choices: yesNo(rng, true) });
    const a = checkboxPanel(8, 2);
    a.panel.name = "panel" + (2 * p + 2);
    els.push(a.panel);
    els.push({ type: "comment", name: nextName(), visible: false, visibleIf: "{" + a.names[5] + "} contains 1", title: title(30, 39), isRequired: true });
    const b = checkboxPanel(13, 2);
    b.panel.name = "panel" + (2 * p + 3);
    els.push(b.panel);
    els.push({ type: "comment", name: nextName(), visible: false, visibleIf: "{" + b.names[9] + "} contains 1", title: title(30, 39), isRequired: true });
    els.push({ type: "comment", name: nextName(), visible: false, visibleIf: "{" + b.names[10] + "} contains 1", title: title(30, 39), isRequired: true });
    const anyOfB = b.names.slice(0, 11).map((n: string): string => "{" + n + "} contains 1").join(" or ");
    els.push({ type: "text", name: nextName(), visible: false, visibleIf: anyOfB, title: title(80, 106), isRequired: true, requiredErrorText: title(20, 25),
      validators: [{ type: "numeric", minValue: 0, maxValue: 110 }, { type: "regex", text: title(20, 25), regex: "^\\d*$" }], inputType: "number" });
    els.push({ type: "text", name: nextName(), visible: false, visibleIf: anyOfB, title: title(60, 78), isRequired: true, requiredErrorText: title(40, 50),
      validators: [{ type: "numeric", minValue: 0.01 }, { type: "regex", text: title(40, 50), regex: "^\\-?\\d*(\\.\\d{1,2})?$" }], inputType: "number" });
    const r1 = nextName();
    els.push({ type: "radiogroup", name: r1, title: title(60, 73), isRequired: true, choices: yesNo(rng, true) });
    const r2 = nextName();
    els.push({ type: "radiogroup", name: r2, visible: false, visibleIf: "{" + r1 + "} = 1", title: title(60, 73), isRequired: true, choices: yesNo(rng, true) });
    const ageFrom = nextName();
    els.push({ type: "text", name: ageFrom, visible: false, visibleIf: "{" + r2 + "} = 1", title: title(50, 61), isRequired: true,
      validators: [{ type: "numeric", minValue: 0, maxValue: 110 }, { type: "regex", text: title(20, 25), regex: "^\\d*$" }], inputType: "number" });
    els.push({ type: "radiogroup", name: nextName(), visible: false, visibleIf: "{" + r2 + "} = 1", title: title(80, 97), isRequired: true, choices: yesNo(rng, true) });
    els.push({ type: "radiogroup", name: nextName(), visible: false, visibleIf: "{" + r2 + "} = 1", title: title(80, 91), isRequired: true, choices: yesNo(rng, true) });
    const r6 = nextName();
    els.push({ type: "radiogroup", name: r6, title: title(20, 24), isRequired: true, choices: yesNo(rng, true) });
    const ageTo = nextName();
    els.push({ type: "text", name: ageTo, visible: false, visibleIf: "{" + r6 + "} = 0", title: title(40, 50), isRequired: true, requiredErrorText: title(20, 25),
      validators: [{ type: "expression", text: title(90, 99), expression: "{" + ageTo + "} >= {" + ageFrom + "} AND {" + ageTo + "} <= 110" },
        { type: "regex", text: title(20, 25), regex: "^\\d*$" }], inputType: "number" });
    els.push({ type: "radiogroup", name: nextName(), visible: false, visibleIf: "{" + r6 + "} = 0", title: title(50, 59), isRequired: true, choices: yesNo(rng, true) });
    pages.push({ name: String(p + 2), elements: els, visible: false, visibleIf: pageVisibleIfs[p] });
  }
  const json = {
    title: rng.words(3),
    pages: pages,
    showQuestionNumbers: "off",
    clearInvisibleValues: "onHiddenContainer",
    checkErrorsMode: "onValueChanged"
  };
  const meta = {
    pages: 109,
    panels: 217,
    questionsWithCells: 4158,
    questions: 4116,
    visibleQuestions: 1,
    calculatedValues: 0,
    choiceQuestions: { radiogroup: 973, checkbox: 2293, dropdown: 17 },
    // The answer that shows the first matrix's panel; the answer scenarios do not run on large.
    firstAnswer: { name: q1.name, value: "1" },
    expectedLintFindings: []
  };
  return { json: json, meta: meta };
}

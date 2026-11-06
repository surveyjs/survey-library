import { createRng, isoDate } from "./random.ts";
import { createExpressionGenerator } from "./expressions.ts";

// About 400 calculated values: chains up to depth 10 that start at 20 questions, a value that reads 30 others,
// aggregates over matrix cells and a dynamic panel, and one settling cycle. 300 expression questions and 300
// default value expressions read them.
export interface CalculationsOptions {
  seed?: number;
}

export const calculationsDefaults = { seed: 400 };

export type ChainStepKind = "start" | "add" | "double" | "iif" | "round";
export interface ChainStep { name: string, kind: ChainStepKind, arg?: string }

const chainCount = 20;
const extraValues = 72;
// Values that read other answers only: one answer to a chain start changes none of them (the complex-survey set
// made an answer skip the values it does not reach).
const answerValues = 160;
const answerQuestions = 200;
const expressionQuestions = 300;
const defaultValueQuestions = 300;
const perPage = 40;

// The value of one chain step, as the test computes it by hand (01 check 5).
export function computeChainStep(step: ChainStep, prev: number, arg: number): number {
  if (step.kind === "start") return arg * 3 + 1;
  if (step.kind === "add") return prev + arg;
  if (step.kind === "double") return prev * 2;
  if (step.kind === "iif") return prev > 50 ? prev - 7 : prev + 3;
  return Math.round(prev / 3 * 100 * (1 + Number.EPSILON)) / 100;
}

function stepExpression(step: ChainStep, prev: string): string {
  if (step.kind === "start") return "{" + step.arg + "} * 3 + 1";
  if (step.kind === "add") return "{" + prev + "} + {" + step.arg + "}";
  if (step.kind === "double") return "{" + prev + "} * 2";
  if (step.kind === "iif") return "iif({" + prev + "} > 50, {" + prev + "} - 7, {" + prev + "} + 3)";
  return "round({" + prev + "} / 3, 2)";
}

export function generateCalculations(options?: CalculationsOptions): { json: any, meta: any } {
  const o = Object.assign({}, calculationsDefaults, options || {});
  const rng = createRng(o.seed);
  const starts: Array<string> = [];
  const page1: Array<any> = [];
  for (let i = 0; i < chainCount; i++) {
    starts.push("s" + i);
    page1.push({ type: "text", name: "s" + i, title: rng.words(3), inputType: "number" });
  }
  page1.push({ type: "text", name: "d1", title: rng.words(2), inputType: "date", defaultValue: isoDate(2024, 1, 15) });
  page1.push({ type: "text", name: "d2", title: rng.words(2), inputType: "date", defaultValue: isoDate(2024, 3, 1) });
  page1.push({ type: "text", name: "cycx", title: rng.words(2), inputType: "number", defaultValue: 1 });
  page1.push({ type: "matrixdropdown", name: "costs", title: rng.words(2), rows: ["r1", "r2", "r3", "r4", "r5"], columns: [
    { name: "qty", cellType: "text", inputType: "number" }, { name: "price", cellType: "text", inputType: "number" }] });
  page1.push({ type: "matrixdynamic", name: "items", title: rng.words(2), rowCount: 3, columns: [{ name: "amount", cellType: "text", inputType: "number" }] });
  page1.push({ type: "paneldynamic", name: "people", title: rng.words(2), panelCount: 3, templateElements: [
    { type: "text", name: "age", inputType: "number" }, { type: "dropdown", name: "role", choices: [1, 2, 3] }] });
  page1.push({ type: "expression", name: "daysBetween", title: rng.words(2), expression: "dateDiff({d1}, {d2}, 'days')" });
  // Time-dependent results stay in expression questions that no condition reads.
  page1.push({ type: "expression", name: "ageNow", title: rng.words(2), expression: "age({d1})" });
  page1.push({ type: "expression", name: "todayIs", title: rng.words(2), expression: "today()" });

  const calculatedValues: Array<any> = [];
  const chains: Array<{ start: string, steps: Array<ChainStep> }> = [];
  const kinds: Array<ChainStepKind> = ["add", "double", "iif", "round"];
  const allValues: Array<string> = [];
  for (let c = 0; c < chainCount; c++) {
    const depth = c < 6 ? 10 : rng.int(4, 10);
    const steps: Array<ChainStep> = [{ name: "c" + c + "_1", kind: "start", arg: starts[c] }];
    for (let d = 2; d <= depth; d++) {
      const kind = rng.pick(kinds);
      const step: ChainStep = { name: "c" + c + "_" + d, kind: kind };
      // An "add" step reads another chain-start question, so wide fan-out reaches several chains.
      if (kind === "add") step.arg = starts[(c + d) % chainCount];
      steps.push(step);
    }
    steps.forEach((step: ChainStep, i: number) => {
      calculatedValues.push({ name: step.name, expression: stepExpression(step, i > 0 ? steps[i - 1].name : "") });
      allValues.push(step.name);
    });
    chains.push({ start: starts[c], steps: steps });
  }
  // Wide fan-in: one value reads 30 others.
  const fanIn: Array<string> = [];
  while(fanIn.length < 30) {
    const name = rng.pick(allValues);
    if (fanIn.indexOf(name) < 0) fanIn.push(name);
  }
  calculatedValues.push({ name: "fanin", expression: fanIn.map((n: string) => "{" + n + "}").join(" + ") });
  // Values over matrix cells and the dynamic panel.
  const aggregates = [
    "sumInArray({people}, 'age')", "countInArray({people}, 'age', {role} = 1)", "avgInArray({people}, 'age')",
    "sumInArray({items}, 'amount')", "countInArray({items}, 'amount')",
    "{costs.r1.qty} * {costs.r1.price}", "{costs.r2.qty} * {costs.r2.price}", "{costs.r3.qty} * {costs.r3.price} + {costs.r4.qty}",
    "sumInArray({costs}, 'qty')", "round(avgInArray({items}, 'amount'), 2)", "dateDiff({d1}, {d2}, 'days')"
  ];
  aggregates.forEach((expression: string, i: number) => {
    calculatedValues.push({ name: "agg" + i, expression: expression });
    allValues.push("agg" + i);
  });
  // The rest: values that read two earlier values, so the graph has more than straight chains.
  for (let i = 0; i < extraValues; i++) {
    const a = rng.pick(allValues);
    let b = rng.pick(allValues);
    while(b === a) b = rng.pick(allValues);
    const form = i % 4;
    const expression = form === 0 ? "{" + a + "} + {" + b + "}" : form === 1 ? "iif({" + a + "} > {" + b + "}, {" + a + "}, {" + b + "})" :
      form === 2 ? "round({" + a + "} * 0.5 + {" + b + "}, 2)" : "max({" + a + "}, {" + b + "}) - min({" + a + "}, {" + b + "})";
    calculatedValues.push({ name: "x" + i, expression: expression });
    allValues.push("x" + i);
  }
  // Conditions of the customer file's length (p50 about 300 characters) over a block of radiogroups.
  const gen = createExpressionGenerator(rng);
  const answers: Array<any> = [];
  for (let i = 0; i < answerQuestions; i++) {
    answers.push({ type: "radiogroup", name: "a" + i, title: rng.words(3), choices: [1, 2, 3] });
    gen.add({ path: "a" + i, root: "a" + i, shape: "a", kind: "choice", values: [1, 2, 3], order: i });
  }
  for (let i = 0; i < answerValues; i++) {
    const condition = gen.condition({ owner: answerQuestions, length: rng.int(150, 600), andShare: 0.63 }).text;
    calculatedValues.push({ name: "y" + i, expression: "iif(" + condition + ", " + rng.int(1, 9) + ", 0)" });
  }
  // The settling cycle of tests/calculatedvaluestests.ts: it loops a few times at load and settles at 3, 4, 3.
  calculatedValues.push({ name: "cycA", expression: "iif({cycC} > 0, {cycC}, 1)" });
  calculatedValues.push({ name: "cycB", expression: "{cycA} + {cycx}" });
  calculatedValues.push({ name: "cycC", expression: "iif({cycB} >= 3, 3, {cycB})" });
  // Declared in a shuffled order: a value may read one declared after it.
  rng.shuffle(calculatedValues);

  const pages: Array<any> = [{ name: "page1", elements: page1 }];
  for (let i = 0; i < answers.length; i += perPage) pages.push({ name: "page" + (pages.length + 1), elements: answers.slice(i, i + perPage) });
  const later: Array<any> = [];
  const readable = allValues.filter((n: string): boolean => n !== "fanin");
  for (let i = 0; i < expressionQuestions; i++) {
    const v = rng.pick(readable);
    const form = i % 3;
    later.push({ type: "expression", name: "ex" + i, title: rng.words(2),
      expression: form === 0 ? "{" + v + "} * 2" : form === 1 ? "round({" + v + "} / 7, 2)" : "iif({" + v + "} > 10, 'high', 'low')" });
  }
  for (let i = 0; i < defaultValueQuestions; i++) {
    const v = rng.pick(readable);
    later.push({ type: "text", name: "dv" + i, title: rng.words(2), inputType: "number", defaultValueExpression: "{" + v + "} + " + rng.int(1, 9) });
  }
  // A few conditions on chain values, so their changes also reach visibility. With every answer empty a chain
  // starts at 1, which gives the planned visible count.
  const atLoad: { [name: string]: number } = {};
  chains.forEach((chain: any) => {
    let prev = 0;
    chain.steps.forEach((step: ChainStep) => { prev = computeChainStep(step, prev, 0); atLoad[step.name] = prev; });
  });
  const chainValues = Object.keys(atLoad);
  let hiddenAtLoad = 0;
  for (let i = 0; i < 40; i++) {
    const q = later[rng.int(0, later.length - 1)];
    if (q.visibleIf) continue;
    const v = rng.pick(chainValues);
    const limit = rng.int(0, 50);
    q.visibleIf = "{" + v + "} >= " + limit;
    if (!(atLoad[v] >= limit)) hiddenAtLoad++;
  }
  rng.shuffle(later);
  for (let i = 0; i < later.length; i += perPage) pages.push({ name: "page" + (pages.length + 1), elements: later.slice(i, i + perPage) });

  const longest = chains.reduce((a: any, b: any): any => b.steps.length > a.steps.length ? b : a, chains[0]);
  const startValues: { [name: string]: number } = {};
  starts.forEach((s: string, i: number) => { startValues[s] = (i * 7) % 13 + 2; });
  const json = { title: rng.words(3), pages: pages, calculatedValues: calculatedValues };
  const questions = page1.length + answers.length + later.length;
  const meta = {
    pages: pages.length,
    panels: 0,
    questions: questions,
    // costs: 5 rows x 2 columns; items: 3 rows x 1 column; people: 3 panels x 2 questions.
    questionsWithCells: questions + 10 + 3 + 6,
    visibleQuestions: questions - hiddenAtLoad,
    calculatedValues: calculatedValues.length,
    chainStarts: starts,
    chains: chains,
    longestChain: longest.steps.map((s: ChainStep) => s.name),
    startValues: startValues,
    firstAnswer: { name: longest.start, value: 5 },
    nextAnswers: starts.filter((s: string) => s !== longest.start).slice(0, 10).map((s: string, i: number) => ({ name: s, value: i + 3 })),
    cycle: ["cycA", "cycB", "cycC"],
    expectedLintFindings: [{ ruleId: "cycle/calculated-value", names: ["cycA", "cycB", "cycC"] }]
  };
  return { json: json, meta: meta };
}

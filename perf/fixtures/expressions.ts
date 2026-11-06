import type { Rng } from "./random.ts";

// The expression generator: valid conditions and numeric expressions of a requested length over the names a
// generator has created. A reference is one readable path ({a}, {m.row}, {pd[0].q.key}, {panel.q}) with the kind
// of value it holds, so every comparison fits its operand.
export type ValueKind = "choice" | "multi" | "number" | "boolean" | "text";
export type RefShape = "a" | "a.b" | "a.b.c" | "a[i].b" | "a[i].b.c" | "panel.a" | "panel.a.b" | "calc" | "fn";

export interface Ref {
  path: string;
  root: string;
  shape: RefShape;
  kind: ValueKind;
  values?: Array<number | string>;
  // The position of the element in the survey; forward references read a larger order.
  order: number;
  // The value at load (a defaultValue); undefined for an empty answer.
  initial?: any;
  // The value at load is not known to the generator (a defaultValueExpression, a calculated value).
  unknownAtLoad?: boolean;
  // shape "fn": a whole atom written by the fixture (a function call over its questions) and its value at load.
  fixed?: { text: string, atLoad: boolean | undefined };
  // A value no ordering operator applies to (a matrix row inside a template, for the linter).
  noOrder?: boolean;
  // The question writes its value from a defaultValueExpression.
  writesDefault?: boolean;
}

export type Weights = { [key: string]: number };

export interface ConditionRequest {
  owner: number;
  length: number;
  self?: string;
  // The share of references that read a name created later.
  forward?: number;
  shapes?: Weights;
  ops?: Weights;
  andShare?: number;
  notShare?: number;
  // References read with a share of their own, ahead of the shapes: the chain-start questions, the template
  // questions ({panel.q}) of the element's own dynamic panel, the calculated values.
  scope?: Array<Ref>;
  scopeShare?: number;
  scopes?: Array<{ refs: Array<Ref>, share: number }>;
  // The share of nested groups written as iif(C, 1, 0) = 1, and of number comparisons written with "* k".
  iifShare?: number;
  arithmeticShare?: number;
  // Paths the condition must not read: the chain-start questions of a planned condition, trigger targets.
  exclude?: Array<string>;
  // Read only names whose value at load the generator knows, so the condition value at load is known.
  knownAtLoad?: boolean;
  // Only references this accepts (for example: no default value expression holder, so defaults form no loop).
  accept?: (ref: Ref) => boolean;
}

export interface Condition {
  text: string;
  // The value at load, with every answer empty or at its defaultValue; undefined when the generator cannot know
  // it (a calculated value, a defaultValueExpression).
  atLoad: boolean | undefined;
  refs: number;
}

export const defaultOps: Weights = { "=": 30, "<>": 5, "anyof": 15, "noneof": 15, "empty": 6, "notempty": 3, ">": 5, "<": 3,
  "contains": 8, "notcontains": 8, "allof": 2 };

const atomLength = 26;

// The share of element references that read a name created later. The counting script of D03 finds 21.6% of all
// references forward in the customer file (calculated values count as declared after every element); this share
// gives the same 21-22% on complexLogic.
export const customerForwardShare = 0.34;

function pickWeighted(rng: Rng, weights: Weights, allowed?: (key: string) => boolean): string {
  let total = 0;
  for (const key in weights) if (!allowed || allowed(key)) total += weights[key];
  let x = rng.next() * total;
  let last = "";
  for (const key in weights) {
    if (allowed && !allowed(key)) continue;
    last = key;
    x -= weights[key];
    if (x < 0) return key;
  }
  return last;
}

const opsByKind: { [kind: string]: Array<string> } = {
  // Choice values are numbers here, so they also compare with > and <.
  choice: ["=", "<>", "anyof", "noneof", "empty", "notempty", ">", "<"],
  multi: ["contains", "notcontains", "anyof", "noneof", "allof", "empty", "notempty"],
  number: ["=", "<>", ">", "<", ">=", "<=", "empty", "notempty"],
  boolean: ["=", "empty", "notempty"],
  text: ["empty", "notempty"]
};

// The value of an atom at load: the operators of src/expressions/expressions.ts on the initial value.
function evalAtLoad(op: string, v: any, operand: any, factor?: number): boolean {
  const isEmpty = v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
  if (factor !== undefined) v = (isEmpty ? 0 : v) * factor;
  const list = Array.isArray(v) ? v : isEmpty ? [] : [v];
  const has = (x: any): boolean => list.some((item: any): boolean => item == x);
  switch(op) {
    case "empty": return isEmpty && factor === undefined;
    case "notempty": return !isEmpty || factor !== undefined;
    case "=": return !isEmpty && v == operand;
    case "<>": return isEmpty || v != operand;
    case "anyof": return (operand as Array<any>).some(has);
    case "noneof": return !(operand as Array<any>).some(has);
    case "allof": return !isEmpty && (operand as Array<any>).every(has);
    case "contains": return has(operand);
    case "notcontains": return !has(operand);
    case ">": return (factor !== undefined || !isEmpty) && v > operand;
    case "<": return (factor !== undefined || !isEmpty) && v < operand;
    case ">=": return (factor !== undefined || !isEmpty) && v >= operand;
    case "<=": return (factor !== undefined || !isEmpty) && v <= operand;
  }
  throw new Error("Unknown operator " + op);
}

function formatValue(v: number | string): string {
  return typeof v === "number" ? String(v) : "'" + v + "'";
}

export interface ExpressionGenerator {
  add(ref: Ref): void;
  refs(shape: RefShape): Array<Ref>;
  pickRef(owner: number, forward: number, shapes: Weights, used: Set<string>, kinds?: Array<ValueKind>, knownOnly?: boolean,
    accept?: (ref: Ref) => boolean): Ref | undefined;
  atom(ref: Ref, ops?: Weights): Condition;
  condition(request: ConditionRequest): Condition;
  // A condition whose value at load is the given one: "!(...)" flips it when needed.
  conditionAtLoad(request: ConditionRequest, value: boolean): Condition;
}

export function createExpressionGenerator(rng: Rng): ExpressionGenerator {
  const byShape: { [shape: string]: Array<Ref> } = {};
  const orders: { [shape: string]: Array<number> } = {};
  const add = (ref: Ref): void => {
    if (!byShape[ref.shape]) {
      byShape[ref.shape] = [];
      orders[ref.shape] = [];
    }
    const list = byShape[ref.shape];
    const ord = orders[ref.shape];
    // Kept sorted by order: generators add mostly in order, so the insertion point is almost always the end.
    let i = list.length;
    while(i > 0 && ord[i - 1] > ref.order) i--;
    list.splice(i, 0, ref);
    ord.splice(i, 0, ref.order);
  };
  const firstAbove = (ord: Array<number>, owner: number): number => {
    let lo = 0;
    let hi = ord.length;
    while(lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ord[mid] <= owner) lo = mid + 1; else hi = mid;
    }
    return lo;
  };
  const pickRef = (owner: number, forward: number, shapes: Weights, used: Set<string>, kinds?: Array<ValueKind>, knownOnly?: boolean,
    accept?: (ref: Ref) => boolean): Ref | undefined => {
    // The direction is chosen once, so a retry after a rejected name keeps the forward share.
    const forwardFirst = rng.chance(forward);
    const attempts = kinds || knownOnly || accept ? 200 : 12;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const wantForward = attempt < attempts / 2 ? forwardFirst : !forwardFirst;
      // Only the shapes with a name on that side: a shape whose names all come later must not force a forward read.
      const hasSide = (key: string): boolean => {
        if (!byShape[key] || byShape[key].length === 0) return false;
        const split = firstAbove(orders[key], owner);
        return wantForward ? split < byShape[key].length : split > 0;
      };
      const shape = pickWeighted(rng, shapes, hasSide);
      if (!shape || !hasSide(shape)) continue;
      const list = byShape[shape];
      const split = firstAbove(orders[shape], owner);
      const ref = wantForward ? list[rng.int(split, list.length - 1)] : list[rng.int(0, split - 1)];
      if (used.has(ref.path) || used.has("root:" + ref.root)) continue;
      if (kinds && kinds.indexOf(ref.kind) < 0) continue;
      if (knownOnly && (ref.unknownAtLoad || ref.shape === "calc")) continue;
      if (accept && !accept(ref)) continue;
      return ref;
    }
    return undefined;
  };
  const atom = (ref: Ref, ops?: Weights, arithmeticShare: number = 0.25): Condition => {
    if (ref.fixed) return { text: ref.fixed.text, atLoad: ref.fixed.atLoad, refs: 1 };
    const allowed = opsByKind[ref.kind].filter((op: string) => !ref.noOrder || [">", "<", ">=", "<="].indexOf(op) < 0);
    const op = pickWeighted(rng, ops || defaultOps, (key: string): boolean => allowed.indexOf(key) > -1);
    const left = "{" + ref.path + "}";
    const values = ref.values && ref.values.length > 0 ? ref.values : [1, 2, 3];
    const known = ref.shape !== "calc" && !ref.unknownAtLoad;
    const res = (text: string, operand: any, factor?: number): Condition =>
      ({ text: text, atLoad: known ? evalAtLoad(op, ref.initial, operand, factor) : undefined, refs: 1 });
    if (op === "empty" || op === "notempty") return res(left + " " + op, undefined);
    if (op === "anyof" || op === "noneof" || op === "allof") {
      const count = Math.min(values.length, rng.int(1, 3));
      const start = rng.int(0, values.length - count);
      const list = values.slice(start, start + count);
      return res(left + " " + op + " [" + list.map(formatValue).join(", ") + "]", list);
    }
    if (ref.kind === "boolean") {
      const b = rng.chance(0.5);
      return res(left + " = " + (b ? "true" : "false"), b);
    }
    if (ref.kind === "number") {
      const n = rng.int(1, 100);
      // Arithmetic in a comparison: an empty operand counts as 0 next to a number.
      if (op !== "=" && op !== "<>" && rng.chance(arithmeticShare)) {
        const k = rng.int(2, 5);
        return res(left + " * " + k + " " + op + " " + n, n, k);
      }
      return res(left + " " + op + " " + n, n);
    }
    const value = rng.pick(values);
    return res(left + " " + op + " " + formatValue(value), value);
  };
  const combine = (a: boolean | undefined, b: boolean | undefined, isAnd: boolean): boolean | undefined => {
    if (isAnd) {
      if (a === false || b === false) return false;
      return a === true && b === true ? true : undefined;
    }
    if (a === true || b === true) return true;
    return a === false && b === false ? false : undefined;
  };
  const build = (request: ConditionRequest, length: number, used: Set<string>, depth: number): Condition => {
    const shapes = request.shapes || { "a": 1 };
    if (length <= atomLength * 1.6 || depth > 7) {
      let ref: Ref | undefined;
      const scopes = (request.scopes || []).slice();
      if (request.scope) scopes.unshift({ refs: request.scope, share: request.scopeShare || 0 });
      for (const scope of scopes) {
        if (ref || scope.refs.length === 0 || !rng.chance(scope.share)) continue;
        for (let i = 0; i < 6 && !ref; i++) {
          const candidate = rng.pick(scope.refs);
          const unknown = candidate.unknownAtLoad || candidate.shape === "calc";
          if (used.has(candidate.path) || used.has("root:" + candidate.root)) continue;
          if (request.knownAtLoad && unknown) continue;
          if (request.accept && !request.accept(candidate)) continue;
          ref = candidate;
        }
      }
      if (!ref) ref = pickRef(request.owner, request.forward || 0, shapes, used, undefined, request.knownAtLoad, request.accept);
      if (!ref) ref = pickRef(request.owner, request.forward || 0, shapes, new Set<string>(["root:" + (request.self || "")]), undefined, request.knownAtLoad, request.accept);
      if (!ref) throw new Error("No name to read for an expression at order " + request.owner);
      used.add(ref.path);
      return atom(ref, request.ops, request.arithmeticShare === undefined ? 0.25 : request.arithmeticShare);
    }
    const isAnd = rng.chance(request.andShare === undefined ? 0.6 : request.andShare);
    const count = Math.max(2, Math.min(4, Math.floor(length / (atomLength * 1.3)), rng.int(2, 4)));
    const parts: Array<Condition> = [];
    let rest = length;
    for (let i = 0; i < count; i++) {
      const share = i === count - 1 ? rest : Math.max(atomLength, Math.floor(rest * (0.5 + rng.next() * 0.6) / (count - i)));
      rest -= share;
      // An "and" group shares the names it reads, so it never compares one name twice; an "or" branch may read
      // a name again.
      parts.push(build(request, share, isAnd ? used : new Set<string>(used), depth + 1));
    }
    let text = "";
    let atLoad: boolean | undefined = isAnd;
    let refs = 0;
    parts.forEach((part: Condition, index: number) => {
      const wrapped = part.refs > 1 ? "(" + part.text + ")" : part.text;
      text += (index > 0 ? (isAnd ? " and " : " or ") : "") + wrapped;
      atLoad = index === 0 ? part.atLoad : combine(atLoad, part.atLoad, isAnd);
      refs += part.refs;
    });
    if (depth > 0 && rng.chance(request.notShare || 0)) {
      return { text: "!(" + text + ")", atLoad: atLoad === undefined ? undefined : !atLoad, refs: refs + 1 };
    }
    // A nested iif: the same truth value, read through a function call.
    if (depth > 0 && !!request.iifShare && rng.chance(request.iifShare)) {
      return { text: "iif(" + text + ", 1, 0) = 1", atLoad: atLoad, refs: refs + 1 };
    }
    return { text: text, atLoad: atLoad, refs: refs };
  };
  const condition = (request: ConditionRequest): Condition => {
    const used = new Set<string>(request.exclude || []);
    if (request.self) used.add("root:" + request.self);
    return build(request, request.length, used, 0);
  };
  return {
    add: add,
    refs: (shape: RefShape): Array<Ref> => byShape[shape] || [],
    pickRef: pickRef,
    atom: atom,
    condition: condition,
    conditionAtLoad: (request: ConditionRequest, value: boolean): Condition => {
      const shapes = Object.assign({}, request.shapes || { "a": 1 });
      delete shapes.calc;
      for (let attempt = 0; attempt < 20; attempt++) {
        const res = condition(Object.assign({}, request, { shapes: shapes, scope: undefined, knownAtLoad: true }));
        if (res.atLoad === value) return res;
        if (res.atLoad === !value) return { text: "!(" + res.text + ")", atLoad: value, refs: res.refs + 1 };
      }
      throw new Error("No condition with a known value at load at order " + request.owner);
    }
  };
}

// The length of the next expression: most are short, with a long tail (01 section The expression generator).
export function sampleLength(rng: Rng, mix: { p50: number, p90: number, max: number }): number {
  const x = rng.next();
  if (x < 0.5) return rng.int(Math.max(14, Math.floor(mix.p50 / 4)), mix.p50);
  if (x < 0.9) return rng.int(mix.p50, mix.p90);
  // The tail is log-uniform up to max.
  const r = rng.next();
  return Math.floor(mix.p90 * Math.pow(mix.max / mix.p90, r * r));
}

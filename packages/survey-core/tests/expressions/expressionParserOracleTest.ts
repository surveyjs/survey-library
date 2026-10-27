import { parse, ExpressionSyntaxError } from "../../src/expressions/expressionParserCore";
import { parse as oracleParse, PeggySyntaxError } from "./oracle/expressionParser";

import { describe, test, expect } from "vitest";

// The hand-written parser against the parser peggy generates from tests/expressions/oracle/grammar.pegjs.
// Both get the raw text (no ConditionsParser.patchExpression), so "<>", "=>" and "equals" reach them too.
describe("Expression parser: differential test against the generated parser", () => {
  const SEED = 12;
  const COUNT = 20000;
  const MAX_DEPTH = 7;

  const mulberry32 = (a: number): (() => number) => {
    return () => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };

  const NUMS = ["0", "1", "01", "007", "123", "1.5", "0.25", "1.", ".5", "1.2.3", "0x1F", "0x10", "0x", "0X1", "0x1.5", "1e5", "1E-5",
    "-1", "-0", "- 1", "-1.5", "-0x1", "--1", "-", "123456789012345678901234567890", "99999999999999999999.5", "00", "0.0", "10"];
  const STRS = ["'abc'", "\"abc\"", "''", "\"\"", "'a\\'b'", "\"a\\\"b\"", "'a\"b'", "\"a'b\"", "'unterminated", "\"unterminated", "'a\\\\'",
    "'\\'", "'<>'", "' '", "'\\x'", "'a\\\"b'", "\"\\'\"", "'", "\""];
  const VARS = ["{a}", "{ a b }", "{a.b[0]}", "{$q.x}", "{#a}", "{}", "{a", "{a{b}", "{a-b}", "{a}}", "{\t}", "{a.b}", "{panel.q1}", "{row.c}"];
  const WORDS = ["true", "false", "null", "undefined", "nullable", "trueish", "falsey", "undefinedx", "nullx", "abc", "x1", "a1b2", "_x",
    "x_1_y", "order", "andy", "orx", "notempty", "empty", "contains", "containsX", "negate", "negatex", "iif", "max", "today", "power",
    "anyofx", "lessx", "equalx", "Null", "NULL", "Undefined"];
  const OPS = ["||", "or", "&&", "and", "<=", "lessorequal", ">=", "greaterorequal", "==", "equal", "=", "!=", "notequal", "<", "less", ">",
    "greater", "+", "-", "*", "/", "%", "^", "power", "*=", "contains", "contain", "notcontains", "notcontain", "anyof", "allof", "noneof",
    "<>", "=>", "=<", "equals", "notequals", "empty", "notempty", "!", "|", "&", "=="];
  const FUNCS = ["iif", "max", "f", "sum", "today", "age", "contains", "and", "null", "true", "x1", "negate"];
  const ROWS = ["1 order", "{a} andy", "{a} containsX", "trueish", "nullable", "{a} = NULL", "f(null, 1)", "f(null)", "[null, 1]", "[ ]",
    "{a} contains", "(1", "max(1", "{a} anyof ['x'", "f(,1)", "[1,,2]", "{a} = null", "{a} = undefined", "2 ^ 3 ^ 2", "1 = 2 = 3",
    "{a} AND {b}", "NEGATE {a}", "negate{a}", "-{a}", "0x1F", "1e5", "01", "1.", "a.b", "{a}.b", "f(1)(2)", "'a<>b' = {c}", "{ a b }",
    "{a} <> 1 or {b} != 2", "iif({a} > 1, 'x', {b} * 2) notempty", "{a} anyof [1, 2, 'x'] and !({b} contains 'y')"];
  const ALPHABET: Array<string> = [];
  for (let c = 32; c < 127; c++) ALPHABET.push(String.fromCharCode(c));
  ALPHABET.push("\t", "\n", "\r", "\0", "\x07", "\x7F", "\x85", "\u00A0", "\u0301", "\uD800", "\u{1F600}");
  for (let k = 0; k < 4; k++) ALPHABET.push("'", "\"", "\\", "{", "}", "[", "]", "(", ")", " ");

  // Input i depends on (SEED, i) only. A quarter are grammar-built inputs with every spelling and broken pieces, a quarter
  // valid-leaning grammar-built inputs, half mutations (delete, insert, replace, transpose) of either or of a table row.
  const makeInput = (i: number): string => {
    const rnd = mulberry32(Math.imul(SEED, 0x9E3779B1) ^ Math.imul(i + 1, 0x85EBCA77));
    const int = (n: number): number => Math.floor(rnd() * n);
    const pick = (a: Array<string>): string => a[int(a.length)];
    const chance = (p: number): boolean => rnd() < p;
    const caseVariant = (w: string): string => chance(0.6) ? w :
      (chance(0.5) ? w.toUpperCase() : w.split("").map(ch => chance(0.5) ? ch.toUpperCase() : ch).join(""));
    const ws = (): string => pick(["", "", "", " ", " ", " ", "  ", "\t", "\n", "\r", " \t\n\r "]);
    const atom = (): string => {
      const r = int(10);
      let s = r < 3 ? pick(NUMS) : r < 5 ? pick(STRS) : r < 8 ? pick(VARS) : caseVariant(pick(WORDS));
      if (chance(0.08)) s += ws() + caseVariant(pick(["empty", "notempty", "emptyx"]));
      return s;
    };
    const seq = (d: number, item: (d: number) => string, holes: boolean): string => {
      const parts: Array<string> = [];
      for (let k = int(4); k > 0; k--) parts.push(holes && chance(0.1) ? ws() : item(d - 1));
      return parts.join(ws() + "," + ws());
    };
    const gen = (d: number): string => {
      if (d <= 0) return atom();
      const r = int(12);
      if (r < 4) {
        const right = chance(0.07) ? "" : gen(d - 1);
        return gen(d - 1) + ws() + caseVariant(pick(OPS)) + ws() + right;
      }
      if (r < 5) return caseVariant(pick(["!", "!", "negate"])) + ws() + gen(d - 1);
      if (r < 7) return "(" + ws() + gen(d - 1) + ws() + (chance(0.85) ? ")" : "");
      if (r < 8) return caseVariant(pick(FUNCS)) + "(" + seq(d, gen, true) + (chance(0.85) ? ")" : "");
      if (r < 9) return "[" + ws() + seq(d, gen, true) + ws() + (chance(0.85) ? "]" : "");
      return atom();
    };
    const cleanAtom = (): string => {
      const r = int(10);
      let s = r < 3 ? pick(NUMS.slice(0, 7)) : r < 5 ? pick(STRS.slice(0, 6)) : r < 8 ? pick(VARS.slice(0, 5)) : caseVariant(pick(WORDS.slice(0, 13)));
      if (chance(0.08)) s += " " + caseVariant(pick(["empty", "notempty"]));
      return s;
    };
    const clean = (d: number): string => {
      if (d <= 0) return cleanAtom();
      const r = int(12);
      if (r < 5) return clean(d - 1) + ws() + " " + caseVariant(pick(OPS.slice(0, 37))) + " " + ws() + clean(d - 1);
      if (r < 6) return caseVariant(pick(["!", "negate "])) + ws() + clean(d - 1);
      if (r < 8) return "(" + ws() + clean(d - 1) + ws() + (chance(0.95) ? ")" : "");
      if (r < 9) return pick(FUNCS.slice(0, 6)) + "(" + seq(d, clean, false) + (chance(0.95) ? ")" : "");
      if (r < 10) return "[" + seq(d, clean, false) + (chance(0.95) ? "]" : "");
      return cleanAtom();
    };
    const mutate = (s: string, n: number): string => {
      for (let k = 0; k < n; k++) {
        const at = int(s.length + 1);
        const op = int(4);
        if (op === 0) s = s.slice(0, at) + s.slice(at + 1);
        else if (op === 1) s = s.slice(0, at) + pick(ALPHABET) + s.slice(at);
        else if (op === 2) s = s.slice(0, at) + pick(ALPHABET) + s.slice(at + 1);
        else if (at + 1 < s.length) s = s.slice(0, at) + s[at + 1] + s[at] + s.slice(at + 2);
      }
      return s;
    };
    if (i % 4 === 0) return chance(0.02) ? ws() : gen(1 + int(MAX_DEPTH));
    if (i % 4 === 2) return ws() + clean(1 + int(MAX_DEPTH)) + ws();
    const origin = int(3);
    let text = origin === 0 ? gen(1 + int(MAX_DEPTH)) : origin === 1 ? clean(1 + int(MAX_DEPTH)) : pick(ROWS);
    if (chance(0.3)) text = text.slice(0, int(text.length + 1));
    return mutate(text, 1 + int(4));
  };

  // Per node: getType(); binary: operator, isArithmetic, left/right; unary: operator, expression; function: functionName,
  // paramValues; array: values; const: typeof and the raw value (=== semantics); variable: variable; null vs undefined.
  // Not toString() (it throws on "!null") and not isEqual (it compares constants with ==).
  const constText = (value: any): string => {
    const type = typeof value;
    if (type === "string") return "s" + JSON.stringify(value);
    if (type === "number") return Object.is(value, -0) ? "n-0" : "n" + String(value);
    return type + ":" + String(value);
  };
  const dump = (op: any): string => {
    if (op === null) return "null";
    if (op === undefined) return "undefined";
    switch(op.getType()) {
      case "binary": return "B(" + op.operator + "," + op.isArithmetic + "," + dump(op.leftOperand) + "," + dump(op.rightOperand) + ")";
      case "unary": return "U(" + op.operator + "," + dump(op.expression) + ")";
      case "function": return "F(" + JSON.stringify(op.functionName) + ",[" + op.paramValues.map(dump).join(",") + "])";
      case "array": return "A[" + op.values.map(dump).join(",") + "]";
      case "variable": return "V(" + JSON.stringify(op.variable) + ")";
      case "const": return "C(" + constText(op.value) + ")";
      default: return "?" + op.getType();
    }
  };
  const outcome = (parseFn: (text: string) => any, errorClass: any, text: string): string => {
    let op: any;
    try {
      op = parseFn(text);
    } catch(e) {
      if (e instanceof errorClass) return "error at " + e.location.start.offset + ": " + e.message;
      return "exception " + e.name;
    }
    return op === null ? "null root" : "operand " + dump(op);
  };

  test("Both parsers give the same operand tree, or the same error offset and message", () => {
    const failures: Array<string> = [];
    const kinds = { operand: 0, "null root": 0, error: 0, exception: 0 };
    let escapedFound = 0;
    for (let i = 0; i < COUNT; i++) {
      const text = makeInput(i);
      const expected = outcome(oracleParse, PeggySyntaxError, text);
      const actual = outcome(parse, ExpressionSyntaxError, text);
      kinds[expected.startsWith("null root") ? "null root" : expected.substring(0, expected.indexOf(" "))]++;
      if (/but "\\(u\{|x)/.test(expected)) escapedFound++;
      if (actual !== expected && failures.length < 5) {
        failures.push("seed " + SEED + ", input #" + i + " " + JSON.stringify(text) + "\n  generated: " + expected + "\n  hand-written: " + actual);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
    // The inputs exercise every outcome and the escaping of the found character in the message
    expect(kinds.operand, "operands").toBeGreaterThan(COUNT / 10);
    expect(kinds.error, "errors").toBeGreaterThan(COUNT / 10);
    expect(kinds["null root"], "null roots").toBeGreaterThan(0);
    expect(kinds.exception, "other exceptions").toBe(0);
    expect(escapedFound, "escaped characters in messages").toBeGreaterThan(0);
  });
});

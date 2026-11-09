import { describe, test, expect, afterEach } from "vitest";
import { ConditionsParser } from "../../src/conditions/conditionsParser";
import {
  Operand, Const, Variable, BinaryOperand, UnaryOperand, ArrayOperand, FunctionOperand, IOperandToStringContext
} from "../../src/expressions/expressions";
import { settings } from "../../src/settings";

function parse(expression: string): Operand {
  const op = new ConditionsParser().parseExpression(expression);
  expect(op, "the expression parses: " + expression).toBeTruthy();
  return op;
}

// The text toString() gave before the context existed. It must not change: it is how a parsed expression is serialized.
const outputTable: Array<[string, string]> = [
  ["{q1} = 1", "({q1} == 1)"],
  ["{q1} == 'a'", "({q1} == 'a')"],
  ["{q1} != 1", "({q1} != 1)"],
  ["{q1} <> 1", "({q1} != 1)"],
  ["{q1} < 1", "({q1} < 1)"],
  ["{q1} <= 1", "({q1} <= 1)"],
  ["{q1} > 1", "({q1} > 1)"],
  ["{q1} >= 1", "({q1} >= 1)"],
  ["{q1} contains 'a'", "({q1} contains 'a')"],
  ["{q1} notcontains 'a'", "({q1} notcontains 'a')"],
  ["{q1} anyof ['a', 'b']", "({q1} anyof ['a', 'b'])"],
  ["{q1} allof ['a', 'b']", "({q1} allof ['a', 'b'])"],
  ["{q1} noneof [1, 2]", "({q1} noneof [1, 2])"],
  ["'a' = {q1}", "('a' == {q1})"],
  ["{q1} anyof [{q2}, 'b']", "({q1} anyof [{q2}, 'b'])"],
  ["{q1} empty", "{q1} empty"],
  ["{q1} notempty", "{q1} notempty"],
  ["!({q1} = 1)", "! ({q1} == 1)"],
  ["!{q1}", "! {q1}"],
  ["!({q1} empty)", "! {q1} empty"],
  ["{a} and {b}", "({a} and {b})"],
  ["{a} or {b}", "({a} or {b})"],
  ["{a} && {b} || {c}", "(({a} and {b}) or {c})"],
  ["{a} and {b} and {c}", "(({a} and {b}) and {c})"],
  ["{a} or {b} and {c}", "({a} or ({b} and {c}))"],
  ["({a} or {b}) and {c}", "(({a} or {b}) and {c})"],
  ["(({a} = 1))", "({a} == 1)"],
  ["{q1} = 'a' and {q2} = 'b'", "(({q1} == 'a') and ({q2} == 'b'))"],
  ["{a} + {b}", "({a} + {b})"],
  ["{a} - {b}", "({a} - {b})"],
  ["{a} * {b}", "({a} * {b})"],
  ["{a} / {b}", "({a} / {b})"],
  ["{a} % {b}", "({a} % {b})"],
  ["{a} ^ {b}", "({a} ^ {b})"],
  ["1 + 2 * 3", "(1 + (2 * 3))"],
  ["(1 + 2) * 3", "((1 + 2) * 3)"],
  ["2 ^ 3 ^ 2", "((2 ^ 3) ^ 2)"],
  ["{a} - -1", "({a} - -1)"],
  ["-1", "-1"],
  ["{a} = 1 + 2", "({a} == (1 + 2))"],
  ["({q1} = 'a') = true", "(({q1} == 'a') == true)"],
  ["[1, 2, 3]", "[1, 2, 3]"],
  ["[]", "[]"],
  ["['a', null, 2]", "['a', null, 2]"],
  ["{q1} = []", "({q1} == [])"],
  ["today()", "today()"],
  ["age({birth})", "age({birth})"],
  ["iif({a} > 1, 'x', 'y')", "iif(({a} > 1), 'x', 'y')"],
  ["sum(max(1, 2), {a}, [1, 2])", "sum(max(1, 2), {a}, [1, 2])"],
  ["{q1} = iif({a}, 1, 2)", "({q1} == iif({a}, 1, 2))"],
  ["currentDate() > '2020-01-01'", "(currentDate() > '2020-01-01')"],
  ["'it\\'s'", "'it\\'s'"],
  ["{q1} = \"say \\\"hi\\\"\"", "({q1} == 'say \\\"hi\\\"')"],
  ["'a\"b'", "'a\\\"b'"],
  ["''", "''"],
  ["{q1} = null", "({q1} == )"],
  ["{q1} = undefined", "({q1} == )"],
  ["{q1} empty and {q2} = null", "({q1} empty and ({q2} == ))"],
  ["1.5", "1.5"],
  ["-2.25 < {a}", "(-2.25 < {a})"],
  ["0", "0"],
  ["1e3", "1000"],
  ["true", "true"],
  ["false", "false"],
  ["{a} = true and {b} != false", "(({a} == true) and ({b} != false))"],
  ["{#q1} = 1", "({#q1} == 1)"],
  ["{#q1} + {q2}", "({#q1} + {q2})"],
  ["{row.q1} = {panel.q2}", "({row.q1} == {panel.q2})"],
  ["{q1[0].a} = 1", "({q1[0].a} == 1)"],
  ["{a} = 1 and ({b} = 2 or {c} = 3) and !({d} empty)", "((({a} == 1) and (({b} == 2) or ({c} == 3))) and ! {d} empty)"],
];

describe("Operand.toString without a context", () => {
  afterEach(() => {
    settings.expressionVariableDelimiters = { start: "{", end: "}" };
  });
  test.each(outputTable)("%s gives today's text with no argument, an empty func and an empty context", (expression, expected) => {
    const op = parse(expression);
    expect(op.toString()).toBe(expected);
    expect(op.toString(() => undefined)).toBe(expected);
    expect(op.toString(() => "")).toBe(expected);
    expect(op.toString({})).toBe(expected);
  });
  test("operands built without the parser keep their text", () => {
    expect(new UnaryOperand(null as any, "negate").toString()).toBe("! null");
    expect(new ArrayOperand([null as any, new Const(1)]).toString()).toBe("[null, 1]");
    expect(new BinaryOperand("equal", null as any, new Variable("a")).toString()).toBe("( == {a})");
    expect(new ArrayOperand([new Const(1), new Variable("b")]).toString(undefined, true)).toBe("1, {b}");
    expect(new ArrayOperand([new Const(1), new Variable("b")]).toString({}, true)).toBe("1, {b}");
  });
  test("custom variable delimiters and the disable-conversion prefix", () => {
    const op = parse("{#q1} = {q2} and age({q3}) > 1");
    settings.expressionVariableDelimiters = { start: "{{", end: "}}" };
    expect(op.toString()).toBe("(({{#q1}} == {{q2}}) and (age({{q3}}) > 1))");
    expect(op.toString(() => undefined)).toBe("(({{#q1}} == {{q2}}) and (age({{q3}}) > 1))");
  });
  test("func visits the nodes in today's order", () => {
    const visitOrder = (expression: string, func: (f: (op: Operand) => string) => IOperandToStringContext | ((op: Operand) => string)): Array<string> => {
      const res: Array<string> = [];
      parse(expression).toString(func((op: Operand) => { res.push(op.getType()); return undefined; }));
      return res;
    };
    const cases: Array<[string, Array<string>]> = [
      ["{a} = 1 and !({b} anyof ['x', {c}])", ["binary", "binary", "variable", "const", "unary", "binary", "variable", "array", "const", "variable"]],
      ["iif({a} empty, sum(1, [2]), -1) > {b}", ["binary", "function", "array", "unary", "variable", "function", "array", "const", "array", "const", "const", "variable"]],
      ["{q1} = null", ["binary", "variable"]],
    ];
    for (const [expression, expected] of cases) {
      expect(visitOrder(expression, f => f), expression).toEqual(expected);
      expect(visitOrder(expression, f => ({ operandToString: f })), expression).toEqual(expected);
    }
  });
});

describe("IOperandToStringContext.operandToString", () => {
  const replaceType = (type: string, text: string) => (op: Operand): string => op.getType() === type ? text : undefined;
  test("a truthy result replaces the node, for every node type", () => {
    const op = parse("{q1} = 1 and !{q2} and iif({q3}, [1, 2], 'x')");
    const cases: Array<[string, string]> = [
      ["binary", "B"],
      ["unary", "((({q1} == 1) and U) and iif({q3}, [1, 2], 'x'))"],
      ["variable", "(((V == 1) and ! V) and iif(V, [1, 2], 'x'))"],
      ["const", "((({q1} == C) and ! {q2}) and iif({q3}, [C, C], C))"],
      ["array", "((({q1} == 1) and ! {q2}) and iif(A))"],
      ["function", "((({q1} == 1) and ! {q2}) and F)"],
    ];
    for (const [type, expected] of cases) {
      const text = expected.length === 1 ? expected : type[0].toUpperCase();
      expect(op.toString(replaceType(type, text)), type).toBe(expected);
      expect(op.toString({ operandToString: replaceType(type, text) }), type).toBe(expected);
    }
  });
  test("undefined and an empty string keep the node's text", () => {
    const op = parse("{q1} = 1 and iif({q3}, [1, 2], 'x')");
    const expected = "(({q1} == 1) and iif({q3}, [1, 2], 'x'))";
    expect(op.toString({ operandToString: () => undefined })).toBe(expected);
    expect(op.toString({ operandToString: () => "" })).toBe(expected);
  });
  test("it is called first: its result wins over the other hooks", () => {
    const op = parse("{q1} = 'a'");
    const context: IOperandToStringContext = {
      operandToString: (o: Operand) => o.getType() === "variable" ? "OP" : (o.getType() === "const" ? "CONST" : undefined),
      variableToString: () => "VAR",
      constToString: () => "C",
      operatorToString: () => "is",
    };
    expect(op.toString(context)).toBe("(OP is CONST)");
    expect(op.toString({ operandToString: (o: Operand) => o.getType() === "binary" ? "ALL" : undefined, skipRootBrackets: true })).toBe("ALL");
  });
  test("a function's parameters reach it as an array, as func does today", () => {
    const op = parse("sum(1, {a})");
    expect(op.toString((o: Operand) => o.getType() === "array" ? "P" : undefined)).toBe("sum(P)");
    expect(op.toString({ operandToString: (o: Operand) => o.getType() === "array" ? "P" : undefined })).toBe("sum(P)");
  });
});

describe("IOperandToStringContext.variableToString", () => {
  test("the hook's text replaces every variable; undefined keeps it", () => {
    const op = parse("{q1} = 1 and {q2} contains 'a'");
    const names: Array<string> = [];
    expect(op.toString({ variableToString: (v: Variable) => { names.push(v.variable); return "[" + v.variable.toUpperCase() + "]"; } }))
      .toBe("(([Q1] == 1) and ([Q2] contains 'a'))");
    expect(names).toEqual(["q1", "q2"]);
    expect(op.toString({ variableToString: (v: Variable) => v.variable === "q1" ? undefined : "Q2" })).toBe("(({q1} == 1) and (Q2 contains 'a'))");
    expect(op.toString({ variableToString: () => "" })).toBe("(({q1} == 1) and ({q2} contains 'a'))");
  });
  test("a variable is not a const for the hooks", () => {
    const op = parse("{q1} = {q2}");
    const consts: Array<Const> = [];
    expect(op.toString({ constToString: (c: Const) => { consts.push(c); return "C"; } })).toBe("({q1} == {q2})");
    expect(consts).toHaveLength(0);
  });
});

describe("IOperandToStringContext.constToString and comparedWith", () => {
  const collect = (expression: string): { text: string, calls: Array<[string, string]> } => {
    const calls: Array<[string, string]> = [];
    const text = parse(expression).toString({
      constToString: (c: Const, comparedWith: Variable) => {
        calls.push([c.toString(), comparedWith ? comparedWith.variable : undefined]);
        return undefined;
      }
    });
    return { text, calls };
  };
  test("a const compared with a variable gets the variable, on either side and inside an array", () => {
    expect(collect("{q1} = 'a'").calls).toEqual([["'a'", "q1"]]);
    expect(collect("'a' = {q1}").calls).toEqual([["'a'", "q1"]]);
    expect(collect("{q1} anyof ['a', 'b']").calls).toEqual([["'a'", "q1"], ["'b'", "q1"]]);
    expect(collect("{q1} contains 'a'").calls).toEqual([["'a'", "q1"]]);
    expect(collect("{q1} > 5").calls).toEqual([["5", "q1"]]);
  });
  test("each comparison passes its own variable", () => {
    expect(collect("{q1} = 'a' and {q2} = 'b'").calls).toEqual([["'a'", "q1"], ["'b'", "q2"]]);
    expect(collect("{q1} = 'a' or ({q2} anyof [1] and {q3} != 2)").calls).toEqual([["'a'", "q1"], ["1", "q2"], ["2", "q3"]]);
  });
  test("no comparedWith inside function parameters, arithmetic, a nested comparison or a nested array", () => {
    expect(collect("{q1} = iif({a}, 1, 2)").calls).toEqual([["1", undefined], ["2", undefined]]);
    expect(collect("{q1} = 1 + 2").calls).toEqual([["1", undefined], ["2", undefined]]);
    expect(collect("({q1} = 'a') = true").calls).toEqual([["'a'", "q1"], ["true", undefined]]);
    expect(collect("{q1} anyof [[1], 2]").calls).toEqual([["1", undefined], ["2", "q1"]]);
    expect(collect("{q1} + 1").calls).toEqual([["1", undefined]]);
    expect(collect("{q1} and true").calls).toEqual([["true", undefined]]);
    expect(collect("1 = 2").calls).toEqual([["1", undefined], ["2", undefined]]);
    expect(collect("!'a'").calls).toEqual([["'a'", undefined]]);
  });
  test("the hooks get the tree's own operands", () => {
    const op = <BinaryOperand>parse("{q1} = 1 and !{q2}");
    const left = <BinaryOperand>op.leftOperand;
    const unary = <UnaryOperand>op.rightOperand;
    const consts: Array<Const> = [];
    const variables: Array<Variable> = [];
    const operators: Array<Operand> = [];
    op.toString({
      constToString: (c: Const, v: Variable) => { consts.push(c, v); return undefined; },
      variableToString: (v: Variable) => { variables.push(v); return undefined; },
      operatorToString: (name: string, o: Operand) => { operators.push(o); return undefined; },
    });
    expect(consts).toHaveLength(2);
    expect(consts[0]).toBe(left.rightOperand);
    expect(consts[1]).toBe(left.leftOperand);
    expect(variables).toHaveLength(2);
    expect(variables[0]).toBe(left.leftOperand);
    expect(variables[1]).toBe(unary.expression);
    expect(operators).toHaveLength(3);
    expect(operators[0]).toBe(op);
    expect(operators[1]).toBe(left);
    expect(operators[2]).toBe(unary);
  });
  test("the hook's text replaces the const; undefined and an empty string keep it", () => {
    const op = parse("{q1} anyof ['a', 'b'] and {q2} = 1");
    const text = (c: Const, v: Variable) => !!v && v.variable === "q1" ? "'" + v.variable + ":" + c.correctValue + "'" : undefined;
    expect(op.toString({ constToString: text })).toBe("(({q1} anyof ['q1:a', 'q1:b']) and ({q2} == 1))");
    expect(op.toString({ constToString: () => "" })).toBe("(({q1} anyof ['a', 'b']) and ({q2} == 1))");
  });
});

describe("IOperandToStringContext.operatorToString", () => {
  test("binary and unary operators get the operator's name; undefined keeps the sign", () => {
    const op = parse("{q1} = 1 and {q2} anyof [1] and {q3} notempty and !{q4} and {a} + 1 > 2");
    const calls: Array<string> = [];
    const text = op.toString({ operatorToString: (name: string, o: Operand) => {
      calls.push(name + ":" + o.getType());
      return name === "equal" ? "=" : (name === "notempty" ? "is not empty" : undefined);
    } });
    expect(text).toBe("((((({q1} = 1) and ({q2} anyof [1])) and {q3} is not empty) and ! {q4}) and (({a} + 1) > 2))");
    expect(calls).toEqual(["and:binary", "and:binary", "and:binary", "and:binary", "equal:binary", "anyof:binary",
      "notempty:unary", "negate:unary", "greater:binary", "plus:binary"]);
  });
  test("function names are not operators", () => {
    const calls: Array<string> = [];
    expect(parse("sum({a}, 1)").toString({ operatorToString: (name: string) => { calls.push(name); return "X"; } })).toBe("sum({a}, 1)");
    expect(calls).toHaveLength(0);
  });
});

describe("IOperandToStringContext.skipRootBrackets", () => {
  test("the root binary has no brackets, the inner ones keep theirs", () => {
    expect(parse("{q1} = 1").toString({ skipRootBrackets: true })).toBe("{q1} == 1");
    expect(parse("{q1} = 1 and ({q2} = 2 or {q3} = 3)").toString({ skipRootBrackets: true }))
      .toBe("({q1} == 1) and (({q2} == 2) or ({q3} == 3))");
    expect(parse("{a} = 1 + 2").toString({ skipRootBrackets: true, operatorToString: () => "?" })).toBe("{a} ? (1 ? 2)");
  });
  test("a unary, a variable, a function, an array and a const root are unchanged", () => {
    for (const expression of ["!({q1} = 1)", "{q1} empty", "{q1}", "iif({a} > 1, 1, 2)", "[1, ({a} + 1)]", "'a'"]) {
      const op = parse(expression);
      expect(op.toString({ skipRootBrackets: true }), expression).toBe(op.toString());
    }
  });
  test("the default wraps the root, as today", () => {
    expect(parse("{q1} = 1").toString({ skipRootBrackets: false })).toBe("({q1} == 1)");
  });
});

describe("IOperandToStringContext re-entrancy", () => {
  test("one context renders two expressions, and renders inside its own hook", () => {
    const op1 = parse("{q1} = 'a' and {q2} = 1");
    const op2 = parse("iif({q3} anyof ['x'], 1, 2) > {q4}");
    const createContext = (): IOperandToStringContext => ({
      skipRootBrackets: true,
      variableToString: (v: Variable) => v.variable.toUpperCase(),
      constToString: (c: Const, v: Variable) => !!v ? v.variable + "=" + c.toString() : undefined,
      operatorToString: (name: string) => name === "and" ? "AND" : undefined,
    });
    const shared = createContext();
    const expected1 = op1.toString(createContext());
    const expected2 = op2.toString(createContext());
    expect(expected1).toBe("(Q1 == q1='a') AND (Q2 == q2=1)");
    expect(expected2).toBe("iif((Q3 anyof [q3='x']), 1, 2) > Q4");
    expect(op1.toString(shared)).toBe(expected1);
    expect(op2.toString(shared)).toBe(expected2);
    expect(op1.toString(shared)).toBe(expected1);

    // A hook that renders another expression with the same context, in the middle of a traversal.
    const nested: IOperandToStringContext = {
      skipRootBrackets: true,
      constToString: (c: Const, v: Variable) => !!v ? v.variable + "=" + c.toString() : undefined,
      operandToString: (o: Operand) => o.getType() === "function" ? "<" + op1.toString(nested) + ">" : undefined,
    };
    expect(parse("{q5} = 'z' or age({x})").toString(nested))
      .toBe("({q5} == q5='z') or <({q1} == q1='a') and ({q2} == q2=1)>");
    // The nodes rendered after the inner expression do not see its state: the 1 is not compared with q2.
    expect(parse("age({x}) = 1 or {q5} = 'z'").toString(nested))
      .toBe("(<({q1} == q1='a') and ({q2} == q2=1)> == 1) or ({q5} == q5='z')");
  });
});

describe("Operand.toString round trip", () => {
  test.each(outputTable.filter(([expression]) => !expression.includes("null") && !expression.includes("undefined")))(
    "%s parses back to an equal operand without the root brackets", (expression) => {
      const op = parse(expression);
      const text = op.toString({ skipRootBrackets: true });
      expect(parse(text).isEqual(op), text).toBe(true);
    });
});

describe("Operand.toString accepts a context on every operand class", () => {
  test("the classes built by hand render through the context", () => {
    const context: IOperandToStringContext = { variableToString: () => "V", constToString: () => "C", operatorToString: () => "op" };
    expect(new BinaryOperand("equal", new Variable("a"), new Const(1)).toString(context)).toBe("(V op C)");
    expect(new UnaryOperand(new Variable("a"), "notempty").toString(context)).toBe("V op");
    expect(new ArrayOperand([new Const(1), new Variable("b")]).toString(context)).toBe("[C, V]");
    expect(new ArrayOperand([new Const(1), new Variable("b")]).toString(context, true)).toBe("C, V");
    expect(new FunctionOperand("sum", new ArrayOperand([new Const(1)])).toString(context)).toBe("sum(C)");
    expect(new Const("'a'").toString(context)).toBe("C");
    expect(new Variable("a").toString(context)).toBe("V");
  });
});

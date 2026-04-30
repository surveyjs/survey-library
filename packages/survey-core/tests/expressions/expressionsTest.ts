import {
  Const,
  BinaryOperand,
  Operand,
  FunctionOperand
} from "../../src/expressions/expressions";
import { parse } from "../../src/expressions/expressionParser";

import { describe, test, expect } from "vitest";
describe("Expressions", () => {
  test("Arithmetic Operands", () => {
    let expression = new BinaryOperand(
      "plus",
      new Const(2),
      new BinaryOperand("mul", new Const(2), new Const(2))
    );
    expect(expression.toString()).toLooseEqual("(2 + (2 * 2))");
    expect(expression.evaluate()).toLooseEqual(6);
  });

  test("Comparable Operand", () => {
    let expression = new BinaryOperand("less", new Const(2), new Const(-10));
    expect(expression.toString()).toLooseEqual("(2 < -10)");
    expect(expression.evaluate()).toLooseEqual(false);
  });

  test("Logic Operands", () => {
    let expression = new BinaryOperand(
      "and",
      new Const(true),
      new BinaryOperand("less", new Const(1), new Const(2))
    );
    expect(expression.toString()).toLooseEqual("(true and (1 < 2))");
    expect(expression.evaluate()).toLooseEqual(true);
  });

  test("FunctionOperand.toString Operands", () => {
    const expression = "iif(({q1} == 1), 'Yes', 'No')";
    const op = <FunctionOperand>parse(expression);
    expect(op.toString()).toLooseEqual(expression);
    expect(op.functionName).toLooseEqual("iif");
  });

  test("ParametersOperand empty string", () => {
    const expression = "iif(({q1} == 1), 'Yes', '')";
    const op = <Operand>parse(expression);
    expect(op.toString()).toLooseEqual(expression);
  });

  test("ConstOperand empty string", () => {
    const expression = "({q1} == '')";
    const op = <Operand>parse(expression);
    expect(op.toString()).toLooseEqual(expression);
  });
});

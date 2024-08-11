import {
  Const,
  Variable,
  BinaryOperand,
  FunctionOperand
} from "../../src/expressions/expressions";

export default QUnit.module("Expressions");

QUnit.test("Arithmetic Operands", function(assert) {
  let expression = new BinaryOperand(
    "plus",
    new Const(2),
    new BinaryOperand("mul", new Const(2), new Const(2))
  );
  assert.equal(expression.toString(), "(2 + (2 * 2))");
  assert.equal(expression.evaluate(), 6);
});

QUnit.test("Comparable Operand", function(assert) {
  let expression = new BinaryOperand("less", new Const(2), new Const(-10));
  assert.equal(expression.toString(), "(2 < -10)");
  assert.equal(expression.evaluate(), false);
});

QUnit.test("Logic Operands", function(assert) {
  let expression = new BinaryOperand(
    "and",
    new Const(true),
    new BinaryOperand("less", new Const(1), new Const(2))
  );
  assert.equal(expression.toString(), "(true and (1 < 2))");
  assert.equal(expression.evaluate(), true);
});

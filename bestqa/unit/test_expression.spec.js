import {
    Const,
    BinaryOperand,
  } from "@/expressions/expressions";
  
  
  test("Arithmetic Operands", function() {
    let expression = new BinaryOperand(
      "plus",
      new Const(2),
      new BinaryOperand("mul", new Const(2), new Const(2))
    );
    console.log(expression)
    expect(expression.toString()).toBe("(2 + (2 * 2))");
    expect(expression.evaluate()).toBe(6);
  });
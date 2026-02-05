import { ExpressionRunner } from "../../src/conditions";
import { FunctionFactory, registerFunction, unRegisterFunction } from "../../src/functionsfactory";
import { SurveyModel } from "../../src/survey";

export default QUnit.module("Expressions Function Cache Tests");

QUnit.test("Simple caching by parameter", (assert) => {
  let counter = 0;
  function func1(params: any[]): any {
    counter++;
    return params[0] + 10;
  }
  registerFunction("func1", func1, false, true);
  var runner = new ExpressionRunner("func1({val})");
  const values = { val: 5 };
  assert.equal(runner.runValues(values), 15, "5 + 10 = 15");
  assert.equal(counter, 1, "func1 called one time");
  assert.equal(runner.runValues(values), 15, "5 + 10 = 15");
  assert.equal(counter, 1, "func1 called one time again, the result was taken from cache");
  values.val = 10;
  assert.equal(runner.runValues(values), 20, "10 + 10 = 20");
  assert.equal(counter, 2, "func1 called one more time with new parameter");
  assert.equal(runner.runValues(values), 20, "10 + 10 = 20");
  assert.equal(counter, 2, "func1 called one more time again, the result was taken from cache");
  unRegisterFunction("func1");
});
QUnit.test("Async caching by parameter", (assert) => {
  let resolveFuncs = new Array<(value: any) => void>();
  function func1(params: any[]): any {
    resolveFuncs.push(this.returnResult);
  }
  registerFunction("func1", func1, true, true);
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "expression", name: "exp1", expression: "func1({q1})" }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const exp = survey.getQuestionByName("exp1");
  assert.equal(resolveFuncs.length, 1, "There is one resolve function");
  resolveFuncs[0](15);
  assert.equal(exp.value, 15, "The value is set to 15");
  q1.value = 5;
  assert.equal(resolveFuncs.length, 2, "There is one resolve function");
  resolveFuncs[1](16);
  assert.equal(exp.value, 16, "The value is set to 16");
  q1.value = 6;
  assert.equal(resolveFuncs.length, 3, "There are two resolve functions");
  resolveFuncs[2](18);
  assert.equal(exp.value, 18, "The value is set to 18");
  q1.value = 5;
  assert.equal(resolveFuncs.length, 3, "Take from cache, #1");
  assert.equal(exp.value, 16, "The value is set to 16");
  q1.value = 6;
  assert.equal(resolveFuncs.length, 3, "Take from cache, #2");
  assert.equal(exp.value, 18, "The value is set to 18");

  unRegisterFunction("func1");
});
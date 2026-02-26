import { ExpressionRunner } from "../../src/conditions";
import { FunctionFactory, registerFunction, unregisterFunction } from "../../src/functionsfactory";
import { SurveyModel } from "../../src/survey";

export default QUnit.module("Expressions Function Cache Tests");

QUnit.test("Simple caching by parameter", (assert) => {
  let counter = 0;
  function func1(params: any[]): any {
    counter++;
    return params[0] + 10;
  }
  registerFunction({ name: "func1", func: func1, useCache: true });
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
  unregisterFunction("func1");
});
QUnit.test("Async caching by parameter", (assert) => {
  let resolveFuncs = new Array<(value: any) => void>();
  function func1(params: any[]): any {
    resolveFuncs.push(this.returnResult);
  }
  registerFunction({ name: "func1", func: func1, isAsync: true, useCache: true });
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

  unregisterFunction("func1");
});
QUnit.test("Simple caching by accessing survey values", (assert) => {
  let counter = 0;
  function func1(): any {
    counter ++;
    const q1Val = this.survey.getValue("q1");
    return (q1Val || 0) + 10;
  }
  registerFunction({ name: "func1", func: func1, useCache: true });
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "expression", name: "exp1", expression: "func1()" }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const exp = survey.getQuestionByName("exp1");

  assert.equal(counter, 1, "func1 was not called one time");
  assert.equal(exp.value, 10, "undefined + 10 = 10");

  q1.value = 5;
  assert.equal(counter, 2, "func1 was not called one more time");
  assert.equal(exp.value, 15, "5 + 10 = 15");
  q1.value = 7;
  assert.equal(counter, 3, "func1 was not called one more time");
  assert.equal(exp.value, 17, "7 + 10 = 17");

  q1.value = 5;
  assert.equal(counter, 3, "func1 was not called one more time, the value was taken from cache, #1");
  assert.equal(exp.value, 15, "5 + 10 = 15");

  q1.value = 7;
  assert.equal(counter, 3, "func1 was not called one more time, the value was taken from cache, #2");
  assert.equal(exp.value, 17, "7 + 10 = 17");

  q1.value = 15;
  assert.equal(counter, 4, "func1 was not called with new value");
  assert.equal(exp.value, 25, "15 + 10 = 25");

  q1.value = 5;
  assert.equal(counter, 4, "func1 was not called one more time, the value was taken from cache, #3");
  assert.equal(exp.value, 15, "5 + 10 = 15");

  unregisterFunction("func1");
});
QUnit.test("Simple caching by accessing survey values & variables", (assert) => {
  let counter = 0;
  function func1(): any {
    counter ++;
    const q1Val = this.survey.getValue("q1");
    const var1 = this.survey.getVariable("var1");
    return (q1Val || 0) + (var1 || 0) + 10;
  }
  registerFunction({ name: "func1", func: func1, useCache: true });
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "expression", name: "exp1", expression: "func1()" }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const exp = survey.getQuestionByName("exp1");

  assert.equal(counter, 1, "func1 was not called one time");
  assert.equal(exp.value, 10, "undefined + 10 = 10");

  q1.value = 5;
  assert.equal(counter, 2, "func1 was not called one more time");
  assert.equal(exp.value, 15, "5 + 10 = 15");
  survey.setVariable("var1", 2);
  assert.equal(counter, 3, "func1 was not called one more time");
  assert.equal(exp.value, 17, "5 + 2 + 10 = 17");

  survey.setVariable("var1", 3);
  assert.equal(counter, 4, "func1 was not called one more time");
  assert.equal(exp.value, 18, "5 + 3 + 10 = 18");

  survey.setVariable("var1", 2);
  assert.equal(counter, 4, "func1 was not called one more time, the value was taken from cache, #1");
  assert.equal(exp.value, 17, "5 + 2 + 10 = 17");

  q1.value = 7;
  assert.equal(counter, 5, "call func1 with new q1 value");
  assert.equal(exp.value, 19, "7 + 2 + 10 = 19");

  survey.setVariable("var1", 3);
  assert.equal(counter, 6, "call func1 with new var1 value");
  assert.equal(exp.value, 20, "7 + 3 + 10 = 20");

  q1.value = 5;
  assert.equal(counter, 6, "func1 was not called one more time, the value was taken from cache, #3");
  assert.equal(exp.value, 18, "5 + 3 + 10 = 18");

  survey.setVariable("var1", 2);
  assert.equal(counter, 6, "func1 was not called one more time, the value was taken from cache, #4");
  assert.equal(exp.value, 17, "5 + 2 + 10 = 17");

  unregisterFunction("func1");
});
QUnit.test("Simple caching by accessing question value", (assert) => {
  let counter = 0;
  function func1(): any {
    counter ++;
    const q1 = this.survey.getQuestionByName("q1");
    const q1Val = q1.value;
    return (q1Val || 0) + 10;
  }
  registerFunction({ name: "func1", func: func1, useCache: true });
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "expression", name: "exp1", expression: "func1()" }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const exp = survey.getQuestionByName("exp1");

  assert.equal(counter, 1, "func1 was not called one time");
  assert.equal(exp.value, 10, "undefined + 10 = 10");

  q1.value = 5;
  assert.equal(counter, 2, "func1 was not called one more time");
  assert.equal(exp.value, 15, "5 + 10 = 15");
  q1.value = 7;
  assert.equal(counter, 3, "func1 was not called one more time");
  assert.equal(exp.value, 17, "7 + 10 = 17");

  q1.value = 5;
  assert.equal(counter, 3, "func1 was not called one more time, the value was taken from cache, #1");
  assert.equal(exp.value, 15, "5 + 10 = 15");

  q1.value = 7;
  assert.equal(counter, 3, "func1 was not called one more time, the value was taken from cache, #2");
  assert.equal(exp.value, 17, "7 + 10 = 17");

  q1.value = 15;
  assert.equal(counter, 4, "func1 was not called with new value");
  assert.equal(exp.value, 25, "15 + 10 = 25");

  q1.value = 5;
  assert.equal(counter, 4, "func1 was not called one more time, the value was taken from cache, #3");
  assert.equal(exp.value, 15, "5 + 10 = 15");

  unregisterFunction("func1");
});
QUnit.test("Caching by accessing elements values & properties", (assert) => {
  let counter = 0;
  function func1(): any {
    counter ++;
    const q1 = this.survey.getQuestionByName("q1");
    const q2 = this.survey.getQuestionByName("q2");
    const q1Val = q1.value;
    const q2Val = q2.value;
    const val = q1.isVisible ? q1Val : q2Val;
    return (val || 0) + 10;
  }
  registerFunction({ name: "func1", func: func1, useCache: true });
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" },
      { type: "expression", name: "exp1", expression: "func1()" }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  const exp = survey.getQuestionByName("exp1");

  assert.equal(counter, 1, "func1 was not called one time");
  assert.equal(exp.value, 10, "undefined + 10 = 10");
  q1.value = 5;
  q2.value = 20;
  assert.equal(counter, 3, "calls two more times");
  assert.equal(exp.value, 15, "5 + 10 = 15");
  q1.visible = false;
  q1.value = 7;
  assert.equal(counter, 4, "calls one more time");
  assert.equal(exp.value, 30, "20 + 10 = 30");

  q1.visible = true;
  assert.equal(counter, 4, "question visibility changed");
  q1.value = 5;
  assert.equal(counter, 4, "func1 was not called one more time, the value was taken from cache, #1");
  assert.equal(exp.value, 15, "5 + 10 = 15");

  q1.visible = false;
  q1.value = 7;
  assert.equal(counter, 4, "func1 was not called one more time, the value was taken from cache, #2");
  assert.equal(exp.value, 30, "20 + 10 = 30");

  unregisterFunction("func1");
});
QUnit.test("Do not cache surveyjs objects", (assert) => {
  function func1(): any {
    const page = this.survey.pages[0];
    const questions = page.questions;
    const val1 = questions[0].value;
    return (val1 || 0) + 10;
  }
  registerFunction({ name: "func1", func: func1, useCache: true });
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" },
      { type: "expression", name: "exp1", expression: "func1()" }
    ]
  });
  FunctionFactory.Instance.clearCache();
  const q1 = survey.getQuestionByName("q1");
  const exp = survey.getQuestionByName("exp1");
  q1.value = 5;
  assert.equal(exp.value, 15, "5 + 10 = 15");

  const cache = FunctionFactory.Instance["functionCache"]["func1"];
  assert.equal(cache.length, 1, "There is one survey cached value");
  const item = cache[0];
  assert.equal(item.surveyValues.length, 0, "There is no survey cached value item");
  assert.equal(item.parameters.length, 0, "There is no parameters in cache");
  assert.equal(item.objectValues.length, 1, "There is one object cached value item");
  const objItem = item.objectValues[0];
  assert.equal(objItem.obj.name, "q1", "The cached object is q1");
  assert.equal(objItem.name, "value", "The cached property name is value");
  assert.equal(objItem.value, 5, "The cached value is 5");

  unregisterFunction("func1");
});
QUnit.test("useCache by default with async function", (assert) => {
  let resolveFuncs = new Array<(value: any) => void>();
  function func1(params: any[]): any {
    resolveFuncs.push(this.returnResult);
  }
  registerFunction({ name: "func1", func: func1, isAsync: true });
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

  unregisterFunction("func1");
});
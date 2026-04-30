import { ExpressionRunner } from "../../src/expressions/expressionRunner";
import { FunctionFactory, registerFunction, unregisterFunction } from "../../src/functionsfactory";
import { SurveyModel } from "../../src/survey";

import { describe, test, expect } from "vitest";
describe("Expressions Function Cache Tests", () => {
  test("Simple caching by parameter", () => {
    let counter = 0;
    function func1(params: any[]): any {
      counter++;
      return params[0] + 10;
    }
    registerFunction({ name: "func1", func: func1, useCache: true });
    var runner = new ExpressionRunner("func1({val})");
    const values = { val: 5 };
    expect(runner.runValues(values), "5 + 10 = 15").toLooseEqual(15);
    expect(counter, "func1 called one time").toLooseEqual(1);
    expect(runner.runValues(values), "5 + 10 = 15").toLooseEqual(15);
    expect(counter, "func1 called one time again, the result was taken from cache").toLooseEqual(1);
    values.val = 10;
    expect(runner.runValues(values), "10 + 10 = 20").toLooseEqual(20);
    expect(counter, "func1 called one more time with new parameter").toLooseEqual(2);
    expect(runner.runValues(values), "10 + 10 = 20").toLooseEqual(20);
    expect(counter, "func1 called one more time again, the result was taken from cache").toLooseEqual(2);
    unregisterFunction("func1");
  });
  test("Async caching by parameter", () => {
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
    expect(resolveFuncs.length, "There is one resolve function").toLooseEqual(1);
    resolveFuncs[0](15);
    expect(exp.value, "The value is set to 15").toLooseEqual(15);
    q1.value = 5;
    expect(resolveFuncs.length, "There is one resolve function").toLooseEqual(2);
    resolveFuncs[1](16);
    expect(exp.value, "The value is set to 16").toLooseEqual(16);
    q1.value = 6;
    expect(resolveFuncs.length, "There are two resolve functions").toLooseEqual(3);
    resolveFuncs[2](18);
    expect(exp.value, "The value is set to 18").toLooseEqual(18);
    q1.value = 5;
    expect(resolveFuncs.length, "Take from cache, #1").toLooseEqual(3);
    expect(exp.value, "The value is set to 16").toLooseEqual(16);
    q1.value = 6;
    expect(resolveFuncs.length, "Take from cache, #2").toLooseEqual(3);
    expect(exp.value, "The value is set to 18").toLooseEqual(18);

    unregisterFunction("func1");
  });
  test("Simple caching by accessing survey values", () => {
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

    expect(counter, "func1 was not called one time").toLooseEqual(1);
    expect(exp.value, "undefined + 10 = 10").toLooseEqual(10);

    q1.value = 5;
    expect(counter, "func1 was not called one more time").toLooseEqual(2);
    expect(exp.value, "5 + 10 = 15").toLooseEqual(15);
    q1.value = 7;
    expect(counter, "func1 was not called one more time").toLooseEqual(3);
    expect(exp.value, "7 + 10 = 17").toLooseEqual(17);

    q1.value = 5;
    expect(counter, "func1 was not called one more time, the value was taken from cache, #1").toLooseEqual(3);
    expect(exp.value, "5 + 10 = 15").toLooseEqual(15);

    q1.value = 7;
    expect(counter, "func1 was not called one more time, the value was taken from cache, #2").toLooseEqual(3);
    expect(exp.value, "7 + 10 = 17").toLooseEqual(17);

    q1.value = 15;
    expect(counter, "func1 was not called with new value").toLooseEqual(4);
    expect(exp.value, "15 + 10 = 25").toLooseEqual(25);

    q1.value = 5;
    expect(counter, "func1 was not called one more time, the value was taken from cache, #3").toLooseEqual(4);
    expect(exp.value, "5 + 10 = 15").toLooseEqual(15);

    unregisterFunction("func1");
  });
  test("Simple caching by accessing survey values & variables", () => {
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

    expect(counter, "func1 was not called one time").toLooseEqual(1);
    expect(exp.value, "undefined + 10 = 10").toLooseEqual(10);

    q1.value = 5;
    expect(counter, "func1 was not called one more time").toLooseEqual(2);
    expect(exp.value, "5 + 10 = 15").toLooseEqual(15);
    survey.setVariable("var1", 2);
    expect(counter, "func1 was not called one more time").toLooseEqual(3);
    expect(exp.value, "5 + 2 + 10 = 17").toLooseEqual(17);

    survey.setVariable("var1", 3);
    expect(counter, "func1 was not called one more time").toLooseEqual(4);
    expect(exp.value, "5 + 3 + 10 = 18").toLooseEqual(18);

    survey.setVariable("var1", 2);
    expect(counter, "func1 was not called one more time, the value was taken from cache, #1").toLooseEqual(4);
    expect(exp.value, "5 + 2 + 10 = 17").toLooseEqual(17);

    q1.value = 7;
    expect(counter, "call func1 with new q1 value").toLooseEqual(5);
    expect(exp.value, "7 + 2 + 10 = 19").toLooseEqual(19);

    survey.setVariable("var1", 3);
    expect(counter, "call func1 with new var1 value").toLooseEqual(6);
    expect(exp.value, "7 + 3 + 10 = 20").toLooseEqual(20);

    q1.value = 5;
    expect(counter, "func1 was not called one more time, the value was taken from cache, #3").toLooseEqual(6);
    expect(exp.value, "5 + 3 + 10 = 18").toLooseEqual(18);

    survey.setVariable("var1", 2);
    expect(counter, "func1 was not called one more time, the value was taken from cache, #4").toLooseEqual(6);
    expect(exp.value, "5 + 2 + 10 = 17").toLooseEqual(17);

    unregisterFunction("func1");
  });
  test("Simple caching by accessing question value", () => {
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

    expect(counter, "func1 was not called one time").toLooseEqual(1);
    expect(exp.value, "undefined + 10 = 10").toLooseEqual(10);

    q1.value = 5;
    expect(counter, "func1 was not called one more time").toLooseEqual(2);
    expect(exp.value, "5 + 10 = 15").toLooseEqual(15);
    q1.value = 7;
    expect(counter, "func1 was not called one more time").toLooseEqual(3);
    expect(exp.value, "7 + 10 = 17").toLooseEqual(17);

    q1.value = 5;
    expect(counter, "func1 was not called one more time, the value was taken from cache, #1").toLooseEqual(3);
    expect(exp.value, "5 + 10 = 15").toLooseEqual(15);

    q1.value = 7;
    expect(counter, "func1 was not called one more time, the value was taken from cache, #2").toLooseEqual(3);
    expect(exp.value, "7 + 10 = 17").toLooseEqual(17);

    q1.value = 15;
    expect(counter, "func1 was not called with new value").toLooseEqual(4);
    expect(exp.value, "15 + 10 = 25").toLooseEqual(25);

    q1.value = 5;
    expect(counter, "func1 was not called one more time, the value was taken from cache, #3").toLooseEqual(4);
    expect(exp.value, "5 + 10 = 15").toLooseEqual(15);

    unregisterFunction("func1");
  });
  test("Caching by accessing elements values & properties", () => {
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

    expect(counter, "func1 was not called one time").toLooseEqual(1);
    expect(exp.value, "undefined + 10 = 10").toLooseEqual(10);
    q1.value = 5;
    q2.value = 20;
    expect(counter, "calls two more times").toLooseEqual(3);
    expect(exp.value, "5 + 10 = 15").toLooseEqual(15);
    q1.visible = false;
    q1.value = 7;
    expect(counter, "calls one more time").toLooseEqual(4);
    expect(exp.value, "20 + 10 = 30").toLooseEqual(30);

    q1.visible = true;
    expect(counter, "question visibility changed").toLooseEqual(4);
    q1.value = 5;
    expect(counter, "func1 was not called one more time, the value was taken from cache, #1").toLooseEqual(4);
    expect(exp.value, "5 + 10 = 15").toLooseEqual(15);

    q1.visible = false;
    q1.value = 7;
    expect(counter, "func1 was not called one more time, the value was taken from cache, #2").toLooseEqual(4);
    expect(exp.value, "20 + 10 = 30").toLooseEqual(30);

    unregisterFunction("func1");
  });
  test("Do not cache surveyjs objects", () => {
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
    expect(exp.value, "5 + 10 = 15").toLooseEqual(15);

    const cache = FunctionFactory.Instance["functionCache"]["func1"];
    expect(cache.length, "There is one survey cached value").toLooseEqual(1);
    const item = cache[0];
    expect(item.surveyValues.length, "There is no survey cached value item").toLooseEqual(0);
    expect(item.parameters.length, "There is no parameters in cache").toLooseEqual(0);
    expect(item.objectValues.length, "There is one object cached value item").toLooseEqual(1);
    const objItem = item.objectValues[0];
    expect(objItem.obj.name, "The cached object is q1").toLooseEqual("q1");
    expect(objItem.name, "The cached property name is value").toLooseEqual("value");
    expect(objItem.value, "The cached value is 5").toLooseEqual(5);

    unregisterFunction("func1");
  });
  test("addToCache does not crash when properties.surveyCachedValues is undefined (nested cached functions)", () => {
    function innerFunc(params: any[]): any {
      return params[0] + 1;
    }
    function outerFunc(params: any[]): any {
      return FunctionFactory.Instance.run("innerFunc_nested", params, { survey: this.survey }, params);
    }
    registerFunction({ name: "innerFunc_nested", func: innerFunc, useCache: true });
    registerFunction({ name: "outerFunc_nested", func: outerFunc, useCache: true });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "expression", name: "exp1", expression: "outerFunc_nested({q1})" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const exp = survey.getQuestionByName("exp1");
    q1.value = 5;
    expect(exp.value, "Nested cached function call should not crash, 5 + 1 = 6").toLooseEqual(6);
    q1.value = 10;
    expect(exp.value, "Second call works correctly, 10 + 1 = 11").toLooseEqual(11);

    unregisterFunction("innerFunc_nested");
    unregisterFunction("outerFunc_nested");
  });
  test("useCache by default with async function", () => {
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
    expect(resolveFuncs.length, "There is one resolve function").toLooseEqual(1);
    resolveFuncs[0](15);
    expect(exp.value, "The value is set to 15").toLooseEqual(15);
    q1.value = 5;
    expect(resolveFuncs.length, "There is one resolve function").toLooseEqual(2);
    resolveFuncs[1](16);
    expect(exp.value, "The value is set to 16").toLooseEqual(16);
    q1.value = 6;
    expect(resolveFuncs.length, "There are two resolve functions").toLooseEqual(3);
    resolveFuncs[2](18);
    expect(exp.value, "The value is set to 18").toLooseEqual(18);
    q1.value = 5;
    expect(resolveFuncs.length, "Take from cache, #1").toLooseEqual(3);
    expect(exp.value, "The value is set to 16").toLooseEqual(16);
    q1.value = 6;
    expect(resolveFuncs.length, "Take from cache, #2").toLooseEqual(3);
    expect(exp.value, "The value is set to 18").toLooseEqual(18);

    unregisterFunction("func1");
  });
});

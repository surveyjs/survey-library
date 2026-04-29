import { parse } from "../../src/expressions/expressionParser";
import { ConditionRunner } from "../../src/conditions/conditionRunner";
import { ExpressionRunner } from "../../src/expressions/expressionRunner";
import { ConditionsParser } from "../../src/conditions/conditionsParser";
import { ConsoleWarnings } from "../../src/console-warnings";
import {
  Const,
  BinaryOperand,
  Operand,
} from "../../src/expressions/expressions";

import { ProcessValue, VariableGetterContext } from "../../src/conditions/conditionProcessValue";
import { FunctionFactory } from "../../src/functionsfactory";
import { settings } from "../../src/settings";
import { Helpers } from "../../src/helpers";

import { describe, test, expect } from "vitest";
describe("Expressions", () => {
  test("Logic Operand", () => {
    var expression = parse("true");
    expect(expression.toString()).toLooseEqual("true");
    expect(expression.evaluate()).toLooseEqual(true);

    expression = parse("true || true && false");
    expect(expression.evaluate()).toLooseEqual(true);

    expression = parse("false && true && false");
    expect(expression.evaluate()).toLooseEqual(false);

    expression = parse("false || true || false || false || true || true");
    expect(expression.toString()).toLooseEqual("(((((false or true) or false) or false) or true) or true)");
    expect(expression.evaluate()).toLooseEqual(true);
  });

  test("Comparable Operand", () => {
    var expression = parse("1 = 1");
    expect(expression.evaluate()).toLooseEqual(true);

    expression = parse("1 != 1");
    expect(expression.evaluate()).toLooseEqual(false);

    expression = parse("false || 1 > -101");
    expect(expression.toString()).toLooseEqual("(false or (1 > -101))");
    expect(expression.evaluate()).toLooseEqual(true);

    expression = parse("true && 5 <= 12 || !(5 > 2)");
    expect(expression.toString()).toLooseEqual("((true and (5 <= 12)) or ! (5 > 2))");
    expect(expression.evaluate()).toLooseEqual(true);
  });

  test("Arithmetic Operand", () => {
    var expression = parse("2 + 2 * 2");
    expect(expression.evaluate()).toLooseEqual(6);

    expression = parse("!(2 + 2 * 2 notequal 6)");
    expect(expression.evaluate()).toLooseEqual(true);

    expression = parse("2 + 2 < 3 + 3 && 5 < 10");
    expect(expression.toString()).toLooseEqual("(((2 + 2) < (3 + 3)) and (5 < 10))");
    expect(expression.evaluate()).toLooseEqual(true);
  });

  test("Concat strings", () => {
    var expression = parse("'ab' + 'cd'");
    expect(expression.evaluate()).toLooseEqual("abcd");
    expression = parse("'ab' + ' ' + 'cd'");
    expect(expression.evaluate()).toLooseEqual("ab cd");
    expression = parse("1 + 'a' + 2");
    expect(expression.evaluate()).toLooseEqual("1a2");
    expression = parse("1 + ' ' + 2");
    expect(expression.evaluate()).toLooseEqual("1 2");
    expression = parse('"p1. " + "p2"');
    expect(expression.evaluate()).toLooseEqual("p1. p2");
  });

  test("Variable Const", () => {
    var varOperand = parse("'Im-Variable'");
    expect(varOperand.toString()).toLooseEqual("'Im-Variable'");
    expect(varOperand.evaluate()).toLooseEqual("Im-Variable");

    var constOperand = parse("{ImConst}");
    expect(constOperand.toString()).toLooseEqual("{ImConst}");

    var processValue = new ProcessValue(new VariableGetterContext({ ImConst: 7 }));
    expect(constOperand.evaluate(processValue)).toLooseEqual(7);
  });

  function checkItemCondition(op: string, expectedOp: string): boolean {
    let expr = new ConditionsParser().createCondition("'a'" + op + "2");
    return (<any>expr).operatorName === expectedOp;
  }

  test("Parse item conditions", () => {
  //equal
    expect(checkItemCondition("=", "equal"), "= is equal").toBeTruthy();
    expect(checkItemCondition("==", "equal"), "== is equal").toBeTruthy();
    expect(checkItemCondition(" Equal ", "equal"), "equal is equal").toBeTruthy();
    expect(checkItemCondition(" equals ", "equal"), "equals is equal").toBeTruthy();
    //not equal
    expect(checkItemCondition("<>", "notequal"), "<> is notequal").toBeTruthy();
    expect(checkItemCondition("!=", "notequal"), "!= is notequal").toBeTruthy();
    expect(checkItemCondition(" notequals ", "notequal"), "notequals is notequal").toBeTruthy();
    expect(checkItemCondition(" NotEqual ", "notequal"), "NotEqual is notequal").toBeTruthy();
    //greater
    expect(checkItemCondition(">", "greater"), "> is greater").toBeTruthy();
    expect(checkItemCondition(" Greater ", "greater"), "Greater is greater").toBeTruthy();
    //less
    expect(checkItemCondition("<", "less"), "< is less").toBeTruthy();
    expect(checkItemCondition(" Less ", "less"), "Less is less").toBeTruthy();
    //greaterorequal
    expect(checkItemCondition(">=", "greaterorequal"), ">= is greaterorequal").toBeTruthy();
    expect(checkItemCondition("=>", "greaterorequal"), "=> is greaterorequal").toBeTruthy();
    expect(checkItemCondition(" GreaterOrEqual ", "greaterorequal"), "GreaterorEqual is greaterorequal").toBeTruthy();
    //lessorequal
    expect(checkItemCondition("<=", "lessorequal"), "<= is lessorequal").toBeTruthy();
    expect(checkItemCondition("=<", "lessorequal"), "=< is lessorequal").toBeTruthy();
    expect(checkItemCondition(" LessOrEqual ", "lessorequal"), "LessOrEqual is lessorequal").toBeTruthy();
    //contains
    expect(checkItemCondition(" Contains ", "contains"), "Contains is contains").toBeTruthy();
    expect(checkItemCondition(" contain ", "contains"), "contain is contains").toBeTruthy();
    expect(checkItemCondition("*=", "contains"), "*= is contains").toBeTruthy();
    //notcontains
    expect(checkItemCondition(" NotContains ", "notcontains"), "NotContains is notcontains").toBeTruthy();
    expect(checkItemCondition(" NotContain ", "notcontains"), "NotContain is notcontains").toBeTruthy();
  });

  test("Condition: without right condition", () => {
    expect(parse("'a' empty"), "empty").toBeTruthy();
    expect(parse("'a' notempty"), "notempty").toBeTruthy();

    expect(parse("{row.user_id} notempty and {roles} notempty")).toBeTruthy();
  });

  test("Condition: on item - no spaces", () => {
    var expr = parse("5>2");
    expect(expr.evaluate()).toLooseEqual(true);
  });

  test("[] notcontains 0 returns false #10869", () => {
    let runner = new ConditionRunner("{a} notcontains 0");
    expect(runner.runValues({ a: [] }), "[] notcontains 0").toLooseEqual(true);
    expect(runner.runValues({ a: [1, 2] }), "[1,2] notcontains 0").toLooseEqual(true);
    expect(runner.runValues({ a: [0, 1] }), "[0,1] notcontains 0").toLooseEqual(false);

    runner = new ConditionRunner("{a} notcontains '0'");
    expect(runner.runValues({ a: [] }), "[] notcontains '0'").toLooseEqual(true);
    expect(runner.runValues({ a: [1, 2] }), "[1,2] notcontains '0'").toLooseEqual(true);
    expect(runner.runValues({ a: [0, 1] }), "[0,1] notcontains '0'").toLooseEqual(false);
  });

  test("Run one condition", () => {
    var runner = new ConditionRunner("{a} > 5");
    var values = { a: 6 };
    expect(runner.runValues(values), "6 > 5").toLooseEqual(true);
    values = { a: 5 };
    expect(runner.runValues(values), "5 > 5").toLooseEqual(false);
    var values2 = { b: 5 };
    expect(runner.runValues(values2), "undefined > 5").toLooseEqual(false);
  });

  test("Run complex condition", () => {
    var runner = new ConditionRunner(
      "{age} >= 21 and ({sex} = 'male' or {kids} > 1)"
    );
    var values = { age: 21, sex: "male", kids: 1 };
    expect(runner.runValues(values), "21 >= 21 and (male = male or 1 > 1)").toLooseEqual(true);
    var values = { age: 21, sex: "female", kids: 1 };
    expect(runner.runValues(values), "21 >= 21 and (male = female or 1 > 1)").toLooseEqual(false);
    var values = { age: 21, sex: "female", kids: 2 };
    expect(runner.runValues(values), "21 >= 21 and (male = female or 2 > 1)").toLooseEqual(true);
    var values = { age: 20, sex: "male", kids: 2 };
    expect(runner.runValues(values), "20 >= 21 and (male = male or 2 > 1)").toLooseEqual(false);
  });

  test("Run condition with nested properties", () => {
    var runner = new ConditionRunner("{age.min} >= 35 and ({age.max} <= 80");
    var values = { age: { min: 36, max: 40 } };
    expect(runner.runValues(values), "min > 35 max < 80").toLooseEqual(true);
    values.age.min = 21;
    expect(runner.runValues(values), "min < 35 max < 80").toLooseEqual(false);
  });

  test("Condition check #303", () => {
    var runner = new ConditionRunner(
      "({question-fruit} = 'fruit-apple' and {question-apple-variety} = 'apple-variety-red-delicious') or ({question-fruit} = 'fruit-orange' and {question-orange-variety} = 'orange-variety-blood')"
    );
    var values = {};
    expect(runner.runValues(values), "nothing was set").toLooseEqual(false);
    values = {
      "question-fruit": "fruit-apple",
      "question-apple-variety": "apple-variety-red-delicious",
    };
    expect(runner.runValues(values), "The first part is correct").toLooseEqual(true);
    values["question-fruit"] = "fruit-orange";
    expect(runner.runValues(values), "the value is incorrect").toLooseEqual(false);
    values["question-orange-variety"] = "orange-variety-blood";
    expect(runner.runValues(values), "The second part is correct").toLooseEqual(true);
  });

  test("Condition check empty for undefined variables #323", () => {
    var runner = new ConditionRunner("{var1} empty");
    var values = {};
    expect(runner.runValues(values), "it is empty").toLooseEqual(true);
    values = { var1: 1 };
    expect(runner.runValues(values), "it is not empty").toLooseEqual(false);
  });

  test("Condition check for undefined variables #323", () => {
    var runner = new ConditionRunner("{var1} < 3 or {var1} empty");
    var values = {};
    expect(runner.runValues(values), "empty should work").toLooseEqual(true);
    values = { var1: 1 };
    expect(runner.runValues(values), "1 < 3").toLooseEqual(true);
    values = { var1: 5 };
    expect(runner.runValues(values), "5 > 3").toLooseEqual(false);
  });

  test("Check non equal, #377", () => {
    var runner = new ConditionRunner("{var1} != 3");
    var values = {};
    expect(runner.runValues(values), "empty should give true").toLooseEqual(true);
    values = { var1: 1 };
    expect(runner.runValues(values), "1 != 3").toLooseEqual(true);
    values = { var1: 3 };
    expect(runner.runValues(values), "3 == 3").toLooseEqual(false);
  });

  test("Condition check for undefined #518", () => {
    var runner = new ConditionRunner("{var1} == undefined");
    var values = {};
    expect(runner.runValues(values), "undefined should work").toLooseEqual(true);
    values = { var1: undefined };
    expect(runner.runValues(values), "undefined should work").toLooseEqual(true);
    values = { var1: "a" };
    expect(runner.runValues(values), "string is not undefined").toLooseEqual(false);

    runner = new ConditionRunner("{var1} != undefined");
    values = {};
    expect(runner.runValues(values), "undefined should work").toLooseEqual(false);
    values = { var1: undefined };
    expect(runner.runValues(values), "undefined should work").toLooseEqual(false);
    values = { var1: "a" };
    expect(runner.runValues(values), "string is not undefined").toLooseEqual(true);
  });
  test("Run count function with arrays", () => {
    var runner = new ExpressionRunner("count({var1})");
    var values = { var1: [2, 5], var2: 3 };
    expect(runner.runValues(values), "two rows").toLooseEqual(2);
  });

  test("Run sum function", () => {
    var runner = new ExpressionRunner("sum({var1},{var2},{var3},{var4})");
    var values = { var1: 2, var2: 3, var3: 4, var4: 5 };
    expect(runner.runValues(values), "2 + 3 + 4 + 5 == 14").toLooseEqual(14);
    values.var1 = 1;
    expect(runner.runValues(values), "1 + 3 + 4 + 5 == 13").toLooseEqual(13);
  });

  test("Run sum function with arrays, Bug #1808", () => {
    var runner = new ExpressionRunner("sum({var1},{var2})");
    var values = { var1: [2, 5], var2: 3 };
    expect(runner.runValues(values), "2 + 5 + 3 == 10").toLooseEqual(10);
  });
  test("Run sum function with arrays, convert values from string to value", () => {
    var runner = new ExpressionRunner("sum({var1},{var2})");
    var values = { var1: ["2", "5"], var2: 3 };
    expect(runner.runValues(values), "2 + 5 + 3 == 10").toLooseEqual(10);
  });

  test("Run min function", () => {
    var runner = new ExpressionRunner("min({var1},{var2})");
    var values = { var1: [4, 2, 5], var2: 3 };
    expect(runner.runValues(values), "4, 2, 5, 3, min is 2").toLooseEqual(2);
  });

  test("Run max function", () => {
    var runner = new ExpressionRunner("max({var1},{var2})");
    var values = { var1: [4, 2, 5, 3], var2: 3 };
    expect(runner.runValues(values), "4, 2, 5, 3, max is 5").toLooseEqual(5);
  });

  test("Run min/max functions with zeros, Bug #2229", () => {
    var runner = new ExpressionRunner("min({var1},{var2})");
    var values = { var1: 0, var2: 3 };
    expect(runner.runValues(values), "0, 3, min is 0").toLooseEqual(0);
    runner = new ExpressionRunner("max({var1},{var2})");
    values = { var1: 0, var2: -3 };
    expect(runner.runValues(values), "0, -3, max is 0").toLooseEqual(0);
  });
  test("Run round() function without precision", () => {
    const runner = new ExpressionRunner("round({num})");
    var values = { num: 0.5 };
    expect(runner.runValues(values), "0.5 is rounded to 1").toLooseEqual(1);
    values = { num: -0.5 };
    expect(runner.runValues(values), "-0.5 is rounded to -1").toLooseEqual(-1);
    (<any>values).num = "0.5";
    expect(runner.runValues(values), "A string value \"0.5\" is rounded to a numeric value 1").toEqualValues(1);
    (<any>values).num = "-0.5";
    expect(runner.runValues(values), "A string value \"-0.5\" is rounded to a numeric value -1").toEqualValues(-1);
    (<any>values).num = undefined;
    expect(runner.runValues(values), "The value passed to the round() function is not a number").toEqualValues(NaN);
  });
  test("Run round() function with precision", () => {
    const runner = new ExpressionRunner("round({num}, {precision})");
    var values = { num: 1.005, precision: 2 };
    expect(runner.runValues(values), "1.005 is rounded to 1.01").toLooseEqual(1.01);
    values = { num: 2.175, precision: 2 };
    expect(runner.runValues(values), "2.175 is rounded to 2.18").toLooseEqual(2.18);
    values = { num: 5.015, precision: 2 };
    expect(runner.runValues(values), "5.015 is rounded to 5.02").toLooseEqual(5.02);
    values = { num: 1, precision: 2 };
    expect(runner.runValues(values), "1 is rounded to 1 with precision of 2").toLooseEqual(1);
    values = { num: -1.005, precision: 2 };
    expect(runner.runValues(values), "-1.005 is rounded to -1.01").toLooseEqual(-1.01);
    values = { num: -2.175, precision: 2 };
    expect(runner.runValues(values), "-2.175 is rounded to -2.18").toLooseEqual(-2.18);
    values = { num: -5.015, precision: 2 };
    expect(runner.runValues(values), "-5.015 is rounded to -5.02").toLooseEqual(-5.02);
    values = { num: -1, precision: 2 };
    expect(runner.runValues(values), "-1 is rounded to -1 with precision of 2").toLooseEqual(-1);
    (<any>values).precision = "test";
    expect(runner.runValues(values), "The precision value passed to the round() function is not a number").toEqualValues(NaN);
  });
  test("Run trunc() function without precision", () => {
    const runner = new ExpressionRunner("trunc({num})");
    var values = { num: 1.5 };
    expect(runner.runValues(values), "1.5 is truncated to 1").toLooseEqual(1);
    values = { num: -1.5 };
    expect(runner.runValues(values), "-1.5 is truncated to -1").toLooseEqual(-1);
    values = { num: -0.5 };
    expect(runner.runValues(values), "-0.5 is truncated to 0").toLooseEqual(0);
    (<any>values).num = "-0.5";
    expect(runner.runValues(values), "A string value \"-0.5\" is truncated to a numeric value 0").toLooseEqual(0);
    (<any>values).num = undefined;
    expect(Number.isNaN(runner.runValues(values)), "The value passed to the trunc() function is not a number").toLooseEqual(true);
  });
  test("Run trunc() function with precision", () => {
    const runner = new ExpressionRunner("trunc({num}, {precision})");
    var values = { num: 1.005, precision: 2 };
    expect(runner.runValues(values), "1.005 is truncated to 1 with precision of 2").toLooseEqual(1);
    values = { num: 2.175, precision: 1 };
    expect(runner.runValues(values), "2.175 is truncated to 2.1 with precision of 1").toLooseEqual(2.1);
    values = { num: 5.015, precision: 2 };
    expect(runner.runValues(values), "5.015 is truncated to 5.01 with precision of 2").toLooseEqual(5.01);
    values = { num: -1.005, precision: 2 };
    expect(runner.runValues(values), "-1.005 is truncated to -1 with precision of 2").toLooseEqual(-1);
    values = { num: -2.175, precision: 1 };
    expect(runner.runValues(values), "-2.175 is truncated to -2.1 with precision of 1").toLooseEqual(-2.1);
    values = { num: -5.015, precision: 2 };
    expect(runner.runValues(values), "-5.015 is truncated to -5.01 with precision of 2").toLooseEqual(-5.01);
    (<any>values).precision = "test";
    expect(runner.runValues(values), "The precision value passed to the truncated() function is not a number").toEqualValues(NaN);
  });
  test("Run age function", () => {
    var runner = new ConditionRunner("age({bithday}) >= 21");
    var values = { bithday: new Date(1974, 1, 1) };
    expect(runner.runValues(values), "true, bithday of 1974 >= 21").toLooseEqual(true);
    var curDate = new Date(Date.now());
    values.bithday = new Date(curDate.getFullYear() - 10, 1, 1);
    expect(runner.runValues(values), "false, the person is 10 years old").toLooseEqual(false);
  });
  test("Run age function, Bug#2562", () => {
    var runner = new ExpressionRunner("age({birthday})");
    var values = { birthday: new Date(1974, 1, 1) };
    var date = new Date(Date.now());
    date.setFullYear(date.getFullYear() - 80);
    values = { birthday: date };
    expect(runner.runValues(values), "80 years old, bithday is today").toLooseEqual(80);
    date = new Date(date.getTime() + 60 * 60 * 24 * 1000);
    values.birthday = date;
    expect(runner.runValues(values), "one day till 80").toLooseEqual(79);
  });
  test("Run dateDiff by years function", () => {
    const runner = new ExpressionRunner("dateDiff({birthday}, {currentDate}, 'years')");
    const values = { birthday: new Date(1974, 10, 10), currentDate: new Date(2014, 11, 11) };
    expect(runner.runValues(values), "Use the second parameter").toLooseEqual(40);
  });
  test("Run age by months function", () => {
    const runner = new ExpressionRunner("age({birthday}, 'months')");
    var date = new Date(Date.now());
    date.setFullYear(date.getFullYear() - 10);
    const values = { birthday: date };
    expect(runner.runValues(values), "10 years old, bithday is today").toLooseEqual(10 * 12);
    date = new Date(date.getTime() + 60 * 60 * 24 * 1000);
    values.birthday = date;
    expect(runner.runValues(values), "9 years + 11 months").toLooseEqual(9 * 12 + 11);
  });
  test("Run dateDiff by months", () => {
    const runner = new ExpressionRunner("dateDiff({birthday}, {currentDate}, 'months')");
    const values = { birthday: new Date(2012, 10, 10), currentDate: new Date(2014, 11, 11) };
    expect(runner.runValues(values), "Use the second parameter, #1").toLooseEqual(2 * 12 + 1);
    values.currentDate = new Date(2014, 11, 9);
    expect(runner.runValues(values), "Use the second parameter, #2").toLooseEqual(2 * 12);
  });
  test("Run dateDiff by days", () => {
    var runner = new ExpressionRunner("dateDiff({d1}, {d2})");
    var d1 = new Date("2021-01-01");
    var d2 = new Date("2021-02-02");
    const values = { d1: d1, d2: d2 };
    expect(runner.runValues(values), "32 days").toLooseEqual(32);
    (<any>values).d1 = undefined;
    expect(runner.runValues(values), "a value is undefined").toLooseEqual(null);
  });
  test("Run dateDiff by hours", () => {
    const runner = new ExpressionRunner("dateDiff({d1}, {d2}, 'hours')");
    const d1 = new Date("2021-02-02");
    const d2 = new Date("2021-02-03");
    d1.setHours(1, 0, 0, 0);
    d2.setHours(12, 0, 0, 0);
    const values = { d1: d1, d2: d2 };
    expect(runner.runValues(values), "35 hours").toLooseEqual(24 + 11);
    (<any>values).d1 = undefined;
    expect(runner.runValues(values), "a value is undefined").toLooseEqual(null);
  });
  test("Run dateDiff by minutes", () => {
    const runner = new ExpressionRunner("dateDiff({d1}, {d2}, 'minutes')");
    const d1 = new Date("2021-02-01");
    const d2 = new Date("2021-02-02");
    d1.setHours(1, 10, 0, 0);
    d2.setHours(12, 25, 0, 0);
    const values = { d1: d1, d2: d2 };
    expect(runner.runValues(values), "hours").toLooseEqual((24 + 11) * 60 + 15);
    (<any>values).d1 = undefined;
    expect(runner.runValues(values), "a value is undefined").toLooseEqual(null);
  });
  test("Run dateDiff by minutes Bug#10177", () => {
    const runner = new ExpressionRunner("dateDiff({d1}, {d2}, 'minutes')");
    const d1 = new Date("2025-07-25T13:00");
    const d2 = new Date("2025-07-25T13:05");
    const values = { d1: d1, d2: d2 };
    expect(runner.runValues(values), "minutes").toLooseEqual(5);
  });
  test("Run dateDiff by seconds #10176", () => {
    const runner = new ExpressionRunner("dateDiff({d1}, {d2}, 'seconds')");
    const d1 = new Date("2025-07-25T02:13:48");
    const d2 = new Date("2025-07-25T02:15:05");
    const values = { d1: d1, d2: d2 };
    expect(runner.runValues(values), "seconds").toLooseEqual(77);
  });
  test("Run dateDiff by days across DST boundary Bug#11029", () => {
    const savedOnDateCreated = settings.onDateCreated;
    settings.onDateCreated = (newDate: Date, reason: string, val: any): Date => {
    // Emulate US Central Time (CST=UTC-6, CDT=UTC-5)
      const year = newDate.getFullYear();
      const month = newDate.getMonth();
      const day = newDate.getDate();
      let isDST = false;
      if (month > 2 && month < 10) {
        isDST = true;
      } else if (month === 2) {
        const marchFirst = new Date(year, 2, 1).getDay();
        const secondSunday = marchFirst === 0 ? 8 : (7 - marchFirst) + 8;
        isDST = day > secondSunday;
      } else if (month === 10) {
        const novFirst = new Date(year, 10, 1).getDay();
        const firstSunday = novFirst === 0 ? 1 : (7 - novFirst) + 1;
        isDST = day <= firstSunday;
      }
      const offsetHours = isDST ? 5 : 6;
      return new Date(Date.UTC(year, month, day, offsetHours, 0, 0, 0));
    };
    const runner = new ExpressionRunner("dateDiff({d1}, {d2}, 'days')");
    const values: any = { d1: "2026-03-15", d2: "2027-03-14" };
    expect(runner.runValues(values), "days between 2026-03-15 and 2027-03-14").toLooseEqual(364);
    values.d2 = "2027-03-15";
    expect(runner.runValues(values), "days between 2026-03-15 and 2027-03-15").toLooseEqual(365);
    settings.onDateCreated = savedOnDateCreated;
  });
  test("Run dateAdd() for days", () => {
    const d1 = new Date("2021-01-01");
    const values = { d1: d1 };
    var runner = new ExpressionRunner("dateAdd({d1}, 32)");
    expect(runner.runValues(values), "February 2, 2021").toEqualValues(new Date("2021-02-02"));
    runner = new ExpressionRunner("dateAdd({d1}, -10)");
    expect(runner.runValues(values), "December 22, 2020").toEqualValues(new Date("2020-12-22"));
    (<any>values).d1 = undefined;
    expect(runner.runValues(values), "a value is undefined").toLooseEqual(null);
  });
  test("Run dateAdd() for months", () => {
    const d1 = new Date("2021-01-01");
    const values = { d1: d1 };
    var runner = new ExpressionRunner("dateAdd({d1}, 13, 'months')");
    expect(runner.runValues(values), "February 1, 2022").toEqualValues(new Date("2022-02-01"));
    runner = new ExpressionRunner("dateAdd({d1}, -2, 'months')");
    expect(runner.runValues(values), "November 1, 2020").toEqualValues(new Date("2020-11-01"));
    (<any>values).d1 = undefined;
    expect(runner.runValues(values), "a value is undefined").toLooseEqual(null);
  });
  test("Run dateAdd() for years", () => {
    const d1 = new Date("2020-02-29");
    const values = { d1: d1 };
    var runner = new ExpressionRunner("dateAdd({d1}, 2, 'years')");
    expect(runner.runValues(values), "March 1, 2022").toEqualValues(new Date("2022-03-01"));
    runner = new ExpressionRunner("dateAdd({d1}, -2, 'years')");
    expect(runner.runValues(values), "March 1, 2018").toEqualValues(new Date("2018-03-01"));
    (<any>values).d1 = undefined;
    expect(runner.runValues(values), "a value is undefined").toLooseEqual(null);
  });
  test("Run dateAdd() for hours", () => {
    const d1 = new Date("2026-02-28T00:00:00");
    const values = { d1: d1 };
    var runner = new ExpressionRunner("dateAdd({d1}, 2, 'hours')");
    expect(runner.runValues(values), "Add 2 hours to 2026-02-28T00:00:00").toEqualValues(new Date("2026-02-28T02:00:00"));
    runner = new ExpressionRunner("dateAdd({d1}, -2, 'hours')");
    expect(runner.runValues(values), "Subtract 2 hours from 2026-02-28T00:00:00").toEqualValues(new Date("2026-02-27T22:00:00"));
    runner = new ExpressionRunner("dateAdd({d1}, 48, 'hours')");
    expect(runner.runValues(values), "Add 48 (2 days) hours to 2026-02-28T00:00:00").toEqualValues(new Date("2026-03-02T00:00:00"));
    (<any>values).d1 = undefined;
    expect(runner.runValues(values), "a value is undefined").toLooseEqual(null);
  });
  test("Run dateAdd() for minutes", () => {
    const d1 = new Date("2026-02-28T00:00:00");
    const values = { d1: d1 };
    var runner = new ExpressionRunner("dateAdd({d1}, 2, 'minutes')");
    expect(runner.runValues(values), "Add 2 minutes to 2026-02-28T00:00:00").toEqualValues(new Date("2026-02-28T00:02:00"));
    runner = new ExpressionRunner("dateAdd({d1}, -2, 'minutes')");
    expect(runner.runValues(values), "Subtract 2 minutes from 2026-02-28T00:00:00").toEqualValues(new Date("2026-02-27T23:58:00"));
    runner = new ExpressionRunner("dateAdd({d1}, 48, 'minutes')");
    expect(runner.runValues(values), "Add 48 minutes to 2026-02-28T00:00:00").toEqualValues(new Date("2026-02-28T00:48:00"));
    runner = new ExpressionRunner("dateAdd({d1}, 2880, 'minutes')");
    expect(runner.runValues(values), "Add 2880 (2 days) minutes to 2026-02-28T00:00:00").toEqualValues(new Date("2026-03-02T00:00:00"));
    (<any>values).d1 = undefined;
    expect(runner.runValues(values), "a value is undefined").toLooseEqual(null);
  });
  test("Run dateAdd() for seconds", () => {
    const d1 = new Date("2026-02-28T00:00:00");
    const values = { d1: d1 };
    var runner = new ExpressionRunner("dateAdd({d1}, 2, 'seconds')");
    expect(runner.runValues(values), "Add 2 seconds to 2026-02-28T00:00:00").toEqualValues(new Date("2026-02-28T00:00:02"));
    runner = new ExpressionRunner("dateAdd({d1}, -2, 'seconds')");
    expect(runner.runValues(values), "Subtract 2 seconds from 2026-02-28T00:00:00").toEqualValues(new Date("2026-02-27T23:59:58"));
    runner = new ExpressionRunner("dateAdd({d1}, 48, 'seconds')");
    expect(runner.runValues(values), "Add 48 seconds to 2026-02-28T00:00:00").toEqualValues(new Date("2026-02-28T00:00:48"));
    runner = new ExpressionRunner("dateAdd({d1}, 172800, 'seconds')");
    expect(runner.runValues(values), "Add 172800 (2 days) seconds to 2026-02-28T00:00:00").toEqualValues(new Date("2026-03-02T00:00:00"));
    (<any>values).d1 = undefined;
    expect(runner.runValues(values), "a value is undefined").toLooseEqual(null);
  });
  test("Run getYear() function", () => {
    var runner = new ExpressionRunner("getYear({birthday})");
    var values = { birthday: new Date(1974, 1, 1) };
    expect(runner.runValues(values)).toLooseEqual(1974);
  });

  test("Run currentYear() function", () => {
    var runner = new ExpressionRunner("currentYear()");
    expect(runner.runValues({})).toLooseEqual(new Date().getFullYear());
  });
  function getDateStr(date: Date): string {
    return Helpers.convertDateToString(date);
  }
  test("Run today function", () => {
    var runner = new ExpressionRunner("today()");
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    var todayStr = getDateStr(date).slice(0, 10);
    const runVal = runner.runValues({});
    expect(getDateStr(runVal), "check today").toLooseEqual(todayStr);
  });

  test("Compare date with today", () => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    var condition = new ConditionRunner("{d} < today()");
    const val = { d: yesterday };
    expect(condition.runValues(val), "yesterday < today").toLooseEqual(true);
    val.d = todayDate;
    expect(condition.runValues(val), "todayDate < today").toLooseEqual(false);
    expect(condition.runValues(val), "tomorrow < today").toLooseEqual(false);

    condition = new ConditionRunner("{d} <= today()");
    val.d = yesterday;
    expect(condition.runValues(val), "yesterday <= today").toLooseEqual(true);
    val.d = todayDate;
    expect(condition.runValues(val), "todayDate <= today").toLooseEqual(true);
    val.d = tomorrow;
    expect(condition.runValues(val), "tomorrow <= today").toLooseEqual(false);

    condition = new ConditionRunner("{d} >= today()");
    val.d = yesterday;
    expect(condition.runValues(val), "yesterday >= today").toLooseEqual(false);
    val.d = todayDate;
    expect(condition.runValues(val), "todayDate >= today").toLooseEqual(true);
    val.d = tomorrow;
    expect(condition.runValues(val), "tomorrow >= today").toLooseEqual(true);

    condition = new ConditionRunner("{d} > today()");
    val.d = yesterday;
    expect(condition.runValues(val), "yesterday > today").toLooseEqual(false);
    val.d = todayDate;
    expect(condition.runValues(val), "todayDate > today").toLooseEqual(false);
    val.d = tomorrow;
    expect(condition.runValues(val), "tomorrow > today").toLooseEqual(true);
  });

  test("Compare date with today, settings.storeUtcDates = true", () => {
    settings.storeUtcDates = true;
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    var condition = new ConditionRunner("{d} < today()");
    const val = { d: yesterday };
    expect(condition.runValues(val), "yesterday < today").toLooseEqual(true);
    val.d = todayDate;
    expect(condition.runValues(val), "todayDate < today").toLooseEqual(false);
    expect(condition.runValues(val), "tomorrow < today").toLooseEqual(false);

    condition = new ConditionRunner("{d} <= today()");
    val.d = yesterday;
    expect(condition.runValues(val), "yesterday <= today").toLooseEqual(true);
    val.d = todayDate;
    expect(condition.runValues(val), "todayDate <= today").toLooseEqual(true);
    val.d = tomorrow;
    expect(condition.runValues(val), "tomorrow <= today").toLooseEqual(false);

    condition = new ConditionRunner("{d} >= today()");
    val.d = yesterday;
    expect(condition.runValues(val), "yesterday >= today").toLooseEqual(false);
    val.d = todayDate;
    expect(condition.runValues(val), "todayDate >= today").toLooseEqual(true);
    val.d = tomorrow;
    expect(condition.runValues(val), "tomorrow >= today").toLooseEqual(true);

    condition = new ConditionRunner("{d} > today()");
    val.d = yesterday;
    expect(condition.runValues(val), "yesterday > today").toLooseEqual(false);
    val.d = todayDate;
    expect(condition.runValues(val), "todayDate > today").toLooseEqual(false);
    val.d = tomorrow;
    expect(condition.runValues(val), "tomorrow > today").toLooseEqual(true);
    settings.storeUtcDates = false;
  });

  test("Run age function with empty value", () => {
    var runner = new ConditionRunner("age({bithday}) >= 21");
    var runner2 = new ConditionRunner("age({bithday}) < 21");
    var values = {};
    expect(runner.runValues(values), "1. false, bithday is empty").toLooseEqual(false);
    expect(runner2.runValues(values), "2. false, bithday is empty").toLooseEqual(false);
  });

  test("Run function with properties", () => {
    function isEqual(params: any[]): any {
      return this.propValue == params[0];
    }
    FunctionFactory.Instance.register("isEqual", isEqual);

    var runner = new ConditionRunner("isEqual({val}) == true");
    var values = { val: 3 };
    var properties = { propValue: 3 };
    expect(runner.runValues(values, properties), "3 = 3").toLooseEqual(true);
    properties.propValue = 5;
    expect(runner.runValues(values, properties), "3 != 5").toLooseEqual(false);
    FunctionFactory.Instance.unregister("isEqual");
  });

  test("Support true/false constants, #643", () => {
    var runner = new ConditionRunner("true && {year} >= 21");
    var values = { year: 22 };
    expect(runner.runValues(values), "true, true && 22 >= 21").toLooseEqual(true);
    values = { year: 20 };
    expect(runner.runValues(values), "false, true && 20 >= 21").toLooseEqual(false);

    runner = new ConditionRunner("true or {year} >= 21");
    values = { year: 22 };
    expect(runner.runValues(values), "true, true or 22 >= 21").toLooseEqual(true);
    values = { year: 20 };
    expect(runner.runValues(values), "true, true or 20 >= 21").toLooseEqual(true);

    runner = new ConditionRunner("false && {year} >= 21");
    values = { year: 22 };
    expect(runner.runValues(values), "false, false && 22 >= 21").toLooseEqual(false);
    values = { year: 20 };
    expect(runner.runValues(values), "false, false && 20 >= 21").toLooseEqual(false);

    runner = new ConditionRunner("false or {year} >= 21");
    values = { year: 22 };
    expect(runner.runValues(values), "true, false or 22 >= 21").toLooseEqual(true);
    values = { year: 20 };
    expect(runner.runValues(values), "false, false or 20 >= 21").toLooseEqual(false);
  });

  test("true/false as string, bug#729", () => {
    var runner = new ConditionRunner("{isTrue} = 'true'");
    var values = { isTrue: "true" };
    expect(runner.runValues(values), "true, 'true' = 'true'").toLooseEqual(true);
  });

  test("true/false as constant in the left", () => {
    var runner = new ConditionRunner("true = {isTrue}");
    var values = { isTrue: "false" };
    expect(runner.runValues(values), "false, true = false").toLooseEqual(false);
  });

  test("Constant string with dash (-) doens't work correctly", () => {
    var runner = new ConditionRunner("{a} = '01-01-2018'");
    var values = { a: "01-01" };
    expect(runner.runValues(values), "'01-01' = '01-01-2018'").toLooseEqual(false);
    values.a = "01-01-2018";
    expect(runner.runValues(values), "'01-01-2018' = '01-01-2018'").toLooseEqual(true);
  });

  test("Bug with contains, bug#781", () => {
    var runner = new ConditionRunner("{ResultaatSelectie} contains '1'");
    var values = { ResultaatSelectie: ["1"] };
    expect(runner.runValues(values), "['1'] contains '1'").toLooseEqual(true);
    values = { ResultaatSelectie: ["2"] };
    expect(runner.runValues(values), "['2'] contains '1'").toLooseEqual(false);
  });

  test("Check contains with empty array, Bug #2193", () => {
    var runner = new ConditionRunner("[] contains 'C1'");
    expect(runner.runValues({}), "[] doesn't contain 'C1'").toLooseEqual(false);
    var parser = new ConditionsParser();
    var operand = parser.parseExpression("[] contains 'C1'");
    expect(operand, "The expression parse correctly").toBeTruthy();
  });

  test("contains as equal", () => {
    var runner = new ConditionRunner("{val} contains 'value'");
    var values = { val: "value" };
    expect(runner.runValues(values), "'value' contains 'value'").toLooseEqual(true);
  });

  test("contains for complex object", () => {
    var runner = new ConditionRunner("{val} contains {item}");
    var values = { val: [{ id: 1 }, { id: 2 }], item: { id: 1 } };
    expect(runner.runValues(values), "works with complex object").toLooseEqual(true);
  });
  test("contains for string & respect case-sensetive flag, Bug#10784", () => {
    var runner = new ConditionRunner("'AbcDEf' contains {val}");
    var values = { val: "bC" };
    expect(runner.runValues(values), "caseSensitive is false by default").toLooseEqual(true);
    settings.comparator.caseSensitive = true;
    expect(runner.runValues(values), "caseSensitive is true").toLooseEqual(false);
    settings.comparator.caseSensitive = false;
  });
  test("0 is not an empty value", () => {
    var runner = new ConditionRunner("{val} = 0");
    var values = { val: 0 };
    expect(runner.runValues(values), "0 = 0").toLooseEqual(true);
  });
  test("0 is not an empty value (variable with complex identifier). Bug T2441 (https://surveyjs.answerdesk.io/internal/ticket/details/T2441)", () => {
    var runner = new ConditionRunner("{complexIdentifier} = 0");
    var values = { complexIdentifier: 0 };
    expect(runner.runValues(values), "0 = 0").toLooseEqual(true);
  });
  test("Bug with contains, support string.indexof, bug#831", () => {
    var runner = new ConditionRunner("{str} contains '1'");
    var values = { str: "12345" };
    expect(runner.runValues(values), "'12345' contains '1'").toLooseEqual(true);
    values = { str: "2345" };
    expect(runner.runValues(values), "'2345' contains '1'").toLooseEqual(false);
    runner = new ConditionRunner("{str} notcontains '1'");
    expect(runner.runValues(values), "'2345' notcontains '1'").toLooseEqual(true);
    values = { str: "12345" };
    expect(runner.runValues(values), "'12345' notcontains '1'").toLooseEqual(false);
  });

  test("Bug with contains, bug#1039", () => {
    var runner = new ConditionRunner("{ValueType} contains '3b'");
    var values = { ValueType: ["3b"] };
    expect(runner.runValues(values), "['3b'] contains '3b'").toLooseEqual(true);
    values = { ValueType: ["1"] };
    expect(runner.runValues(values), "['1'] contains '3b'").toLooseEqual(false);
  });

  test("Add support for array for cotains operator, issue#1366", () => {
    var runner = new ConditionRunner("{value} contains ['a', 'b']");
    var values = { value: ["a", "b"] };
    expect(runner.runValues(values), "['a', 'b'] contains ['a', 'b']").toLooseEqual(true);
    values = { value: ["a", "c"] };
    expect(runner.runValues(values), "['a', 'c'] contains ['a', 'b']").toLooseEqual(false);
    values = { value: ["a", "b", "c"] };
    expect(runner.runValues(values), "['a', 'b', 'c'] contains ['a', 'b']").toLooseEqual(true);
  });

  test("Escape quotes, bug#786", () => {
    var runner = new ConditionRunner("{text} = 'I\\'m here'");
    var values = { text: "I'm here" };
    expect(runner.runValues(values), "text equals I'm here").toLooseEqual(true);

    var runner = new ConditionRunner(
      "'I said: \\\"I\\'m here\\\"' contains {text}"
    );
    var values = { text: "I'm here" };
    expect(runner.runValues(values), "I said contains text").toLooseEqual(true);
  });

  test("Support equals and notequals, #781", () => {
    var runner = new ConditionRunner("{a} equals 1");
    var values = { a: 1 };
    expect(runner.runValues(values), "1 equals 1").toLooseEqual(true);
    values = { a: 2 };
    expect(runner.runValues(values), "2 equals 1").toLooseEqual(false);
  });
  test("Allow differnt symbols in variable name, bug#803", () => {
    var runner = new ConditionRunner("{complex name #$%?dd} = 1");
    var values = { "complex name #$%?dd": 1 };
    expect(runner.runValues(values), "1= 1").toLooseEqual(true);
    values = { "complex name #$%?dd": 2 };
    expect(runner.runValues(values), "2 <> 1").toLooseEqual(false);
  });

  test("Support array", () => {
    var runner = new ConditionRunner("{a} equals [1, 2]");
    var values = { a: [1, 2] };
    expect(runner.runValues(values), "[1, 2] equals [1, 2]").toLooseEqual(true);
    values = { a: [2] };
    expect(runner.runValues(values), "[2] equals [1, 2]").toLooseEqual(false);
    values = { a: [2, 1] };
    expect(runner.runValues(values), "[2, 1] equals [1, 2]").toLooseEqual(true);
  });

  test("ExpressionOperand: Simple expression", () => {
    var runner = new ConditionRunner("{a} - 1 > 5");
    var values = { a: 7 };
    expect(runner.runValues(values), "6 > 5").toLooseEqual(true);
    values = { a: 6 };
    expect(runner.runValues(values), "5 > 5").toLooseEqual(false);
  });

  test("ExpressionOperand: brackets", () => {
    var runner = new ConditionRunner("({a} + {b}) * 2 >= 10");
    var values = { a: 1, b: 3 };
    expect(runner.runValues(values), "(1 + 3) * 2 >= 10").toLooseEqual(false);
  });

  test("ExpressionOperand: brackets 2", () => {
    var runner = new ConditionRunner("({a} + {b} + {c}) / 3 >= 3");
    var values = { a: 1, b: 3, c: 2 };
    expect(runner.runValues(values), "(1 + 3 + 2) / 3 >= 3").toLooseEqual(false);
    values.c = 5;
    expect(runner.runValues(values), "(1 + 3 + 4) / 3 >= 3").toLooseEqual(true);
  });

  test("ConditionRunner: (1+2)*3", () => {
    var runner = new ExpressionRunner("(1+2)*3");
    expect(runner.runValues({}), "(1+2)*3 is 9").toLooseEqual(9);
  });

  test("ConditionRunner: (1+2)*(3+2) / 5", () => {
    var runner = new ExpressionRunner("(1+2)*(3+2) / 5");
    expect(runner.runValues({}), "(1+2)*(3+2) / 5 is 3").toLooseEqual(3);
  });

  test("ConditionRunner: 10 % 3", () => {
    var runner = new ExpressionRunner("10 % 3");
    expect(runner.runValues({}), "10 % 3 is 1").toLooseEqual(1);
    var condition = new ConditionRunner("({val1} + {val2}) % 2 = 0");
    expect(condition.runValues({ val1: 1, val2: 3 }), "(1+3)%2=0").toLooseEqual(true);
    expect(condition.runValues({ val1: 2, val2: 3 }), "(2+3)%2=0").toLooseEqual(false);
  });

  test("ExpressionRunner: sumInArray", () => {
    var runner = new ExpressionRunner("sumInArray({a}, 'val1')");
    var values = { a: [{ val1: 10 }, { val2: 10 }, { val1: 20 }] };
    expect(runner.runValues(values), "10 + 20").toLooseEqual(30);
    values = { a: [{ val2: 1 }] };
    expect(runner.runValues(values), "There is no values").toLooseEqual(0);
  });

  test("ExpressionRunner: sumInArray, for objects", () => {
    var runner = new ExpressionRunner("sumInArray({a}, 'val1')");
    var values = {
      a: { row1: { val1: 10 }, row2: { val2: 10 }, row3: { val1: 20 } },
    };
    expect(runner.runValues(values), "10 + 20").toLooseEqual(30);
  });
  test("ExpressionRunner: sumInArray with conditional logic", () => {
    var runner = new ExpressionRunner("sumInArray({a}, 'val1', '{val2} > 3')");
    var values = { a: [{ val1: 1, val2: 4 }, { val1: 2, val2: 3 }, { val1: 3, val2: 5 }] };
    expect(runner.runValues(values), "1 + 3").toLooseEqual(4);
  });
  test("ExpressionRunner: sumInArray with conditional logic as operand", () => {
    var runner = new ExpressionRunner("sumInArray({a}, 'val1', {val2} > 3)");
    var values = { a: [{ val1: 1, val2: 4 }, { val1: 2, val2: 3 }, { val1: 3, val2: 5 }] };
    expect(runner.runValues(values), "1 + 3").toLooseEqual(4);
  });
  test("ExpressionRunner: countInArray with conditional logic & strings", () => {
    var runner = new ExpressionRunner("sumInArray({a}, 'val1', {val2} <> 'item1')");
    var values = { a: [{ val1: 1, val2: "item2" }, { val1: 2, val2: "item1" }, { val1: 3, val2: "item3" }] };
    expect(runner.runValues(values), "1 + 3").toLooseEqual(4);
  });
  test("ExpressionRunner: sumInArray with conditional logic & strings & for object value", () => {
    var runner = new ExpressionRunner("sumInArray({a}, 'val1', {val2} <> 'item1')");
    var values = { a: { row1: { val1: 1, val2: "item2" }, row2: { val1: 2, val2: "item1" }, row3: { val1: 3, val2: "item3" } } };
    expect(runner.runValues(values), "1 + 3").toLooseEqual(4);
  });
  test("ExpressionRunner: countInArray with conditional logic & strings & for object value, #1", () => {
    var runner = new ExpressionRunner("countInArray({a}, 'val1', {val2} <> 'item1')");
    var values = { a: { row1: { val1: 1, val2: "item2" }, row2: { val1: 2, val2: "item1" }, row3: { val1: 3, val2: "item3" } } };
    expect(runner.runValues(values), "1 & 3").toLooseEqual(2);
  });
  test("ExpressionRunner: countInArray with conditional logic & strings & for object value, #2", () => {
    var runner = new ExpressionRunner("countInArray({question1}, 'c1', {c1} notempty)");
    var values = { "question1": { "Row 1": { "c1": 3 }, "Row 2": { "c1": 2 } } };
    expect(runner.runValues(values), "1 & 2").toLooseEqual(2);
  });
  test("ExpressionRunner: UnaryOperand, Bug#10068", () => {
    const operandNotEmpty = parse("{a} notempty");
    expect(operandNotEmpty.getType(), "Operand is unary, #1").toLooseEqual("unary");
    expect(operandNotEmpty.toString(), "Operand expression is correct, #1").toLooseEqual("{a} notempty");
    const operandEmpty = parse("{a} empty");
    expect(operandEmpty.getType(), "Operand is unary, #2").toLooseEqual("unary");
    expect(operandEmpty.toString(), "Operand expression is correct, #2").toLooseEqual("{a} empty");
  });
  test("ExpressionRunner: countInArray", () => {
    var runner = new ExpressionRunner("countInArray({a}, 'val1')");
    var values = { a: [{ val1: 10 }, { val2: 10 }, { val1: 20 }] };
    expect(runner.runValues(values), "10 + 20").toLooseEqual(2);
    values = { a: [{ val2: 1 }] };
    expect(runner.runValues(values), "There is no values").toLooseEqual(0);
    var emptyValue = { a: {} };
    expect(runner.runValues(emptyValue), "object is empty").toLooseEqual(0);
  });
  test("ExpressionRunner: countInArray, value as string", () => {
    var runner = new ExpressionRunner("countInArray({a}, 'val1')");
    var values = { a: [{ val1: "abc" }, { val2: 10 }, { val1: "cde" }] };
    expect(runner.runValues(values), "two items in array").toLooseEqual(2);
  });

  test("ConditionRunner, iif simple", () => {
    var runner = new ExpressionRunner("iif({a}, 'high', 'low')");
    var values = { a: true };
    expect(runner.runValues(values), "true").toLooseEqual("high");
    values.a = false;
    expect(runner.runValues(values), "false").toLooseEqual("low");
  });

  test("ExpressionRunner, iif with expression", () => {
    var runner = new ExpressionRunner("iif({a} + {b} > 20, 'high', 'low')");
    var values = { a: 10, b: 20 };
    expect(runner.runValues(values), "10 + 20 > 20").toLooseEqual("high");
    values.b = 5;
    expect(runner.runValues(values), "10 + 5 < 20").toLooseEqual("low");
  });

  test("ConditionRunner, iif nested using", () => {
    var runner = new ExpressionRunner(
      "iif({a} + {b} > 20, 'high', iif({a} + {b} > 10, 'medium', 'low'))"
    );
    var values = { a: 10, b: 20 };
    expect(runner.runValues(values), "10 + 20 > 20").toLooseEqual("high");
    values.b = 5;
    expect(runner.runValues(values), "10 + 5 > 10 && 10 + 5 < 20").toLooseEqual("medium");
    values.a = 1;
    expect(runner.runValues(values), "1 + 5 < 10").toLooseEqual("low");
  });

  test("ConditionRunner, iif nested using 2", () => {
    var runner = new ExpressionRunner(
      "iif(({a} + {b}) > 20, ({a} * 5 + {b}), iif({a} + {b} > 10, 5*({a}+ {b}), {a}))"
    );
    var values = { a: 10, b: 20 };
    expect(runner.runValues(values), "10 + 20 > 20").toLooseEqual(10 * 5 + 20);
    values.b = 5;
    expect(runner.runValues(values), "10 + 5 > 10 && 10 + 5 < 20").toLooseEqual(5 * (10 + 5));
    values.a = 1;
    expect(runner.runValues(values), "1 + 5 < 10").toLooseEqual(1);
  });

  test("ConditionRunner, iif with empty parameter, Bug#2732", () => {
    var runner = new ExpressionRunner("iif({a}, 'yes', '')");
    var values = { a: true };
    expect(runner.runValues(values), "true").toLooseEqual("yes");
    values.a = false;
    expect(runner.runValues(values), "false").toLooseEqual("");
  });

  test("parse iif with empty parameter, Bug#2732", () => {
    var expression = parse("iif(1, 'yes', '')");
    expect(expression, "Expression parse correctly").toBeTruthy();
    expression = parse('iif(1, "yes", "")');
    expect(expression, "Expression parse correctly, #2").toBeTruthy();
  });

  test("ConditionRunner, iif nested using with function, Bug T1302, (https://surveyjs.answerdesk.io/ticket/details/T1302)", () => {
    function incValue(params: any[]): any {
      return params[0] + 1;
    }
    FunctionFactory.Instance.register("incValue", incValue);

    var runner = new ExpressionRunner(
      'incValue(iif(({REVIEW_COVER} contains "REVIEW_SM") and ({REVIEW_COVER} contains "REVIEW_GL"), ({RATES_PROPERTY_SD}+{RATES_LIABILITY_SD}+{RATES_SEXUAL_MOL_END_SD}), iif(({REVIEW_COVER} notcontains "REVIEW_SM") and ({REVIEW_COVER} contains "REVIEW_GL"), ({RATES_PROPERTY_SD}+{RATES_LIABILITY_SD}), ({RATES_PROPERTY_SD}))))'
    );
    var values = {
      REVIEW_COVER: ["REVIEW_SM", "REVIEW_GL"],
      RATES_PROPERTY_SD: 1,
      RATES_LIABILITY_SD: 2,
      RATES_SEXUAL_MOL_END_SD: 3,
    };
    expect(runner.runValues(values), "the first condition is calling").toLooseEqual(1 + 2 + 3 + 1);
    FunctionFactory.Instance.unregister("incValue");
  });

  test("ConditionRunner, ^ operator", () => {
    var runner = new ExpressionRunner("{a} ^ 3 + {b} ^ 0.5");
    var values = { a: 10, b: 400 };
    expect(runner.runValues(values), "10^3 + 400^0.5 = 1000 + 20").toLooseEqual(1020);
  });

  test("Variable may have '-' and '+' in their names", () => {
    var runner = new ConditionRunner("{2-3+4} = 1");
    var values = { "2-3+4": 1 };
    expect(runner.runValues(values), "1 = 1").toLooseEqual(true);
    values = { "2-3+4": 2 };
    expect(runner.runValues(values), "2 != 1").toLooseEqual(false);
  });

  test("Variable equals 0x1 works incorrectly, Bug#1180", () => {
    var runner = new ConditionRunner("{val} notempty");
    var values = { val: "0x1" };
    expect(runner.runValues(values), "0x1 is not empty").toLooseEqual(true);

    runner = new ConditionRunner("{val} = 2");
    values = { val: "0x1" };
    expect(runner.runValues(values), "0x1 is not 2").toLooseEqual(false);
    values = { val: "0x2" };
    expect(runner.runValues(values), "0x2 is not 2").toLooseEqual(true);
  });

  test("notempty with 0 and false, bug#1792", () => {
    var runner = new ConditionRunner("{val} notempty");
    var values: any = { val: 0 };
    expect(runner.runValues(values), "0 is not empty").toLooseEqual(true);
    values.val = "0";
    expect(runner.runValues(values), "'0' is not empty").toLooseEqual(true);
    values.val = false;
    expect(runner.runValues(values), "false is not empty").toLooseEqual(true);
  });

  test("contain and noncontain for null arrays", () => {
    var runner = new ConditionRunner("{val} contain 1");
    var values = {};
    expect(runner.runValues(values), "undefined doesn't contain 1 - false").toLooseEqual(false);
    runner = new ConditionRunner("{val} notcontain 1");
    values = {};
    expect(runner.runValues(values), "undefined doesn't contain 1 - true").toLooseEqual(true);
  });

  test("length for defined arrays", () => {
    var runner = new ConditionRunner("{val.length} > 1");
    expect(runner.runValues({ val: [] }), "empty array length returns 0").toLooseEqual(false);
    expect(runner.runValues({ val: [1] }), "array length returns 1").toLooseEqual(false);
    expect(runner.runValues({ val: [1, 2] }), "array length returns 2").toLooseEqual(true);
    expect(runner.runValues({ val: [1, 2, 3] }), "array length returns 3").toLooseEqual(true);
  });

  test("length for undefined arrays", () => {
    var runner = new ConditionRunner("{val.length} = 0");
    expect(runner.runValues({ val: [] }), "empty array length returns 0").toLooseEqual(true);
    expect(runner.runValues({}), "undefined length returns 0").toLooseEqual(true);
    expect(runner.runValues({ val: undefined }), "undefined length returns 0").toLooseEqual(true);
    expect(runner.runValues({ val: null }), "null length returns 0").toLooseEqual(true);
    runner = new ConditionRunner("{val.length} < 4");
    expect(runner.runValues({ val: [] }), "empty array length < 4").toLooseEqual(true);
    expect(runner.runValues({}), "undefined length < 4").toLooseEqual(true);
    expect(runner.runValues({ val: undefined }), "undefined length  < 4").toLooseEqual(true);
    expect(runner.runValues({ val: null }), "null length  < 4").toLooseEqual(true);
  });

  test("length for arrays that becomes undefined, Bug#2432", () => {
    var runner = new ConditionRunner("{val.length} < 3");
    var data = { val: [1, 2] };

    expect(runner.runValues(data), "[1,2].length < 3").toLooseEqual(true);
    data.val = undefined;
    expect(runner.runValues(data), "undefined.length < 3").toLooseEqual(true);
  });

  test("contain and noncontain for strings", () => {
    var runner = new ConditionRunner("{val} contain 'ab'");
    var values = {};
    expect(runner.runValues(values), "contains: undefined doesn't contain 'ab' - false").toLooseEqual(false);
    values = { val: "ba" };
    expect(runner.runValues(values), "contains: 'ba' doesn't contain 'ab' - false").toLooseEqual(false);
    values = { val: "babc" };
    expect(runner.runValues(values), "contains: 'babc' contains 'ab' - true").toLooseEqual(true);

    runner = new ConditionRunner("{val} notcontain 'ab'");
    values = {};
    expect(runner.runValues(values), "notcontains: undefined doesn't contain 'ab' - true").toLooseEqual(true);
    values = { val: "ba" };
    expect(runner.runValues(values), "notcontains: 'ba' doesn't contain 'ab' - true").toLooseEqual(true);
    values = { val: "babc" };
    expect(runner.runValues(values), "notcontains: 'babc' contains 'ab' - false").toLooseEqual(false);
  });

  test("ConditionRunner: 7 * (({q1} * 0.4) + ({q2} * 0.6)), bug# 1423", () => {
    var runner = new ExpressionRunner("7 * ((10 * 0.4) + (20 * 0.6))");
    expect(runner.runValues({}), "7 * ((10 * 0.4) + (20 * 0.6)) is 112").toLooseEqual(7 * (4 + 12));
  });

  test("0x digits", () => {
    var runner = new ExpressionRunner("0x1 + 0x2 + {x}");
    var values = { x: 0x3 };
    expect(runner.runValues(values), "0x: 1 + 2 + 3 equal 6").toLooseEqual(6);
  });

  test("dont fault in invalid input", () => {
    var condRunner = new ConditionRunner("2 @ 2");
    expect(condRunner.canRun()).toBeFalsy();

    var exprRunner = new ExpressionRunner("00101 @@ 0101");
    expect(exprRunner.canRun()).toBeFalsy();
  });

  test("Get variables in expression", () => {
    var runner = new ExpressionRunner(
      "{val1} - {val2} + myFunc({val3}, {val4.prop}) < {val5} and {val6}=1"
    );
    var vars = runner.getVariables();
    expect(vars.length, "There are 6 variables in expression").toLooseEqual(6);
    expect(vars[0], "the first variable").toLooseEqual("val1");
    expect(vars[5], "the last variable").toLooseEqual("val6");
  });
  test("Support negative index in arrays, Issue#10607", () => {
    const runner = new ExpressionRunner("{val1[-1]} + {val1[-3]} + {val1[0]}");
    const values = { val1: [10, 20, 30, 40, 50] };
    expect(runner.runValues(values), "50 + 30 + 10 = 90").toLooseEqual(50 + 30 + 10);
  });
  test("Test binary operator anyof", () => {
    var runner = new ConditionRunner("{value} anyof ['a', 'b']");
    var values = { value: ["a", "c"] };
    expect(runner.runValues(values), "['a', 'c'] anyof ['a', 'b']").toLooseEqual(true);
    values = { value: ["a", "b"] };
    expect(runner.runValues(values), "['a', 'b'] anyof ['a', 'b']").toLooseEqual(true);
    values = { value: ["c", "d"] };
    expect(runner.runValues(values), "['c', 'd'] anyof ['a', 'b']").toLooseEqual(false);
    values = { value: [] };
    expect(runner.runValues(values), "[] anyof ['a', 'b']").toLooseEqual(false);
    values = { value: null };
    expect(runner.runValues(values), "null anyof ['a', 'b']").toLooseEqual(false);
  });
  test("Test binary operator noneof", () => {
    var runner = new ConditionRunner("{value} noneof ['a', 'b']");
    var values = { value: ["a", "c"] };
    expect(runner.runValues(values), "['a', 'c'] noneof ['a', 'b']").toLooseEqual(false);
    values = { value: ["a", "b"] };
    expect(runner.runValues(values), "['a', 'b'] noneof ['a', 'b']").toLooseEqual(false);
    values = { value: ["c", "d"] };
    expect(runner.runValues(values), "['c', 'd'] noneof ['a', 'b']").toLooseEqual(true);
    values = { value: [] };
    expect(runner.runValues(values), "[] noneof ['a', 'b']").toLooseEqual(true);
    values = { value: null };
    expect(runner.runValues(values), "null noneof ['a', 'b']").toLooseEqual(true);
  });
  test("Test binary operator anyof with 0", () => {
    var runner = new ConditionRunner("{value} anyof [7, 3, 0]");
    var values = { value: 3 };
    expect(runner.runValues(values), "3 anyof [7, 3, 0]").toLooseEqual(true);
    values.value = 0;
    expect(runner.runValues(values), "0 anyof [7, 3, 0]").toLooseEqual(true);
    values.value = 1;
    expect(runner.runValues(values), "1 anyof [7, 3, 0]").toLooseEqual(false);
  });
  test("Test operator anyof for non-array var", () => {
    var runner = new ConditionRunner("{value} anyof ['a', 'b', 'c']");
    var values = { value: "a" };
    expect(runner.runValues(values), "'a' anyof ['a', 'b', 'c']").toLooseEqual(true);
    values.value = "e";
    expect(runner.runValues(values), "'e' anyof ['a', 'b', 'c']").toLooseEqual(false);
  });
  test("Test binary operator allof", () => {
    var runner = new ConditionRunner("{value} allof ['a', 'b']");
    var values = { value: ["a", "c"] };
    expect(runner.runValues(values), "['a', 'c'] allof ['a', 'b']").toLooseEqual(false);
    values = { value: ["a", "b", "c"] };
    expect(runner.runValues(values), "['a', 'b', 'c'] allof ['a', 'b']").toLooseEqual(true);
    values = { value: ["c", "d"] };
    expect(runner.runValues(values), "['c', 'd'] allof ['a', 'b']").toLooseEqual(false);
  });

  test("Compare object with string", () => {
    var runner = new ConditionRunner("{value} = '1'");
    var values: any = { value: 1 };
    expect(runner.runValues(values), "1 = '1'").toLooseEqual(true);
  });

  test("Compare undefined object with string", () => {
    var runner = new ConditionRunner("{value} = 'undefined'");
    var values: any = {};
    expect(runner.runValues(values), "undefined = 'undefined'").toLooseEqual(true);
  });

  test("Compare two undefined variables", () => {
    var values: any = { v1: undefined, v2: undefined };
    expect(new ConditionRunner("{v1} = {v2}").runValues(values), "undefined = undefined").toLooseEqual(true);
    expect(new ConditionRunner("{v1} != {v2}").runValues(values), "undefined != undefined").toLooseEqual(false);
    expect(new ConditionRunner("{v1} <= {v2}").runValues(values), "undefined <= undefined").toLooseEqual(true);
    expect(new ConditionRunner("{v1} >= {v2}").runValues(values), "undefined >= undefined").toLooseEqual(true);
    expect(new ConditionRunner("{v1} < {v2}").runValues(values), "undefined < undefined").toLooseEqual(false);
    expect(new ConditionRunner("{v1} > {v2}").runValues(values), "undefined > undefined").toLooseEqual(false);
    values.v1 = 1;
    expect(new ConditionRunner("{v1} > {v2}").runValues(values), "1 > undefined").toLooseEqual(false);
    expect(new ConditionRunner("{v1} < {v2}").runValues(values), "1 < undefined").toLooseEqual(false);
  });

  test("Support apostrophes in value name", () => {
    var runner = new ConditionRunner("{a'b\"c} = 1");
    var values: any = { "a'b\"c": 1 };
    expect(runner.runValues(values), "1 = 1").toLooseEqual(true);
    values = { "a'b\"c": 2 };
    expect(runner.runValues(values), "2 = 1").toLooseEqual(false);
  });

  test("String as numbers", () => {
    var runner = new ExpressionRunner("({a} + {b}) * {c}");
    var values: any = { a: "2", b: "3", c: "4" };
    expect(runner.runValues(values), "convert strings to numbers").toLooseEqual(20);
  });

  test("True/False strings do not work, Bug #https://surveyjs.answerdesk.io/ticket/details/T2425", () => {
    var runner = new ConditionRunner("{a} = 'True'");
    var values: any = { a: "False" };
    expect(runner.runValues(values), "'True' = 'False'").toLooseEqual(false);
    values.a = "True";
    expect(runner.runValues(values), "'True' = 'True'").toLooseEqual(true);
    values.a = false;
    expect(runner.runValues(values), "false = 'True'").toLooseEqual(false);
    values.a = true;
    expect(runner.runValues(values), "true = 'True'").toLooseEqual(true);

    runner = new ConditionRunner("{a} = 'False'");
    values.a = "False";
    expect(runner.runValues(values), "'False' = 'False'").toLooseEqual(true);
    values.a = "True";
    expect(runner.runValues(values), "'True' = 'False'").toLooseEqual(false);
    values.a = false;
    expect(runner.runValues(values), "'False' = false").toLooseEqual(true);
    values.a = true;
    expect(runner.runValues(values), "'False'=true").toLooseEqual(false);
  });

  test("Use dot, '.' in names", () => {
    var runner = new ConditionRunner("{a.b.c.d} = 1");
    var values: any = { "a.b.c.d": 1 };
    expect(runner.runValues(values), "1 = 1").toLooseEqual(true);
  });

  test("Async function", () => {
    function asyncFunc(params: any): any {
      this.returnResult(params[0] * 3);
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);

    var runner = new ConditionRunner("asyncFunc({a}) = 15");
    var runnerResult = null;
    runner.onRunComplete = function(result: any) {
      runnerResult = result;
    };
    expect(runner.isAsync, "The condition is async").toLooseEqual(true);
    var values = { a: 3 };
    runner.runValues(values);
    expect(runnerResult, "3*3 = 15").toLooseEqual(false);
    values.a = 5;
    runner.runValues(values);
    expect(runnerResult, "5*3 = 15").toLooseEqual(true);
    FunctionFactory.Instance.unregister("asyncFunc");
  });

  test("Async function inside the sync function, Bug#8732", () => {
    function asyncFunc(params: any): any {
      this.returnResult(params[0] * 3);
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);
    function syncFunc(params: any): any {
      return params[0] + 10;
    }
    FunctionFactory.Instance.register("syncFunc", syncFunc);

    const runner = new ExpressionRunner("syncFunc(asyncFunc({a}))");
    expect(runner.canRun(), "The expression is valid").toLooseEqual(true);
    expect(runner.isAsync, "It is async").toLooseEqual(true);
    var runnerResult = null;
    runner.onRunComplete = function(result: any) {
      runnerResult = result;
    };
    var values = { a: 3 };
    runner.runValues(values);
    expect(runnerResult, "3*3 + 10").toLooseEqual(19);
    values.a = 5;
    runner.runValues(values);
    expect(runnerResult, "5*3 + 10").toLooseEqual(25);
    FunctionFactory.Instance.unregister("asyncFunc");
    FunctionFactory.Instance.unregister("syncFunc");
  });
  test("Async function inside the async function, Bug#8742", () => {
    function asyncFunc1(params: any): any {
      this.returnResult(params[0] * 3);
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
    function asyncFunc2(params: any): any {
      this.returnResult(params[0] + 10);
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);

    var runner = new ExpressionRunner("asyncFunc2(asyncFunc1({a}))");
    expect(runner.canRun(), "The expression is valid").toLooseEqual(true);
    expect(runner.isAsync, "It is async").toLooseEqual(true);
    var runnerResult = null;
    runner.onRunComplete = function(result: any) {
      runnerResult = result;
    };
    var values = { a: 3 };
    runner.runValues(values);
    expect(runnerResult, "3*3 + 10").toLooseEqual(19);
    values.a = 5;
    runner.runValues(values);
    expect(runnerResult, "5*3 + 10").toLooseEqual(25);
    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
  });
  test("Async & sync nested functions, Bug #8732 #8742", () => {
    function asyncFunc1(params: any): any {
      this.returnResult(params[0] * 10 + params[1]);
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
    function asyncFunc2(params: any): any {
      this.returnResult(params[0] + params[1] + 10);
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);
    function syncFunc1(params: any): any {
      return params[0] * 5 + params[1];
    }
    FunctionFactory.Instance.register("syncFunc1", syncFunc1);
    function syncFunc2(params: any): any {
      return params[0] + params[1] + 5;
    }
    FunctionFactory.Instance.register("syncFunc2", syncFunc2);
    const expression = "asyncFunc2({e}, asyncFunc1({a}, asyncFunc1({b}, syncFunc2({c}, {d}))))" +
  " + syncFunc2({e}, syncFunc1({a}, syncFunc1({b}, asyncFunc2({c}, {d}))))";
    var runner = new ExpressionRunner(expression);
    expect(runner.canRun(), "The expression is valid").toLooseEqual(true);
    expect(runner.isAsync, "It is async").toLooseEqual(true);
    var runnerResult = null;
    runner.onRunComplete = function(result: any) {
      runnerResult = result;
    };
    var values = { a: 1, b: 2, c: 3, d: 4, e: 5 };
    // (1) syncFunc2({c}, {d}) = 3 + 4 + 5 = 12
    // (2) asyncFunc1({b}, [1]) = 2 * 10 + 12 = 32
    // (3) asyncFunc1({a}, [2]) = 1 * 10 + 32 = 42
    // (4) asyncFunc2({e}, [3]) = 5 + 42 + 10 = 57

    // (1) asyncFunc2({c}, {d}) = 3 + 4 + 10 = 17
    // (2) syncFunc1({b}, [1]) = 2 * 5 + 17 = 27
    // (3) syncFunc1({a}, [2]) = 1 * 5 + 27 = 32
    // (4) syncFunc2({e}, [3]) = 5 + 32 + 5 = 42
    runner.runValues(values);
    expect(runnerResult, "#1").toLooseEqual(57 + 42);

    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
    FunctionFactory.Instance.unregister("syncFunc1");
    FunctionFactory.Instance.unregister("syncFunc2");
  });

  test("Use onRunComplete for sync functions", () => {
    function syncFunc(params: any): any {
      return params[0] * 3;
    }
    FunctionFactory.Instance.register("syncFunc", syncFunc);

    var runner = new ConditionRunner("syncFunc({a}) = 15");
    var runnerResult = null;
    runner.onRunComplete = function(result: any) {
      runnerResult = result;
    };
    expect(runner.isAsync, "The condition is sync").toLooseEqual(false);
    var values = { a: 3 };
    runner.runValues(values);
    expect(runnerResult, "3*3 = 15").toLooseEqual(false);
    values.a = 5;
    runner.runValues(values);
    expect(runnerResult, "5*3 = 15").toLooseEqual(true);
    FunctionFactory.Instance.unregister("syncFunc");
  });

  test("Several async functions in expression", () => {
    var returnResult1: (res: any) => void = (res) => {};
    var returnResult2: (res: any) => void = (res) => {};
    var returnResult3: (res: any) => void = (res) => {};
    function asyncFunc1(params: any): any {
      returnResult1 = this.returnResult;
      return false;
    }
    function asyncFunc2(params: any): any {
      returnResult2 = this.returnResult;
      return false;
    }
    function asyncFunc3(params: any): any {
      returnResult3 = this.returnResult;
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
    FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);
    FunctionFactory.Instance.register("asyncFunc3", asyncFunc3, true);

    var runner = new ConditionRunner(
      "asyncFunc1() + asyncFunc2() + asyncFunc3() = 10"
    );
    let idBefore: number = -1;
    let idAfter: number = -1;
    runner.onBeforeAsyncRun = (id: number) => { idBefore = id; };
    runner.onAfterAsyncRun = (id: number) => { idAfter = id; };
    var runnerResult = null;
    runner.onRunComplete = function(result: any) {
      runnerResult = result;
    };
    expect(runner.isAsync, "The condition is async").toLooseEqual(true);
    var values = { a: 3 };
    expect(idBefore, "idBefore #1").toLooseEqual(-1);
    expect(idAfter, "idAfter #1").toLooseEqual(-1);
    runner.runValues(values);
    expect(idBefore, "idBefore #2").not.toLooseEqual(-1);
    expect(idAfter, "idAfter #2").toLooseEqual(-1);
    expect(runnerResult, "It is not ready, async functions do not return anything").toLooseEqual(null);
    returnResult2(2);
    expect(runnerResult, "It is not ready, asyncfunc1 and asyncfunc3 functions do not return anything").toLooseEqual(null);
    expect(idBefore, "idBefore #3").not.toLooseEqual(-1);
    expect(idAfter, "idAfter #3").toLooseEqual(-1);
    returnResult1(7);
    expect(runnerResult, "It is not ready, asyncfunc3 function doesn't return anything").toLooseEqual(null);
    expect(idBefore, "idBefore #4").not.toLooseEqual(-1);
    expect(idAfter, "idAfter #4").toLooseEqual(-1);
    returnResult3(1);
    expect(runnerResult, "evulate successfull").toLooseEqual(true);
    expect(idBefore, "idBefore #5").not.toLooseEqual(-1);
    expect(idAfter, "idAfter #5").toLooseEqual(idBefore);
    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
    FunctionFactory.Instance.unregister("asyncFunc3");
  });

  test("isString function", () => {
    function isString(params: any[]): any {
      return typeof params[0] == "string";
    }
    FunctionFactory.Instance.register("isString", isString);

    var runner = new ConditionRunner("isString({val}) == true");
    var values: any = { val: "3" };
    var properties = {};
    expect(runner.runValues(values, properties), "3 is Numeric").toLooseEqual(false);
    values.val = false;
    expect(runner.runValues(values, properties), "false is boolean").toLooseEqual(false);
    values.val = "abc";
    expect(runner.runValues(values, properties), "'abc' is string").toLooseEqual(true);
    values.val = "0x2323";
    expect(runner.runValues(values, properties), "'0x2323' is number").toLooseEqual(false);
    values.val = "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8";
    expect(runner.runValues(values, properties), "'0xbe0eb53f46cd790cd13851d5eff43d12404d33e8' is string").toLooseEqual(true);
    FunctionFactory.Instance.unregister("isString");
  });
  test('express with iif and "[" inside, Bug#1942', () => {
  // prettier-ignore
    var expression = "{val1} + iif({val2} = \"item2\", \"[\" + {val1} + \"]\", \"x\")";
    var runner = new ExpressionRunner(expression);
    var values: any = { val1: "1", val2: "item2" };
    expect(runner.runValues(values), "val1 + [val1]").toLooseEqual("1[1]");
    values.val2 = "item1";
    expect(runner.runValues(values), "1 + 'x'").toLooseEqual("1x");
    values.val1 = undefined;
    expect(runner.runValues(values), "undefined + 'x'").toLooseEqual("x");
    // prettier-ignore
    expression = "{val1} + \"x\"";
    var runner = new ExpressionRunner(expression);
    expect(runner.runValues(values), "undefined + 'x' without iif").toLooseEqual("x");
    expression = '{val1} + "[" + {val1} + "]"';
    var runner = new ExpressionRunner(expression);
    expect(runner.runValues(values), "undefined + '[' + undefined + ']' without iif").toLooseEqual("[]");
  });
  test('expression with "{", Bug#2337', () => {
  // prettier-ignore
    var expression = "{val1} + '\{ text' + '\}'";
    var runner = new ExpressionRunner(expression);
    var values: any = { val1: "1" };
    expect(runner.runValues(values), "{").toLooseEqual("1{ text}");

    expression = "{val1} + '{ text' + '}'";
    runner = new ExpressionRunner(expression);
    var values: any = { val1: "1" };
    expect(runner.runValues(values), "{ without escape").toLooseEqual("1{ text}");
  });
  test("Disable converting string to number, #2376", () => {
    var runner = new ExpressionRunner("{val1} + {val2}");
    var values: any = { val1: "1", val2: "102" };
    expect(runner.runValues(values), "Convert strings to numbers").toLooseEqual(103);

    runner = new ExpressionRunner("{#val1} + {#val2}");
    expect(runner.runValues(values), "do not convert the value").toLooseEqual("1102");
    let expr = new ConditionsParser().createCondition("{#val1} + {#val2}");
    expect(expr.toString(), "Do not loose '#'").toLooseEqual("({#val1} + {#val2})");
  });

  test("ExpressionRunner: age", () => {
    var runner = new ExpressionRunner("age({d})");
    var d = new Date();
    d.setDate(d.getDate() - 1);
    d.setFullYear(d.getFullYear() - 10);
    var values = { d: d };
    expect(runner.runValues(values), "10 year").toLooseEqual(10);
  /* TODO case stop worked on December 31. Do we need minus age?
  d = new Date();
  d.setDate(d.getDate() + 1);
  d.setFullYear(d.getFullYear() + 10);
  values.d = d;
  expect(runner.run(values), "Date in the future, 10 years").toLooseEqual(-10);
  */
  });

  test("ExpressionRunner: diffsDays", () => {
    var runner = new ExpressionRunner("diffDays({d1}, {d2})");
    var d1 = new Date("2021-01-01");
    var d2 = new Date("2021-02-02");
    var values = { d1: d1, d2: d2 };
    expect(runner.runValues(values), "32 days").toLooseEqual(32);
    values.d1 = undefined;
    expect(runner.runValues(values), "a value is undefined").toLooseEqual(0);
  });
  test("ExpressionRunner: diffsDays with times", () => {
    var runner = new ExpressionRunner("diffDays({d1}, {d2})");
    var d1 = new Date("2021-03-10T05:00:00");
    var d2 = new Date("2021-03-11T04:00:00");
    var values = { d1: d1, d2: d2 };
    expect(runner.runValues(values), "1 day").toLooseEqual(1);
    values.d2 = new Date("2021-03-10T23:00:00");
    expect(runner.runValues(values), "0 days").toLooseEqual(0);
  });

  test("parse({val} == '000')", () => {
    var op = <BinaryOperand>(
    new ConditionsParser().parseExpression("{val} == '000'")
  );
    expect(op.rightOperand.getType(), "variable type").toLooseEqual("const");
    expect((<Const>op.rightOperand).toString(), "value is string with quotes").toLooseEqual("'000'");
    expect((<Const>op.rightOperand).correctValue, "correct value is string").toBe("000");
  });

  test("000 == '000', '00' != '000', '0' != '000', 0 != '000'", () => {
    var runner = new ConditionRunner("{val} == '000'");
    var values: any = { val: "000" };
    expect(runner.runValues(values), "000 == '000'").toLooseEqual(true);
    values.val = "00";
    expect(runner.runValues(values), "'00' != '000'").toLooseEqual(false);
    values.val = "0";
    expect(runner.runValues(values), "'0' != '000', '0' and '000' converted to number").toLooseEqual(true);
    values.val = 0;
    expect(runner.runValues(values), "0 != '000', convert '000' to number").toLooseEqual(true);
  });
  test("True and False as strings'", () => {
    var runner = new ConditionRunner("{val} = 'TRUE'");
    var values: any = { val: "TRUE" };
    expect(runner.runValues(values), "TRUE == 'TRUE'").toLooseEqual(true);
    runner = new ConditionRunner("{val} contains 'TRU'");
    expect(runner.runValues(values), "TRUE contains TRU").toLooseEqual(true);
    runner = new ConditionRunner("{val} contains 'FALSE'");
    expect(runner.runValues(values), "TRUE contains FALSE").toLooseEqual(false);
    values.val = "FALSE";
    expect(runner.runValues(values), "FALSE contains FALSE").toLooseEqual(true);
  });
  test("ExpressionRunner: fix incorrect JavaScript multiplication", () => {
    var runner = new ExpressionRunner("3 * 0.6");
    expect(runner.runValues({}), "It works correctly").toLooseEqual(1.8);
  });
  test("ExpressionRunner: fix incorrect JavaScript summary", () => {
    var runner = new ExpressionRunner("0.3 + 0.6");
    expect(runner.runValues({}), "It works correctly").toLooseEqual(0.9);
  });
  test("ExpressionRunner: fix incorrect JavaScript summary", () => {
    var runner = new ExpressionRunner("0.9 - 0.6");
    expect(runner.runValues({}), "It works correctly").toLooseEqual(0.3);
  });
  test("ExpressionRunner: fix incorrect JavaScript summary in sum function", () => {
    var runner = new ExpressionRunner("sum([0.3, 0.6]");
    expect(runner.runValues({}), "It works correctly, sum function").toLooseEqual(0.9);
  });
  test("ExpressionRunner: fix incorrect JavaScript summary in avg function", () => {
    var runner = new ExpressionRunner("avg([0.3, 0.6]");
    expect(runner.runValues({}), "It works correctly, avg function").toLooseEqual(0.45);
  });
  test("ExpressionRunner: fix incorrect JavaScript summary in sumInArray function", () => {
    var runner = new ExpressionRunner("sumInArray({a}, 'val1')");
    var values = { a: [{ val1: 0.3 }, { val2: 10 }, { val1: 0.6 }] };
    expect(runner.runValues(values), "It works correctly, sumInArray func").toLooseEqual(0.9);
  });
  test("ExpressionRunner: fix incorrect JavaScript summary in avgInArray function", () => {
    var runner = new ExpressionRunner("avgInArray({a}, 'val1')");
    var values = { a: [{ val1: 0.3 }, { val2: 10 }, { val1: 0.6 }] };
    expect(runner.runValues(values), "It works correctly, avgInArray func").toLooseEqual(0.45);
  });
  test("ExpressionRunner: sumInArray function, float and string", () => {
    var runner = new ExpressionRunner("sumInArray({a}, 'val1')");
    var values = { a: [{ val1: 0.3 }, { val1: "10" }, { val1: "0.6" }, { val1: "abc" }] };
    expect(runner.runValues(values), "It works correctly, sumInArray func").toLooseEqual(10.9);
  });
  test("ExpressionRunner: minInArray function, float and string", () => {
    var runner = new ExpressionRunner("minInArray({a}, 'val1')");
    var values = { a: [{ val1: 3 }, { val1: "1" }, { val1: "abc" }] };
    expect(runner.runValues(values), "It works correctly, minInArray func").toLooseEqual(1);
  });
  test("ExpressionRunner: maxInArray function, float and string", () => {
    var runner = new ExpressionRunner("maxInArray({a}, 'val1')");
    var values = { a: [{ val1: -3 }, { val1: "-1" }, { val1: "abc" }] };
    expect(runner.runValues(values), "It works correctly, maxInArray func").toLooseEqual(-1);
  });
  test("ExpressionRunner: minInArray with return column", () => {
    var runner = new ExpressionRunner("minInArray({a}, 'price', 'name')");
    var values = { a: [{ price: 30, name: "C" }, { price: 10, name: "A" }, { price: 20, name: "B" }] };
    expect(runner.runValues(values), "returns name from row with min price").toLooseEqual("A");
  });
  test("ExpressionRunner: maxInArray with return column", () => {
    var runner = new ExpressionRunner("maxInArray({a}, 'price', 'name')");
    var values = { a: [{ price: 30, name: "C" }, { price: 10, name: "A" }, { price: 20, name: "B" }] };
    expect(runner.runValues(values), "returns name from row with max price").toLooseEqual("C");
  });
  test("ExpressionRunner: minInArray with return column and condition", () => {
    var runner = new ExpressionRunner("minInArray({a}, 'price', 'name', {active} = true)");
    var values = { a: [{ price: 5, name: "X", active: false }, { price: 30, name: "C", active: true }, { price: 10, name: "A", active: true }] };
    expect(runner.runValues(values), "returns name from row with min price where active is true").toLooseEqual("A");
  });
  test("ExpressionRunner: maxInArray with return column and condition", () => {
    var runner = new ExpressionRunner("maxInArray({a}, 'price', 'name', {active} = true)");
    var values = { a: [{ price: 50, name: "X", active: false }, { price: 30, name: "C", active: true }, { price: 10, name: "A", active: true }] };
    expect(runner.runValues(values), "returns name from row with max price where active is true").toLooseEqual("C");
  });
  test("ExpressionRunner: minInArray with condition as quoted string", () => {
    var runner = new ExpressionRunner("minInArray({a}, 'val1', '{val2} > 3')");
    var values = { a: [{ val1: 1, val2: 4 }, { val1: 2, val2: 3 }, { val1: 3, val2: 5 }] };
    expect(runner.runValues(values), "min of val1 where val2 > 3").toLooseEqual(1);
  });
  test("ExpressionRunner: maxInArray with condition as quoted string", () => {
    var runner = new ExpressionRunner("maxInArray({a}, 'val1', '{val2} > 3')");
    var values = { a: [{ val1: 1, val2: 4 }, { val1: 2, val2: 3 }, { val1: 3, val2: 5 }] };
    expect(runner.runValues(values), "max of val1 where val2 > 3").toLooseEqual(3);
  });
  test("ExpressionRunner: minInArray with condition as operand", () => {
    var runner = new ExpressionRunner("minInArray({a}, 'val1', {val2} > 3)");
    var values = { a: [{ val1: 1, val2: 4 }, { val1: 2, val2: 3 }, { val1: 3, val2: 5 }] };
    expect(runner.runValues(values), "min of val1 where val2 > 3").toLooseEqual(1);
  });
  test("ExpressionRunner: maxInArray with condition as operand", () => {
    var runner = new ExpressionRunner("maxInArray({a}, 'val1', {val2} > 3)");
    var values = { a: [{ val1: 1, val2: 4 }, { val1: 2, val2: 3 }, { val1: 3, val2: 5 }] };
    expect(runner.runValues(values), "max of val1 where val2 > 3").toLooseEqual(3);
  });

  test("Operand.isEqual()", () => {
    const getOperand = (expression: string): Operand => {
      return new ConditionsParser().parseExpression(expression);
    };
    const compareOperands = (exp1: string, exp2: string): boolean => {
      return getOperand(exp1).isEqual(getOperand(exp2));
    };
    expect(compareOperands("{val} = 1", "{val} = 2"), "#1").toLooseEqual(false);
    expect(compareOperands("{val} = 1", "{val} = 1")).toLooseEqual(true), "#2";
    expect(compareOperands("{val} = 1 and func({a}) < 3", "{val} = 1 and func({a}) < 3"), "#3").toLooseEqual(true);
    expect(compareOperands("{val} = 1 and func({a}) < 3", "{val} = 1 and func({b}) < 3"), "#4").toLooseEqual(false);
    expect(compareOperands("func({a}) < 3", "func({b}) < 3"), "#4.1").toLooseEqual(false);
    expect(compareOperands("func({a, b, 5}) < 3", "func({a, b, 5}) < 3"), "#4.2").toLooseEqual(true);
    expect(compareOperands("{a} < 3", "{b} < 3"), "#4.3").toLooseEqual(false);
    expect(compareOperands("{val} = 1 and func({a}) < 3", "{val} = 1 or func({a}) < 3"), "#5").toLooseEqual(false);
    expect(compareOperands("{val} = 1", "{val} != 1"), "#6").toLooseEqual(false);
  });

  test("Expression decimal + string", () => {
    const expression = new ExpressionRunner("0.1 + 'abc'");
    expect(expression.runValues({})).toLooseEqual("0.1abc");
  });
  test("string contancts without brackets", () => {
    let expression = new ExpressionRunner("{a} = abc");
    expect(expression.runValues({ a: "abcd" }), "#1").toLooseEqual(false);
    expect(expression.runValues({ a: "abc" }), "#2").toLooseEqual(true);
    expression = new ExpressionRunner("{a} = ab_cd");
    expect(expression.runValues({ a: "abcd" }), "#3").toLooseEqual(false);
    expect(expression.runValues({ a: "ab_cd" }), "#4").toLooseEqual(true);
  });
  test("Expression string as ==", () => {
    const node = <Const>new ConditionsParser().parseExpression("'=='");
    expect(node.getType()).toLooseEqual("const");
    expect(node.correctValue).toLooseEqual("==");
    expect(new ExpressionRunner("'=='").runValues({})).toLooseEqual("==");
    expect(new ExpressionRunner("'aa' + '=='").runValues({})).toLooseEqual("aa==");
  });
  test("Arrays and plus operations", () => {
    const runner1 = new ExpressionRunner("{a} + {b}");
    const values1 = { a: [1, 2, 3], b: [4, 5] };
    expect(runner1.runValues(values1), "Contact arrays").toEqualValues([1, 2, 3, 4, 5]);
    const runner2 = new ExpressionRunner("{a} + ' '");
    const values2 = { a: ["a", "b", "c"] };
    expect(runner2.runValues(values2), "Contact strings").toLooseEqual("a, b, c ");
    const runner3 = new ExpressionRunner("{a} + 4");
    const values3 = { a: [1, 2, 3] };
    expect(runner3.runValues(values3), "summary of numbers").toLooseEqual(10);
    const runner4 = new ExpressionRunner("{a} + ''");
    const values4 = { a: [1, 2, 3] };
    expect(runner4.runValues(values4), "summary of numbers").toLooseEqual("1, 2, 3");
  });
  test("today(1) <= today(10)", () => {
    const runner = new ExpressionRunner("today(1) <= today(10)");
    expect(runner.runValues({}), "today(1) <= today(10)").toEqualValues(true);
  });

  test("year, month, day, weekday", () => {
    let runner = new ExpressionRunner("year('2023-07-28')");
    expect(runner.runValues({}), "year").toEqualValues(2023);
    runner = new ExpressionRunner("month('2023-07-28')");
    expect(runner.runValues({}), "month").toEqualValues(7);
    runner = new ExpressionRunner("day('2023-07-28')");
    expect(runner.runValues({}), "day").toEqualValues(28);
    runner = new ExpressionRunner("weekday('2023-07-28')");
    expect(runner.runValues({}), "weekday").toEqualValues(5);
    runner = new ExpressionRunner("year()");
    expect(runner.runValues({}), "current year").toEqualValues(new Date().getFullYear());
    runner = new ExpressionRunner("month()");
    expect(runner.runValues({}), "current month").toEqualValues(new Date().getMonth() + 1);
    runner = new ExpressionRunner("day()");
    expect(runner.runValues({}), "current day").toEqualValues(new Date().getDate());
    runner = new ExpressionRunner("weekday()");
    expect(runner.runValues({}), "current weekday").toEqualValues(new Date().getDay());
  });
  test("Sum two float numbers as string", () => {
    let runner = new ExpressionRunner("{a} + {b}");
    expect(runner.runValues({ a: "1.1", b: "2.2" }), "#1").toLooseEqual(3.3);
    expect(runner.runValues({ a: "0.1", b: "0.2" }), "#2").toLooseEqual(0.3);
  });
  test("Warn in console if the expression is invalid", () => {
    const prev = ConsoleWarnings.warn;
    let reportText: string = "";
    ConsoleWarnings.warn = (text: string) => {
      reportText = text;
    };
    const runner = new ExpressionRunner("{a} ++");
    expect(reportText).toBeFalsy();
    runner.runValues({ a: 1 });
    expect(reportText).toLooseEqual("Invalid expression: '{a} ++'.");

    reportText = "";
    runner.expression = "{a} + 1";
    runner.runValues({ a: 1 });
    expect(reportText).toBeFalsy();

    runner.expression = "tooday()";
    expect(reportText).toBeFalsy();
    runner.runValues({});
    expect(reportText).toLooseEqual("Unknown function name: 'tooday'.");

    reportText = "";
    runner.expression = "today";
    runner.runValues({});
    expect(reportText).toBeFalsy();
    ConsoleWarnings.warn = prev;
  });
  test("Custom function returns object&array, #7050", () => {
    function func1(params: any[]): any {
      return { a: 1, b: 2 };
    }
    function func2(params: any[]): any {
      return [{ a: 1 }, { b: 2 }];
    }
    FunctionFactory.Instance.register("func1", func1);
    FunctionFactory.Instance.register("func2", func2);

    let runner = new ExpressionRunner("func1()");
    expect(runner.runValues({}, {}), "function returns object").toEqualValues({ a: 1, b: 2 });
    runner.expression = "func2()";
    expect(runner.runValues({}, {}), "function returns array").toEqualValues([{ a: 1 }, { b: 2 }]);

    FunctionFactory.Instance.unregister("func1");
    FunctionFactory.Instance.unregister("func2");
  });
  test("ExpressionRunner: substring", () => {
    var runner = new ExpressionRunner("substring({s}, 1, 3)");
    const values: any = { s: "abcdef" };
    expect(runner.runValues(values), "abcdef").toLooseEqual("bc");
    values.s = undefined;
    expect(runner.runValues(values), "undefined").toLooseEqual("");
    values.s = 10;
    expect(runner.runValues(values), "10").toLooseEqual("");
  });
  test("ExpressionRunner: apply custom converter, #8634", () => {
    const newParseNumber = (stringValue: any, numericValue: number): number => {
      if (typeof stringValue !== "string" || !stringValue) return numericValue;
      if (stringValue.indexOf(",") < 0) return numericValue;
      while(stringValue.indexOf(",") > -1) {
        stringValue = stringValue.replace(",", "");
      }
      return Helpers.getNumber(stringValue);
    };
    const oldCallback = settings.parseNumber;
    settings.parseNumber = newParseNumber;

    var runner = new ExpressionRunner("{a} + {b}");
    const values: any = { a: "100,000", b: "10,000" };
    expect(runner.runValues(values), "apply custom convertr").toLooseEqual(110000);

    settings.parseNumber = oldCallback;
  });
  test("ExpressionRunner: do not convert to number extreme large strings", () => {
    const runner = new ExpressionRunner("{a} + 2");
    const values: any = { a: "999999999999999" };
    expect(runner.runValues(values), "it is a number").toBe(1000000000000001);
    values.a = "9999999999999999";
    expect(runner.runValues(values), "it is a string").toBe("99999999999999992");
  });
  test("No params for iif function, Bug#9674", () => {
    let runner = new ExpressionRunner("iif()");
    const values: any = {};
    expect(runner.runValues(values), "Empty paramsters, #1").toLooseEqual(null);
    runner = new ExpressionRunner("iif('')");
    expect(runner.runValues(values), "Empty paramsters, #2").toLooseEqual(null);
  });
  test("No params for getDate function, Bug#9674", () => {
    const runner = new ExpressionRunner("getDate()");
    const values: any = {};
    expect(runner.runValues(values), "Empty paramsters, #1").toLooseEqual(null);
  });
  test("Operand.addOperandsToList", () => {
    let operand = new ConditionsParser().parseExpression("{a} + {b}");
    let list: any[] = [];
    operand.addOperandsToList(list);
    expect(list.length, "operands in the list #1").toLooseEqual(3);
    operand = new ConditionsParser().parseExpression("func({a}, 'd', 3) * 4 + {b} > 0");
    list = [];
    operand.addOperandsToList(list);
    expect(list.length, "operands in the list #1").toLooseEqual(11);
  });
  test("ExpressionRunner vs context", () => {
    const runner = new ExpressionRunner("{a} + {b}");
    expect(runner.runContext(new VariableGetterContext({ a: 1, b: 2 })), "#1").toLooseEqual(3);
  });
  test("Condition vs not boolean, Bug#10412", () => {
    const exp = "(age({a}) >= 18) and !{b} and !{c}";
    const operand = new ConditionsParser().parseExpression(exp);
    expect(operand.toString(), "the expression is valid").toLooseEqual("(((age({a}) >= 18) and ! {b}) and ! {c})");
    const runner = new ExpressionRunner(exp);
    expect(runner.runContext(new VariableGetterContext({ a: "2000-01-01", b: false, c: false })), "#1").toLooseEqual(true);
    expect(runner.runContext(new VariableGetterContext({ a: "2000-01-01", b: true, c: false })), "#2").toLooseEqual(false);
    expect(runner.runContext(new VariableGetterContext({ a: "2000-01-01", b: "false", c: false })), "#3").toLooseEqual(true);
    expect(runner.runContext(new VariableGetterContext({ a: "2000-01-01", b: "true", c: false })), "#4").toLooseEqual(false);
    expect(runner.runContext(new VariableGetterContext({ a: "2000-01-01", b: true, c: true })), "#5").toLooseEqual(false);

    expect(runner.runContext(new VariableGetterContext({ a: "2020-01-01", b: false, c: false })), "#6").toLooseEqual(false);
    expect(runner.runContext(new VariableGetterContext({ a: "2020-01-01", b: true, c: false })), "#7").toLooseEqual(false);
    expect(runner.runContext(new VariableGetterContext({ a: "2020-01-01", b: "false", c: false })), "#8").toLooseEqual(false);
    expect(runner.runContext(new VariableGetterContext({ a: "2020-01-01", b: "true", c: false })), "#9").toLooseEqual(false);
    expect(runner.runContext(new VariableGetterContext({ a: "2020-01-01", b: true, c: true })), "#10").toLooseEqual(false);
  });
  test("Unary not !, Bug#10412", () => {
    const exp = "!{b} and !{c}";
    const operand = new ConditionsParser().parseExpression(exp);
    expect(operand.toString(), "the expression is valid").toLooseEqual("(! {b} and ! {c})");
    const runner = new ExpressionRunner(exp);
    expect(runner.runContext(new VariableGetterContext({ b: false, c: false })), "#1").toLooseEqual(true);
    expect(runner.runContext(new VariableGetterContext({ b: true, c: false })), "#3").toLooseEqual(false);
    expect(runner.runContext(new VariableGetterContext({ b: "false", c: false })), "#5").toLooseEqual(true);
    expect(runner.runContext(new VariableGetterContext({ b: "true", c: false })), "#6").toLooseEqual(false);
  });
  test("Work with objects like constants, Bug#10448", () => {
    let runner = new ExpressionRunner("{\"key\": 1}");
    expect(runner.runContext(new VariableGetterContext({})), "#1").toEqualValues({ key: 1 });
    runner = new ExpressionRunner("{\"key\": \"value\"} = {\"key\": \"value\"}");
    expect(runner.runContext(new VariableGetterContext({})), "#2").toLooseEqual(true);
    runner = new ExpressionRunner("{\"key\": \"value\"} = {\"key\": \"value1\"}");
    expect(runner.runContext(new VariableGetterContext({})), "#3").toLooseEqual(false);
  });
});

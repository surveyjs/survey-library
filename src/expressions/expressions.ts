import { HashTable, Helpers } from "../helpers";
import { FunctionFactory } from "../functionsfactory";
import { ProcessValue } from "../conditionProcessValue";
import { equal } from "assert";

export abstract class Operand {
  public toString(func: (op: Operand) => string = undefined): string {
    return "";
  }
  public abstract getType(): string;
  public abstract evaluate(processValue?: ProcessValue): any;
  public abstract setVariables(variables: Array<string>): any;
  public hasFunction(): boolean {
    return false;
  }
  public hasAsyncFunction() {
    return false;
  }
  public addToAsyncList(list: Array<FunctionOperand>): void {}
}

export class BinaryOperand extends Operand {
  private consumer: Function;
  private isArithmeticValue: boolean;
  constructor(
    private operatorName: string,
    private left: any = null,
    private right: any = null,
    isArithmeticOp: boolean = false
  ) {
    super();
    this.isArithmeticValue = isArithmeticOp;
    if (isArithmeticOp) {
      this.consumer = OperandMaker.binaryFunctions["arithmeticOp"](
        operatorName
      );
    } else {
      this.consumer = OperandMaker.binaryFunctions[operatorName];
    }

    if (this.consumer == null) {
      OperandMaker.throwInvalidOperatorError(operatorName);
    }
  }
  public getType(): string {
    return "binary";
  }
  public get isArithmetic() {
    return this.isArithmeticValue;
  }
  public get isConjunction() {
    return this.operatorName == "or" || this.operatorName == "and";
  }
  public get conjunction(): string {
    return this.isConjunction ? this.operatorName : "";
  }
  public get operator(): string {
    return this.operatorName;
  }
  public get leftOperand() {
    return this.left;
  }
  public get rightOperand() {
    return this.right;
  }

  private evaluateParam(x: any, processValue?: ProcessValue): any {
    return x == null ? null : x.evaluate(processValue);
  }

  public evaluate(processValue?: ProcessValue): any {
    return this.consumer.call(
      this,
      this.evaluateParam(this.left, processValue),
      this.evaluateParam(this.right, processValue)
    );
  }

  public toString(func: (op: Operand) => string = undefined): string {
    if (!!func) {
      var res = func(this);
      if (!!res) return res;
    }
    return (
      "(" +
      OperandMaker.safeToString(this.left, func) +
      " " +
      OperandMaker.operatorToString(this.operatorName) +
      " " +
      OperandMaker.safeToString(this.right, func) +
      ")"
    );
  }

  public setVariables(variables: Array<string>) {
    if (this.left != null) this.left.setVariables(variables);
    if (this.right != null) this.right.setVariables(variables);
  }

  public hasFunction(): boolean {
    return (
      (!!this.left && this.left.hasFunction()) ||
      (!!this.right && this.right.hasFunction())
    );
  }
  public hasAsyncFunction(): boolean {
    return (
      (!!this.left && this.left.hasAsyncFunction()) ||
      (!!this.right && this.right.hasAsyncFunction())
    );
  }
  public addToAsyncList(list: Array<FunctionOperand>) {
    if (!!this.left) this.left.addToAsyncList(list);
    if (!!this.right) this.right.addToAsyncList(list);
  }
}

export class UnaryOperand extends Operand {
  private consumer: Function;
  constructor(private expressionValue: Operand, private operatorName: string) {
    super();
    this.consumer = OperandMaker.unaryFunctions[operatorName];
    if (this.consumer == null) {
      OperandMaker.throwInvalidOperatorError(operatorName);
    }
  }
  public get operator(): string {
    return this.operatorName;
  }
  public get expression(): Operand {
    return this.expressionValue;
  }
  public getType(): string {
    return "unary";
  }
  public toString(func: (op: Operand) => string = undefined): string {
    if (!!func) {
      var res = func(this);
      if (!!res) return res;
    }
    return (
      OperandMaker.operatorToString(this.operatorName) +
      " " +
      this.expression.toString(func)
    );
  }

  public evaluate(processValue?: ProcessValue): boolean {
    let value = this.expression.evaluate(processValue);
    return this.consumer.call(this, value);
  }

  public setVariables(variables: Array<string>) {
    this.expression.setVariables(variables);
  }
}

export class ArrayOperand extends Operand {
  constructor(public values: Array<Operand>) {
    super();
  }
  public getType(): string {
    return "array";
  }
  public toString(func: (op: Operand) => string = undefined): string {
    if (!!func) {
      var res = func(this);
      if (!!res) return res;
    }
    return (
      "[" +
      this.values
        .map(function (el: Operand) {
          return el.toString(func);
        })
        .join(", ") +
      "]"
    );
  }

  public evaluate(processValue?: ProcessValue): Array<any> {
    return this.values.map(function (el: Operand) {
      return el.evaluate(processValue);
    });
  }

  public setVariables(variables: Array<string>) {
    this.values.forEach((el) => {
      el.setVariables(variables);
    });
  }

  public hasFunction(): boolean {
    return this.values.some((operand) => operand.hasFunction());
  }
  public hasAsyncFunction(): boolean {
    return this.values.some((operand) => operand.hasAsyncFunction());
  }
  public addToAsyncList(list: Array<FunctionOperand>) {
    this.values.forEach((operand) => operand.addToAsyncList(list));
  }
}

export class Const extends Operand {
  constructor(private value: any) {
    super();
  }
  public getType(): string {
    return "const";
  }
  public toString(func: (op: Operand) => string = undefined): string {
    if (!!func) {
      var res = func(this);
      if (!!res) return res;
    }
    return this.value.toString();
  }
  public get correctValue(): any {
    return this.getCorrectValue(this.value);
  }

  public evaluate(): any {
    return this.getCorrectValue(this.value);
  }

  public setVariables(variables: Array<string>) {}
  protected getCorrectValue(value: any): any {
    if (!value || typeof value != "string") return value;
    if (this.isBooleanValue(value)) return value.toLowerCase() === "true";
    if (OperandMaker.isNumeric(value)) {
      if (value.indexOf("0x") == 0) return parseInt(value);
      return parseFloat(value);
    }
    return value;
  }
  private isBooleanValue(value: any): boolean {
    return (
      value &&
      (value.toLowerCase() === "true" || value.toLowerCase() === "false")
    );
  }
}

export class Variable extends Const {
  constructor(private variableName: string) {
    super(variableName);
  }
  public getType(): string {
    return "variable";
  }
  public toString(func: (op: Operand) => string = undefined): string {
    if (!!func) {
      var res = func(this);
      if (!!res) return res;
    }
    return "{" + this.variableName + "}";
  }
  public get variable() {
    return this.variableName;
  }

  public evaluate(processValue?: ProcessValue): any {
    return processValue.hasValue(this.variableName)
      ? this.getCorrectValue(processValue.getValue(this.variableName))
      : null;
  }
  public setVariables(variables: Array<string>) {
    variables.push(this.variableName);
  }
}

export class FunctionOperand extends Operand {
  private isReadyValue: boolean;
  private asynResult: any;
  public onAsyncReady: () => void;
  constructor(
    private origionalValue: string,
    private parameters: ArrayOperand
  ) {
    super();
    this.isReadyValue = false;
    if (Array.isArray(parameters) && parameters.length === 0) {
      this.parameters = new ArrayOperand([]);
    }
  }
  public getType(): string {
    return "function";
  }
  public evaluateAsync(processValue: ProcessValue) {
    this.isReadyValue = false;
    var asyncProcessValue = new ProcessValue();
    asyncProcessValue.values = Helpers.createCopy(processValue.values);
    asyncProcessValue.properties = Helpers.createCopy(processValue.properties);
    asyncProcessValue.properties.returnResult = (result: any) => {
      this.asynResult = result;
      this.isReadyValue = true;
      this.onAsyncReady();
    };
    this.evaluateCore(asyncProcessValue);
  }
  public evaluate(processValue?: ProcessValue): any {
    if (this.isReady) return this.asynResult;
    return this.evaluateCore(processValue);
  }
  private evaluateCore(processValue?: ProcessValue): any {
    return FunctionFactory.Instance.run(
      this.origionalValue,
      this.parameters.evaluate(processValue),
      processValue.properties
    );
  }

  public toString(func: (op: Operand) => string = undefined) {
    if (!!func) {
      var res = func(this);
      if (!!res) return res;
    }
    return this.origionalValue + "(" + this.parameters.toString(func) + ")";
  }

  public setVariables(variables: Array<string>) {
    this.parameters.setVariables(variables);
  }
  public get isReady() {
    return this.isReadyValue;
  }
  public hasFunction(): boolean {
    return true;
  }
  public hasAsyncFunction(): boolean {
    return FunctionFactory.Instance.isAsyncFunction(this.origionalValue);
  }
  public addToAsyncList(list: Array<FunctionOperand>) {
    if (this.hasAsyncFunction()) {
      list.push(this);
    }
  }
}

export class OperandMaker {
  static throwInvalidOperatorError(op: string) {
    throw new Error("Invalid operator: '" + op + "'");
  }

  static safeToString(operand: Operand, func: (op: Operand) => string): string {
    return operand == null ? "" : operand.toString(func);
  }

  static toOperandString(value: string): string {
    if (
      !!value &&
      !OperandMaker.isNumeric(value) &&
      !OperandMaker.isBooleanValue(value)
    )
      value = "'" + value + "'";
    return value;
  }

  static isSpaceString(str: string): boolean {
    return !!str && !str.replace(" ", "");
  }

  static isNumeric(value: string): boolean {
    if (
      !!value &&
      (value.indexOf("-") > -1 ||
        value.indexOf("+") > 1 ||
        value.indexOf("*") > -1 ||
        value.indexOf("^") > -1 ||
        value.indexOf("/") > -1 ||
        value.indexOf("%") > -1)
    )
      return false;
    if (OperandMaker.isSpaceString(value)) return false;
    return Helpers.isNumber(value);
  }

  static isBooleanValue(value: string): boolean {
    return (
      !!value &&
      (value.toLowerCase() === "true" || value.toLowerCase() === "false")
    );
  }

  static unaryFunctions: HashTable<Function> = {
    empty: function (value: any): boolean {
      return Helpers.isValueEmpty(value);
    },
    notempty: function (value: any): boolean {
      return !OperandMaker.unaryFunctions.empty(value);
    },
    negate: function (value: boolean): boolean {
      return !value;
    },
  };

  static binaryFunctions: HashTable<Function> = {
    arithmeticOp(operatorName: string) {
      return function (a: any, b: any): any {
        if (Helpers.isValueEmpty(a) && !OperandMaker.isSpaceString(a)) {
          a = typeof b === "string" ? "" : 0;
        }
        if (Helpers.isValueEmpty(b) && !OperandMaker.isSpaceString(b)) {
          b = typeof a === "string" ? "" : 0;
        }

        let consumer = OperandMaker.binaryFunctions[operatorName];
        return consumer == null ? null : consumer.call(this, a, b);
      };
    },
    and: function (a: boolean, b: boolean): boolean {
      return a && b;
    },
    or: function (a: boolean, b: boolean): boolean {
      return a || b;
    },
    plus: function (a: any, b: any): any {
      return a + b;
    },
    minus: function (a: number, b: number): number {
      return a - b;
    },
    mul: function (a: number, b: number): number {
      return a * b;
    },
    div: function (a: number, b: number): number {
      if (!b) return null;
      return a / b;
    },
    mod: function (a: number, b: number): number {
      if (!b) return null;
      return a % b;
    },
    power: function (a: number, b: number): number {
      return Math.pow(a, b);
    },
    greater: function (left: any, right: any): boolean {
      if (left == null || right == null) return false;
      return left > right;
    },
    less: function (left: any, right: any): boolean {
      if (left == null || right == null) return false;
      return left < right;
    },
    greaterorequal: function (left: any, right: any): boolean {
      if (OperandMaker.binaryFunctions.equal(left, right)) return true;
      return OperandMaker.binaryFunctions.greater(left, right);
    },
    lessorequal: function (left: any, right: any): boolean {
      if (OperandMaker.binaryFunctions.equal(left, right)) return true;
      return OperandMaker.binaryFunctions.less(left, right);
    },
    equal: function (left: any, right: any): boolean {
      return Helpers.isTwoValueEquals(left, right, true);
    },
    notequal: function (left: any, right: any): boolean {
      return !Helpers.isTwoValueEquals(left, right, true);
    },
    contains: function (left: any, right: any): boolean {
      return OperandMaker.binaryFunctions.containsCore(left, right, true);
    },
    notcontains: function (left: any, right: any): boolean {
      if (!left && !Helpers.isValueEmpty(right)) return true;
      return OperandMaker.binaryFunctions.containsCore(left, right, false);
    },
    anyof: function (left: any, right: any): boolean {
      if (!left && Helpers.isValueEmpty(right)) return true;
      if (!left || (!Array.isArray(left) && left.length === 0)) return false;
      if (Helpers.isValueEmpty(right)) return true;
      if (!Array.isArray(left))
        return OperandMaker.binaryFunctions.contains(right, left);
      if (!Array.isArray(right))
        return OperandMaker.binaryFunctions.contains(left, right);
      for (var i = 0; i < right.length; i++) {
        if (OperandMaker.binaryFunctions.contains(left, right[i])) return true;
      }
      return false;
    },
    allof: function (left: any, right: any): boolean {
      if (!left && !Helpers.isValueEmpty(right)) return false;
      if (!Array.isArray(right))
        return OperandMaker.binaryFunctions.contains(left, right);
      for (var i = 0; i < right.length; i++) {
        if (!OperandMaker.binaryFunctions.contains(left, right[i]))
          return false;
      }
      return true;
    },
    containsCore: function (left: any, right: any, isContains: any): boolean {
      if (!left) return false;
      if (!left.length) {
        left = left.toString();
      }
      if (typeof left === "string" || left instanceof String) {
        if (!right) return false;
        right = right.toString();
        var found = left.indexOf(right) > -1;
        return isContains ? found : !found;
      }
      var rightArray = Array.isArray(right) ? right : [right];
      for (var rIndex = 0; rIndex < rightArray.length; rIndex++) {
        var i = 0;
        right = rightArray[rIndex];
        for (; i < left.length; i++) {
          if (Helpers.isTwoValueEquals(left[i], right)) break;
        }
        if (i == left.length) return !isContains;
      }
      return isContains;
    },
  };

  static operatorToString(operatorName: string): string {
    let opStr = OperandMaker.signs[operatorName];
    return opStr == null ? operatorName : opStr;
  }

  static signs: HashTable<string> = {
    less: "<",
    lessorequal: "<=",
    greater: ">",
    greaterorequal: ">=",
    equal: "==",
    notequal: "!=",
    plus: "+",
    minus: "-",
    mul: "*",
    div: "/",
    and: "and",
    or: "or",
    power: "^",
    mod: "%",
    negate: "!",
  };
}

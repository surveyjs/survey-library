import { HashTable, Helpers } from "../helpers";
import { FunctionFactory } from "../functionsfactory";
import { ProcessValue } from "../conditionProcessValue";

export interface Operand {
    toString(): string;
    evaluate(processValue?: ProcessValue): any;
}

export class BinaryOperand implements Operand {
    private consumer: Function;
    constructor(
        private operatorName: string,
        private left: any = null,
        private right: any = null,
        private isArithmeticOp: boolean = false
    ) {
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

    public toString(): string {
        return (
            "(" +
            OperandMaker.safeToString(this.left) +
            " " +
            OperandMaker.operatorToString(this.operatorName) +
            " " +
            OperandMaker.safeToString(this.right) +
            ")"
        );
    }
}

export class UnaryOperand implements Operand {
    private consumer: Function;
    constructor(private expression: Operand, private operatorName: string) {
        this.consumer = OperandMaker.unaryFunctions[operatorName];
        if (this.consumer == null) {
            OperandMaker.throwInvalidOperatorError(operatorName);
        }
    }

    public toString(): string {
        return (
            OperandMaker.operatorToString(this.operatorName) +
            this.expression.toString()
        );
    }

    public evaluate(processValue?: ProcessValue): boolean {
        let value = this.expression.evaluate(processValue);
        return this.consumer.call(this, value);
    }
}

export class ArrayOperand implements Operand {
    constructor(private values: Array<Operand>) {}

    public toString(): string {
        return (
            "[" +
            this.values
                .map(function(el: Operand) {
                    return el.toString();
                })
                .join(", ") +
            "]"
        );
    }

    public evaluate(processValue?: ProcessValue): Array<any> {
        return this.values.map(function(el: Operand) {
            return el.evaluate(processValue);
        });
    }
}

export class Const implements Operand {
    constructor(private value: any) {}

    public toString(): string {
        return this.value.toString();
    }

    public evaluate(): any {
        return this.value;
    }
}

export class Variable implements Operand {
    constructor(private variableName: string) {}

    public toString(): string {
        return "{" + this.variableName + "}";
    }

    public evaluate(processValue?: ProcessValue): any {
        return processValue.hasValue(this.variableName)
            ? processValue.getValue(this.variableName)
            : null;
    }
}

export class FunctionOperand implements Operand {
    constructor(
        private origionalValue: string,
        private parameters: ArrayOperand
    ) {}

    public evaluate(processValue?: ProcessValue): any {
        return FunctionFactory.Instance.run(
            this.origionalValue,
            this.parameters.evaluate(processValue),
            processValue.properties
        );
    }

    public toString() {
        return this.origionalValue + "(" + this.parameters.toString() + ")";
    }
}

export class OperandMaker {
    static throwInvalidOperatorError(op: string) {
        throw new Error("Invalid operator: '" + op + "'");
    }

    static safeToString(operand: Operand): string {
        return operand == null ? "" : operand.toString();
    }

    static unaryFunctions: HashTable<Function> = {
        negate: function(value: boolean): boolean {
            return !value;
        }
    };

    static binaryFunctions: HashTable<Function> = {
        arithmeticOp(operatorName: string) {
            return function(a: any, b: any): any {
                if (Helpers.isValueEmpty(a)) a = 0;
                if (Helpers.isValueEmpty(b)) b = 0;

                let consumer = OperandMaker.binaryFunctions[operatorName];
                return consumer == null ? null : consumer.call(this, a, b);
            };
        },
        and: function(a: boolean, b: boolean): boolean {
            return a && b;
        },
        or: function(a: boolean, b: boolean): boolean {
            return a || b;
        },
        plus: function(a: number, b: number): number {
            return a + b;
        },
        minus: function(a: number, b: number): number {
            return a - b;
        },
        mul: function(a: number, b: number): number {
            return a * b;
        },
        div: function(a: number, b: number): number {
            if (!b) return null;
            return a / b;
        },
        mod: function(a: number, b: number): number {
            if (!b) return null;
            return a % b;
        },
        power: function(a: number, b: number): number {
            return Math.pow(a, b);
        },
        greater: function(left: any, right: any): boolean {
            if (left == null || right == null) return false;
            return left > right;
        },
        less: function(left: any, right: any): boolean {
            if (left == null || right == null) return false;
            return left < right;
        },
        greaterorequal: function(left: any, right: any): boolean {
            if (left == null || right == null) return false;
            return left >= right;
        },
        lessorequal: function(left: any, right: any): boolean {
            if (left == null || right == null) return false;
            return left <= right;
        },
        equal: function(left: any, right: any): boolean {
            return Helpers.isTwoValueEquals(left, right, true);
        },
        notequal: function(left: any, right: any): boolean {
            return !Helpers.isTwoValueEquals(left, right, true);
        },
        empty: function(value: any): boolean {
            if (value == null) return true;
            return !value;
        },
        notempty: function(value: any): boolean {
            return !OperandMaker.binaryFunctions.empty(value);
        },
        contains: function(left: any, right: any): boolean {
            return OperandMaker.binaryFunctions.containsCore(left, right, true);
        },
        notcontains: function(left: any, right: any): boolean {
            if (!left && !Helpers.isValueEmpty(right)) return true;
            return OperandMaker.binaryFunctions.containsCore(
                left,
                right,
                false
            );
        },
        containsCore: function(
            left: any,
            right: any,
            isContains: any
        ): boolean {
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
                    if (left[i] == right) break;
                }
                if (i == left.length) return !isContains;
            }
            return isContains;
        }
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
        and: "&&",
        or: "||",
        power: "^",
        mod: "%",
        negate: "!"
    };
}

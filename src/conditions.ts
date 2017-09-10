import {HashTable} from './base';
import {ConditionsParser} from './conditionsParser';
import {FunctionFactory} from "./functionsfactory";
import {ProcessValue} from "./conditionProcessValue";

export class Operand {
    constructor(public origionalValue: any) {
    }
    public getValue(processValue: ProcessValue) {
        var val = this.origionalValue;
        if(val === undefined || val === 'undefined') return null;
        if (!val || (typeof val != "string")) return val;
        if(this.isBoolean(val)) return val.toLowerCase() == "true";
        val = this.removeQuotes(val);
        if(processValue) {
            var name = this.getValueName(val);
            if(name){
                if(!processValue.hasValue(name)) return null;
                return processValue.getValue(name);
            }
        }
        return val;
    }
    public operandToString() {
        var val = this.origionalValue;
        if (val && (!this.isNumeric(val) && !this.isBoolean(val))) val = "'" + val + "'";
        return val;
    }
    private removeQuotes(val: string): string {
        if (val.length > 0 && (val[0] == "'" || val[0] == '"')) val = val.substr(1);
        var len = val.length;
        if (len > 0 && (val[len - 1] == "'" || val[len - 1] == '"')) val = val.substr(0, len - 1);
        return val;
    }
    private getValueName(val: any) {
        if (val.length < 3 || val[0] != '{' || val[val.length - 1] != '}') return null;
        return val.substr(1, val.length - 2);
    }
    private isBoolean(value: string) : boolean {
        return value && (value.toLowerCase() === "true" || value.toLowerCase() === "false");
    }
    private isNumeric(value: string): boolean {
        var val = parseFloat(value);
        if (isNaN(val)) return false;
        return isFinite(val);
    }
}
export class FunctionOperand extends Operand {
    public parameters: Array<Operand> = new Array<Operand>();
    constructor(public origionalValue: any) {
        super(origionalValue);
    }
    public getValue(processValue: ProcessValue) {
        var paramValues = [];
        for(var i = 0; i < this.parameters.length; i ++) {
            paramValues.push(this.parameters[i].getValue(processValue));
        }
        return FunctionFactory.Instance.run(this.origionalValue, paramValues);
    }
    public operandToString() {
        var res = this.origionalValue + "("
        for(var i = 0; i < this.parameters.length; i ++) {
            if(i > 0) res += ", ";
            res += this.parameters[i].operandToString();
        }
        return res;
    }
}
export class Condition {
    static operatorsValue: HashTable<Function> = null;
    static get operators() {
        if (Condition.operatorsValue != null) return Condition.operatorsValue;
        Condition.operatorsValue = {
            empty: function (left, right) { 
                if(left == null) return true;
                return !left; },
            notempty: function (left, right) { 
                if(left == null) return false;
                return !(!left); 
            },
            equal: function (left, right) { 
                if(left == null && right != null || left != null && right == null) return false;
                if(left == null && right == null) return true;
                return left == right; 
            },
            notequal: function (left, right) { 
                if(left == null && right != null || left != null && right == null) return true;
                if(left == null && right == null) return false;
                return left != right; 
            },
            contains: function (left, right) { return (left != null) && left["indexOf"] && left.indexOf(right) > -1; },
            notcontains: function (left, right) { return (left == null) || !left["indexOf"] || left.indexOf(right) == -1; },
            greater: function (left, right) { 
                if(left == null) return false;
                if(right == null) return true;
                return left > right; 
            },
            less: function (left, right) { 
                if(right == null) return false;
                if(left == null) return true;
                return left < right; 
            },
            greaterorequal: function (left, right) { 
                if(left == null && right != null) return false;
                if(right == null) return true;
                return left >= right; 
            },
            lessorequal: function (left, right) { 
                if(left != null && right == null) return false;
                if(left == null) return true;
                return left <= right; 
            }
        };
        return Condition.operatorsValue;
    }
    private opValue: string = "equal";
    private leftValue: Operand = null;
    private rightValue: Operand = null;
    public get left(): Operand { return this.leftValue; }
    public set left(val: Operand) { this.leftValue = val; }
    public get right(): Operand { return this.rightValue; }
    public set right(val: Operand) { this.rightValue = val; }
    public get operator(): string { return this.opValue; }
    public set operator(value: string) {
        if (!value) return;
        value = value.toLowerCase();
        if (!Condition.operators[value]) return;
        this.opValue = value;
    }
    public perform(left: any = null, right: any = null, processValue: ProcessValue = null): boolean {
        if (!left) left = this.left;
        if (!right) right = this.right;
        return this.performExplicit(left, right, processValue);
    }
    public performExplicit(left: any, right: any, processValue: ProcessValue) : boolean {
        var leftValue = left ? left.getValue(processValue) : null;
        if(!right && (leftValue === true || leftValue === false)) return leftValue;
        var rightValue = right ? right.getValue(processValue) : null;
        return Condition.operators[this.operator](leftValue, rightValue);
    }
}
export class ConditionNode {
    private connectiveValue: string = "and";
    public children: Array<any> = [];
    public constructor() { }
    public get connective(): string { return this.connectiveValue; }
    public set connective(value: string) {
        if (!value) return;
        value = value.toLowerCase();
        if (value == "&" || value == "&&") value = "and";
        if (value == "|" || value == "||") value = "or";
        if (value != "and" && value != "or") return;
        this.connectiveValue = value;
    }
    public get isEmpty() { return this.children.length == 0; }
    public clear() {
        this.children = [];
        this.connective = "and";
    }
}
export class ConditionRunner {
    private expressionValue: string;
    private processValue: ProcessValue;
    private root: ConditionNode;
    public constructor(expression: string) {
        this.root = new ConditionNode();
        this.expression = expression;
        this.processValue = new ProcessValue();
    }
    public get expression(): string { return this.expressionValue; }
    public set expression(value: string) {
        if (this.expression == value) return;
        this.expressionValue = value;
        new ConditionsParser().parse(this.expressionValue, this.root);
    }
    public run(values: HashTable<any>): boolean {
        this.processValue.values = values;
        return this.runNode(this.root);
    }
    private runNode(node: ConditionNode): boolean {
        var onFirstFail = node.connective == "and";
        for (var i = 0; i < node.children.length; i++) {
            var res = this.runNodeCondition(node.children[i]);
            if (!res && onFirstFail) return false;
            if (res && !onFirstFail) return true;
        }
        return onFirstFail;
    }
    private runNodeCondition(value: any): boolean {
        if (value["children"]) return this.runNode(value);
        if (value["left"]) return this.runCondition(value);
        return false;
    }
    private runCondition(condition: Condition): boolean {
        return condition.performExplicit(condition.left, condition.right, this.processValue);
    }
}

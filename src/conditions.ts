import {HashTable} from './base';
import {ConditionsParser} from './conditionsParser';
import {ProcessValue} from "./conditionProcessValue";

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
    public left: any = null;
    public right: any = null;
    public get operator(): string { return this.opValue; }
    public set operator(value: string) {
        if (!value) return;
        value = value.toLowerCase();
        if (!Condition.operators[value]) return;
        this.opValue = value;
    }
    public perform(left: any = null, right: any = null): boolean {
        if (!left) left = this.left;
        if (!right) right = this.right;
        return this.performExplicit(left, right);
    }
    public performExplicit(left: any, right: any) : boolean {
        return Condition.operators[this.operator](this.getPureValue(left), this.getPureValue(right));
    }
    private getPureValue(val: any): any {
        if(val === undefined) return null;
        if (!val || (typeof val != "string")) return val;
        var str = "";
        if (val.length > 0 && (val[0] == "'" || val[0] == '"'))  val = val.substr(1);
        var len = val.length;
        if (len > 0 && (val[len - 1] == "'" || val[len - 1] == '"'))  val = val.substr(0, len - 1);
        return val;
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
    private values: HashTable<any>;
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
        this.values = values;
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
        var left = condition.left;
        var name = this.getValueName(left);
        if (name) {
            left = this.getValueByName(name);
        }
        var right = condition.right;
        name = this.getValueName(right);
        if (name) {
            right = this.getValueByName(name);
        }
        return condition.performExplicit(left, right);
    }
    private getValueByName(name: string) {
        if (!this.processValue.hasValue(name, this.values)) return null;
        return this.processValue.getValue(name, this.values);
    }
    private getValueName(nodeValue: any) {
        if (!nodeValue) return null;
        if (typeof nodeValue !== 'string') return null;
        if (nodeValue.length < 3 || nodeValue[0] != '{' || nodeValue[nodeValue.length - 1] != '}') return null;
        return nodeValue.substr(1, nodeValue.length - 2);
    }
}

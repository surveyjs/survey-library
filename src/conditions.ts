/// <reference path="base.ts" />
module Survey {

    export class Condition extends Base {
        static operatorsValue: HashTable<Function> = null;
        static get operators() {
            if (Condition.operatorsValue != null) return Condition.operatorsValue;
            Condition.operatorsValue = {
                empty: function (left, right) { return !left; },
                notempty: function (left, right) { return !(!left); },
                equal: function (left, right) { return left == right; },
                notequal: function (left, right) { return left != right; },
                contains: function (left, right) { return left && left["indexOf"] && left.indexOf(right) > -1; },
                notcontains: function (left, right) { return !left || !left["indexOf"] || left.indexOf(right) == -1; },
                greater: function (left, right) { return left > right; },
                less: function (left, right) { return left < right; },
                greaterorequal: function (left, right) { return left >= right; },
                lessorequal: function (left, right) { return left <= right; }
            };
            return Condition.operatorsValue;
        }
        private opValue: string = "equal";
        public left: any;
        public right: any;
        constructor() {
            super();
        }
        public getType(): string { return "Condition"; }
        public get operator(): string { return this.opValue; }
        public set operator(value: string) {
            if (!value) return;
            value = value.toLowerCase();
            if (!Condition.operators[value]) return;
            this.opValue = value;
        }
        public perform(): boolean {
            return Condition.operators[this.operator](this.left, this.right);
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
        public clear() {
            this.children = [];
            this.connective = "and";
        }
    }
}
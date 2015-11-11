/// <reference path="base.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class Trigger extends Base {
        static operatorsValue: HashTable<Function> = null;
        static get operators() {
            if (Trigger.operatorsValue != null) return Trigger.operatorsValue;
            Trigger.operatorsValue = {
                empty: function (value, expectedValue) { return !value; },
                notempty: function (value, expectedValue) { return !(!value); },
                equal: function (value, expectedValue) { return value == expectedValue; },
                notequal: function (value, expectedValue) { return value != expectedValue; },
                greater: function (value, expectedValue) { return value > expectedValue; },
                less: function (value, expectedValue) { return value < expectedValue; },
                greaterorequal: function (value, expectedValue) { return value >= expectedValue; },
                lessorequal: function (value, expectedValue) { return value <= expectedValue; }
            };
            return Trigger.operatorsValue;
        }
        private opValue: string = "equal";
        public value: any;
        constructor() {
            super();
        }
        public get operator(): string { return this.opValue; }
        public set operator(value: string) {
            if (!value) return;
            value = value.toLowerCase();
            if (!Trigger.operators[value]) return;
            this.opValue = value;
        }
        public check(value: any) {
            if (Trigger.operators[this.operator](value, this.value)) {
                this.onSuccess();
            } else {
                this.onFailure();
            }
        }
        protected onSuccess() { }
        protected onFailure() { }
    }

    export interface ISurveyTriggerOwner {
        getObjects(pages: string[], questions: string[]): any[];
    }

    export class SurveyTrigger extends Trigger {
        public name: string;
        public pages: string[] = [];
        public questions: string[] = [];
        private owner: ISurveyTriggerOwner = null;
        constructor() {
            super();
        }
        public setOwner(owner: ISurveyTriggerOwner) {
            this.owner = owner;
        }
        protected onSuccess() { this.onTrigger(this.onItemSuccess); }
        protected onFailure() { this.onTrigger(this.onItemFailure); }
        onTrigger(func: Function) {
            if (!this.owner) return;
            var objects = this.owner.getObjects(this.pages, this.questions);
            for (var i = 0; i < objects.length; i++) {
                func(objects[i]);
            }
        }
        protected onItemSuccess(item: any) { }
        protected onItemFailure(item: any) { }
    }

    export class SurveyTriggerVisible extends SurveyTrigger {
        constructor() {
            super();
        }
        public getType(): string { return "visibletrigger"; }
        protected onItemSuccess(item: any) { item.visible = true; }
        protected onItemFailure(item: any) { item.visible = false; }
    }

    JsonObject.metaData.addClass("trigger", ["operator", "!value"]);
    JsonObject.metaData.addClass("surveytrigger", ["!name", "pages", "questions"], null, "trigger");
    JsonObject.metaData.addClass("visibletrigger", [], function () { return new SurveyTriggerVisible(); }, "surveytrigger");
}
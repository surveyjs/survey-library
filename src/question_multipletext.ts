// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export interface IMultipleTextData {
        getMultipleTextValue(name: string): any;
        setMultipleTextValue(name: string, value: any);
    }

    export class MultipleTextItem extends Base implements IValidatorOwner {
        private data: IMultipleTextData;
        private titleValue: string;
        private isKOValueUpdating = false;
        koValue: any;
        validators: Array<SurveyValidator> = new Array<SurveyValidator>();

        constructor(public name: any = null, title: string = null) {
            super();
            this.title = title;
            if (this.isKO) {
                this.koValue = ko.observable(this.value);
                var self = this;
                this.koValue.subscribe(function (newValue) {
                    if (!self.isKOValueUpdating) {
                        self.value = newValue;
                    }
                });
            }
        }
        public getType(): string {
            return "multipletextitem";
        }
        setData(data: IMultipleTextData) {
            this.data = data;
        }
        public get title() { return this.titleValue ? this.titleValue : this.name;  }
        public set title(newText: string) { this.titleValue = newText; }
        public get value() {
            return this.data ? this.data.getMultipleTextValue(this.name) : null;
        }
        public set value(value: any) {
            if (this.data != null) {
                this.data.setMultipleTextValue(this.name, value);
            }
        }
        onValueChanged(newValue: any) {
            if (this.isKO) {
                this.isKOValueUpdating = true;
                this.koValue(newValue);
                this.isKOValueUpdating = false;
            }
        }
        //IValidatorOwner
        getValidatorTitle(): string { return this.title; }
    }

    export class QuestionMultipleText extends Question implements IMultipleTextData {
        public itemSize: number = 25;
        public items: Array<MultipleTextItem> = new Array<MultipleTextItem>();
        constructor(public name: string) {
            super(name);
            var self = this;
            this.items.push = function (value) {
                value.setData(self);
                return Array.prototype.push.call(this, value);
            };
        }
        public getType(): string {
            return "multipletext";
        }
        public AddItem(name: string, title: string = null): MultipleTextItem {
            var item = new MultipleTextItem(name, title);
            this.items.push(item);
            return item;
        }
        private isMultipleItemValueChanging = false;
        protected onValueChanged() {
            super.onValueChanged();
            this.onItemValueChanged();
        }
        protected setkoValue(newValue: any) {
            super.setkoValue(newValue);
            this.onItemValueChanged();
        }
        protected onItemValueChanged() {
            if (this.isMultipleItemValueChanging) return;
            for (var i = 0; i < this.items.length; i++) {
                var itemValue = null;
                if (this.value && (this.items[i].name in this.value)) {
                    itemValue = this.value[this.items[i].name];
                }
                this.items[i].onValueChanged(itemValue);
            }
        }
        protected runValidators(): SurveyError {
            var error = super.runValidators();
            if (error != null) return error;
            for (var i = 0; i < this.items.length; i++) {
                error = new ValidatorRunner().run(this.items[i]);
                if (error != null) return error;
            }
            return null;
        }
       //IMultipleTextData
        getMultipleTextValue(name: string) {
            if (!this.value) return null;
            return this.value[name];
        }
        setMultipleTextValue(name: string, value: any) {
            this.isMultipleItemValueChanging = true;
            var newValue = this.value;
            if (!newValue) {
                newValue = {};
            }
            newValue[name] = value;
            this.setNewValue(newValue);
            this.isMultipleItemValueChanging = false;
        }
    }
    JsonObject.metaData.addClass("multipletextitem", ["name", "title", "validators:validators"], function () { return new MultipleTextItem(""); });
    JsonObject.metaData.setPropertyClassInfo("multipletextitem", "validators", "surveyvalidator", "validator");
    JsonObject.metaData.setPropertyValues("multipletextitem", "title", null, null,
        function (obj: any) { return obj.titleValue; });

    JsonObject.metaData.addClass("multipletext", ["!items:textitems", "itemSize:number"], function () { return new QuestionMultipleText(""); }, "question");
    JsonObject.metaData.setPropertyValues("multipletext", "items", "multipletextitem");
    JsonObject.metaData.setPropertyValues("multipletext", "itemSize", null, 25);
    QuestionFactory.Instance.registerQuestion("multipletext", (name) => { var q = new QuestionMultipleText(name); q.AddItem("text1"); q.AddItem("text2"); return q; });
}
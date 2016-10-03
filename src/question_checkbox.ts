// <reference path="question.ts" />
// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
namespace Survey {
    export class QuestionCheckboxModel extends QuestionCheckboxBase {
        constructor(public name: string) {
            super(name);
        }
        protected getHasOther(val: any): boolean {
            if (!val) return false;
            return val.indexOf(this.otherItem.value) >= 0;
        }
        protected valueFromDataCore(val: any): any {
            if (!val || !val.length) return val;

            for (var i = 0; i < val.length; i++) {
                if (val[i] == this.otherItem.value) return val;
                if (this.hasUnknownValue(val[i])) {
                    this.comment = val[i];
                    var newVal = val.slice();
                    newVal[i] = this.otherItem.value;
                    return newVal;
                }
            }
            return val;
        }
        protected valueToDataCore(val: any): any {
            if (!val || !val.length) return val;
            for (var i = 0; i < val.length; i++) {
                if (val[i] == this.otherItem.value) {
                    if (this.getComment()) {
                        var newVal = val.slice();
                        newVal[i] = this.getComment();
                        return newVal;
                    }
                }
            }
            return val;
        }
        public getType(): string {
            return "checkbox";
        }
    }
    JsonObject.metaData.addClass("checkbox", [], function () { return new QuestionCheckboxModel(""); }, "checkboxbase");
    QuestionFactory.Instance.registerQuestion("checkbox", (name) => { var q = new QuestionCheckboxModel(name); q.choices = QuestionFactory.DefaultChoices; return q; });
}
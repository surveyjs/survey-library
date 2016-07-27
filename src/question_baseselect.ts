// <reference path="question.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="surveystrings.ts" />
module Survey {
    export class QuestionSelectBase extends Question {
        private commentValue: string;
        protected cachedValue: any;
        otherItem: ItemValue = new ItemValue("other", surveyLocalization.getString("otherItemText"));
        public choicesValues: Array<ItemValue> = new Array<ItemValue>();
        public otherErrorText: string = null;
        public storeOthersAsComment: boolean = true;
        choicesOrderValue: string = "none";
        constructor(name: string) {
            super(name);
        }
        public get isOtherSelected(): boolean {
            return this.getStoreOthersAsComment() ? this.getHasOther(this.value) : this.getHasOther(this.cachedValue);
        }
        protected getHasOther(val: any): boolean {
            return val == this.otherItem.value;
        }
        protected getComment(): string {
            if (this.getStoreOthersAsComment()) return super.getComment();
            return this.commentValue;
        }
        private isSettingComment: boolean = false;
        protected setComment(newValue: string) {
            if (this.getStoreOthersAsComment())
                super.setComment(newValue)
            else {
                if (!this.isSettingComment && newValue != this.commentValue) {
                    this.isSettingComment = true;
                    this.commentValue = newValue;
                    if (this.isOtherSelected) {
                        this.setNewValueInData(this.cachedValue);
                    }
                    this.isSettingComment = false;
                }
            }
        }
        protected valueFromData(val: any): any {
            if (this.getStoreOthersAsComment()) return super.valueFromData(val);
            this.cachedValue = this.valueFromDataCore(val);
            return this.cachedValue;
        }
        protected valueToData(val: any): any {
            if (this.getStoreOthersAsComment()) return super.valueToData(val);
            this.cachedValue = val;
            return this.valueToDataCore(val);
        }
        protected valueFromDataCore(val: any): any {
            if (!this.hasUnknownValue(val)) return val;
            if (val == this.otherItem.value) return val;
            this.comment = val;
            return this.otherItem.value;
        }
        protected valueToDataCore(val: any): any {
            if (val == this.otherItem.value && this.getComment()) {
                val = this.getComment();
            }
            return val;
        }
        protected hasUnknownValue(val: any): boolean {
            if (!val) return false;
            for (var i = 0; i < this.choicesValues.length; i++) {
                if (this.choicesValues[i].value == val) return false;
            }
            return true;
        }
        get choices(): Array<any> { return this.choicesValues; }
        set choices(newValue: Array<any>) {
            ItemValue.setData(this.choicesValues, newValue);
        }
        get choicesOrder(): string { return this.choicesOrderValue; }
        set choicesOrder(newValue: string) {
            if (newValue == this.choicesOrderValue) return;
            this.choicesOrderValue = newValue;
        }
        get otherText(): string { return this.otherItem.text; }
        set otherText(value: string) { this.otherItem.text = value; }
        get visibleChoices(): Array<ItemValue> {
            if (!this.hasOther && this.choicesOrder == "none") return this.choices;
            var result = this.sortVisibleChoices(this.choices.slice());
            if (this.hasOther) {
                result.push(this.otherItem);
            }
            return result;
        }
        public supportComment(): boolean { return true; }
        public supportOther(): boolean { return true; }
        protected onCheckForErrors(errors: Array<SurveyError>) {
            super.onCheckForErrors(errors);
            if (!this.isOtherSelected || this.comment) return;
            var text = this.otherErrorText;
            if (!text) {
                text = surveyLocalization.getString("otherRequiredError");
            }
            errors.push(new CustomError(text));
        }
        protected getStoreOthersAsComment() { return this.storeOthersAsComment && (this.survey != null ? this.survey.storeOthersAsComment : true); }
        sortVisibleChoices(array: Array<ItemValue>): Array<ItemValue> {
            var order = this.choicesOrder.toLowerCase();
            if (order == "asc") return this.sortArray(array, 1);
            if (order == "desc") return this.sortArray(array, -1);
            if (order == "random") return this.randomizeArray(array);
            return array;
        }
        sortArray(array: Array<ItemValue>, mult: number): Array<ItemValue> {
            return array.sort(function (a, b) {
                if (a.text < b.text) return -1 * mult;
                if (a.text > b.text) return 1 * mult;
                return 0;
            });
        }
        randomizeArray(array: Array<ItemValue>): Array<ItemValue> {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }
    }

    export class QuestionCheckboxBase extends QuestionSelectBase {
        private colCountValue: number = 1;
        colCountChangedCallback: () => void;
        constructor(public name: string) {
            super(name);
        }
        public get colCount(): number { return this.colCountValue; }
        public set colCount(value: number) {
            if (value < 0 || value > 4) return;
            this.colCountValue = value;
            this.fireCallback(this.colCountChangedCallback);
        }
    }
    JsonObject.metaData.addClass("selectbase", ["hasComment:boolean", "hasOther:boolean", "!choices:itemvalues", "choicesOrder", "otherText", "otherErrorText", "storeOthersAsComment:boolean"], null, "question");
    JsonObject.metaData.setPropertyValues("selectbase", "choices", null, null,
        function (obj: any) { return ItemValue.getData(obj.choices); },
        function (obj: any, value: any) { ItemValue.setData(obj.choices, value); });
    JsonObject.metaData.setPropertyValues("selectbase", "choicesOrder", null, "none");
    JsonObject.metaData.setPropertyChoices("selectbase", "choicesOrder", ["none", "asc", "desc", "random"]);
    JsonObject.metaData.setPropertyValues("selectbase", "otherText", null, surveyLocalization.getString("otherItemText"));
    JsonObject.metaData.setPropertyValues("selectbase", "storeOthersAsComment", null, true);

    JsonObject.metaData.addClass("checkboxbase", ["colCount:number"], null, "selectbase");
    JsonObject.metaData.setPropertyValues("checkboxbase", "colCount", null, 1);
    JsonObject.metaData.setPropertyChoices("checkboxbase", "colCount", [0, 1, 2, 3, 4]);
}

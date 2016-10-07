/// <reference path="questionfactory.ts" />
/// <reference path="error.ts" />
/// <reference path="validator.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="questionbase.ts" />
/// <reference path="textPreProcessor.ts" />
module Survey {
    export class Question extends QuestionBase implements IValidatorOwner {
        private titleValue: string = null;
        private questionValue: any;
        private questionComment: string;
        private isRequiredValue: boolean = false;
        private hasCommentValue: boolean = false;
        private hasOtherValue: boolean = false;
        private commentTextValue: string = "";
        private textPreProcessor: TextPreProcessor;
        errors: Array<SurveyError> = [];
        validators: Array<SurveyValidator> = new Array<SurveyValidator>();
        valueChangedCallback: () => void;
        commentChangedCallback: () => void;
        errorsChangedCallback: () => void;
        titleChangedCallback: () => void;

        constructor(public name: string) {
            super(name);
        }
        public get hasTitle(): boolean { return true; }
        public get title(): string { return (this.titleValue) ? this.titleValue : this.name; }
        public set title(newValue: string) {
            this.titleValue = newValue;
            this.fireCallback(this.titleChangedCallback);
        }
        public get processedTitle() { return this.survey != null ? this.survey.processText(this.title) : this.title; }
        public get fullTitle(): string {
            if (this.survey && this.survey.questionTitleTemplate) {
                if (!this.textPreProcessor) {
                    var self = this;
                    this.textPreProcessor = new TextPreProcessor();
                    this.textPreProcessor.onHasValue = function (name: string) { return self.canProcessedTextValues(name.toLowerCase()); };
                    this.textPreProcessor.onProcess = function (name: string) { return self.getProcessedTextValue(name); };
                }
                return this.textPreProcessor.process(this.survey.questionTitleTemplate);
            }
            var requireText = this.requiredText;
            if (requireText) requireText += " ";
            var no = this.no;
            if (no) no += ". ";
            return no + requireText + this.processedTitle;
        }
        protected canProcessedTextValues(name: string): boolean {
            return name == "no" || name == "title" || name == "require";
        }
        protected getProcessedTextValue(name: string): any {
            if (name == "no") return this.no;
            if (name == "title") return this.processedTitle;
            if (name == "require") return this.requiredText;
            return null;
        }
        public supportComment(): boolean { return false; }
        public supportOther(): boolean { return false; }
        public get isRequired(): boolean { return this.isRequiredValue; }
        public set isRequired(val: boolean) {
            if (this.isRequired == val) return;
            this.isRequiredValue = val;
            this.fireCallback(this.titleChangedCallback);
        }
        public get hasComment(): boolean { return this.hasCommentValue; }
        public set hasComment(val: boolean) {
            if (!this.supportComment()) return;
            this.hasCommentValue = val;
            if (this.hasComment) this.hasOther = false;
        }
        public get commentText(): string { return this.commentTextValue ? this.commentTextValue : surveyLocalization.getString("otherItemText"); }
        public set commentText(value: string) {
            this.commentTextValue = value;
        }
        public get hasOther(): boolean { return this.hasOtherValue; }
        public set hasOther(val: boolean) {
            if (!this.supportOther() || this.hasOther == val) return;
            this.hasOtherValue = val;
            if (this.hasOther) this.hasComment = false;
            this.hasOtherChanged();
        }
        protected hasOtherChanged() { }
        protected get no(): string {
            if (this.visibleIndex < 0) return "";
            var startIndex = 1;
            var isNumeric = true;
            var str = "";
            if (this.survey && this.survey.questionStartIndex) {
                str = this.survey.questionStartIndex;
                if (parseInt(str)) startIndex = parseInt(str);
                else if (str.length == 1) isNumeric = false;
            }
            if (isNumeric) return (this.visibleIndex + startIndex).toString();
            return String.fromCharCode(str.charCodeAt(0) + this.visibleIndex);
        }
        protected onSetData() {
            super.onSetData();
            this.onSurveyValueChanged(this.value);
        }
        public get value(): any {
            return this.valueFromData(this.getValueCore());
        }
        public set value(newValue: any) {
            this.setNewValue(newValue);
            this.fireCallback(this.valueChangedCallback);
        }
        public get comment(): string { return this.getComment(); }
        public set comment(newValue: string) {
            if (this.comment == newValue) return;
            this.setComment(newValue);
            this.fireCallback(this.commentChangedCallback);
        }
        protected getComment(): string { return this.data != null ? this.data.getComment(this.name) : this.questionComment; }
        protected setComment(newValue: string) {
            this.setNewComment(newValue);
        }
        public isEmpty(): boolean { return this.value == null; }
        public hasErrors(fireCallback: boolean = true): boolean {
            this.checkForErrors(fireCallback);
            return this.errors.length > 0;
        }
        public get requiredText(): string { return this.survey != null && this.isRequired ? this.survey.requiredText : ""; }
        private checkForErrors(fireCallback: boolean) {
            var errorLength = this.errors ? this.errors.length : 0;
            this.errors = [];
            this.onCheckForErrors(this.errors);
            if (this.errors.length == 0 && this.value) {
                var error = this.runValidators();
                if (error) {
                    this.errors.push(error);
                }
            }
            if (this.survey && this.errors.length == 0) {
                var error = this.survey.validateQuestion(this.name);
                if (error) {
                    this.errors.push(error);
                }
            }
            if (fireCallback && (errorLength != this.errors.length || errorLength > 0)) {
                this.fireCallback(this.errorsChangedCallback);
            }
        }
        protected onCheckForErrors(errors: Array<SurveyError>) {
            if (this.hasRequiredError()) {
                this.errors.push(new AnswerRequiredError());
            }
        }
        protected hasRequiredError(): boolean {
            return this.isRequired && this.isEmpty();
        }
        protected runValidators(): SurveyError {
            return new ValidatorRunner().run(this);
        }
        private isValueChangedInSurvey = false;
        protected setNewValue(newValue: any) {
            this.setNewValueInData(newValue);
            this.onValueChanged();
        }
        protected setNewValueInData(newValue: any) {
            if (!this.isValueChangedInSurvey) {
                newValue = this.valueToData(newValue);
                this.setValueCore(newValue);
            }
        }
        private getValueCore() {
            return this.data != null ? this.data.getValue(this.name) : this.questionValue;
        }
        private setValueCore(newValue: any) {
            if (this.data != null) {
                this.data.setValue(this.name, newValue);
            } else {
                this.questionValue = newValue;
            }
        }
        protected valueFromData(val: any): any { return val; }
        protected valueToData(val: any): any { return val; }
        protected onValueChanged() { }
        protected setNewComment(newValue: string) {
            if (this.data != null) {
                this.data.setComment(this.name, newValue);
            } else this.questionComment = newValue;
        }
        //IQuestion
        onSurveyValueChanged(newValue: any) {
            this.isValueChangedInSurvey = true;
            this.value = this.valueFromData(newValue);
            this.fireCallback(this.commentChangedCallback);
            this.isValueChangedInSurvey = false;
        }
        //IValidatorOwner
        getValidatorTitle(): string { return null; }
   }
    JsonObject.metaData.addClass("question", [{ name: "title:text", onGetValue: function (obj: any) { return obj.titleValue; } },
        { name: "commentText", onGetValue: function (obj: any) { return obj.commentTextValue; } },
        "isRequired:boolean", { name: "validators:validators", baseClassName: "surveyvalidator", classNamePart: "validator"}], null, "questionbase");
}
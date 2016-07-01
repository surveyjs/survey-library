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
        private isRequiredValue: boolean = false;
        private hasCommentValue: boolean = false;
        private hasOtherValue: boolean = false;
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
        public get processedTitle() { return this.data != null ? this.data.processText(this.title) : this.title; }
        public get fullTitle(): string {
            if (this.data && this.data.questionTitleTemplate) {
                if (!this.textPreProcessor) {
                    var self = this;
                    this.textPreProcessor = new TextPreProcessor();
                    this.textPreProcessor.onHasValue = function (name: string) { return self.canProcessedTextValues(name.toLowerCase()); };
                    this.textPreProcessor.onProcess = function (name: string) { return self.getProcessedTextValue(name); };
                }
                return this.textPreProcessor.process(this.data.questionTitleTemplate);
            }
            var requireText = this.requiredText;
            if (requireText) requireText += " ";
            return this.no + ". " + requireText + this.processedTitle;
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
        public set isRequired(val: boolean) { this.isRequiredValue = val; }
        public get hasComment(): boolean { return this.hasCommentValue; }
        public set hasComment(val: boolean) {
            if (!this.supportComment()) return;
            this.hasCommentValue = val;
            if (this.hasComment) this.hasOther = false;
        }
        public get hasOther(): boolean { return this.hasOtherValue; }
        public set hasOther(val: boolean) {
            if (!this.supportOther()) return;
            this.hasOtherValue = val;
            if (this.hasOther) this.hasComment = false;
        }
        protected get no(): string {
            if (this.visibleIndex < 0) return "";
            var startIndex = 1;
            var isNumeric = true;
            var str = "";
            if (this.data && this.data.questionStartIndex) {
                str = this.data.questionStartIndex;
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
            if (this.data != null) return this.valueFromData(this.data.getValue(this.name));
            return this.questionValue;
        }
        public set value(newValue: any) {
            this.setNewValue(newValue);
            this.fireCallback(this.valueChangedCallback);
        }
        public get comment(): string { return this.getComment(); }
        public set comment(newValue: string) {
            this.setComment(newValue);
            this.fireCallback(this.commentChangedCallback);
        }
        protected getComment(): string { return this.data != null ? this.data.getComment(this.name) : ""; }
        protected setComment(newValue: string) {
            this.setNewComment(newValue);
        }
        public isEmpty(): boolean { return this.value == null; }
        public hasErrors(): boolean {
            this.checkForErrors();
            return this.errors.length > 0;
        }
        public get requiredText(): string { return this.data != null && this.isRequired ? this.data.requiredText : ""; }
        private checkForErrors() {
            var errorLength = this.errors ? this.errors.length : 0;
            this.errors = [];
            this.onCheckForErrors(this.errors);
            if (this.errors.length == 0) {
                var error = this.runValidators();
                if (error) {
                    this.errors.push(error);
                }
            }
            if (this.data && this.errors.length == 0) {
                var error = this.data.validateQuestion(this.name);
                if (error) {
                    this.errors.push(error);
                }
            }
            if (errorLength != this.errors.length || errorLength > 0) {
                this.fireCallback(this.errorsChangedCallback);
            }
        }
        protected onCheckForErrors(errors: Array<SurveyError>) {
            if (this.isRequired) {
                if (this.isEmpty()) {
                    this.errors.push(new AnswerRequiredError());
                }
            }
        }

        protected runValidators(): SurveyError {
            return new ValidatorRunner().run(this);
        }
        private isValueChangedInSurvey = false;
        protected setNewValue(newValue: any) {
            this.setNewValueInData(newValue);
            this.questionValue = newValue;
            this.onValueChanged();
        }
        protected setNewValueInData(newValue: any) {
            if (!this.isValueChangedInSurvey && this.data != null) {
                this.data.setValue(this.name, this.valueToData(newValue));
            }
        }
        protected valueFromData(val: any): any { return val; }
        protected valueToData(val: any): any { return val; }
        protected onValueChanged() { }
        protected setNewComment(newValue: string) {
            if (this.data != null) {
                this.data.setComment(this.name, newValue);
            }
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
    JsonObject.metaData.addClass("question", ["title", "isRequired:boolean", "validators:validators"], null, "questionbase");
    JsonObject.metaData.setPropertyValues("question", "title", null, null,
        function (obj: any) { return obj.titleValue; });
    JsonObject.metaData.setPropertyClassInfo("question", "validators", "surveyvalidator", "validator");
}
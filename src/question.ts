/// <reference path="questionfactory.ts" />
/// <reference path="error.ts" />
/// <reference path="validator.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="questionbase.ts" />
module Survey {
    export class Question extends QuestionBase implements IValidatorOwner {
        private titleValue: string = null;
        private questionValue: any;
        private isRequiredValue: boolean = false;
        private hasCommentValue: boolean = false;
        private hasOtherValue: boolean = false;
        errors: Array<SurveyError> = [];
        validators: Array<SurveyValidator> = new Array<SurveyValidator>();
        valueChangedCallback: () => void;
        commentChangedCallback: () => void;
        errorsChangedCallback: () => void;

        constructor(public name: string) {
            super(name);
        }
        public get hasTitle(): boolean { return true; }
        public get title(): string { return (this.titleValue) ? this.titleValue : this.name; }
        public set title(newValue: string) { this.titleValue = newValue; }
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
        protected onSetData() {
            super.onSetData();
            this.onSurveyValueChanged(this.value);
        }
        public get value(): any {
            if (this.data != null) return this.data.getValue(this.name);
            return this.questionValue;
        }
        public set value(newValue: any) {
            this.setNewValue(newValue);
            this.fireCallback(this.valueChangedCallback);
        }
        public get comment(): string { return this.data != null ? this.data.getComment(this.name) : ""; }
        public set comment(newValue: string) {
            this.setNewComment(newValue);
            this.fireCallback(this.commentChangedCallback);
        }
        public isEmpty(): boolean { return this.value == null; }
        public hasErrors(): boolean {
            this.checkForErrors();
            return this.errors.length > 0;
        }
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
            if (!this.isValueChangedInSurvey && this.data != null) {
                this.data.setValue(this.name, newValue);
            }
            this.questionValue = newValue;
            this.onValueChanged();
        }
        protected onValueChanged() { }
        private setNewComment(newValue: string) {
            if (this.data != null) {
                this.data.setComment(this.name, newValue);
            }
        }
        //IQuestion
        onSurveyValueChanged(newValue: any) {
            this.isValueChangedInSurvey = true;
            this.value = newValue;
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
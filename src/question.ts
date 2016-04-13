/// <reference path="questionfactory.ts" />
/// <reference path="error.ts" />
/// <reference path="validator.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class Question extends Base implements IQuestion, IValidatorOwner {
        protected data: ISurvey;
        private titleValue: string = null;
        private questionValue: any;
        private isRequiredValue: boolean = false;
        private hasCommentValue: boolean = false;
        private hasOtherValue: boolean = false;
        private visibleValue: boolean = true;
        private visibleIndexValue: number = -1;
        errors: Array<SurveyError> = [];
        validators: Array<SurveyValidator> = new Array<SurveyValidator>();
        public width: string = "100%";
        valueChangedCallback: () => void;
        commentChangedCallback: () => void;
        errorsChangedCallback: () => void;
        visibilityChangedCallback: () => void;
        visibleIndexChangedCallback: () => void;

        constructor(public name: string) {
            super();
            this.onCreating();
        }
        public get title() { return (this.titleValue) ? this.titleValue : this.name; }
        public set title(newValue: string) { this.titleValue = newValue; }
        public supportComment(): boolean { return false; }
        public supportOther(): boolean { return false; }
        get isRequired(): boolean { return this.isRequiredValue; }
        set isRequired(val: boolean) { this.isRequiredValue = val; }
        get visible(): boolean { return this.visibleValue; }
        set visible(val: boolean) {
            if (val == this.visible) return;
            this.visibleValue = val;
            this.fireCallback(this.visibilityChangedCallback);
            if (this.data) {
                this.data.questionVisibilityChanged(<IQuestion>this, this.visible);
            }
        }
        get visibleIndex(): number { return this.visibleIndexValue; }
        get hasComment(): boolean { return this.hasCommentValue; }
        set hasComment(val: boolean) {
            if (!this.supportComment()) return;
            this.hasCommentValue = val;
            if (this.hasComment) this.hasOther = false;
        }
        get hasOther(): boolean { return this.hasOtherValue; }
        set hasOther(val: boolean) {
            if (!this.supportOther()) return;
            this.hasOtherValue = val;
            if (this.hasOther) this.hasComment = false;
        }
        setData(newValue: ISurvey) {
            this.data = newValue;
            this.onSurveyValueChanged(this.value);
        }
        get value(): any {
            if (this.data != null) return this.data.getValue(this.name);
            return this.questionValue;
        }
        set value(newValue: any) {
            this.setNewValue(newValue);
            this.fireCallback(this.valueChangedCallback);
        }
        get comment(): string { return this.data != null ? this.data.getComment(this.name) : ""; }
        set comment(newValue: string) {
            this.setNewComment(newValue);
            this.fireCallback(this.commentChangedCallback);
        }
        isEmpty(): boolean { return this.value == null; }
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
        protected fireCallback(callback: () => void) {
            if (callback) callback();
        }
        protected onCreating() { }
        //IQuestion
        onSurveyValueChanged(newValue: any) {
            this.isValueChangedInSurvey = true;
            this.value = newValue;
            this.isValueChangedInSurvey = false;
        }
        setVisibleIndex(value: number) {
            if (this.visibleIndexValue == value) return;
            this.visibleIndexValue = value;
            this.fireCallback(this.visibleIndexChangedCallback);
        }
        //IValidatorOwner
        getValidatorTitle(): string { return null; }
   }
    JsonObject.metaData.addClass("question", ["!name", "title", "isRequired:boolean", "visible:boolean", "validators:validators", "width"]);
    JsonObject.metaData.setPropertyValues("question", "visible", null, true);
    JsonObject.metaData.setPropertyValues("question", "title", null, null,
        function (obj: any) { return obj.titleValue; });
    JsonObject.metaData.setPropertyValues("question", "width", null, "100%");
    JsonObject.metaData.setPropertyClassInfo("question", "validators", "surveyvalidator", "validator");
}
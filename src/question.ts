/// <reference path="questionfactory.ts" />
/// <reference path="error.ts" />
/// <reference path="validator.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="dragdrophelper.ts" />
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
        private dragDropHelperValue: DragDropHelper;
        errors: Array<SurveyError> = [];
        validators: Array<SurveyValidator> = new Array<SurveyValidator>();
        public width: string = "100%";
        koValue: any; koComment: any; koErrors: any; koVisible: any; koNo: any; dummyObservable: any;
        koOnClick: any; koIsSelected: any; 
        dragDrop: any; dragOver: any; dragStart: any;

        constructor(public name: string) {
            super();
            if (this.isKO) {
                this.koValue = this.createkoValue();
                this.koComment = ko.observable(this.comment);
                this.koErrors = ko.observableArray(this.errors);
                this.dummyObservable = ko.observable(0);
                var self = this;
                this.koVisible = ko.computed(function () { self.dummyObservable(); return self.visibleValue; });
                this.koNo = ko.computed(function () { self.dummyObservable(); return self.visibleIndexValue > -1 ? self.visibleIndexValue + 1 + ". " : ""; });
                this.koValue.subscribe(function (newValue) {
                    self.setNewValue(newValue);
                });
                this.koComment.subscribe(function (newValue) {
                    self.setNewComment(newValue);
                });
                this.dragOver = function (e) { self.doDragOver(e); }
                this.dragDrop = function (e) { self.doDragDrop(e); }
                this.dragStart = function (e) { self.startDragging(e); }
                var self = this;
                this.koIsSelected = ko.observable(false);
                this.koOnClick = function () {
                    if (self.data == null || !self.data.isDesignMode) return;
                    self.data.selectedQuestion = this;
                }
            }
        }
        protected createkoValue(): any { return ko.observable(this.value); }
        protected setkoValue(newValue: any) {
            this.koValue(newValue);
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
            if (this.isKO) {
                this.dummyObservable(this.dummyObservable() + 1);
            }
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
            if (this.isKO) {
                this.setkoValue(this.value);
            }
        }
        get comment(): string { return this.data != null ? this.data.getComment(this.name) : ""; }
        set comment(newValue: string) {
            this.setNewComment(newValue);
            if (this.isKO) {
                this.koComment(this.comment);
            }
        }
        isEmpty(): boolean { return this.value == null; }
        public hasErrors(): boolean {
            this.checkForErrors();
            return this.errors.length > 0;
        }
        public onSelectedQuestionChanged() {
            if (this.data == null) return;
            this.koIsSelected(this.data.selectedQuestion == this);
        }
        private checkForErrors() {
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
            if (this.isKO) {
               this.koErrors(this.errors);
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
        private setNewValue(newValue: any) {
            if (this.isValueChangedInSurvey) return;
            if (this.data != null) {
                this.data.setValue(this.name, newValue);
            }
            this.questionValue = newValue;
            this.onValueChanged();
        }
        protected onValueChanged() {}
        private setNewComment(newValue: string) {
            if (this.data != null) {
                this.data.setComment(this.name, newValue);
            }
        }
        private get dragDropHelper(): DragDropHelper {
            if (this.dragDropHelperValue == null) {
                this.dragDropHelperValue = new DragDropHelper(this.data);
            }
            return this.dragDropHelperValue;
        }
        private startDragging(e) {
            this.dragDropHelper.startDragQuestion(e, this.name);
        }
        private doDragOver(e) {
            this.dragDropHelper.doDragDropOver(e, this);
        }
        private doDragDrop(e) {
            this.dragDropHelper.doDrop(e, this);
        }
        //IQuestion
        onSurveyValueChanged(newValue: any) {
            this.isValueChangedInSurvey = true;
            this.value = newValue;
            this.isValueChangedInSurvey = false;
        }
        setVisibleIndex(value: number) {
            if (this.visibleIndexValue == value) return;
            this.visibleIndexValue = value;
            if (this.isKO) {
                this.dummyObservable(this.dummyObservable() + 1);
            }
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
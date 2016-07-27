/// <reference path="base.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionBase extends Base implements IQuestion {
        private static questionCounter = 100;
        private static getQuestionId(): string {
            return "sq_" + QuestionBase.questionCounter++;
        }
        protected data: ISurveyData;
        protected survey: ISurvey;
        private idValue: string;
        private visibleValue: boolean = true;
        private visibleIndexValue: number = -1;
        public width: string = "100%";
        public indent: number = 0;
        visibilityChangedCallback: () => void;
        visibleIndexChangedCallback: () => void;
        focusCallback: () => void;

        constructor(public name: string) {
            super();
            this.idValue = QuestionBase.getQuestionId();
            this.onCreating();
        }
        public get visible(): boolean { return this.visibleValue; }
        public set visible(val: boolean) {
            if (val == this.visible) return;
            this.visibleValue = val;
            this.fireCallback(this.visibilityChangedCallback);
            if (this.survey) {
                this.survey.questionVisibilityChanged(<IQuestion>this, this.visible);
            }
        }
        public get visibleIndex(): number { return this.visibleIndexValue; }
        public hasErrors(fireCallback: boolean = true): boolean { return false; }
        public get hasTitle(): boolean { return false; }
        public get hasComment(): boolean { return false; }
        public get id(): string { return this.idValue; }
        public focus() {
            var el = document.getElementById(this.id);
            if (!el || !el.scrollIntoView) return;
            var elemTop = el.getBoundingClientRect().top;
            if (elemTop < 0) {
                el.scrollIntoView();
                this.fireCallback(this.focusCallback);
            }
        }
        setData(newValue: ISurveyData) {
            this.data = newValue;
            this.survey = (newValue && newValue["questionAdded"]) ? <ISurvey>newValue : null;
            this.onSetData();
        }
        protected fireCallback(callback: () => void) {
            if (callback) callback();
        }
        protected onSetData() { }
        protected onCreating() { }
        //IQuestion
        onSurveyValueChanged(newValue: any) {
        }
        setVisibleIndex(value: number) {
            if (this.visibleIndexValue == value) return;
            this.visibleIndexValue = value;
            this.fireCallback(this.visibleIndexChangedCallback);
        }
    }
    JsonObject.metaData.addClass("questionbase", ["!name", "visible:boolean", "width", "indent:number"]);
    JsonObject.metaData.setPropertyValues("questionbase", "visible", null, true);
    JsonObject.metaData.setPropertyValues("questionbase", "width", null, "100%");
    JsonObject.metaData.setPropertyValues("questionbase", "indent", null, 0);
    JsonObject.metaData.setPropertyChoices("questionbase", "indent", [0, 1, 2, 3]);
}
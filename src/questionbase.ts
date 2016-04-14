/// <reference path="base.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionBase extends Base implements IQuestion {
        protected data: ISurvey;
        private visibleValue: boolean = true;
        private visibleIndexValue: number = -1;
        public width: string = "100%";
        visibilityChangedCallback: () => void;
        visibleIndexChangedCallback: () => void;

        constructor(public name: string) {
            super();
            this.onCreating();
        }
        public get visible(): boolean { return this.visibleValue; }
        public set visible(val: boolean) {
            if (val == this.visible) return;
            this.visibleValue = val;
            this.fireCallback(this.visibilityChangedCallback);
            if (this.data) {
                this.data.questionVisibilityChanged(<IQuestion>this, this.visible);
            }
        }
        public get visibleIndex(): number { return this.visibleIndexValue; }
        public hasErrors(): boolean { return false; }
        public get hasTitle(): boolean { return false; }
        public get hasComment(): boolean { return false; }
        setData(newValue: ISurvey) {
            this.data = newValue;
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
    JsonObject.metaData.addClass("questionbase", ["!name", "visible:boolean", "width"]);
    JsonObject.metaData.setPropertyValues("questionbase", "visible", null, true);
    JsonObject.metaData.setPropertyValues("questionbase", "width", null, "100%");
}
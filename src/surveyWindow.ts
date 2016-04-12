module Survey {
    export class SurveyWindowModel extends Base  {
        public static surveyElementName = "windowSurveyJS";
        surveyValue: SurveyModel;
        windowElement: HTMLDivElement;
        isShowingValue: boolean;
        isExpandedValue: boolean;
        titleValue: string;
        templateValue: string;
        
        constructor(jsonObj: any) {
            super();
            this.surveyValue = this.createSurvey(jsonObj);
            this.surveyValue.showTitle = false;
            this.windowElement = <HTMLDivElement>document.createElement("div");
        }
        public getType() : string { return "window" }
        public get survey(): SurveyModel { return this.surveyValue; }
        public get isShowing(): boolean { return this.isShowingValue; }
        public get isExpanded(): boolean { return this.isExpandedValue; }
        public get title(): string { return this.titleValue ? this.titleValue : this.survey.title; }
        public set title(value: string) { this.titleValue = value; }
        public expand() {
            this.expandcollapse(true);
        }
        public collapse() {
            this.expandcollapse(false);
        }
        protected createSurvey(jsonObj: any): SurveyModel {
            return new SurveyModel(jsonObj)
        }
        protected expandcollapse(value: boolean) {
            this.isExpandedValue = value;
        }
    }
}
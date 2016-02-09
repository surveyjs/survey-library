module Survey {
    export class SurveyWindow extends Base  {
        public static surveyElementName = "windowSurveyJS";
        surveyValue: Survey;
        windowElement: HTMLDivElement;
        isShowingValue: boolean;
        isExpandedValue: boolean;
        koExpanded: any;
        doExpand: any;
        
        constructor(jsonObj: any) {
            super();
            var self = this;
            this.surveyValue = new Survey(jsonObj);
            this.survey.onComplete.add((sender: Survey) => { self.onComplete(); });
            this.windowElement = <HTMLDivElement>document.createElement("div");
            if (this.isKO) {
                this.koExpanded = ko.observable(false);
                this.doExpand = function () { self.changeExpanded(); }
            }
        }
        public getType() : string { return "window" }
        public get survey(): Survey { return this.surveyValue; }
        public get isShowing(): boolean { return this.isShowingValue; }
        public get isExpanded(): boolean { return this.isExpandedValue; }
        public show() {
            this.windowElement.innerHTML = template.window.ko.html;
            if (this.isKO) {
                ko.cleanNode(this.windowElement);
                ko.applyBindings(this, this.windowElement);
            }
            document.body.appendChild(this.windowElement);
            this.survey.render(SurveyWindow.surveyElementName);
            this.isShowingValue = true;
        }
        public hide() {
            document.body.removeChild(this.windowElement);
            this.windowElement.innerHTML = "";
            this.isShowingValue = false;
        }
        public expand() {
            this.expandcollapse(true);
        }
        public collapse() {
            this.expandcollapse(false);
        }
        private expandcollapse(value: boolean) {
            this.isExpandedValue = value;
            if (this.isKO) {
                this.koExpanded(this.isExpandedValue);
            }
        }
        private changeExpanded() {
            this.expandcollapse(!this.isExpanded);
        }
        private onComplete() {
            this.hide();
        }
    }
}
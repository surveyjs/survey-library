/// <reference path="../surveywindow.ts" />
/// <reference path="kosurvey.ts" />
module Survey {
    export class SurveyWindow extends SurveyWindowModel {
        koExpanded: any;
        doExpand: any;
        constructor(jsonObj: any) {
            super(jsonObj);
            this.koExpanded = ko.observable(false);
            var self = this;
            this.doExpand = function () { self.changeExpanded(); }
            this.survey.onComplete.add((sender: SurveyModel) => { self.onComplete(); });
        }
        protected createSurvey(jsonObj: any): SurveyModel {
            return new Survey(jsonObj)
        }
        protected expandcollapse(value: boolean) {
            super.expandcollapse(value);
            this.koExpanded(this.isExpandedValue);
        }
        protected get template(): string { return this.templateValue ? this.templateValue : template.window.ko.html; }
        protected set template(value: string) { this.templateValue = value; }
        public show() {
            this.windowElement.innerHTML = this.template;
            ko.cleanNode(this.windowElement);
            ko.applyBindings(this, this.windowElement);
            document.body.appendChild(this.windowElement);
            (<Survey>this.survey).render(SurveyWindow.surveyElementName);
            this.isShowingValue = true;
        }
        public hide() {
            document.body.removeChild(this.windowElement);
            this.windowElement.innerHTML = "";
            this.isShowingValue = false;
        }
        private changeExpanded() {
            this.expandcollapse(!this.isExpanded);
        }
        private onComplete() {
            this.hide();
        }
   }
}
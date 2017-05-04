import * as ko from "knockout";
import {SurveyWindowModel} from "../surveyWindow";
import {SurveyModel} from "../survey";
import {Survey} from "./kosurvey";
var koTemplate = require("html-loader?interpolate!val-loader!./templates/window/window.html");

export class SurveyWindow extends SurveyWindowModel {
    koExpanded: any;
    koExpandedCss: any;
    doExpand: any;
    constructor(jsonObj: any) {
        super(jsonObj);
        this.koExpanded = ko.observable(false);
        this.koExpandedCss = ko.observable(this.getButtonCss());
        var self = this;
        this.doExpand = function () { self.changeExpanded(); }
        this.survey.onComplete.add((sender: SurveyModel) => { self.onComplete(); self.koExpandedCss(self.getButtonCss()) });
    }
    protected createSurvey(jsonObj: any): SurveyModel {
        return new Survey(jsonObj)
    }
    protected expandcollapse(value: boolean) {
        super.expandcollapse(value);
        this.koExpanded(this.isExpandedValue);
    }
    protected get template(): string { return this.templateValue ? this.templateValue : this.getDefaultTemplate(); }
    protected set template(value: string) { this.templateValue = value; }
    public show() {
        this.windowElement.innerHTML = this.template;
        ko.cleanNode(this.windowElement);
        ko.applyBindings(this, this.windowElement);
        document.body.appendChild(this.windowElement);
        (<Survey>this.survey).render(SurveyWindow.surveyElementName);
        this.isShowingValue = true;
    }
    protected getDefaultTemplate(): string { return koTemplate }
    public hide() {
        document.body.removeChild(this.windowElement);
        this.windowElement.innerHTML = "";
        this.isShowingValue = false;
    }
    public get css(): any { return this.survey["css"]; }
    private changeExpanded() {
        this.expandcollapse(!this.isExpanded);
    }
    private onComplete() {
        this.hide();
    }
    private getButtonCss() {
        return this.koExpanded() ? this.css.window.header.buttonCollapsed : this.css.window.header.buttonExpanded;
    }
}

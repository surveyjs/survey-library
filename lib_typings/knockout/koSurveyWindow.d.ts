// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { SurveyWindowModel } from "../surveyWindow";
import { SurveyModel } from "../survey";
export declare class SurveyWindow extends SurveyWindowModel {
    koExpanded: any;
    koExpandedCss: any;
    doExpand: any;
    constructor(jsonObj: any);
    protected createSurvey(jsonObj: any): SurveyModel;
    protected expandcollapse(value: boolean): void;
    protected template: string;
    show(): void;
    protected getDefaultTemplate(): string;
    hide(): void;
    css: any;
    private changeExpanded();
    private onComplete();
    private getButtonCss();
}

// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { Base } from "./base";
import { SurveyModel } from "./survey";
export declare class SurveyWindowModel extends Base {
    static surveyElementName: string;
    surveyValue: SurveyModel;
    windowElement: HTMLDivElement;
    isShowingValue: boolean;
    isExpandedValue: boolean;
    titleValue: string;
    templateValue: string;
    constructor(jsonObj: any);
    getType(): string;
    survey: SurveyModel;
    isShowing: boolean;
    isExpanded: boolean;
    title: string;
    expand(): void;
    collapse(): void;
    protected createSurvey(jsonObj: any): SurveyModel;
    protected expandcollapse(value: boolean): void;
}

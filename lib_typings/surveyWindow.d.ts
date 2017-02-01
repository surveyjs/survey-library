// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

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

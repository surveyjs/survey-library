// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { SurveyModel } from "../survey";
export declare class ReactSurveyModel extends SurveyModel {
    renderCallback: () => void;
    constructor(jsonObj?: any);
    render(): void;
    mergeCss(src: any, dest: any): void;
    protected onLoadSurveyFromService(): void;
    protected onLoadingSurveyFromService(): void;
}

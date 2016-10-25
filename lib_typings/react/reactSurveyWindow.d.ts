// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { Survey } from "./reactSurvey";
export declare class SurveyWindow extends Survey {
    private title;
    constructor(props: any);
    handleOnExpanded(event: any): void;
    render(): JSX.Element;
    protected renderHeader(): JSX.Element;
    protected renderBody(): JSX.Element;
    protected updateSurvey(newProps: any): void;
}

// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { Base, ItemValue, SurveyError } from "./base";
export declare class ChoicesRestfull extends Base {
    url: string;
    path: string;
    valueName: string;
    titleName: string;
    getResultCallback: (items: Array<ItemValue>) => void;
    error: SurveyError;
    constructor();
    run(): void;
    getType(): string;
    isEmpty: boolean;
    setData(json: any): void;
    clear(): void;
    protected onLoad(result: any): void;
    private onError(status, response);
    private getResultAfterPath(result);
    private getPathes();
    private getValue(item);
    private getTitle(item);
}

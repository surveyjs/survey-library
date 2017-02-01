// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { Question } from "./question";
import { ItemValue, SurveyError } from "./base";
import { ChoicesRestfull } from "./choicesRestfull";
export declare class QuestionSelectBase extends Question {
    private visibleChoicesCache;
    private commentValue;
    protected cachedValue: any;
    otherItem: ItemValue;
    private choicesFromUrl;
    private cachedValueForUrlRequestion;
    private choicesValues;
    choicesByUrl: ChoicesRestfull;
    otherErrorText: string;
    storeOthersAsComment: boolean;
    choicesOrderValue: string;
    choicesChangedCallback: () => void;
    constructor(name: string);
    isOtherSelected: boolean;
    protected getHasOther(val: any): boolean;
    protected createRestfull(): ChoicesRestfull;
    protected getComment(): string;
    private isSettingComment;
    protected setComment(newValue: string): void;
    protected setNewValue(newValue: any): void;
    protected valueFromData(val: any): any;
    protected valueToData(val: any): any;
    protected valueFromDataCore(val: any): any;
    protected valueToDataCore(val: any): any;
    protected hasUnknownValue(val: any): boolean;
    choices: Array<any>;
    protected hasOtherChanged(): void;
    choicesOrder: string;
    otherText: string;
    visibleChoices: Array<ItemValue>;
    private activeChoices;
    supportComment(): boolean;
    supportOther(): boolean;
    protected onCheckForErrors(errors: Array<SurveyError>): void;
    protected getStoreOthersAsComment(): boolean;
    onSurveyLoad(): void;
    private onLoadChoicesFromUrl(array);
    private onVisibleChoicesChanged();
    private sortVisibleChoices(array);
    private sortArray(array, mult);
    private randomizeArray(array);
}
export declare class QuestionCheckboxBase extends QuestionSelectBase {
    name: string;
    private colCountValue;
    colCountChangedCallback: () => void;
    constructor(name: string);
    colCount: number;
}

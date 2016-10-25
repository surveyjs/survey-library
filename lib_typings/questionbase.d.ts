// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { Base, IQuestion, IConditionRunner, ISurveyData, ISurvey, HashTable } from './base';
export declare class QuestionBase extends Base implements IQuestion, IConditionRunner {
    name: string;
    private static questionCounter;
    private static getQuestionId();
    protected data: ISurveyData;
    protected survey: ISurvey;
    private conditionRunner;
    visibleIf: string;
    private idValue;
    private visibleValue;
    startWithNewLine: boolean;
    private visibleIndexValue;
    width: string;
    private renderWidthValue;
    private rightIndentValue;
    indent: number;
    focusCallback: () => void;
    renderWidthChangedCallback: () => void;
    rowVisibilityChangedCallback: () => void;
    visibilityChangedCallback: () => void;
    visibleIndexChangedCallback: () => void;
    constructor(name: string);
    visible: boolean;
    visibleIndex: number;
    hasErrors(fireCallback?: boolean): boolean;
    hasTitle: boolean;
    hasComment: boolean;
    id: string;
    renderWidth: string;
    rightIndent: number;
    focus(): void;
    setData(newValue: ISurveyData): void;
    protected fireCallback(callback: () => void): void;
    protected onSetData(): void;
    protected onCreating(): void;
    runCondition(values: HashTable<any>): void;
    onSurveyValueChanged(newValue: any): void;
    onSurveyLoad(): void;
    setVisibleIndex(value: number): void;
    supportGoNextPageAutomatic(): boolean;
}

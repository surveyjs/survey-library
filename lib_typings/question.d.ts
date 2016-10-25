// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { QuestionBase } from './questionbase';
import { SurveyError } from "./base";
import { SurveyValidator, IValidatorOwner } from "./validator";
export declare class Question extends QuestionBase implements IValidatorOwner {
    name: string;
    private titleValue;
    private questionValue;
    private questionComment;
    private isRequiredValue;
    private hasCommentValue;
    private hasOtherValue;
    private commentTextValue;
    private textPreProcessor;
    errors: Array<SurveyError>;
    validators: Array<SurveyValidator>;
    valueChangedCallback: () => void;
    commentChangedCallback: () => void;
    errorsChangedCallback: () => void;
    titleChangedCallback: () => void;
    constructor(name: string);
    hasTitle: boolean;
    title: string;
    processedTitle: string;
    fullTitle: string;
    protected canProcessedTextValues(name: string): boolean;
    protected getProcessedTextValue(name: string): any;
    supportComment(): boolean;
    supportOther(): boolean;
    isRequired: boolean;
    hasComment: boolean;
    commentText: string;
    hasOther: boolean;
    protected hasOtherChanged(): void;
    protected no: string;
    protected onSetData(): void;
    value: any;
    comment: string;
    protected getComment(): string;
    protected setComment(newValue: string): void;
    isEmpty(): boolean;
    hasErrors(fireCallback?: boolean): boolean;
    requiredText: string;
    private checkForErrors(fireCallback);
    protected onCheckForErrors(errors: Array<SurveyError>): void;
    protected hasRequiredError(): boolean;
    protected runValidators(): SurveyError;
    private isValueChangedInSurvey;
    protected setNewValue(newValue: any): void;
    protected setNewValueInData(newValue: any): void;
    private getValueCore();
    private setValueCore(newValue);
    protected valueFromData(val: any): any;
    protected valueToData(val: any): any;
    protected onValueChanged(): void;
    protected setNewComment(newValue: string): void;
    onSurveyValueChanged(newValue: any): void;
    getValidatorTitle(): string;
}

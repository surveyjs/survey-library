// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { Base, SurveyError } from "./base";
export declare class ValidatorResult {
    value: any;
    error: SurveyError;
    constructor(value: any, error?: SurveyError);
}
export declare class SurveyValidator extends Base {
    text: string;
    constructor();
    protected getErrorText(name: string): string;
    protected getDefaultErrorText(name: string): string;
    validate(value: any, name?: string): ValidatorResult;
}
export interface IValidatorOwner {
    validators: Array<SurveyValidator>;
    value: any;
    getValidatorTitle(): string;
}
export declare class ValidatorRunner {
    run(owner: IValidatorOwner): SurveyError;
}
export declare class NumericValidator extends SurveyValidator {
    minValue: number;
    maxValue: number;
    constructor(minValue?: number, maxValue?: number);
    getType(): string;
    validate(value: any, name?: string): ValidatorResult;
    protected getDefaultErrorText(name: string): any;
    private isNumber(value);
}
export declare class TextValidator extends SurveyValidator {
    minLength: number;
    constructor(minLength?: number);
    getType(): string;
    validate(value: any, name?: string): ValidatorResult;
    protected getDefaultErrorText(name: string): any;
}
export declare class AnswerCountValidator extends SurveyValidator {
    minCount: number;
    maxCount: number;
    constructor(minCount?: number, maxCount?: number);
    getType(): string;
    validate(value: any, name?: string): ValidatorResult;
    protected getDefaultErrorText(name: string): string;
}
export declare class RegexValidator extends SurveyValidator {
    regex: string;
    constructor(regex?: string);
    getType(): string;
    validate(value: any, name?: string): ValidatorResult;
}
export declare class EmailValidator extends SurveyValidator {
    private re;
    constructor();
    getType(): string;
    validate(value: any, name?: string): ValidatorResult;
    protected getDefaultErrorText(name: string): any;
}

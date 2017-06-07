import {Base, SurveyError} from "./base";
import {CustomError, RequreNumericError} from "./error";
import {surveyLocalization} from "./surveyStrings";
import {JsonObject} from './jsonobject';

export class ValidatorResult {
    constructor(public value: any, public error: SurveyError = null) {
    }
}
/**
 * Base SurveyJS validator class.
 */
export class SurveyValidator extends Base {
    public text: string = "";
    constructor() {
        super();
    }
    protected getErrorText(name: string) : string {
        if (this.text) return this.text;
        return this.getDefaultErrorText(name);
    }
    protected getDefaultErrorText(name: string): string {
        return "";
    }
    public validate(value: any, name: string = null, owner: IValidatorOwner): ValidatorResult {
        return null;
    }
}
export interface IValidatorOwner {
    validators: Array<SurveyValidator>;
    value: any;
    getValidatorTitle(): string;
}
export class ValidatorRunner {
    public run(owner: IValidatorOwner): SurveyError {
        for (var i = 0; i < owner.validators.length; i++) {
            var validatorResult = owner.validators[i].validate(owner.value, owner.getValidatorTitle(), owner);
            if (validatorResult != null) {
                if (validatorResult.error) return validatorResult.error;
                if (validatorResult.value) {
                    owner.value = validatorResult.value;
                }
            }
        }
        return null;
    }
}
/**
 * Validate numeric values. 
 */
export class NumericValidator extends SurveyValidator {
    constructor(public minValue: number = null, public maxValue: number = null) {
        super();
    }
    public getType(): string { return "numericvalidator"; }
    public validate(value: any, name: string = null, owner: IValidatorOwner): ValidatorResult {
        if (!value || !this.isNumber(value)) {
            return new ValidatorResult(null, new RequreNumericError());
        }
        var result = new ValidatorResult(parseFloat(value));
        if (this.minValue && this.minValue > result.value) {
            result.error = new CustomError(this.getErrorText(name));
            return result;
        }
        if (this.maxValue && this.maxValue < result.value) {
            result.error = new CustomError(this.getErrorText(name));
            return result;
        }
        return (typeof value === 'number') ? null : result;
    }
    protected getDefaultErrorText(name: string) {
        var vName = name ? name : "value";
        if (this.minValue && this.maxValue) {
            return surveyLocalization.getString("numericMinMax")["format"](vName, this.minValue, this.maxValue);
        } else {
            if (this.minValue) {
                return surveyLocalization.getString("numericMin")["format"](vName, this.minValue);
            }
            return surveyLocalization.getString("numericMax")["format"](vName, this.maxValue);
        }
    }
    private isNumber(value): boolean {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
}
/**
 * Validate text values
 */
export class TextValidator extends SurveyValidator {
    constructor(public minLength: number = 0, public maxLength: number = 0) {
        super();
    }
    public getType(): string { return "textvalidator"; }
    public validate(value: any, name: string = null, owner: IValidatorOwner): ValidatorResult {
        if (this.minLength > 0 && value.length < this.minLength) {
            return new ValidatorResult(null, new CustomError(this.getErrorText(name)));
        }
        if (this.maxLength > 0 && value.length > this.maxLength) {
            return new ValidatorResult(null, new CustomError(this.getErrorText(name)));
        }
        return null;
    }
    protected getDefaultErrorText(name: string) {
        if (this.minLength > 0 && this.maxLength > 0)
            return surveyLocalization.getString("textMinMaxLength")["format"](this.minLength, this.maxLength);
        if (this.minLength > 0) return surveyLocalization.getString("textMinLength")["format"](this.minLength);
        return surveyLocalization.getString("textMaxLength")["format"](this.maxLength);
    }
}

export class AnswerCountValidator extends SurveyValidator {
    constructor(public minCount: number = null, public maxCount: number = null) {
        super();
    }
    public getType(): string { return "answercountvalidator"; }
    public validate(value: any, name: string = null, owner: IValidatorOwner): ValidatorResult {
        if (value == null || value.constructor != Array) return null;
        var count = value.length;
        if (this.minCount && count < this.minCount) {
            return new ValidatorResult(null, new CustomError(this.getErrorText(surveyLocalization.getString("minSelectError")["format"](this.minCount))));
        }
        if (this.maxCount && count > this.maxCount) {
            return new ValidatorResult(null, new CustomError(this.getErrorText(surveyLocalization.getString("maxSelectError")["format"](this.maxCount))));
        }
        return null;
    }
    protected getDefaultErrorText(name: string) {
        return name;
    }
}
/**
 * Use it to validate the text by regular expressions.
 */
export class RegexValidator extends SurveyValidator {
    constructor(public regex: string = null) {
        super();
    }
    public getType(): string { return "regexvalidator"; }
    public validate(value: any, name: string = null, owner: IValidatorOwner): ValidatorResult {
        if (!this.regex || !value) return null;
        var re = new RegExp(this.regex);
        if (re.test(value)) return null;
        return new ValidatorResult(value, new CustomError(this.getErrorText(name)));
    }
}
/**
 * Validate e-mail address in the text input
 */
export class EmailValidator extends SurveyValidator {
    private re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    constructor() {
        super();
    }
    public getType(): string { return "emailvalidator"; }
    public validate(value: any, name: string = null, owner: IValidatorOwner): ValidatorResult {
        if (!value) return null;
        if (this.re.test(value)) return null;
        return new ValidatorResult(value, new CustomError(this.getErrorText(name)));
    }
    protected getDefaultErrorText(name: string) {
        return surveyLocalization.getString("invalidEmail");
    }
}

JsonObject.metaData.addClass("surveyvalidator", ["text"]);
JsonObject.metaData.addClass("numericvalidator", ["minValue:number", "maxValue:number"], function () { return new NumericValidator(); }, "surveyvalidator");
JsonObject.metaData.addClass("textvalidator", ["minLength:number", "maxLength:number"], function () { return new TextValidator(); }, "surveyvalidator");
JsonObject.metaData.addClass("answercountvalidator", ["minCount:number", "maxCount:number"], function () { return new AnswerCountValidator(); }, "surveyvalidator");
JsonObject.metaData.addClass("regexvalidator", ["regex"], function () { return new RegexValidator(); }, "surveyvalidator");
JsonObject.metaData.addClass("emailvalidator", [], function () { return new EmailValidator(); }, "surveyvalidator");

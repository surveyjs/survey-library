/// <reference path="base.ts" />
/// <reference path="error.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class ValidatorResult {
        constructor(public value: any, public error: SurveyError = null) {
        }
    }
    
    export class SurveyValidator extends Base {
        public text: string = null;
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
        public validate(value: any, name: string = null): ValidatorResult {
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
                var validatorResult = owner.validators[i].validate(owner.value, owner.getValidatorTitle());
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

    export class NumericValidator extends SurveyValidator {
        constructor(public minValue: number = null, public maxValue: number = null) {
            super();
        }
        public getType(): string { return "numericvalidator"; }
        public validate(value: any, name: string = null): ValidatorResult {
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
            var result = "The '" + vName + "' should be ";
            if (this.minValue) {
                result += "equal or more than " + this.minValue;
            }
            if (this.maxValue) {
                if (this.minValue) {
                    result += " and ";
                }
                result += " equal or less than " + this.maxValue;
            }
            return result;
        }
        private isNumber(value): boolean {
            return !isNaN(parseFloat(value)) && isFinite(value);
        }
    }

    export class TextValidator extends SurveyValidator {
        constructor(public minLength: number = 0) {
            super();
        }
        public getType(): string { return "textvalidator"; }
        public validate(value: any, name: string = null): ValidatorResult {
            if (this.minLength <= 0) return;
            if (value.length < this.minLength) {
                return new ValidatorResult(null, new CustomError(this.getErrorText(name)));
            }
            return null;
        }
        protected getDefaultErrorText(name: string) {
            return "Please enter at least " + this.minLength + " symblos.";
        }
    }

    export class AnswerCountValidator extends SurveyValidator {
        constructor(public minCount: number = null, public maxCount: number = null) {
            super();
        }
        public getType(): string { return "answercountvalidator"; }
        public validate(value: any, name: string = null): ValidatorResult {
            if (value == null || value.constructor != Array) return null;
            var count = value.length;
            if (this.minCount && count < this.minCount) {
                return new ValidatorResult(null, new CustomError(this.getErrorText("Please select at least " + this.minCount + " variants.")));
            }
            if (this.maxCount && count > this.maxCount) {
                return new ValidatorResult(null, new CustomError(this.getErrorText("Please select not more than " + this.maxCount + " variants.")));
            }
            return null;
        }
        protected getDefaultErrorText(name: string) {
            return name;
        }
    }


    JsonObject.metaData.addClass("surveyvalidator", ["text"]);
    JsonObject.metaData.addClass("numericvalidator", ["minValue", "maxValue"], function () { return new NumericValidator(); }, "surveyvalidator");
    JsonObject.metaData.addClass("textvalidator", ["minLength"], function () { return new TextValidator(); }, "surveyvalidator");
    JsonObject.metaData.addClass("answercountvalidator", ["minCount", "maxCount"], function () { return new AnswerCountValidator(); }, "surveyvalidator");
 
}
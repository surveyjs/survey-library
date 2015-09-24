/// <reference path="base.ts" />
/// <reference path="error.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class ValidatorResult {
        constructor(public value: any, public error: SurveyError = null) {
        }
    }
    
    export class SurveyValidator extends Base {
        public text: string = null;
        constructor() {
            super();
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
        protected getErrorText(name: string) {
            if (this.text) return this.text;
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
                var text = this.text ? this.text : "Please enter at least " + this.minLength + " symblos.";
                return new ValidatorResult(null, new CustomError(text));
            }
            return null;
        }
    }

    JsonObject.metaData.addClass("surveyvalidator", ["text"]);
    JsonObject.metaData.addClass("numericvalidator", ["minValue", "maxValue"], function () { return new NumericValidator(); }, "surveyvalidator");
    JsonObject.metaData.addClass("textvalidator", ["minLength"], function () { return new TextValidator(); }, "surveyvalidator");
 
}
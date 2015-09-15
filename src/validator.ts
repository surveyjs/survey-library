/// <reference path="base.ts" />
/// <reference path="error.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class ValidatorResult {
        constructor(public value: any, public error: SurveyError = null) {
        }
    }
    
    export class SurveyValidator extends Base {
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
            var vName = name ? name : "value";
            if (this.minValue && this.minValue > result.value) {
                result.error = new CustomError("The '" + vName + "' should be equal or more than " + this.minValue);
                return result;
            }
            if (this.maxValue && this.maxValue < result.value) {
                result.error = new CustomError("The '" + vName + "' should be equal or less than " + this.maxValue);
                return result;
            }
            return (typeof value === 'number') ? null : result;
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
                return new ValidatorResult(null, new CustomError("Please enter at least " + this.minLength + " symblos."));
            }
            return null;
        }
    }

    JsonObject.metaData.addClass("numericvalidator", ["minValue", "maxValue"], function () { return new NumericValidator(); });
    JsonObject.metaData.addClass("textvalidator", ["minLength"], function () { return new TextValidator(); });
 
}
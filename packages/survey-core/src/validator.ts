import { Base } from "./base";
import { ISurveyErrorOwner, ISurvey } from "./base-interfaces";
import { SurveyError } from "./survey-error";
import { CustomError, RequreNumericError } from "./error";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { Serializer } from "./jsonobject";
import { ConditionRunner } from "./conditions";
import { Helpers } from "./helpers";

export class ValidatorResult {
  constructor(public value: any, public error: SurveyError = null) {}
}
/**
 * A base class for all classes that implement validators.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
 */
export class SurveyValidator extends Base {
  public errorOwner: ISurveyErrorOwner;
  public onAsyncCompleted: (result: ValidatorResult) => void;
  constructor() {
    super();
    this.createLocalizableString("text", this, true);
  }
  public get isValidator(): boolean { return true; }
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.errorOwner && !!(<any>this.errorOwner)["getSurvey"]
      ? (<any>this.errorOwner).getSurvey()
      : null;
  }
  /**
   * An error message to display when a value fails validation.
   */
  public get text(): string {
    return this.getLocalizableStringText("text");
  }
  public set text(value: string) {
    this.setLocalizableStringText("text", value);
  }
  public get isValidateAllValues() {
    return false;
  }
  get locText(): LocalizableString {
    return this.getLocalizableString("text");
  }
  protected getErrorText(name: string): string {
    if (this.text) return this.text;
    return this.getDefaultErrorText(name);
  }
  protected getDefaultErrorText(name: string): string {
    return "";
  }
  public validate(
    value: any,
    name: string = null,
    values: any = null,
    properties: any = null
  ): ValidatorResult {
    return null;
  }
  public get isRunning(): boolean {
    return false;
  }
  public get isAsync(): boolean {
    return false;
  }
  getLocale(): string {
    return !!this.errorOwner ? this.errorOwner.getLocale() : "";
  }
  getMarkdownHtml(text: string, name: string): string {
    return !!this.errorOwner
      ? this.errorOwner.getMarkdownHtml(text, name)
      : undefined;
  }
  getRenderer(name: string): string {
    return !!this.errorOwner ? this.errorOwner.getRenderer(name) : null;
  }
  getRendererContext(locStr: LocalizableString): any {
    return !!this.errorOwner ? this.errorOwner.getRendererContext(locStr) : locStr;
  }
  getProcessedText(text: string): string {
    return !!this.errorOwner ? this.errorOwner.getProcessedText(text) : text;
  }
  protected createCustomError(name: string): SurveyError {
    const err = new CustomError(this.getErrorText(name), this.errorOwner);
    err.onUpdateErrorTextCallback = (err => err.text = this.getErrorText(name));
    return err;
  }
  public toString(): string {
    var res = this.getType().replace("validator", "");
    if (!!this.text) {
      res += ", " + this.text;
    }
    return res;
  }
}
export interface IValidatorOwner {
  getValidators(): Array<SurveyValidator>;
  validatedValue: any;
  getValidatorTitle(): string;
  getDataFilteredValues(): any;
  getDataFilteredProperties(): any;
}
export class ValidatorRunner {
  private asyncValidators: Array<SurveyValidator>;
  public onAsyncCompleted: (errors: Array<SurveyError>) => void;
  public run(owner: IValidatorOwner): Array<SurveyError> {
    var res = [];
    var values = null;
    var properties = null;
    this.prepareAsyncValidators();
    var asyncResults: Array<SurveyError> = [];
    var validators = owner.getValidators();
    for (var i = 0; i < validators.length; i++) {
      var validator = validators[i];
      if (!values && validator.isValidateAllValues) {
        values = owner.getDataFilteredValues();
        properties = owner.getDataFilteredProperties();
      }
      if (validator.isAsync) {
        this.asyncValidators.push(validator);
        validator.onAsyncCompleted = (result: ValidatorResult) => {
          if (!!result && !!result.error) asyncResults.push(result.error);
          if (!this.onAsyncCompleted) return;
          for (var i = 0; i < this.asyncValidators.length; i++) {
            if (this.asyncValidators[i].isRunning) return;
          }
          this.onAsyncCompleted(asyncResults);
        };
      }
    }
    validators = owner.getValidators();
    for (var i = 0; i < validators.length; i++) {
      var validator = validators[i];

      var validatorResult = validator.validate(
        owner.validatedValue,
        owner.getValidatorTitle(),
        values,
        properties
      );
      if (!!validatorResult && !!validatorResult.error) {
        res.push(validatorResult.error);
      }
    }
    if (this.asyncValidators.length == 0 && !!this.onAsyncCompleted)
      this.onAsyncCompleted([]);
    return res;
  }
  private prepareAsyncValidators() {
    if (!!this.asyncValidators) {
      for (var i = 0; i < this.asyncValidators.length; i++) {
        this.asyncValidators[i].onAsyncCompleted = null;
      }
    }
    this.asyncValidators = [];
  }
}
/**
 * A class that implements a validator for numeric values.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
 */
export class NumericValidator extends SurveyValidator {
  constructor(minValue: number = null, maxValue: number = null) {
    super();
    this.minValue = minValue;
    this.maxValue = maxValue;
  }
  public getType(): string {
    return "numericvalidator";
  }
  public validate(
    value: any,
    name: string = null,
    values: any = null,
    properties: any = null
  ): ValidatorResult {
    if (this.isValueEmpty(value)) return null;
    if (!Helpers.isNumber(value)) {
      return new ValidatorResult(
        null,
        new RequreNumericError(this.text, this.errorOwner)
      );
    }
    var result = new ValidatorResult(Helpers.getNumber(value));
    if (this.minValue !== null && this.minValue > result.value) {
      result.error = this.createCustomError(name);
      return result;
    }
    if (this.maxValue !== null && this.maxValue < result.value) {
      result.error = this.createCustomError(name);
      return result;
    }
    return typeof value === "number" ? null : result;
  }
  protected getDefaultErrorText(name: string) {
    var vName = name ? name : this.getLocalizationString("value");
    if (this.minValue !== null && this.maxValue !== null) {
      return this.getLocalizationFormatString("numericMinMax",
        vName, this.minValue, this.maxValue);
    } else {
      if (this.minValue !== null) {
        return this.getLocalizationFormatString("numericMin", vName, this.minValue);
      }
      return this.getLocalizationFormatString("numericMax", vName, this.maxValue);
    }
  }
  /**
   * A minimum allowed numeric value.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
   */
  public get minValue(): number {
    return this.getPropertyValue("minValue");
  }
  public set minValue(val: number) {
    this.setPropertyValue("minValue", val);
  }
  /**
   * A maximum allowed numeric value.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
   */
  public get maxValue(): number {
    return this.getPropertyValue("maxValue");
  }
  public set maxValue(val: number) {
    this.setPropertyValue("maxValue", val);
  }
}
/**
 * A class that implements a validator for text values.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
 */
export class TextValidator extends SurveyValidator {
  constructor(
  ) {
    super();
  }
  public getType(): string {
    return "textvalidator";
  }
  public validate(
    value: any,
    name: string = null,
    values: any = null,
    properties: any = null
  ): ValidatorResult {
    if (this.isValueEmpty(value)) return null;
    if (!this.allowDigits) {
      var reg = /\d+$/;
      if (reg.test(value)) {
        return new ValidatorResult(null, this.createCustomError("textNoDigitsAllow"));
      }
    }
    if (this.minLength > 0 && value.length < this.minLength) {
      return new ValidatorResult(null, this.createCustomError(name));
    }
    if (this.maxLength > 0 && value.length > this.maxLength) {
      return new ValidatorResult(null, this.createCustomError(name));
    }
    return null;
  }
  protected getDefaultErrorText(name: string): string {
    if(name === "textNoDigitsAllow") return this.getLocalizationString(name);
    if (this.minLength > 0 && this.maxLength > 0)
      return this.getLocalizationFormatString("textMinMaxLength", this.minLength, this.maxLength);
    if (this.minLength > 0)
      return this.getLocalizationFormatString("textMinLength", this.minLength);
    return this.getLocalizationFormatString("textMaxLength", this.maxLength);
  }
  /**
   * The minimum length of a text value measured in characters.
   *
   * Default value: 0
   *
   * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
   */
  public get minLength(): number {
    return this.getPropertyValue("minLength");
  }
  public set minLength(val: number) {
    this.setPropertyValue("minLength", val);
  }
  /**
   * The maximum length of a text value measured in characters.
   *
   * Default value: 0 (unlimited)
   *
   * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
   */
  public get maxLength(): number {
    return this.getPropertyValue("maxLength");
  }
  public set maxLength(val: number) {
    this.setPropertyValue("maxLength", val);
  }
  /**
   * Specifies whether a text value can include numerical digits.
   *
   * Default value: `true`
   */
  public get allowDigits(): boolean {
    return this.getPropertyValue("allowDigits");
  }
  public set allowDigits(val: boolean) {
    this.setPropertyValue("allowDigits", val);
  }
}

/**
 * A class that implements answer count validation in the question types that can have multiple values (for instance, [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model)).
 *
 * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
 */
export class AnswerCountValidator extends SurveyValidator {
  constructor(minCount: number = null, maxCount: number = null) {
    super();
    this.minCount = minCount;
    this.maxCount = maxCount;
  }
  public getType(): string {
    return "answercountvalidator";
  }
  public validate(
    value: any,
    name: string = null,
    values: any = null,
    properties: any = null
  ): ValidatorResult {
    if (value == null || value.constructor != Array) return null;
    var count = value.length;
    if (count == 0) return null;
    if (this.minCount && count < this.minCount) {
      return new ValidatorResult(
        null,
        this.createCustomError(
          this.getLocalizationFormatString("minSelectError", this.minCount)));
    }
    if (this.maxCount && count > this.maxCount) {
      return new ValidatorResult(
        null,
        this.createCustomError(
          this.getLocalizationFormatString("maxSelectError", this.maxCount)
        )
      );
    }
    return null;
  }
  protected getDefaultErrorText(name: string) {
    return name;
  }
  /**
   * A minimum number of selected answers.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
   */
  public get minCount(): number {
    return this.getPropertyValue("minCount");
  }
  public set minCount(val: number) {
    this.setPropertyValue("minCount", val);
  }
  /**
   * A maximum number of selected answers.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
   */
  public get maxCount(): number {
    return this.getPropertyValue("maxCount");
  }
  public set maxCount(val: number) {
    this.setPropertyValue("maxCount", val);
  }
}
/**
 * A class that implements validation using regular expressions.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
 */
export class RegexValidator extends SurveyValidator {
  constructor(regex: string = null) {
    super();
    this.regex = regex;
  }
  public getType(): string {
    return "regexvalidator";
  }
  public validate(
    value: any,
    name: string = null,
    values: any = null,
    properties: any = null
  ): ValidatorResult {
    if (!this.regex || this.isValueEmpty(value)) return null;
    var re = this.createRegExp();
    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        var res = this.hasError(re, value[i], name);
        if (res) return res;
      }
    }
    return this.hasError(re, value, name);
  }
  private hasError(re: RegExp, value: any, name: string): ValidatorResult {
    if (re.test(value)) return null;
    return new ValidatorResult(value, this.createCustomError(name));
  }
  /**
   * A regular expression used to validate values.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
   */
  public get regex(): string {
    return this.getPropertyValue("regex");
  }
  public set regex(val: string) {
    this.setPropertyValue("regex", val);
  }
  /**
   * Specifies whether uppercase and lowercase letters must be treated as distinct or equivalent when validating values.
   *
   * Default value: `false` (uppercase and lowercase letters are treated as distinct)
   */
  public get caseInsensitive(): boolean {
    return this.getPropertyValue("caseInsensitive");
  }
  public set caseInsensitive(val: boolean) {
    this.setPropertyValue("caseInsensitive", val);
  }
  public get insensitive(): boolean { return this.caseInsensitive; }
  public set insensitive(val: boolean) {
    this.caseInsensitive = val;
  }
  private createRegExp(): RegExp {
    return new RegExp(this.regex, this.caseInsensitive ? "i" : "");
  }
}
/**
 * A class that implements a validator for e-mail addresses.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
 */
export class EmailValidator extends SurveyValidator {
  private re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()=[\]\.,;:\s@\"]+\.)+[^<>()=[\]\.,;:\s@\"]{2,})$/i;
  constructor() {
    super();
  }
  public getType(): string {
    return "emailvalidator";
  }
  public validate(
    value: any,
    name: string = null,
    values: any = null,
    properties: any = null
  ): ValidatorResult {
    if (!value) return null;
    if (this.re.test(value)) return null;
    return new ValidatorResult(value, this.createCustomError(name));
  }
  protected getDefaultErrorText(name: string): string {
    return this.getLocalizationString("invalidEmail");
  }
}

/**
 * A class that implements validation using [expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions).
 *
 * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
 */
export class ExpressionValidator extends SurveyValidator {
  private conditionRunner: ConditionRunner = null;
  private isRunningValue: boolean = false;
  constructor(expression: string = null) {
    super();
    this.expression = expression;
  }
  public getType(): string {
    return "expressionvalidator";
  }
  public get isValidateAllValues(): boolean {
    return true;
  }
  public get isAsync(): boolean {
    if (!this.ensureConditionRunner(false)) return false;
    return this.conditionRunner.isAsync;
  }
  public get isRunning(): boolean {
    return this.isRunningValue;
  }
  public validate(value: any, name: string = null, values: any = null, properties: any = null): ValidatorResult {
    if (!this.expression) return null;
    if(!!this.conditionRunner) {
      this.conditionRunner.onRunComplete = null;
    }
    this.ensureConditionRunner(true);
    this.conditionRunner.onRunComplete = (res) => {
      this.isRunningValue = false;
      if (!!this.onAsyncCompleted) {
        this.onAsyncCompleted(this.generateError(res, value, name));
      }
    };
    this.isRunningValue = true;
    var res = this.conditionRunner.run(values, properties);
    if (this.conditionRunner.isAsync) return null;
    this.isRunningValue = false;
    return this.generateError(res, value, name);
  }
  protected generateError(res: boolean, value: any, name: string): ValidatorResult {
    if (!res) {
      return new ValidatorResult(value, this.createCustomError(name));
    }
    return null;
  }
  protected getDefaultErrorText(name: string): string {
    return this.getLocalizationFormatString("invalidExpression", this.expression);
  }
  private ensureConditionRunner(reNew: boolean): boolean {
    if (!this.expression) return false;
    if(reNew || !this.conditionRunner) {
      this.conditionRunner = new ConditionRunner(this.expression);
    } else {
      this.conditionRunner.expression = this.expression;
    }
    return true;
  }
  /**
   * A Boolean [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions). If it evaluates to `false`, validation fails.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))
   */
  public get expression(): string {
    return this.getPropertyValue("expression");
  }
  public set expression(val: string) {
    this.setPropertyValue("expression", val);
  }
}

Serializer.addClass("surveyvalidator", [
  { name: "text", serializationProperty: "locText" },
]);
Serializer.addClass(
  "numericvalidator",
  ["minValue:number", "maxValue:number"],
  function() {
    return new NumericValidator();
  },
  "surveyvalidator"
);
Serializer.addClass(
  "textvalidator",
  [{ name: "minLength:number", default: 0 },
    { name: "maxLength:number", default: 0 },
    { name: "allowDigits:boolean", default: true }],
  function() {
    return new TextValidator();
  },
  "surveyvalidator"
);
Serializer.addClass(
  "answercountvalidator",
  ["minCount:number", "maxCount:number"],
  function() {
    return new AnswerCountValidator();
  },
  "surveyvalidator"
);
Serializer.addClass(
  "regexvalidator",
  ["regex", { name: "caseInsensitive:boolean", alternativeName: "insensitive" }],
  function() {
    return new RegexValidator();
  },
  "surveyvalidator"
);
Serializer.addClass(
  "emailvalidator",
  [],
  function() {
    return new EmailValidator();
  },
  "surveyvalidator"
);

Serializer.addClass(
  "expressionvalidator",
  ["expression:condition"],
  function() {
    return new ExpressionValidator();
  },
  "surveyvalidator"
);

import { Base } from "./base";
import { ISurveyErrorOwner, ISurvey, IElement, IQuestion } from "./base-interfaces";
import { SurveyError } from "./survey-error";
import { CustomError, RequreNumericError } from "./error";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { Serializer } from "./jsonobject";
import { ConditionRunner } from "./conditions";
import { HashTable, Helpers } from "./helpers";
import { IValueGetterContext } from "./conditionProcessValue";

export class AsyncElementsRunner {
  private asyncElements: HashTable<boolean> = {};
  private isRunningValue: boolean;
  constructor (private onCompleted: () => void) {
    this.isRunningValue = true;
  }
  public addElement(id: string) {
    this.asyncElements[id] = true;
  }
  public removeElement(id: string) {
    delete this.asyncElements[id];
    this.tryComplete();
  }
  public finish(): void {
    this.isRunningValue = false;
    this.tryComplete();
  }
  public get isRunning(): boolean {
    return this.isRunningValue || Object.keys(this.asyncElements).length > 0;
  }
  protected doCompleted() {
    if (this.onCompleted) {
      this.onCompleted();
    }
  }
  private tryComplete(): void {
    if (!this.isRunning) {
      this.doCompleted();
    }
  }
}
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
  constructor() {
    super();
    this.createLocalizableString("text", this, true);
  }
  public get id(): string { return "svd" + this.uniqueId; }
  public get isValidator(): boolean { return true; }
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.errorOwner && !!(<any>this.errorOwner)["getSurvey"]
      ? (<any>this.errorOwner).getSurvey()
      : null;
  }
  /**
   * Specifies the type of notification shown to users.
   *
   * Possible values:
   *
   * - `"error"`
   * - `"warning"`
   * - `"info"`
   *
   * Errors block survey progress until resolved. Warnings indicate potential issues but don't block respondents from continuing the survey. Informational notes provide guidance without restrictions.
   *
   * > If multiple notification types are eligible to be displayed for a question, only the strongest type is shown. Warnings appear only after all errors are resolved, and notes appear only when there are no errors or warnings.
   */
  public get notificationType(): string { return this.getPropertyValue("notificationType"); }
  public set notificationType(val: string) { this.setPropertyValue("notificationType", val); }
  /**
   * An error message to display when a value fails validation.
   */
  public get text(): string {
    return this.getLocalizableStringText("text");
  }
  public set text(value: string) {
    this.setLocalizableStringText("text", value);
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
  public validateOnCallback(value: any, callback: (res: ValidatorResult) => void, name?: string, properties?: any): ValidatorResult {
    const res = this.validate(value, name, properties);
    if (callback) callback(res);
    return res;
  }
  public validate(value: any, name?: string, properties?: any): ValidatorResult {
    return null;
  }
  getLocale(): string {
    return !!this.errorOwner ? this.errorOwner.getLocale() : "";
  }
  getMarkdownHtml(text: string, name: string, item?: any): string {
    return !!this.errorOwner
      ? this.errorOwner.getMarkdownHtml(text, name, item)
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
  getDataFilteredProperties(): any;
}
export class ValidatorRunner {
  public onAsyncCompleted: (errors: Array<SurveyError>) => void;

  public run(owner: IValidatorOwner): Array<SurveyError> {
    const validators = owner.getValidators();
    const errors = new Array<SurveyError>();
    const asyncRunner = new AsyncElementsRunner(() => {
      if (this.onAsyncCompleted) {
        this.onAsyncCompleted(errors);
      }
    });
    if (validators.length > 0) {
      const properties = owner.getDataFilteredProperties();
      const value = owner.validatedValue;
      const title = owner.getValidatorTitle();
      validators.forEach(validator => {
        asyncRunner.addElement(validator.id);
        validator.validateOnCallback(value, (valRes: ValidatorResult): void => {
          if (!!valRes && !!valRes.error) {
            valRes.error.notificationType = validator.notificationType;
            errors.push(valRes.error);
          }
          asyncRunner.removeElement(validator.id);
        }, title, properties);
      });
    }
    const res = [].concat(...errors);
    errors.length = 0;
    asyncRunner.finish();
    return res;
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
  public validate(value: any, name?: string, properties?: any): ValidatorResult {
    if (this.isValueEmpty(value)) return null;
    if (!Helpers.isNumber(value)) {
      return new ValidatorResult(
        null,
        new RequreNumericError(this.text, this.errorOwner)
      );
    }
    const result = new ValidatorResult(Helpers.getNumber(value));
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
  public validate(value: any, name?: string, properties?: any): ValidatorResult {
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
    if (name === "textNoDigitsAllow") return this.getLocalizationString(name);
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
  public validate(value: any, name?: string, properties?: any): ValidatorResult {
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
  public validate(value: any, name?: string, properties?: any): ValidatorResult {
    if (!this.regex || this.isValueEmpty(value)) return null;
    const re = this.createRegExp();
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const res = this.hasError(re, value[i], name);
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
  public validate(value: any, name?: string, properties?: any): ValidatorResult {
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
  constructor(expression: string = null) {
    super();
    this.expression = expression;
  }
  public getType(): string {
    return "expressionvalidator";
  }
  public validateOnCallback(value: any, callback: (res: ValidatorResult) => void, name?: string, properties?: any): ValidatorResult {
    if (!!this.conditionRunner) {
      this.conditionRunner.onRunComplete = null;
    }
    let errorResult: ValidatorResult = null;
    const doCallBack = (res: boolean) => {
      errorResult = this.generateError(res, value, name);
      !!callback && callback(errorResult);
    };
    if (!this.ensureConditionRunner()) {
      doCallBack(true);
      return null;
    }
    this.conditionRunner.onRunComplete = (res) => {
      doCallBack(res);
    };
    if (!this.conditionRunner.canRun()) {
      doCallBack(res);
      return errorResult;
    }
    var res = this.conditionRunner.runContext(this.getValueGetterContext(), this.getPropertiesCopy(properties, "expression"));
    return errorResult || this.generateError(res, value, name);
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
  private ensureConditionRunner(): boolean {
    const expression = this.getExpressionFromSurvey("expression");
    if (!expression) return false;
    this.conditionRunner = new ConditionRunner(expression);
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
  public getValueGetterContext(): IValueGetterContext {
    const owner = <any>this.errorOwner;
    if (!!owner && !!owner.getValueGetterContext) return owner.getValueGetterContext();
    return super.getValueGetterContext();
  }
}

Serializer.addClass("surveyvalidator", [
  { name: "text", serializationProperty: "locText", visibleIndex: 99 },
  { name: "notificationType", choices: ["error", "warning", "info"], default: "error", visible: true, category: "general", visibleIndex: 100 }
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

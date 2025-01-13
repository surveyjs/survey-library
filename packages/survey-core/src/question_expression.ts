import { HashTable, Helpers, createDate } from "./helpers";
import { Question } from "./question";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { ExpressionRunner } from "./conditions";
import { settings } from "./settings";

/**
 * A class that describes the Expression question type. It is a read-only question type that calculates a value based on a specified expression.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-expression/ (linkStyle))
 */
export class QuestionExpressionModel extends Question {
  private expressionIsRunning: boolean;
  private expressionRunner: ExpressionRunner;
  constructor(name: string) {
    super(name);
    this.createLocalizableString("format", this);
    this.registerPropertyChangedHandlers(["expression"], () => {
      if (this.expressionRunner) {
        this.expressionRunner = this.createRunner();
      }
    });
    this.registerPropertyChangedHandlers(["format", "currency", "displayStyle"], () => {
      this.updateFormatedValue();
    });
  }
  public getType(): string {
    return "expression";
  }
  public get hasInput(): boolean {
    return false;
  }
  /**
   * A string that formats a question value. Use `{0}` to reference the question value in the format string.
   * @see displayStyle
   */
  public get format(): string {
    return this.getLocalizableStringText("format", "");
  }
  public set format(val: string) {
    this.setLocalizableStringText("format", val);
  }
  get locFormat(): LocalizableString {
    return this.getLocalizableString("format");
  }
  /**
   * An expression used to calculate the question value.
   *
   * Refer to the following help topic for more information: [Expressions](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#expressions).
   */
  public get expression(): string {
    return this.getPropertyValue("expression", "");
  }
  public set expression(val: string) {
    this.setPropertyValue("expression", val);
  }
  public locCalculation() {
    this.expressionIsRunning = true;
  }
  public unlocCalculation() {
    this.expressionIsRunning = false;
  }
  protected runConditionCore(values: HashTable<any>, properties: HashTable<any>) {
    super.runConditionCore(values, properties);
    if (
      !this.expression ||
      this.expressionIsRunning ||
      (!this.runIfReadOnly && this.isReadOnly)
    )
      return;
    this.locCalculation();
    if (!this.expressionRunner) {
      this.expressionRunner = this.createRunner();
    }
    this.expressionRunner.run(values, properties);
  }
  protected canCollectErrors(): boolean {
    return true;
  }
  public hasRequiredError(): boolean {
    return false;
  }
  private createRunner(): ExpressionRunner {
    const res = this.createExpressionRunner(this.expression);
    res.onRunComplete = (newValue) => {
      this.value = this.roundValue(newValue);
      this.unlocCalculation();
    };
    return res;
  }
  /**
   * The maximum number of fraction digits. Applies only if the `displayStyle` property is not `"none"`. Accepts values in the range from -1 to 20, where -1 disables the property.
   *
   * Default value: -1
   * @see displayStyle
   * @see minimumFractionDigits
   * @see precision
   */
  public get maximumFractionDigits(): number {
    return this.getPropertyValue("maximumFractionDigits");
  }
  public set maximumFractionDigits(val: number) {
    if (val < -1 || val > 20) return;
    this.setPropertyValue("maximumFractionDigits", val);
  }
  /**
   * The minimum number of fraction digits. Applies only if the `displayStyle` property is not `"none"`. Accepts values in the range from -1 to 20, where -1 disables the property.
   *
   * Default value: -1
   * @see displayStyle
   * @see maximumFractionDigits
   */
  public get minimumFractionDigits(): number {
    return this.getPropertyValue("minimumFractionDigits");
  }
  public set minimumFractionDigits(val: number) {
    if (val < -1 || val > 20) return;
    this.setPropertyValue("minimumFractionDigits", val);
  }
  private runIfReadOnlyValue: boolean;
  public get runIfReadOnly(): boolean {
    return this.runIfReadOnlyValue === true;
  }
  public set runIfReadOnly(val: boolean) {
    this.runIfReadOnlyValue = val;
  }
  public get formatedValue(): string {
    return this.getPropertyValue("formatedValue", "");
  }
  protected updateFormatedValue(): void {
    this.setPropertyValue("formatedValue", this.getDisplayValueCore(false, this.value));
  }
  protected onValueChanged() {
    this.updateFormatedValue();
  }
  updateValueFromSurvey(newValue: any, clearData: boolean): void {
    super.updateValueFromSurvey(newValue, clearData);
    this.updateFormatedValue();
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    var val = value === undefined || value === null ? this.defaultValue : value;
    var res = "";
    if (!this.isValueEmpty(val)) {
      var str = this.getValueAsStr(val);
      res = !this.format ? str : (<any>this.format)["format"](str);
    }
    if (!!this.survey) {
      res = this.survey.getExpressionDisplayValue(this, val, res);
    }
    return res;
  }
  /**
   * Specifies a display style for the question value.
   *
   * Possible values:
   *
   * - `"decimal"`
   * - `"currency"`
   * - `"percent"`
   * - `"date"`
   * - `"none"` (default)
   *
   * If you use the `"currency"` display style, you can also set the `currency` property to specify a currency other than USD.
   * @see currency
   * @see minimumFractionDigits
   * @see maximumFractionDigits
   * @see format
   */
  public get displayStyle(): string {
    return this.getPropertyValue("displayStyle");
  }
  public set displayStyle(val: string) {
    this.setPropertyValue("displayStyle", val);
  }
  /**
   * A three-letter currency code. Applies only if the `displayStyle` property is set to `"currency"`.
   *
   * Default value: "USD".
   * @see displayStyle
   * @see minimumFractionDigits
   * @see maximumFractionDigits
   * @see format
   */
  public get currency(): string {
    return this.getPropertyValue("currency");
  }
  public set currency(val: string) {
    if (getCurrecyCodes().indexOf(val) < 0) return;
    this.setPropertyValue("currency", val);
  }
  /**
   * Specifies whether to use grouping separators in number representation. Separators depend on the selected [locale](https://surveyjs.io/form-library/documentation/surveymodel#locale).
   *
   * Default value: `true`
   */
  public get useGrouping(): boolean {
    return this.getPropertyValue("useGrouping");
  }
  public set useGrouping(val: boolean) {
    this.setPropertyValue("useGrouping", val);
  }
  /**
   * Specifies how many decimal digits to keep in the expression value.
   *
   * Default value: -1 (unlimited)
   * @see maximumFractionDigits
   */
  public get precision(): number {
    return this.getPropertyValue("precision");
  }
  public set precision(val: number) {
    this.setPropertyValue("precision", val);
  }
  private roundValue(val: any): any {
    if(val === Infinity) return undefined;
    if(this.precision < 0) return val;
    if(!Helpers.isNumber(val)) return val;
    return parseFloat(val.toFixed(this.precision));
  }
  protected getValueAsStr(val: any): string {
    if (this.displayStyle == "date") {
      const d = createDate("question-expression", val);
      if (!!d && !!d.toLocaleDateString) return d.toLocaleDateString();
    }
    if (this.displayStyle != "none" && Helpers.isNumber(val)) {
      var locale = this.getLocale();
      if (!locale) locale = "en";
      var options = {
        style: this.displayStyle,
        currency: this.currency,
        useGrouping: this.useGrouping,
      };
      if (this.maximumFractionDigits > -1) {
        (<any>options)["maximumFractionDigits"] = this.maximumFractionDigits;
      }
      if (this.minimumFractionDigits > -1) {
        (<any>options)["minimumFractionDigits"] = this.minimumFractionDigits;
      }
      return val.toLocaleString(locale, options);
    }
    return val.toString();
  }
}

export function getCurrecyCodes(): Array<string> {
  return [
    "AED",
    "AFN",
    "ALL",
    "AMD",
    "ANG",
    "AOA",
    "ARS",
    "AUD",
    "AWG",
    "AZN",
    "BAM",
    "BBD",
    "BDT",
    "BGN",
    "BHD",
    "BIF",
    "BMD",
    "BND",
    "BOB",
    "BOV",
    "BRL",
    "BSD",
    "BTN",
    "BWP",
    "BYN",
    "BZD",
    "CAD",
    "CDF",
    "CHE",
    "CHF",
    "CHW",
    "CLF",
    "CLP",
    "CNY",
    "COP",
    "COU",
    "CRC",
    "CUC",
    "CUP",
    "CVE",
    "CZK",
    "DJF",
    "DKK",
    "DOP",
    "DZD",
    "EGP",
    "ERN",
    "ETB",
    "EUR",
    "FJD",
    "FKP",
    "GBP",
    "GEL",
    "GHS",
    "GIP",
    "GMD",
    "GNF",
    "GTQ",
    "GYD",
    "HKD",
    "HNL",
    "HRK",
    "HTG",
    "HUF",
    "IDR",
    "ILS",
    "INR",
    "IQD",
    "IRR",
    "ISK",
    "JMD",
    "JOD",
    "JPY",
    "KES",
    "KGS",
    "KHR",
    "KMF",
    "KPW",
    "KRW",
    "KWD",
    "KYD",
    "KZT",
    "LAK",
    "LBP",
    "LKR",
    "LRD",
    "LSL",
    "LYD",
    "MAD",
    "MDL",
    "MGA",
    "MKD",
    "MMK",
    "MNT",
    "MOP",
    "MRO",
    "MUR",
    "MVR",
    "MWK",
    "MXN",
    "MXV",
    "MYR",
    "MZN",
    "NAD",
    "NGN",
    "NIO",
    "NOK",
    "NPR",
    "NZD",
    "OMR",
    "PAB",
    "PEN",
    "PGK",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RSD",
    "RUB",
    "RWF",
    "SAR",
    "SBD",
    "SCR",
    "SDG",
    "SEK",
    "SGD",
    "SHP",
    "SLL",
    "SOS",
    "SRD",
    "SSP",
    "STD",
    "SVC",
    "SYP",
    "SZL",
    "THB",
    "TJS",
    "TMT",
    "TND",
    "TOP",
    "TRY",
    "TTD",
    "TWD",
    "TZS",
    "UAH",
    "UGX",
    "USD",
    "USN",
    "UYI",
    "UYU",
    "UZS",
    "VEF",
    "VND",
    "VUV",
    "WST",
    "XAF",
    "XAG",
    "XAU",
    "XBA",
    "XBB",
    "XBC",
    "XBD",
    "XCD",
    "XDR",
    "XOF",
    "XPD",
    "XPF",
    "XPT",
    "XSU",
    "XTS",
    "XUA",
    "XXX",
    "YER",
    "ZAR",
    "ZMW",
    "ZWL",
  ];
}

Serializer.addClass(
  "expression",
  [
    "expression:expression",
    { name: "format", serializationProperty: "locFormat" },
    {
      name: "displayStyle",
      default: "none",
      choices: ["none", "decimal", "currency", "percent", "date"],
    },
    {
      name: "currency",
      choices: () => {
        return getCurrecyCodes();
      },
      default: "USD",
      visibleIf: (obj: QuestionExpressionModel): boolean => {
        return obj.displayStyle === "currency";
      }
    },
    { name: "maximumFractionDigits:number", default: -1 },
    { name: "minimumFractionDigits:number", default: -1 },
    { name: "useGrouping:boolean", default: true },
    { name: "precision:number", default: -1, category: "data" },
    { name: "enableIf", visible: false },
    { name: "isRequired", visible: false },
    { name: "readOnly", visible: false },
    { name: "requiredErrorText", visible: false },
    { name: "resetValueIf", visible: false },
    { name: "setValueIf", visible: false },
    { name: "setValueExpression", visible: false },
    { name: "defaultValueExpression", visible: false },
    { name: "defaultValue", visible: false },
    { name: "correctAnswer", visible: false },
    { name: "requiredIf", visible: false }
  ],
  function() {
    return new QuestionExpressionModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("expression", (name) => {
  return new QuestionExpressionModel(name);
});

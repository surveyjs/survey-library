import { HashTable, Helpers } from "./helpers";
import { Question } from "./question";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { ExpressionRunner } from "./conditions";

/**
 * A Model for expression question. It is a read-only question. It calculates value based on epxression property.
 */
export class QuestionExpressionModel extends Question {
  private expressionIsRunning: boolean;
  private expressionRunner: ExpressionRunner;
  constructor(name: string) {
    super(name);
    this.createLocalizableString("format", this);
    this.registerFunctionOnPropertyValueChanged("expression", () => {
      if (this.expressionRunner) {
        this.expressionRunner = new ExpressionRunner(this.expression);
      }
    });
    this.registerFunctionOnPropertiesValueChanged(["format", "currency", "displayStyle"], () => {
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
   * Use this property to display the value in your own format. Make sure you have "{0}" substring in your string, to display the actual value.
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
   * The Expression that used to calculate the question value. You may use standard operators like +, -, * and /, squares (). Here is the example of accessing the question value {questionname}.
   * <br/>Example: "({quantity} * {price}) * (100 - {discount}) / 100"
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
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    super.runCondition(values, properties);
    if (
      !this.expression ||
      this.expressionIsRunning ||
      (!this.runIfReadOnly && this.isReadOnly)
    )
      return;
    this.locCalculation();
    if (!this.expressionRunner) {
      this.expressionRunner = new ExpressionRunner(this.expression);
    }
    this.expressionRunner.onRunComplete = (newValue) => {
      if (!Helpers.isTwoValueEquals(newValue, this.value)) {
        this.value = newValue;
      }
      this.unlocCalculation();
    };
    this.expressionRunner.run(values, properties);
  }
  protected canCollectErrors(): boolean {
    return true;
  }
  protected hasRequiredError(): boolean {
    return false;
  }
  /**
   * The maximum number of fraction digits to use if displayStyle is not "none". Possible values are from 0 to 20. The default value is -1 and it means that this property is not used.
   */
  public get maximumFractionDigits(): number {
    return this.getPropertyValue("maximumFractionDigits");
  }
  public set maximumFractionDigits(val: number) {
    if (val < -1 || val > 20) return;
    this.setPropertyValue("maximumFractionDigits", val);
  }
  /**
   * The minimum number of fraction digits to use if displayStyle is not "none". Possible values are from 0 to 20. The default value is -1 and it means that this property is not used.
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
  updateValueFromSurvey(newValue: any): void {
    super.updateValueFromSurvey(newValue);
    this.updateFormatedValue();
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    var val = this.isValueEmpty(value) ? this.defaultValue : value;
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
   * You may set this property to "decimal", "currency", "percent" or "date". If you set it to "currency", you may use the currency property to display the value in currency different from USD.
   * @see currency
   */
  public get displayStyle(): string {
    return this.getPropertyValue("displayStyle");
  }
  public set displayStyle(val: string) {
    this.setPropertyValue("displayStyle", val);
  }
  /**
   * Use it to display the value in the currency differen from USD. The displayStype should be set to "currency".
   * @see displayStyle
   */
  public get currency(): string {
    return this.getPropertyValue("currency");
  }
  public set currency(val: string) {
    if (getCurrecyCodes().indexOf(val) < 0) return;
    this.setPropertyValue("currency", val);
  }
  /**
   * 	Determines whether to display grouping separators. The default value is true.
   */
  public get useGrouping(): boolean {
    return this.getPropertyValue("useGrouping");
  }
  public set useGrouping(val: boolean) {
    this.setPropertyValue("useGrouping", val);
  }
  protected getValueAsStr(val: any): string {
    if (this.displayStyle == "date") {
      var d = new Date(val);
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
    },
    { name: "maximumFractionDigits:number", default: -1 },
    { name: "minimumFractionDigits:number", default: -1 },
    { name: "useGrouping:boolean", default: true },
    { name: "enableIf", visible: false },
    { name: "isRequired", visible: false },
    { name: "readOnly", visible: false },
    { name: "requiredErrorText", visible: false },
    { name: "defaultValueExpression", visible: false },
    { name: "defaultValue", visible: false },
    { name: "correctAnswer", visible: false },
    { name: "requiredIf", visible: false },
  ],
  function() {
    return new QuestionExpressionModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("expression", (name) => {
  return new QuestionExpressionModel(name);
});

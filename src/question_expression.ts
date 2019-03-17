import { HashTable } from "./helpers";
import { Question } from "./question";
import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { ExpressionRunner } from "./conditions";

/**
 * A Model for expression question. It is a read-only question. It calculates value based on epxression property.
 */
export class QuestionExpressionModel extends Question {
  private expressionIsRunning: boolean;
  private expressionRunner: ExpressionRunner;
  constructor(public name: string) {
    super(name);
    this.createLocalizableString("format", this);
    var self = this;
    this.registerFunctionOnPropertyValueChanged("expression", function() {
      if (self.expressionRunner) {
        self.expressionRunner = new ExpressionRunner(self.expression);
      }
    });
  }
  public getType(): string {
    return "expression";
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
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    super.runCondition(values, properties);
    if (!this.expression || this.expressionIsRunning) return;
    this.expressionIsRunning = true;
    if (!this.expressionRunner)
      this.expressionRunner = new ExpressionRunner(this.expression);
    this.value = this.expressionRunner.run(values, properties);
    this.expressionIsRunning = false;
  }
  /**
   * The maximum number of fraction digits to use. Possible values are from 0 to 20. The default value is -1 and it means that this property is not used.
   */
  public get maximumFractionDigits(): number {
    return this.getPropertyValue("maximumFractionDigits", -1);
  }
  public set maximumFractionDigits(val: number) {
    if (val < -1 || val > 20) return;
    this.setPropertyValue("maximumFractionDigits", val);
  }
  /**
   * The minimum number of fraction digits to use. Possible values are from 0 to 20. The default value is -1 and it means that this property is not used.
   */
  public get minimumFractionDigits(): number {
    return this.getPropertyValue("minimumFractionDigits", -1);
  }
  public set minimumFractionDigits(val: number) {
    if (val < -1 || val > 20) return;
    this.setPropertyValue("minimumFractionDigits", val);
  }
  protected getDisplayValueCore(keysAsText: boolean): any {
    var val = this.isValueEmpty(this.value) ? this.defaultValue : this.value;
    if (this.isValueEmpty(val)) return "";
    var str = this.getValueAsStr(val);
    if (!this.format) return str;
    return (<any>this.format)["format"](str);
  }
  /**
   * You may set this property to "decimal", "currency" or "percent". If you set it to "currency", you may use the currency property to display the value in currency different from USD.
   * @see currency
   */
  public get displayStyle(): string {
    return this.getPropertyValue("displayStyle", "none");
  }
  public set displayStyle(val: string) {
    this.setPropertyValue("displayStyle", val);
  }
  /**
   * Use it to display the value in the currency differen from USD. The displayStype should be set to "currency".
   * @see displayStyle
   */
  public get currency(): string {
    return this.getPropertyValue("currency", "USD");
  }
  public set currency(val: string) {
    if (getCurrecyCodes().indexOf(val) < 0) return;
    this.setPropertyValue("currency", val);
  }
  public get useGrouping(): boolean {
    return this.getPropertyValue("useGrouping", true);
  }
  public set useGrouping(val: boolean) {
    this.setPropertyValue("useGrouping", val);
  }
  protected getValueAsStr(val: any): string {
    if (
      this.displayStyle != "none" &&
      !isNaN(parseFloat(val)) &&
      isFinite(val)
    ) {
      var locale = this.getLocale();
      if (!locale) locale = "en";
      var options = {
        style: this.displayStyle,
        currency: this.currency,
        useGrouping: this.useGrouping
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

function getCurrecyCodes(): Array<string> {
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
    "ZAR",
    "ZMW",
    "ZWL"
  ];
}

JsonObject.metaData.addClass(
  "expression",
  [
    "expression:expression",
    { name: "format", serializationProperty: "locFormat" },
    {
      name: "displayStyle",
      default: "none",
      choices: ["none", "decimal", "currency", "percent"]
    },
    {
      name: "currency",
      choices: () => {
        return getCurrecyCodes();
      },
      default: "USD"
    },
    { name: "maximumFractionDigits:number", default: -1 },
    { name: "minimumFractionDigits:number", default: -1 },
    { name: "useGrouping:boolean", default: true },
    { name: "commentText", visible: false },
    { name: "enableIf", visible: false },
    { name: "isRequired", visible: false },
    { name: "readOnly", visible: false },
    { name: "requiredErrorText", visible: false },
    { name: "validators", visible: false }
  ],
  function() {
    return new QuestionExpressionModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("expression", name => {
  return new QuestionExpressionModel(name);
});

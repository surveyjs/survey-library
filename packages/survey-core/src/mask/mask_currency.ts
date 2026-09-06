import { Serializer } from "../jsonobject";
import { property } from "../decorators";
import { InputMaskNumeric } from "./mask_numeric";
import { IMaskedInputResult, ITextInputParams, numberDefinition } from "./mask_utils";

// The currency pattern grammar, a small subset of the CLDR notation: the symbol token is
// replaced with the author's currencySymbol, the number token with the formatted number, and an
// optional subpattern separator splits a positive form from a negative one. Everything else in
// a pattern is literal text.
const symbolToken = "\u00A4";
const numberToken = "#";
const signToken = "-";
const subpatternToken = ";";
// A resolved pattern ends up inside an input value, so it may not carry anything that cannot be
// typed or that changes the reading direction: the C0 and C1 ranges plus the bidi and other
// format characters. ICU emits U+200E/U+200F around the arabic and hebrew currency formats.
function hasControlCharacter(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || (code >= 0x7F && code <= 0x9F)) return true;
    if (code === 0x00AD || (code >= 0x0600 && code <= 0x0605) || code === 0x061C) return true;
    if ((code >= 0x200B && code <= 0x200F) || (code >= 0x202A && code <= 0x202E)) return true;
    if ((code >= 0x2060 && code <= 0x2064) || (code >= 0x2066 && code <= 0x206F)) return true;
    if (code === 0xFEFF || (code >= 0xFFF9 && code <= 0xFFFB)) return true;
  }
  return false;
}

interface ICurrencyAffixes {
  prefix: string;
  suffix: string;
  // the pattern places the sign, so the number text between the affixes carries no sign
  signInAffix: boolean;
  // The pattern's sign position within its affix, before it can be confused with a literal
  // minus sign inside currencySymbol.
  signIndex?: number;
  signInSuffix?: boolean;
}

function countToken(str: string, token: string): number {
  return str.split(token).length - 1;
}

export function isValidCurrencyPattern(value: string): boolean {
  if (!value || hasControlCharacter(value) || numberDefinition.test(value)) return false;
  const subpatterns = value.split(subpatternToken);
  if (subpatterns.length > 2) return false;
  for (let i = 0; i < subpatterns.length; i++) {
    const subpattern = subpatterns[i];
    if (countToken(subpattern, numberToken) !== 1) return false;
    if (countToken(subpattern, symbolToken) > 1) return false;
    // the positive form never spells a sign - the negative form of a pattern without an explicit
    // subpattern is that form with a sign in front - and an explicit negative form spells one
    if (countToken(subpattern, signToken) !== (i === 1 ? 1 : 0)) return false;
  }
  return true;
}

/**
 * A class that describes an input mask of the `"currency"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType).
 *
 * The following code shows how to specify the properties of this class within a survey JSON schema:
 *
 * ```js
 * const surveyJson = {
 *   "elements": [{
 *     "name": "textquestion1"
 *     "type": "text",
 *     "maskType": "currency",
 *     "maskSettings": {
 *       // Specify the properties of a currency input mask here
 *     }
 *   }]
 * }
 * ```
 *
 * [View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))
 */
export class InputMaskCurrency extends InputMaskNumeric {
  // The affixes the currently displayed text was wrapped with, kept apart from the format lookup
  // cache: a locale change callback may make the mask resolve the new locale's affixes before
  // this mask converts the text that the previous ones produced. Both sign forms are retained
  // because an entered text and a saved value may differ in sign.
  private textAffixes: { positive: ICurrencyAffixes, negative: ICurrencyAffixes };

  /**
   * One or several symbols to be displayed before the currency value.
   *
   * Assigning a prefix or a suffix - an empty string included - makes the mask display exactly
   * the affixes it was given and ignore `currencySymbol`.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))
   * @see suffix
   * @see currencySymbol
   */
  public get prefix(): string {
    return this.getPropertyValue("prefix");
  }
  public set prefix(val: string) {
    this.setExplicitPropertyValue("prefix", val);
  }
  /**
   * One or several symbols to be displayed after the currency value.
   * @see prefix
   * @see currencySymbol
   */
  public get suffix(): string {
    return this.getPropertyValue("suffix");
  }
  public set suffix(val: string) {
    this.setExplicitPropertyValue("suffix", val);
  }
  // The currency symbol the survey's format locale places around the number. It is the author's
  // to choose - the same currency is written differently in different locales - while the locale
  // decides where it goes and where the minus sign goes with it. Ignored when the mask has an
  // authored prefix or suffix.
  @property() currencySymbol: string;

  // An assigned affix - an empty string included - switches both sides to the authored values,
  // so a mask never renders one authored and one locale placed affix.
  private get hasAuthoredAffixes(): boolean {
    return this.getExplicitPropertyValue("prefix") !== undefined || this.getExplicitPropertyValue("suffix") !== undefined;
  }
  protected getAffixes(isNegative: boolean): ICurrencyAffixes {
    if (this.hasAuthoredAffixes) {
      return { prefix: this.prefix || "", suffix: this.suffix || "", signInAffix: false };
    }
    const symbol = this.currencySymbol;
    const pattern = !!symbol ? this.getFormatValue("currencyPattern", isValidCurrencyPattern) : undefined;
    // with nothing to place there is no affix, which is what a currency mask rendered before the
    // locale placed the symbol
    if (!pattern) return { prefix: "", suffix: "", signInAffix: false };
    const subpatterns = pattern.split(subpatternToken);
    let subpattern = subpatterns[0];
    if (isNegative) {
      subpattern = subpatterns.length > 1 ? subpatterns[1] : signToken + subpattern;
    }
    const numberIndex = subpattern.indexOf(numberToken);
    const prefixTemplate = subpattern.substring(0, numberIndex);
    const suffixTemplate = subpattern.substring(numberIndex + 1);
    const signInSuffix = prefixTemplate.indexOf(signToken) < 0;
    const signTemplate = signInSuffix ? suffixTemplate : prefixTemplate;
    return {
      prefix: this.insertSymbol(prefixTemplate, symbol),
      suffix: this.insertSymbol(suffixTemplate, symbol),
      signInAffix: true,
      signIndex: isNegative ? this.insertSymbol(signTemplate.substring(0, signTemplate.indexOf(signToken)), symbol).length : undefined,
      signInSuffix
    };
  }
  // The symbol is literal text: a pattern character or a replacement expression inside it means
  // nothing, which is why this is a split/join and not a replace().
  private insertSymbol(template: string, symbol: string): string {
    return template.split(symbolToken).join(symbol);
  }
  private getRenderedAffixes(): { positive: ICurrencyAffixes, negative: ICurrencyAffixes } {
    return { positive: this.getAffixes(false), negative: this.getAffixes(true) };
  }
  // The prefix the mask renders right now: an authored prefix, or the part of the format
  // locale's currency pattern that precedes a positive number. Read-only, never serialized.
  public get activePrefix(): string {
    return this.getAffixes(false).prefix;
  }
  // The suffix the mask renders right now: an authored suffix, or the part of the format
  // locale's currency pattern that follows a positive number. Read-only, never serialized.
  public get activeSuffix(): string {
    return this.getAffixes(false).suffix;
  }

  public getType(): string {
    return "currencymask";
  }

  protected getLocaleChangeInput(text: string): string {
    // the affixes that produced this text, not the ones the new locale resolves
    return this.unwrapText(text, this.textAffixes);
  }
  protected getLocaleChangeOutput(text: string): string {
    return this.wrapText(text);
  }

  private wrapText(str: string): string {
    // the snapshot is taken even for an empty text: it records the affixes the element shows now
    const affixes = this.getRenderedAffixes();
    this.textAffixes = affixes;
    if (!str) return str;
    const isNegative = str[0] === signToken;
    const active = isNegative ? affixes.negative : affixes.positive;
    // the number keeps its own sign unless the pattern places one
    const result = isNegative && active.signInAffix ? str.substring(signToken.length) : str;
    // This is bare numeric text. A matching boundary character belongs to the number, not to
    // an affix that has already been inserted.
    return active.prefix + result + active.suffix;
  }
  // Removes the affixes as literal boundary text and gives the number its sign back, so that
  // every path below this one - parsing, typing, unmasking - sees plain numeric text.
  private removeAffixes(str: string, pair: { positive: ICurrencyAffixes, negative: ICurrencyAffixes }): { text: string, prefixLength: number, signPosition?: number } {
    const negative = pair.negative;
    // the negative prefix can be longer than the positive one, so the form that is really in the
    // text decides what to strip and by how much the caret moves
    if (negative.signInAffix && this.hasAffixes(str, negative)) {
      const res = this.stripAffixes(str, negative);
      return {
        text: signToken + res.text,
        prefixLength: res.prefixLength - signToken.length,
        signPosition: negative.signInSuffix ? str.length - negative.suffix.length + negative.signIndex : negative.signIndex
      };
    }
    return this.stripAffixes(str, pair.positive);
  }
  private hasAffixes(str: string, affixes: ICurrencyAffixes): boolean {
    return (!affixes.prefix || str.indexOf(affixes.prefix) === 0) && (!affixes.suffix || str.endsWith(affixes.suffix));
  }
  private stripAffixes(str: string, affixes: ICurrencyAffixes): { text: string, prefixLength: number } {
    let result = str;
    let prefixLength = 0;
    if (!!affixes.prefix && result.indexOf(affixes.prefix) === 0) {
      prefixLength = affixes.prefix.length;
      result = result.substring(prefixLength);
    }
    if (!!affixes.suffix && result.endsWith(affixes.suffix)) {
      result = result.substring(0, result.length - affixes.suffix.length);
    }
    return { text: result, prefixLength: prefixLength };
  }
  private unwrapText(str: string, pair?: { positive: ICurrencyAffixes, negative: ICurrencyAffixes }): string {
    if (!str) return str;
    return this.removeAffixes(str, pair || this.getRenderedAffixes()).text;
  }
  public unwrapInputArgs(args: ITextInputParams): void {
    if (!args.prevValue) return;
    const res = this.removeAffixes(args.prevValue, this.getRenderedAffixes());
    args.prevValue = res.text;
    if (res.signPosition !== undefined) {
      // The rendered sign can precede the symbol or follow the number. If selected, remove the
      // virtual numeric sign as well; map the remaining selection only onto the numeric digits.
      const removesSign = args.selectionStart <= res.signPosition && args.selectionEnd > res.signPosition;
      if (removesSign) args.prevValue = args.prevValue.substring(signToken.length);
      const prefixLength = res.prefixLength + signToken.length;
      const signLength = removesSign ? 0 : signToken.length;
      const mapPosition = (position: number): number => Math.min(Math.max(position - prefixLength, 0) + signLength, args.prevValue.length);
      args.selectionStart = mapPosition(args.selectionStart);
      args.selectionEnd = mapPosition(args.selectionEnd);
      return;
    }
    if (res.prefixLength !== 0) {
      args.selectionStart = Math.max((args.selectionStart - res.prefixLength), 0);
      args.selectionEnd -= res.prefixLength;
    }
  }
  public processInput(args: ITextInputParams): IMaskedInputResult {
    // A paste or the adapter's change event can carry a complete formatted amount in insertedChars.
    // Strip its literal affixes too, while leaving individual keystrokes and bare input alone.
    if (!!args.insertedChars) {
      const pair = this.getRenderedAffixes();
      const isFormatted = [pair.negative, pair.positive].some(affixes => {
        const affixLength = affixes.prefix.length + affixes.suffix.length;
        return affixLength > 0 && args.insertedChars.length > affixLength && this.hasAffixes(args.insertedChars, affixes);
      });
      if (isFormatted) args.insertedChars = this.unwrapText(args.insertedChars, pair);
    }
    this.unwrapInputArgs(args);
    const result = super.processInput(args);
    if (!!result.value) {
      const isNegative = result.value[0] === signToken;
      const affixes = this.getAffixes(isNegative);
      const signShift = isNegative && affixes.signInAffix ? signToken.length : 0;
      result.caretPosition = Math.max(result.caretPosition - signShift, 0) + affixes.prefix.length;
    }
    result.value = this.wrapText(result.value);
    return result;
  }

  public getMaskedValue(src: any): string {
    const result = super.getMaskedValue(src);
    return this.wrapText(result);
  }
  public getUnmaskedValue(src: string): any {
    // the symbol is arbitrary author text - it may contain the decimal separator, a digit or a
    // minus sign - so it is removed as boundary text instead of being left to the number parser
    return super.getUnmaskedValue(this.unwrapText(src));
  }
}

Serializer.addClass(
  "currencymask",
  [
    // an assigned affix is written even when it is an empty string: "" suppresses the affixes,
    // while an omitted key lets the format locale place the currency symbol
    { name: "prefix", onSerializeValue: (obj: InputMaskCurrency) => obj.getExplicitPropertyValue("prefix") },
    { name: "suffix", onSerializeValue: (obj: InputMaskCurrency) => obj.getExplicitPropertyValue("suffix") },
    { name: "currencySymbol" },
  ],
  () => {
    return new InputMaskCurrency();
  },
  "numericmask"
);

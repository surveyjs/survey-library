import { Serializer } from "../jsonobject";
import { InputMaskNumeric } from "./mask_numeric";
import { IMaskedInputResult, ITextInputParams, numberDefinition } from "./mask_utils";

// The currency pattern grammar uses single-character symbols, like the other mask patterns:
// "#" stands for the whole formatted number, digits and separators together (exactly one), "@"
// for the resolved currencySymbol (at most one), and "-" marks where the minus sign of a negative
// amount goes (at most one, optional). A positive amount renders the "-" as nothing; a pattern
// without one puts the sign at the very beginning of the text. Everything else is literal text,
// and there is no escape: no currency symbol or code contains "@", "#" or a minus. The symbol
// and the number are inserted after the pattern is read and are never read as symbols
// themselves, so "US$" or a typed "-1,234.56" means nothing to the grammar.
const symbolToken = "@";
const numberToken = "#";
const signToken = "-";
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

// A curated or overridden symbol goes into an input value as literal text, so it may not carry a
// control character or a digit the number parser would pick up. An author's own currencySymbol is
// not validated: it is theirs to write, digits included.
export function isValidCurrencySymbol(value: string): boolean {
  if (!value || hasControlCharacter(value)) return false;
  return !numberDefinition.test(value);
}

// A second "-" is invalid rather than literal: a literal minus next to the number could not be
// told apart from the respondent's sign once the affixes are stripped and the caret is mapped.
export function isValidCurrencyPattern(value: string): boolean {
  if (!value || hasControlCharacter(value) || numberDefinition.test(value)) return false;
  return countToken(value, numberToken) === 1 && countToken(value, symbolToken) <= 1 && countToken(value, signToken) <= 1;
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

  // The currency symbol the survey's format locale places around the number. It defaults to the
  // symbol of that locale's own currency and is the author's to override - a survey in german may
  // well ask for dollars - while the pattern decides where the symbol goes and where the minus
  // sign goes with it. An explicit "" renders no symbol. A pattern without "@" ignores it.
  public get currencySymbol(): string {
    return this.getPropertyValue("currencySymbol");
  }
  public set currencySymbol(val: string) {
    this.setExplicitPropertyValue("currencySymbol", val);
  }
  // The pattern authored on this mask, in the "#"/"@"/"-" grammar above. Unlike currencySymbol
  // and the separators it has no defaultFunc: an unset pattern must read as empty so that an editor
  // can show the inherited one (activeCurrencyPattern) as a placeholder rather than as a value.
  // An empty pattern has no meaning of its own - "no affixes" is spelled currencySymbol: "" - so
  // "" is stored as unset.
  public get currencyPattern(): string {
    return this.getPropertyValue("currencyPattern");
  }
  public set currencyPattern(val: string) {
    this.setExplicitPropertyValue("currencyPattern", val || undefined);
  }
  // The pattern the mask renders with: the authored one, then survey.regionalFormat, then the
  // format locale's curated one - the first valid wins. "" when nothing resolves. Read-only, never
  // serialized. An authored pattern is read directly, an inherited one through the format cache.
  public get activeCurrencyPattern(): string {
    const pattern = this.currencyPattern;
    if (!!pattern && isValidCurrencyPattern(pattern)) return pattern;
    return this.getFormatValue("currencyPattern", isValidCurrencyPattern) || "";
  }
  /**
   * @deprecated Use the `currencyPattern` property instead. Kept for backward compatibility: it returns the text rendered before a positive number, and an assigned value is written into `currencyPattern`.
   */
  public get prefix(): string {
    return this.activePrefix;
  }
  public set prefix(val: string) {
    this.setAffix(val, true);
  }
  /**
   * @deprecated Use the `currencyPattern` property instead. Kept for backward compatibility: it returns the text rendered after a positive number, and an assigned value is written into `currencyPattern`.
   */
  public get suffix(): string {
    return this.activeSuffix;
  }
  public set suffix(val: string) {
    this.setAffix(val, false);
  }
  // A mask JSON is applied twice when a question loads - setData, then JsonObject's own pass over
  // the same keys in their JSON order - so an affix met while loading waits for the end of the
  // load: it then rewrites the pattern that JSON carries instead of being overwritten by it.
  private pendingAffixes: { prefix?: string, suffix?: string };
  public endLoadingFromJson(): void {
    super.endLoadingFromJson();
    const pending = this.pendingAffixes;
    this.pendingAffixes = undefined;
    if (!pending) return;
    this.setAffix(pending.prefix, true);
    this.setAffix(pending.suffix, false);
  }
  // Writes an obsolete affix into currencyPattern as literal text - there is no escape, so an "@"
  // in it places the symbol and a "#", a "-" or a digit makes the pattern invalid. The side that is
  // not assigned keeps its template, "@" and "-" included, when a pattern is authored, and becomes
  // "" otherwise: authoring one affix used to author both, and a mask that is still loading has no
  // survey yet, so copying the inherited side would bake the english text in.
  private setAffix(val: string, isPrefix: boolean): void {
    // setData assigns every registered property, so a pattern-only JSON reaches this with
    // undefined right after the pattern was stored
    if (val === undefined || val === null) return;
    if (this.isLoadingFromJson) {
      this.pendingAffixes = this.pendingAffixes || {};
      this.pendingAffixes[isPrefix ? "prefix" : "suffix"] = val;
      return;
    }
    const pattern = this.currencyPattern || "";
    // The number is the "#" nearest to the side that is kept, so that a literal "#" written by an
    // earlier assignment of the same affix stays in that affix and a repeated assignment is a
    // no-op. A valid pattern has only one.
    const numberIndex = isPrefix ? pattern.lastIndexOf(numberToken) : pattern.indexOf(numberToken);
    let prefix = numberIndex > -1 ? pattern.substring(0, numberIndex) : "";
    let suffix = numberIndex > -1 ? pattern.substring(numberIndex + 1) : "";
    if (isPrefix) {
      prefix = String(val);
    } else {
      suffix = String(val);
    }
    // The assigned text is literal, so only the retained side can place the sign. Otherwise it
    // goes right before the number, where the old affix mode rendered it: "$ -#" is "$ -123".
    const retained = isPrefix ? suffix : prefix;
    const sign = retained.indexOf(signToken) > -1 ? "" : signToken;
    this.currencyPattern = prefix + sign + numberToken + suffix;
  }

  protected getAffixes(isNegative: boolean): ICurrencyAffixes {
    const pattern = this.activeCurrencyPattern;
    const hasSymbol = pattern.indexOf(symbolToken) > -1;
    const symbol = hasSymbol ? this.currencySymbol : "";
    // No pattern resolves, or an explicitly empty symbol meets a pattern that places one: the
    // number is left bare. A pattern without "@" is literal text and renders as it is.
    if (!pattern || hasSymbol && !symbol) return { prefix: "", suffix: "", signInAffix: false };
    // one pattern serves both forms: a positive amount drops the sign, a negative one keeps it
    // where the pattern puts it or gets it at the very beginning
    let template = pattern;
    if (!isNegative) {
      template = template.split(signToken).join("");
    } else if (template.indexOf(signToken) < 0) {
      template = signToken + template;
    }
    const numberIndex = template.indexOf(numberToken);
    const prefixTemplate = template.substring(0, numberIndex);
    const suffixTemplate = template.substring(numberIndex + 1);
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
  // The prefix the mask renders right now: the part of activeCurrencyPattern that precedes a
  // positive number, with the symbol inserted. Read-only, never serialized.
  public get activePrefix(): string {
    return this.getAffixes(false).prefix;
  }
  // The suffix the mask renders right now: the part of activeCurrencyPattern that follows a
  // positive number, with the symbol inserted. Read-only, never serialized.
  public get activeSuffix(): string {
    return this.getAffixes(false).suffix;
  }

  public getType(): string {
    return "currencymask";
  }
  protected getLiteralText(): string {
    return super.getLiteralText() + this.activePrefix + this.activeSuffix;
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
    // the format locale's own symbol is the default, so an unset property is not written while an
    // explicit "" - "render no symbol" - is
    {
      name: "currencySymbol",
      defaultFunc: (obj: InputMaskCurrency) => !!obj ? obj.getFormatValue("currencySymbol", isValidCurrencySymbol) || "" : "",
      onSerializeValue: (obj: InputMaskCurrency) => obj.getExplicitPropertyValue("currencySymbol")
    },
    { name: "currencyPattern", onSerializeValue: (obj: InputMaskCurrency) => obj.getExplicitPropertyValue("currencyPattern") },
    // Obsolete views over currencyPattern: never written, but an old JSON still assigns them. They
    // are registered after currencyPattern because setData assigns in this order, so the affixes of
    // a JSON that - wrongly - carries both are applied last and win.
    { name: "prefix", isSerializable: false, visible: false },
    { name: "suffix", isSerializable: false, visible: false },
  ],
  () => {
    return new InputMaskCurrency();
  },
  "numericmask"
);

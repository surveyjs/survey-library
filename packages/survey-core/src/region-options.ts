import { Base } from "./base";
import { ISurvey } from "./base-interfaces";
import { Serializer } from "./jsonobject";
import { property } from "./decorators";
import { ILocaleData, getLocaleDataLocales } from "./locale-data";

// The Creator groups the properties of the object under this category.
export const regionOptionsCategory = "regionOptions";

// Survey-wide format overrides. A field set here outranks the curated locale-data entry of the
// survey's format locale and is outranked by a value authored on a mask, so the property names
// are exactly the ILocaleData field names: the resolution seam (InputMaskBase.getFormatValue)
// looks an override and a curated default up with the same key. The currency symbol is not
// locale data and stays per mask.
export class RegionOptions extends Base implements ILocaleData {
  public owner: ISurvey;

  @property() datePattern: string;
  @property() timePattern: string;
  @property() decimalSeparator: string;
  @property() thousandsSeparator: string;
  @property() currencyPattern: string;

  // The format locale as a BCP-47 tag ("de", "en-GB"), not a region code. Unlike the format
  // fields, "" carries no meaning of its own here - both "" and unset mean "follow the survey
  // locale" - so it is stored as unset and never serialized.
  public get locale(): string {
    return this.getPropertyValue("locale");
  }
  public set locale(val: string) {
    this.setPropertyValue("locale", val || undefined);
  }

  // Called once after this object has loaded a JSON of its own, with the names of the fields the
  // load actually changed. Base suppresses property events while an object loads, so a direct
  // regionOptions.fromJSON(...) reports itself here and nowhere else.
  public loadingCompletedCallback: (changedNames: Array<string>) => void;

  public getType(): string {
    return "regionoptions";
  }
  public startLoadingFromJson(json?: any): void {
    super.startLoadingFromJson(json);
    this.storedValuesBeforeLoad = this.getStoredValues();
  }
  public endLoadingFromJson(): void {
    super.endLoadingFromJson();
    const before = this.storedValuesBeforeLoad;
    this.storedValuesBeforeLoad = undefined;
    if (!before || !this.loadingCompletedCallback) return;
    const after = this.getStoredValues();
    // an omitted key keeps its stored value (JsonObject visits only supplied keys), so what
    // changed is the difference, not the set of keys the JSON carried
    const changedNames = Object.keys(after).filter(name => after[name] !== before[name]);
    if (changedNames.length > 0) {
      this.loadingCompletedCallback(changedNames);
    }
  }
  public dispose(): void {
    super.dispose();
    this.loadingCompletedCallback = undefined;
  }
  private storedValuesBeforeLoad: { [name: string]: any };
  private getStoredValues(): { [name: string]: any } {
    const res: { [name: string]: any } = {};
    Serializer.getProperties(this.getType()).forEach(prop => {
      res[prop.name] = this.getExplicitPropertyValue(prop.name);
    });
    return res;
  }
  // Base.setPropertyValue treats "" and unset as equal and would neither store the one over the
  // other nor notify; here "" is a stored value (thousandsSeparator: "" disables grouping), so an
  // assignment is stored and notified whenever it differs from what is stored.
  public setPropertyValue(name: string, val: any): void {
    if (this.isDisposed) return;
    const oldValue = this.getPropertyValueWithoutDefault(name);
    if (val === oldValue) return;
    this.setPropertyValueDirectly(name, val);
    this.propertyValueChanged(name, oldValue, val);
  }
  public getSurvey(live: boolean = false): ISurvey {
    return this.owner;
  }
  // True when no field is stored. Not truthiness: thousandsSeparator: "" ("disable grouping
  // survey-wide") is a stored value, and treating it as empty would drop the object from JSON
  // and turn it into "inherit grouping" on reload.
  public get isEmpty(): boolean {
    return Serializer.getProperties(this.getType()).every(prop => this.getExplicitPropertyValue(prop.name) === undefined);
  }
  // The stored value, or undefined when the field inherits the locale default.
  public getExplicitPropertyValue(name: string): any {
    return this.getPropertyValueWithoutDefault(name);
  }
}

// onSerializeValue writes the stored value whenever there is one, including "" and a value equal
// to the locale default: the serializer would otherwise treat "" as a default (no static default
// exists) and drop it. The single-character limit on the separators mirrors the numeric mask's
// registration so that the property grid enforces it.
function serializeStoredValue(name: string): (obj: RegionOptions) => any {
  return (obj: RegionOptions) => obj.getExplicitPropertyValue(name);
}
Serializer.addClass(
  "regionoptions",
  [
    {
      name: "locale:string",
      category: regionOptionsCategory,
      choices: () => getLocaleDataLocales(),
      onSerializeValue: serializeStoredValue("locale"),
    },
    { name: "datePattern:string", category: regionOptionsCategory, onSerializeValue: serializeStoredValue("datePattern") },
    { name: "timePattern:string", category: regionOptionsCategory, onSerializeValue: serializeStoredValue("timePattern") },
    { name: "decimalSeparator:string", category: regionOptionsCategory, maxLength: 1, onSerializeValue: serializeStoredValue("decimalSeparator") },
    { name: "thousandsSeparator:string", category: regionOptionsCategory, maxLength: 1, onSerializeValue: serializeStoredValue("thousandsSeparator") },
    { name: "currencyPattern:string", category: regionOptionsCategory, onSerializeValue: serializeStoredValue("currencyPattern") },
  ],
  function () {
    return new RegionOptions();
  }
);

import { Base } from "../base";
import { Serializer } from "../jsonobject";
import { LocalizableString } from "../localizablestring";
import { ISurvey } from "../base-interfaces";
import { getLocaleString } from "../surveyStrings";

// The control that holds a preset: the survey its title is localized for.
export interface IFilterPresetOwner {
  getSurvey(live?: boolean): ISurvey;
}
// An action id for a preset's row, chip or tab: base, then base-2, base-3... for a second preset with
// the same name (an authoring error), so a list, a row and a renderer can still tell them apart.
export function getUniqueFilterActionId(base: string, isUsed: (id: string) => boolean): string {
  let id = base;
  for (let n = 2; isUsed(id); n++) {
    id = base + "-" + n;
  }
  return id;
}

// The longest title a preset may get: the mockup's counter.
export const filterPresetTitleMaxLength = 32;
// Whether another preset already has the title: trimmed and compared case-insensitively, as a
// respondent reads them.
export function isFilterPresetTitleTaken(title: string, otherTitles: Array<string>): boolean {
  const key = (title || "").trim().toLocaleLowerCase();
  return otherTitles.some((other: string): boolean => (other || "").trim().toLocaleLowerCase() === key);
}
// Why a title will not do for a preset - none given, too long, another preset's - or undefined when
// it will: what the preset dialogs and "Save as..." check a title by.
export function getFilterPresetTitleError(value: any, otherTitles: Array<string>, locale: string): string {
  const title = (value || "").toString().trim();
  if (!title) return getLocaleString("filterPresetNameRequired", locale);
  if (title.length > filterPresetTitleMaxLength) {
    return getLocaleString("textMaxLength", locale).replace("{0}", filterPresetTitleMaxLength.toString());
  }
  return isFilterPresetTitleTaken(title, otherTitles) ? getLocaleString("filterPresetTitleExists", locale) : undefined;
}

// What a preset lets the respondent do to it. undefined: what the control allows (allowEditPresets,
// allowDeletePresets, allowAddPresets); true or false overrides the control either way.
export interface IFilterPresetPermissions {
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowCopy?: boolean;
}
// The one list of them: whatever copies, compares or stores a preset's permissions goes by it.
export const filterPresetPermissions: Array<keyof IFilterPresetPermissions> = ["allowEdit", "allowDelete", "allowCopy"];
// Copies the permissions src gives (a boolean each) and leaves dest's others as they are.
export function assignFilterPresetPermissions(dest: Partial<IFilterPresetPermissions>, src: Partial<IFilterPresetPermissions>): void {
  filterPresetPermissions.forEach((key: keyof IFilterPresetPermissions): void => {
    if (typeof src[key] === "boolean") dest[key] = src[key];
  });
}
// Copies all of them as they are, undefined too: what the JSON made a preset, put back or remembered.
export function copyFilterPresetPermissions(dest: IFilterPresetPermissions, src: IFilterPresetPermissions): void {
  filterPresetPermissions.forEach((key: keyof IFilterPresetPermissions): void => { dest[key] = src[key]; });
}
// The JSON of a preset, and what addPreset() and updatePreset() take.
export interface IFilterPreset extends IFilterPresetPermissions {
  name: string;
  title: string;
  expression: string;
}
// A preset: one saved filter the survey author defines (in JSON or in Creator's property grid), the
// respondent or the application adds, that the end user applies to the data with a single click by
// picking it in the Filter Control (applyPreset). Its expression is all it filters by, however it was
// written - typed, built from the fields' conditions or answered by AI: one that decomposes into
// conditions on the control's fields is edited as fields, any other as text.
export class FilterPreset extends Base implements IFilterPreset {
  constructor(name: string) {
    super();
    this.locTitle.onGetTextCallback = (text: string): string => {
      return text || this.name;
    };
    this.name = name;
  }
  public getType(): string { return "filterpreset"; }

  // Set by the control as the preset joins its presets. Without it a preset knows no survey, and a
  // localized title (title: { default, de }) would never follow the survey's locale.
  private presetOwnerValue: IFilterPresetOwner;
  public get presetOwner(): IFilterPresetOwner { return this.presetOwnerValue; }
  public set presetOwner(val: IFilterPresetOwner) {
    this.presetOwnerValue = val;
    this.locTitle.strChanged();
  }
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.presetOwnerValue ? this.presetOwnerValue.getSurvey(live) : null;
  }

  public get name(): string { return this.getPropertyValue("name"); }
  public set name(val: string) { this.setPropertyValue("name", val); }

  public get title(): string {
    const locStr = this.locTitle;
    this.locStringAccessed(locStr);
    return locStr.calculatedText;
  }
  public set title(val: string) { this.locTitle.text = val; }
  public get locTitle(): LocalizableString { return this.getOrCreateLocStr("title"); }

  public get expression(): string { return this.getPropertyValue("expression"); }
  public set expression(val: string) { this.setPropertyValue("expression", val); }

  public get allowEdit(): boolean { return this.getPropertyValue("allowEdit"); }
  public set allowEdit(val: boolean) { this.setPropertyValue("allowEdit", val); }

  public get allowDelete(): boolean { return this.getPropertyValue("allowDelete"); }
  public set allowDelete(val: boolean) { this.setPropertyValue("allowDelete", val); }

  public get allowCopy(): boolean { return this.getPropertyValue("allowCopy"); }
  public set allowCopy(val: boolean) { this.setPropertyValue("allowCopy", val); }
}

Serializer.addClass("filterpreset", [
  { name: "!name", isUnique: true },
  { name: "title:text", serializationProperty: "locTitle", dependsOn: "name" },
  // Not ":condition": ":condition" makes JsonObjectProperty.isExpression true and everything that
  // discovers expressions by type - Base.validateExpressions(), the linter - would read it with the
  // survey as the variable context, while its variables are record fields. ":text" is a plain string
  // too; it only gives the expression a multi-line box in Creator.
  { name: "expression:text" },
  // undefined by default - the control's permission (see IFilterPresetPermissions). defaultFunc, not
  // default: a boolean with no default treats false as its default and would not serialize it.
  { name: "allowEdit:boolean", defaultFunc: (): boolean => undefined },
  { name: "allowDelete:boolean", defaultFunc: (): boolean => undefined },
  // No UI reads canCopyPreset yet: hidden until a preset can be copied.
  { name: "allowCopy:boolean", defaultFunc: (): boolean => undefined, visible: false },
], () => new FilterPreset(""));

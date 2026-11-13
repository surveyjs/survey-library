import { Base } from "../base";
import { Serializer } from "../jsonobject";
import { LocalizableString } from "../localizablestring";
import { ISurvey } from "../base-interfaces";

// The control that holds a preset: the survey its title is localized for.
export interface IFilterItemOwner {
  getSurvey(live?: boolean): ISurvey;
}
// An action id for a preset's chip or tab: base, then base-2, base-3... for a second preset with the
// same name (an authoring error), so a row and a renderer can still tell them apart.
export function getUniqueFilterActionId(base: string, isUsed: (id: string) => boolean): string {
  let id = base;
  for (let n = 2; isUsed(id); n++) {
    id = base + "-" + n;
  }
  return id;
}

// A preset: one saved filter the survey author defines (in JSON or in Creator's property grid), that
// the end user applies to the data with a single click by picking it in the Filter Control, and can
// then edit over (see ownConditions/saveActiveItem in question_filter.ts). Its expression is all it
// filters by, however it was written - typed, built from the fields' conditions or answered by AI:
// one that decomposes into conditions on the control's fields is edited as fields, any other as text.
export class FilterItem extends Base {
  constructor(name: string) {
    super();
    this.locTitle.onGetTextCallback = (text: string): string => {
      return text || this.name;
    };
    this.name = name;
  }
  public getType(): string { return "filteritem"; }

  // Set by the control as the preset joins its items. Without it a preset knows no survey, and a
  // localized title (title: { default, de }) would never follow the survey's locale.
  private itemOwnerValue: IFilterItemOwner;
  public get itemOwner(): IFilterItemOwner { return this.itemOwnerValue; }
  public set itemOwner(val: IFilterItemOwner) {
    this.itemOwnerValue = val;
    this.locTitle.strChanged();
  }
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.itemOwnerValue ? this.itemOwnerValue.getSurvey(live) : null;
  }

  public get name(): string { return this.getPropertyValue("name"); }
  public set name(val: string) { this.setPropertyValue("name", val); }

  public get title(): string { return this.locTitle.calculatedText; }
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

Serializer.addClass("filteritem", [
  { name: "!name", isUnique: true },
  { name: "title:text", serializationProperty: "locTitle", dependsOn: "name" },
  // Not ":condition": ":condition" makes JsonObjectProperty.isExpression true and everything that
  // discovers expressions by type - Base.validateExpressions(), the linter - would read it with the
  // survey as the variable context, while its variables are record fields. ":text" is a plain string
  // too; it only gives the expression a multi-line box in Creator.
  { name: "expression:text" },
  { name: "allowEdit:boolean", default: true },
  { name: "allowDelete:boolean", default: true },
  // No UI reads canCopyItem yet: hidden until a preset can be copied.
  { name: "allowCopy:boolean", default: true, visible: false },
], () => new FilterItem(""));

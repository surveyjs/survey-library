import { Base } from "../base";
import { Serializer } from "../jsonobject";
import { LocalizableString } from "../localizablestring";

// One saved filter a Filter Control offers the end user. type names which editor authored the
// expression - "row" (a single field/operator/value row), "builder" (a full condition builder) or
// "ai" (a natural-language prompt) - but no such editor exists yet: whichever type an item carries,
// its expression is applied identically as a filter expression string. type and prompt are storage
// only until a future task wires an editor to them.
export class FilterItem extends Base {
  constructor(name: string) {
    super();
    this.locTitle.onGetTextCallback = (text: string): string => {
      return text || this.name;
    };
    this.name = name;
  }
  public getType(): string { return "filteritem"; }

  // toObjectCore (jsonobject.ts) reserves the "type" key for the polymorphic class
  // discriminator and always skips it in its property loop before findProperty ever runs, so
  // a class-owned "type" property can only be read here, before that loop, or not at all.
  // Safe here because items:filteritem[] declares className: "filteritem" (Task T8), so
  // neither the array-item factory nor the discriminator writer ever look at this key.
  startLoadingFromJson(json?: any): void {
    super.startLoadingFromJson(json);
    if (!!json && json.type !== undefined) {
      this.type = json.type;
    }
  }

  public get name(): string { return this.getPropertyValue("name"); }
  public set name(val: string) { this.setPropertyValue("name", val); }

  public get title(): string { return this.locTitle.calculatedText; }
  public set title(val: string) { this.locTitle.text = val; }
  public get locTitle(): LocalizableString { return this.getOrCreateLocStr("title"); }

  public get type(): string { return this.getPropertyValue("type"); }
  public set type(val: string) { this.setPropertyValue("type", val); }

  public get expression(): string { return this.getPropertyValue("expression"); }
  public set expression(val: string) { this.setPropertyValue("expression", val); }

  public get prompt(): string { return this.locPrompt.text; }
  public set prompt(val: string) { this.locPrompt.text = val; }
  public get locPrompt(): LocalizableString { return this.getOrCreateLocStr("prompt"); }

  public get allowEdit(): boolean { return this.getPropertyValue("allowEdit"); }
  public set allowEdit(val: boolean) { this.setPropertyValue("allowEdit", val); }

  public get allowDelete(): boolean { return this.getPropertyValue("allowDelete"); }
  public set allowDelete(val: boolean) { this.setPropertyValue("allowDelete", val); }

  public get allowCopy(): boolean { return this.getPropertyValue("allowCopy"); }
  public set allowCopy(val: boolean) { this.setPropertyValue("allowCopy", val); }
}

Serializer.addClass("filteritem", [
  { name: "!name", isUnique: true },
  { name: "title:text", serializationProperty: "locTitle", dependsOn: "name", visible: false },
  { name: "type", default: "row", choices: ["row", "builder", "ai"], visible: false },
  // A plain string and not ":condition": ":condition" makes JsonObjectProperty.isExpression true and
  // everything that discovers expressions by type - Base.validateExpressions(), the linter - would
  // read it with the survey as the variable context, while its variables are record fields.
  { name: "expression", visible: false },
  { name: "prompt:text", serializationProperty: "locPrompt", visible: false,
    dependsOn: "type", visibleIf: (obj: any): boolean => obj.type === "ai" },
  { name: "allowEdit:boolean", default: true, visible: false },
  { name: "allowDelete:boolean", default: true, visible: false },
  { name: "allowCopy:boolean", default: true, visible: false },
], () => new FilterItem(""));

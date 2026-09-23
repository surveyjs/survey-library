import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionNonValue } from "./questionnonvalue";
import { FilterField } from "./filter/filter-field";
import { FilterItem } from "./filter/filter-item";
import { buildSearchFragment } from "./filter/filter-expression";
import { IDynamicDataFilterField } from "./dynamic-data/dynamic-data-fields";
import { combineFilterExpressions } from "./dynamic-data/dynamic-data-filter";

// The Filter Control. It descends from QuestionNonValue because it is a control and not an answer:
// it never assigns this.value, so it stays out of survey.data, out of the condition editor and out
// of validation. What the end user does with it is UI state, not survey data.
export class QuestionFilterModel extends QuestionNonValue {
  private onItemPropertyChanged = (): void => {
    this.updateFilterExpression();
  };
  // A field contributes to the search through its choices, so a choice change is a change of
  // the expression.
  private onFieldPropertyChanged = (): void => {
    this.updateFilterExpression();
  };

  constructor(name: string) {
    super(name);
    this.createNewArray("fields",
      (field: FilterField): void => { this.onFieldAdded(field); },
      (field: FilterField): void => { this.onFieldRemoved(field); });
    this.createNewArray("items",
      (item: FilterItem): void => { this.onItemAdded(item); },
      (item: FilterItem): void => { this.onItemRemoved(item); });
  }
  public getType(): string { return "filter"; }
  // The one place this control parts company with html and image: it does have a title.
  protected get supportTitle(): boolean { return true; }

  public get source(): string { return this.getPropertyValue("source", ""); }
  public set source(val: string) { this.setPropertyValue("source", val); }

  public get fields(): Array<FilterField> { return this.getPropertyValue("fields"); }
  public set fields(val: Array<FilterField>) { this.setPropertyValue("fields", val); }

  public get items(): Array<FilterItem> { return this.getPropertyValue("items"); }
  public set items(val: Array<FilterItem>) { this.setPropertyValue("items", val); }

  public get defaultItem(): string { return this.getPropertyValue("defaultItem", ""); }
  public set defaultItem(val: string) { this.setPropertyValue("defaultItem", val); }

  public get allowMultipleItems(): boolean { return this.getPropertyValue("allowMultipleItems"); }
  public set allowMultipleItems(val: boolean) { this.setPropertyValue("allowMultipleItems", val); }

  public get allowAddItems(): boolean { return this.getPropertyValue("allowAddItems"); }
  public set allowAddItems(val: boolean) { this.setPropertyValue("allowAddItems", val); }

  public get allowReorderItems(): boolean { return this.getPropertyValue("allowReorderItems"); }
  public set allowReorderItems(val: boolean) { this.setPropertyValue("allowReorderItems", val); }

  public get showSearch(): boolean { return this.getPropertyValue("showSearch"); }
  public set showSearch(val: boolean) { this.setPropertyValue("showSearch", val); }

  public get searchFields(): Array<string> { return this.getPropertyValue("searchFields"); }
  public set searchFields(val: Array<string>) { this.setPropertyValue("searchFields", val); }

  public get allowChangeSearchFields(): boolean { return this.getPropertyValue("allowChangeSearchFields"); }
  public set allowChangeSearchFields(val: boolean) { this.setPropertyValue("allowChangeSearchFields", val); }

  // What the end user typed into the quick search box. Not registered in the serializer: it is
  // runtime state and never authored. It is not named searchText because Base.searchText(text,
  // founded) is a method PanelModelBase.searchText calls on every element of a survey.
  public get searchString(): string { return this.getPropertyValue("searchString", ""); }
  public set searchString(val: string) { this.setPropertyValue("searchString", val || ""); }

  // The composed output of the control. Not registered either: it is computed, never authored.
  public get filterExpression(): string { return this.getPropertyValue("filterExpression", ""); }

  // Standalone mode: the fields the author declared on the control itself.
  public getFilterFields(): Array<IDynamicDataFilterField> {
    return this.fields.map((field: FilterField): IDynamicDataFilterField => field.getFilterField());
  }
  public getFieldByName(name: string): IDynamicDataFilterField {
    if (!name) return undefined;
    const fields = this.getFilterFields();
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].name === name) return fields[i];
    }
    return undefined;
  }
  // searchFields empty = every field. A name that matches no field is skipped, not turned into a
  // variable that does not exist: an undefined variable is empty and no record would pass.
  public getSearchFields(): Array<IDynamicDataFilterField> {
    const all = this.getFilterFields();
    const names = this.searchFields;
    if (!Array.isArray(names) || names.length === 0) return all;
    const res: Array<IDynamicDataFilterField> = [];
    names.forEach((n: string) => { const f = this.getFieldByName(n); if (!!f) res.push(f); });
    return res;
  }
  public setSearchFields(val: Array<string>): void {
    if (!this.allowChangeSearchFields) return;
    this.searchFields = val;
  }

  public getItemByName(name: string): FilterItem {
    if (!name) return undefined;
    const items = this.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].name === name) return items[i];
    }
    return undefined;
  }
  // The active item is held by name and not by object: the name is what uiState saves, what
  // defaultItem speaks in, and it degrades correctly - a deleted item simply stops being found,
  // with no dangling reference and no cleanup in the array's onRemove.
  public get activeItemName(): string { return this.getPropertyValue("activeItemName", ""); }
  public set activeItemName(val: string) {
    val = val || "";
    if (val === this.activeItemName) return;
    this.setPropertyValue("activeItemName", val);
    this.updateFilterExpression();
  }
  public get activeItem(): FilterItem {
    // Single mode: there is one filter and it is always on.
    if (!this.allowMultipleItems) return this.items[0];
    return this.getItemByName(this.activeItemName);
  }
  public set activeItem(val: FilterItem) { this.activeItemName = !!val ? val.name : ""; }
  // Clicking an item applies it; clicking the item that is already applied removes the filter.
  public toggleItem(item: FilterItem | string): void {
    if (!this.allowMultipleItems) return;
    const name = typeof item === "string" ? item : (!!item ? item.name : "");
    if (!name) return;
    this.activeItemName = name === this.activeItemName ? "" : name;
  }
  public clearActiveItem(): void { this.activeItemName = ""; }
  // The list a renderer shows. Single mode has no list.
  public get visibleItems(): Array<FilterItem> { return this.allowMultipleItems ? this.items : []; }
  public get canAddItems(): boolean { return this.allowMultipleItems && this.allowAddItems; }
  public get canReorderItems(): boolean { return this.allowMultipleItems && this.allowReorderItems; }
  // The spec's rule: what may be done to an item is its own permission AND the control-level
  // setting. Single mode has no list, so nothing may be added to it or reordered in it, but the one
  // item it holds is still editable if it says so.
  public canEditItem(item: FilterItem): boolean { return !!item && item.allowEdit; }
  public canDeleteItem(item: FilterItem): boolean { return this.allowMultipleItems && !!item && item.allowDelete; }
  public canCopyItem(item: FilterItem): boolean { return this.canAddItems && !!item && item.allowCopy; }
  public get canUpdateActiveItem(): boolean {
    const item = this.activeItem;
    return !!item && item.allowEdit && !!this.searchString;
  }
  // "Update item": the search the respondent typed becomes part of the item itself, so the item
  // now carries it and the search box goes back to empty. An item has one expression and no
  // search of its own, so the combined text is its new expression.
  public updateActiveItem(): void {
    if (!this.canUpdateActiveItem) return;
    const item = this.activeItem;
    const newExpression = this.filterExpression;
    item.expression = newExpression;
    this.searchString = "";
  }

  public onSurveyLoad(): void {
    super.onSurveyLoad();
    this.applyDefaultItem();
    this.updateFilterExpression();
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    // Neither collection is an ItemValue array, so Base.locStrsChanged does not reach into them.
    this.fields.forEach((field: FilterField): void => { field.locStrsChanged(); });
    this.items.forEach((item: FilterItem): void => { item.locStrsChanged(); });
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    // "items" is here because assigning a whole array goes through Base.setArray, which empties
    // the destination with the prototype splice: the wrapped onRemove never runs and the
    // expression would keep quoting a deleted item.
    if (name === "allowMultipleItems" || name === "items" || name === "searchString" ||
      name === "searchFields" || name === "showSearch") {
      this.updateFilterExpression();
    }
  }
  private applyDefaultItem(): void {
    if (!!this.activeItemName || !this.allowMultipleItems) return;
    // A defaultItem that names nothing leaves the control unfiltered, which is what "no active item"
    // means anyway: an author typo must not throw and must not filter records away.
    if (!!this.defaultItem && !!this.getItemByName(this.defaultItem)) {
      this.activeItemName = this.defaultItem;
    }
  }
  private onFieldAdded(field: FilterField): void {
    if (!field) return;
    field.fieldOwner = this;
    field.onPropertyChanged.add(this.onFieldPropertyChanged);
    this.updateFilterExpression();
  }
  private onFieldRemoved(field: FilterField): void {
    if (!!field) {
      field.onPropertyChanged.remove(this.onFieldPropertyChanged);
      field.fieldOwner = undefined;
    }
    this.updateFilterExpression();
  }
  private onItemAdded(item: FilterItem): void {
    if (!item) return;
    item.onPropertyChanged.add(this.onItemPropertyChanged);
    this.updateFilterExpression();
  }
  private onItemRemoved(item: FilterItem): void {
    if (!!item) {
      item.onPropertyChanged.remove(this.onItemPropertyChanged);
    }
    this.updateFilterExpression();
  }
  private calcSearchExpression(): string {
    if (!this.showSearch) return "";
    const text = (this.searchString || "").trim();
    if (!text) return "";
    const fields = this.getSearchFields();
    // No field to search is a configuration gap, not "nothing matches": it must not hide every
    // record.
    if (fields.length === 0) return "";
    const fragments: Array<string> = [];
    fields.forEach((f: IDynamicDataFilterField): void => {
      const fragment = buildSearchFragment(f, text);
      if (!!fragment) fragments.push(fragment);
    });
    // Fields were searched and none of them can match: the answer is the empty set, and "false"
    // is a valid expression the runner accepts. An empty fragment would mean "no filter" and
    // would show every record instead of none.
    if (fragments.length === 0) return "false";
    return fragments.join(" or ");
  }
  // The expression is composed by string concatenation and never by parsing and re-rendering
  // through Operand.toString(): Const.toString() (expressions.ts:360-366) gives the stored value
  // back as it is, so an expression that holds an escaped quote does not survive the round trip.
  // An authored item expression passes through untouched. combineFilterExpressions brackets both
  // operands: "or" binds looser than "and", and the search fragment is itself an "or" chain.
  private calcFilterExpression(): string {
    const item = this.activeItem;
    const itemExpression = !!item ? (item.expression || "").trim() : "";
    return combineFilterExpressions(itemExpression, this.calcSearchExpression());
  }
  private updateFilterExpression(): void {
    // Nothing is filtered while the JSON is still being read - onSurveyLoad() composes the
    // expression once it is whole - and nothing is filtered in the designer either.
    if (this.isLoadingFromJson || this.isDesignMode) return;
    const newValue = this.calcFilterExpression();
    if (newValue === this.filterExpression) return;
    this.setPropertyValue("filterExpression", newValue);
  }
}

Serializer.addClass("filter", [
  { name: "title", visible: true },
  { name: "source", visible: false },
  { name: "fields:filterfield[]", className: "filterfield", uniqueProperty: "name", visible: false },
  { name: "items:filteritem[]", className: "filteritem", uniqueProperty: "name", visible: false },
  { name: "defaultItem", visible: false },
  { name: "allowMultipleItems:boolean", default: true, visible: false },
  { name: "allowAddItems:boolean", default: true, visible: false },
  { name: "allowReorderItems:boolean", default: true, visible: false },
  { name: "showSearch:boolean", default: false, visible: false },
  { name: "searchFields:string[]", visible: false },
  { name: "allowChangeSearchFields:boolean", default: true, visible: false },
], () => new QuestionFilterModel(""), "nonvalue");
QuestionFactory.Instance.registerQuestion("filter", (name) => new QuestionFilterModel(name));

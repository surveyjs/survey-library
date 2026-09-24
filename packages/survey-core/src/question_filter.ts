import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionNonValue } from "./questionnonvalue";
import { Helpers, HashTable } from "./helpers";
import { ISurveyImpl } from "./base-interfaces";
import { IElementUIState, IFilterElementUIState } from "./interfaces/ui-interfaces";
import { FilterField } from "./filter/filter-field";
import { FilterItem } from "./filter/filter-item";
import { buildSearchFragment } from "./filter/filter-expression";
import { IDynamicDataFilterField } from "./dynamic-data/dynamic-data-fields";
import { IDynamicDataFilterSource } from "./dynamic-data/dynamic-data-interfaces";
import { combineFilterExpressions } from "./dynamic-data/dynamic-data-filter";

// The Filter Control. It descends from QuestionNonValue because it is a control and not an answer:
// it never assigns this.value, so it stays out of survey.data, out of the condition editor and out
// of validation. What the end user does with it is UI state, not survey data.
export class QuestionFilterModel extends QuestionNonValue {
  // The searchFields the JSON authored, taken once the JSON is read. getUIState() stores searchFields
  // only when they differ from it, so an authored value is not duplicated into the saved state and
  // no extra serializable "dirty" property is needed.
  private authoredSearchFields: Array<string>;
  // Restoring is not a new change: it must not raise onUIStateChanged, or a host that saves on every
  // change would save immediately after every restore. It also holds back the write into the source
  // and onFilterChanged with it, so the three restored keys land as one filter and not as three -
  // see setUIState().
  private isSettingUIState: boolean = false;
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
  // Deliberately not guarded by allowChangeSearchFields: that is an end-user permission and it
  // lives on setSearchFields() alone. This setter is also how JsonObject.toObject writes the
  // authored value, so guarding it would make loading order-dependent and would silently drop
  // searchFields from a survey that also sets allowChangeSearchFields to false. A renderer must
  // call setSearchFields(), never assign this.
  public set searchFields(val: Array<string>) {
    if (Helpers.isTwoValueEquals(val, this.searchFields)) return;
    this.setPropertyValue("searchFields", val);
    this.raiseUIStateChanged();
  }

  public get allowChangeSearchFields(): boolean { return this.getPropertyValue("allowChangeSearchFields"); }
  public set allowChangeSearchFields(val: boolean) { this.setPropertyValue("allowChangeSearchFields", val); }

  // What the end user typed into the quick search box. Not registered in the serializer: it is
  // runtime state and never authored. It is not named searchText because Base.searchText(text,
  // founded) is a method PanelModelBase.searchText calls on every element of a survey.
  public get searchString(): string { return this.getPropertyValue("searchString", ""); }
  public set searchString(val: string) {
    val = val || "";
    if (val === this.searchString) return;
    this.setPropertyValue("searchString", val);
    this.raiseUIStateChanged();
  }

  // The composed output of the control. Not registered either: it is computed, never authored.
  public get filterExpression(): string { return this.getPropertyValue("filterExpression", ""); }

  // The key this control's filter lives under on the source. Neither the name nor the id: both can
  // be reassigned while the filter is on the source, and the detach that follows would then clear a
  // key nothing was written under. uniqueId is fixed for the life of the object.
  private get controlFilterKey(): string { return "filterControl:" + this.uniqueId; }
  // The source this control is currently writing into. Detaching goes through this and never
  // through a fresh lookup by name: once source has been re-pointed, or the source question has
  // been renamed, the lookup no longer finds the question that still carries the filter, and it
  // would stay filtered forever with nothing left to clear it.
  private attachedSource: IDynamicDataFilterSource;
  // The question source names, if it can be filtered by a control. Asked by capability, the way the
  // data list asks a source whether it has "readRange": the control imports neither dynamic question.
  // A control taken off its page keeps its data, so without the parent check it would still find a
  // source - and filter it from outside the survey - the next time it re-resolves one.
  private get filterSource(): IDynamicDataFilterSource {
    const q: any = !!this.data && !!this.parent ? this.data.findQuestionByName(this.source) : undefined;
    return !!q && typeof q.getFilterFields === "function" && typeof q.setControlFilter === "function"
      ? <IDynamicDataFilterSource>q : undefined;
  }

  // Standalone or bound: one uniform field list, so nothing downstream has to know which one it is.
  public getFilterFields(): Array<IDynamicDataFilterField> {
    const source = this.filterSource;
    if (!!source) return source.getFilterFields();
    return this.fields.map((field: FilterField): IDynamicDataFilterField => field.getFilterField());
  }
  // The name first - that is what a standalone field is authored and searched by - and the
  // valueName after it. A bound nested field is named by its leaf ("city") and reached by its dotted
  // path ("mt.city"), and only the path is unique, so searchFields has to be able to name it that
  // way; a dotted path is never a field name, so the second pass cannot take a match away from the
  // first one.
  public getFieldByName(name: string): IDynamicDataFilterField {
    if (!name) return undefined;
    return this.findFieldInList(this.getFilterFields(), name);
  }
  // Takes the field list instead of rebuilding it: a bound control asks its source for the whole
  // list on every call, and getSearchFields() would otherwise pay for it once per name, inside
  // runCondition, on every survey value change.
  private findFieldInList(fields: Array<IDynamicDataFilterField>, name: string): IDynamicDataFilterField {
    if (!name) return undefined;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].name === name) return fields[i];
    }
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].valueName === name) return fields[i];
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
    names.forEach((n: string) => { const f = this.findFieldInList(all, n); if (!!f) res.push(f); });
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
    this.raiseUIStateChanged();
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
  // Not in design mode: filterExpression is never composed there, so updateActiveItem() would
  // overwrite the authored expression with an empty string - and expression is serialized, so the
  // loss would reach the saved JSON.
  public get canUpdateActiveItem(): boolean {
    if (this.isDesignMode) return false;
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

  public endLoadingFromJson(): void {
    super.endLoadingFromJson();
    const fields = this.searchFields;
    this.authoredSearchFields = Array.isArray(fields) ? [].concat(fields) : fields;
  }
  public onSurveyLoad(): void {
    super.onSurveyLoad();
    // The source is resolved before the default is applied, so the expression the default composes
    // reaches it in one write and raises one event instead of two.
    this.updateFilterSource();
    this.applyDefaultItem();
  }
  // Every question is re-run whenever a survey value changes, which is also when a question the
  // source names may have appeared or gone.
  public runCondition(properties: HashTable<any>): void {
    super.runCondition(properties);
    this.updateFilterSource();
  }
  protected onSetData(): void {
    super.onSetData();
    this.updateFilterSource();
  }
  // A removed page takes its questions out of the survey with setSurveyImpl(null), which, unlike
  // a non-null one, does not reach onSetData().
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean): void {
    super.setSurveyImpl(value, isLight);
    if (!value) {
      this.detachFromSource();
    }
  }
  // removeElement() only resets the parent: data and survey stay, and runCondition() no longer
  // reaches the control, so this is the one report of the removal it gets. Taking the control out
  // detaches it without an event, the way dispose() does; putting it back re-resolves the source.
  // Known gap: a control inside a panel that is removed, or inside a Dynamic Panel item that is
  // removed, is not reported either - its own parent does not change - and keeps its filter on a
  // source outside that panel until it is disposed.
  protected onParentChanged(): void {
    super.onParentChanged();
    if (!this.parent) {
      this.detachFromSource();
    } else {
      this.updateFilterSource();
    }
  }
  public dispose(): void {
    this.detachFromSource();
    super.dispose();
  }
  // Re-resolves the source and moves the filter with it: the question that is being left is cleared
  // first, so no ghost filter survives a re-pointed source or a source question that went away.
  private updateFilterSource(): void {
    if (this.isDesignMode) return;
    const source = this.filterSource;
    if (source === this.attachedSource) {
      this.updateFilterExpression();
      return;
    }
    this.detachFromSource();
    const oldExpression = this.filterExpression;
    // The expression is recomposed against the new source BEFORE anything is written: the search
    // fragments quote the fields of the source they were built from, so the text composed for the
    // previous one names fields the new one may not have. Recomposing it silently - the control is
    // attached to nothing for the length of this call - is what makes the move one write and one
    // event instead of a wrong pair of them.
    this.updateFilterExpression(true);
    this.attachedSource = source;
    // Attaching is not a change of the filter by itself: with nothing composed, before or now, there
    // is nothing to write and nothing to report. A move that empties the expression is one, though:
    // a host that mirrors the filter would otherwise keep querying by the text composed for the old
    // source.
    if (!!this.filterExpression || this.filterExpression !== oldExpression) {
      this.applyToSource();
    }
  }
  private detachFromSource(): void {
    const source: any = this.attachedSource;
    this.attachedSource = undefined;
    // A disposed question has no list and no controller left to write into.
    if (!!source && source.isDisposed !== true) {
      source.setControlFilter(this.controlFilterKey, "");
    }
  }
  // The order is load-bearing: the source is re-filtered first and the event is raised after, so a
  // handler that looks into the matrix sees the records it shows now and not the previous ones.
  private applyToSource(): void {
    const source = this.attachedSource;
    if (!!source) {
      source.setControlFilter(this.controlFilterKey, this.filterExpression);
    }
    const survey: any = this.survey;
    if (!!survey && !!survey.filterChanged) {
      survey.filterChanged(this, this.filterExpression, source);
    }
  }
  protected getUIState(): IElementUIState {
    let res = super.getUIState();
    const state: IFilterElementUIState = {};
    let isEmpty = true;
    // The baseline is the default the control could actually apply, not the raw defaultItem:
    // applyDefaultItem() refuses a defaultItem that names no item, so activeItemName stays "" and
    // comparing against the raw name would make an untouched control store activeItemName: "". That
    // would both produce a spurious save and, once the author fixed or added the item, keep the now
    // valid default from ever applying to a returning respondent. The same holds while items are
    // still on their way from a source and nothing resolves yet.
    const appliedDefault = !!this.getItemByName(this.defaultItem) ? this.defaultItem : "";
    if (this.allowMultipleItems && this.activeItemName !== appliedDefault) {
      state.activeItemName = this.activeItemName;
      isEmpty = false;
    }
    if (!!this.searchString) { state.searchString = this.searchString; isEmpty = false; }
    if (!Helpers.isTwoValueEquals(this.searchFields, this.authoredSearchFields)) {
      state.searchFields = [].concat(this.searchFields || []);
      isEmpty = false;
    }
    if (isEmpty) return res;
    res = res || {};
    res.filter = state;
    return res;
  }
  protected setUIState(state: IElementUIState): void {
    super.setUIState(state);
    const filter = !!state ? state.filter : undefined;
    if (!filter) return;
    // Each of the three keys recomposes the expression on its own, and only the last composition is
    // the filter that is actually in effect. The flag holds the write into the source and
    // onFilterChanged back until all three have landed: without it a restore would report - and
    // make a host that mirrors the filter query - two intermediate expressions nothing was ever
    // filtered by, and would rebuild the bound question's rows three times.
    const oldExpression = this.filterExpression;
    this.isSettingUIState = true;
    try {
      // A key that is not there was not changed by the respondent, EXCEPT activeItemName, whose ""
      // means "switched off" and must survive.
      if (filter.activeItemName !== undefined) {
        this.activeItemName = filter.activeItemName;
      }
      if (filter.searchString !== undefined) {
        this.searchString = filter.searchString;
      }
      if (Array.isArray(filter.searchFields)) {
        this.searchFields = [].concat(filter.searchFields);
      }
    } finally {
      // A throw in any of the three must not leave the control silent for the rest of the session.
      this.isSettingUIState = false;
    }
    this.updateFilterExpression();
    // The one write and the one event of the whole restore. Nothing changed = nothing to report.
    if (this.filterExpression !== oldExpression) {
      this.applyToSource();
    }
  }
  // The survey is reached duck-typed so a host that is not a SurveyModel does not crash on it. The
  // designer has no respondent, so nothing done to the control there is respondent state.
  private raiseUIStateChanged(): void {
    if (this.isLoadingFromJson || this.isSettingUIState || this.isDesignMode || !this.survey) return;
    const survey: any = this.survey;
    if (!!survey.filterStateChanged) survey.filterStateChanged(this);
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    // Neither collection is an ItemValue array, so Base.locStrsChanged does not reach into them.
    this.fields.forEach((field: FilterField): void => { field.locStrsChanged(); });
    this.items.forEach((item: FilterItem): void => { item.locStrsChanged(); });
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    // "source" goes through updateFilterSource() and not through updateFilterExpression(): the
    // fields and the question the expression is written into both come from it, so re-pointing it
    // has to move the filter and not only recompose the text.
    if (name === "source") {
      this.updateFilterSource();
      return;
    }
    // "items" and "fields" are here because assigning a whole array goes through Base.setArray,
    // which empties the destination with the prototype splice: the wrapped onRemove never runs,
    // and an empty new array pushes nothing either, so the property change is the only report of
    // it. Without them the control would keep quoting a deleted item or searching a deleted field.
    if (name === "allowMultipleItems" || name === "items" || name === "fields" ||
      name === "searchString" || name === "searchFields" || name === "showSearch") {
      this.updateFilterExpression();
    }
  }
  private applyDefaultItem(): void {
    if (!!this.activeItemName || !this.allowMultipleItems) return;
    // A defaultItem that names nothing leaves the control unfiltered, which is what "no active item"
    // means anyway: an author typo must not throw and must not filter records away.
    if (!!this.defaultItem && !!this.getItemByName(this.defaultItem)) {
      // Written through setPropertyValue and not through the setter: applying the authored default
      // is not an end-user change and must not raise onUIStateChanged. The isLoadingFromJson guard
      // in raiseUIStateChanged() is no help here - SurveyElement reads that flag off the survey
      // (survey-element.ts:698) and SurveyModel.endLoadingFromJson() clears it before it calls
      // doElementsOnLoad(), which is what runs onSurveyLoad().
      this.setPropertyValue("activeItemName", this.defaultItem);
      this.updateFilterExpression();
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
  // skipApply is for the caller that is in the middle of moving the control between two sources: it
  // does the single write-and-raise itself, once the new source is attached. A uiState restore is
  // in the same position for the length of its three assignments and says so through the flag.
  private updateFilterExpression(skipApply?: boolean): void {
    // Nothing is filtered while the JSON is still being read - onSurveyLoad() composes the
    // expression once it is whole - and nothing is filtered in the designer either.
    if (this.isLoadingFromJson || this.isDesignMode) return;
    const newValue = this.calcFilterExpression();
    if (newValue === this.filterExpression) return;
    this.setPropertyValue("filterExpression", newValue);
    if (!skipApply && !this.isSettingUIState) {
      this.applyToSource();
    }
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

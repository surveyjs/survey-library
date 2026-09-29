import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionNonValue } from "./questionnonvalue";
import { Helpers, HashTable } from "./helpers";
import { ISurveyImpl } from "./base-interfaces";
import { IElementUIState, IFilterCondition, IFilterElementUIState } from "./interfaces/ui-interfaces";
import { FilterField } from "./filter/filter-field";
import { FilterItem } from "./filter/filter-item";
import { buildSearchFragment } from "./filter/filter-expression";
import {
  conditionsToExpression, getFilterFieldOperators, getFilterValueEditorJson, normalizeFilterConditions,
  parseFilterExpression
} from "./filter/filter-conditions";
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
  // How many runBatch()/holdChanges() calls are in progress. While one is, a recomposed expression
  // is not written into the source, onFilterChanged is not raised and onUIStateChanged is only
  // noted (uiStateChangedInBatch) - see runBatch().
  private batchLevel: number = 0;
  private uiStateChangedInBatch: boolean = false;
  // The part of a restored uiState that has to be checked against the fields - conditions and saved
  // presets - when it arrives before the bound source does: with no source there is nothing to
  // check it against, and checking it against nothing would drop all of it. Applied as the source
  // attaches, in the same write - see updateFilterSource().
  private pendingConditions: Array<IFilterCondition>;
  private pendingItems: { [name: string]: { conditions: Array<IFilterCondition> } };
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
  // A preset that becomes active, or stops being active, replaces the whole filter: the edits were
  // made over the previous preset and mean nothing over the next one.
  public set activeItemName(val: string) {
    val = val || "";
    if (val === this.activeItemName) return;
    this.setPropertyValue("activeItemName", val);
    this.setOwnConditions(undefined);
    this.updateFilterExpression();
    this.raiseUIStateChanged();
  }
  public get activeItem(): FilterItem {
    // Single mode: there is one filter and it is always on - the authored default when it names an
    // item, the first item otherwise. activeItemName plays no part here: there is no list to pick
    // from, so nothing the respondent does can change it.
    if (!this.allowMultipleItems) return this.getItemByName(this.defaultItem) || this.items[0];
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
  // "Clear the filter": no preset and no edits of the respondent's own. It resets the edits even
  // when no preset is active - the activeItemName setter would see no change there and keep them -
  // and in single mode, where the preset cannot be taken off and its text becomes the filter again.
  // Restored conditions still waiting for a bound source are edits too and go with them
  // (setOwnConditions drops them); restored saved presets are not edits and stay.
  public clearActiveItem(): void {
    if (!!this.activeItemName) {
      this.activeItemName = "";
      return;
    }
    if (this.ownConditions === undefined && this.pendingConditions === undefined) return;
    this.setOwnConditions(undefined);
    this.updateFilterExpression();
    this.raiseUIStateChanged();
  }
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

  // The respondent's own conditions, edited over the active preset. undefined means "no edits":
  // the preset's text then applies verbatim. [] is a real state and not the same thing - the
  // respondent cleared the preset's conditions and nothing is filtered by it any more. Not
  // registered in the serializer: it is runtime state, like searchString. Every edit writes a new
  // array, never mutates the one in place, so the property change is what a renderer sees - see
  // setOwnConditions().
  public get ownConditions(): Array<IFilterCondition> { return this.getPropertyValue("ownConditions", undefined); }
  // Not in design mode: filterExpression is never composed there, so an edit would change nothing
  // anyone can see. An "ai" preset was written from a prompt and not from conditions; editing its
  // fields would silently turn it into a different kind of filter.
  public get canEditConditions(): boolean {
    if (this.isDesignMode) return false;
    const item = this.activeItem;
    return !item || item.type !== "ai";
  }
  // The active preset applies as text that has no conditions to show: an "or", a function, a
  // comparison of two fields. A renderer warns with it that the first edit starts from nothing.
  public get isRawExpression(): boolean {
    if (!this.activeItem || this.ownConditions !== undefined) return false;
    return this.parseActiveItemConditions() === null;
  }
  public getFieldCondition(name: string): IFilterCondition {
    const field = this.getFieldByName(name);
    if (!field) return undefined;
    const conditions = this.ownConditions !== undefined ? this.ownConditions : this.parseActiveItemConditions();
    const condition = (conditions || []).filter((c: IFilterCondition): boolean => c.field === field.valueName)[0];
    return !!condition ? this.copyCondition(condition) : undefined;
  }
  // One condition per field: an edit of a field that already has one replaces it where it stands,
  // so the badges a renderer shows do not jump around; a new one goes to the end.
  public setFieldCondition(name: string, operator: string, value?: any): void {
    const field = this.getFieldByName(name);
    if (!field) return;
    const condition = this.copyCondition({ field: field.valueName, operator: operator, value: value });
    this.editConditions((conditions: Array<IFilterCondition>): Array<IFilterCondition> => {
      const index = this.indexOfCondition(conditions, field.valueName);
      if (index < 0) return conditions.concat([condition]);
      const res = [].concat(conditions);
      res[index] = condition;
      return res;
    });
  }
  public clearFieldCondition(name: string): void {
    const field = this.getFieldByName(name);
    if (!field) return;
    this.editConditions((conditions: Array<IFilterCondition>): Array<IFilterCondition> =>
      conditions.filter((c: IFilterCondition): boolean => c.field !== field.valueName));
  }
  // With a preset active this is "clear its conditions": the preset stays active and filters
  // nothing until it is clicked again or another one is.
  public clearConditions(): void {
    this.editConditions((): Array<IFilterCondition> => []);
  }
  // Whether the respondent's edits are a real change to the active preset's own conditions, and
  // not merely the absence of any edit yet (ownConditions undefined). Compared as a set and not by
  // position: setFieldCondition can leave a condition at a different index than the preset held it
  // at (a new field is appended, not inserted where the preset would show it), and that reordering
  // is not a change of what the preset means. A preset that does not decompose
  // (parseActiveItemConditions() === null, an "or", a function, a comparison of two fields) can
  // never equal any own conditions, so any edit over it - even [] - is a real change. No active
  // preset reports false here even with edits of its own: there is nothing to save them into.
  public get isActiveItemModified(): boolean {
    const item = this.activeItem;
    if (!item || this.ownConditions === undefined) return false;
    const preset = this.parseActiveItemConditions();
    if (preset === null) return true;
    return !this.isSameConditionSet(this.ownConditions, preset);
  }
  // allowEdit is the preset's own permission; design mode never composes an expression, so nothing
  // saved there could be seen or filtered by anyway.
  public get canSaveActiveItem(): boolean {
    if (this.isDesignMode) return false;
    const item = this.activeItem;
    return !!item && item.allowEdit && this.isActiveItemModified;
  }
  // Writes the respondent's edits back into the preset's own expression and forgets them as edits:
  // from here on the preset's text IS what was asked for, so ownConditions goes back to undefined
  // and isActiveItemModified reports false again. The search box is never part of it: conditions
  // only ever compose from ownConditions, never from calcSearchExpression(). item.expression is set
  // through its own property (registered, serializable) and not through some parallel "saved text"
  // slot - a runtime change to an existing serializable property, not a new one, so nothing new
  // reaches survey JSON beyond what item.expression already was free to hold. savedItemConditions
  // keeps a copy for uiState, which stores it as items.<name>.conditions so a restored session
  // carries the saved conditions themselves and does not have to re-decompose item.expression,
  // which a lossy round trip (an "or" preset saved from a raw start, or a value coercion) might not
  // reproduce.
  public saveActiveItem(): void {
    if (!this.canSaveActiveItem) return;
    const item = this.activeItem;
    const conditions = this.ownConditions;
    item.expression = conditionsToExpression(conditions, this.getFilterFields());
    this.savedItemConditions[item.name] = conditions.map((c: IFilterCondition): IFilterCondition => this.copyCondition(c));
    this.setOwnConditions(undefined);
    // item.expression's own onItemPropertyChanged already recomposed the expression once; this
    // second call is only a no-op safety net for the (should not happen) case where resetting
    // ownConditions changes what calcConditionsExpression reads. updateFilterExpression() itself
    // only applies to the source and reports onFilterChanged when the composed text actually
    // differs from what is already there, so a normal save - where the two compositions read the
    // same - raises neither call twice nor at all.
    this.updateFilterExpression();
    this.raiseUIStateChanged();
  }
  public getFieldOperators(name: string): Array<string> {
    const field = this.getFieldByName(name);
    return !!field ? getFilterFieldOperators(field) : [];
  }
  public getValueEditorJson(name: string, operator: string): any {
    const field = this.getFieldByName(name);
    return !!field ? getFilterValueEditorJson(field, operator) : undefined;
  }
  // The active preset's text as conditions, or null when it has none to offer. Parsed on every
  // call and never kept: the preset is resolved by name, its expression can be edited and a bound
  // control's field list can change with no notification - parseFilterExpression caches the part
  // that is safe to cache.
  private parseActiveItemConditions(): Array<IFilterCondition> | null {
    const item = this.activeItem;
    if (!item) return null;
    return parseFilterExpression((item.expression || "").trim(), this.getFilterFields());
  }
  // The first edit decomposes the preset and changes one field in what it gives; a preset that does
  // not decompose (or no preset at all) starts from nothing. One edit is one write, one
  // onFilterChanged and one onUIStateChanged. An edit that leaves the conditions exactly as they
  // were is no change and raises nothing - except the first one: from then on the edits apply
  // instead of the preset's text, and that is new state even if the expression reads the same.
  // Compared through JSON.stringify and not Helpers.isTwoValueEquals: that one is case-insensitive
  // by default and takes 18 for "18" and true for "true", and each of those pairs composes into a
  // different expression on a text field - the edit would be dropped as "no change".
  private editConditions(edit: (conditions: Array<IFilterCondition>) => Array<IFilterCondition>): void {
    if (!this.canEditConditions) return;
    const old = this.ownConditions;
    const start = old !== undefined ? old : (this.parseActiveItemConditions() || []);
    const conditions = edit(start);
    if (old !== undefined && JSON.stringify(conditions) === JSON.stringify(old)) return;
    this.setOwnConditions(conditions);
    this.updateFilterExpression();
    this.raiseUIStateChanged();
  }
  // Not setPropertyValue: once this class owns arrays (fields, items), Base.setPropertyValue treats
  // any array value as one of them - it copies the new array INTO the old one instead of storing
  // it, and turns "undefined over an empty array" into an isReset mark instead of undefined. Both
  // would break this slot: the array the previous edit left behind would change under whoever
  // holds it, and [] ("conditions cleared") could never go back to undefined ("no edits").
  private setOwnConditions(val: Array<IFilterCondition>): void {
    // Whatever decides the conditions now - an edit, another preset, a save, a clear - supersedes
    // restored conditions still waiting for their source: they were edits over the state this
    // replaces.
    this.pendingConditions = undefined;
    const oldValue = this.ownConditions;
    if (val === oldValue) return;
    this.setPropertyValueDirectly("ownConditions", val);
    this.propertyValueChanged("ownConditions", oldValue, val);
  }
  private indexOfCondition(conditions: Array<IFilterCondition>, valueName: string): number {
    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i].field === valueName) return i;
    }
    return -1;
  }
  // Element equality is exact JSON, not Helpers.isTwoValueEquals: that comparison is case- and
  // type-lenient (18 equals "18", true equals "true"), and each of those pairs composes into a
  // different expression on a text field - a "no change" reported that way would let a real edit
  // go unnoticed as unmodified. Sorted JSON keys make the comparison order-insensitive: both sides
  // are a set, not a sequence.
  private isSameConditionSet(a: Array<IFilterCondition>, b: Array<IFilterCondition>): boolean {
    if (a.length !== b.length) return false;
    const toKey = (c: IFilterCondition): string => JSON.stringify(c);
    const as = a.map(toKey).sort();
    const bs = b.map(toKey).sort();
    for (let i = 0; i < as.length; i++) {
      if (as[i] !== bs[i]) return false;
    }
    return true;
  }
  // The runtime record of which presets the respondent has saved edits into, and what those edits
  // were - name -> a copy of the conditions saveActiveItem() composed item.expression from. Not
  // registered in the serializer: it is derived from an edit-and-save action, not an authored or
  // reactive property, and uiState is the only reader - getUIState() stores this map as
  // items.<name>.conditions and setUIState() fills it back. A preset that is later removed just
  // leaves a stale, harmless entry here: getUIState() skips a name that no longer resolves.
  private savedItemConditions: HashTable<Array<IFilterCondition>> = {};
  // Internal accessor for the uiState serialization; deliberately not public API for this class.
  private getSavedItemConditions(name: string): Array<IFilterCondition> {
    return this.savedItemConditions[name];
  }
  // An array value is copied both ways: the caller's array must not be able to change the filter
  // behind the control's back, and neither must the one it is given back.
  private copyCondition(condition: IFilterCondition): IFilterCondition {
    const value = condition.value;
    return { field: condition.field, operator: condition.operator, value: Array.isArray(value) ? [].concat(value) : value };
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
    if (!!source) {
      this.restorePendingState();
    }
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
  // A bound control whose source is not there (yet) has no fields to check restored conditions
  // against: getFilterFields() falls back to the standalone list, which a bound control rarely has.
  private get isFieldListReady(): boolean { return !this.source || !!this.filterSource; }
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
    const conditions = this.getUIStateConditions();
    if (!!conditions) { state.conditions = conditions; isEmpty = false; }
    const items = this.getUIStateItems();
    if (!!items) { state.items = items; isEmpty = false; }
    if (isEmpty) return res;
    res = res || {};
    res.filter = state;
    return res;
  }
  // Unsaved edits, and only when they are a change: over an active preset an edit that leaves its
  // conditions as they were is nothing to restore, while [] over it is (its conditions were
  // cleared). With no preset, [] and "no edits" filter the same - by nothing - so neither is stored.
  // Conditions restored before the source attached were never checked; they are passed on as they
  // came, or saving the state again before the source appears would lose them.
  private getUIStateConditions(): Array<IFilterCondition> {
    let conditions = this.pendingConditions;
    if (conditions === undefined) {
      conditions = this.ownConditions;
      if (conditions === undefined) return undefined;
      if (!!this.activeItem ? !this.isActiveItemModified : conditions.length === 0) return undefined;
    }
    return conditions.map((c: IFilterCondition): IFilterCondition => this.copyCondition(c));
  }
  // Only presets that still exist and may still be edited: restoreItems() would ignore any other.
  private getUIStateItems(): { [name: string]: { conditions: Array<IFilterCondition> } } {
    let res: { [name: string]: { conditions: Array<IFilterCondition> } } = undefined;
    const add = (name: string, conditions: Array<IFilterCondition>): void => {
      if (!this.canRestoreSavedItem(name) || !Array.isArray(conditions)) return;
      res = res || {};
      res[name] = { conditions: conditions.map((c: IFilterCondition): IFilterCondition => this.copyCondition(c)) };
    };
    const pending = this.pendingItems || {};
    Object.keys(pending).forEach((name: string): void => { add(name, !!pending[name] ? pending[name].conditions : undefined); });
    // A preset saved in this session wins over one still waiting for its source: it is newer.
    Object.keys(this.savedItemConditions).forEach((name: string): void => { add(name, this.getSavedItemConditions(name)); });
    return res;
  }
  // The order is load-bearing. Saved presets first: activeItemName may name one of them, and its
  // expression has to be the saved one before it is composed. activeItemName before conditions: its
  // setter resets the edits, which would otherwise wipe the restored ones. The search last - it is
  // independent of the rest. The whole restore is one batch: one write into the source, one
  // onFilterChanged (none if the expression did not change) and no onUIStateChanged - restoring is
  // not a new change, and a host that saves on every change would otherwise save right after every
  // restore.
  protected setUIState(state: IElementUIState): void {
    super.setUIState(state);
    const filter = !!state ? state.filter : undefined;
    if (!filter) return;
    this.runBatch((): void => {
      const isReady = this.isFieldListReady;
      const items = !!filter.items && typeof filter.items === "object" ? filter.items : undefined;
      // A newer restore replaces whatever an earlier one left waiting for the source.
      this.pendingItems = isReady ? undefined : this.copySavedItems(items);
      if (isReady) {
        this.restoreItems(items);
      }
      // A key that is not there was not changed by the respondent, EXCEPT activeItemName, whose ""
      // means "switched off" and must survive.
      if (filter.activeItemName !== undefined) {
        this.activeItemName = filter.activeItemName;
      }
      const conditions = Array.isArray(filter.conditions) ? filter.conditions : undefined;
      if (isReady) {
        this.pendingConditions = undefined;
        if (!!conditions) {
          this.restoreConditions(conditions);
        }
      } else {
        this.pendingConditions = !!conditions ? this.copyConditionList(conditions) : undefined;
      }
      if (filter.searchString !== undefined) {
        this.searchString = filter.searchString;
      }
      if (Array.isArray(filter.searchFields)) {
        this.searchFields = [].concat(filter.searchFields);
      }
    });
  }
  // A saved preset's expression is rebuilt from its conditions and not parsed back: that is what
  // saveActiveItem() wrote, and it is what the preset will be saved as again. A name that no longer
  // resolves to a preset is ignored - the author removed or renamed it - and so is a preset the
  // author has since made read-only (allowEdit: false): the respondent could not save into it now,
  // and the author's text must win. A saved list that had conditions and has none left once they
  // are checked (every field gone, every operator no longer offered) is ignored too: rewriting the
  // author's expression to "" would turn the preset into "no filter", which nobody saved.
  private restoreItems(items: { [name: string]: { conditions: Array<IFilterCondition> } }): void {
    if (!items) return;
    const fields = this.getFilterFields();
    Object.keys(items).forEach((name: string): void => {
      const entry = items[name];
      if (!this.canRestoreSavedItem(name) || !entry || !Array.isArray(entry.conditions)) return;
      const conditions = normalizeFilterConditions(entry.conditions, fields);
      if (conditions.length === 0 && entry.conditions.length > 0) return;
      this.getItemByName(name).expression = conditionsToExpression(conditions, fields);
      this.savedItemConditions[name] = conditions;
    });
  }
  private canRestoreSavedItem(name: string): boolean {
    const item = this.getItemByName(name);
    return !!item && item.allowEdit;
  }
  // Pending saved presets are held for later: the caller's state object must not be able to change
  // them in the meantime.
  private copySavedItems(items: { [name: string]: { conditions: Array<IFilterCondition> } }): { [name: string]: { conditions: Array<IFilterCondition> } } {
    if (!items) return undefined;
    const res: { [name: string]: { conditions: Array<IFilterCondition> } } = {};
    Object.keys(items).forEach((name: string): void => {
      const entry = items[name];
      if (!entry || !Array.isArray(entry.conditions)) return;
      const conditions = this.copyConditionList(entry.conditions);
      // Nothing usable left of a non-empty list: see restoreItems(), which would skip it too.
      if (conditions.length === 0 && entry.conditions.length > 0) return;
      res[name] = { conditions: conditions };
    });
    return res;
  }
  // A restored list is not trusted to hold only objects; normalizeFilterConditions() would drop
  // anything else later anyway, so it is dropped here, before copyCondition() would trip on it.
  private copyConditionList(conditions: Array<IFilterCondition>): Array<IFilterCondition> {
    return conditions.filter((c: IFilterCondition): boolean => !!c && typeof c === "object")
      .map((c: IFilterCondition): IFilterCondition => this.copyCondition(c));
  }
  // Not over a preset that cannot be edited (an "ai" one) or in the designer: an edit could not have
  // produced these there either.
  private restoreConditions(conditions: Array<IFilterCondition>): void {
    if (!this.canEditConditions) return;
    this.setOwnConditions(normalizeFilterConditions(conditions, this.getFilterFields()));
  }
  // Called by updateFilterSource() for the source that is being attached, before it recomposes the
  // expression and writes it: the restored part lands in that same single write. Held so neither
  // the preset expressions it rebuilds nor the conditions it sets write or raise on their own.
  private restorePendingState(): void {
    const items = this.pendingItems;
    const conditions = this.pendingConditions;
    if (!items && !conditions) return;
    this.pendingItems = undefined;
    this.pendingConditions = undefined;
    this.holdChanges((): void => {
      this.restoreItems(items);
      if (!!conditions) {
        this.restoreConditions(conditions);
      }
    });
  }
  // Several changes that are one change for whoever listens: while fn runs nothing is written into
  // the source, onFilterChanged is not raised and onUIStateChanged is only noted. After it, the
  // expression is composed once and, if it differs from what it was before fn, written once and
  // reported once; with raiseUIState, onUIStateChanged is raised once if anything in fn would have
  // raised it. A restore passes no raiseUIState; an editor that applies several edits as one does.
  // A nested call runs inside the outer batch and leaves the single write to it.
  private runBatch(fn: () => void, raiseUIState?: boolean): void {
    if (this.batchLevel > 0) {
      fn();
      return;
    }
    const oldExpression = this.filterExpression;
    this.uiStateChangedInBatch = false;
    // A throw in fn propagates from here: holdChanges() has already released the hold, so the
    // control is not left silent for the rest of the session.
    this.holdChanges(fn);
    const isUIStateChanged = this.uiStateChangedInBatch;
    this.uiStateChangedInBatch = false;
    this.updateFilterExpression();
    if (this.filterExpression !== oldExpression) {
      this.applyToSource();
    }
    if (raiseUIState && isUIStateChanged) {
      this.raiseUIStateChanged();
    }
  }
  private holdChanges(fn: () => void): void {
    this.batchLevel++;
    try {
      fn();
    } finally {
      this.batchLevel--;
    }
  }
  // The survey is reached duck-typed so a host that is not a SurveyModel does not crash on it. The
  // designer has no respondent, so nothing done to the control there is respondent state.
  private raiseUIStateChanged(): void {
    if (this.isLoadingFromJson || this.isDesignMode || !this.survey) return;
    if (this.batchLevel > 0) {
      this.uiStateChangedInBatch = true;
      return;
    }
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
    // "defaultItem" is here because single mode's active preset is the default itself.
    if (name === "allowMultipleItems" || name === "defaultItem" || name === "items" || name === "fields" ||
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
      this.setOwnConditions(undefined);
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
  // An authored item expression passes through untouched as long as the respondent has not edited
  // over it; once they have, their conditions are the filter and the preset's text is not used.
  // combineFilterExpressions brackets both operands: "or" binds looser than "and", and the search
  // fragment is itself an "or" chain.
  private calcFilterExpression(): string {
    return combineFilterExpressions(this.calcConditionsExpression(), this.calcSearchExpression());
  }
  // The preset is resolved by name on every composition, so an edit of its expression, a
  // replaced items array or a deleted preset is picked up here with no bookkeeping of its own.
  private calcConditionsExpression(): string {
    const conditions = this.ownConditions;
    if (conditions !== undefined) return conditionsToExpression(conditions, this.getFilterFields());
    const item = this.activeItem;
    return !!item ? (item.expression || "").trim() : "";
  }
  // skipApply is for the caller that is in the middle of moving the control between two sources: it
  // does the single write-and-raise itself, once the new source is attached. A batch (runBatch) is
  // in the same position for the length of its changes and says so through batchLevel.
  private updateFilterExpression(skipApply?: boolean): void {
    // Nothing is filtered while the JSON is still being read - onSurveyLoad() composes the
    // expression once it is whole - and nothing is filtered in the designer either.
    if (this.isLoadingFromJson || this.isDesignMode) return;
    const newValue = this.calcFilterExpression();
    if (newValue === this.filterExpression) return;
    this.setPropertyValue("filterExpression", newValue);
    if (!skipApply && this.batchLevel === 0) {
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

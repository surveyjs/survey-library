import type { ChangedKeys } from "./conditions/conditionProcessValue";
import { JsonObject, Serializer } from "./jsonobject";
import { Base } from "./base";
import { QuestionFactory } from "./questionfactory";
import { QuestionNonValue } from "./questionnonvalue";
import type { LocalizableString } from "./localizablestring";
import type { Question } from "./question";
import { Helpers, HashTable } from "./helpers";
import { ISurveyImpl } from "./base-interfaces";
import {
  IElementUIState, IFilterCondition, IFilterElementUIState, IFilterPresetEdit, IFilterSavedPresetState, IFilterState, IFilterUserPresetState
} from "./interfaces/ui-interfaces";
import { FilterField } from "./filter/filter-field";
import { FilterPreset, IFilterPreset, IFilterPresetPermissions, assignFilterPresetPermissions, copyFilterPresetPermissions, filterPresetPermissions } from "./filter/filter-preset";
import { FilterConditionsEditor } from "./filter/filter-conditions-editor";
import { FilterFieldPopup, writeFilterFieldCondition } from "./filter/filter-field-popup";
import { FilterSaveAsPopup } from "./filter/filter-save-as-popup";
import { FilterModal } from "./filter/filter-modal";
import { FilterEditPresetDialog, FilterPresetDialog } from "./filter/filter-preset-dialog";
import { FilterChip, FilterToolbars, IFilterFieldState } from "./filter/filter-toolbars";
import { FilterChipsLayout } from "./filter/filter-chips-layout";
import { FilterAIRequest } from "./filter/filter-ai";
import { FilterAIRequestEvent } from "./interfaces/ai-interfaces";
import { Action } from "./actions/action";
import { ActionContainer } from "./actions/container";
import { buildSearchFragment, getFieldChoiceItems } from "./filter/filter-expression";
import {
  conditionsToExpression, getFieldsByValueName, getFilterFieldOperators, getFilterValueEditorJson,
  normalizeFilterCondition, normalizeFilterConditions, parseFilterExpression, runWithFilterFieldCache,
  canParseFilterExpression, hasFilterConditionValue
} from "./filter/filter-conditions";
import { FilterFieldEditorKind, getFilterChipText, getFilterFieldEditorKind } from "./filter/filter-field-kinds";
import { IDynamicDataFilterField, getFilterFieldTitle } from "./dynamic-data/dynamic-data-filter-fields";
import { IDynamicDataFilterTarget } from "./dynamic-data/dynamic-data-interfaces";
import { combineFilterExpressions } from "./dynamic-data/dynamic-data-filter";
import { toCssClasses } from "./utils/cssClassBuilder";

// What uiState keeps of the authored presets the respondent changed, by name.
type FilterSavedPresets = { [name: string]: IFilterSavedPresetState };
// What an authored preset was in the JSON before the respondent first changed it: its title as JSON (a
// localized text stays localized), its expression and its permissions.
type FilterOriginalPreset = IFilterPresetPermissions & { preset: FilterPreset, expression: string, title: any };
// An authored preset the respondent deleted: the preset itself, its place among the authored presets
// (getAuthoredPresetList) and what the JSON made it, if they had changed it first - all toJSON() needs
// to store it as the author did.
type FilterDeletedPreset = { name: string, preset: FilterPreset, index: number, original: FilterOriginalPreset };
// The operators whose value is a set of values - see isSameConditionSet().
// The target is always the question findQuestionByName returns, asked by capability - see filterTarget.
type FilterTargetQuestion = Question & IDynamicDataFilterTarget;
const multiValueOperators: { [operator: string]: boolean } = { anyof: true, noneof: true, allof: true };

// A JSON definition in an array the host assigns, made the object of its class; an object is kept.
function toFilterObjects(val: Array<any>, className: string): Array<any> {
  if (!Array.isArray(val)) return val;
  return val.map((item: any): any => {
    if (!item || item instanceof Base) return item;
    const obj = Serializer.createClass(className);
    new JsonObject().toObject(item, obj);
    return obj;
  });
}
// The Filter Control. It descends from QuestionNonValue because it is a control and not an answer:
// it never assigns this.value, so it stays out of survey.data, out of the condition editor and out
// of validation. What the end user does with it is UI state, not survey data.
export class QuestionFilterModel extends QuestionNonValue {
  // The searchFields the JSON authored, taken once the JSON is read. getUIState() stores searchFields
  // only when they differ from it, so an authored value is not duplicated into the saved state and
  // no extra serializable "dirty" property is needed.
  private authoredSearchFields: Array<string>;
  // How many runBatch()/holdChanges() calls are in progress. While one is, a recomposed expression
  // is not written into the target and onUIStateChanged is only
  // noted (uiStateChangedInBatch) - see runBatch().
  private batchLevel: number = 0;
  private uiStateChangedInBatch: boolean = false;
  // The part of a restored uiState that has to be checked against the fields - the unsaved edits'
  // expression, saved presets and the respondent's own presets - when it arrives before the bound
  // target does: with no target there is nothing to check it against, and checking it against
  // nothing would drop all of it. Applied as the target attaches, in the same write - see
  // updateFilterTarget().
  private pendingExpression: string;
  private pendingPresets: FilterSavedPresets;
  private pendingUserPresets: Array<IFilterUserPresetState>;
  // ownRawExpression is a text applyFilter() took while the target was not there: the fields to tell it
  // by were not known yet (decomposeProvisionalFilter).
  private isOwnRawProvisional: boolean = false;
  // A renamed preset does not move defaultPreset here: Creator does it inside the rename's undo step,
  // and a change made from this handler would be an undo step of its own.
  private onPresetPropertyChanged = (): void => {
    this.updateFilterExpression();
    this.updateToolbars();
  };
  // A field contributes to the search through its choices, so a choice change is a change of
  // the expression.
  private onFieldPropertyChanged = (): void => {
    this.updateFilterExpression();
    this.updateToolbars();
  };

  constructor(name: string) {
    super(name);
    this.createNewArray("popupChips");
    this.createNewArray("fields",
      (field: FilterField): void => { this.onFieldAdded(field); },
      (field: FilterField): void => { this.onFieldRemoved(field); });
    this.createNewArray("presets",
      (preset: FilterPreset): void => { this.onPresetAdded(preset); },
      (preset: FilterPreset): void => { this.onPresetRemoved(preset); });
  }
  public getType(): string { return "filter"; }
  // The one place this control parts company with html and image: it does have a title.
  protected get supportTitle(): boolean { return true; }
  // The title does not make it a question: it takes no number and leaves the next question its own.
  protected isVisibleIndexNegative(): boolean { return true; }
  // What keeps it out of survey.data whatever assigns this.value: a value expression authored in the
  // JSON (setValueIf, defaultValueExpression) or a call from the host.
  protected canSetValueToSurvey(): boolean { return false; }

  public get targetQuestion(): string { return this.getPropertyValue("targetQuestion", ""); }
  public set targetQuestion(val: string) { this.setPropertyValue("targetQuestion", val); }

  // Both take JSON definitions as well as instances, as choices take plain values: a definition becomes
  // a FilterField or a FilterPreset.
  public get fields(): Array<FilterField> { return this.getPropertyValue("fields"); }
  public set fields(val: Array<FilterField>) { this.setPropertyValue("fields", toFilterObjects(val, "filterfield")); }

  public get presets(): Array<FilterPreset> { return this.getPropertyValue("presets"); }
  public set presets(val: Array<FilterPreset>) { this.setPropertyValue("presets", toFilterObjects(val, "filterpreset")); }

  public get defaultPreset(): string { return this.getPropertyValue("defaultPreset", ""); }
  public set defaultPreset(val: string) { this.setPropertyValue("defaultPreset", val); }

  public get showPresets(): boolean { return this.getPropertyValue("showPresets"); }
  public set showPresets(val: boolean) { this.setPropertyValue("showPresets", val); }

  // The respondent's permissions in the UI (canAddPresets, canEditPreset, canDeletePreset): the
  // methods of the API do not ask them.
  public get allowAddPresets(): boolean { return this.getPropertyValue("allowAddPresets"); }
  public set allowAddPresets(val: boolean) { this.setPropertyValue("allowAddPresets", val); }
  public get allowEditPresets(): boolean { return this.getPropertyValue("allowEditPresets"); }
  public set allowEditPresets(val: boolean) { this.setPropertyValue("allowEditPresets", val); }
  public get allowDeletePresets(): boolean { return this.getPropertyValue("allowDeletePresets"); }
  public set allowDeletePresets(val: boolean) { this.setPropertyValue("allowDeletePresets", val); }

  public get showSearchBar(): boolean { return this.getPropertyValue("showSearchBar"); }
  public set showSearchBar(val: boolean) { this.setPropertyValue("showSearchBar", val); }

  public get searchFields(): Array<string> { return this.getPropertyValue("searchFields"); }
  public set searchFields(val: Array<string>) {
    if (Helpers.isTwoValueEquals(val, this.searchFields)) return;
    this.setPropertyValue("searchFields", val);
    this.raiseUIStateChanged();
  }

  public get showQuickFilters(): boolean { return this.getPropertyValue("showQuickFilters"); }
  public set showQuickFilters(val: boolean) { this.setPropertyValue("showQuickFilters", val); }

  public get showAllFiltersButton(): boolean { return this.getPropertyValue("showAllFiltersButton"); }
  public set showAllFiltersButton(val: boolean) { this.setPropertyValue("showAllFiltersButton", val); }

  // The quick filters' field list: every field the control offers, minus one its fields entry opted
  // out (showInQuickFilters: false), and with a duplicate valueName
  // collapsed to its first field, the same one getFieldByName's dotted-path lookup would reach -
  // so both modes edit the same field, never two different ones that happen to share a name.
  public getQuickFilterFields(): Array<IDynamicDataFilterField> {
    return this.collapseDuplicateValueNames(this.getFilterFields().filter(
      (field: IDynamicDataFilterField): boolean => field.showInQuickFilters !== false));
  }
  private collapseDuplicateValueNames(fields: Array<IDynamicDataFilterField>): Array<IDynamicDataFilterField> {
    const firstByValueName = getFieldsByValueName(fields);
    return fields.filter((field: IDynamicDataFilterField): boolean => firstByValueName[field.valueName] === field);
  }

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

  // The filter alone: the selected preset's text or the control's own filter. Not registered either,
  // like the two below: they are computed, never authored.
  public get filterExpression(): string { return this.getPropertyValue("filterExpression", ""); }
  // The quick search as an expression over searchFields.
  public get searchExpression(): string { return this.getPropertyValue("searchExpression", ""); }
  // What the target question is filtered by: the filter and the search, each bracketed, an empty one
  // left out.
  public get combinedExpression(): string { return this.getPropertyValue("combinedExpression", ""); }

  // The key this control's filter lives under on the target. Neither the name nor the id: both can
  // be reassigned while the filter is on the target, and the detach that follows would then clear a
  // key nothing was written under. uniqueId is fixed for the life of the object.
  private get controlFilterKey(): string { return "filterControl:" + this.uniqueId; }
  // The target this control is currently writing into. Detaching goes through this and never
  // through a fresh lookup by name: once targetQuestion has been re-pointed, or the target question has
  // been renamed, the lookup no longer finds the question that still carries the filter, and it
  // would stay filtered forever with nothing left to clear it.
  private attachedTarget: FilterTargetQuestion;
  // The question targetQuestion names, if it can be filtered by a control. Asked by capability, the way the
  // data list asks a target whether it has "remove": the control imports none of the records questions.
  // A control taken off its page keeps its data, so without the parent check it would still find a
  // target - and filter it from outside the survey - the next time it re-resolves one.
  private get filterTarget(): FilterTargetQuestion {
    const q: any = !!this.data && !!this.parent ? this.data.findQuestionByName(this.targetQuestion) : undefined;
    return !!q && typeof q.getFilterFields === "function" && typeof q.setControlFilter === "function"
      ? <FilterTargetQuestion>q : undefined;
  }

  // Standalone or bound: one uniform field list, so nothing downstream has to know which one it is.
  // While a pass over the toolbars runs it is the list that pass read (see updateToolbars).
  public getFilterFields(): Array<IDynamicDataFilterField> {
    return this.passFields || this.buildFilterFields();
  }
  // With no target, the fields entries. With one, the target's fields in its order, each as the entry
  // that names it overrides it, then the entries that name no record field of the target: fields of
  // the record it has no column for. An entry naming a column the filter leaves out (allowFiltering:
  // false), or a path into one, is neither; a path into a column it offers is a field of the record.
  // A target builds its list anew on every call.
  private buildFilterFields(): Array<IDynamicDataFilterField> {
    const target = this.filterTarget;
    if (!target) return this.fields.map((field: FilterField): IDynamicDataFilterField => field.getFilterField());
    const used: Array<FilterField> = [];
    const res = target.getFilterFields().map((field: IDynamicDataFilterField): IDynamicDataFilterField => {
      const entry = this.findFieldEntry(field);
      if (!entry) return field;
      used.push(entry);
      return entry.applyTo(field);
    });
    this.fields.forEach((entry: FilterField): void => {
      if (!!entry.name && used.indexOf(entry) < 0 && !this.isTargetRecordField(target, entry.name)) {
        res.push(entry.getFilterField());
      }
    });
    return res;
  }
  // The entry for a field of the target: by the field's name, then by its value name (a nested
  // field's path), as getFieldByName finds a field.
  private findFieldEntry(field: IDynamicDataFilterField): FilterField {
    const fields = this.fields;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].name === field.name) return fields[i];
    }
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].name === field.valueName) return fields[i];
    }
    return undefined;
  }
  // The field a fields entry stands for: the target's it overrides, the record field it adds or, with
  // no target, its own; undefined for an entry the control ignores. The designer offers an entry's
  // operators by it. An entry of getDesignFieldEntries() that is not in fields yet stands for its field.
  public getFieldOfEntry(entry: FilterField): IDynamicDataFilterField {
    if (!entry) return undefined;
    if (this.fields.indexOf(entry) < 0) return this.getFieldOfDesignEntry(entry);
    const target = this.filterTarget;
    if (!target) return entry.getFilterField();
    const field = target.getFilterFields().filter((f: IDynamicDataFilterField): boolean => this.findFieldEntry(f) === entry)[0];
    if (!!field) return entry.applyTo(field);
    return !entry.name || this.isTargetRecordField(target, entry.name) ? undefined : entry.getFilterField();
  }
  // What the designer's Fields table shows: with a target, a row per field of the target in its order -
  // the entry that overrides it (findFieldEntry, as buildFilterFields matches it) or a new entry that is
  // not in fields and stands for the field until the designer adds it - then every other entry: the
  // fields of the record and the entries the control ignores, so they can be changed and removed.
  // With no target, the fields entries. A new array, and new entries, on every call.
  public getDesignFieldEntries(): Array<FilterField> {
    const target = this.filterTarget;
    if (!target) return [].concat(this.fields);
    const targetFields = target.getFilterFields();
    const res: Array<FilterField> = [];
    targetFields.forEach((field: IDynamicDataFilterField): void => {
      const entry = this.findFieldEntry(field);
      res.push(!!entry && res.indexOf(entry) < 0 ? entry : this.createDesignEntry(field, targetFields));
    });
    this.fields.forEach((entry: FilterField): void => {
      if (res.indexOf(entry) < 0) res.push(entry);
    });
    return res;
  }
  // Named by the field's name, or by its path where another field of the target has the same name: once
  // added, findFieldEntry would give an entry named "city" to the first of two such fields.
  private createDesignEntry(field: IDynamicDataFilterField, targetFields: Array<IDynamicDataFilterField>): FilterField {
    const isNameShared = targetFields.some((f: IDynamicDataFilterField): boolean => f !== field && f.name === field.name);
    const entry = new FilterField(isNameShared ? field.valueName : field.name);
    entry.fieldOwner = this;
    return entry;
  }
  private getFieldOfDesignEntry(entry: FilterField): IDynamicDataFilterField {
    const target = this.filterTarget;
    if (entry.fieldOwner !== this || !target) return undefined;
    const field = this.findFieldInList(target.getFilterFields(), entry.name);
    return !!field ? entry.applyTo(field) : undefined;
  }
  // A target that cannot tell (no hasRecordField) takes no name: an entry its list does not have is a
  // field of the record.
  private isTargetRecordField(target: FilterTargetQuestion, name: string): boolean {
    return typeof target.hasRecordField === "function" && target.hasRecordField(name);
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
  // Takes the field list instead of rebuilding it: a bound control asks its target for the whole
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

  // presets is the live list: the authored presets the respondent did not delete, then the
  // respondent's own and the ones the application added. toJSON() stores the authored presets as the
  // JSON made them (getSerializablePresetsValue); uiState holds what the respondent changed over them.
  public getPresetByName(name: string): FilterPreset {
    if (!name) return undefined;
    const presets = this.presets;
    for (let i = 0; i < presets.length; i++) {
      if (presets[i].name === name) return presets[i];
    }
    return undefined;
  }
  // The selected preset by name, or "". Held by name and not by object: the name is what uiState
  // saves, what defaultPreset speaks in, and it degrades correctly - a deleted preset simply stops
  // being found. Read-only: applyPreset() selects, applyFilter() and clearFilter() unselect.
  public get selectedPreset(): string { return this.getPropertyValue("selectedPreset", ""); }
  // A preset that is selected, or stops being selected, replaces the whole filter: the control's
  // own filter was made over the previous one and means nothing over the next.
  private setSelectedPreset(val: string): void {
    val = val || "";
    if (val === this.selectedPreset) return;
    this.setPropertyValue("selectedPreset", val);
    this.setOwnFilter(undefined, undefined);
    this.updateFilterExpression();
    this.raiseUIStateChanged();
  }
  public get activePreset(): FilterPreset { return this.getPresetByName(this.selectedPreset); }
  public applyPreset(name: string): void {
    if (this.isDesignMode || !this.getPresetByName(name)) return;
    this.runBatch((): void => { this.setSelectedPreset(name); }, true);
  }
  // The control's own filter, as text: one the fields can show becomes their conditions (the chips
  // show them), any other is kept as it is and filters as it is. A text that does not parse changes
  // nothing.
  public applyFilter(expression: string): void {
    if (this.isDesignMode) return;
    const text = (expression || "").trim();
    if (!!text && !canParseFilterExpression(text)) return;
    this.runBatch((): void => {
      this.setSelectedPreset("");
      const before = this.getOwnFilterKey();
      this.setOwnFilterText(text);
      if (this.getOwnFilterKey() !== before) {
        this.raiseUIStateChanged();
      }
    }, true);
  }
  // A text that parses (or "") as the control's own filter: conditions where the fields show it,
  // the text as it is otherwise - also one that names a record key no field has. Before the target
  // is there the fields are not known: the text is kept and decomposed as the target attaches.
  private setOwnFilterText(text: string): void {
    const isReady = this.isFieldListReady;
    const conditions = !text ? [] : isReady ? this.decomposeExpression(text) : null;
    if (conditions === null) {
      this.setOwnFilter(undefined, text);
      this.isOwnRawProvisional = !isReady;
    } else {
      this.setOwnFilter(normalizeFilterConditions(conditions, this.getFilterFields()), undefined);
    }
  }
  // No preset and no filter of the control's own; the search stays. Restored conditions still
  // waiting for a bound target are a filter of its own too and go with it (setOwnFilter drops them).
  public clearFilter(): void {
    if (this.isDesignMode) return;
    this.runBatch((): void => {
      this.setSelectedPreset("");
      const before = this.getOwnFilterKey();
      this.setOwnFilter(undefined, undefined);
      if (this.getOwnFilterKey() !== before) {
        this.raiseUIStateChanged();
      }
    }, true);
  }
  // Whether clearFilter() has anything to clear: a "Clear" button shown by it is shown exactly when
  // clicking it does something. A name no preset answers to (the host took the preset away)
  // filters nothing.
  public get canClearFilter(): boolean {
    if (this.pendingExpression !== undefined || this.ownRawExpression !== undefined) return true;
    if (!!this.activePreset) return true;
    return (this.ownConditions || []).length > 0;
  }
  // A text the fields cannot show (applyFilter, a restore): it is the filter as it is, and the chips
  // show nothing of it. Mutually exclusive with ownConditions.
  public get ownRawExpression(): string { return this.getPropertyValue("ownRawExpression", undefined); }
  // What the own filter is, to tell a change from none: a write that changes nothing raises nothing.
  private getOwnFilterKey(): string {
    return JSON.stringify([this.ownConditions, this.ownRawExpression, this.pendingExpression]);
  }
  // The own filter is conditions or a text, never both; no conditions ([]) is no filter, the same as
  // undefined. Whatever decides the filter now supersedes restored edits still waiting for a target.
  private setOwnFilter(conditions: Array<IFilterCondition>, raw: string): void {
    this.isOwnRawProvisional = false;
    this.setOwnConditions(!!conditions && conditions.length > 0 ? conditions : undefined);
    if (raw !== this.ownRawExpression) {
      this.setPropertyValue("ownRawExpression", raw);
    }
  }
  // In the designer the buttons do nothing of their own: they call this callback instead - with the
  // preset the presets' chip shows (the default one), with no preset for any other button. Creator sets it to select the
  // control or open the preset's settings, the way it sets setCanShowOptionItemCallback on a select
  // question; the buttons stop the click event, so the designer's own click handler never runs.
  private designPresetClickCallback: (preset?: FilterPreset) => void;
  public setDesignPresetClickCallback(callback: (preset?: FilterPreset) => void): void {
    this.designPresetClickCallback = callback;
  }
  public onDesignPresetClick(preset?: FilterPreset): void {
    if (!!this.designPresetClickCallback) {
      this.designPresetClickCallback(preset);
    }
  }
  // A click on a preset in the UI: the selected one is unselected, and the filter goes with it.
  public togglePreset(preset: FilterPreset | string): void {
    const name = typeof preset === "string" ? preset : (!!preset ? preset.name : "");
    if (!name) return;
    if (name === this.selectedPreset) {
      this.clearFilter();
    } else {
      this.applyPreset(name);
    }
  }
  // The list a renderer shows: the authored presets the respondent did not delete, then the
  // respondent's own. None while the presets are hidden.
  public get visiblePresets(): Array<FilterPreset> {
    return this.showPresets ? this.presets : [];
  }
  public get canAddPresets(): boolean { return this.showPresets && this.allowAddPresets; }
  // Whether the application answers AI requests (survey.onAIFilterRequest has a handler): a preset
  // dialog then offers to write or change a preset's filter with AI. Never in the designer. Read when
  // a dialog opens.
  public get canRequestAI(): boolean {
    return !this.isDesignMode && !!this.survey && this.survey.isAIFilterRequestAvailable();
  }
  public fireAIRequest(options: FilterAIRequestEvent): void {
    if (!!this.survey) {
      this.survey.aiFilterRequest(options);
    }
  }
  // A conversation with the application's model about this control's filter - see FilterAIRequest.
  // The caller disposes it.
  public createAIRequest(): FilterAIRequest {
    return new FilterAIRequest(this);
  }
  // What the UI lets the respondent do to a preset: the preset's own permission where it has one, the
  // control's otherwise (getPresetPermission). A preset of the respondent's own may always be changed
  // and deleted. None of it while the presets are hidden, except editing, which the UI never offers
  // then anyway.
  public canEditPreset(preset: FilterPreset): boolean {
    return !!preset && (this.isUserPreset(preset) || this.getPresetPermission(preset.allowEdit, this.allowEditPresets));
  }
  public canDeletePreset(preset: FilterPreset): boolean {
    return this.showPresets && !!preset && (this.isUserPreset(preset) || this.getPresetPermission(preset.allowDelete, this.allowDeletePresets));
  }
  // A copy is a new preset: the control's permission to add presets is the one a preset follows.
  public canCopyPreset(preset: FilterPreset): boolean {
    return this.showPresets && !!preset && this.getPresetPermission(preset.allowCopy, this.allowAddPresets);
  }
  // true or false set on a preset overrides the control either way; undefined is the control's.
  private getPresetPermission(presetValue: boolean, controlValue: boolean): boolean {
    return typeof presetValue === "boolean" ? presetValue : !!controlValue;
  }
  // Whether the respondent added the preset (addPreset) - the author did not.
  public isUserPreset(preset: FilterPreset): boolean { return !!preset && this.userPresetsValue.indexOf(preset) > -1; }
  // Whether an authored preset is not what the JSON says any more: the respondent renamed it or
  // changed its conditions (updatePreset). A preset of the respondent's own has
  // nothing to differ from.
  public isPresetModified(preset: FilterPreset): boolean {
    return !!preset && !this.isUserPreset(preset) && !!this.originalPresets[preset.name];
  }
  public canResetPreset(preset: FilterPreset): boolean { return !this.isDesignMode && this.isPresetModified(preset); }
  // The presets Edit Preset opens for: those the respondent may change or delete. None in the designer,
  // and none while the presets are hidden.
  public getEditablePresets(): Array<FilterPreset> {
    if (this.isDesignMode) return [];
    return this.visiblePresets.filter((preset: FilterPreset): boolean => this.canEditPreset(preset) || this.canDeletePreset(preset));
  }
  // What a preset is in the JSON - its title and its conditions, null for a preset that does not
  // decompose - whatever the respondent changed since: what resetPreset() brings back. A preset of the
  // respondent's own is what it is. Its text: getOriginalPresetExpression().
  public getOriginalPresetState(name: string): { title: string, conditions: Array<IFilterCondition> | null } {
    const preset = this.getPresetByName(name);
    if (!preset) return undefined;
    if (!this.isPresetModified(preset)) return { title: preset.title, conditions: this.parsePresetConditions(preset) };
    const original = this.createOriginalPreset(preset.name);
    const res = { title: original.title, conditions: this.parsePresetConditions(original) };
    original.dispose();
    return res;
  }
  // The text a preset has in the JSON, whatever the respondent changed since: what resetPreset() brings
  // back. A preset of the respondent's own is what it is. "" for no preset.
  public getOriginalPresetExpression(name: string): string {
    const preset = this.getPresetByName(name);
    if (!preset) return "";
    const original = this.isPresetModified(preset) ? this.originalPresets[preset.name].expression : preset.expression;
    return (original || "").trim();
  }
  // Whether a title and filter are what the JSON made the preset, which resetPreset() brings back.
  // expression - a preset edited as text - is compared with the JSON's text
  // (as conditions where both decompose: their order is no change). Otherwise conditions null - a
  // preset that does not decompose - compares only with an original that does not decompose either.
  // A preset of the respondent's own is compared with what it is.
  public isOriginalPresetState(name: string, title: string, conditions: Array<IFilterCondition> | null, expression?: string): boolean {
    const original = this.getOriginalPresetState(name);
    if (!original) return true;
    if ((title || "").trim() !== original.title) return false;
    if (expression !== undefined) return this.isSameExpression(expression, this.getOriginalPresetExpression(name));
    if (conditions === null || original.conditions === null) return conditions === original.conditions;
    return this.isSameConditionSet(normalizeFilterConditions(conditions, this.getFilterFields()), original.conditions);
  }
  // Adds a preset to presets and returns it. A name that is empty or taken (a deleted authored preset's
  // too: a name is what uiState holds) and a text that is empty or does not parse add nothing: a preset
  // that filters by nothing is no preset. The permissions of the respondent are not asked: they are the
  // UI's. Nothing in the designer.
  public addPreset(data: IFilterPreset): FilterPreset {
    if (this.isDesignMode || !data || typeof data.name !== "string" || !data.name || this.isPresetNameUsed(data.name)) return undefined;
    const expression = this.toPresetExpression(data.expression);
    if (expression === undefined) return undefined;
    const preset = this.createUserPreset(data.name, data.title, expression, data);
    this.runBatch((): void => {
      this.presets.push(preset);
      this.updateToolbars();
      this.raiseUIStateChanged();
    }, true);
    return preset;
  }
  // Replaces the title, text and permissions of the preset data.name names. A title that is empty or
  // not given keeps the title, and a text that filters the same keeps the text. An authored preset
  // remembers what the JSON made it before its first change - resetPreset() puts that back - and a
  // change that brings it back to that is a reset. A selected preset filters by its new text at once:
  // one write into the target and one onUIStateChanged, none of them for a change that changes nothing.
  public updatePreset(data: IFilterPreset): FilterPreset {
    const preset = !!data && typeof data.name === "string" ? this.getPresetByName(data.name) : undefined;
    if (!preset || this.isDesignMode) return undefined;
    const expression = this.toPresetExpression(data.expression);
    if (expression === undefined) return undefined;
    const before = JSON.stringify(this.getPresetJson(preset));
    this.runBatch((): void => {
      const isUser = this.isUserPreset(preset);
      if (!isUser) {
        this.rememberOriginal(preset);
      }
      const title = typeof data.title === "string" ? data.title.trim() : "";
      if (!!title && title !== preset.title) {
        this.setPresetText(preset.locTitle, title);
        if (!isUser) {
          this.savedPresetTitles[preset.name] = title;
        }
      }
      // A text that filters the same is no change: a rename keeps the text as the author wrote it.
      if (!this.isSameExpression(expression, preset.expression)) {
        preset.expression = expression;
      }
      assignFilterPresetPermissions(preset, data);
      if (!isUser && this.isSameAsOriginal(preset)) {
        this.restoreOriginal(preset);
      }
      if (JSON.stringify(this.getPresetJson(preset)) !== before) {
        this.updateToolbars();
        this.raiseUIStateChanged();
      }
    }, true);
    return preset;
  }
  // A preset of the respondent's own (the Filters dialog's Add New, "Save as..."): what it filters by and
  // a title, under a name of its own. What it filters by is conditions, normalized as an edit is, or a
  // text (options.expression) - one that decomposes is normalized and composed the same way, any other is
  // kept as typed. Nothing for conditions none of which the fields can hold.
  public addPresetFromConditions(title: string, conditions: Array<IFilterCondition>, options?: { expression?: string }): FilterPreset {
    const expression = this.composePresetExpression(conditions, !!options ? options.expression : undefined);
    if (expression === undefined) return undefined;
    return this.addPreset({ name: this.getNewPresetName(), title: title, expression: expression, allowEdit: true, allowDelete: true, allowCopy: true });
  }
  // A preset's new title and filter (Edit Preset): conditions, or a text (expression) for a preset edited
  // as text. Neither keeps the filter it has, and so do conditions none of which the fields can hold and a
  // text that is empty or does not parse; an empty title keeps the title.
  public updatePresetFromConditions(name: string, title: string, conditions?: Array<IFilterCondition>, expression?: string): void {
    const preset = this.getPresetByName(name);
    if (!preset) return;
    const next = conditions !== undefined || expression !== undefined ? this.composePresetExpression(conditions, expression) : undefined;
    this.updatePreset({ name: name, title: title, expression: next !== undefined ? next : preset.expression,
      allowEdit: preset.allowEdit, allowDelete: preset.allowDelete, allowCopy: preset.allowCopy });
  }
  // A preset filters by a text that parses; "" filters by nothing and is no preset.
  private toPresetExpression(text: any): string {
    const res = typeof text === "string" ? text.trim() : "";
    return !!res && canParseFilterExpression(res) ? res : undefined;
  }
  private getPresetJson(preset: FilterPreset): any {
    const res: any = { title: preset.locTitle.getJson(), expression: preset.expression };
    assignFilterPresetPermissions(res, preset);
    return res;
  }
  // Brings an authored preset back to what the JSON made it: its title and its expression. A preset
  // that is on filters by it at once.
  public resetPreset(name: string): void {
    const preset = this.getPresetByName(name);
    if (!this.canResetPreset(preset)) return;
    this.runBatch((): void => {
      this.restoreOriginal(preset);
      this.updateToolbars();
      this.raiseUIStateChanged();
    }, true);
  }
  // Removes a preset from presets. The respondent's own is disposed once the toolbars have let go of its
  // chip; an authored one is remembered as deleted (rememberDeletedPreset), so uiState can tell it from
  // one never there and toJSON() still stores it. A preset that is selected is unselected, and the
  // filter with it: there is nothing left to filter by.
  public deletePreset(name: string): void {
    const preset = this.getPresetByName(name);
    if (!preset || this.isDesignMode) return;
    const isUser = this.isUserPreset(preset);
    this.runBatch((): void => {
      if (this.selectedPreset === name) {
        this.setSelectedPreset("");
      }
      if (isUser) {
        this.userPresetsValue.splice(this.userPresetsValue.indexOf(preset), 1);
      } else {
        this.rememberDeletedPreset(preset);
      }
      this.removeFromPresets(preset);
      this.updateFilterExpression();
      this.updateToolbars();
      this.raiseUIStateChanged();
    }, true);
    if (isUser) {
      preset.dispose();
    }
  }
  // Edit Preset's Apply and Delete: the changes of the presets as one change - one write into the
  // target if the filter that applies changed, one onUIStateChanged - and
  // nothing for no change. Each preset is deleted, or reset first and then given its new title and
  // filter.
  public applyPresetEdits(edits: Array<IFilterPresetEdit>): void {
    if (this.isDesignMode || !Array.isArray(edits)) return;
    this.runBatch((): void => {
      edits.forEach((edit: IFilterPresetEdit): void => {
        if (!edit) return;
        if (edit.isDeleted) {
          this.deletePreset(edit.name);
          return;
        }
        if (edit.isReset) {
          this.resetPreset(edit.name);
        }
        if (edit.title !== undefined || edit.conditions !== undefined || edit.expression !== undefined) {
          this.updatePresetFromConditions(edit.name, edit.title, edit.conditions, edit.expression);
        }
      });
    }, true);
  }

  // The control's own filter as the fields show it: conditions an edit in a chip or in the Filters
  // dialog made, or a text applyFilter() took that decomposes. undefined means none - the selected
  // preset's text, if there is one, applies verbatim; no conditions are kept as undefined, not []
  // (setOwnFilter). Never together with ownRawExpression. Not
  // registered in the serializer: it is runtime state, like searchString. Every edit writes a new
  // array, never mutates the one in place, so the property change is what a renderer sees - see
  // setOwnConditions().
  public get ownConditions(): Array<IFilterCondition> { return this.getPropertyValue("ownConditions", undefined); }
  // Not in design mode: filterExpression is never composed there, so an edit would change nothing
  // anyone can see.
  public get canEditConditions(): boolean {
    return !this.isDesignMode;
  }
  // The control's own readOnly (enableIf sets it) locks its UI: the chips are disabled, no dialog or
  // popup opens and the search box is off, while the active preset still filters. Not isReadOnly:
  // that includes survey display mode and a read-only parent panel, and a filter changes no data -
  // a respondent reviewing a completed survey may still look at the records. Only the UI: the
  // uiState restore and an application's calls (canEditConditions) still work, as a read-only
  // question's value can still be set from code. In the designer every button reports the click.
  public get isControlReadOnly(): boolean { return !this.isDesignMode && this.readOnly; }
  // What the editors, the field popups and the Filters dialog read: the conditions can be edited, and
  // the UI is not locked. The one rule of the UI's read-only state.
  public get canEditConditionsInUI(): boolean { return this.canEditConditions && !this.isControlReadOnly; }
  // The filter applies as text that has no conditions to show - an "or", a function, a comparison
  // of two fields: the selected preset's or the control's own (applyFilter). A renderer warns with
  // it that the first edit starts from nothing.
  public get isRawExpression(): boolean {
    if (this.ownRawExpression !== undefined) return true;
    if (!this.activePreset || this.ownConditions !== undefined) return false;
    return this.parseActivePresetConditions() === null;
  }
  // The conditions the filter is made of now: the control's own, or the selected preset's; null for
  // a text the fields cannot show.
  private getCurrentConditions(): Array<IFilterCondition> | null {
    if (this.ownRawExpression !== undefined) return null;
    return this.ownConditions !== undefined ? this.ownConditions : this.parseActivePresetConditions();
  }
  public getFieldCondition(name: string): IFilterCondition {
    const field = this.getFieldByName(name);
    if (!field) return undefined;
    const conditions = this.getCurrentConditions();
    const condition = (conditions || []).filter((c: IFilterCondition): boolean => c.field === field.valueName)[0];
    return !!condition ? this.copyCondition(condition) : undefined;
  }
  // One condition per field: an edit of a field that already has one replaces it where it stands,
  // so the badges a renderer shows do not jump around; a new one goes to the end. The condition is
  // normalized as it is written (normalizeFilterCondition): its value coerced the way a restore
  // coerces it, so a typed "18" over a preset's 18 is not an edit that survives a uiState round
  // trip only as something else. One the field cannot hold - an operator it does not offer, no value
  // where the operator needs one - is refused and changes nothing: it would compose into nothing,
  // yet stored it would still count as an edit and could be saved into the preset.
  public setFieldCondition(name: string, operator: string, value?: any): void {
    const field = this.getFieldByName(name);
    if (!field) return;
    const condition = normalizeFilterCondition(field, { field: field.valueName, operator: operator, value: value });
    if (!condition) return;
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
  // Over a selected preset this unselects it, as any edit does, and leaves no conditions.
  public clearConditions(): void {
    this.editConditions((): Array<IFilterCondition> => []);
  }
  // A quick filter: one field, written when the editor is applied (the Apply of the field's popup).
  // Read-only where conditions cannot be edited - the edits would be refused anyway, and an editor
  // that looks editable and changes nothing is worse than one that says so. An apply that leaves the
  // field with no condition where it had none writes nothing: clearing it would still be an edit,
  // which turns an active preset off. The caller owns the editor and disposes it. A field the quick filters
  // do not show (showInQuickFilters: false, or a duplicate valueName collapsed into its first field)
  // gets none: its condition is changed in the Filters dialog only.
  public createQuickFilterEditor(name: string): FilterConditionsEditor {
    if (!this.isQuickFilterField(this.getFieldByName(name))) return undefined;
    return new FilterConditionsEditor(this, [name], {
      readOnly: !this.canEditConditionsInUI,
      onApply: (conditions: Array<IFilterCondition>): void => {
        if (conditions === undefined) return;
        writeFilterFieldCondition(this, name, conditions[0]);
      }
    });
  }
  // The content of a quick filter chip's popup - see FilterFieldPopup. close is how the popup's own
  // buttons close it (the toolbar hides its PopupModel). The caller owns it and disposes it. undefined
  // for a field the quick filters do not show, as with createQuickFilterEditor.
  // The content of "Save as..."'s popup: the name of a new preset of the respondent's own, made of
  // the conditions they set. Nothing where presets cannot be added.
  public createSaveAsPopup(close: () => void): FilterSaveAsPopup {
    if (!this.canAddPresets || this.isDesignMode) return undefined;
    return new FilterSaveAsPopup(this, close);
  }
  public createFieldPopup(name: string, close: () => void): FilterFieldPopup {
    if (!this.isQuickFilterField(this.getFieldByName(name))) return undefined;
    return new FilterFieldPopup(this, name, close);
  }
  // By name and valueName and not by object: a standalone field's descriptor is rebuilt on every
  // getFilterFields() call, so the two lists never share an object.
  private isQuickFilterField(field: IDynamicDataFilterField): boolean {
    if (!field) return false;
    return this.getQuickFilterFields().some((f: IDynamicDataFilterField): boolean =>
      f.name === field.name && f.valueName === field.valueName);
  }
  // The Filters dialog: every field - those the quick filters hide too, a duplicate valueName still collapsed
  // to its first field - and the search box on top when there is one. Nothing is written while it
  // is edited; apply() writes all of it as one change, cancel() writes nothing. Read-only where
  // conditions cannot be edited, as in the quick filters. An editor is given even when
  // showAllFiltersButton is false: that flag tells a renderer whether to offer the button, it is
  // not a permission the model enforces. The caller owns the editor and disposes it.
  public createAllFiltersEditor(): FilterConditionsEditor {
    return new FilterConditionsEditor(this, this.getAllFieldKeys(), {
      readOnly: !this.canEditConditionsInUI,
      showSearch: this.showSearchBar,
      searchString: this.searchString,
      searchPlaceholder: this.searchPlaceholder,
      showFieldTitles: true,
      onApply: (conditions: Array<IFilterCondition>, searchString?: string): void => {
        this.applyEditorState(conditions, searchString);
      }
    });
  }
  // The fields of the Filters dialog: every field, as in the Filters dialog, each in the form of its kind
  // (checkboxes, a tagbox, Yes and No, an operator and a value), with no search box of its own - the
  // dialog's "Search in Filters" looks among them (setFilterText). It writes nothing: the dialog reads its conditions
  // (FilterModal) and is told of every change through onFieldChanged.
  public createModalEditor(onFieldChanged: () => void): FilterConditionsEditor {
    return new FilterConditionsEditor(this, this.getAllFieldKeys(), {
      readOnly: !this.canEditConditionsInUI,
      showFieldTitles: true,
      useFieldKinds: true,
      linkCss: (this.cssClasses || {}).link,
      onFieldChanged: onFieldChanged
    });
  }
  // The Filters dialog - see FilterModal. The caller owns it and disposes it.
  public createFilterModal(): FilterModal {
    return new FilterModal(this);
  }
  // The New Preset dialog, its fields holding the given conditions - or, given a text, the text
  // to edit as it is - see FilterPresetDialog. The caller owns it and disposes it.
  public createAddPresetDialog(conditions: Array<IFilterCondition>, expression?: string): FilterPresetDialog {
    return new FilterPresetDialog(this, conditions || [], expression);
  }
  // A text as the conditions the fields edit it with, or null when it is not that kind of text -
  // what decides whether a preset dialog shows a preset as fields or as text.
  public parseExpressionConditions(text: string): Array<IFilterCondition> | null {
    return this.decomposeExpression(text);
  }
  // Conditions as the text the fields write them as.
  public getConditionsExpression(conditions: Array<IFilterCondition>): string {
    const fields = this.getFilterFields();
    return conditionsToExpression(normalizeFilterConditions(conditions || [], fields), fields);
  }
  // The Edit Preset dialog of the named preset - see FilterEditPresetDialog. The caller owns it and
  // disposes it.
  public createEditPresetDialog(presetName: string): FilterEditPresetDialog {
    return new FilterEditPresetDialog(this, presetName);
  }
  // Every field by the name the editors reach it back by, in the order the Filters dialog shows them -
  // the fields a preset can be made of: those the quick filters hide too, a duplicate valueName collapsed to
  // its first field.
  public getAllFieldKeys(): Array<string> {
    const all = this.getFilterFields();
    const names: Array<string> = [];
    this.collapseDuplicateValueNames(all).forEach((field: IDynamicDataFilterField): void => {
      const key = this.findFieldKey(all, field);
      if (!!key) names.push(key);
    });
    return names;
  }
  // The name the editor reaches the field back by through getFieldByName(): its own name, unless
  // an earlier field holds that name (a bound nested field is named by its leaf, and two leaves can
  // match), then its valueName, which is unique once duplicates are collapsed. Undefined when
  // neither leads back to it.
  private findFieldKey(fields: Array<IDynamicDataFilterField>, field: IDynamicDataFilterField): string {
    const isSame = (f: IDynamicDataFilterField): boolean => !!f && f.name === field.name && f.valueName === field.valueName;
    if (isSame(this.findFieldInList(fields, field.name))) return field.name;
    if (isSame(this.findFieldInList(fields, field.valueName))) return field.valueName;
    return undefined;
  }
  // The name a renderer addresses a field by in every call that takes one (getFieldCondition,
  // createQuickFilterEditor, ...), by the rule above. A renderer that used field.name would reach the
  // first of two bound nested fields sharing a leaf name from both badges.
  public getFieldKey(field: IDynamicDataFilterField): string {
    return !!field ? this.findFieldKey(this.getFilterFields(), field) : undefined;
  }
  // The Filters dialog's apply(): the editor's conditions replace the own ones and its search text
  // replaces searchString, as one change - one write into the target and one
  // onUIStateChanged, none of them when nothing changed. Not over conditions that cannot be edited:
  // the editor is read-only there and never calls this, but the rule belongs to the control.
  // conditions is undefined when the respondent changed no field, only the search box: the editor
  // opened with the conditions the filter has now and still holds them, so there is nothing to
  // replace - and over a preset that does not decompose, "replacing" them with the editor's empty
  // fields would wipe the preset's text for a change that never touched it.
  private applyEditorState(conditions: Array<IFilterCondition>, searchString?: string): void {
    if (!this.canEditConditions) return;
    this.runBatch((): void => {
      if (conditions !== undefined) {
        this.replaceConditions(conditions);
      }
      if (searchString !== undefined) {
        this.searchString = searchString;
      }
    }, true);
  }
  // The state the Filters dialog opens with: the selected preset (its own text applies, conditions
  // undefined), the control's own text that the fields cannot show (expression), or the conditions
  // that apply ([] for none), and the search text.
  public getFilterState(): IFilterState {
    const searchString = this.searchString;
    if (this.ownRawExpression !== undefined) {
      return { selectedPreset: "", conditions: undefined, expression: this.ownRawExpression, searchString: searchString };
    }
    const own = this.ownConditions;
    if (own === undefined && !!this.activePreset) return { selectedPreset: this.selectedPreset, conditions: undefined, searchString: searchString };
    return { selectedPreset: "", conditions: [].concat(own || []), searchString: searchString };
  }
  // The text a state applies as it is, when the fields cannot show it: the control's own text, or the
  // text of the preset it selects (conditions undefined) when that text does not decompose - what
  // the Filters dialog shows of it, and what Add New Preset opened over it starts with. "" for any
  // other state.
  public getRawPresetExpression(state: IFilterState): string {
    if (!state) return "";
    if (state.expression !== undefined) return state.expression;
    if (state.conditions !== undefined) return "";
    const preset = this.getPresetByName(state.selectedPreset);
    if (!preset || this.parsePresetConditions(preset) !== null) return "";
    return (preset.expression || "").trim();
  }
  // A preset's text as conditions - what the Filters dialog shows in the fields when the preset is
  // turned on in it - or null when the text has none to offer, or there is no such preset.
  public getPresetConditions(name: string): Array<IFilterCondition> | null {
    return this.parsePresetConditions(this.getPresetByName(name));
  }
  // The filterExpression a state would give, without applying it: what the Filters dialog counts the
  // records of. Composed the way updateFilterExpression() composes the control's own combinedExpression.
  public composeFilterExpression(state: IFilterState): string {
    if (!state) return "";
    const fields = this.getFilterFields();
    let text: string;
    if (state.expression !== undefined) {
      text = state.expression;
    } else if (state.conditions !== undefined) {
      text = conditionsToExpression(normalizeFilterConditions(state.conditions, fields), fields);
    } else {
      const preset = this.getPresetByName(state.selectedPreset);
      text = !!preset ? (preset.expression || "").trim() : "";
    }
    return combineFilterExpressions(text, this.calcSearchExpression(state.searchString));
  }
  // The Filters dialog's apply: its state replaces the control's as one change - one write into the
  // target and one onUIStateChanged, none of them when nothing changed. A text of its own is applied
  // as applyFilter() applies one; a preset as it was is selected (the own filter goes with the one
  // before); conditions replace the filter's own the way an edit does (replaceConditions): over a
  // selected preset they unselect it and keep its order - unless they are the preset's own
  // conditions, which is no edit.
  public applyFilterState(state: IFilterState): void {
    if (!state || !this.canEditConditions) return;
    this.runBatch((): void => {
      if (state.expression !== undefined) {
        this.applyFilter(state.expression);
      } else if (state.conditions !== undefined) {
        this.replaceConditions(state.conditions);
      } else if (!!state.selectedPreset) {
        this.applyPreset(state.selectedPreset);
      } else {
        this.clearFilter();
      }
      if (this.showSearchBar && state.searchString !== undefined) {
        this.searchString = state.searchString;
      }
    }, true);
  }
  // How many records an expression would leave in the bound target - the "Show N items" of the
  // Filters dialog - with the filters of the target's other controls and its own authored one.
  // undefined when it cannot be known: a standalone control, a target that cannot count.
  public countFilterResults(expression: string): Promise<number | undefined> {
    const target = this.attachedTarget;
    if (!target || typeof target.getControlFilterCount !== "function") return Promise.resolve(undefined);
    return target.getControlFilterCount(this.controlFilterKey, expression || "");
  }
  // A condition the filter holds now keeps its place and a new one goes to the end, as with
  // setFieldCondition(); one the editor no longer holds is dropped. Conditions that are, as a set,
  // what applies now are no edit - over an untouched preset that keeps ownConditions undefined, so
  // the preset is still "not modified" and its own text still applies verbatim. Over a preset that
  // does not decompose nothing applies as conditions, so applying is always a first edit there and
  // replaces the preset's text by what the editor holds. The editor's conditions are normalized as
  // setFieldCondition() normalizes one (normalizeFilterConditions), so they compare with the
  // preset's and restore from uiState the same way.
  private replaceConditions(editorConditions: Array<IFilterCondition>): void {
    const old = this.ownConditions;
    const raw = this.ownRawExpression !== undefined;
    const preset = old === undefined && !raw ? this.parseActivePresetConditions() : null;
    const current = old !== undefined ? old : (preset || []);
    const conditions = normalizeFilterConditions(editorConditions, this.getFilterFields());
    const byField: HashTable<IFilterCondition> = {};
    conditions.forEach((c: IFilterCondition): void => { byField[c.field] = c; });
    const res: Array<IFilterCondition> = [];
    const take = (valueName: string): void => {
      if (!Object.prototype.hasOwnProperty.call(byField, valueName)) return;
      res.push(byField[valueName]);
      delete byField[valueName];
    };
    current.forEach((c: IFilterCondition): void => { take(c.field); });
    conditions.forEach((c: IFilterCondition): void => { take(c.field); });
    const isRawText = raw || (old === undefined && !!this.activePreset && preset === null);
    if (!isRawText && this.isSameConditionSet(res, current)) return;
    this.editConditions((): Array<IFilterCondition> => res);
  }
  // What a quick filter chip edits its field with - see getFilterFieldEditorKind. undefined for a name
  // that leads to no field.
  public getFieldEditorKind(name: string): FilterFieldEditorKind {
    const field = this.getFieldByName(name);
    return !!field ? getFilterFieldEditorKind(field) : undefined;
  }
  // The number a renderer shows next to the All Filters button: the conditions the filter is made
  // of now - the control's own, or the selected preset's. A preset or a text of the control's own
  // that does not decompose has none to count but still filters, and counts as one.
  public get activeConditionCount(): number {
    if (this.ownRawExpression !== undefined) return 1;
    const own = this.ownConditions;
    if (own !== undefined) return own.length;
    if (!this.activePreset) return 0;
    const preset = this.parseActivePresetConditions();
    return preset === null ? 1 : preset.length;
  }
  // A selected preset that has no conditions to show (an "or", a function, a comparison of two
  // fields) locks the quick filters while the presets are shown: the badges cannot show what it
  // filters by, and an edit in one would replace it with that edit alone - a click on a badge
  // unselects it instead (see FilterToolbars). A preset the badges do show locks nothing: an edit there
  // unselects it and keeps its conditions with the edit (editConditions). Nor does a text of the
  // control's own, or a preset while the presets are hidden - the respondent cannot see what would
  // lock the badges: the first edit in a badge starts from nothing.
  public get isLocked(): boolean {
    return this.showPresets && !!this.activePreset && this.ownConditions === undefined && this.ownRawExpression === undefined &&
      this.parseActivePresetConditions() === null;
  }
  // What the fields toolbar shows, read in one pass: each quick filter field's key (the name
  // getFieldKey() gives it), its title, the editor its popup opens and its condition's text. One
  // read of the field list and one parse of the preset for all of them - the toolbar asks on every
  // change of the control.
  public getQuickFilterFieldStates(): Array<IFilterFieldState> {
    const all = this.getFilterFields();
    const quick = this.collapseDuplicateValueNames(all.filter((field: IDynamicDataFilterField): boolean => field.showInQuickFilters !== false));
    const conditions = this.getCurrentConditions();
    const locale = this.getLocale();
    const res: Array<IFilterFieldState> = [];
    quick.forEach((field: IDynamicDataFilterField): void => {
      const key = this.findFieldKey(all, field);
      if (!key) return;
      const condition = (conditions || []).filter((c: IFilterCondition): boolean => c.field === field.valueName)[0];
      const kind = getFilterFieldEditorKind(field);
      res.push({
        key: key,
        title: getFilterFieldTitle(field),
        kind: kind,
        text: !!condition ? getFilterChipText(field, condition, locale, kind) : ""
      });
    });
    return res;
  }
  // The control's UI as standard action bars - see FilterToolbars. Made on first request: a control
  // nobody renders never builds them, and updateToolbars() leaves them unbuilt.
  private toolbarsValue: FilterToolbars;
  private get toolbars(): FilterToolbars {
    if (!this.toolbarsValue) {
      this.toolbarsValue = new FilterToolbars(this, (adaptive: boolean): ActionContainer => {
        const container = this.createActionContainer(adaptive);
        container.locOwner = this;
        return container;
      }, (): void => { this.updateToolbars(); });
    }
    return this.toolbarsValue;
  }
  public get chipsToolbar(): ActionContainer { return this.toolbars.chipsToolbar; }
  public get clearToolbar(): ActionContainer { return this.toolbars.clearToolbar; }
  public get searchToolbar(): ActionContainer { return this.toolbars.searchToolbar; }
  // The chips that open a popup - the presets' chip, the badges, Save as - in their order, kept by the
  // toolbars. A renderer draws their popups outside the chips row (cssClasses.popups): on a phone the
  // row scrolls sideways, and iOS Safari keeps a fixed popup inside such a row. Reading the
  // list builds the rows it is made from: a renderer that reads it before them gets it whole, and does
  // not see it change while it renders.
  public get popupChips(): Array<FilterChip> {
    if (!this.isDisposed) {
      this.chipsToolbar;
      this.clearToolbar;
    }
    return this.getPropertyValue("popupChips");
  }
  public set popupChips(val: Array<FilterChip>) {
    const list: Array<FilterChip> = this.getPropertyValue("popupChips");
    list.splice(0, list.length, ...val);
  }
  // What cuts the chips row to one row while it is collapsed: the renderer attaches the element
  // that holds the chips' action bar to it.
  public get chipsLayout(): FilterChipsLayout { return this.toolbars.layout; }
  // The quick search box is drawn the way a text question's input is, from the survey's own css.
  public get searchCss(): { root: string, control: string } {
    const css: any = !!this.survey ? this.survey.getCss() : undefined;
    const text: any = !!css && !!css.text ? css.text : {};
    return { root: text.root || "", control: text.control || "" };
  }
  public get searchRootCss(): string { return toCssClasses(this.searchCss.root, this.cssClasses.search); }
  // The search box's clear button, there while there is text to clear and the box is on.
  public get searchClearAction(): Action { return this.toolbars.searchClearAction; }
  public get showSearchClear(): boolean { return !!this.searchString && !this.isSearchDisabled; }
  // The quick search box is off in the designer and while the control is read-only. The Filters
  // dialog's box searches among the filters (FilterModal.filterText) and is never off: it changes
  // nothing.
  public get isSearchDisabled(): boolean { return this.isDesignMode || this.isControlReadOnly; }
  // The element the chips layout is attached to: expanded by Show More. A disposed control has
  // released its layout, and asking for it would build a new one.
  public get chipsCss(): string {
    const css = this.cssClasses;
    return toCssClasses(css.chips, !this.isDisposed && this.chipsLayout.isExpanded && css.chipsExpanded);
  }
  // The search box's accessible name: the placeholder is no label.
  public get searchLabel(): string { return this.getLocalizationString("filterSearchLabel"); }
  // The author's text for the search box; with none, the text that says what the search looks in.
  public get searchPlaceholder(): string {
    const locStr = this.locSearchPlaceholder;
    this.locStringAccessed(locStr);
    return locStr.calculatedText || this.getComputedSearchPlaceholder();
  }
  public set searchPlaceholder(val: string) { this.locSearchPlaceholder.text = val; }
  public get locSearchPlaceholder(): LocalizableString { return this.getOrCreateLocStr("searchPlaceholder"); }
  // Says what the search looks in: the titles of the fields it searches, in searchFields' order. With
  // no field to name it is the library's own "Type to search...".
  private getComputedSearchPlaceholder(): string {
    const titles = this.getSearchFields().map(getFilterFieldTitle);
    if (titles.length === 0) return this.getLocalizationString("filterStringPlaceholder");
    return this.getLocalizationFormatString("filterSearchPlaceholder", this.joinSearchTitles(titles));
  }
  // "A", "A or B", "A, B, or C": the dictionary joins the last title, so a locale puts its own
  // punctuation before "or". format() fills the placeholders in one pass: a "{1}" or "$&" in a title
  // stays as it is.
  private joinSearchTitles(titles: Array<string>): string {
    if (titles.length === 1) return titles[0];
    const last = titles[titles.length - 1];
    if (titles.length === 2) return this.getLocalizationFormatString("filterSearchFieldsOr", titles[0], last);
    return this.getLocalizationFormatString("filterSearchFieldsOrLast", titles.slice(0, -1).join(", "), last);
  }
  // The Filters dialog; with no dialog host (no survey rendered) this opens nothing.
  public showAllFilters(): void { this.toolbars.showAllFilters(); }
  // New Preset (isEdit false) or Edit Preset over the Filters dialog - see FilterToolbars.
  public showPresetDialog(modal: FilterModal, isEdit: boolean): void { this.toolbars.showPresetDialog(modal, isEdit); }
  // The field list one pass over the toolbars reads, once: the pass asks for it many times - the
  // badges, each parse of the active preset, the counts - and a bound target builds it anew each time.
  // Each field's operators and editor kind are read once in the pass too (runWithFilterFieldCache).
  // Kept for the pass only: nothing tells the control when a bound list changes.
  private passFields: Array<IDynamicDataFilterField>;
  // What the toolbars showed of the fields after their last pass - see getToolbarFieldsSignature.
  private toolbarFieldsSignature: string;
  // fields: the list the caller has just read, to be used for the pass.
  private updateToolbars(fields?: Array<IDynamicDataFilterField>): void {
    if (!this.toolbarsValue || this.isDisposed) return;
    if (!!this.passFields) {
      this.toolbarsValue.update();
      return;
    }
    this.passFields = fields || this.buildFilterFields();
    try {
      runWithFilterFieldCache((): void => {
        if (!!this.toolbarsValue) {
          this.toolbarsValue.update();
        }
      });
      this.toolbarFieldsSignature = this.getToolbarFieldsSignature(this.passFields);
    } finally {
      this.passFields = undefined;
    }
  }
  // A survey value change re-runs the control's conditions and its strings (runCondition,
  // locStrsChanged). Neither is a change of the control - its own changes update the toolbars when they
  // happen - but either is the only report it gets of a bound field list that changed with no
  // notification: a column added, a cell type changed, a title or a choice that shows a value, a new
  // locale. So the toolbars are updated when what they show of the fields is not what they showed
  // after their last pass, and only then: the chips' editor kinds and the active preset's parse read
  // each field's whole condition json.
  private updateToolbarsIfFieldsChanged(): void {
    if (!this.toolbarsValue || this.isDisposed || !!this.passFields) return;
    const fields = this.buildFilterFields();
    if (this.getToolbarFieldsSignature(fields) === this.toolbarFieldsSignature) return;
    this.updateToolbars(fields);
  }
  // What the toolbars read off each field that can change with no notification to the control, and the
  // locale every text they compose is in. The editor kind and the operators come from the template
  // question's type (its object stands for it), its value type and the author's operators; the badges'
  // texts from the title and the choices.
  private getToolbarFieldsSignature(fields: Array<IDynamicDataFilterField>): string {
    return JSON.stringify([this.getLocale(), fields.map((field: IDynamicDataFilterField): Array<any> => [
      field.name, field.valueName, field.fieldType, field.valueType, !!field.isTypeless, field.showInQuickFilters, field.operators,
      getFilterFieldTitle(field), !!field.templateQuestion ? field.templateQuestion.uniqueId : undefined,
      getFieldChoiceItems(field).map((item: any): Array<any> => [item.value, item.calculatedText])])]);
  }
  // The element the survey this control is in rendered into: the Filters dialog is
  // mounted there, inside that survey's theme and outside its <form>. undefined while that survey is
  // not rendered.
  public getSurveyRootElement(): HTMLElement { return !!this.survey ? this.survey.rootElement : undefined; }
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
  private parseActivePresetConditions(): Array<IFilterCondition> | null {
    return this.parsePresetConditions(this.activePreset);
  }
  private parsePresetConditions(preset: FilterPreset): Array<IFilterCondition> | null {
    if (!preset) return null;
    return this.decomposeExpression(preset.expression);
  }
  // A selected preset and the control's own conditions are never applied together: the first edit
  // over the selected preset decomposes it, applies the edit to its conditions and unselects it - the
  // presets' chip would otherwise show the preset over a filter that is no longer the preset. A preset
  // that does not decompose, and a text of the control's own, start from nothing. One edit is one
  // write into the target and one onUIStateChanged; an edit that leaves the conditions as they were
  // is no change and raises nothing. Compared through JSON.stringify and not
  // Helpers.isTwoValueEquals: that one is case-insensitive by default and takes 18 for "18" and true
  // for "true", and each of those pairs composes into a different expression on a text field - the
  // edit would be dropped as "no change".
  private editConditions(edit: (conditions: Array<IFilterCondition>) => Array<IFilterCondition>): void {
    if (!this.canEditConditions) return;
    const old = this.ownConditions;
    const raw = this.ownRawExpression !== undefined;
    const preset = old === undefined && !raw ? this.parseActivePresetConditions() : null;
    const start = old !== undefined ? old : (preset || []);
    const conditions = edit(start);
    if (!!this.activePreset && old === undefined) {
      // An edit that leaves the preset's own conditions as they are is no edit: the preset stays
      // selected. A preset that does not decompose has none to compare with, so any edit unselects it.
      if (preset !== null && this.isSameConditionSet(conditions, preset)) return;
      this.runBatch((): void => {
        this.setSelectedPreset("");
        this.setOwnFilter(conditions, undefined);
      }, true);
      return;
    }
    if (!raw && JSON.stringify(conditions) === JSON.stringify(old || [])) return;
    this.runBatch((): void => {
      this.setOwnFilter(conditions, undefined);
      this.raiseUIStateChanged();
    }, true);
  }
  // Not setPropertyValue: once this class owns arrays (fields, presets), Base.setPropertyValue treats
  // any array value as one of them - it copies the new array INTO the old one instead of storing
  // it, and turns "undefined over an empty array" into an isReset mark instead of undefined. Both
  // would break this slot: the array the previous edit left behind would change under whoever
  // holds it, and [] ("conditions cleared") could never go back to undefined ("no edits").
  private setOwnConditions(val: Array<IFilterCondition>): void {
    // Whatever decides the conditions now - an edit, another preset, a save, a clear - supersedes
    // restored edits still waiting for their target: they were edits over the state this replaces.
    this.pendingExpression = undefined;
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
  // are a set, not a sequence. So is the value of a multi-value operator (anyof, noneof, allof):
  // ['fr', 'de'] and ['de', 'fr'] filter the same, and a preset authored in another order than the
  // editor gives it back in (the field's choice order) must not read as edited once the respondent
  // restores the selection. Its elements are still compared by exact JSON.
  private isSameConditionSet(a: Array<IFilterCondition>, b: Array<IFilterCondition>): boolean {
    if (a.length !== b.length) return false;
    const toKey = (c: IFilterCondition): string => {
      if (!multiValueOperators[c.operator] || !Array.isArray(c.value)) return JSON.stringify(c);
      const value = c.value.map((v: any): string => JSON.stringify(v)).sort();
      return JSON.stringify({ field: c.field, operator: c.operator, value: value });
    };
    const as = a.map(toKey).sort();
    const bs = b.map(toKey).sort();
    for (let i = 0; i < as.length; i++) {
      if (as[i] !== bs[i]) return false;
    }
    return true;
  }
  // The titles the respondent gave authored presets (updatePreset), by name. What they filter by is
  // their expression itself: a preset's text is the only record of what it filters by.
  private savedPresetTitles: HashTable<string> = {};
  // What an authored preset was in the JSON before the respondent first changed it, by name. A preset
  // with an entry here is modified (isPresetModified); resetPreset() puts it back and drops the entry,
  // deleting it moves the entry into deletedPresetsValue. getUIState() stores the expression of one
  // whose text is not the JSON's any more, and toJSON() stores the entry instead of the preset. A
  // preset the host later removes just leaves a stale, harmless entry here: getUIState() skips a name
  // that no longer resolves, and toJSON() goes by the presets there are. A presets array the host
  // assigns anew drops the entries of the presets it replaced - see dropReplacedSavedPresets() - and
  // another preset the host adds under the name takes none of it over (onPresetAdded): an entry is
  // of the preset it was made for.
  private originalPresets: HashTable<FilterOriginalPreset> = {};
  // The respondent's own presets (addPreset), in the order they were added. They are in presets as
  // well (the live list); this tells them from the authored ones, which uiState keeps apart.
  private userPresetsValue: Array<FilterPreset> = [];
  // The authored presets the respondent deleted, in the order they were deleted: gone from presets,
  // kept here for uiState and toJSON(), and so that the name stays taken.
  private deletedPresetsValue: Array<FilterDeletedPreset> = [];
  // Before the preset leaves presets: its place is read off the list it is still in.
  private rememberDeletedPreset(preset: FilterPreset): void {
    const name = preset.name;
    this.deletedPresetsValue.push({ name: name, preset: preset, index: this.getAuthoredPresetList().indexOf(preset), original: this.originalPresets[name] });
    delete this.originalPresets[name];
    delete this.savedPresetTitles[name];
  }
  // The authored presets in the order the author made them: those in presets that are not the
  // respondent's own, with the deleted ones back in their places. Each was deleted at its index in this
  // very list, so putting them back by ascending index gives the list they were taken from. A list the
  // host changed since (push, splice) may move one by as many places; a new array drops them anyway.
  private getAuthoredPresetList(): Array<FilterPreset> {
    const res = this.presets.filter((preset: FilterPreset): boolean => !this.isUserPreset(preset));
    const deleted = [].concat(this.deletedPresetsValue).sort((a: FilterDeletedPreset, b: FilterDeletedPreset): number => a.index - b.index);
    deleted.forEach((item: FilterDeletedPreset): void => {
      res.splice(Math.min(Math.max(item.index, 0), res.length), 0, item.preset);
    });
    return res;
  }
  // What toJSON() stores of presets: the authored presets as the JSON made them (getAuthoredPresetList),
  // so a survey saved while the respondent works keeps the author's JSON - none of the respondent's own,
  // and a preset they changed as it was. The application's own changes of the list (an array assigned,
  // push, splice, a property set) are the author's and are stored. In the designer nothing is tracked
  // and this is presets itself.
  public getSerializablePresetsValue(): Array<FilterPreset> {
    return this.getAuthoredPresetList().map((preset: FilterPreset): FilterPreset => {
      const deleted = this.deletedPresetsValue.filter((item: FilterDeletedPreset): boolean => item.preset === preset)[0];
      const original = !!deleted ? deleted.original : this.originalPresets[preset.name];
      return !!original ? this.createSerializablePreset(preset, original) : preset;
    });
  }
  // A copy of the preset with what the JSON made it put back: the other properties - one an application
  // added to presets too - are the preset's own. Nothing holds the copy, so it needs no dispose.
  private createSerializablePreset(preset: FilterPreset, original: FilterOriginalPreset): FilterPreset {
    const res = <FilterPreset>Serializer.createClass(preset.getType());
    new JsonObject().toObject(preset.toJSON(), res);
    this.applyOriginal(res, original);
    return res;
  }
  // A preset of the respondent's own, not in presets yet: the caller adds it. A title that is no
  // string is none; the permissions that are not given are the defaults.
  private createUserPreset(name: string, title: string, expression: string, permissions: Partial<IFilterPresetPermissions>): FilterPreset {
    const preset = new FilterPreset(name);
    this.setPresetText(preset.locTitle, typeof title === "string" ? title.trim() : "");
    preset.expression = expression;
    assignFilterPresetPermissions(preset, permissions);
    this.userPresetsValue.push(preset);
    return preset;
  }
  // Free among every preset, the deleted ones too: a name is what selectedPreset and uiState hold.
  private getNewPresetName(): string {
    let n = this.userPresetsValue.length + 1;
    while(this.isPresetNameUsed("userPreset" + n)) n++;
    return "userPreset" + n;
  }
  // A name is a key, not a title: matched exactly, with no trimming or case folding.
  private isPresetNameUsed(name: string): boolean {
    return !!this.getPresetByName(name) || this.deletedPresetsValue.some((item: FilterDeletedPreset): boolean => item.name === name);
  }
  // A title the respondent typed is the text in every locale: set as the default text,
  // with no translations left that would show the author's text in another locale.
  private setPresetText(locStr: LocalizableString, text: any): void {
    locStr.setJson(!!text && typeof text === "object" ? Object.assign({}, text) : (text || null), true);
    locStr.strChanged();
  }
  // What the author's locks are read from: the JSON's permissions, whatever a restore or
  // updatePreset() made of the preset's own since.
  private getAuthoredPreset(preset: FilterPreset): IFilterPresetPermissions {
    return this.originalPresets[preset.name] || preset;
  }
  private rememberOriginal(preset: FilterPreset): void {
    if (!this.originalPresets[preset.name]) {
      const original = <FilterOriginalPreset>{ preset: preset, expression: preset.expression, title: preset.locTitle.getJson() };
      copyFilterPresetPermissions(original, preset);
      this.originalPresets[preset.name] = original;
    }
  }
  // Puts into a preset what the JSON made one: the title, the text and the permissions - a permission
  // the JSON did not set back to undefined.
  private applyOriginal(preset: FilterPreset, original: FilterOriginalPreset): void {
    this.setPresetText(preset.locTitle, original.title);
    preset.expression = original.expression;
    copyFilterPresetPermissions(preset, original);
  }
  // The preset as the JSON made it, as a FilterPreset of its own, for comparing and reading its title
  // in the current locale. The caller disposes it.
  private createOriginalPreset(name: string): FilterPreset {
    const original = this.originalPresets[name];
    const preset = new FilterPreset(name);
    preset.presetOwner = this;
    this.applyOriginal(preset, original);
    return preset;
  }
  private isSameAsOriginal(preset: FilterPreset): boolean {
    const original = this.createOriginalPreset(preset.name);
    const a = this.parsePresetConditions(original);
    const b = this.parsePresetConditions(preset);
    const isSameConditions = a === null || b === null
      ? (original.expression || "").trim() === (preset.expression || "").trim() : this.isSameConditionSet(a, b);
    const res = isSameConditions && original.title === preset.title &&
      filterPresetPermissions.every((key: keyof IFilterPresetPermissions): boolean => original[key] === preset[key]);
    original.dispose();
    return res;
  }
  private restoreOriginal(preset: FilterPreset): void {
    const original = this.originalPresets[preset.name];
    delete this.originalPresets[preset.name];
    delete this.savedPresetTitles[preset.name];
    if (!original) return;
    this.applyOriginal(preset, original);
  }
  // A text as the conditions the fields hold it with (parseFilterExpression), or null when it is not
  // that kind of text - and when the fields would lose a row of it (no value where the operator needs
  // one - hasFilterConditionValue): written the way the fields write it, such a text would filter by
  // less than it says, so it is a text of its own.
  private decomposeExpression(text: string): Array<IFilterCondition> | null {
    const fields = this.getFilterFields();
    const conditions = parseFilterExpression((text || "").trim(), fields);
    if (conditions === null) return null;
    const byValueName = getFieldsByValueName(fields);
    return conditions.every((c: IFilterCondition): boolean => hasFilterConditionValue(byValueName[c.field], c)) ? conditions : null;
  }
  // The text a preset gets for an edit: conditions, normalized and composed (undefined when none of
  // them is left), or a text - one that decomposes (decomposeExpression) is normalized and composed
  // the same way, so it reads as the fields would write it; any other is kept as typed, trimmed. A
  // text that is empty or does not parse is undefined: no preset filters by nothing or by a broken text.
  private composePresetExpression(conditions: Array<IFilterCondition>, expression?: string): string {
    const fields = this.getFilterFields();
    let list = conditions || [];
    if (expression !== undefined) {
      const text = (expression || "").trim();
      if (!canParseFilterExpression(text)) return undefined;
      const parsed = this.decomposeExpression(text);
      if (parsed === null) return text;
      list = parsed;
    }
    const normalized = normalizeFilterConditions(list, fields);
    return normalized.length > 0 ? conditionsToExpression(normalized, fields) : undefined;
  }
  // Whether two texts filter the same: as conditions where both decompose (their order is no
  // change), as trimmed text otherwise.
  private isSameExpression(a: string, b: string): boolean {
    const fields = this.getFilterFields();
    const ca = this.decomposeExpression(a);
    const cb = this.decomposeExpression(b);
    if (ca === null || cb === null) return (a || "").trim() === (b || "").trim();
    return this.isSameConditionSet(normalizeFilterConditions(ca, fields), normalizeFilterConditions(cb, fields));
  }
  // A saved preset's text as it is restored: as the fields write it where it decomposes, as it was
  // saved otherwise - also a text that names a record key no field has, or a field the author has
  // removed since: a restore does not rewrite what was saved (the user's call; it was the other way
  // round before the release API). undefined when it does not parse.
  private restorePresetExpression(text: string): string {
    const fields = this.getFilterFields();
    const decomposed = this.decomposeExpression(text);
    if (decomposed !== null) return conditionsToExpression(normalizeFilterConditions(decomposed, fields), fields);
    return canParseFilterExpression(text) ? text.trim() : undefined;
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
    // The target is resolved before the default is applied, so the expression the default composes
    // reaches it in one write and raises one event instead of two.
    this.updateFilterTarget();
    this.applyDefaultPreset();
  }
  // Every question is re-run whenever a survey value changes, which is also when a question the
  // target names may have appeared or gone.
  public runCondition(properties: HashTable<any>): void {
    super.runCondition(properties);
    this.updateFilterTarget();
  }
  protected onSetData(): void {
    super.onSetData();
    this.updateFilterTarget();
  }
  // A removed page takes its questions out of the survey with setSurveyImpl(null), which, unlike
  // a non-null one, does not reach onSetData().
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean): void {
    super.setSurveyImpl(value, isLight);
    if (!value) {
      this.detachFromTarget();
    }
  }
  // removeElement() only resets the parent: data and survey stay, and runCondition() no longer
  // reaches the control, so this is the one report of the removal it gets. Taking the control out
  // detaches it without an event, the way dispose() does; putting it back re-resolves the target.
  // Known gap: a control inside a panel that is removed, or inside a Dynamic Panel item that is
  // removed, is not reported either - its own parent does not change - and keeps its filter on a
  // target outside that panel until it is disposed.
  protected onParentChanged(): void {
    super.onParentChanged();
    if (!this.parent) {
      this.detachFromTarget();
    } else {
      this.updateFilterTarget();
    }
  }
  // The toolbars go first: their chips borrow the presets' titles. Base.dispose reaches neither array,
  // so the handlers come off here, without recomposing anything. The authored presets and fields are
  // the author's JSON, which an application may still hold: they are let go of, not disposed. The
  // respondent's own presets are the control's, and go with it.
  public dispose(): void {
    this.detachFromTarget();
    if (!!this.toolbarsValue) {
      this.toolbarsValue.dispose();
      this.toolbarsValue = undefined;
    }
    this.presets.forEach((preset: FilterPreset): void => { this.unhookPreset(preset); });
    this.fields.forEach((field: FilterField): void => { this.unhookField(field); });
    this.userPresetsValue.forEach((preset: FilterPreset): void => { preset.dispose(); });
    this.userPresetsValue = [];
    super.dispose();
  }
  // Re-resolves the target and moves the filter with it: the question that is being left is cleared
  // first, so no ghost filter survives a re-pointed target or a target question that went away.
  private updateFilterTarget(): void {
    if (this.isDesignMode) return;
    const target = this.filterTarget;
    if (target === this.attachedTarget) {
      this.updateFilterExpression();
      this.updateToolbarsIfFieldsChanged();
      return;
    }
    this.detachFromTarget();
    const oldExpression = this.combinedExpression;
    if (!!target) {
      this.restorePendingState();
      this.decomposeProvisionalFilter();
    }
    // The expression is recomposed against the new target BEFORE anything is written: the search
    // fragments quote the fields of the target they were built from, so the text composed for the
    // previous one names fields the new one may not have. Recomposing it silently - the control is
    // attached to nothing for the length of this call - is what makes the move one write and one
    // event instead of a wrong pair of them.
    this.updateFilterExpression(true);
    this.attachedTarget = target;
    // Attaching is not a change of the filter by itself: with nothing composed, before or now, there
    // is nothing to write and nothing to report. A move that empties the expression is one, though:
    // a host that mirrors the filter would otherwise keep querying by the text composed for the old
    // target.
    if (!!this.combinedExpression || this.combinedExpression !== oldExpression) {
      this.applyToTarget();
    }
    // A new target brings its own fields.
    this.updateToolbars();
  }
  private detachFromTarget(): void {
    const target = this.attachedTarget;
    this.attachedTarget = undefined;
    // A disposed question has no list and no controller left to write into.
    if (!!target && target.isDisposed !== true) {
      target.setControlFilter(this.controlFilterKey, "");
    }
  }
  // A control with no target filters nothing itself: the application reads combinedExpression.
  private applyToTarget(): void {
    const target = this.attachedTarget;
    if (!!target) {
      target.setControlFilter(this.controlFilterKey, this.combinedExpression);
    }
  }
  // A bound control whose target is not there (yet) has no fields to check restored conditions
  // against: getFilterFields() falls back to the standalone list, which a bound control rarely has.
  private get isFieldListReady(): boolean { return !this.targetQuestion || !!this.filterTarget; }
  protected getUIState(): IElementUIState {
    let res = super.getUIState();
    const state: IFilterElementUIState = {};
    let isEmpty = true;
    // The baseline is the default the control could actually apply, not the raw defaultPreset:
    // applyDefaultPreset() refuses a defaultPreset that names no preset, so selectedPreset stays "" and
    // comparing against the raw name would make an untouched control store selectedPreset: "". That
    // would both produce a spurious save and, once the author fixed or added the preset, keep the now
    // valid default from ever applying to a returning respondent.
    const appliedDefault = !!this.getPresetByName(this.defaultPreset) ? this.defaultPreset : "";
    if (this.selectedPreset !== appliedDefault) {
      state.selectedPreset = this.selectedPreset;
      isEmpty = false;
    }
    if (!!this.searchString) { state.searchString = this.searchString; isEmpty = false; }
    if (!Helpers.isTwoValueEquals(this.searchFields, this.authoredSearchFields)) {
      state.searchFields = [].concat(this.searchFields || []);
      isEmpty = false;
    }
    const expression = this.getUIStateExpression();
    if (expression !== undefined) { state.expression = expression; isEmpty = false; }
    const presets = this.getUIStatePresets();
    if (!!presets) { state.presets = presets; isEmpty = false; }
    const userPresets = this.getUIStateUserPresets();
    if (!!userPresets) { state.userPresets = userPresets; isEmpty = false; }
    if (this.deletedPresetsValue.length > 0) {
      state.deletedPresets = this.deletedPresetsValue.map((item: FilterDeletedPreset): string => item.name);
      isEmpty = false;
    }
    if (isEmpty) return res;
    res = res || {};
    res.filter = state;
    return res;
  }
  // The control's own filter as text, when it has one: a text the fields cannot show as it is,
  // conditions as the expression they compose. No filter of its own is not stored - the filter is
  // the selected preset's or none. A filter restored before the target attached was never checked;
  // it is passed on as it came, or saving the state again before the target appears would lose it.
  private getUIStateExpression(): string {
    if (this.pendingExpression !== undefined) return this.pendingExpression;
    const conditions = this.ownConditions;
    if (this.ownRawExpression !== undefined) return this.ownRawExpression;
    if (conditions === undefined || conditions.length === 0) return undefined;
    return conditionsToExpression(conditions, this.getFilterFields());
  }
  // Only presets that still exist: restorePresets() would ignore any other.
  private getUIStatePresets(): FilterSavedPresets {
    let res: FilterSavedPresets = undefined;
    const add = (name: string, preset: IFilterSavedPresetState): void => {
      if (!this.canRestoreSavedPreset(name)) return;
      const entry = this.toSavedPresetEntry(preset);
      if (!entry) return;
      res = res || {};
      res[name] = entry;
    };
    const pending = this.pendingPresets || {};
    Object.keys(pending).forEach((name: string): void => { add(name, pending[name]); });
    // A preset changed in this session wins over one still waiting for its target: it is newer. Its
    // text goes only when it is not the JSON's: a preset given a title alone keeps the author's text.
    Object.keys(this.originalPresets).forEach((name: string): void => {
      const preset = this.getPresetByName(name);
      const entry: IFilterSavedPresetState = { title: this.savedPresetTitles[name] };
      const original = this.originalPresets[name];
      if (!!preset && (preset.expression || "").trim() !== (original.expression || "").trim()) {
        entry.expression = preset.expression || "";
      }
      filterPresetPermissions.forEach((key: keyof IFilterPresetPermissions): void => {
        if (!!preset && preset[key] !== original[key]) entry[key] = preset[key];
      });
      add(name, entry);
    });
    return res;
  }
  // The respondent's presets in their order; those restored before the target attached are passed on
  // as they came, as conditions are.
  private getUIStateUserPresets(): Array<IFilterUserPresetState> {
    if (!!this.pendingUserPresets) return this.copyUserPresets(this.pendingUserPresets);
    if (this.userPresetsValue.length === 0) return undefined;
    return this.userPresetsValue.map((preset: FilterPreset): IFilterUserPresetState => {
      const title = preset.locTitle.getJson();
      const res: IFilterUserPresetState = { name: preset.name, title: typeof title === "string" ? title : "", expression: preset.expression || "" };
      assignFilterPresetPermissions(res, preset);
      return res;
    });
  }
  // The order is load-bearing. Deleted, saved and the respondent's own presets first: selectedPreset
  // may name one of them, and its expression has to be the saved one before it is composed - or the
  // new name of one of the respondent's that had to be renamed. selectedPreset before conditions: its
  // setter resets the edits, which would otherwise wipe the restored ones. The search last - it is
  // independent of the rest. The whole restore is one batch: one write into the target
  // (none if the expression did not change) and no onUIStateChanged - restoring is
  // not a new change, and a host that saves on every change would otherwise save right after every
  // restore.
  protected setUIState(state: IElementUIState): void {
    super.setUIState(state);
    const filter = !!state ? state.filter : undefined;
    if (!filter) return;
    this.runBatch((): void => {
      const isReady = this.isFieldListReady;
      this.restoreDeletedPresets(filter.deletedPresets);
      const presets = !!filter.presets && typeof filter.presets === "object" ? filter.presets : undefined;
      // A newer restore replaces whatever an earlier one left waiting for the target.
      this.pendingPresets = isReady ? undefined : this.copySavedPresets(presets);
      if (isReady) {
        this.restorePresets(presets);
      }
      let selectedName = filter.selectedPreset;
      if (Array.isArray(filter.userPresets)) {
        this.pendingUserPresets = isReady ? undefined : this.copyUserPresets(filter.userPresets);
        if (isReady) {
          const renamed = this.restoreUserPresets(filter.userPresets);
          if (Object.prototype.hasOwnProperty.call(renamed, selectedName)) {
            selectedName = renamed[selectedName];
          }
        }
      }
      // A key that is not there was not changed by the respondent, EXCEPT selectedPreset, whose ""
      // means "switched off" and must survive.
      if (selectedName !== undefined) {
        this.setSelectedPreset(selectedName);
      }
      const expression = typeof filter.expression === "string" ? filter.expression : undefined;
      if (isReady) {
        this.pendingExpression = undefined;
        if (expression !== undefined) {
          this.restoreExpression(expression);
        }
      } else {
        this.pendingExpression = expression;
      }
      if (filter.searchString !== undefined) {
        this.searchString = filter.searchString;
      }
      if (Array.isArray(filter.searchFields)) {
        this.searchFields = [].concat(filter.searchFields);
      }
      this.dropUnresolvedSelection();
    });
    // Presets the respondent added or deleted change the chips with no property of the control
    // changing - the expression may read the same - so nothing else would redraw the row. A restore
    // still waiting for the bound target is redrawn as the target attaches (updateFilterTarget).
    this.updateToolbars();
  }
  // A saved change of a preset comes back as it was saved (restorePresetExpression); a name that no
  // longer resolves to a preset is ignored - the author removed or renamed it - and so is a text that
  // does not parse. A preset the author has locked (allowEdit false in the JSON - a preset with no
  // allowEdit follows the control and is not locked) keeps the JSON: the
  // author's lock wins over a change saved before it (the user's call). The control's permission
  // flags are not asked - they are the UI's, and a change made through the API is restored.
  private restorePresets(presets: FilterSavedPresets): void {
    if (!presets) return;
    Object.keys(presets).forEach((name: string): void => {
      const entry = presets[name];
      if (!this.canRestoreSavedPreset(name) || !entry) return;
      const preset = this.getPresetByName(name);
      if (this.getAuthoredPreset(preset).allowEdit === false) return;
      const title = typeof entry.title === "string" ? entry.title.trim() : "";
      if (!!title) {
        this.rememberOriginal(preset);
        this.setPresetText(preset.locTitle, title);
        this.savedPresetTitles[name] = title;
      }
      if (filterPresetPermissions.some((key: keyof IFilterPresetPermissions): boolean => typeof entry[key] === "boolean")) {
        this.rememberOriginal(preset);
        assignFilterPresetPermissions(preset, entry);
      }
      if (typeof entry.expression !== "string") return;
      const expression = this.restorePresetExpression(entry.expression);
      if (expression === undefined) return;
      this.rememberOriginal(preset);
      preset.expression = expression;
    });
  }
  // Removing a preset needs no field to check it against, so deletions are restored at once, whoever
  // made them - the respondent in the UI or the application through deletePreset() - except of a
  // preset the author keeps from deletion (allowDelete false in the JSON): the author's lock wins (the
  // user's call). A deleted preset that is selected is unselected.
  private restoreDeletedPresets(names: Array<string>): void {
    if (!Array.isArray(names)) return;
    names.forEach((name: string): void => {
      const preset = typeof name === "string" ? this.getPresetByName(name) : undefined;
      if (!preset || this.isUserPreset(preset) || this.getAuthoredPreset(preset).allowDelete === false) return;
      if (this.selectedPreset === name) {
        this.setSelectedPreset("");
      }
      this.rememberDeletedPreset(preset);
      this.removeFromPresets(preset);
    });
  }
  // A restore brings back the respondent's whole list, so it replaces the presets of theirs the
  // control has. Each one's text is checked against the fields as a saved preset's is
  // (restorePresetExpression) and the preset dropped when nothing is left of it; one whose name an
  // authored preset has taken since gets a new name.
  // Returns the names that changed, old to new. The replaced presets are disposed: what still shows one
  // (a chip until the next update, an open dialog's tab) reads its title and name, which stay, and
  // finds the preset itself again by name.
  private restoreUserPresets(list: Array<IFilterUserPresetState>): HashTable<string> {
    const renamed: HashTable<string> = {};
    this.userPresetsValue.forEach((preset: FilterPreset): void => {
      this.removeFromPresets(preset);
      preset.dispose();
    });
    this.userPresetsValue = [];
    list.forEach((entry: IFilterUserPresetState): void => {
      if (!entry || typeof entry !== "object" || typeof entry.name !== "string" || !entry.name || typeof entry.expression !== "string") return;
      const expression = this.restorePresetExpression(entry.expression);
      if (!expression) return;
      const name = this.isPresetNameUsed(entry.name) ? this.getNewPresetName() : entry.name;
      if (name !== entry.name) {
        renamed[entry.name] = name;
      }
      this.presets.push(this.createUserPreset(name, entry.title, expression, entry));
    });
    return renamed;
  }
  private canRestoreSavedPreset(name: string): boolean {
    const preset = this.getPresetByName(name);
    return !!preset;
  }
  // Pending saved presets are held for later: the caller's state object must not be able to change
  // them in the meantime.
  private copySavedPresets(presets: FilterSavedPresets): FilterSavedPresets {
    if (!presets) return undefined;
    const res: FilterSavedPresets = {};
    Object.keys(presets).forEach((name: string): void => {
      const copy = this.toSavedPresetEntry(presets[name]);
      if (!!copy) {
        res[name] = copy;
      }
    });
    return res;
  }
  // A saved preset's entry, copied: a string expression and a string title. undefined when nothing is
  // left of it.
  private toSavedPresetEntry(entry: IFilterSavedPresetState): IFilterSavedPresetState {
    if (!entry || typeof entry !== "object") return undefined;
    const res: IFilterSavedPresetState = {};
    if (typeof entry.expression === "string") {
      res.expression = entry.expression;
    }
    if (typeof entry.title === "string") {
      res.title = entry.title;
    }
    assignFilterPresetPermissions(res, entry);
    return Object.keys(res).length > 0 ? res : undefined;
  }
  private copyUserPresets(list: Array<IFilterUserPresetState>): Array<IFilterUserPresetState> {
    return list.filter((entry: IFilterUserPresetState): boolean => !!entry && typeof entry === "object" && typeof entry.expression === "string")
      .map((entry: IFilterUserPresetState): IFilterUserPresetState => Object.assign({}, entry));
  }
  // The control's own filter, saved as text, comes back as applyFilter() takes a text: conditions
  // where the fields show it, as it was saved otherwise - also a text that names a record key no field
  // has, or a field the author has removed since (the user's call: a restore does not rewrite what was
  // saved). "" is "no filter"; a text that does not parse is ignored. The own filter is never over a
  // preset: a state that names both keeps the filter. Not in the designer: nothing there could have
  // saved it.
  private restoreExpression(text: string): void {
    if (!this.canEditConditions) return;
    const raw = (text || "").trim();
    if (!!raw && !canParseFilterExpression(raw)) return;
    if (!!this.selectedPreset) {
      this.setSelectedPreset("");
    }
    this.setOwnFilterText(raw);
  }
  // A text applyFilter() took while the target was not there was kept as a text: the fields to tell it
  // by were not known. With the target attaching they are, and it becomes what applyFilter() would have
  // made of it - conditions the chips show, or the text it is - within the attach's one write.
  private decomposeProvisionalFilter(): void {
    if (!this.isOwnRawProvisional) return;
    this.isOwnRawProvisional = false;
    const conditions = this.decomposeExpression(this.ownRawExpression);
    if (conditions === null) return;
    this.holdChanges((): void => {
      this.setOwnFilter(normalizeFilterConditions(conditions, this.getFilterFields()), undefined);
    });
  }
  // Called by updateFilterTarget() for the target that is being attached, before it recomposes the
  // expression and writes it: the restored part lands in that same single write. Held so neither
  // the preset expressions it rebuilds nor the conditions it sets write or raise on their own.
  private restorePendingState(): void {
    const presets = this.pendingPresets;
    const expression = this.pendingExpression;
    const userPresets = this.pendingUserPresets;
    if (!presets && expression === undefined && !userPresets) return;
    this.pendingPresets = undefined;
    this.pendingExpression = undefined;
    this.pendingUserPresets = undefined;
    this.holdChanges((): void => {
      this.restorePresets(presets);
      if (!!userPresets) {
        const renamed = this.restoreUserPresets(userPresets);
        // selectedPreset was restored already: it follows a preset that had to be renamed.
        if (Object.prototype.hasOwnProperty.call(renamed, this.selectedPreset)) {
          this.setPropertyValue("selectedPreset", renamed[this.selectedPreset]);
        }
      }
      if (expression !== undefined) {
        this.restoreExpression(expression);
      }
      this.dropUnresolvedSelection();
    });
  }
  // Several changes that are one change for whoever listens: while fn runs nothing is written into
  // the target and onUIStateChanged is only noted. After it, the
  // expression is composed once and, if it differs from what it was before fn, written once and
  // reported once; with raiseUIState, onUIStateChanged is raised once if anything in fn would have
  // raised it. A restore passes no raiseUIState; an editor that applies several edits as one does.
  // A nested call runs inside the outer batch and leaves the single write to it.
  private runBatch(fn: () => void, raiseUIState?: boolean): void {
    if (this.batchLevel > 0) {
      fn();
      return;
    }
    const oldExpression = this.combinedExpression;
    this.uiStateChangedInBatch = false;
    // A throw in fn propagates from here: holdChanges() has already released the hold, so the
    // control is not left silent for the rest of the session.
    this.holdChanges(fn);
    const isUIStateChanged = this.uiStateChangedInBatch;
    this.uiStateChangedInBatch = false;
    // Composed silently: a change inside fn may have composed an intermediate text already (a preset
    // turned off), and updateFilterExpression() would write that difference into the target on its
    // own, before the write below - two writes and two events for one batch.
    this.updateFilterExpression(true);
    if (this.combinedExpression !== oldExpression) {
      this.applyToTarget();
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
  // The designer has no respondent, so nothing done to the control there is respondent state.
  private raiseUIStateChanged(): void {
    if (this.isLoadingFromJson || this.isDesignMode || !this.survey) return;
    if (this.batchLevel > 0) {
      this.uiStateChangedInBatch = true;
      return;
    }
    this.survey.filterStateChanged(this);
  }
  public locStrsChanged(changes?: ChangedKeys): void {
    super.locStrsChanged(changes);
    // Neither collection is an ItemValue array, so Base.locStrsChanged does not reach into them.
    this.fields.forEach((field: FilterField): void => { field.locStrsChanged(changes); });
    this.presets.forEach((preset: FilterPreset): void => { preset.locStrsChanged(changes); });

    // The survey calls this on every value change too, for the texts that show a value: the badges'
    // texts are composed again only when what they are composed of changed.
    if (!!this.toolbarsValue && !this.isDisposed) {
      this.toolbarsValue.locStrsChanged(changes);
      this.updateToolbarsIfFieldsChanged();
    }
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    // "targetQuestion" goes through updateFilterTarget() and not through updateFilterExpression(): the
    // fields and the question the expression is written into both come from it, so re-pointing it
    // has to move the filter and not only recompose the text.
    if (name === "targetQuestion") {
      this.updateFilterTarget();
      return;
    }
    // "presets" and "fields" are here because assigning a whole array goes through Base.setArray,
    // which empties the destination with the prototype splice: the wrapped onRemove never runs,
    // and an empty new array pushes nothing either, so the property change is the only report of
    // it. Without them the control would keep quoting a deleted preset or searching a deleted field.
    // Only an assignment passes two different arrays: push/splice report the array they changed as
    // both values.
    if (name === "presets" && oldValue !== newValue) {
      this.dropReplacedSavedPresets(oldValue, newValue);
    }
    // The host changed the list (the control's own changes run in a batch and keep the selection
    // right themselves).
    if (name === "presets" && this.batchLevel === 0) {
      this.dropUnresolvedSelection();
    }
    if (name === "showPresets" || name === "presets" || name === "fields" ||
      name === "searchString" || name === "searchFields" || name === "showSearchBar") {
      this.updateFilterExpression();
    }
    this.updateToolbars();
  }
  // A host that assigns a new presets array replaces the presets the respondent saved into: a new
  // preset that merely has the same name was never saved, and getUIState() - which goes by name -
  // would otherwise store the old one's expression for it, and a restore would rewrite it with it.
  // Restored saved presets still waiting for a bound target go the same way, and so do the titles
  // given to the replaced presets, what they were before and their deletion. A preset that is still
  // there as the same object (a reordered array) keeps what was saved into it.
  private dropReplacedSavedPresets(oldPresets: Array<FilterPreset>, newPresets: Array<FilterPreset>): void {
    const olds = Array.isArray(oldPresets) ? oldPresets : [];
    const news = Array.isArray(newPresets) ? newPresets : [];
    const isKept = (name: string): boolean => olds.some((preset: FilterPreset): boolean =>
      !!preset && preset.name === name && news.indexOf(preset) > -1);
    [this.savedPresetTitles, this.originalPresets, this.pendingPresets || {}].forEach((saved: HashTable<any>): void => {
      Object.keys(saved).forEach((name: string): void => {
        if (!isKept(name)) {
          this.forgetSavedPreset(name);
        }
      });
    });
    this.deletedPresetsValue = [];
    this.userPresetsValue = this.userPresetsValue.filter((preset: FilterPreset): boolean => news.indexOf(preset) > -1);
  }
  // Whatever the respondent saved into the preset of this name: the title given to it, what it was
  // before and a restored change still waiting for the bound target.
  private forgetSavedPreset(name: string): void {
    delete this.savedPresetTitles[name];
    delete this.originalPresets[name];
    if (!!this.pendingPresets) {
      delete this.pendingPresets[name];
    }
  }
  // selectedPreset is a preset's name or "": one no preset answers to any more - the host took the
  // preset away (a new presets array, a splice), a restored name the presets do not have - is no
  // selection, as deletePreset() leaves none. Quietly: what the host did is no respondent change. Not
  // while a restore waits for the target: the name may be a preset of the respondent's it brings.
  private dropUnresolvedSelection(): void {
    if (!this.selectedPreset || !!this.activePreset || !!this.pendingUserPresets) return;
    this.setPropertyValue("selectedPreset", "");
  }
  private removeFromPresets(preset: FilterPreset): void {
    const index = this.presets.indexOf(preset);
    if (index > -1) {
      this.presets.splice(index, 1);
    }
  }
  private applyDefaultPreset(): void {
    if (!!this.selectedPreset) return;
    // A defaultPreset that names nothing leaves the control unfiltered, which is what "no selected preset"
    // means anyway: an author typo must not throw and must not filter records away.
    if (!!this.defaultPreset && !!this.getPresetByName(this.defaultPreset)) {
      // Written through setPropertyValue and not through the setter: applying the authored default
      // is not an end-user change and must not raise onUIStateChanged. The isLoadingFromJson guard
      // in raiseUIStateChanged() is no help here - SurveyElement reads that flag off the survey
      // (survey-element.ts:698) and SurveyModel.endLoadingFromJson() clears it before it calls
      // doElementsOnLoad(), which is what runs onSurveyLoad().
      this.setPropertyValue("selectedPreset", this.defaultPreset);
      this.setOwnFilter(undefined, undefined);
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
    this.unhookField(field);
    this.updateFilterExpression();
  }
  private unhookField(field: FilterField): void {
    if (!field) return;
    field.onPropertyChanged.remove(this.onFieldPropertyChanged);
    field.fieldOwner = undefined;
  }
  private onPresetAdded(preset: FilterPreset): void {
    if (!preset) return;
    // Another preset under the name of one the respondent changed (the host spliced or pushed it in)
    // was never changed: what was saved into the one it replaces is not its own. The same preset put
    // back (a reordered list) keeps it.
    const original = this.originalPresets[preset.name];
    if (!!original && original.preset !== preset) {
      this.forgetSavedPreset(preset.name);
    }
    preset.presetOwner = this;
    preset.onPropertyChanged.add(this.onPresetPropertyChanged);
    this.updateFilterExpression();
  }
  private onPresetRemoved(preset: FilterPreset): void {
    this.unhookPreset(preset);
    // A preset of the respondent's that leaves the list - the host spliced it out - is gone as one they
    // deleted: uiState no longer lists it, and a restore has nothing of it to replace.
    this.userPresetsValue = this.userPresetsValue.filter((own: FilterPreset): boolean => own !== preset);
    this.updateFilterExpression();
  }
  private unhookPreset(preset: FilterPreset): void {
    if (!preset) return;
    preset.onPropertyChanged.remove(this.onPresetPropertyChanged);
    if (preset.presetOwner === this) preset.presetOwner = undefined;
  }
  private calcSearchExpression(searchString: string = this.searchString): string {
    if (!this.showSearchBar) return "";
    const text = (searchString || "").trim();
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
  // A preset's expression passes through untouched as long as the respondent has not edited
  // over it; once they have, their conditions are the filter and the preset's text is not used.
  // combineFilterExpressions brackets both operands: "or" binds looser than "and", and the search
  // fragment is itself an "or" chain.
  // The preset is resolved by name on every composition, so an edit of its expression, a
  // replaced presets array or a deleted preset is picked up here with no bookkeeping of its own.
  private calcConditionsExpression(): string {
    if (this.ownRawExpression !== undefined) return this.ownRawExpression;
    const conditions = this.ownConditions;
    if (conditions !== undefined) return conditionsToExpression(conditions, this.getFilterFields());
    const preset = this.activePreset;
    return !!preset ? (preset.expression || "").trim() : "";
  }
  // skipApply is for the caller that is in the middle of moving the control between two targets: it
  // does the single write itself, once the new target is attached.
  private updateFilterExpression(skipApply?: boolean): void {
    // Nothing is filtered while the JSON is still being read - onSurveyLoad() composes the
    // expression once it is whole - and nothing is filtered in the designer either. A batch
    // (runBatch, holdChanges) composes once, at its end: an intermediate text (a preset turned off
    // before the edit that follows it) is never published, so combinedExpression changes once per
    // change, the way an application that reads it sees one.
    if (this.isLoadingFromJson || this.isDesignMode || this.batchLevel > 0) return;
    const filter = this.calcConditionsExpression();
    const search = this.calcSearchExpression();
    this.setPropertyValue("filterExpression", filter);
    this.setPropertyValue("searchExpression", search);
    const combined = combineFilterExpressions(filter, search);
    if (combined === this.combinedExpression) return;
    this.setPropertyValue("combinedExpression", combined);
    if (!skipApply) {
      this.applyToTarget();
    }
  }
}

// The choices of searchFields: a field by its name, or by its path ("home.city") when nested fields
// share a name - the name finds only the first of them (getFieldByName). A value the control resolves
// although no choice names it (a path or a valueName authored in JSON) is a choice too, so a designer
// that keeps only listed values does not drop it.
function getSearchFieldChoices(obj: any): Array<any> {
  if (!obj || typeof obj.getFilterFields !== "function") return [];
  const fields: Array<IDynamicDataFilterField> = obj.getFilterFields();
  const counts: { [name: string]: number } = {};
  fields.forEach((field: IDynamicDataFilterField): void => { counts[field.name] = (counts[field.name] || 0) + 1; });
  const res: Array<any> = fields.map((field: IDynamicDataFilterField): any => counts[field.name] > 1
    ? { value: field.valueName, text: getFilterFieldTitle(field) + " (" + field.valueName + ")" }
    : { value: field.name, text: getFilterFieldTitle(field) });
  const current = obj.searchFields;
  if (Array.isArray(current)) {
    current.forEach((val: string): void => {
      if (res.some((item: any): boolean => item.value === val)) return;
      const field: IDynamicDataFilterField = obj.getFieldByName(val);
      if (!!field) res.push({ value: val, text: getFilterFieldTitle(field) + " (" + val + ")" });
    });
  }
  return res;
}
// The property types question_filtertarget, dropdown and text only pick the Creator editor (a list of
// the questions that can be a target, a dropdown that never turns into a button group, a multi-line
// box); each of them is stored as a plain string.
Serializer.addClass("filter", [
  { name: "title", visible: true },
  // The non-value base hides both; the control's own readOnly locks its UI (isControlReadOnly).
  // readOnlyMode's "view" draws nothing different for a filter.
  { name: "readOnly", visible: true },
  { name: "enableIf", visible: true },
  { name: "readOnlyMode", visible: false },
  // Question properties the non-value base leaves shown and the control has no use for: it holds no
  // value (canSetValueToSurvey), shows no errors, takes no number (isVisibleIndexNegative), and the
  // base hides its description. Hidden only: a JSON that sets them still loads and saves.
  { name: "showNumber", visible: false },
  { name: "descriptionLocation", visible: false },
  { name: "errorLocation", visible: false },
  { name: "defaultValueExpression", visible: false },
  { name: "resetValueIf", visible: false },
  { name: "setValueIf", visible: false },
  { name: "setValueExpression", visible: false },
  { name: "defaultDisplayValue", visible: false },
  { name: "targetQuestion:question_filtertarget" },
  // With no target question, the control's own fields (the host reads its combinedExpression). With
  // one, overrides of the target's fields and fields of the record the target has no column for.
  { name: "fields:filterfield[]", className: "filterfield", uniqueProperty: "name" },
  // The live list is the respondent's changes too: the JSON is the authored presets (getSerializablePresetsValue).
  { name: "presets:filterpreset[]", className: "filterpreset", uniqueProperty: "name",
    onSerializeValue: (obj: any): any => obj.getSerializablePresetsValue() },
  // For a control: "" first (no default preset), which also keeps the list non-empty, so a designer
  // that skips an empty list of choices still drops the presets that are gone. Without a control
  // (the linter, the JSON schema) there is no list: a lone "" would read as the only allowed value.
  { name: "defaultPreset:dropdown", dependsOn: "presets",
    choices: (obj: any): Array<any> => !obj || !Array.isArray(obj.presets) ? []
      : [""].concat(obj.presets.map((preset: FilterPreset): any => ({ value: preset.name, text: preset.title }))) },
  { name: "showPresets:boolean", default: true },
  { name: "allowAddPresets:boolean", default: false, dependsOn: "showPresets",
    visibleIf: (obj: any): boolean => !!obj && obj.showPresets },
  { name: "allowEditPresets:boolean", default: false, dependsOn: "showPresets",
    visibleIf: (obj: any): boolean => !!obj && obj.showPresets },
  { name: "allowDeletePresets:boolean", default: false, dependsOn: "showPresets",
    visibleIf: (obj: any): boolean => !!obj && obj.showPresets },
  { name: "showSearchBar:boolean", default: false },
  { name: "searchFields:string[]", dependsOn: ["showSearchBar", "targetQuestion", "fields"],
    visibleIf: (obj: any): boolean => !!obj && obj.showSearchBar,
    choices: (obj: any): Array<any> => getSearchFieldChoices(obj) },
  { name: "searchPlaceholder", serializationProperty: "locSearchPlaceholder", dependsOn: "showSearchBar",
    visibleIf: (obj: any): boolean => !!obj && obj.showSearchBar },

  { name: "showQuickFilters:boolean", default: true },
  { name: "showAllFiltersButton:boolean", default: true },
], () => new QuestionFilterModel(""), "nonvalue");
QuestionFactory.Instance.registerQuestion("filter", (name) => new QuestionFilterModel(name));

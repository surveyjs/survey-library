import { ComputedUpdater } from "../base";
import { Action, IAction } from "../actions/action";
import { createDropdownActionModel } from "../actions/dropdown-action";
import type { ListModel } from "../list";
import { settings } from "../settings";
import { focusElement } from "../utils/focus-utils";
import { getActiveElement } from "../utils/dom-utils";
import { DynamicDataFieldType, ISortCriterion, SortDirection } from "../dynamic-data/dynamic-data-interfaces";
import { getSortDirectionItems, ISortDirectionItem } from "./records-sort-directions";
import type { IRecordsSortBarOwner, IRecordsSortField } from "./records-sort-bar";

/* What a sort level is made of, shared by the sort bar and the sort dialog: the field a level shows, its
   field and direction lists, and the dropdown that opens one of them. */

// The field a level shows, and whether it is the fallback of a sort field the owner does not offer.
export interface IShownSortField extends IRecordsSortField { isFallback: boolean }

export function findSortField(fields: Array<IRecordsSortField>, field: string): IRecordsSortField {
  return fields.filter((item: IRecordsSortField): boolean => item.field === field)[0];
}
// An omitted direction of an ISortCriterion means ascending.
export function getSortDirection(criterion: ISortCriterion): SortDirection {
  return criterion.direction === "desc" ? "desc" : "asc";
}
// The sort with every direction normalized: a copy that a pick can change and that compares as the respondent sees it.
export function copySort(sort: Array<ISortCriterion>): Array<ISortCriterion> {
  return sort.map((item: ISortCriterion): ISortCriterion => ({ field: item.field, direction: getSortDirection(item) }));
}
export function isSameSort(first: Array<ISortCriterion>, second: Array<ISortCriterion>): boolean {
  if (first.length !== second.length) return false;
  for (let i = 0; i < first.length; i++) {
    if (first[i].field !== second[i].field || getSortDirection(first[i]) !== getSortDirection(second[i])) return false;
  }
  return true;
}
// A field of the sort: the offered one, or a fallback item for a field the owner does not offer.
export function getShownSortField(owner: IRecordsSortBarOwner, fields: Array<IRecordsSortField>, field: string): IShownSortField {
  const offered = findSortField(fields, field);
  if (!!offered) return Object.assign({ isFallback: false }, offered);
  return { field: field, title: field, dataType: owner.getSortFieldDataType(field) || "any", isFallback: true };
}
// The field list of a level: the offered fields without the fields of the other levels, plus the fallback item.
export function getSortFieldItems(fields: Array<IRecordsSortField>, otherFields: Array<string>, shown: IShownSortField): Array<IAction> {
  const items: Array<IAction> = fields.filter((item: IRecordsSortField): boolean => otherFields.indexOf(item.field) < 0)
    .map((item: IRecordsSortField): IAction => ({ id: "sv-sort-field-" + item.field, title: item.title, data: item.field }));
  if (!!shown && shown.isFallback) {
    items.push({ id: "sv-sort-field-" + shown.field, title: shown.title, data: shown.field });
  }
  return items;
}
// The direction list of a level: the item that does not sort (when given), then the two directions of the field's type.
export function getSortDirectionListItems(owner: IRecordsSortBarOwner, dataType: DynamicDataFieldType, noSortItem?: IAction): Array<IAction> {
  const items: Array<IAction> = !!noSortItem ? [noSortItem] : [];
  getSortDirectionItems(dataType).forEach((item: ISortDirectionItem): void => {
    items.push({ id: "sv-sort-direction-" + item.direction, title: owner.getLocalizationString(item.locStringName), data: item.direction });
  });
  return items;
}
// The keys rebuild a list only when what it shows changed, so an open popup keeps its items.
export interface ISortListKeys { [name: string]: string }
export function setSortListItems(keys: ISortListKeys, keyName: string, action: Action, items: Array<IAction>): ListModel {
  const list = <ListModel>action.data;
  const key = JSON.stringify(items);
  if (keys[keyName] !== key) {
    keys[keyName] = key;
    list.setItems(items);
  }
  return list;
}

export interface ISortDropdownOptions {
  id: string;
  iconName: string;
  showBorder: boolean;
  innerCss: () => string;
  visible?: () => boolean;
  enabled?: () => boolean;
  onPicked: (item: IAction) => void;
}
// A dropdown of a level: its title, then a chevron (the css puts the chevron after the label).
export function createSortDropdownAction(owner: IRecordsSortBarOwner, options: ISortDropdownOptions): Action {
  const actionOptions: IAction = {
    id: options.id,
    title: "",
    showTitle: true,
    iconName: options.iconName,
    iconSize: "auto",
    appearance: { showBorder: options.showBorder },
    innerCss: <any>new ComputedUpdater(() => options.innerCss())
  };
  if (!!options.visible) actionOptions.visible = <any>new ComputedUpdater(() => options.visible());
  if (!!options.enabled) actionOptions.enabled = <any>new ComputedUpdater(() => options.enabled());
  const action = createDropdownActionModel(actionOptions, {
    items: [],
    allowSelection: true,
    // Under the button: the default opens to its left, over the other dropdown of the level.
    verticalPosition: "bottom",
    horizontalPosition: "center",
    onSelectionChanged: (item: IAction): void => { options.onPicked(item); }
  }, owner.getLocOwner());
  // The list takes the focus as it opens, as the pager's page list does: the arrows and Enter pick from it.
  action.popupModel.isFocusedContent = true;
  return action;
}

/* The rendered element of an action: every renderer gives the action's root element its renderedId. It is
   looked up under the survey's root element, which may be inside a shadow root that the document cannot see into. */
export function getSortActionElement(owner: IRecordsSortBarOwner, action: Action): HTMLElement {
  const container = owner.getRootElement();
  if (!!container) return container.querySelector("#" + CSS.escape(action.renderedId));
  const root: any = settings.environment.root;
  return !!root && typeof root.getElementById === "function" ? root.getElementById(action.renderedId) : null;
}
/* Is the keyboard focus inside the action's element, or on nothing (<body>)? The active element is read
   through a shadow root. */
export function isFocusInsideOrIdle(owner: IRecordsSortBarOwner, action: Action): boolean {
  const active = getActiveElement();
  if (!active || active === active.ownerDocument.body) return true;
  const el = getSortActionElement(owner, action);
  return !!el && el.contains(active);
}
// Moves the focus to the button of an action; isTimeOut waits for a renderer that has not drawn it yet.
export function focusSortAction(owner: IRecordsSortBarOwner, action: Action, isTimeOut: boolean): void {
  focusElement(() => {
    const el = getSortActionElement(owner, action);
    return !!el ? el.querySelector("button") : null;
  }, isTimeOut);
}

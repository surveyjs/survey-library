import { ILocalizableOwner } from "../localizablestring";
import { Action, IAction, setCreatePopupModelWithListModel } from "./action";
import { IListModel } from "./list-model";
import { ListModel } from "../list";
import { menuListCss } from "./menu-list";
import { IPopupOptionsBase, PopupModel } from "../popup";

export interface IActionDropdownPopupOptions extends IListModel, IPopupOptionsBase {
}
export function createDropdownActionModel(actionOptions: IAction, dropdownOptions: IActionDropdownPopupOptions, locOwner?: ILocalizableOwner): Action {
  dropdownOptions.locOwner = locOwner;
  return createDropdownActionModelAdvanced(actionOptions, dropdownOptions, dropdownOptions);
}
export function createDropdownActionModelAdvanced(actionOptions: IAction, listOptions: IListModel, popupOptions?: IPopupOptionsBase): Action {
  const originalSelectionChanged = listOptions.onSelectionChanged;
  listOptions.onSelectionChanged = (item: IAction, ...params: any[]) => {
    if (newAction.hasTitle) { newAction.title = item.title; }
    if (originalSelectionChanged) {
      originalSelectionChanged(item, params);
    }
  };
  listOptions.cssClasses = { ...menuListCss };
  const _popupOptions = popupOptions || {};
  _popupOptions.showPointer = _popupOptions.showPointer ?? false;
  const popupModel: PopupModel = createPopupModelWithListModel(listOptions, _popupOptions);
  popupModel.getTargetCallback = getActionDropdownButtonTarget;
  const newActionOptions = Object.assign({}, actionOptions, {
    component: "sv-action-bar-item-dropdown",
    popupModel: popupModel,
    action: (action: IAction, isUserAction: boolean) => {
      !!(actionOptions.action) && actionOptions.action();
      popupModel.isFocusedContent = popupModel.isFocusedContent || !isUserAction;
      popupModel.show();
    },
  });
  const newAction: Action = new Action(newActionOptions);
  newAction.data = popupModel.contentComponentData?.model;

  return newAction;
}

export function createPopupModelWithListModel(listOptions: IListModel, popupOptions?: IPopupOptionsBase): PopupModel {
  if (!listOptions.listRole) listOptions.listRole = "menu";
  if (!listOptions.listItemRole) listOptions.listItemRole = !!listOptions.allowSelection ? "menuitemradio" : "menuitem";

  const listModel: ListModel = new ListModel(listOptions as any);
  listModel.onSelectionChanged = (item: Action) => {
    if (listOptions.onSelectionChanged) {
      listOptions.onSelectionChanged(item);
    }
    popupModel.hide();
  };

  const _popupOptions = popupOptions || {};
  _popupOptions.onDispose = () => { listModel.dispose(); };
  const popupModel: PopupModel = new PopupModel("sv-list", { model: listModel }, _popupOptions);
  popupModel.isFocusedContent = listModel.showFilter;
  popupModel.onShow = () => {
    if (!!_popupOptions.onShow) _popupOptions.onShow();
    listModel.scrollToSelectedItem();
  };
  popupModel.onHide = () => {
    if (!!_popupOptions.onHide) _popupOptions.onHide();
    listModel.filterString = "";
  };

  return popupModel;
}

export function getActionDropdownButtonTarget(container: HTMLElement): HTMLElement {
  return container?.previousElementSibling as HTMLElement;
}

setCreatePopupModelWithListModel(createPopupModelWithListModel);

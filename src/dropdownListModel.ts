import { Action, IAction } from "./actions/action";
import { Base, ComputedUpdater } from "./base";
import { ItemValue } from "./itemvalue";
import { ListModel } from "./list";
import { PopupModel } from "./popup";
import { Question } from "./question";
import { PopupUtils } from "./utils/popup";
import { findParentByClassNames } from "./utils/utils";

export class DropdownListModel extends Base {
  private _popupModel: PopupModel;
  private _onPropertyChanged: (s: any, options: any) => void;

  private getVisibleListItems() {
    return this.question.visibleChoices.map((choice: ItemValue) => new Action({
      id: choice.value,
      title: choice.text,
      component: this.question.itemComponent,
      visible: <any>new ComputedUpdater<boolean>(() => choice.isVisible),
      enabled: <any>new ComputedUpdater<boolean>(() => choice.isEnabled),
    }));
  }

  constructor(private question: Question) {
    super();

    this._onPropertyChanged = (s, options) => {
      if (options.name === "visibleChoices") {
        this._popupModel.contentComponentData.model.setItems(this.getVisibleListItems());
      }
    };
    this.question.onPropertyChanged.add(this._onPropertyChanged);
    const listModel = new ListModel(this.getVisibleListItems(), (item: IAction) => {
      this.question.value = item.id;
      this._popupModel.toggleVisibility();
    }, true);
    listModel.denySearch = this.question.denySearch;

    this._popupModel = new PopupModel("sv-list", { model: listModel, }, "bottom", "center", false);
    this._popupModel.widthMode = "fixedWidth";
    this._popupModel.onVisibilityChanged.add((_, option: { isVisible: boolean }) => {
      if (option.isVisible && !!this.question.onOpenedCallBack) {
        this.question.onOpenedCallBack();
      }
    });
  }

  get popupModel(): PopupModel {
    return this._popupModel;
  }

  public onClick(event: any): void {
    if (!!event && !!event.target) {
      const target = findParentByClassNames(event.target, this.question.cssClasses.control.split(" "));
      if (!!target) {
        PopupUtils.updatePopupWidthBeforeShow(this._popupModel, target, event);
      }
    }
  }

  public dispose(): void {
    super.dispose();
    this.question.onPropertyChanged.remove(this._onPropertyChanged);
  }
}
import { IAction } from "./actions/action";
import { Base } from "./base";
import { property } from "./jsonobject";

export class ListModel extends Base {
  @property({ defaultValue: false }) isExpanded: boolean;
  @property() selectedItem: IAction;

  constructor(
    items: Array<IAction>,
    public onItemSelect: (item: IAction) => void,
    public allowSelection: boolean,
    selectedItem?: IAction
  ) {
    super();
    this.createNewArray("items");
    this.items = items;
    this.selectedItem = selectedItem;
  }

  public get items(): Array<IAction> {
    return this.getPropertyValue("items");
  }
  public set items(value: Array<IAction>) {
    this.items.splice(0, this.items.length, ...(value || []));
  }

  public selectItem = (itemValue: IAction) => {
    this.isExpanded = false;
    if (this.allowSelection) {
      this.selectedItem = itemValue;
    }
    if (!!this.onItemSelect) {
      this.onItemSelect(itemValue);
    }
  };

  public isItemDisabled = (itemValue: IAction) => {
    return itemValue.enabled !== undefined && !itemValue.enabled;
  };

  public isItemSelected = (itemValue: IAction) => {
    return this.allowSelection && this.selectedItem == itemValue;
  };

  public getItemClass = (itemValue: IAction) => {
    var className = "sv-list__item";
    if (this.isItemDisabled(itemValue)) {
      className += " sv-list__item--disabled";
    }
    if (this.isItemSelected(itemValue)) {
      className += " sv-list__item--selected";
    }
    return className;
  };
}

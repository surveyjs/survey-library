import { IActionBarItem } from "./action-bar";
import { Base } from "./base";
import { property } from "./jsonobject";

export class ListModel extends Base {
  @property({ defaultValue: false }) isExpanded: boolean;
  @property() selectedItem: IActionBarItem;
  public static INDENT: number = 16;

  constructor(
    items: Array<IActionBarItem>,
    public onItemSelect: (item: IActionBarItem) => void,
    public allowSelection: boolean,
    selectedItem?: IActionBarItem
  ) {
    super();
    this.createNewArray("items");
    this.items = items;
    this.selectedItem = selectedItem;
  }

  public get items(): Array<IActionBarItem> {
    return this.getPropertyValue("items");
  }
  public set items(value: Array<IActionBarItem>) {
    this.items.splice(0, this.items.length, ...(value || []));
  }

  public selectItem = (itemValue: IActionBarItem) => {
    this.isExpanded = false;
    if (this.allowSelection) {
      this.selectedItem = itemValue;
    }
    if (!!this.onItemSelect) {
      this.onItemSelect(itemValue);
    }
  };

  public isItemDisabled = (itemValue: IActionBarItem) => {
    return itemValue.enabled !== undefined && !itemValue.enabled;
  };

  public isItemSelected = (itemValue: IActionBarItem) => {
    return this.allowSelection && this.selectedItem == itemValue;
  };

  public getItemClass = (itemValue: IActionBarItem) => {
    var className = "sv-list__item";
    if (this.isItemDisabled(itemValue)) {
      className += " sv-list__item--disabled";
    }
    if (this.isItemSelected(itemValue)) {
      className += " sv-list__item--selected";
    }
    return className;
  };

  public getItemIndent = (itemValue: any) => {
    const level = itemValue.level || 0;
    return (level + 1) * ListModel.INDENT + "px";
  };
}

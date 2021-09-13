import { property } from "./jsonobject";
import { Base } from "./base";
import { IAction } from "./actions/action";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export class ListModel extends Base {
  @property({ defaultValue: false }) isExpanded: boolean;
  @property() selectedItem: IAction;
  public static INDENT: number = 16;

  constructor(items: Array<IAction>, public onItemSelect: (item: IAction) => void, public allowSelection: boolean, selectedItem?: IAction) {
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
    return new CssClassBuilder()
      .append("sv-list__item")
      .append("sv-list__item--disabled", this.isItemDisabled(itemValue))
      .append("sv-list__item--selected", this.isItemSelected(itemValue))
      .toString();
  };

  public getItemIndent = (itemValue: any) => {
    const level: number = itemValue.level || 0;
    return (level + 1) * ListModel.INDENT + "px";
  };

  public onKeyDown(event: KeyboardEvent) {
    const currentElement = <Element>event.target;
    if (event.key === "ArrowDown" || event.keyCode === 40) {
      if (!!currentElement.nextElementSibling) {
        (<HTMLElement>currentElement.nextElementSibling).focus();
      } else {
        currentElement.parentElement.firstElementChild && (<HTMLElement>currentElement.parentElement.firstElementChild).focus();
      }
      event.preventDefault();
    } else if (event.key === "ArrowUp" || event.keyCode === 38) {
      if (!!currentElement.previousElementSibling) {
        (<HTMLElement>currentElement.previousElementSibling).focus();
      } else {
        currentElement.parentElement.lastElementChild && (<HTMLElement>currentElement.parentElement.lastElementChild).focus();
      }
      event.preventDefault();
    }
  }
}

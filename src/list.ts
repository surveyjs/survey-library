import { property } from "./jsonobject";
import { ActionContainer } from "./actions/container";
import { Action, IAction } from "./actions/action";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { surveyLocalization } from "./surveyStrings";

export class ListModel extends ActionContainer {
  @property({
    defaultValue: false,
    onSet: (newValue: boolean, target: ListModel) => {
      target.onSet();
    }
  }) denySearch: boolean;
  @property({ defaultValue: false }) needFilter: boolean;
  @property({ defaultValue: false }) isExpanded: boolean;
  @property() selectedItem: IAction;
  @property({
    onSet: (_, target: ListModel) => {
      target.filterByText(target.filteredText);
    }
  }) filteredText: string;

  public static INDENT: number = 16;
  public static MINELEMENTCOUNT: number = 10;

  private hasText(item: Action, filteredTextInLow: string): boolean {
    if (!filteredTextInLow) return true;
    let textInLow = (item.title || "").toLocaleLowerCase();
    return textInLow.indexOf(filteredTextInLow.toLocaleLowerCase()) > -1;
  }
  private updateItemVisible(text: string) {
    this.actions.forEach(item => {
      item.visible = this.hasText(item, text);
    });
  }
  private filterByText(text: string) {
    if (!this.needFilter) return;

    if (!!this.onFilteredTextChange) {
      this.onFilteredTextChange(text);
    } else {
      this.updateItemVisible(text);
    }
  }

  constructor(items: Array<IAction>, public onItemSelect: (item: Action) => void, public allowSelection: boolean, selectedItem?: IAction, private onFilteredTextChange?: (text: string) => void) {
    super();
    this.setItems(items);
    this.selectedItem = selectedItem;
  }

  protected onSet(): void {
    this.needFilter = !this.denySearch && (this.actions || []).length > ListModel.MINELEMENTCOUNT;
    super.onSet();
  }

  public selectItem = (itemValue: Action) => {
    this.isExpanded = false;
    if (this.allowSelection) {
      this.selectedItem = itemValue;
    }
    if (!!this.onItemSelect) {
      this.onItemSelect(itemValue);
    }
  };

  public isItemDisabled: (itemValue: Action) => boolean = (itemValue: Action) => {
    return itemValue.enabled !== undefined && !itemValue.enabled;
  };

  public isItemSelected: (itemValue: Action) => boolean = (itemValue: Action) => {
    return !!this.allowSelection && !!this.selectedItem && this.selectedItem.id == itemValue.id;
  };

  public getItemClass: (itemValue: Action) => string = (itemValue: Action) => {
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

  public get filteredTextPlaceholder() {
    return surveyLocalization.getString("filteredTextPlaceholder");
  }

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
  public onPointerDown(event: PointerEvent, item: any) { }
  public refresh() {
    this.filteredText = "";
  }
}

import { property } from "./jsonobject";
import { ActionContainer } from "./actions/container";
import { Action, IAction } from "./actions/action";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { ElementHelper } from "./element-helper";

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
      target.onFilteredTextChanged(target.filteredText);
    }
  }) filteredText: string;

  public static INDENT: number = 16;
  public static MINELEMENTCOUNT: number = 10;

  private hasText(item: Action, filteredTextInLow: string): boolean {
    if (!filteredTextInLow) return true;
    let textInLow = (item.title || "").toLocaleLowerCase();
    return textInLow.indexOf(filteredTextInLow.toLocaleLowerCase()) > -1;
  }
  public isItemVisible(item: Action) {
    return item.visible && (!this.shouldProcessFilter || this.hasText(item, this.filteredText));
  }
  private get shouldProcessFilter(): boolean {
    return this.needFilter && !this.onFilteredTextChangedCallback;
  }
  private onFilteredTextChanged(text: string) {
    if (!this.needFilter) return;
    if (!!this.onFilteredTextChangedCallback) {
      this.onFilteredTextChangedCallback(text);
    }
  }

  constructor(
    items: Array<IAction>,
    public onSelectionChanged: (item: Action, ...params: any[]) => void,
    public allowSelection: boolean,
    selectedItem?: IAction,
    private onFilteredTextChangedCallback?: (text: string) => void
  ) {
    super();
    this.setItems(items);
    this.selectedItem = selectedItem;
  }

  protected onSet(): void {
    this.needFilter = !this.denySearch && (this.actions || []).length > ListModel.MINELEMENTCOUNT;
    super.onSet();
  }

  public onItemClick = (itemValue: Action) => {
    this.isExpanded = false;
    if (this.allowSelection) {
      this.selectedItem = itemValue;
    }
    if (!!this.onSelectionChanged) {
      this.onSelectionChanged(itemValue);
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
      .append("sv-list__item--selected", itemValue.active || this.isItemSelected(itemValue))
      .toString();
  };

  public getItemIndent = (itemValue: any) => {
    const level: number = itemValue.level || 0;
    return (level + 1) * ListModel.INDENT + "px";
  };

  public get filteredTextPlaceholder() {
    return this.getLocalizationString("filteredTextPlaceholder");
  }

  public goToItems(event: KeyboardEvent): void {
    if (event.key === "ArrowDown" || event.keyCode === 40) {
      const currentElement = (<HTMLElement>event.target).parentElement;
      ElementHelper.focusElement(ElementHelper.getNextElementPreorder(currentElement.nextElementSibling.firstElementChild));
      event.preventDefault();
    }
  }
  public onKeyDown(event: KeyboardEvent): void {
    const currentElement = <Element>event.target;
    if (event.key === "ArrowDown" || event.keyCode === 40) {
      ElementHelper.focusElement(ElementHelper.getNextElementPreorder(currentElement));
      event.preventDefault();
    } else if (event.key === "ArrowUp" || event.keyCode === 38) {
      ElementHelper.focusElement(ElementHelper.getNextElementPostorder(currentElement));
      event.preventDefault();
    }
  }
  public onPointerDown(event: PointerEvent, item: any) { }
  public refresh() {
    this.filteredText = "";
  }
}
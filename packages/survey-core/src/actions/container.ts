import { property, propertyArray } from "../jsonobject";
import { Base } from "../base";
import { IAction, Action, BaseAction } from "./action";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { ILocalizableOwner, LocalizableString } from ".././localizablestring";
import { mergeValues } from "../utils/utils";

export let defaultActionBarCss = {
  root: "sv-action-bar",
  defaultSizeMode: "sv-action-bar--default-size-mode",
  smallSizeMode: "sv-action-bar--small-size-mode",
  item: "sv-action-bar-item",
  itemWithTitle: "",
  itemAsIcon: "sv-action-bar-item--icon",
  itemActive: "sv-action-bar-item--active",
  itemPressed: "sv-action-bar-item--pressed",
  itemIcon: "sv-action-bar-item__icon",
  itemTitle: "sv-action-bar-item__title",
  itemTitleWithIcon: "sv-action-bar-item__title--with-icon",
};

export class ActionContainer<T extends BaseAction = Action> extends Base implements ILocalizableOwner {
  public getMarkdownHtml(text: string, name: string): string {
    return !!this.locOwner ? this.locOwner.getMarkdownHtml(text, name) : undefined;
  }
  public getRenderer(name: string): string {
    return !!this.locOwner ? this.locOwner.getRenderer(name) : null;
  }
  public getRendererContext(locStr: LocalizableString): any {
    return !!this.locOwner ? this.locOwner.getRendererContext(locStr) : locStr;
  }
  public getProcessedText(text: string): string {
    return this.locOwner ? this.locOwner.getProcessedText(text) : text;
  }
  public getLocale(): string {
    return !!this.locOwner ? this.locOwner.getLocale() : "";
  }
  @propertyArray({
    onSet: (_: any, target: ActionContainer<Action>) => {
      target.onSet();
    },
    onPush: (item: any, i: number, target: ActionContainer<Action>) => {
      target.onPush(item);
    },
    onRemove: (item: any, i: number, target: ActionContainer<Action>) => {
      target.onRemove(item);
    }
  })
  actions: Array<T>;
  private cssClassesValue: any;

  protected getRenderedActions(): Array<T> {
    return this.actions;
  }

  public updateCallback: (isResetInitialized: boolean) => void;
  @property({}) containerCss: string;
  public sizeMode: "default" | "small" = "default";
  public locOwner: ILocalizableOwner;
  @property({ defaultValue: false }) isEmpty: boolean;

  public locStrsChanged(): void {
    super.locStrsChanged();
    this.actions.forEach(item => {
      if(item.locTitle) item.locTitle.strChanged();
      item.locStrsChanged();
    });
  }
  protected raiseUpdate(isResetInitialized: boolean) {
    this.isEmpty = !this.actions.some((action) => action.visible);
    this.updateCallback && this.updateCallback(isResetInitialized);
  }

  protected onSet() {
    this.actions.forEach((item) => { this.setActionCssClasses(item); });
    this.raiseUpdate(true);
  }
  protected onPush(item: T) {
    this.setActionCssClasses(item);
    item.owner = this;
    this.raiseUpdate(true);
  }

  protected onRemove(item: T) {
    item.owner = null;
    this.raiseUpdate(true);
  }

  private setActionCssClasses(item: T) {
    item.cssClasses = this.cssClasses;
  }

  public get hasActions(): boolean {
    return (this.actions || []).length > 0;
  }

  public get renderedActions(): Array<T> {
    return this.getRenderedActions();
  }

  get visibleActions(): Array<T> {
    return this.actions.filter((action) => action.visible !== false);
  }
  public getRootCss(): string {
    const sizeModeClass = this.sizeMode === "small" ? this.cssClasses.smallSizeMode : this.cssClasses.defaultSizeMode;
    return new CssClassBuilder().append(this.cssClasses.root + (!!sizeModeClass ? " " + sizeModeClass : "") + (!!this.containerCss ? " " + this.containerCss : ""))
      .append(this.cssClasses.root + "--empty", this.isEmpty)
      .toString();
  }
  protected getDefaultCssClasses(): any {
    return defaultActionBarCss;
  }
  public set cssClasses(val: any) {
    this.cssClassesValue = {};
    this.copyCssClasses(this.cssClassesValue, this.getDefaultCssClasses());
    mergeValues(val, this.cssClasses);
    this.actions.forEach((action: T) => {
      this.setActionCssClasses(action);
    });
  }
  public get cssClasses(): any {
    if(!this.cssClassesValue) {
      this.cssClassesValue = this.getDefaultCssClasses();
    }
    return this.cssClassesValue;
  }
  private createAction(item: IAction): T {
    return <T>(item instanceof BaseAction ? item : new Action(item));
  }
  public addAction(val: IAction, sortByVisibleIndex = true): T {
    const res: T = this.createAction(val);
    if(sortByVisibleIndex && !this.isActionVisible(res)) return res;
    const items = [].concat(this.actions, res);
    this.sortItems(items);
    this.actions = items;
    return res;
  }
  public setItems(items: Array<IAction>, sortByVisibleIndex = true): void {
    const newActions: Array<T> = [];
    items.forEach(item => {
      if(!sortByVisibleIndex || this.isActionVisible(item)) {
        newActions.push(this.createAction(item));
      }
    });
    if (sortByVisibleIndex) {
      this.sortItems(newActions);
    }
    this.actions = newActions;
  }
  private sortItems(items: Array<IAction>): void {
    if(this.hasSetVisibleIndex(items)) {
      items.sort(this.compareByVisibleIndex);
    }
  }
  private hasSetVisibleIndex(items: Array<IAction>): boolean {
    for(let i = 0; i < items.length; i ++) {
      const index = items[i].visibleIndex;
      if(index !== undefined && index >= 0) return true;
    }
    return false;
  }
  private compareByVisibleIndex(first: IAction, second: IAction): number {
    return first.visibleIndex - second.visibleIndex;
  }
  private isActionVisible(item: IAction): boolean {
    return item.visibleIndex >= 0 || item.visibleIndex === undefined;
  }
  @property({ defaultValue: 300 }) subItemsShowDelay: number;
  @property({ defaultValue: 300 }) subItemsHideDelay: number;
  protected popupAfterShowCallback(itemValue: T): void {

  }

  public mouseOverHandler(itemValue: T): void {
    itemValue.isHovered = true;
    this.actions.forEach(action => {
      if (action === itemValue && !!itemValue.popupModel) {
        itemValue.showPopupDelayed(this.subItemsShowDelay);
        this.popupAfterShowCallback(itemValue);
      }
    });
  }

  public initResponsivityManager(container: HTMLDivElement, delayedUpdateFunction?: (callback: () => void) => void): void {
    return;
  }
  public resetResponsivityManager(): void { }
  public getActionById(id: string): T {
    for (var i = 0; i < this.actions.length; i++) {
      if (this.actions[i].id === id) return this.actions[i];
    }
    return null;
  }
  public dispose(): void {
    super.dispose();
    this.resetResponsivityManager();
    this.actions.forEach(action => action.dispose());
    this.actions.length = 0;
  }
}

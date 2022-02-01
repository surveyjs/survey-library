import { propertyArray } from "../jsonobject";
import { Base } from "../base";
import { IAction, Action } from "./action";

export let defaultActionBarCss = {
  root: "sv-action-bar",
  item: "sv-action-bar-item",
  itemActive: "sv-action-bar-item--active",
  itemPressed: "sv-action-bar-item--pressed",
  itemIcon: "sv-action-bar-item__icon",
  itemTitle: "sv-action-bar-item__title",
  itemTitleWithIcon: "sv-action-bar-item__title--with-icon",
};

export class ActionContainer<T extends Action = Action> extends Base {
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
    public containerCss: string;

    protected raiseUpdate(isResetInitialized: boolean) {
      this.updateCallback && this.updateCallback(isResetInitialized);
    }

    protected onSet() {
      this.actions.forEach((item)=>{ this.setActionCssClasses(item); });
      this.raiseUpdate(true);
    }
    protected onPush(item: T) {
      this.setActionCssClasses(item);
      this.raiseUpdate(true);
    }

    protected onRemove(item: T) {
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
      return this.cssClasses.root + (!!this.containerCss ? " " + this.containerCss : "");
    }
    public set cssClasses(val: any) {
      this.cssClassesValue = val;
    }
    public get cssClasses(): any {
      return this.cssClassesValue || defaultActionBarCss;
    }

    private sortItems(items: Array<T>) {
      return []
        .concat(items.filter((item) => item.visibleIndex >= 0 || item.visibleIndex === undefined))
        .sort((firstItem, secondItem) => {
          return firstItem.visibleIndex - secondItem.visibleIndex;
        });
    }

    public setItems(items: Array<IAction>, sortByVisibleIndex = true): void {
      const actions: Array<T> = <any>items.map((item) => (item instanceof Action ? item : new Action(item)));
      if (sortByVisibleIndex) {
        this.actions = this.sortItems(actions);
      } else {
        this.actions = actions;
      }
    }
    public initResponsivityManager(container: HTMLDivElement): void {
      return;
    }
    public resetResponsivityManager(): void {}
}

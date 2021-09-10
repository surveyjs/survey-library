import { propertyArray } from "../jsonobject";
import { Base } from "../base";
import { IAction, Action } from "./action";

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

    protected getRenderedActions(): Array<T> {
      return this.actions;
    }

    public updateCallback: (isResetInitialized: boolean) => void;
    public containerCss: string;

    protected raiseUpdate(isResetInitialized: boolean) {
      this.updateCallback && this.updateCallback(isResetInitialized);
    }

    protected onSet() {
      this.raiseUpdate(true);
    }

    protected onPush(item: T) {
      this.raiseUpdate(true);
    }

    protected onRemove(item: T) {
      this.raiseUpdate(true);
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
    public get css(): string {
      return "sv-action-bar" + (!!this.containerCss ? " " + this.containerCss : "");
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
    public dispose() {
      super.dispose();
    }
}

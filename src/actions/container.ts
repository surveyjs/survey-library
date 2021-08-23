import { propertyArray } from "../jsonobject";
import { Base } from "../base";
import { Action } from "./action";

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
}

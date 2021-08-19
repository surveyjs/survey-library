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

    public updateCallback: (isResetInilized: boolean) => void;
    protected raiseUpdate() {
      this.updateCallback && this.updateCallback(true);
    }

    protected onSet() {
      this.raiseUpdate();
    }
    protected onPush(item: T) {
      this.raiseUpdate();
    }
    protected onRemove(item: T) {
      this.raiseUpdate();
    }

    public get hasItems(): boolean {
        return (this.actions || []).length > 0;
    }
}

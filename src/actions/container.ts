import { propertyArray } from "../jsonobject";
import { Base } from "../base";
import { Action } from "./action";

export class ActionContainer<T extends Action> extends Base {
    @propertyArray() actions: Array<T>;

    public get hasItems(): boolean {
        return (this.actions || []).length > 0;
    }
}

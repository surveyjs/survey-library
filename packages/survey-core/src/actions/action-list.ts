import { property, propertyArray } from "../jsonobject";
import { Base } from "../base";
import { IAction, Action, BaseAction } from "./action";
import { ILocalizableOwner, LocalizableString } from "../localizablestring";

export class ActionList<T extends BaseAction = Action> extends Base implements ILocalizableOwner {
  public locOwner: ILocalizableOwner;
  public getMarkdownHtml(text: string, name: string, item?: any): string {
    return !!this.locOwner ? this.locOwner.getMarkdownHtml(text, name, item) : undefined;
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
    onSet: (_: any, target: ActionList<Action>) => {
      target.onSet();
    },
    onPush: (item: any, i: number, target: ActionList<Action>) => {
      target.onPush(item);
    },
    onRemove: (item: any, i: number, target: ActionList<Action>) => {
      target.onRemove(item);
    }
  })
  actions: Array<T>;

  protected onSet() { }
  protected onPush(_: T) { }
  protected onRemove(_: T) { }

  public dispose(): void {
    super.dispose();
    this.actions.forEach(action => action.dispose());
    this.actions.length = 0;
  }
}

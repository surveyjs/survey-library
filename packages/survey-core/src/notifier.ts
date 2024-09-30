import { Base } from "./base";
import { settings } from "./settings";
import { property } from "./jsonobject";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { ActionContainer } from "./actions/container";
import { IAction } from "./actions/action";

interface INotifierCssClasses {
  root: string;
  rootWithButtons: string;
  info: string;
  error: string;
  success: string;
  button: string;
  shown: string;
}

export class Notifier extends Base {
  @property({ defaultValue: false }) active: boolean;
  @property({ defaultValue: false }) isDisplayed: boolean;
  @property() message: string;
  @property() css: string;
  timeout = settings.notifications.lifetime;
  timer: any = undefined;
  private actionsVisibility: { [key: string]: string } = {};
  public actionBar: ActionContainer;
  public showActions: boolean = true;

  constructor(private cssClasses: INotifierCssClasses) {
    super();
    this.actionBar = new ActionContainer();
    this.actionBar.updateCallback = (isResetInitialized: boolean) => {
      this.actionBar.actions.forEach(action => action.cssClasses = {});
    };
    this.css = this.cssClasses.root;
  }

  getCssClass(type: string): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootWithButtons, this.actionBar.visibleActions.length > 0)
      .append(this.cssClasses.info, type !== "error" && type !== "success")
      .append(this.cssClasses.error, type === "error")
      .append(this.cssClasses.success, type === "success")
      .append(this.cssClasses.shown, this.active)
      .toString();
  }

  updateActionsVisibility(type: string): void {
    this.actionBar.actions.forEach(action => action.visible = this.showActions && (this.actionsVisibility[action.id] === type));
  }

  notify(message: string, type: string = "info", waitUserAction = false): void {
    this.isDisplayed = true;
    setTimeout(() => {

      this.updateActionsVisibility(type);
      this.message = message;
      this.active = true;
      this.css = this.getCssClass(type);

      if(!!this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
      if(!waitUserAction) {
        this.timer = setTimeout(() => {
          this.timer = undefined;
          this.active = false;
          this.css = this.getCssClass(type);
        }, this.timeout);
      }
    }, 1);
  }

  public addAction(action: IAction, notificationType: string): void {
    action.visible = false;
    action.innerCss = this.cssClasses.button;
    const res = this.actionBar.addAction(action);
    this.actionsVisibility[res.id] = notificationType;
  }
}

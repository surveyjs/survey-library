import { Base } from "./base";
import { settings } from "./settings";
import { property } from "./decorators";
import { toCssClasses } from "./utils/cssClassBuilder";
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
    this.actionBar.setActionsAppearance({ mode: "primary", style: "neutral", size: "medium" });
    this.css = this.cssClasses.root;
  }

  getCssClass(type: string): string {
    return toCssClasses(
      this.cssClasses.root,
      this.actionBar.getVisibleActions().length > 0 && this.cssClasses.rootWithButtons,
      type !== "error" && type !== "success" && this.cssClasses.info,
      type === "error" && this.cssClasses.error,
      type === "success" && this.cssClasses.success,
      this.active && this.cssClasses.shown
    );
  }

  updateActions(type: string): void {
    this.actionBar.actions.forEach(action => {
      action.visible = this.showActions && (this.actionsVisibility[action.id] === type);
      action.appearance.style = type === "error" ? "alert" : (type === "success" ? "brand" : "neutral");
    });
  }

  notify(message: string, type: string = "info", waitUserAction = false): void {
    this.isDisplayed = true;
    setTimeout(() => {

      this.updateActions(type);
      this.message = message;
      this.active = true;
      this.css = this.getCssClass(type);

      if (!!this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
      if (!waitUserAction) {
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

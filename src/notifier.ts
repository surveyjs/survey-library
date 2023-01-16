import { Base } from "./base";
import { property } from "./jsonobject";
import { settings } from "./settings";

export class Notifier extends Base {
  @property({ defaultValue: false }) active: boolean;
  @property() message: string;
  @property() css: string;
  timeout = settings.notifications.lifetime;
  timer: NodeJS.Timeout = undefined;

  notify(message: string, type: "info"|"error" = "info"): void {
    this.message = message;
    this.active = true;

    this.css = "sv-notifier";
    if(type === "error")
      this.css += " sv-notifier--error";
    if(!!this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.active = false;
    }, this.timeout);
  }
}

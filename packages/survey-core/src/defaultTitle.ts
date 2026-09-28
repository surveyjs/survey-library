import { toCssClasses } from "./utils/cssClassBuilder";

export class DefaultTitleModel {
  public static getIconCss(cssClasses: any, isCollapsed: boolean) {
    return toCssClasses(cssClasses.icon, !isCollapsed && cssClasses.iconExpanded);
  }
}
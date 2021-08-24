import { CssClassBuilder } from "./utils/cssClassBuilder";

export class DefaultTitleModel {
  public static getIconCss(cssClasses: any, isCollapsed: boolean) {
    return new CssClassBuilder()
      .append(cssClasses.icon)
      .append(cssClasses.iconExpanded, !isCollapsed)
      .toString();
  }
}
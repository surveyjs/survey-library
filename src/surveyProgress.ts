import { CssClassBuilder } from "./utils/cssClassBuilder";

export class SurveyProgressModel {
  public static getProgressRootCss(css: any, survey: any): string {
    return new CssClassBuilder()
      .append(css.progress)
      .append(css.progressWithoutHeader, !survey.renderedHasHeader)
      .toString();
  }
  public static getProgressTextInBarCss(css: any): string {
    return new CssClassBuilder()
      .append(css.progressText)
      .append(css.progressTextInBar)
      .toString();
  }
  public static getProgressTextUnderBarCss(css: any): string {
    return new CssClassBuilder()
      .append(css.progressText)
      .append(css.progressTextUnderBar)
      .toString();
  }
}
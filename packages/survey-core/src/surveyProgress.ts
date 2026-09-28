import { toCssClasses } from "./utils/cssClassBuilder";

export class SurveyProgressModel {
  public static getProgressTextInBarCss(css: any): string {
    return toCssClasses(css.progressText, css.progressTextInBar);
  }
  public static getProgressTextUnderBarCss(css: any): string {
    return toCssClasses(css.progressText, css.progressTextUnderBar);
  }
}
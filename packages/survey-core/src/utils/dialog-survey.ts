import type { SurveyModel } from "../survey";
import { createBoxShadowResetVariables } from "./base-theme-init";

export interface IDialogSurveyOptions {
  // classes merged into the survey's own; rootTheme is always ""
  css?: any;
  locale?: string;
  isMobile?: boolean;
}

// The survey of a dialog shown over another survey (the records' Sort by, the Filter Control's
// dialogs): no title, numbers or navigation, and the look of the survey it is shown under. Its root
// has no theme root class, so it inherits that survey's variables, and its own box-shadow resets
// inherit too. --sd-mobile-width 0 keeps its own width from making it mobile: it follows the outer
// survey's isMobile instead. The survey is passed in, not created: the records code must not import
// SurveyModel at runtime (see records-sort-dialog.ts).
export function setUpDialogSurvey(survey: SurveyModel, options: IDialogSurveyOptions = {}): void {
  survey.css = Object.assign({}, options.css || {}, { rootTheme: "" });
  survey.showNavigationButtons = false;
  survey.showQuestionNumbers = "off";
  survey.fitToContainer = false;
  survey.gridLayoutEnabled = false;
  // The outer survey already renders the icons.
  survey.needRenderIcons = false;
  const cssVariables: { [index: string]: string } = { "--sd-mobile-width": "0px" };
  Object.keys(createBoxShadowResetVariables()).forEach((name: string): void => { cssVariables[name] = "inherit"; });
  survey.applyTheme({ cssVariables: cssVariables });
  if (options.locale !== undefined) {
    survey.locale = options.locale;
  }
  if (options.isMobile !== undefined) {
    survey.setIsMobile(!!options.isMobile);
  }
}

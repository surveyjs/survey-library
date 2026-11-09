import { settings, SurveyModel } from "survey-core";
import DefaultLightPanelless from "../../themes/default-light-panelless";
import { isAllowedLink } from "./runs";
import { getRichTextString } from "./rich-text-strings";

export function createRichTextLinkSurvey(initialUrl: string): SurveyModel {
  const survey = new SurveyModel({
    showNavigationButtons: false,
    elements: [{
      type: "text",
      name: "url",
      title: getRichTextString("richTextLinkUrl"),
      defaultValue: initialUrl || ""
    }]
  });
  survey.applyTheme(DefaultLightPanelless);
  survey.onValidateQuestion.add((_sender, options) => {
    if (options.name !== "url") return;
    const value = String(options.value || "").trim();
    if (value && !isAllowedLink(value)) options.error = getRichTextString("richTextLinkInvalid");
  });
  return survey;
}

export function showRichTextLinkDialog(initialUrl: string, onApply: (url: string) => void, root?: HTMLElement): void {
  if (!settings.showDialog) return;
  const survey = createRichTextLinkSurvey(initialUrl);
  settings.showDialog({
    componentName: "survey",
    data: { model: survey, survey: survey },
    title: getRichTextString("richTextLink"),
    displayMode: "popup",
    isFocusedContent: true,
    onApply: (): boolean => {
      // fireCallback shows the message under the field. Without it the dialog stays open and the text is never rendered.
      if (!survey.validate(true, true)) return false;
      onApply(String(survey.getValue("url") || "").trim());
      return true;
    }
  }, root);
}

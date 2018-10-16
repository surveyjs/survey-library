import { SurveyModel } from "../survey";
import { surveyCss } from "../defaultCss/cssstandard";

export const updateSurveyProps = (survey: SurveyModel, newProps: any) => {
  for (var key in newProps) {
    if (key == "model" || key == "children") continue;
    if (key == "css") {
      survey.mergeValues(newProps.css, surveyCss.getCss());
      continue;
    }
    if (key.indexOf("on") == 0 && survey[key] && survey[key].add) {
      let funcBody = newProps[key];
      let func = function(sender: any, options: any) {
        funcBody(sender, options);
      };
      survey[key].add(func);
    } else {
      survey[key] = newProps[key];
    }
  }

  if (newProps && newProps.data)
    survey.onValueChanged.add((sender, options) => {
      newProps.data[options.name] = options.value;
    });
};

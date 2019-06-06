import * as ko from "knockout";
import { SurveyModel } from "../survey";
import { Survey } from "../knockout/kosurvey";
import { SurveyWindow } from "../knockout/koSurveyWindow";
import { updateSurveyProps } from "../utils/updateSurveyProps";

export class SurveyNG {
  public static render(elementId: string | Element, props:any) {
    var element: Element =
      typeof elementId === "string"
        ? document.getElementById(elementId)
        : elementId;
    var model = props.model;
    updateSurveyProps(model, props);
    model.render(element);
  }
}

export class SurveyWindowNG {
  public static render(elementId: string | Element, props:any) {
    var model = props.model;
    updateSurveyProps(model, props);
    var survey = new SurveyWindow(null, model);
    if (props.expanded !== undefined) {
      survey.isExpanded = props.expanded;
    }
    if (props.isExpanded !== undefined) {
      survey.isExpanded = props.isExpanded;
    }
    survey.show();
  }
}

SurveyModel.platform = "angular";

(<any>ko).surveyTemplateEngine = function () { };

(<any>ko).surveyTemplateEngine.prototype = new ko.nativeTemplateEngine();

(<any>ko).surveyTemplateEngine.prototype.makeTemplateSource = function (template: any, templateDocument: any) {
  if (typeof template === "string") {
    templateDocument = templateDocument || document;
    var templateElementRoot = templateDocument.getElementById("survey-content-" + SurveyModel.platform);
    var elem;
    for (var i = 0; i < templateElementRoot.children.length; i++) {
      if (templateElementRoot.children[i].id === template) {
        elem = templateElementRoot.children[i];
        break;
      }
    }
    if (!elem) {
      elem = templateDocument.getElementById(template);
    }
    if (!elem) {
      throw new Error("Cannot find template with ID " + template);
    }
    return new ko.templateSources.domElement(elem);
  } else if ((template.nodeType === 1) || (template.nodeType === 8)) {
    return new ko.templateSources.anonymousTemplate(template);
  } else {
    throw new Error("Unknown template type: " + template);
  }
};

// (<any>ko).surveyTemplateEngine.prototype.renderTemplateSource = function (templateSource: any, bindingContext: any, options: any, templateDocument: any) {
//   var useNodesIfAvailable = !((<any>ko.utils).ieVersion < 9),
//     templateNodesFunc = useNodesIfAvailable ? templateSource["nodes"] : null,
//     templateNodes = templateNodesFunc ? templateSource["nodes"]() : null;
//   if (templateNodes) {
//     return (<any>ko.utils).makeArray(templateNodes.cloneNode(true).childNodes);
//   } else {
//     var templateText = templateSource["text"]();
//     return (<any>ko.utils).parseHtmlFragment(templateText, templateDocument);
//   }
// };

var surveyTemplateEngineInstance = new (<any>ko).surveyTemplateEngine();
ko.setTemplateEngine(surveyTemplateEngineInstance);

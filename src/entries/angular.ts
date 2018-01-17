export * from "./knockout";
export { SurveyNG } from "../angular/SurveyNG";
export { SurveyWindowNG } from "../angular/SurveyNG";
import { Survey } from "../knockout/kosurvey";
export { Survey as Model };

export class ReactSurveyModel extends Survey {
    constructor(
        jsonObj: any = null,
        renderedElement: any = null,
        css: any = null
      ) {
        super(jsonObj, renderedElement, css);
        console.warn("ReactSurveyModel is depricated in this context. Use Survey.Model instead.");
    }
}
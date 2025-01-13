import { checkLibraryVersion } from "survey-core";

export * from "./react-ui-model";
export { SurveyModel, SurveyWindowModel, SurveyModel as Model, settings, ISurveyEnvironment, surveyLocalization, surveyStrings } from "survey-core";

checkLibraryVersion(`${process.env.VERSION}`, "survey-react-ui");
import { settings } from "../../src/settings";

// common
export * from "../basetests";
export * from "../choicesRestfultests";
export * from "../jsonobjecttests";
export * from "../surveyLocalizationTests";
export * from "../surveyquestiontests";
export * from "../surveyserializationtests";
export * from "../surveytests";
export * from "../paneltests";
export * from "../surveytriggertests";
export * from "../surveyvalidatortests";
export * from "../textPreprocessorTests";
export * from "../expressions/expressionsTest";
export * from "../expressions/expressionParserTest";
export { Survey } from "../../src/knockout/kosurvey";
export { QuestionMatrixDynamic } from "../../src/knockout/koquestion_matrixdynamic";
export { QuestionPanelDynamic } from "../../src/knockout/koquestion_paneldynamic";
export { QuestionRating } from "../../src/knockout/koquestion_rating";
export { QuestionComment } from "../../src/knockout/koquestion_comment";

// knockout
export * from "../ko/kosurveymodeltests";
export * from "../ko/survey_kotests";
export * from "../ko/templatetexttests";
export * from "../ko/actionbar";

settings.animationEnabled = false;

import { surveyLocalization } from "survey-core";
import { dutchSurveyStrings } from "./dutch";

/**
 * This is initialized as a copy of the Dutch strings, when they start to deviate a choice has to be made:
 * - Copy the Dutch set once and move forward as if it are 2 totally different languages
 * - Override the relevant strings only
 */
surveyLocalization.locales["nl-BE"] = dutchSurveyStrings;
surveyLocalization.localeNames["nl-BE"] = "vlaams";

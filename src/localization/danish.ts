import { surveyLocalization } from "../surveyStrings";

export var danishSurveyStrings = {
  pagePrevText: "Tilbage",
  pageNextText: "Videre",
  completeText: "Færdig",
  progressText: "Side {0} af {1}",
  emptySurvey: "Der er ingen synlige spørgsmål.",
  completingSurvey: "Mange tak for din besvarelse!",
  loadingSurvey: "Spørgeskemaet hentes fra serveren...",
  otherItemText: "Valgfrit svar...",
  optionsCaption: "Vælg...",
  requiredError: "Besvar venligst spørgsmålet.",
  numericError: "Angiv et tal.",
  textMinLength: "Angiv mindst {0} tegn.",
  minSelectError: "Vælg venligst mindst  {0} svarmulighed(er).",
  maxSelectError: "Vælg venligst færre {0} svarmuligheder(er).",
  numericMinMax:
    "'{0}' skal være lig med eller større end {1} og lig med eller mindre end {2}",
  numericMin: "'{0}' skal være lig med eller større end {1}",
  numericMax: "'{0}' skal være lig med eller mindre end {1}",
  invalidEmail: "Angiv venligst en gyldig e-mail adresse.",
  exceedMaxSize: "Filstørrelsen må ikke overstige {0}.",
  otherRequiredError: "Angiv en værdi for dit valgfrie svar."
};

surveyLocalization.locales["da"] = danishSurveyStrings;

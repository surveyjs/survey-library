//Created on behalf https://github.com/Frank13
//Modified on behalf Roeland Verbakel
import { surveyLocalization } from "../surveyStrings";

export var dutchSurveyStrings = {
  pagePrevText: "Vorige",
  pageNextText: "Volgende",
  completeText: "Verzenden",
  otherItemText: "Anders, nl.",
  progressText: "Pagina {0} van {1}",
  emptySurvey: "Er is geen zichtbare pagina of vraag in deze vragenlijst",
  completingSurvey: "Bedankt voor het invullen van de vragenlijst",
  loadingSurvey: "De vragenlijst is aan het laden...",
  optionsCaption: "Kies...",
  requiredError: "Dit is een vereiste vraag",
  numericError: "Het antwoord moet een getal zijn",
  textMinLength: "Vul minstens {0} karakters in",
  minSelectError: "Selecteer minimum {0} antwoorden",
  maxSelectError: "Selecteer niet meer dan {0} antwoorden",
  numericMinMax:
    "Uw antwoord '{0}' moet groter of gelijk zijn aan {1} en kleiner of gelijk aan {2}",
  numericMin: "Uw antwoord '{0}' moet groter of gelijk zijn aan {1}",
  numericMax: "Uw antwoord '{0}' moet groter of gelijk zijn aan {1}",
  invalidEmail: "Vul een geldig e-mailadres in",
  exceedMaxSize: "De grootte van het bestand mag niet groter zijn dan {0}",
  otherRequiredError: "Vul het veld 'Anders, nl.' in",
  requiredInAllRowsError: "Deze vraag vereist één antwoord per rij"
};

surveyLocalization.locales["nl"] = dutchSurveyStrings;
surveyLocalization.localeNames["nl"] = "nederlands";

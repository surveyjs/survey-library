//Create by Mattias Asplund
import { surveyLocalization } from "../surveyStrings";

export var swedishSurveyStrings = {
  pagePrevText: "Föregående",
  pageNextText: "Nästa",
  completeText: "Färdig",
  otherItemText: "Annat (beskriv)",
  progressText: "Sida {0} av {1}",
  emptySurvey: "Det finns ingen synlig sida eller fråga i enkäten.",
  completingSurvey: "Tack för att du genomfört enkäten!!",
  loadingSurvey: "Enkäten laddas...",
  optionsCaption: "Välj...",
  requiredError: "Var vänlig besvara frågan.",
  requiredInAllRowsError: "Var vänlig besvara frågorna på alla rader.",
  numericError: "Värdet ska vara numeriskt.",
  textMinLength: "Var vänlig ange minst {0} tecken.",
  minRowCountError: "Var vänlig fyll i minst {0} rader.",
  minSelectError: "Var vänlig välj åtminstone {0} varianter.",
  maxSelectError: "Var vänlig välj inte fler än {0} varianter.",
  numericMinMax:
    "'{0}' ska vara lika med eller mer än {1} samt lika med eller mindre än {2}",
  numericMin: "'{0}' ska vara lika med eller mer än {1}",
  numericMax: "'{0}' ska vara lika med eller mindre än {1}",
  invalidEmail: "Var vänlig ange en korrekt e-postadress.",
  urlRequestError: "Förfrågan returnerade felet '{0}'. {1}",
  urlGetChoicesError:
    "Antingen returnerade förfrågan ingen data eller så är egenskapen 'path' inte korrekt",
  exceedMaxSize: "Filstorleken får ej överstiga {0}.",
  otherRequiredError: "Var vänlig ange det andra värdet.",
  uploadingFile:
    "Din fil laddas upp. Var vänlig vänta några sekunder och försök sedan igen.",
  addRow: "Lägg till rad",
  removeRow: "Ta bort"
};

surveyLocalization.locales["sv"] = swedishSurveyStrings;
surveyLocalization.localeNames["sv"] = "svenska";

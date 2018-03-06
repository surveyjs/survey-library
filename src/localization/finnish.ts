import { surveyLocalization } from "../surveyStrings";

export var finnishSurveyStrings = {
  pagePrevText: "Edellinen",
  pageNextText: "Seuraava",
  completeText: "Valmis",
  otherItemText: "Muu (kuvaile)",
  progressText: "Sivu {0}/{1}",
  emptySurvey:
    "Tässä kyselyssä ei ole yhtäkään näkyvillä olevaa sivua tai kysymystä.",
  completingSurvey: "Kiitos kyselyyn vastaamisesta!",
  loadingSurvey: "Kyselyä ladataan palvelimelta...",
  optionsCaption: "Valitse...",
  requiredError: "Vastaa kysymykseen, kiitos.",
  numericError: "Arvon tulee olla numeerinen.",
  textMinLength: "Ole hyvä ja syötä vähintään {0} merkkiä.",
  minSelectError: "Ole hyvä ja valitse vähintään {0} vaihtoehtoa.",
  maxSelectError: "Ole hyvä ja valitse enintään {0} vaihtoehtoa.",
  numericMinMax:
    "'{0}' täytyy olla enemmän tai yhtä suuri kuin {1} ja vähemmän tai yhtä suuri kuin {2}",
  numericMin: "'{0}' täytyy olla enemmän tai yhtä suuri kuin {1}",
  numericMax: "'{0}' täytyy olla vähemmän tai yhtä suuri kuin {1}",
  invalidEmail: "Syötä validi sähköpostiosoite.",
  otherRequiredError: 'Ole hyvä ja syötä "Muu (kuvaile)"'
};

surveyLocalization.locales["fi"] = finnishSurveyStrings;
surveyLocalization.localeNames["fi"] = "suomalainen";

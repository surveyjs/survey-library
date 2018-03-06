import { surveyLocalization } from "../surveyStrings";

export var hungarianSurveyStrings = {
  pagePrevText: "Vissza",
  pageNextText: "Tovább",
  completeText: "Kész",
  otherItemText: "Egyéb (adja meg)",
  progressText: "{0}./{1} oldal",
  emptySurvey: "There is no visible page or question in the survey.",
  completingSurvey: "Köszönjük, hogy kitöltötte felmérésünket!",
  completingSurveyBefore: "Már kitöltötte a felmérést.",
  loadingSurvey: "Felmérés betöltése...",
  optionsCaption: "Válasszon...",
  value: "érték",
  requiredError: "Kérjük, válaszolja meg ezt a kérdést!",
  requiredInAllRowsError: "Kérjük adjon választ minden sorban!",
  numericError: "Az érték szám kell, hogy legyen!",
  textMinLength: "Adjon meg legalább {0} karaktert!",
  textMaxLength: "Legfeljebb {0} karaktert adjon meg!",
  textMinMaxLength: "Adjon meg legalább {0}, de legfeljebb {1} karaktert!",
  minRowCountError: "Töltsön ki minimum {0} sort!",
  minSelectError: "Válasszon ki legalább {0} lehetőséget!",
  maxSelectError: "Ne válasszon többet, mint {0} lehetőség!",
  numericMinMax:
    "'{0}' legyen nagyobb, vagy egyenlő, mint {1} és kisebb, vagy egyenlő, mint {2}!",
  numericMin: "'{0}' legyen legalább {1}!",
  numericMax: "The '{0}' ne legyen nagyobb, mint {1}!",
  invalidEmail: "Adjon meg egy valós email címet!",
  urlRequestError: "A lekérdezés hibával tért vissza: '{0}'. {1}",
  urlGetChoicesError:
    "A lekérdezés üres adattal tért vissza, vagy a 'path' paraméter helytelen.",
  exceedMaxSize: "A méret nem lehet nagyobb, mint {0}.",
  otherRequiredError: "Adja meg az egyéb értéket!",
  uploadingFile:
    "Feltöltés folyamatban. Várjon pár másodpercet, majd próbálja újra.",
  confirmDelete: "Törli ezt a rekordot?",
  keyDuplicationError: "Az értéknek egyedinek kell lennie.",
  addRow: "Sor hozzáadása",
  removeRow: "Eltávolítás",
  addPanel: "Új hozzáadása",
  removePanel: "Eltávolítás",
  choices_Item: "elem",
  matrix_column: "Oszlop",
  matrix_row: "Sor",
  savingData: "Eredmény mentése a szerverre...",
  savingDataError: "Egy hiba folytán nem tudtuk elmenteni az eredményt.",
  savingDataSuccess: "Eredmény sikeresen mentve!",
  saveAgainButton: "Próbálja újra"
};

surveyLocalization.locales["hu"] = hungarianSurveyStrings;
surveyLocalization.localeNames["hu"] = "magyar";

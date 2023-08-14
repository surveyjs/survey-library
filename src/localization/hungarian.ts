import { surveyLocalization } from "survey-core";

export var hungarianSurveyStrings = {
  pagePrevText: "Vissza",
  pageNextText: "Tovább",
  completeText: "Kész",
  previewText: "Előnézet",
  editText: "Szerkesztés",
  startSurveyText: "Rajt",
  otherItemText: "Egyéb (adja meg)",
  noneItemText: "Egyik sem",
  selectAllItemText: "Mindet kiválaszt",
  progressText: "{0}./{1} oldal",
  indexText: "{0} {1} közül",
  panelDynamicProgressText: "{0} / {1} rekord",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "Válaszolt kérdések: {0} / {1}",
  emptySurvey: "The survey doesn't contain visible pages or questions.",
  completingSurvey: "Köszönjük, hogy kitöltötte felmérésünket!",
  completingSurveyBefore: "Már kitöltötte a felmérést.",
  loadingSurvey: "Felmérés betöltése...",
  placeholder: "Válasszon...",
  ratingOptionsCaption: "Kiválaszt...",
  value: "érték",
  requiredError: "Kérjük, válaszolja meg ezt a kérdést!",
  requiredErrorInPanel: "Kérjük, válaszoljon legalább egy kérdésre.",
  requiredInAllRowsError: "Kérjük adjon választ minden sorban!",
  numericError: "Az érték szám kell, hogy legyen!",
  minError: "Az érték nem lehet kisebb, mint {0}",
  maxError: "Az érték nem lehet nagyobb, mint {0}",
  textMinLength: "Adjon meg legalább {0} karaktert!",
  textMaxLength: "Legfeljebb {0} karaktert adjon meg!",
  textMinMaxLength: "Adjon meg legalább {0}, de legfeljebb {1} karaktert!",
  minRowCountError: "Töltsön ki minimum {0} sort!",
  minSelectError: "Válasszon ki legalább {0} lehetőséget!",
  maxSelectError: "Ne válasszon többet, mint {0} lehetőség!",
  numericMinMax: "'{0}' legyen nagyobb, vagy egyenlő, mint {1} és kisebb, vagy egyenlő, mint {2}!",
  numericMin: "'{0}' legyen legalább {1}!",
  numericMax: "The '{0}' ne legyen nagyobb, mint {1}!",
  invalidEmail: "Adjon meg egy valós email címet!",
  invalidExpression: "A következő kifejezés: {0} vissza kell adnia az „igaz” értéket.",
  urlRequestError: "A lekérdezés hibával tért vissza: '{0}'. {1}",
  urlGetChoicesError: "A lekérdezés üres adattal tért vissza, vagy a 'path' paraméter helytelen.",
  exceedMaxSize: "A méret nem lehet nagyobb, mint {0}.",
  otherRequiredError: "Adja meg az egyéb értéket!",
  uploadingFile: "Feltöltés folyamatban. Várjon pár másodpercet, majd próbálja újra.",
  loadingFile: "Betöltés...",
  chooseFile: "Fájlok kiválasztása ...",
  noFileChosen: "Nincs kiválasztva fájl",
  fileDragAreaPlaceholder: "Dobjon ide egy fájlt, vagy kattintson az alábbi gombra a fájl betöltéséhez.",
  confirmDelete: "Törli ezt a rekordot?",
  keyDuplicationError: "Az értéknek egyedinek kell lennie.",
  addColumn: "Oszlop hozzáadása",
  addRow: "Sor hozzáadása",
  removeRow: "Eltávolítás",
  emptyRowsText: "Nincsenek sorok.",
  addPanel: "Új hozzáadása",
  removePanel: "Eltávolítás",
  choices_Item: "elem",
  matrix_column: "Oszlop",
  matrix_row: "Sor",
  multipletext_itemname: "SMS",
  savingData: "Eredmény mentése a szerverre...",
  savingDataError: "Egy hiba folytán nem tudtuk elmenteni az eredményt.",
  savingDataSuccess: "Eredmény sikeresen mentve!",
  saveAgainButton: "Próbálja újra",
  timerMin: "min",
  timerSec: "sec",
  timerSpentAll: "Ön {0} összeget költött ezen az oldalon, és összesen {1}.",
  timerSpentPage: "{0} összeget költött ezen az oldalon.",
  timerSpentSurvey: "Összesen {0} költött.",
  timerLimitAll: "Ön {0} / {1} összeget költött ezen az oldalon, és összesen {2} / {3}.",
  timerLimitPage: "Ön {0} / {1} összeget költött ezen az oldalon.",
  timerLimitSurvey: "Összesen {0} / {1} összeget költött el.",
  clearCaption: "Egyértelmű",
  signaturePlaceHolder: "Írja alá itt",
  chooseFileCaption: "Válassz fájlt",
  removeFileCaption: "Távolítsa el ezt a fájlt",
  booleanCheckedLabel: "Igen",
  booleanUncheckedLabel: "Nem",
  confirmRemoveFile: "Biztosan eltávolítja ezt a fájlt: {0}?",
  confirmRemoveAllFiles: "Biztosan el akarja távolítani az összes fájlt?",
  questionTitlePatternText: "Kérdés címe",
  modalCancelButtonText: "Érvénytelenít",
  modalApplyButtonText: "Alkalmaz",
  filterStringPlaceholder: "Írja be a kereséshez...",
  emptyMessage: "Nincs megjeleníthető adat",
  noEntriesText: "Még nincsenek bejegyzések.\nKattintson az alábbi gombra egy új bejegyzés hozzáadásához.",
  noEntriesReadonlyText: "Nincsenek bejegyzések.",
  more: "Több",
  tagboxDoneButtonCaption: "OKÉ",
  selectToRankEmptyRankedAreaText: "Minden választási lehetőség rangsorolva van",
  selectToRankEmptyUnrankedAreaText: "Húzza ide a választási lehetőségeket a rangsoroláshoz"
};

surveyLocalization.locales["hu"] = hungarianSurveyStrings;
surveyLocalization.localeNames["hu"] = "magyar";

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} {1} közül"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Kiválaszt..."
// minError: "The value should not be less than {0}" => "Az érték nem lehet kisebb, mint {0}"
// maxError: "The value should not be greater than {0}" => "Az érték nem lehet nagyobb, mint {0}"
// emptyRowsText: "There are no rows." => "Nincsenek sorok."
// multipletext_itemname: "text" => "SMS"
// signaturePlaceHolder: "Sign here" => "Írja alá itt"
// modalCancelButtonText: "Cancel" => "Érvénytelenít"
// modalApplyButtonText: "Apply" => "Alkalmaz"
// filterStringPlaceholder: "Type to search..." => "Írja be a kereséshez..."
// emptyMessage: "No data to display" => "Nincs megjeleníthető adat"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Még nincsenek bejegyzések.\nKattintson az alábbi gombra egy új bejegyzés hozzáadásához."
// noEntriesReadonlyText: "There are no entries." => "Nincsenek bejegyzések."
// more: "More" => "Több"
// tagboxDoneButtonCaption: "OK" => "OKÉ"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Minden választási lehetőség rangsorolva van"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Húzza ide a választási lehetőségeket a rangsoroláshoz"
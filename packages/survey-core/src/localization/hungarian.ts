import { setupLocale } from "survey-core";

export var hungarianSurveyStrings = {
  // "Previous"
  pagePrevText: "Vissza",
  // "Next"
  pageNextText: "Tovább",
  // "Complete"
  completeText: "Kész",
  // "Preview"
  previewText: "Előnézet",
  // "Edit"
  editText: "Szerkesztés",
  // "Start"
  startSurveyText: "Rajt",
  // [Auto-translated] "Please leave a comment"
  commentText: "Kérjük, írjon megjegyzést",
  // "Other (describe)"
  otherItemText: "Egyéb (adja meg)",
  // "None"
  noneItemText: "Egyik sem",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "A válaszadás megtagadása",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Nem tudom",
  // "Select All"
  selectAllItemText: "Mindet kiválaszt",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Az összes kijelölésének megszüntetése",
  // "Page {0} of {1}"
  progressText: "{0}./{1} oldal",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} {1} közül",
  // "{0} of {1}"
  panelDynamicProgressText: "{0} / {1} rekord",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Válaszolt kérdések: {0} / {1}",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "The survey doesn't contain any visible elements.",
  // "Thank you for completing the survey"
  completingSurvey: "Köszönjük, hogy kitöltötte felmérésünket!",
  // "You have already completed this survey."
  completingSurveyBefore: "Már kitöltötte a felmérést.",
  // "Loading Survey..."
  loadingSurvey: "Felmérés betöltése...",
  // "Select..."
  placeholder: "Válasszon...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Kiválaszt...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Kiválaszt...",
  // "value"
  value: "érték",
  // "Response required."
  requiredError: "Kérjük, válaszolja meg ezt a kérdést!",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Kérjük, válaszoljon legalább egy kérdésre.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Kérjük adjon választ minden sorban!",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Minden sornak egyedi értékkel kell rendelkeznie.",
  // "The value should be numeric."
  numericError: "Az érték szám kell, hogy legyen!",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Az érték nem lehet kisebb, mint {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Kérjük, adjon meg egy értéket, amely megfelel a {0} lépésméretének.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Az érték nem lehet nagyobb, mint {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Számok nem engedélyezettek.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Adjon meg legalább {0} karaktert!",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Legfeljebb {0} karaktert adjon meg!",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Adjon meg legalább {0}, de legfeljebb {1} karaktert!",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Töltsön ki minimum {0} sort!",
  // "Please select at least {0} option(s)."
  minSelectError: "Válasszon ki legalább {0} lehetőséget!",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Ne válasszon többet, mint {0} lehetőség!",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' legyen nagyobb, vagy egyenlő, mint {1} és kisebb, vagy egyenlő, mint {2}!",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' legyen legalább {1}!",
  // "The '{0}' should be at most {1}"
  numericMax: "The '{0}' ne legyen nagyobb, mint {1}!",
  // "Please enter a valid e-mail address."
  invalidEmail: "Adjon meg egy valós email címet!",
  // "The expression: {0} should return 'true'."
  invalidExpression: "A következő kifejezés: {0} vissza kell adnia az „igaz” értéket.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "A lekérdezés hibával tért vissza: '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "A lekérdezés üres adattal tért vissza, vagy a 'path' paraméter helytelen.",
  // "The file size should not exceed {0}."
  exceedMaxSize: "A méret nem lehet nagyobb, mint {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "A maximális fájlszám, amit feltölthetsz, {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "A fájlok nem tölthetők fel. Adjon hozzá egy kezelőt az \"onUploadFiles\" eseményhez.",
  // "Response required: enter another value."
  otherRequiredError: "Adja meg az egyéb értéket!",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Feltöltés folyamatban. Várjon pár másodpercet, majd próbálja újra.",
  // "Loading..."
  loadingFile: "Betöltés...",
  // "Choose file(s)..."
  chooseFile: "Fájlok kiválasztása ...",
  // "No file selected"
  noFileChosen: "Nincs kiválasztva fájl",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Dobjon ide egy fájlt, vagy kattintson az alábbi gombra a fájl betöltéséhez.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Törli ezt a rekordot?",
  // "This value should be unique."
  keyDuplicationError: "Az értéknek egyedinek kell lennie.",
  // "Add Column"
  addColumn: "Oszlop hozzáadása",
  // "Add Row"
  addRow: "Sor hozzáadása",
  // "Remove"
  removeRow: "Eltávolítás",
  // [Auto-translated] "There are no rows."
  noRowsText: "Nincsenek sorok.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "{rowIndex} sor",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Új hozzáadása",
  // "Remove"
  removePanel: "Eltávolítás",
  // [Auto-translated] "Show Details"
  showDetails: "Mutasd a részleteket",
  // [Auto-translated] "Hide Details"
  hideDetails: "Részletek elrejtése",
  // "item"
  choices_Item: "elem",
  // [Auto-translated] "Choice option"
  choices_Choice: "Választási lehetőség",
  // "Column"
  matrix_column: "Oszlop",
  // "Row"
  matrix_row: "Sor",
  // [Auto-translated] "text"
  multipletext_itemname: "SMS",
  // "The results are being saved on the server..."
  savingData: "Eredmény mentése a szerverre...",
  // "An error occurred and we could not save the results."
  savingDataError: "Egy hiba folytán nem tudtuk elmenteni az eredményt.",
  // "The results were saved successfully!"
  savingDataSuccess: "Eredmény sikeresen mentve!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "A válasz meghaladja a 64 KB-ot. Kérjük, csökkentse a fájl(ok) méretét, és próbálja újra, vagy lépjen kapcsolatba a felmérés tulajdonosával.",
  // "Try again"
  saveAgainButton: "Próbálja újra",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sec",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Ön {0} összeget költött ezen az oldalon, és összesen {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "{0} összeget költött ezen az oldalon.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Összesen {0} költött.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Ön {0} / {1} összeget költött ezen az oldalon, és összesen {2} / {3}.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Ön {0} / {1} összeget költött ezen az oldalon.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Összesen {0} / {1} összeget költött el.",
  // "Clear"
  clearCaption: "Törlés",
  // [Auto-translated] "Select"
  selectCaption: "Kiválaszt",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Írja alá itt",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Nincs aláírás",
  // "Select File"
  chooseFileCaption: "Válassz fájlt",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Fotó készítése",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Kattintson az alábbi gombra, hogy fényképet készítsen a fényképezőgéppel.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Húzzon át vagy válasszon ki egy fájlt, amelyet fel szeretne tölteni vagy fényképet szeretne készíteni a kamerával.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Fájl cseréje",
  // "Remove this file"
  removeFileCaption: "Távolítsa el ezt a fájlt",
  // "Yes"
  booleanCheckedLabel: "Igen",
  // "No"
  booleanUncheckedLabel: "Nem",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Biztosan eltávolítja ezt a fájlt: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Biztosan el akarja távolítani az összes fájlt?",
  // "Question Title"
  questionTitlePatternText: "Kérdés címe",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Érvénytelenít",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Alkalmaz",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Írja be a kereséshez...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Nincs megjeleníthető adat",
  // [Auto-translated] "Loading..."
  loadingPage: "Berakás...",
  // [Auto-translated] "Loading..."
  loadingData: "Berakás...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Még nincs nevezés.\nKattintson az alábbi gombra új bejegyzés hozzáadásához.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Nincs nevezés",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Új panel",
  // [Auto-translated] "More"
  more: "Több",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OKÉ",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Minden választás kiválasztásra kerül a rangsoroláshoz",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Húzza ide a választási lehetőségeket a rangsoroláshoz",
  // [Auto-translated] "OK"
  ok: "OKÉ",
  // [Auto-translated] "Cancel"
  cancel: "Érvénytelenít",
  // "Create \"{0}\" item..."
  createCustomItem: "\"{0}\" elem létrehozása...",
  // [Auto-translated] "Table of contents"
  toc: "Tartalomjegyzék",
  // [Auto-translated] "Progress bar"
  progressbar: "Folyamatjelző sáv"
};

setupLocale({ localeCode: "hu", strings: hungarianSurveyStrings, nativeName: "magyar", englishName: "Hungarian" });
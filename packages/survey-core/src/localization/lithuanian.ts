import { setupLocale } from "survey-core";

export var lithuaniaSurveyStrings = {
  // "Previous"
  pagePrevText: "Atgal",
  // "Next"
  pageNextText: "Toliau",
  // "Complete"
  completeText: "Baigti",
  // "Preview"
  previewText: "Peržiūra",
  // "Edit"
  editText: "Redaguoti",
  // "Start"
  startSurveyText: "Pradėti",
  // [Auto-translated] "Please leave a comment"
  commentText: "Prašome palikti komentarą",
  // "Other (describe)"
  otherItemText: "Kita (įvesti)",
  // "None"
  noneItemText: "Nėra",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Atsisakyti atsakyti",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Nežinau",
  // "Select All"
  selectAllItemText: "Pasirinkti visus",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Panaikinkite visų žymėjimą",
  // "Page {0} of {1}"
  progressText: "Puslapis {0} iš {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{1} {0}",
  // "{0} of {1}"
  panelDynamicProgressText: "Įrašyti {0} iš {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Skydelis {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Atsakė į {0} / {1} klausimus",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Apklausoje nėra matomo puslapio ar klausimo.",
  // "Thank you for completing the survey"
  completingSurvey: "Dėkojame už dalyvavimą apklausoje!",
  // "You have already completed this survey."
  completingSurveyBefore: "Mūsų įrašai rodo, kad jau atlikote šią apklausą.",
  // "Loading Survey..."
  loadingSurvey: "Prašome palaukti...",
  // "Select..."
  placeholder: "Pasirinkti...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Žymėti...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Žymėti...",
  // "value"
  value: "reikšmė",
  // "Response required."
  requiredError: "Būtina atsakyti į šį klausimą.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Būtina atsakyti bent į vieną klausimą.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Prašome atsakyti į klausimus visose eilutėse.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Kiekviena eilutė turi turėti unikalią reikšmę.",
  // "The value should be numeric."
  numericError: "Turi būti skaičiai.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Vertė neturėtų būti mažesnė nei {0}",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Vertė neturėtų būti didesnė nei {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Numeriai neleidžiami.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Prašome suvesti bent {0} simbolius.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Prašome suvesti mažiau nei {0} simbolių.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Prašome suvesti daugiau nei {0} ir mažiau nei {1} simbolių.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Prašome suvesti ne mažiau nei {0} eilučių.",
  // "Please select at least {0} option(s)."
  minSelectError: "Prašome pasirinkti bent {0} variantų.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Pasirinkite ne daugiau kaip {0} variantus.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' turi būti lygus arba didesnis nei {1} ir lygus arba mažesnis nei {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' turėtų būti lygus arba didesnis nei {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' turėtų būti lygus ar mažesnis už {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Prašome įvesti galiojantį elektroninio pašto adresą.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Reikšmė: {0} turi grąžinti 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Užklausa grąžino klaidą'{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Užklausa grąžino tuščius duomenis arba 'path' savybė yra neteisinga",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Failo dydis neturi viršyti {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Failų įkelti negalima. Pridėkite įvykio \"onUploadFiles\" tvarkytoją.",
  // "Response required: enter another value."
  otherRequiredError: "Įveskite kitą reikšmę.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Jūsų failas yra keliamas. Palaukite keletą sekundžių ir bandykite dar kartą.",
  // "Loading..."
  loadingFile: "Prašome palaukti...",
  // "Choose file(s)..."
  chooseFile: "Pasirinkti failą(us)...",
  // "No file selected"
  noFileChosen: "Nepasirinktas joks failas",
  // [Auto-translated] "Drag and drop a file here or click the button below and choose a file to upload."
  filePlaceholder: "Nuvilkite failą čia arba spustelėkite žemiau esantį mygtuką ir pasirinkite failą, kurį norite įkelti.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Ar norite ištrinti įrašą?",
  // "This value should be unique."
  keyDuplicationError: "Ši reikšmė turėtų būti unikali.",
  // "Add Column"
  addColumn: "Pridėti stulpelį",
  // "Add Row"
  addRow: "Pridėti eilutę",
  // "Remove"
  removeRow: "Ištrinti",
  // [Auto-translated] "There are no rows."
  noRowsText: "Eilių nėra.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Eilutė {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Pridėti naują",
  // "Remove"
  removePanel: "Ištrinti",
  // [Auto-translated] "Show Details"
  showDetails: "Rodyti išsamią informaciją",
  // [Auto-translated] "Hide Details"
  hideDetails: "Slėpti išsamią informaciją",
  // "item"
  choices_Item: "elementas",
  // [Auto-translated] "Choice option"
  choices_Choice: "Pasirinkimo galimybė",
  // "Column"
  matrix_column: "Stulpelis",
  // "Row"
  matrix_row: "Eilutė",
  // [Auto-translated] "text"
  multipletext_itemname: "SMS žinutė",
  // "The results are being saved on the server..."
  savingData: "Rezultatai saugomi serveryje...",
  // "An error occurred and we could not save the results."
  savingDataError: "Įvyko klaida ir mes negalėjome išsaugoti rezultatų.",
  // "The results were saved successfully!"
  savingDataSuccess: "Rezultatai buvo išsaugoti sėkmingai!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner."
  savingExceedSize: "Jūsų atsakymas viršija 64 KB. Sumažinkite failo (-ų) dydį ir bandykite dar kartą arba susisiekite su apklausos savininku.",
  // "Try again"
  saveAgainButton: "Bandyti dar kartą",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Praleidote {0} šiame puslapyje ir {1} iš viso.",
  // "You have spent {0} on this page."
  timerSpentPage: "Praleidote {0} šiame puslapyje.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Praleidote {0} iš viso.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Praleidote {0} iš {1} šiame puslapyje ir {2} iš {3} iš viso.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Praleidote {0} iš {1} šiame puslapyje.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Praleidote {0} iš {1} iš viso.",
  // "Clear"
  clearCaption: "Valyti",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Pasirašykite čia",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Nėra parašo",
  // "Select File"
  chooseFileCaption: "Pasirinkti failą",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Fotografuoti",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Spustelėkite žemiau esantį mygtuką, kad nufotografuotumėte fotoaparatu.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Nuvilkite arba pasirinkite failą, kurį norite įkelti arba nufotografuoti naudodami fotoaparatą.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Pakeiskite failą",
  // "Remove this file"
  removeFileCaption: "Ištrinti šį failą",
  // "Yes"
  booleanCheckedLabel: "Taip",
  // "No"
  booleanUncheckedLabel: "Ne",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Ar tikrai norite pašalinti šį failą: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Ar tikrai norite pašalinti visus failus?",
  // "Question Title"
  questionTitlePatternText: "Klausimo pavadinimas",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Atšaukti",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Vartoti",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Įveskite, kad ieškotumėte...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Nėra rodomų duomenų",
  // [Auto-translated] "Loading..."
  loadingPage: "Pakrovimo...",
  // [Auto-translated] "Loading..."
  loadingData: "Pakrovimo...",
  // [Auto-translated] "There are no entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Įrašų dar nėra.\nSpustelėkite žemiau esantį mygtuką, kad pridėtumėte naują įrašą.",
  // [Auto-translated] "There are no entries."
  noEntriesReadonlyText: "Įrašų nėra.",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Naujas skydelis",
  // [Auto-translated] "More"
  more: "Daugiau",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "GERAI",
  // [Auto-translated] "All choices are ranked"
  selectToRankEmptyRankedAreaText: "Visi pasirinkimai yra reitinguojami",
  // [Auto-translated] "Drag and drop choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Nuvilkite pasirinkimus čia, kad juos reitinguotumėte",
  // [Auto-translated] "OK"
  ok: "GERAI",
  // [Auto-translated] "Cancel"
  cancel: "Atšaukti",
  // "Create \"{0}\" item..."
  createCustomItem: "Sukurkite elementą \"{0}\"..."
};

setupLocale({ localeCode: "lt", strings: lithuaniaSurveyStrings, nativeName: "lietuvių", englishName: "Lithuanian" });
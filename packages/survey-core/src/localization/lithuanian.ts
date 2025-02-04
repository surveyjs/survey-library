import { setupLocale } from "survey-core";

export var lithuaniaSurveyStrings = {
  pagePrevText: "Atgal",
  pageNextText: "Toliau",
  completeText: "Baigti",
  previewText: "Peržiūra",
  editText: "Redaguoti",
  startSurveyText: "Pradėti",
  otherItemText: "Kita (įvesti)",
  noneItemText: "Nėra",
  refuseItemText: "Atsisakyti atsakyti",
  dontKnowItemText: "Nežinau",
  selectAllItemText: "Pasirinkti visus",
  deselectAllItemText: "Panaikinkite visų žymėjimą",
  progressText: "Puslapis {0} iš {1}",
  indexText: "{1} {0}",
  panelDynamicProgressText: "Įrašyti {0} iš {1}",
  panelDynamicTabTextFormat: "Skydelis {panelIndex}",
  questionsProgressText: "Atsakė į {0} / {1} klausimus",
  emptySurvey: "Apklausoje nėra matomo puslapio ar klausimo.",
  completingSurvey: "Dėkojame už dalyvavimą apklausoje!",
  completingSurveyBefore: "Mūsų įrašai rodo, kad jau atlikote šią apklausą.",
  loadingSurvey: "Prašome palaukti...",
  placeholder: "Pasirinkti...",
  ratingOptionsCaption: "Žymėti...",
  value: "reikšmė",
  requiredError: "Būtina atsakyti į šį klausimą.",
  requiredErrorInPanel: "Būtina atsakyti bent į vieną klausimą.",
  requiredInAllRowsError: "Prašome atsakyti į klausimus visose eilutėse.",
  eachRowUniqueError: "Kiekviena eilutė turi turėti unikalią reikšmę.",
  numericError: "Turi būti skaičiai.",
  minError: "Vertė neturėtų būti mažesnė nei {0}",
  maxError: "Vertė neturėtų būti didesnė nei {0}",
  textNoDigitsAllow: "Numeriai neleidžiami.",
  textMinLength: "Prašome suvesti bent {0} simbolius.",
  textMaxLength: "Prašome suvesti mažiau nei {0} simbolių.",
  textMinMaxLength: "Prašome suvesti daugiau nei {0} ir mažiau nei {1} simbolių.",
  minRowCountError: "Prašome suvesti ne mažiau nei {0} eilučių.",
  minSelectError: "Prašome pasirinkti bent {0} variantų.",
  maxSelectError: "Pasirinkite ne daugiau kaip {0} variantus.",
  numericMinMax: "'{0}' turi būti lygus arba didesnis nei {1} ir lygus arba mažesnis nei {2}",
  numericMin: "'{0}' turėtų būti lygus arba didesnis nei {1}",
  numericMax: "'{0}' turėtų būti lygus ar mažesnis už {1}",
  invalidEmail: "Prašome įvesti galiojantį elektroninio pašto adresą.",
  invalidExpression: "Reikšmė: {0} turi grąžinti 'true'.",
  urlRequestError: "Užklausa grąžino klaidą'{0}'. {1}",
  urlGetChoicesError: "Užklausa grąžino tuščius duomenis arba 'path' savybė yra neteisinga",
  exceedMaxSize: "Failo dydis neturi viršyti {0}.",
  noUploadFilesHandler: "Failų įkelti negalima. Pridėkite įvykio \"onUploadFiles\" tvarkytoją.",
  otherRequiredError: "Įveskite kitą reikšmę.",
  uploadingFile: "Jūsų failas yra keliamas. Palaukite keletą sekundžių ir bandykite dar kartą.",
  loadingFile: "Prašome palaukti...",
  chooseFile: "Pasirinkti failą(us)...",
  noFileChosen: "Nepasirinktas joks failas",
  filePlaceholder: "Nuvilkite failą čia arba spustelėkite žemiau esantį mygtuką ir pasirinkite failą, kurį norite įkelti.",
  confirmDelete: "Ar norite ištrinti įrašą?",
  keyDuplicationError: "Ši reikšmė turėtų būti unikali.",
  addColumn: "Pridėti stulpelį",
  addRow: "Pridėti eilutę",
  removeRow: "Ištrinti",
  noRowsText: "Eilių nėra.",
  addPanel: "Pridėti naują",
  removePanel: "Ištrinti",
  showDetails: "Rodyti išsamią informaciją",
  hideDetails: "Slėpti išsamią informaciją",
  choices_Item: "elementas",
  matrix_column: "Stulpelis",
  matrix_row: "Eilutė",
  multipletext_itemname: "SMS žinutė",
  savingData: "Rezultatai saugomi serveryje...",
  savingDataError: "Įvyko klaida ir mes negalėjome išsaugoti rezultatų.",
  savingDataSuccess: "Rezultatai buvo išsaugoti sėkmingai!",
  savingExceedSize: "Jūsų atsakymas viršija 64 KB. Sumažinkite failo (-ų) dydį ir bandykite dar kartą arba susisiekite su apklausos savininku.",
  saveAgainButton: "Bandyti dar kartą",
  timerMin: "min",
  timerSec: "sek",
  timerSpentAll: "Praleidote {0} šiame puslapyje ir {1} iš viso.",
  timerSpentPage: "Praleidote {0} šiame puslapyje.",
  timerSpentSurvey: "Praleidote {0} iš viso.",
  timerLimitAll: "Praleidote {0} iš {1} šiame puslapyje ir {2} iš {3} iš viso.",
  timerLimitPage: "Praleidote {0} iš {1} šiame puslapyje.",
  timerLimitSurvey: "Praleidote {0} iš {1} iš viso.",
  clearCaption: "Valyti",
  signaturePlaceHolder: "Pasirašykite čia",
  signaturePlaceHolderReadOnly: "Nėra parašo",
  chooseFileCaption: "Pasirinkti failą",
  takePhotoCaption: "Fotografuoti",
  photoPlaceholder: "Spustelėkite žemiau esantį mygtuką, kad nufotografuotumėte fotoaparatu.",
  fileOrPhotoPlaceholder: "Nuvilkite arba pasirinkite failą, kurį norite įkelti arba nufotografuoti naudodami fotoaparatą.",
  replaceFileCaption: "Pakeiskite failą",
  removeFileCaption: "Ištrinti šį failą",
  booleanCheckedLabel: "Taip",
  booleanUncheckedLabel: "Ne",
  confirmRemoveFile: "Ar tikrai norite pašalinti šį failą: {0}?",
  confirmRemoveAllFiles: "Ar tikrai norite pašalinti visus failus?",
  questionTitlePatternText: "Klausimo pavadinimas",
  modalCancelButtonText: "Atšaukti",
  modalApplyButtonText: "Vartoti",
  filterStringPlaceholder: "Įveskite, kad ieškotumėte...",
  emptyMessage: "Nėra rodomų duomenų",
  noEntriesText: "Įrašų dar nėra.\nSpustelėkite žemiau esantį mygtuką, kad pridėtumėte naują įrašą.",
  noEntriesReadonlyText: "Įrašų nėra.",
  tabTitlePlaceholder: "Naujas skydelis",
  more: "Daugiau",
  tagboxDoneButtonCaption: "GERAI",
  selectToRankEmptyRankedAreaText: "Visi pasirinkimai yra reitinguojami",
  selectToRankEmptyUnrankedAreaText: "Nuvilkite pasirinkimus čia, kad juos reitinguotumėte",
  ok: "GERAI",
  cancel: "Atšaukti"
};

setupLocale({ localeCode: "lt", strings: lithuaniaSurveyStrings, nativeName: "lietuvių", englishName: "Lithuanian" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{1} {0}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Skydelis {panelIndex}"
// ratingOptionsCaption: "Select..." => "Žymėti..."
// minError: "The value should not be less than {0}" => "Vertė neturėtų būti mažesnė nei {0}"
// maxError: "The value should not be greater than {0}" => "Vertė neturėtų būti didesnė nei {0}"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Nuvilkite failą čia arba spustelėkite žemiau esantį mygtuką ir pasirinkite failą, kurį norite įkelti."
// noRowsText: "There are no rows." => "Eilių nėra."
// multipletext_itemname: "text" => "SMS žinutė"
// signaturePlaceHolder: "Sign here" => "Pasirašykite čia"
// modalCancelButtonText: "Cancel" => "Atšaukti"
// modalApplyButtonText: "Apply" => "Vartoti"
// filterStringPlaceholder: "Type to search..." => "Įveskite, kad ieškotumėte..."
// emptyMessage: "No data to display" => "Nėra rodomų duomenų"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Įrašų dar nėra.\nSpustelėkite žemiau esantį mygtuką, kad pridėtumėte naują įrašą."
// noEntriesReadonlyText: "There are no entries." => "Įrašų nėra."
// more: "More" => "Daugiau"
// tagboxDoneButtonCaption: "OK" => "GERAI"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Visi pasirinkimai yra reitinguojami"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Nuvilkite pasirinkimus čia, kad juos reitinguotumėte"// takePhotoCaption: "Take Photo" => "Fotografuoti"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Spustelėkite žemiau esantį mygtuką, kad nufotografuotumėte fotoaparatu."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Nuvilkite arba pasirinkite failą, kurį norite įkelti arba nufotografuoti naudodami fotoaparatą."
// replaceFileCaption: "Replace file" => "Pakeiskite failą"// eachRowUniqueError: "Each row must have a unique value." => "Kiekviena eilutė turi turėti unikalią reikšmę."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Failų įkelti negalima. Pridėkite įvykio \"onUploadFiles\" tvarkytoją."
// showDetails: "Show Details" => "Rodyti išsamią informaciją"
// hideDetails: "Hide Details" => "Slėpti išsamią informaciją"
// ok: "OK" => "GERAI"
// cancel: "Cancel" => "Atšaukti"
// refuseItemText: "Refuse to answer" => "Atsisakyti atsakyti"
// dontKnowItemText: "Don't know" => "Nežinau"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Jūsų atsakymas viršija 64 KB. Sumažinkite failo (-ų) dydį ir bandykite dar kartą arba susisiekite su apklausos savininku."
// signaturePlaceHolderReadOnly: "No signature" => "Nėra parašo"// tabTitlePlaceholder: "New Panel" => "Naujas skydelis"// deselectAllItemText: "Deselect all" => "Panaikinkite visų žymėjimą"
// textNoDigitsAllow: "Numbers are not allowed." => "Numeriai neleidžiami."
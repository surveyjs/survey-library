import { setupLocale } from "survey-core";

export var estonianSurveyStrings = {
  // "Previous"
  pagePrevText: "Tagasi",
  // "Next"
  pageNextText: "Edasi",
  // "Complete"
  completeText: "Lõpeta",
  // "Preview"
  previewText: "Eelvaade",
  // "Edit"
  editText: "Muuda",
  // "Start"
  startSurveyText: "Alusta",
  // [Auto-translated] "Please leave a comment"
  commentText: "Palun jäta kommentaar",
  // "Other (describe)"
  otherItemText: "Muu (täpsusta)",
  // "None"
  noneItemText: "Mitte midagi",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Keeldu vastamast",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Ei tea",
  // "Select All"
  selectAllItemText: "Vali kõik",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Kõigi valiku tühistamine",
  // "Page {0} of {1}"
  progressText: "Lehekülg {0}/{1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Kirje {0}/{1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Paneel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Vastatud {0} küsimust {1}-st",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Selles uuringus ei ole ühtki nähtavat lehekülge või küsimust.",
  // "Thank you for completing the survey"
  completingSurvey: "Aitäh, et vastasid ankeedile!",
  // "You have already completed this survey."
  completingSurveyBefore: "Meie andmetel oled sa sellele ankeedile juba vastanud.",
  // "Loading Survey..."
  loadingSurvey: "Laen ankeeti...",
  // "Select..."
  placeholder: "Vali...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Valima...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Valima...",
  // "value"
  value: "väärtus",
  // "Response required."
  requiredError: "Palun vasta küsimusele.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Palun vasta vähemalt ühele küsimusele.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Palun anna vastus igal real.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Igal real peab olema kordumatu väärtus.",
  // "The value should be numeric."
  numericError: "See peaks olema numbriline väärtus.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Väärtus ei tohiks olla väiksem kui {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Sisestage väärtus, mis vastab {0} sammu suurusele.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Väärtus ei tohiks olla suurem kui {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Numbrid ei ole lubatud.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Palun sisesta vähemalt {0} tähemärki.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Palun ära sisesta rohkem kui {0} tähemärki.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Sisesta palun {0} - {1} tähemärki.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Sisesta plaun vähemalt {0} rida.",
  // "Please select at least {0} option(s)."
  minSelectError: "Palun vali vähemalt {0} varianti.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Palun vali kõige rohkem {0} varianti.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' peaks olema võrdne või suurem kui {1} ja võrdne või väiksem kui {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' peaks olema võrdne või suurem kui {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' peaks olema võrnde või väiksem kui {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Sisesta palun korrektne e-posti aadress.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Avaldis: {0} peaks tagastama tõese.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Taotlus tagastas vea „{0}”. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Taotlus tagastas tühjad andmed või atribuut 'path' on vale",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Faili suurus ei tohi ületada {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Maksimaalne failide arv, mida saad üles laadida, on {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Faile ei saa üles laadida. Palun lisage sündmuse \"onUploadFiles\" jaoks käitleja.",
  // "Response required: enter another value."
  otherRequiredError: "Sisesta palun muu vastus.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Sinu fail laeb üles. Palun oota mõned sekundid ning proovi seejärel uuesti.",
  // "Loading..."
  loadingFile: "Laen...",
  // "Choose file(s)..."
  chooseFile: "Vali fail(id)...",
  // "No file selected"
  noFileChosen: "Faili pole valitud",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Pukseerige fail siia või klõpsake alloleval nupul, et valida üleslaaditav fail.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Kas tahad kirje kustutada?",
  // "This value should be unique."
  keyDuplicationError: "See väärtus peab olema unikaalne.",
  // "Add Column"
  addColumn: "Lisa veerg",
  // "Add Row"
  addRow: "Lisa rida",
  // "Remove"
  removeRow: "Eemalda",
  // [Auto-translated] "There are no rows."
  noRowsText: "Ridu pole.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Rida {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Lisa uus",
  // "Remove"
  removePanel: "Eemalda",
  // [Auto-translated] "Show Details"
  showDetails: "Näita detaile",
  // [Auto-translated] "Hide Details"
  hideDetails: "Peida üksikasjad",
  // "item"
  choices_Item: "üksus",
  // [Auto-translated] "Choice option"
  choices_Choice: "Valiku valik",
  // "Column"
  matrix_column: "Veerg",
  // "Row"
  matrix_row: "Rida",
  // [Auto-translated] "text"
  multipletext_itemname: "Tekst",
  // "The results are being saved on the server..."
  savingData: "Salvestan andmed serveris...",
  // "An error occurred and we could not save the results."
  savingDataError: "Tekkis viga ning me ei saanud vastuseid salvestada.",
  // "The results were saved successfully!"
  savingDataSuccess: "Vastuste salvestamine õnnestus!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Teie vastus ületab 64 KB. Vähendage oma faili(de) mahtu ja proovige uuesti või võtke ühendust uuringu omanikuga.",
  // "Try again"
  saveAgainButton: "Proovi uuesti",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Oled veetnud {0} sellel lehel ning kokku {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Oled veetnud {0} sellel lehel.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Oled veetnud {0} kokku.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Oled kulutanud {0} võimalikust {1} sellel lehel ning {2} võimalikust {3} kokku.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Oled kulutanud {0} võimalikust {1} sellel lehel.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Oled kulutanud {0} võimalikust {1} koguajast.",
  // "Clear"
  clearCaption: "Puhasta",
  // [Auto-translated] "Select"
  selectCaption: "Valima",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Allkirjasta siin",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Allkiri puudub",
  // "Select File"
  chooseFileCaption: "Vali fail",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Pildistamine",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Kaamera abil pildistamiseks klõpsake allolevat nuppu.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Pukseerige või valige üleslaaditav fail või pildistage seda kaamera abil.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Asenda fail",
  // "Remove this file"
  removeFileCaption: "Eemalda see fail",
  // "Yes"
  booleanCheckedLabel: "Jah",
  // "No"
  booleanUncheckedLabel: "Ei",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Oled sa kindel, et soovid selle faili eemaldada: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Oled sa kindel, et soovid eemaldada kõik failid?",
  // "Question Title"
  questionTitlePatternText: "Küsimuse pealkiri",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Tühistama",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Kohaldata",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Tippige otsimiseks...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Kuvatavaid andmeid pole",
  // [Auto-translated] "Loading..."
  loadingPage: "Laadimise...",
  // [Auto-translated] "Loading..."
  loadingData: "Laadimise...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Sissekandeid veel pole.\nUue kirje lisamiseks klõpsake alloleval nupul.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Sissekandeid pole",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Uus paneel",
  // [Auto-translated] "More"
  more: "Rohkem",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Kõik valikud valitakse järjestamiseks",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Lohistage valikud siia, et neid järjestada",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Tühistama",
  // "Create \"{0}\" item..."
  createCustomItem: "Looge üksus \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Sisukord",
  // [Auto-translated] "Progress bar"
  progressbar: "Edenemisriba"
};

setupLocale({ localeCode: "et", strings: estonianSurveyStrings, nativeName: "eesti keel", englishName: "Estonian" });
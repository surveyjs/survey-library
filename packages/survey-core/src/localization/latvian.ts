import { setupLocale } from "survey-core";

export var latvianSurveyStrings = {
  // "Previous"
  pagePrevText: "Iepriekšēja lapa",
  // "Next"
  pageNextText: "Nākamā lapa",
  // "Complete"
  completeText: "Iesniegt",
  // "Preview"
  previewText: "Priekšskatījums",
  // "Edit"
  editText: "Rediģēt",
  // "Start"
  startSurveyText: "Sākt",
  // [Auto-translated] "Please leave a comment"
  commentText: "Lūdzu, atstājiet komentāru",
  // "Other (describe)"
  otherItemText: "Cits (lūdzu, aprakstiet!)",
  // "None"
  noneItemText: "Nav",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Atteikties atbildēt",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Es nezinu",
  // "Select All"
  selectAllItemText: "Izvēlēties visus",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Noņemt atlasi visiem",
  // "Page {0} of {1}"
  progressText: "{0}. lapa no {1}",
  // "{0} of {1}"
  indexText: "{0} no {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Ierakstīt {0} no {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panelis {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Atbildēts uz {0} / {1} jautājumiem",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Nav neviena jautājuma.",
  // "Thank you for completing the survey"
  completingSurvey: "Pateicamies Jums par anketas aizpildīšanu!",
  // "You have already completed this survey."
  completingSurveyBefore: "Mūsu ieraksti liecina, ka Jūs jau esat aizpildījis šo aptauju.",
  // "Loading Survey..."
  loadingSurvey: "Ielāde no servera...",
  // "Select..."
  placeholder: "Izvēlēties...",
  // "Select..."
  ratingOptionsCaption: "Nospiediet šeit, lai novērtētu...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Atlasiet...",
  // "value"
  value: "value",
  // "Response required."
  requiredError: "Lūdzu, atbildiet uz jautājumu!",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Lūdzu, atbildiet uz vismaz vienu jautājumu.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Lūdzu, atbildiet uz jautājumiem visās rindās.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Katrai rindai jābūt unikālai vērtībai.",
  // "The value should be numeric."
  numericError: "Atbildei ir jābūt skaitlim.",
  // "The value should not be less than {0}"
  minError: "Vērtība nedrīkst būt mazāka par {0}",
  // "The value should not be greater than {0}"
  maxError: "Vērtība nedrīkst būt lielāka par {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Numuri nav atļauti.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Lūdzu, ievadiet vismaz {0} simbolus.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Lūdzu, ievadiet mazāk nekā {0} rakstzīmes.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Lūdzu, ievadiet vairāk nekā {0} rakstzīmes un mazāk nekā {1} rakstzīmes.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Lūdzu, aizpildiet vismaz {0} rindas.",
  // "Please select at least {0} option(s)."
  minSelectError: "Lūdzu, izvēlieties vismaz {0} variantu.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Lūdzu, izvēlieties ne vairak par {0} variantiem.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' jābūt vienādam vai lielākam nekā {1}, un vienādam vai mazākam, nekā {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' jābūt vienādam vai lielākam {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' jābūt vienādam vai lielākam {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Lūdzu, ievadiet pareizu e-pasta adresi!",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Izteicienam: {0} jāatgriež “true”.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Pieprasījumā tika atgriezta kļūda “{0}”. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Pieprasījums atgrieza tukšus datus vai rekvizīts “path” ir nepareizs",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Faila lielums nedrīkst pārsniegt {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Failus nevar augšupielādēt. Lūdzu, pievienojiet apdarinātāju notikumam \"onUploadFiles\".",
  // "Response required: enter another value."
  otherRequiredError: "Lūdzu, ievadiet datus laukā 'Cits'",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Jūsu fails tiek augšupielādēts. Lūdzu, uzgaidiet dažas sekundes un mēģiniet vēlreiz.",
  // "Loading..."
  loadingFile: "Notiek ielāde ...",
  // "Choose file(s)..."
  chooseFile: "Izvēlieties failus ...",
  // "No file selected"
  noFileChosen: "Nav izvēlēts neviens fails",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Lai pievienotu, ievelciet failu šeit vai arī klikšķiniet uz zemāk redzamās pogas",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Vai vēlaties izdzēst ierakstu?",
  // "This value should be unique."
  keyDuplicationError: "Šai vērtībai jābūt unikālai.",
  // "Add Column"
  addColumn: "Pievienot kolonnu",
  // "Add Row"
  addRow: "Pievienot rindu",
  // "Remove"
  removeRow: "Noņemt",
  // "There are no rows."
  noRowsText: "Nav rindu.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Rinda {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Pievieno jaunu",
  // "Remove"
  removePanel: "Noņemt",
  // [Auto-translated] "Show Details"
  showDetails: "Rādīt detalizētu informāciju",
  // [Auto-translated] "Hide Details"
  hideDetails: "Slēpt detaļas",
  // "item"
  choices_Item: "vienums",
  // [Auto-translated] "Choice option"
  choices_Choice: "Izvēles iespēja",
  // "Column"
  matrix_column: "Sleja",
  // "Row"
  matrix_row: "Rinda",
  // "text"
  multipletext_itemname: "teksts",
  // "The results are being saved on the server..."
  savingData: "Rezultāti tiek saglabāti serverī ...",
  // "An error occurred and we could not save the results."
  savingDataError: "Radās kļūda, un mēs nevarējām saglabāt rezultātus.",
  // "The results were saved successfully!"
  savingDataSuccess: "Rezultāti tika veiksmīgi saglabāti!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Jūsu atbilde pārsniedz 64 KB. Lūdzu, samaziniet faila(-u) lielumu un mēģiniet vēlreiz vai sazinieties ar aptaujas īpašnieku.",
  // "Try again"
  saveAgainButton: "Mēģiniet vēlreiz",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Šajā lapā esat iztērējis {0} un kopā {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Šajā lapā esat iztērējis {0}.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Kopā esat iztērējis {0}.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Šajā lapā esat iztērējis {0} no {1} un kopā {2} no {3}.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Šajā lapā esat iztērējis {0} no {1}.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Kopā esat iztērējis {0} no {1}.",
  // "Clear"
  clearCaption: "Iztīrīt",
  // [Auto-translated] "Select"
  selectCaption: "Atlasiet",
  // "Sign here"
  signaturePlaceHolder: "Parakstieties šeit",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Nav paraksta",
  // "Select File"
  chooseFileCaption: "Izvēlēties failu",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Uzņemt fotoattēlu",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Noklikšķiniet uz pogas zemāk, lai uzņemtu fotoattēlu, izmantojot kameru.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Velciet un nometiet vai atlasiet failu, ko augšupielādēt vai uzņemt fotoattēlu, izmantojot kameru.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Aizstāt failu",
  // "Remove this file"
  removeFileCaption: "Noņemiet šo failu",
  // "Yes"
  booleanCheckedLabel: "Jā",
  // "No"
  booleanUncheckedLabel: "Nē",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Vai tiešām vēlaties noņemt šo failu: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Vai tiešām vēlaties noņemt visus failus?",
  // "Question Title"
  questionTitlePatternText: "Jautājuma nosaukums",
  // "Cancel"
  modalCancelButtonText: "Atcelt",
  // "Apply"
  modalApplyButtonText: "Pielietot",
  // "Type to search..."
  filterStringPlaceholder: "Ierakstiet, lai meklētu...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Nav datu, ko rādīt",
  // [Auto-translated] "Loading..."
  loadingPage: "Iekraušanas...",
  // [Auto-translated] "Loading..."
  loadingData: "Iekraušanas...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Vēl nav neviena ieraksta.\nNoklikšķiniet uz zemāk esošās pogas, lai pievienotu jaunu ierakstu.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Nav ierakstu",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Jauns panelis",
  // [Auto-translated] "More"
  more: "Vairāk",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "LABI",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Visas izvēles tiek atlasītas ranžēšanai",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Velciet izvēles šeit, lai tās sakārtotu",
  // [Auto-translated] "OK"
  ok: "LABI",
  // [Auto-translated] "Cancel"
  cancel: "Atcelt",
  // "Create \"{0}\" item..."
  createCustomItem: "Izveidot vienumu \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Satura rādītājs",
  // [Auto-translated] "Progress bar"
  progressbar: "Progresa josla"
};

setupLocale({ localeCode: "lv", strings: latvianSurveyStrings, nativeName: "latviešu", englishName: "Latvian" });
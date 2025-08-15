import { setupLocale } from "survey-core";

export var icelandicSurveyStrings = {
  // "Previous"
  pagePrevText: "Tilbaka",
  // "Next"
  pageNextText: "Áfram",
  // "Complete"
  completeText: "Lokið",
  // "Preview"
  previewText: "Forskoða",
  // "Edit"
  editText: "Breyta",
  // "Start"
  startSurveyText: "Byrjaðu",
  // [Auto-translated] "Please leave a comment"
  commentText: "Vinsamlegast skildu eftir athugasemd",
  // "Other (describe)"
  otherItemText: "Hinn (skýring)",
  // "None"
  noneItemText: "Enginn",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Neita að svara",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Veit ekki",
  // "Select All"
  selectAllItemText: "Velja allt",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Afveljið allt",
  // "Page {0} of {1}"
  progressText: "Síða {0} of {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} af {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Taka upp {0} af {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Pallborð {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Svarað {0} / {1} spurningum",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Það er enginn síða eða spurningar í þessari könnun.",
  // "Thank you for completing the survey"
  completingSurvey: "Takk fyrir að fyllja út þessa könnun!",
  // "You have already completed this survey."
  completingSurveyBefore: "Skrár okkar sýna að þú hefur þegar lokið þessari könnun.",
  // "Loading Survey..."
  loadingSurvey: "Könnunin er að hlaða...",
  // "Select..."
  placeholder: "Veldu...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Velja...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Velja...",
  // "value"
  value: "gildi",
  // "Response required."
  requiredError: "Vinsamlegast svarið spurningunni.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Vinsamlegast svaraðu að minnsta kosti einni spurningu.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Vinsamlegast svarið spurningum í öllum röðum.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Hver lína verður að hafa einstakt gildi.",
  // "The value should be numeric."
  numericError: "Þetta gildi verður að vera tala.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Gildið má ekki vera lægra en {0}",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Gildið má ekki vera hærra en {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Tölur eru ekki leyfðar.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Það ætti að vera minnst {0} tákn.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Það ætti að vera mest {0} tákn.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Það ætti að vera fleiri en {0} og færri en {1} tákn.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Vinsamlegast fyllið úr að minnsta kosti {0} raðir.",
  // "Please select at least {0} option(s)."
  minSelectError: "Vinsamlegast veljið að minnsta kosti {0} möguleika.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Vinsamlegast veljið ekki fleiri en {0} möguleika.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' ætti að vera meira en eða jafnt og {1} minna en eða jafnt og {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "{0}' ætti að vera meira en eða jafnt og {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' ætti að vera minna en eða jafnt og {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Vinsamlegast sláið inn gilt netfang.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Tjáningin: {0} ætti að skila 'satt'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Beiðninn skilaði eftirfaranadi villu '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Beiðninng skilaði engum gögnum eða slóðinn var röng",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Skráinn skal ekki vera stærri en {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Ekki er hægt að hlaða upp skrám. Vinsamlegast bættu við rekli fyrir 'onUploadFiles' atvikið.",
  // "Response required: enter another value."
  otherRequiredError: "Vinamlegast fyllið út hitt gildið.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Skráinn þín var send. Vinsamlegast bíðið í nokkrar sekúndur og reynið aftur.",
  // "Loading..."
  loadingFile: "Hleður ...",
  // "Choose file(s)..."
  chooseFile: "Veldu skrár ...",
  // "No file selected"
  noFileChosen: "Engin skrá valin",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Dragðu og slepptu skrá hér eða smelltu á hnappinn hér að neðan til að velja skrá til að hlaða upp.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Viltu eyða skránni?",
  // "This value should be unique."
  keyDuplicationError: "Þetta gildi ætti að vera einstakt.",
  // "Add Column"
  addColumn: "Bæta við dálki",
  // "Add Row"
  addRow: "Bæta við röð",
  // "Remove"
  removeRow: "Fjarlægja",
  // [Auto-translated] "There are no rows."
  noRowsText: "Það eru engar raðir.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Röð {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Bæta við nýju",
  // "Remove"
  removePanel: "Fjarlægðu",
  // [Auto-translated] "Show Details"
  showDetails: "Sýna upplýsingar",
  // [Auto-translated] "Hide Details"
  hideDetails: "Fela upplýsingar",
  // "item"
  choices_Item: "hlutur",
  // [Auto-translated] "Choice option"
  choices_Choice: "Valmöguleiki",
  // "Column"
  matrix_column: "Dálkur",
  // "Row"
  matrix_row: "Röð",
  // [Auto-translated] "text"
  multipletext_itemname: "Texti",
  // "The results are being saved on the server..."
  savingData: "Niðurstöðurnar eru að spara á netþjóninum ... ",
  // "An error occurred and we could not save the results."
  savingDataError: "Villa kom upp og við gátum ekki vistað niðurstöðurnar.",
  // "The results were saved successfully!"
  savingDataSuccess: "Árangurinn var vistaður með góðum árangri!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Svar þitt fer yfir 64KB. Vinsamlegast minnkaðu stærð skráa þinna og reyndu aftur eða hafðu samband við eiganda könnunarinnar.",
  // "Try again"
  saveAgainButton: "Reyndu aftur",
  // "min"
  timerMin: "mín",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Þú hefur eytt {0} á þessari síðu og {1} samtals.",
  // "You have spent {0} on this page."
  timerSpentPage: "Þú hefur eytt {0} á þessari síðu.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Þú hefur eytt {0} samtals.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Þú hefur eytt {0} af {1} á þessari síðu og {2} af {3} samtals.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Þú hefur eytt {0} af {1} á þessari síðu.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Þú hefur eytt {0} af {1} samtals.",
  // "Clear"
  clearCaption: "Hreinsa",
  // [Auto-translated] "Select"
  selectCaption: "Velja",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Kvittađu hér",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Engin undirskrift",
  // "Select File"
  chooseFileCaption: "Veldu skrá",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Taka mynd",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Smelltu á hnappinn hér að neðan til að taka mynd með myndavélinni.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Dragðu og slepptu eða veldu skrá til að hlaða upp eða taka mynd með myndavélinni.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Skipta út skrá",
  // "Remove this file"
  removeFileCaption: "Fjarlægðu þessa skrá",
  // "Yes"
  booleanCheckedLabel: "Já",
  // "No"
  booleanUncheckedLabel: "Nei",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Ertu viss um að þú viljir fjarlægja þessa skrá: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Ertu viss um að þú viljir fjarlægja allar skrár?",
  // "Question Title"
  questionTitlePatternText: "Spurningartitill",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Afturkalla",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Nota",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Sláðu inn til að leita...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Engin gögn til að birta",
  // [Auto-translated] "Loading..."
  loadingPage: "Hleðsla...",
  // [Auto-translated] "Loading..."
  loadingData: "Hleðsla...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Engar færslur ennþá.\nSmelltu á hnappinn hér að neðan til að bæta við nýrri færslu.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Engar færslur",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nýtt spjald",
  // [Auto-translated] "More"
  more: "Fleiri",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "ÓKEI",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Allir valkostir eru valdir til röðunar",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Dragðu val hér til að raða þeim",
  // [Auto-translated] "OK"
  ok: "ÓKEI",
  // [Auto-translated] "Cancel"
  cancel: "Afturkalla",
  // "Create \"{0}\" item..."
  createCustomItem: "Búðu til \"{0}\" hlut...",
  // [Auto-translated] "Table of contents"
  toc: "Efnisyfirlit",
  // [Auto-translated] "Progress bar"
  progressbar: "Framvindustika"
};

setupLocale({ localeCode: "is", strings: icelandicSurveyStrings, nativeName: "íslenska", englishName: "Icelandic" });
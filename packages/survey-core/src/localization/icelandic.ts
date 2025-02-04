import { setupLocale } from "survey-core";

export var icelandicSurveyStrings = {
  pagePrevText: "Tilbaka",
  pageNextText: "Áfram",
  completeText: "Lokið",
  previewText: "Forskoða",
  editText: "Breyta",
  startSurveyText: "Byrjaðu",
  otherItemText: "Hinn (skýring)",
  noneItemText: "Enginn",
  refuseItemText: "Neita að svara",
  dontKnowItemText: "Veit ekki",
  selectAllItemText: "Velja allt",
  deselectAllItemText: "Afveljið allt",
  progressText: "Síða {0} of {1}",
  indexText: "{0} af {1}",
  panelDynamicProgressText: "Taka upp {0} af {1}",
  panelDynamicTabTextFormat: "Pallborð {panelIndex}",
  questionsProgressText: "Svarað {0} / {1} spurningum",
  emptySurvey: "Það er enginn síða eða spurningar í þessari könnun.",
  completingSurvey: "Takk fyrir að fyllja út þessa könnun!",
  completingSurveyBefore: "Skrár okkar sýna að þú hefur þegar lokið þessari könnun.",
  loadingSurvey: "Könnunin er að hlaða...",
  placeholder: "Veldu...",
  ratingOptionsCaption: "Velja...",
  value: "gildi",
  requiredError: "Vinsamlegast svarið spurningunni.",
  requiredErrorInPanel: "Vinsamlegast svaraðu að minnsta kosti einni spurningu.",
  requiredInAllRowsError: "Vinsamlegast svarið spurningum í öllum röðum.",
  eachRowUniqueError: "Hver lína verður að hafa einstakt gildi.",
  numericError: "Þetta gildi verður að vera tala.",
  minError: "Gildið má ekki vera lægra en {0}",
  maxError: "Gildið má ekki vera hærra en {0}",
  textNoDigitsAllow: "Tölur eru ekki leyfðar.",
  textMinLength: "Það ætti að vera minnst {0} tákn.",
  textMaxLength: "Það ætti að vera mest {0} tákn.",
  textMinMaxLength: "Það ætti að vera fleiri en {0} og færri en {1} tákn.",
  minRowCountError: "Vinsamlegast fyllið úr að minnsta kosti {0} raðir.",
  minSelectError: "Vinsamlegast veljið að minnsta kosti {0} möguleika.",
  maxSelectError: "Vinsamlegast veljið ekki fleiri en {0} möguleika.",
  numericMinMax: "'{0}' ætti að vera meira en eða jafnt og {1} minna en eða jafnt og {2}",
  numericMin: "{0}' ætti að vera meira en eða jafnt og {1}",
  numericMax: "'{0}' ætti að vera minna en eða jafnt og {1}",
  invalidEmail: "Vinsamlegast sláið inn gilt netfang.",
  invalidExpression: "Tjáningin: {0} ætti að skila 'satt'.",
  urlRequestError: "Beiðninn skilaði eftirfaranadi villu '{0}'. {1}",
  urlGetChoicesError: "Beiðninng skilaði engum gögnum eða slóðinn var röng",
  exceedMaxSize: "Skráinn skal ekki vera stærri en {0}.",
  noUploadFilesHandler: "Ekki er hægt að hlaða upp skrám. Vinsamlegast bættu við rekli fyrir 'onUploadFiles' atvikið.",
  otherRequiredError: "Vinamlegast fyllið út hitt gildið.",
  uploadingFile: "Skráinn þín var send. Vinsamlegast bíðið í nokkrar sekúndur og reynið aftur.",
  loadingFile: "Hleður ...",
  chooseFile: "Veldu skrár ...",
  noFileChosen: "Engin skrá valin",
  filePlaceholder: "Dragðu og slepptu skrá hér eða smelltu á hnappinn hér að neðan og veldu skrá til að hlaða upp.",
  confirmDelete: "Viltu eyða skránni?",
  keyDuplicationError: "Þetta gildi ætti að vera einstakt.",
  addColumn: "Bæta við dálki",
  addRow: "Bæta við röð",
  removeRow: "Fjarlægja",
  noRowsText: "Það eru engar raðir.",
  addPanel: "Bæta við nýju",
  removePanel: "Fjarlægðu",
  showDetails: "Sýna upplýsingar",
  hideDetails: "Fela upplýsingar",
  choices_Item: "hlutur",
  matrix_column: "Dálkur",
  matrix_row: "Röð",
  multipletext_itemname: "Texti",
  savingData: "Niðurstöðurnar eru að spara á netþjóninum ... ",
  savingDataError: "Villa kom upp og við gátum ekki vistað niðurstöðurnar.",
  savingDataSuccess: "Árangurinn var vistaður með góðum árangri!",
  savingExceedSize: "Svar þitt fer yfir 64KB. Vinsamlegast minnkaðu stærð skráa þinna og reyndu aftur eða hafðu samband við eiganda könnunarinnar.",
  saveAgainButton: "Reyndu aftur",
  timerMin: "mín",
  timerSec: "sek",
  timerSpentAll: "Þú hefur eytt {0} á þessari síðu og {1} samtals.",
  timerSpentPage: "Þú hefur eytt {0} á þessari síðu.",
  timerSpentSurvey: "Þú hefur eytt {0} samtals.",
  timerLimitAll: "Þú hefur eytt {0} af {1} á þessari síðu og {2} af {3} samtals.",
  timerLimitPage: "Þú hefur eytt {0} af {1} á þessari síðu.",
  timerLimitSurvey: "Þú hefur eytt {0} af {1} samtals.",
  clearCaption: "Hreinsa",
  signaturePlaceHolder: "Kvittađu hér",
  signaturePlaceHolderReadOnly: "Engin undirskrift",
  chooseFileCaption: "Veldu skrá",
  takePhotoCaption: "Taka mynd",
  photoPlaceholder: "Smelltu á hnappinn hér að neðan til að taka mynd með myndavélinni.",
  fileOrPhotoPlaceholder: "Dragðu og slepptu eða veldu skrá til að hlaða upp eða taka mynd með myndavélinni.",
  replaceFileCaption: "Skipta út skrá",
  removeFileCaption: "Fjarlægðu þessa skrá",
  booleanCheckedLabel: "Já",
  booleanUncheckedLabel: "Nei",
  confirmRemoveFile: "Ertu viss um að þú viljir fjarlægja þessa skrá: {0}?",
  confirmRemoveAllFiles: "Ertu viss um að þú viljir fjarlægja allar skrár?",
  questionTitlePatternText: "Spurningartitill",
  modalCancelButtonText: "Afturkalla",
  modalApplyButtonText: "Nota",
  filterStringPlaceholder: "Sláðu inn til að leita...",
  emptyMessage: "Engin gögn til að birta",
  noEntriesText: "Það eru engar færslur ennþá.\nSmelltu á hnappinn hér að neðan til að bæta við nýrri færslu.",
  noEntriesReadonlyText: "Það eru engar færslur.",
  tabTitlePlaceholder: "Nýtt spjald",
  more: "Fleiri",
  tagboxDoneButtonCaption: "ÓKEI",
  selectToRankEmptyRankedAreaText: "Öllum valkostum er raðað",
  selectToRankEmptyUnrankedAreaText: "Dragðu og slepptu valkostum hér til að raða þeim",
  ok: "ÓKEI",
  cancel: "Afturkalla"
};

setupLocale({ localeCode: "is", strings: icelandicSurveyStrings, nativeName: "íslenska", englishName: "Icelandic" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} af {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Pallborð {panelIndex}"
// ratingOptionsCaption: "Select..." => "Velja..."
// minError: "The value should not be less than {0}" => "Gildið má ekki vera lægra en {0}"
// maxError: "The value should not be greater than {0}" => "Gildið má ekki vera hærra en {0}"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Dragðu og slepptu skrá hér eða smelltu á hnappinn hér að neðan og veldu skrá til að hlaða upp."
// noRowsText: "There are no rows." => "Það eru engar raðir."
// multipletext_itemname: "text" => "Texti"
// signaturePlaceHolder: "Sign here" => "Kvittađu hér"
// modalCancelButtonText: "Cancel" => "Afturkalla"
// modalApplyButtonText: "Apply" => "Nota"
// filterStringPlaceholder: "Type to search..." => "Sláðu inn til að leita..."
// emptyMessage: "No data to display" => "Engin gögn til að birta"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Það eru engar færslur ennþá.\nSmelltu á hnappinn hér að neðan til að bæta við nýrri færslu."
// noEntriesReadonlyText: "There are no entries." => "Það eru engar færslur."
// more: "More" => "Fleiri"
// tagboxDoneButtonCaption: "OK" => "ÓKEI"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Öllum valkostum er raðað"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Dragðu og slepptu valkostum hér til að raða þeim"// takePhotoCaption: "Take Photo" => "Taka mynd"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Smelltu á hnappinn hér að neðan til að taka mynd með myndavélinni."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Dragðu og slepptu eða veldu skrá til að hlaða upp eða taka mynd með myndavélinni."
// replaceFileCaption: "Replace file" => "Skipta út skrá"// eachRowUniqueError: "Each row must have a unique value." => "Hver lína verður að hafa einstakt gildi."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Ekki er hægt að hlaða upp skrám. Vinsamlegast bættu við rekli fyrir 'onUploadFiles' atvikið."
// showDetails: "Show Details" => "Sýna upplýsingar"
// hideDetails: "Hide Details" => "Fela upplýsingar"
// ok: "OK" => "ÓKEI"
// cancel: "Cancel" => "Afturkalla"
// refuseItemText: "Refuse to answer" => "Neita að svara"
// dontKnowItemText: "Don't know" => "Veit ekki"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Svar þitt fer yfir 64KB. Vinsamlegast minnkaðu stærð skráa þinna og reyndu aftur eða hafðu samband við eiganda könnunarinnar."
// signaturePlaceHolderReadOnly: "No signature" => "Engin undirskrift"// tabTitlePlaceholder: "New Panel" => "Nýtt spjald"// deselectAllItemText: "Deselect all" => "Afveljið allt"
// textNoDigitsAllow: "Numbers are not allowed." => "Tölur eru ekki leyfðar."
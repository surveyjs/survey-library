import { setupLocale } from "survey-core";

export var swahiliStrings = {
  // "Previous"
  pagePrevText: "Iliyotangulia",
  // "Next"
  pageNextText: "Ifuatayo",
  // "Complete"
  completeText: "Kamili",
  // "Preview"
  previewText: "Hakiki",
  // "Edit"
  editText: "Hariri",
  // "Start"
  startSurveyText: "Anza",
  // [Auto-translated] "Please leave a comment"
  commentText: "Tafadhali acha maoni",
  // "Other (describe)"
  otherItemText: "Nyingine (eleza)",
  // "None"
  noneItemText: "Hakuna",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Kukataa kujibu",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Sijui",
  // "Select All"
  selectAllItemText: "Chagua Zote",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Delete All",
  // "Page {0} of {1}"
  progressText: "Ukurasa {0} wa {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} ya {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Rekodi {0} ya {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Yaliyojibiwa {0}/{1} maswali",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Hakuna ukurasa unaoonekana au swali katika utafiti.",
  // "Thank you for completing the survey"
  completingSurvey: "Asanti kwa kukamilisha utafiti!",
  // "You have already completed this survey."
  completingSurveyBefore: "Recodi zetu zinatuonyesha tayari umekamilisha utafiti.",
  // "Loading Survey..."
  loadingSurvey: "Tunaandaa utafiti...",
  // "Select..."
  placeholder: "Chagua...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Teua...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Teua...",
  // "value"
  value: "thamani",
  // "Response required."
  requiredError: "Tafadhali jibu hili swali.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Tafadhali jibu swali angalau moja.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Tafadhali jibu maswali katika safu zote.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Kila safu lazima iwe na thamani ya kipekee.",
  // "The value should be numeric."
  numericError: "Thamani inapaswa kuwa ya nambari.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Thamani haipaswi kuwa chini ya {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Tafadhali ingiza thamani inayolingana na saizi ya hatua ya {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Thamani haipaswi kuwa kubwa kuliko {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Hesabu haziruhusiwi.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Tafadhali ingiza angalau{0} husika.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Tafadhali ingiza isiozidi {0} husika.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Tafadhali ingiza kiwango zaidi ya {0} na kisichopungua {1} husika.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Tafadhali jaza isiopungua {0} safu.",
  // "Please select at least {0} option(s)."
  minSelectError: "Tafadhali chagua angalau {0} lahaja.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Tafadhali changua isiozidi {0} lahaja.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: " '{0}' inapaswa kuwa sawa au zaidi ya {1} na sawa au chini ya {2}",
  // "The '{0}' should be at least {1}"
  numericMin: " '{0}'inapaswa kuwa sawa au zaidi ya {1}",
  // "The '{0}' should be at most {1}"
  numericMax: " '{0}'inapaswa kuwa sawa au chini ya {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Tafadhali ingiza anwani halali ya barua-pepe.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Usemi:{0} inapaswa kurudi 'kweli'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Ombi lina kosa '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Ombi lilirudisha data tupu au the 'path' mali ya njia sio sahihi",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Saizi ya faili haipaswi kuzidi {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Idadi ya juu ya faili unazoweza kupakia ni {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Faili haziwezi kupakiwa. Tafadhali ongeza kishiko kwa tukio la 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Tafadhali ingiza thamani nyingine.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Faili yako inapakia.Tafadhali subiri sekunde kadhaa na ujaribu tena.",
  // "Loading..."
  loadingFile: "Inapakia...",
  // "Choose file(s)..."
  chooseFile: "Chagua faili...",
  // "No file selected"
  noFileChosen: "Hujachagua faili",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Buruta na udondoshe faili hapa au bonyeza kitufe kilicho hapa chini ili kuchagua faili ya kupakia.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Je! Unataka kufuta rekodi?",
  // "This value should be unique."
  keyDuplicationError: "Thamani hii inapaswa kuwa ya kipekee.",
  // "Add Column"
  addColumn: "Ongeza Kolamu",
  // "Add Row"
  addRow: "Ongeza safu",
  // "Remove"
  removeRow: "Toa",
  // [Auto-translated] "There are no rows."
  noRowsText: "Hakuna safu.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Safu {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Ongeza mpya",
  // "Remove"
  removePanel: "Toa",
  // [Auto-translated] "Show Details"
  showDetails: "Onyesha Maelezo",
  // [Auto-translated] "Hide Details"
  hideDetails: "Ficha Maelezo",
  // "item"
  choices_Item: "kitu",
  // [Auto-translated] "Choice option"
  choices_Choice: "Chaguo la uchaguzi",
  // "Column"
  matrix_column: "Kolamu",
  // "Row"
  matrix_row: "Safu",
  // [Auto-translated] "text"
  multipletext_itemname: "Ujumbe",
  // "The results are being saved on the server..."
  savingData: "Matokeo yamehifadhiwa kwa seva...",
  // "An error occurred and we could not save the results."
  savingDataError: "Kosa limetokea na hatukuweza kuhifadhi matokeo.",
  // "The results were saved successfully!"
  savingDataSuccess: "Matokeo yamehifadhiwa!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Jibu lako linazidi 64KB. Tafadhali punguza saizi ya faili zako na ujaribu tena au wasiliana na mmiliki wa utafiti.",
  // "Try again"
  saveAgainButton: "Jaribu tena",
  // "min"
  timerMin: "dakika",
  // "sec"
  timerSec: "sekunde",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Umetumia {0} kwenye ukurasa huu na {1} kwa jumla.",
  // "You have spent {0} on this page."
  timerSpentPage: "Umetumia {0} kwenye ukurasa huu.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Umetumia {0} kwa jumla.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Umetumia {0} ya {1} kwenye ukurasa huu {2} wa {3} kwa jumla.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Umetumia {0} ya {1} kwenye ukurasa huu.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Umetumia {0} ya {1} kwa jumla.",
  // "Clear"
  clearCaption: "Ondoa",
  // [Auto-translated] "Select"
  selectCaption: "Teua",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Ingia hapa",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Hakuna saini",
  // "Select File"
  chooseFileCaption: "Chagua faili",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Chukua Picha",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Bonyeza kitufe hapa chini ili kupiga picha kwa kutumia kamera.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Drag na kuacha au kuchagua faili kupakia au kuchukua picha kwa kutumia kamera.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Badilisha faili",
  // "Remove this file"
  removeFileCaption: "Ondoa faili",
  // "Yes"
  booleanCheckedLabel: "Ndio",
  // "No"
  booleanUncheckedLabel: "Hapana",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Je! Una uhakika kuwa unataka kuondoa faili hii: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Je! Una uhakika kuwa unataka kuondoa faili zote?",
  // "Question Title"
  questionTitlePatternText: "Kichwa cha Swali",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Katisha",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Tekeleza",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Andika ili kutafuta...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Hakuna data ya kuonyesha",
  // [Auto-translated] "Loading..."
  loadingPage: "Kupakia...",
  // [Auto-translated] "Loading..."
  loadingData: "Kupakia...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Bado hakuna maingizo makubwa.\nBofya kitufe kilicho hapa chini ili kuongeza ingizo jipya.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Hakuna maingizo",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Jopo Jipya",
  // [Auto-translated] "More"
  more: "Zaidi",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "Sawa kabisa",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Chaguo zote huchaguliwa kwa cheo",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Buruta chaguzi hapa ili kuziorodhesha",
  // [Auto-translated] "OK"
  ok: "Sawa kabisa",
  // [Auto-translated] "Cancel"
  cancel: "Katisha",
  // "Create \"{0}\" item..."
  createCustomItem: "Unda kipengee cha \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Jedwali la yaliyomo",
  // [Auto-translated] "Progress bar"
  progressbar: "Upau wa maendeleo"
};

setupLocale({ localeCode: "sw", strings: swahiliStrings, nativeName: "swahili", englishName: "Swahili" });
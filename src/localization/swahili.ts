import { surveyLocalization } from "survey-core";

export var swahiliStrings = {
  pagePrevText: "Iliyotangulia",
  pageNextText: "Ifuatayo",
  completeText: "Kamili",
  previewText: "Hakiki",
  editText: "Hariri",
  startSurveyText: "Anza",
  otherItemText: "Nyingine (eleza)",
  noneItemText: "Hakuna",
  selectAllItemText: "Chagua Zote",
  progressText: "Ukurasa {0} wa {1}",
  indexText: "{0} ya {1}",
  panelDynamicProgressText: "Rekodi {0} ya {1}",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "Yaliyojibiwa {0}/{1} maswali",
  emptySurvey: "Hakuna ukurasa unaoonekana au swali katika utafiti.",
  completingSurvey: "Asanti kwa kukamilisha utafiti!",
  completingSurveyBefore: "Recodi zetu zinatuonyesha tayari umekamilisha utafiti.",
  loadingSurvey: "Tunaandaa utafiti...",
  placeholder: "Chagua...",
  ratingOptionsCaption: "Teua...",
  value: "thamani",
  requiredError: "Tafadhali jibu hili swali.",
  requiredErrorInPanel: "Tafadhali jibu swali angalau moja.",
  requiredInAllRowsError: "Tafadhali jibu maswali katika safu zote.",
  numericError: "Thamani inapaswa kuwa ya nambari.",
  minError: "Thamani haipaswi kuwa chini ya {0}",
  maxError: "Thamani haipaswi kuwa kubwa kuliko {0}",
  textMinLength: "Tafadhali ingiza angalau{0} husika.",
  textMaxLength: "Tafadhali ingiza isiozidi {0} husika.",
  textMinMaxLength: "Tafadhali ingiza kiwango zaidi ya {0} na kisichopungua {1} husika.",
  minRowCountError: "Tafadhali jaza isiopungua {0} safu.",
  minSelectError: "Tafadhali chagua angalau {0} lahaja.",
  maxSelectError: "Tafadhali changua isiozidi {0} lahaja.",
  numericMinMax: " '{0}' inapaswa kuwa sawa au zaidi ya {1} na sawa au chini ya {2}",
  numericMin: " '{0}'inapaswa kuwa sawa au zaidi ya {1}",
  numericMax: " '{0}'inapaswa kuwa sawa au chini ya {1}",
  invalidEmail: "Tafadhali ingiza anwani halali ya barua-pepe.",
  invalidExpression: "Usemi:{0} inapaswa kurudi 'kweli'.",
  urlRequestError: "Ombi lina kosa '{0}'. {1}",
  urlGetChoicesError: "Ombi lilirudisha data tupu au the 'path' mali ya njia sio sahihi",
  exceedMaxSize: "Saizi ya faili haipaswi kuzidi {0}.",
  otherRequiredError: "Tafadhali ingiza thamani nyingine.",
  uploadingFile: "Faili yako inapakia.Tafadhali subiri sekunde kadhaa na ujaribu tena.",
  loadingFile: "Inapakia...",
  chooseFile: "Chagua faili...",
  noFileChosen: "Hujachagua faili",
  fileDragAreaPlaceholder: "Buruta na udondoshe faili hapa au bofya kitufe hapa chini na uchague faili ya kupakia.",
  confirmDelete: "Je! Unataka kufuta rekodi?",
  keyDuplicationError: "Thamani hii inapaswa kuwa ya kipekee.",
  addColumn: "Ongeza Kolamu",
  addRow: "Ongeza safu",
  removeRow: "Toa",
  emptyRowsText: "Hakuna safu.",
  addPanel: "Ongeza mpya",
  removePanel: "Toa",
  choices_Item: "kitu",
  matrix_column: "Kolamu",
  matrix_row: "Safu",
  multipletext_itemname: "Ujumbe",
  savingData: "Matokeo yamehifadhiwa kwa seva...",
  savingDataError: "Kosa limetokea na hatukuweza kuhifadhi matokeo.",
  savingDataSuccess: "Matokeo yamehifadhiwa!",
  saveAgainButton: "Jaribu tena",
  timerMin: "dakika",
  timerSec: "sekunde",
  timerSpentAll: "Umetumia {0} kwenye ukurasa huu na {1} kwa jumla.",
  timerSpentPage: "Umetumia {0} kwenye ukurasa huu.",
  timerSpentSurvey: "Umetumia {0} kwa jumla.",
  timerLimitAll: "Umetumia {0} ya {1} kwenye ukurasa huu {2} wa {3} kwa jumla.",
  timerLimitPage: "Umetumia {0} ya {1} kwenye ukurasa huu.",
  timerLimitSurvey: "Umetumia {0} ya {1} kwa jumla.",
  clearCaption: "Ondoa",
  signaturePlaceHolder: "Ingia hapa",
  chooseFileCaption: "Chagua faili",
  removeFileCaption: "Ondoa faili",
  booleanCheckedLabel: "Ndio",
  booleanUncheckedLabel: "Hapana",
  confirmRemoveFile: "Je! Una uhakika kuwa unataka kuondoa faili hii: {0}?",
  confirmRemoveAllFiles: "Je! Una uhakika kuwa unataka kuondoa faili zote?",
  questionTitlePatternText: "Kichwa cha Swali",
  modalCancelButtonText: "Katisha",
  modalApplyButtonText: "Tekeleza",
  filterStringPlaceholder: "Andika ili kutafuta...",
  emptyMessage: "Hakuna data ya kuonyesha",
  noEntriesText: "Hakuna maingizo kwa sasa.\nBofya kitufe hapa chini ili kuongeza ingizo jipya.",
  noEntriesReadonlyText: "Hakuna viingilio.",
  more: "Zaidi",
  tagboxDoneButtonCaption: "Sawa kabisa",
  selectToRankEmptyRankedAreaText: "Chaguzi zote zimeorodheshwa",
  selectToRankEmptyUnrankedAreaText: "Buruta na uache uchaguzi hapa ili kuziorodhesha"
};

surveyLocalization.locales["sw"] = swahiliStrings;
surveyLocalization.localeNames["sw"] = "swahili";

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} ya {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Teua..."
// minError: "The value should not be less than {0}" => "Thamani haipaswi kuwa chini ya {0}"
// maxError: "The value should not be greater than {0}" => "Thamani haipaswi kuwa kubwa kuliko {0}"
// fileDragAreaPlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Buruta na udondoshe faili hapa au bofya kitufe hapa chini na uchague faili ya kupakia."
// emptyRowsText: "There are no rows." => "Hakuna safu."
// multipletext_itemname: "text" => "Ujumbe"
// signaturePlaceHolder: "Sign here" => "Ingia hapa"
// modalCancelButtonText: "Cancel" => "Katisha"
// modalApplyButtonText: "Apply" => "Tekeleza"
// filterStringPlaceholder: "Type to search..." => "Andika ili kutafuta..."
// emptyMessage: "No data to display" => "Hakuna data ya kuonyesha"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Hakuna maingizo kwa sasa.\nBofya kitufe hapa chini ili kuongeza ingizo jipya."
// noEntriesReadonlyText: "There are no entries." => "Hakuna viingilio."
// more: "More" => "Zaidi"
// tagboxDoneButtonCaption: "OK" => "Sawa kabisa"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Chaguzi zote zimeorodheshwa"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Buruta na uache uchaguzi hapa ili kuziorodhesha"
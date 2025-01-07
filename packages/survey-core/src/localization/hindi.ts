import { setupLocale } from "survey-core";

export var hindiStrings = {
  pagePrevText: "पिछला",
  pageNextText: "अगला",
  completeText: "पूरा",
  previewText: "पूर्वसमीक्षा",
  editText: "संपादित",
  startSurveyText: "शुरू",
  otherItemText: "दूसरा (वर्णन करें)",
  noneItemText: "कोई नहीं",
  refuseItemText: "जवाब देने से इनकार",
  dontKnowItemText: "नहीं मालूम",
  selectAllItemText: "सभी का चयन करें",
  deselectAllItemText: "सभी को अचयनित करें",
  progressText: "पृष्ठ 1 में से 0",
  indexText: "{1} का {0}",
  panelDynamicProgressText: " दस्तावेज {1} के {0}",
  panelDynamicTabTextFormat: "पैनल {panelIndex}",
  questionsProgressText: "{1} सवालों में से {0} के जवाब दिए",
  emptySurvey: "सर्वेक्षण में कोई दृश्यमान पृष्ठ या प्रश्न नहीं है",
  completingSurvey: "सर्वेक्षण को पूरा करने के लिए धन्यवाद",
  completingSurveyBefore: " हमारे रिकॉर्ड बताते हैं कि आप पहले ही इस सर्वेक्षण को पूरा कर चुके हैं",
  loadingSurvey: "सर्वेक्षण खुल रहा है.…",
  placeholder: "चुनें",
  ratingOptionsCaption: "चुनना।।।",
  value: "मूल्य",
  requiredError: "कृपया प्रश्न का उत्तर दें",
  requiredErrorInPanel: "कृपया कम से कम एक प्रश्न का उत्तर दें",
  requiredInAllRowsError: "कृपया सभी पंक्तियों में सवालों के जवाब दें",
  eachRowUniqueError: "प्रत्येक पंक्ति का एक अद्वितीय मान होना चाहिए.",
  numericError: "मूल्य संख्यात्मक होना चाहिए",
  minError: "मान {0} से कम नहीं होना चाहिए",
  maxError: "मान {0} से अधिक नहीं होना चाहिए",
  textNoDigitsAllow: "संख्या की अनुमति नहीं है।",
  textMinLength: "कृपया कम से कम {0} वर्ण दर्ज करें",
  textMaxLength: "कृपया {0} से कम वर्ण दर्ज करें",
  textMinMaxLength: "कृपया {0} से अधिक और {1} से कम पात्रों में प्रवेश करें",
  minRowCountError: "कृपया कम से कम {0} पंक्तियों को भरें",
  minSelectError: "कृपया कम से कम {0} विकल्प का चयन करें",
  maxSelectError: "कृपया {0} विकल्पों से अधिक नहीं चुनें",
  numericMinMax: "'{0}' {1} से बराबर या अधिक और {2} से बराबर या कम होना चाहिए",
  numericMin: "'{0}' {1} से बराबर या अधिक होना चाहिए",
  numericMax: "'{0}' {1} से बराबर या कम होना चाहिए",
  invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
  invalidExpression: "अभिव्यक्ति: {0} को ' सच ' लौटना चाहिए",
  urlRequestError: "अनुरोध लौटाया त्रुटि '{0}' . {1}",
  urlGetChoicesError: "अनुरोध ने खाली डेटा वापस कर दिया है ",
  exceedMaxSize: "फ़ाइल का आकार {0} से अधिक नहीं होना चाहिए  या फिर 'पाथ' प्रॉपर्टी गलत है",
  noUploadFilesHandler: "फ़ाइलें अपलोड नहीं की जा सकती. कृपया 'onloadFiles' ईवेंट के लिए एक हैंडलर जोड़ें.",
  otherRequiredError: "कृपया दूसरा मूल्य दर्ज करें",
  uploadingFile: "आपकी फाइल अपलोड हो रही है। कृपया कई सेकंड इंतजार करें और फिर से प्रयास करें।",
  loadingFile: "लोडिंग",
  chooseFile: "फ़ाइल चुनें",
  noFileChosen: "कोई फाइल नहीं चुनी गई",
  filePlaceholder: "यहां एक फ़ाइल खींचें और छोड़ें या नीचे दिए गए बटन पर क्लिक करें और अपलोड करने के लिए एक फ़ाइल चुनें।",
  confirmDelete: "क्या आप रिकॉर्ड हटाना चाहते हैं",
  keyDuplicationError: "यह मान अनोखा होना चाहिए",
  addColumn: "कॉलम जोड़ें",
  addRow: "पंक्ति जोड़ें",
  removeRow: "हटाए",
  noRowsText: "कोई पंक्तियाँ नहीं हैं.",
  addPanel: "नया जोड़ें",
  removePanel: "हटाए",
  showDetails: "विवरण दिखाएँ",
  hideDetails: "विवरण छुपाएँ",
  choices_Item: "मद",
  matrix_column: "कॉलम",
  matrix_row: "पंक्ति",
  multipletext_itemname: "टेक्स्ट",
  savingData: "परिणाम सर्वर पर सेव हो रहे हैं",
  savingDataError: "एक त्रुटि हुई और हम परिणामों को नहीं सेव कर सके",
  savingDataSuccess: "परिणाम सफलतापूर्वक सेव हो गए",
  savingExceedSize: "आपकी प्रतिक्रिया 64KB से अधिक है। कृपया अपनी फ़ाइल(फ़ाइलों) का आकार घटाएँ और पुन: प्रयास करें या सर्वेक्षण स्वामी से संपर्क करें.",
  saveAgainButton: "फिर कोशिश करो",
  timerMin: "मिनट",
  timerSec: "सेकंड",
  timerSpentAll: "आपने इस पृष्ठ पर {0} खर्च किए हैं और कुल {1}",
  timerSpentPage: "आपने इस पृष्ठ पर {0} खर्च किया है",
  timerSpentSurvey: "आपने कुल {0} खर्च किया है",
  timerLimitAll: "आपने इस पृष्ठ पर {1} की {0} और कुल {3} की {2} खर्च की है।",
  timerLimitPage: "आपने इस पृष्ठ पर {1} का {0} खर्च किया है",
  timerLimitSurvey: "आपने कुल {1} की {0} खर्च की है",
  clearCaption: "स्पष्ट",
  signaturePlaceHolder: "यहां साइन करें",
  signaturePlaceHolderReadOnly: "कोई हस्ताक्षर नहीं",
  chooseFileCaption: "फ़ाइल चुनें",
  takePhotoCaption: "फोटो ले लो",
  photoPlaceholder: "कैमरे का उपयोग करके फोटो लेने के लिए नीचे दिए गए बटन पर क्लिक करें।",
  fileOrPhotoPlaceholder: "कैमरे का उपयोग करके फ़ोटो अपलोड करने या फ़ोटो लेने के लिए किसी फ़ाइल को खींचें और छोड़ें या चुनें.",
  replaceFileCaption: "फ़ाइल बदलें",
  removeFileCaption: "इस फाइल को निकालें",
  booleanCheckedLabel: "हाँ",
  booleanUncheckedLabel: "नहीं",
  confirmRemoveFile: "क्या आप सुनिश्चित हैं कि आप इस फ़ाइल को हटाना चाहते हैं: {0}",
  confirmRemoveAllFiles: "क्या आप सुनिश्चित हैं कि आप सभी फ़ाइलों को हटाना चाहते हैं",
  questionTitlePatternText: "प्रश्न का शीर्षक",
  modalCancelButtonText: "रद्द करना",
  modalApplyButtonText: "लागू करना",
  filterStringPlaceholder: "खोज करने के लिए टाइप करें...",
  emptyMessage: "प्रदर्शित करने के लिए कोई डेटा नहीं",
  noEntriesText: "अभी तक कोई प्रविष्टियां नहीं हैं।\nनई प्रविष्टि जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें.",
  noEntriesReadonlyText: "कोई प्रविष्टियाँ नहीं हैं.",
  tabTitlePlaceholder: "नया पैनल",
  more: "अधिक",
  tagboxDoneButtonCaption: "ठीक है",
  selectToRankEmptyRankedAreaText: "सभी विकल्पों को रैंक किया गया है",
  selectToRankEmptyUnrankedAreaText: "विकल्पों को रैंक करने के लिए उन्हें यहां खींचें और छोड़ दें",
  ok: "ठीक है",
  cancel: "रद्द करना"
};

setupLocale({ localeCode: "hi", strings: hindiStrings, nativeName: "hindi", englishName: "Hindi" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// noneItemText: "None" => "कोई नहीं"
// indexText: "{0} of {1}" => "{1} का {0}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "पैनल {panelIndex}"
// ratingOptionsCaption: "Select..." => "चुनना।।।"
// minError: "The value should not be less than {0}" => "मान {0} से कम नहीं होना चाहिए"
// maxError: "The value should not be greater than {0}" => "मान {0} से अधिक नहीं होना चाहिए"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "यहां एक फ़ाइल खींचें और छोड़ें या नीचे दिए गए बटन पर क्लिक करें और अपलोड करने के लिए एक फ़ाइल चुनें।"
// noRowsText: "There are no rows." => "कोई पंक्तियाँ नहीं हैं."
// multipletext_itemname: "text" => "टेक्स्ट"
// signaturePlaceHolder: "Sign here" => "यहां साइन करें"
// modalCancelButtonText: "Cancel" => "रद्द करना"
// modalApplyButtonText: "Apply" => "लागू करना"
// filterStringPlaceholder: "Type to search..." => "खोज करने के लिए टाइप करें..."
// emptyMessage: "No data to display" => "प्रदर्शित करने के लिए कोई डेटा नहीं"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "अभी तक कोई प्रविष्टियां नहीं हैं।\nनई प्रविष्टि जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें."
// noEntriesReadonlyText: "There are no entries." => "कोई प्रविष्टियाँ नहीं हैं."
// more: "More" => "अधिक"
// tagboxDoneButtonCaption: "OK" => "ठीक है"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "सभी विकल्पों को रैंक किया गया है"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "विकल्पों को रैंक करने के लिए उन्हें यहां खींचें और छोड़ दें"// takePhotoCaption: "Take Photo" => "फोटो ले लो"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "कैमरे का उपयोग करके फोटो लेने के लिए नीचे दिए गए बटन पर क्लिक करें।"
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "कैमरे का उपयोग करके फ़ोटो अपलोड करने या फ़ोटो लेने के लिए किसी फ़ाइल को खींचें और छोड़ें या चुनें."
// replaceFileCaption: "Replace file" => "फ़ाइल बदलें"// eachRowUniqueError: "Each row must have a unique value." => "प्रत्येक पंक्ति का एक अद्वितीय मान होना चाहिए."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "फ़ाइलें अपलोड नहीं की जा सकती. कृपया 'onloadFiles' ईवेंट के लिए एक हैंडलर जोड़ें."
// showDetails: "Show Details" => "विवरण दिखाएँ"
// hideDetails: "Hide Details" => "विवरण छुपाएँ"
// ok: "OK" => "ठीक है"
// cancel: "Cancel" => "रद्द करना"// refuseItemText: "Refuse to answer" => "जवाब देने से इनकार"
// dontKnowItemText: "Don't know" => "नहीं मालूम"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "आपकी प्रतिक्रिया 64KB से अधिक है। कृपया अपनी फ़ाइल(फ़ाइलों) का आकार घटाएँ और पुन: प्रयास करें या सर्वेक्षण स्वामी से संपर्क करें."
// signaturePlaceHolderReadOnly: "No signature" => "कोई हस्ताक्षर नहीं"// tabTitlePlaceholder: "New Panel" => "नया पैनल"// deselectAllItemText: "Deselect all" => "सभी को अचयनित करें"
// textNoDigitsAllow: "Numbers are not allowed." => "संख्या की अनुमति नहीं है।"
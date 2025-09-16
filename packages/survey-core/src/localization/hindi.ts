import { setupLocale } from "survey-core";

export var hindiStrings = {
  // "Previous"
  pagePrevText: "पिछला",
  // "Next"
  pageNextText: "अगला",
  // "Complete"
  completeText: "पूरा",
  // "Preview"
  previewText: "पूर्वसमीक्षा",
  // "Edit"
  editText: "संपादित",
  // "Start"
  startSurveyText: "शुरू",
  // [Auto-translated] "Please leave a comment"
  commentText: "कृपया एक टिप्पणी छोड़ दो",
  // "Other (describe)"
  otherItemText: "दूसरा (वर्णन करें)",
  // [Auto-translated] "None"
  noneItemText: "कोई नहीं",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "जवाब देने से इनकार",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "नहीं मालूम",
  // "Select All"
  selectAllItemText: "सभी का चयन करें",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "सभी को अचयनित करें",
  // "Page {0} of {1}"
  progressText: "पृष्ठ 1 में से 0",
  // [Auto-translated] "{0} of {1}"
  indexText: "{1} का {0}",
  // "{0} of {1}"
  panelDynamicProgressText: " दस्तावेज {1} के {0}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "पैनल {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "{1} सवालों में से {0} के जवाब दिए",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "सर्वेक्षण में कोई दृश्यमान पृष्ठ या प्रश्न नहीं है",
  // "Thank you for completing the survey"
  completingSurvey: "सर्वेक्षण को पूरा करने के लिए धन्यवाद",
  // "You have already completed this survey."
  completingSurveyBefore: " हमारे रिकॉर्ड बताते हैं कि आप पहले ही इस सर्वेक्षण को पूरा कर चुके हैं",
  // "Loading Survey..."
  loadingSurvey: "सर्वेक्षण खुल रहा है.…",
  // "Select..."
  placeholder: "चुनें",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "चुनना।।।",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "चुनना।।।",
  // "value"
  value: "मूल्य",
  // "Response required."
  requiredError: "कृपया प्रश्न का उत्तर दें",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "कृपया कम से कम एक प्रश्न का उत्तर दें",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "कृपया सभी पंक्तियों में सवालों के जवाब दें",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "प्रत्येक पंक्ति का एक अद्वितीय मान होना चाहिए.",
  // "The value should be numeric."
  numericError: "मूल्य संख्यात्मक होना चाहिए",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "मान {0} से कम नहीं होना चाहिए",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "कृपया कोई मान दर्ज करें जो {0} के चरण आकार से मेल खाता हो.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "मान {0} से अधिक नहीं होना चाहिए",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "संख्या की अनुमति नहीं है।",
  // "Please enter at least {0} character(s)."
  textMinLength: "कृपया कम से कम {0} वर्ण दर्ज करें",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "कृपया {0} से कम वर्ण दर्ज करें",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "कृपया {0} से अधिक और {1} से कम पात्रों में प्रवेश करें",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "कृपया कम से कम {0} पंक्तियों को भरें",
  // "Please select at least {0} option(s)."
  minSelectError: "कृपया कम से कम {0} विकल्प का चयन करें",
  // "Please select no more than {0} option(s)."
  maxSelectError: "कृपया {0} विकल्पों से अधिक नहीं चुनें",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' {1} से बराबर या अधिक और {2} से बराबर या कम होना चाहिए",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' {1} से बराबर या अधिक होना चाहिए",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' {1} से बराबर या कम होना चाहिए",
  // "Please enter a valid e-mail address."
  invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
  // "The expression: {0} should return 'true'."
  invalidExpression: "अभिव्यक्ति: {0} को ' सच ' लौटना चाहिए",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "अनुरोध लौटाया त्रुटि '{0}' . {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "अनुरोध ने खाली डेटा वापस कर दिया है ",
  // "The file size should not exceed {0}."
  exceedMaxSize: "फ़ाइल का आकार {0} से अधिक नहीं होना चाहिए  या फिर 'पाथ' प्रॉपर्टी गलत है",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "फ़ाइलें अपलोड नहीं की जा सकती. कृपया 'onloadFiles' ईवेंट के लिए एक हैंडलर जोड़ें.",
  // "Response required: enter another value."
  otherRequiredError: "कृपया दूसरा मूल्य दर्ज करें",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "आपकी फाइल अपलोड हो रही है। कृपया कई सेकंड इंतजार करें और फिर से प्रयास करें।",
  // "Loading..."
  loadingFile: "लोडिंग",
  // "Choose file(s)..."
  chooseFile: "फ़ाइल चुनें",
  // "No file selected"
  noFileChosen: "कोई फाइल नहीं चुनी गई",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "किसी फ़ाइल को यहाँ खींचें और छोड़ें या अपलोड करने के लिए फ़ाइल का चयन करने के लिए नीचे दिए गए बटन पर क्लिक करें।",
  // "Are you sure you want to delete this record?"
  confirmDelete: "क्या आप रिकॉर्ड हटाना चाहते हैं",
  // "This value should be unique."
  keyDuplicationError: "यह मान अनोखा होना चाहिए",
  // "Add Column"
  addColumn: "कॉलम जोड़ें",
  // "Add Row"
  addRow: "पंक्ति जोड़ें",
  // "Remove"
  removeRow: "हटाए",
  // [Auto-translated] "There are no rows."
  noRowsText: "कोई पंक्तियाँ नहीं हैं.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "पंक्ति {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "नया जोड़ें",
  // "Remove"
  removePanel: "हटाए",
  // [Auto-translated] "Show Details"
  showDetails: "विवरण दिखाएँ",
  // [Auto-translated] "Hide Details"
  hideDetails: "विवरण छुपाएँ",
  // "item"
  choices_Item: "मद",
  // [Auto-translated] "Choice option"
  choices_Choice: "पसंद विकल्प",
  // "Column"
  matrix_column: "कॉलम",
  // "Row"
  matrix_row: "पंक्ति",
  // [Auto-translated] "text"
  multipletext_itemname: "टेक्स्ट",
  // "The results are being saved on the server..."
  savingData: "परिणाम सर्वर पर सेव हो रहे हैं",
  // "An error occurred and we could not save the results."
  savingDataError: "एक त्रुटि हुई और हम परिणामों को नहीं सेव कर सके",
  // "The results were saved successfully!"
  savingDataSuccess: "परिणाम सफलतापूर्वक सेव हो गए",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "आपकी प्रतिक्रिया 64KB से अधिक है। कृपया अपनी फ़ाइल(फ़ाइलों) का आकार घटाएँ और पुन: प्रयास करें या सर्वेक्षण स्वामी से संपर्क करें.",
  // "Try again"
  saveAgainButton: "फिर कोशिश करो",
  // "min"
  timerMin: "मिनट",
  // "sec"
  timerSec: "सेकंड",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "आपने इस पृष्ठ पर {0} खर्च किए हैं और कुल {1}",
  // "You have spent {0} on this page."
  timerSpentPage: "आपने इस पृष्ठ पर {0} खर्च किया है",
  // "You have spent {0} in total."
  timerSpentSurvey: "आपने कुल {0} खर्च किया है",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "आपने इस पृष्ठ पर {1} की {0} और कुल {3} की {2} खर्च की है।",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "आपने इस पृष्ठ पर {1} का {0} खर्च किया है",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "आपने कुल {1} की {0} खर्च की है",
  // "Clear"
  clearCaption: "स्पष्ट",
  // [Auto-translated] "Select"
  selectCaption: "चुनना",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "यहां साइन करें",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "कोई हस्ताक्षर नहीं",
  // "Select File"
  chooseFileCaption: "फ़ाइल चुनें",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "फोटो ले लो",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "कैमरे का उपयोग करके फोटो लेने के लिए नीचे दिए गए बटन पर क्लिक करें।",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "कैमरे का उपयोग करके फ़ोटो अपलोड करने या फ़ोटो लेने के लिए किसी फ़ाइल को खींचें और छोड़ें या चुनें.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "फ़ाइल बदलें",
  // "Remove this file"
  removeFileCaption: "इस फाइल को निकालें",
  // "Yes"
  booleanCheckedLabel: "हाँ",
  // "No"
  booleanUncheckedLabel: "नहीं",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "क्या आप सुनिश्चित हैं कि आप इस फ़ाइल को हटाना चाहते हैं: {0}",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "क्या आप सुनिश्चित हैं कि आप सभी फ़ाइलों को हटाना चाहते हैं",
  // "Question Title"
  questionTitlePatternText: "प्रश्न का शीर्षक",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "रद्द करना",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "लागू करना",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "खोज करने के लिए टाइप करें...",
  // [Auto-translated] "No data to display"
  emptyMessage: "प्रदर्शित करने के लिए कोई डेटा नहीं",
  // [Auto-translated] "Loading..."
  loadingPage: "लोड।।।",
  // [Auto-translated] "Loading..."
  loadingData: "लोड।।।",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "अभी तक कोई प्रविष्टि नहीं।\nनई प्रविष्टि जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "कोई प्रविष्टि नहीं",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "नया पैनल",
  // [Auto-translated] "More"
  more: "अधिक",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "ठीक है",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "रैंकिंग के लिए सभी विकल्पों का चयन किया जाता है",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "विकल्पों को रैंक करने के लिए यहां खींचें",
  // [Auto-translated] "OK"
  ok: "ठीक है",
  // [Auto-translated] "Cancel"
  cancel: "रद्द करना",
  // "Create \"{0}\" item..."
  createCustomItem: "\"{0}\" आइटम बनाएँ...",
  // [Auto-translated] "Table of contents"
  toc: "विषय-सूची",
  // [Auto-translated] "Progress bar"
  progressbar: "प्रगति पट्टी"
};

setupLocale({ localeCode: "hi", strings: hindiStrings, nativeName: "hindi", englishName: "Hindi" });
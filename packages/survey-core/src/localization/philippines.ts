import { setupLocale } from "survey-core";

export var philippinesStrings = {
  // "Previous"
  pagePrevText: "Nakaraang",
  // "Next"
  pageNextText: "Susunod",
  // "Complete"
  completeText: "Kumpleto",
  // "Preview"
  previewText: "Silipin",
  // "Edit"
  editText: "I-edit",
  // "Start"
  startSurveyText: "Magsimula",
  // [Auto-translated] "Please leave a comment"
  commentText: "Mangyaring mag-iwan ng komento",
  // "Other (describe)"
  otherItemText: "Iba pa (ilarawan)",
  // "None"
  noneItemText: "wala",
  // "Refuse to answer"
  refuseItemText: "Tumangging sumagot",
  // "Don't know"
  dontKnowItemText: "hindi ko alam",
  // "Select All"
  selectAllItemText: "Piliin lahat",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Alisin ang pagpili ng lahat",
  // "Page {0} of {1}"
  progressText: "Pahina {0} ng {1}",
  // "{0} of {1}"
  indexText: "{0} ng {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "{0} ng {1}",
  // "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Sinagot ang {0}/{1} mga tanong",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Ang survey ay hindi naglalaman ng anumang nakikitang elemento.",
  // "Thank you for completing the survey"
  completingSurvey: "Salamat sa pagkumpleto ng survey",
  // "You have already completed this survey."
  completingSurveyBefore: "Nakumpleto mo na ang survey na ito.",
  // "Loading Survey..."
  loadingSurvey: "Nilo-load ang Survey...",
  // "Select..."
  placeholder: "Pumili...",
  // "Select..."
  ratingOptionsCaption: "Pumili...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Pumili ...",
  // "value"
  value: "halaga",
  // "Response required."
  requiredError: "Kinakailangan ang tugon.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Kinakailangan ang tugon: sagutin ang kahit isang tanong.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Kinakailangan ang tugon: sagutin ang mga tanong sa lahat ng row.",
  // "Each row must have a unique value."
  eachRowUniqueError: "Ang bawat hilera ay dapat may natatanging halaga.",
  // "The value should be numeric."
  numericError: "Ang halaga ay dapat na numero.",
  // "The value should not be less than {0}"
  minError: "Ang halaga ay hindi dapat mas mababa sa {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Mangyaring magpasok ng isang halaga na tumutugma sa laki ng hakbang ng {0}.",
  // "The value should not be greater than {0}"
  maxError: "Ang halaga ay hindi dapat mas malaki sa {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Bawal ang mga numero.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Mangyaring magpasok ng hindi bababa sa {0} (mga) character.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Mangyaring magpasok ng hindi hihigit sa {0} (mga) character.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Mangyaring magpasok ng hindi bababa sa {0} at hindi hihigit sa {1} (na) character.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Mangyaring punan ang hindi bababa sa {0} (na) hilera.",
  // "Please select at least {0} option(s)."
  minSelectError: "Mangyaring pumili ng hindi bababa sa {0} (mga) opsyon.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Mangyaring pumili ng hindi hihigit sa {0} (mga) opsyon.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "Ang '{0}' ay dapat na hindi bababa sa {1} at hindi hihigit sa {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "Ang '{0}' ay dapat na hindi bababa sa {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "Ang '{0}' ay dapat na hindi hihigit sa {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Mangyaring magpasok ng wastong e-mail address.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Ang expression na: {0} ay dapat magbalik ng 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Ang kahilingan ay nagbalik ng error na '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Ang kahilingan ay nagbalik ng walang laman na data o ang 'path' property ay hindi tama",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Ang laki ng file ay hindi dapat lumampas sa {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Ang maximum na bilang ng mga file na maaari mong i-upload ay {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Hindi ma-upload ang mga file. Mangyaring magdagdag ng handler para sa kaganapang 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Kinakailangan ang tugon: maglagay ng isa pang halaga.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Ina-upload ang iyong file. Mangyaring maghintay ng ilang segundo at subukang muli.",
  // "Loading..."
  loadingFile: "Naglo-load...",
  // "Choose file(s)..."
  chooseFile: "Pumili ng (mga) file...",
  // "No file selected"
  noFileChosen: "Walang napiling file",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "I-drag at i-drop ang isang file dito o i-click ang button sa ibaba upang pumili ng file na ia-upload.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Sigurado ka bang gusto mong tanggalin ang talang ito?",
  // "This value should be unique."
  keyDuplicationError: "Ang halagang ito ay dapat na natatangi.",
  // "Add Column"
  addColumn: "Magdagdag ng Column",
  // "Add Row"
  addRow: "Magdagdag ng hilera",
  // "Remove"
  removeRow: "Alisin",
  // "There are no rows."
  noRowsText: "Walang mga hilera.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Hilera {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Magdagdag ng bago",
  // "Remove"
  removePanel: "Alisin",
  // "Show Details"
  showDetails: "Ipakita ang mga detalye",
  // "Hide Details"
  hideDetails: "Itago ang Mga Detalye",
  // "item"
  choices_Item: "aytem",
  // [Auto-translated] "Choice option"
  choices_Choice: "Pagpipilian sa pagpipilian",
  // "Column"
  matrix_column: "Kolum",
  // "Row"
  matrix_row: "hilera",
  // "text"
  multipletext_itemname: "text",
  // "The results are being saved on the server..."
  savingData: "Ang mga resulta ay sini-save sa server...",
  // "An error occurred and we could not save the results."
  savingDataError: "May naganap na error at hindi namin mai-save ang mga resulta.",
  // "The results were saved successfully!"
  savingDataSuccess: "Matagumpay na na-save ang mga resulta!",
  // "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Ang iyong tugon ay lumampas sa 64KB. Mangyaring bawasan ang laki ng iyong (mga) file at subukang muli o makipag-ugnayan sa may-ari ng survey.",
  // "Try again"
  saveAgainButton: "Subukan muli",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sec",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Gumastos ka ng {0} sa pahinang ito at {1} sa kabuuan.",
  // "You have spent {0} on this page."
  timerSpentPage: "Gumastos ka ng {0} sa pahinang ito.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Gumastos ka ng {0} sa kabuuan.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Gumastos ka ng {0} ng {1} sa pahinang ito at {2} ng {3} sa kabuuan.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Gumastos ka ng {0} sa {1} sa pahinang ito.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Gumastos ka ng {0} sa {1} sa kabuuan.",
  // "Clear"
  clearCaption: "Maaliwalas",
  // [Auto-translated] "Select"
  selectCaption: "Piliin",
  // "Sign here"
  signaturePlaceHolder: "Pumirma dito",
  // "No signature"
  signaturePlaceHolderReadOnly: "Walang pirma",
  // "Select File"
  chooseFileCaption: "Piliin ang File",
  // "Take Photo"
  takePhotoCaption: "Kunan ng litrato",
  // "Click the button below to take a photo using the camera."
  photoPlaceholder: "I-click ang button sa ibaba para kumuha ng larawan gamit ang camera.",
  // "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "I-drag at i-drop o pumili ng file na ia-upload o kumuha ng larawan gamit ang camera.",
  // "Replace file"
  replaceFileCaption: "Palitan ang file",
  // "Remove this file"
  removeFileCaption: "Alisin ang file na ito",
  // "Yes"
  booleanCheckedLabel: "Oo",
  // "No"
  booleanUncheckedLabel: "Hindi",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Sigurado ka bang gusto mong alisin ang file na ito: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Sigurado ka bang gusto mong alisin ang lahat ng file?",
  // "Question Title"
  questionTitlePatternText: "Pamagat ng Tanong",
  // "Cancel"
  modalCancelButtonText: "Kanselahin",
  // "Apply"
  modalApplyButtonText: "Mag-apply",
  // "Type to search..."
  filterStringPlaceholder: "I-type para maghanap...",
  // "No data to display"
  emptyMessage: "walang maipakitang datos",
  // [Auto-translated] "Loading..."
  loadingPage: "Naglo-load...",
  // [Auto-translated] "Loading..."
  loadingData: "Naglo-load...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Wala pang entry.\nI-click ang button sa ibaba para magdagdag ng bagong entry.",
  // "No entries"
  noEntriesReadonlyText: "Walang entry",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Bagong Panel",
  // "More"
  more: "Higit pa",
  // "OK"
  tagboxDoneButtonCaption: "OK",
  // "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Ang lahat ng mga pagpipilian ay pinili para sa pagraranggo",
  // "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "I-drag ang mga pagpipilian dito upang i-rank ang mga ito",
  // "OK"
  ok: "OK",
  // "Cancel"
  cancel: "Kanselahin",
  // "Create \"{0}\" item..."
  createCustomItem: "Lumikha ng \"{0}\" na item ...",
  // [Auto-translated] "Table of contents"
  toc: "Talaan ng mga nilalaman",
  // [Auto-translated] "Progress bar"
  progressbar: "Email Address *"
};

// Uncomment the lines below if you create a custom dictionary.
// Replace "en" with a custom locale code (for example, "fr" or "de"),
// Replace `englishStrings` with the name of the variable that contains the custom dictionary.
setupLocale({ localeCode: "fil", strings: philippinesStrings, nativeName: "filipino", englishName: "Filipino" });
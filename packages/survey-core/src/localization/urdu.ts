import { setupLocale } from "survey-core";

export var urduSurveyStrings = {
  // "Previous"
  pagePrevText: "پچھلا",
  // "Next"
  pageNextText: "اگلا",
  // "Complete"
  completeText: "مکمل",
  // "Preview"
  previewText: "دیکهنا",
  // "Edit"
  editText: "ترمیم",
  // "Start"
  startSurveyText: "شروع کریں",
  //  [Auto-translated] "Please leave a comment"
  commentText: "براہ مہربانی ایک تبصرہ چھوڑ دیں",
  // "Other (describe)"
  otherItemText: "دیگر (بیان کریں)",
  // "None"
  noneItemText: "کوئی نہیں",
  //  [Auto-translated] "Refuse to answer"
  refuseItemText: "جواب دینے سے انکار",
  //  [Auto-translated] "Don't know"
  dontKnowItemText: "معلوم نہيں",
  // "Select All"
  selectAllItemText: "تمام منتخب کریں",
  //  [Auto-translated] "Deselect all"
  deselectAllItemText: "Deselect all",
  // "Page {0} of {1}"
  progressText: "صفحہ {0} از {1}",
  //  [Auto-translated] "{0} of {1}"
  indexText: "{1} کے {0}",
  // "{0} of {1}"
  panelDynamicProgressText: "ریکارڈ {0} {1}",
  //  [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: " سوالات کا جواب دیا۔ {0}/{1}",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "سروے میں کوئی نظر آنے والا صفحہ یا سوال نہیں ہے۔",
  // "Thank you for completing the survey"
  completingSurvey: "سروے مکمل کرنے کے لیے آپ کا شکریہ!",
  // "You have already completed this survey."
  completingSurveyBefore: "ہمارے ریکارڈ سے پتہ چلتا ہے کہ آپ پہلے ہی یہ سروے مکمل کر چکے ہیں۔",
  // "Loading Survey..."
  loadingSurvey: "...سروے لوڈ کر رہا ہے",
  // "Select..."
  placeholder: "...منتخب کریں ",
  //  [Auto-translated] "Select..."
  ratingOptionsCaption: "منتخب...",
  //  [Auto-translated] "Select..."
  buttongroupOptionsCaption: "منتخب...",
  // "value"
  value: "value",
  // "Response required."
  requiredError: "براہ کرم سوال کا جواب دیں۔",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "براہ کرم کم از کم ایک سوال کا جواب دیں۔",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "براہ کرم تمام قطاروں میں سوالات کے جوابات دیں۔",
  //  [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "ہر قطار کی ایک منفرد قدر ہونی چاہئے۔",
  // "The value should be numeric."
  numericError: "اس کا جواب عدد میں ہونا چاہئے۔",
  // "The value should not be less than {0}"
  minError: "عدد صفر سے کم نہیں ہونی چاہئے",
  // "The value should not be greater than {0}"
  maxError: "عدد صفر سے زیادہ نہیں ہونی چاہیے",
  //  [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "نمبروں کی اجازت نہیں ہے۔",
  // "Please enter at least {0} character(s)."
  textMinLength: "براہ کرم کم از کم صفر حروف درج کریں۔",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "براہ کرم صفر سے زیادہ حروف درج نہ کریں۔",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "براہ کرم کم از کم صفر اور ایک سے زیادہ حروف درج کریں۔",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "براہ کرم کم از کم صفر صفیں بھریں۔",
  // "Please select at least {0} option(s)."
  minSelectError: "براہ کرم کم از کم صفر مختلف حالتیں منتخب کریں۔",
  // "Please select no more than {0} option(s)."
  maxSelectError: "براہ کرم صفر سے زیادہ متغیرات منتخب نہ کریں۔",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "صفر' کم از کم ایک اور زیادہ سے زیادہ دو ہونا چاہیے'",
  // "The '{0}' should be at least {1}"
  numericMin: "صفر' کم از کم ایک ہونا چاہیے'",
  // "The '{0}' should be at most {1}"
  numericMax: "صفر زیادہ سے زیادہ ایک ہونا چاہیے",
  // "Please enter a valid e-mail address."
  invalidEmail: "برائے مہربانی درست ای میل ایڈریس لکھیں",
  // "The expression: {0} should return 'true'."
  invalidExpression: " کلام: {0} کو 'درست' لوٹنا چاہیے۔",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "درخواست نے غلطی '{0}' لوٹائی۔ {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "درخواست نے خالی ڈیٹا واپس کر دیا۔ یا 'راستہ' پراپرٹی غلط ہے۔",
  // "The file size should not exceed {0}."
  exceedMaxSize: "فائل کا سائز {0} سے زیادہ نہیں ہونا چاہیے.",
  //  [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "فائلیں اپ لوڈ نہیں کی جا سکتیں۔ براہ کرم 'آن اپ لوڈ فائلز' ایونٹ کے لئے ایک ہینڈلر شامل کریں۔",
  // "Response required: enter another value."
  otherRequiredError: "براہ کرم دوسری عدد درج کریں۔ ",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "آپ کی فائل اپ لوڈ ہو رہی ہے۔ براہ کرم چند سیکنڈ انتظار کریں اور دوبارہ کوشش کریں۔",
  // "Loading..."
  loadingFile: "..لوڈ ہو رہا ہے۔",
  // "Choose file(s)..."
  chooseFile: "..فائلیں منتخب کریں۔ ",
  // "No file selected"
  noFileChosen: "کوئی فائل منتخب نہیں کی گئی ",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "یہاں فائل ڈراپ کریں یا فائل کو لوڈ کرنے کے لیے نیچے والے بٹن پر کلک کریں۔",
  // "Are you sure you want to delete this record?"
  confirmDelete: "کیا آپ ریکارڈ حذف کرنا چاہتے ہیں؟",
  // "This value should be unique."
  keyDuplicationError: "یہ عدد منفرد ہونی چاہیے۔",
  // "Add Column"
  addColumn: "کالم شامل کریں۔",
  // "Add Row"
  addRow: "قطار شامل کریں۔",
  // "Remove"
  removeRow: "مٹائے",
  // "There are no rows."
  noRowsText: "کوئی قطار نہیں ہیں۔ ",
  //  [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Row {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "نیا شامل کریں",
  // "Remove"
  removePanel: "مٹائے",
  //  [Auto-translated] "Show Details"
  showDetails: "تفصیلات دکھائیں",
  //  [Auto-translated] "Hide Details"
  hideDetails: "تفصیلات چھپائیں",
  // "item"
  choices_Item: "آئٹم",
  //  [Auto-translated] "Choice option"
  choices_Choice: "انتخاب کا اختیار",
  // "Column"
  matrix_column: "کالم۔",
  // "Row"
  matrix_row: "قطار۔",
  // "text"
  multipletext_itemname: "عبارت",
  // "The results are being saved on the server..."
  savingData: "...نتائج کو سرور پر محفوظ کیا جا رہا ہے",
  // "An error occurred and we could not save the results."
  savingDataError: "ایک خرابی پیش آگئی اور ہم نتائج کو محفوظ نہیں کر سکے۔",
  // "The results were saved successfully!"
  savingDataSuccess: "نتائج کامیابی سے محفوظ ہو گئے۔",
  //  [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner."
  savingExceedSize: "آپ کا جواب 64KB سے تجاوز کر گیا ہے۔ براہ کرم اپنی فائل کا سائز کم کریں اور دوبارہ کوشش کریں یا سروے کے مالک سے رابطہ کریں۔",
  // "Try again"
  saveAgainButton: "دوبارہ کوشش کریں",
  // "min"
  timerMin: "منٹ",
  // "sec"
  timerSec: "سیکنڈ",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "آپ نے اس صفحے پر {0} اور مجموعی طور پر {1} خرچ کیا ہے۔",
  // "You have spent {0} on this page."
  timerSpentPage: "آپ نے اس صفحے پر {0} خرچ کیا ہے۔",
  // "You have spent {0} in total."
  timerSpentSurvey: "آپ نے مجموعی طور پر {0} خرچ کیا ہے۔",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "آپ نے اس صفحے پر {0} میں سے {1} اور مجموعی طور پر {2} میں سے {3} خرچ کیے ہیں۔",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "آپ نے اس صفحے پر {0} میں سے {0} خرچ کیا ہے۔",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "آپ نے کل {1} میں سے {1} خرچ کیا ہے۔",
  // "Clear"
  clearCaption: "صاف",
  // "Sign here"
  signaturePlaceHolder: "یہاں سائن کریں۔",
  //  [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "کوئی دستخط نہیں",
  // "Select File"
  chooseFileCaption: "فائل منتخب کریں",
  //  [Auto-translated] "Take Photo"
  takePhotoCaption: "تصویر لیں",
  //  [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "کیمرے کا استعمال کرتے ہوئے تصویر لینے کے لئے نیچے دیئے گئے بٹن پر کلک کریں۔",
  //  [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "کیمرے کا استعمال کرتے ہوئے تصویر اپ لوڈ کرنے یا لینے کے لئے فائل کو گھسیٹیں اور چھوڑیں یا منتخب کریں۔",
  //  [Auto-translated] "Replace file"
  replaceFileCaption: "فائل کو تبدیل کریں",
  // "Remove this file"
  removeFileCaption: "اس فائل کو ہٹائے۔",
  // "Yes"
  booleanCheckedLabel: "جی ہاں",
  // "No"
  booleanUncheckedLabel: "نہیں",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "کیا آپ واقعی اس فائل کو ہٹانا چاہتے ہیں: {0}؟",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "کیا آپ تمام فائلیں ہٹانا چاہتے ہیں؟",
  // "Question Title"
  questionTitlePatternText: "سوال کا عنوان۔",
  // "Cancel"
  modalCancelButtonText: "منسوخ کریں",
  // "Apply"
  modalApplyButtonText: "درخواست دیں",
  //  [Auto-translated] "Type to search..."
  filterStringPlaceholder: "تلاش کرنے کے لئے ٹائپ کریں...",
  //  [Auto-translated] "No data to display"
  emptyMessage: "ظاہر کرنے کے لئے کوئی ڈیٹا نہیں",
  //  [Auto-translated] "Loading..."
  loadingPage: "لوڈنگ...",
  //  [Auto-translated] "Loading..."
  loadingData: "لوڈنگ...",
  //  [Auto-translated] "There are no entries yet.\nClick the button below to add a new entry."
  noEntriesText: "ابھی تک کوئی اندراج نہیں ہے.\nنیا اندراج شامل کرنے کے لئے نیچے دیئے گئے بٹن پر کلک کریں۔",
  //  [Auto-translated] "There are no entries."
  noEntriesReadonlyText: "کوئی اندراج نہیں ہے.",
  //  [Auto-translated] "New Panel"
  tabTitlePlaceholder: "نیا پینل",
  //  [Auto-translated] "More"
  more: "زیادہ",
  //  [Auto-translated] "OK"
  tagboxDoneButtonCaption: "ٹھيک ہے",
  //  [Auto-translated] "All choices are ranked"
  selectToRankEmptyRankedAreaText: "تمام اختیارات کی درجہ بندی کی جاتی ہے",
  //  [Auto-translated] "Drag and drop choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "انہیں درجہ دینے کے لئے انتخاب کو یہاں گھسیٹیں اور چھوڑیں",
  //  [Auto-translated] "OK"
  ok: "ٹھيک ہے",
  //  [Auto-translated] "Cancel"
  cancel: "منسوخ",
  // "Create \"{0}\" item..."
  createCustomItem: "\"{0}\" آئٹم بنائیں..."
};

setupLocale({ localeCode: "ur", strings: urduSurveyStrings, nativeName: "urdu", englishName: "Urdu" });
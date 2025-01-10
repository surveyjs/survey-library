import { setupLocale } from "survey-core";

export var urduSurveyStrings = {
  pagePrevText: "پچھلا",
  pageNextText: "اگلا",
  completeText: "مکمل",
  previewText: "دیکهنا",
  editText: "ترمیم",
  startSurveyText: "شروع کریں",
  otherItemText: "دیگر (بیان کریں)",
  noneItemText: "کوئی نہیں",
  refuseItemText: "جواب دینے سے انکار",
  dontKnowItemText: "معلوم نہيں",
  selectAllItemText: "تمام منتخب کریں",
  deselectAllItemText: "Deselect all",
  progressText: "صفحہ {0} از {1}",
  indexText: "{1} کے {0}",
  panelDynamicProgressText: "ریکارڈ {0} {1}",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: " سوالات کا جواب دیا۔ {0}/{1}",
  emptySurvey: "سروے میں کوئی نظر آنے والا صفحہ یا سوال نہیں ہے۔",
  completingSurvey: "سروے مکمل کرنے کے لیے آپ کا شکریہ!",
  completingSurveyBefore: "ہمارے ریکارڈ سے پتہ چلتا ہے کہ آپ پہلے ہی یہ سروے مکمل کر چکے ہیں۔",
  loadingSurvey: "...سروے لوڈ کر رہا ہے",
  placeholder: "...منتخب کریں ",
  ratingOptionsCaption: "منتخب...",
  value: "value",
  requiredError: "براہ کرم سوال کا جواب دیں۔",
  requiredErrorInPanel: "براہ کرم کم از کم ایک سوال کا جواب دیں۔",
  requiredInAllRowsError: "براہ کرم تمام قطاروں میں سوالات کے جوابات دیں۔",
  eachRowUniqueError: "ہر قطار کی ایک منفرد قدر ہونی چاہئے۔",
  numericError: "اس کا جواب عدد میں ہونا چاہئے۔",
  minError: "عدد صفر سے کم نہیں ہونی چاہئے",
  maxError: "عدد صفر سے زیادہ نہیں ہونی چاہیے",
  textNoDigitsAllow: "نمبروں کی اجازت نہیں ہے۔",
  textMinLength: "براہ کرم کم از کم صفر حروف درج کریں۔",
  textMaxLength: "براہ کرم صفر سے زیادہ حروف درج نہ کریں۔",
  textMinMaxLength: "براہ کرم کم از کم صفر اور ایک سے زیادہ حروف درج کریں۔",
  minRowCountError: "براہ کرم کم از کم صفر صفیں بھریں۔",
  minSelectError: "براہ کرم کم از کم صفر مختلف حالتیں منتخب کریں۔",
  maxSelectError: "براہ کرم صفر سے زیادہ متغیرات منتخب نہ کریں۔",
  numericMinMax: "صفر' کم از کم ایک اور زیادہ سے زیادہ دو ہونا چاہیے'",
  numericMin: "صفر' کم از کم ایک ہونا چاہیے'",
  numericMax: "صفر زیادہ سے زیادہ ایک ہونا چاہیے",
  invalidEmail: "برائے مہربانی درست ای میل ایڈریس لکھیں",
  invalidExpression: " کلام: {0} کو 'درست' لوٹنا چاہیے۔",
  urlRequestError: "درخواست نے غلطی '{0}' لوٹائی۔ {1}",
  urlGetChoicesError: "درخواست نے خالی ڈیٹا واپس کر دیا۔ یا 'راستہ' پراپرٹی غلط ہے۔",
  exceedMaxSize: "فائل کا سائز {0} سے زیادہ نہیں ہونا چاہیے.",
  noUploadFilesHandler: "فائلیں اپ لوڈ نہیں کی جا سکتیں۔ براہ کرم 'آن اپ لوڈ فائلز' ایونٹ کے لئے ایک ہینڈلر شامل کریں۔",
  otherRequiredError: "براہ کرم دوسری عدد درج کریں۔ ",
  uploadingFile: "آپ کی فائل اپ لوڈ ہو رہی ہے۔ براہ کرم چند سیکنڈ انتظار کریں اور دوبارہ کوشش کریں۔",
  loadingFile: "..لوڈ ہو رہا ہے۔",
  chooseFile: "..فائلیں منتخب کریں۔ ",
  noFileChosen: "کوئی فائل منتخب نہیں کی گئی ",
  filePlaceholder: "یہاں فائل ڈراپ کریں یا فائل کو لوڈ کرنے کے لیے نیچے والے بٹن پر کلک کریں۔",
  confirmDelete: "کیا آپ ریکارڈ حذف کرنا چاہتے ہیں؟",
  keyDuplicationError: "یہ عدد منفرد ہونی چاہیے۔",
  addColumn: "کالم شامل کریں۔",
  addRow: "قطار شامل کریں۔",
  removeRow: "مٹائے",
  noRowsText: "کوئی قطار نہیں ہیں۔ ",
  addPanel: "نیا شامل کریں",
  removePanel: "مٹائے",
  showDetails: "تفصیلات دکھائیں",
  hideDetails: "تفصیلات چھپائیں",
  choices_Item: "آئٹم",
  matrix_column: "کالم۔",
  matrix_row: "قطار۔",
  multipletext_itemname: "عبارت",
  savingData: "...نتائج کو سرور پر محفوظ کیا جا رہا ہے",
  savingDataError: "ایک خرابی پیش آگئی اور ہم نتائج کو محفوظ نہیں کر سکے۔",
  savingDataSuccess: "نتائج کامیابی سے محفوظ ہو گئے۔",
  savingExceedSize: "آپ کا جواب 64KB سے تجاوز کر گیا ہے۔ براہ کرم اپنی فائل کا سائز کم کریں اور دوبارہ کوشش کریں یا سروے کے مالک سے رابطہ کریں۔",
  saveAgainButton: "دوبارہ کوشش کریں",
  timerMin: "منٹ",
  timerSec: "سیکنڈ",
  timerSpentAll: "آپ نے اس صفحے پر {0} اور مجموعی طور پر {1} خرچ کیا ہے۔",
  timerSpentPage: "آپ نے اس صفحے پر {0} خرچ کیا ہے۔",
  timerSpentSurvey: "آپ نے مجموعی طور پر {0} خرچ کیا ہے۔",
  timerLimitAll: "آپ نے اس صفحے پر {0} میں سے {1} اور مجموعی طور پر {2} میں سے {3} خرچ کیے ہیں۔",
  timerLimitPage: "آپ نے اس صفحے پر {0} میں سے {0} خرچ کیا ہے۔",
  timerLimitSurvey: "آپ نے کل {1} میں سے {1} خرچ کیا ہے۔",
  clearCaption: "صاف",
  signaturePlaceHolder: "یہاں سائن کریں۔",
  signaturePlaceHolderReadOnly: "کوئی دستخط نہیں",
  chooseFileCaption: "فائل منتخب کریں",
  takePhotoCaption: "تصویر لیں",
  photoPlaceholder: "کیمرے کا استعمال کرتے ہوئے تصویر لینے کے لئے نیچے دیئے گئے بٹن پر کلک کریں۔",
  fileOrPhotoPlaceholder: "کیمرے کا استعمال کرتے ہوئے تصویر اپ لوڈ کرنے یا لینے کے لئے فائل کو گھسیٹیں اور چھوڑیں یا منتخب کریں۔",
  replaceFileCaption: "فائل کو تبدیل کریں",
  removeFileCaption: "اس فائل کو ہٹائے۔",
  booleanCheckedLabel: "جی ہاں",
  booleanUncheckedLabel: "نہیں",
  confirmRemoveFile: "کیا آپ واقعی اس فائل کو ہٹانا چاہتے ہیں: {0}؟",
  confirmRemoveAllFiles: "کیا آپ تمام فائلیں ہٹانا چاہتے ہیں؟",
  questionTitlePatternText: "سوال کا عنوان۔",
  modalCancelButtonText: "منسوخ کریں",
  modalApplyButtonText: "درخواست دیں",
  filterStringPlaceholder: "تلاش کرنے کے لئے ٹائپ کریں...",
  emptyMessage: "ظاہر کرنے کے لئے کوئی ڈیٹا نہیں",
  noEntriesText: "ابھی تک کوئی اندراج نہیں ہے.\nنیا اندراج شامل کرنے کے لئے نیچے دیئے گئے بٹن پر کلک کریں۔",
  noEntriesReadonlyText: "کوئی اندراج نہیں ہے.",
  tabTitlePlaceholder: "نیا پینل",
  more: "زیادہ",
  tagboxDoneButtonCaption: "ٹھيک ہے",
  selectToRankEmptyRankedAreaText: "تمام اختیارات کی درجہ بندی کی جاتی ہے",
  selectToRankEmptyUnrankedAreaText: "انہیں درجہ دینے کے لئے انتخاب کو یہاں گھسیٹیں اور چھوڑیں",
  ok: "ٹھيک ہے",
  cancel: "منسوخ"
};

setupLocale({ localeCode: "ur", strings: urduSurveyStrings, nativeName: "urdu", englishName: "Urdu" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{1} کے {0}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// ratingOptionsCaption: "Select..." => "منتخب..."
// filterStringPlaceholder: "Type to search..." => "تلاش کرنے کے لئے ٹائپ کریں..."
// emptyMessage: "No data to display" => "ظاہر کرنے کے لئے کوئی ڈیٹا نہیں"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "ابھی تک کوئی اندراج نہیں ہے.\nنیا اندراج شامل کرنے کے لئے نیچے دیئے گئے بٹن پر کلک کریں۔"
// noEntriesReadonlyText: "There are no entries." => "کوئی اندراج نہیں ہے."
// more: "More" => "زیادہ"
// tagboxDoneButtonCaption: "OK" => "ٹھيک ہے"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "تمام اختیارات کی درجہ بندی کی جاتی ہے"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "انہیں درجہ دینے کے لئے انتخاب کو یہاں گھسیٹیں اور چھوڑیں"// takePhotoCaption: "Take Photo" => "تصویر لیں"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "کیمرے کا استعمال کرتے ہوئے تصویر لینے کے لئے نیچے دیئے گئے بٹن پر کلک کریں۔"
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "کیمرے کا استعمال کرتے ہوئے تصویر اپ لوڈ کرنے یا لینے کے لئے فائل کو گھسیٹیں اور چھوڑیں یا منتخب کریں۔"
// replaceFileCaption: "Replace file" => "فائل کو تبدیل کریں"// eachRowUniqueError: "Each row must have a unique value." => "ہر قطار کی ایک منفرد قدر ہونی چاہئے۔"
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "فائلیں اپ لوڈ نہیں کی جا سکتیں۔ براہ کرم 'آن اپ لوڈ فائلز' ایونٹ کے لئے ایک ہینڈلر شامل کریں۔"
// showDetails: "Show Details" => "تفصیلات دکھائیں"
// hideDetails: "Hide Details" => "تفصیلات چھپائیں"
// ok: "OK" => "ٹھيک ہے"
// cancel: "Cancel" => "منسوخ"// refuseItemText: "Refuse to answer" => "جواب دینے سے انکار"
// dontKnowItemText: "Don't know" => "معلوم نہيں"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "آپ کا جواب 64KB سے تجاوز کر گیا ہے۔ براہ کرم اپنی فائل کا سائز کم کریں اور دوبارہ کوشش کریں یا سروے کے مالک سے رابطہ کریں۔"
// signaturePlaceHolderReadOnly: "No signature" => "کوئی دستخط نہیں"// tabTitlePlaceholder: "New Panel" => "نیا پینل"// deselectAllItemText: "Deselect all" => "Deselect all"
// textNoDigitsAllow: "Numbers are not allowed." => "نمبروں کی اجازت نہیں ہے۔"
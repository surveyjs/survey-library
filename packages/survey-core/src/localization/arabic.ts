import { setupLocale } from "survey-core";

export var arabicSurveyStrings = {
  // "Previous"
  pagePrevText: "السابق",
  // "Next"
  pageNextText: "التالي",
  // "Complete"
  completeText: "إرسال البيانات",
  // "Preview"
  previewText: "معاينة",
  // "Edit"
  editText: "تعديل",
  // "Start"
  startSurveyText: "بداية",
  // [Auto-translated] "Please leave a comment"
  commentText: "الرجاء ترك تعليق",
  // "Other (describe)"
  otherItemText: "نص آخر",
  // "None"
  noneItemText: "لا شيء",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "رفض الإجابة",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "لا أعرف",
  // "Select All"
  selectAllItemText: "اختر الكل",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "إلغاء تحديد الكل",
  // "Page {0} of {1}"
  progressText: "{1} صفحة {0} من",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} من {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "سجل {0} من {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "لوحة {بانل إندكس}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "تمت الإجابة على أسئلة {0} / {1}",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "لا توجد صفحة مرئية أو سؤال في النموذج",
  // "Thank you for completing the survey"
  completingSurvey: "شكرا لكم لاستكمال النموذج!",
  // "You have already completed this survey."
  completingSurveyBefore: "تظهر سجلاتنا أنك قد أكملت هذا الاستطلاع بالفعل.",
  // "Loading Survey..."
  loadingSurvey: "...يتم تحميل النموذج",
  // "Select..."
  placeholder: "...اختر",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "اختار...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "اختار...",
  // "value"
  value: "القيمة",
  // "Response required."
  requiredError: ".يرجى الإجابة على السؤال",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "الرجاء الإجابة على سؤال واحد على الأقل.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "يرجى الإجابة على الأسئلة في جميع الصفوف",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "يجب أن يكون لكل صف قيمة فريدة.",
  // "The value should be numeric."
  numericError: "يجب أن تكون القيمة رقمية.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "يجب ألا تقل القيمة عن {0}",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "يجب ألا تزيد القيمة عن {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "الأرقام غير مسموح بها.",
  // "Please enter at least {0} character(s)."
  textMinLength: "الرجاء إدخال ما لا يقل عن {0} حروف",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "الرجاء إدخال أقل من {0} حروف",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "يرجى إدخال أكثر من {0} وأقل من {1} حروف",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "يرجى ملء ما لا يقل عن {0} الصفوف",
  // "Please select at least {0} option(s)."
  minSelectError: "يرجى تحديد ما لا يقل عن {0} المتغيرات",
  // "Please select no more than {0} option(s)."
  maxSelectError: "يرجى تحديد ما لا يزيد عن {0} المتغيرات",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "و'{0}' يجب أن تكون مساوية أو أكثر من {1} وتساوي أو أقل من {2}ا",
  // "The '{0}' should be at least {1}"
  numericMin: "و'{0}' يجب أن تكون مساوية أو أكثر من {1}ا",
  // "The '{0}' should be at most {1}"
  numericMax: "و'{0}' يجب أن تكون مساوية أو أقل من {1}ا",
  // "Please enter a valid e-mail address."
  invalidEmail: "الرجاء إدخال بريد الكتروني صحيح",
  // "The expression: {0} should return 'true'."
  invalidExpression: "يجب أن يعرض التعبير: {0} 'صواب'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "طلب إرجاع خطأ '{0}'. {1}ا",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "عاد طلب البيانات فارغ أو 'المسار' غير صحيح ",
  // "The file size should not exceed {0}."
  exceedMaxSize: "ينبغي ألا يتجاوز حجم الملف {0}ا",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "لا يمكن تحميل الملفات. يرجى إضافة معالج لحدث \"onUploadFiles\".",
  // "Response required: enter another value."
  otherRequiredError: "الرجاء إدخال قيمة أخرى",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "تحميل الملف الخاص بك. يرجى الانتظار عدة ثوان والمحاولة لاحقًا",
  // "Loading..."
  loadingFile: "جار التحميل...",
  // "Choose file(s)..."
  chooseFile: "اختر الملفات...",
  // "No file selected"
  noFileChosen: "لم تقم باختيار ملف",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "اسحب ملفا وأفلته هنا أو انقر فوق الزر أدناه لتحديد ملف لتحميله.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "هل تريد حذف السجل؟",
  // "This value should be unique."
  keyDuplicationError: "يجب أن تكون هذه القيمة فريدة.",
  // "Add Column"
  addColumn: "أضف العمود",
  // "Add Row"
  addRow: "اضافة صف",
  // "Remove"
  removeRow: "إزالة صف",
  // [Auto-translated] "There are no rows."
  noRowsText: "لا توجد صفوف.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "الصف {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "اضف جديد",
  // "Remove"
  removePanel: "إزالة",
  // [Auto-translated] "Show Details"
  showDetails: "اظهر التفاصيل",
  // [Auto-translated] "Hide Details"
  hideDetails: "إخفاء التفاصيل",
  // "item"
  choices_Item: "بند",
  // [Auto-translated] "Choice option"
  choices_Choice: "خيار الاختيار",
  // "Column"
  matrix_column: "عمود",
  // "Row"
  matrix_row: "صف",
  // [Auto-translated] "text"
  multipletext_itemname: "نص",
  // "The results are being saved on the server..."
  savingData: "يتم حفظ النتائج على الخادم ...",
  // "An error occurred and we could not save the results."
  savingDataError: "حدث خطأ ولم نتمكن من حفظ النتائج.",
  // "The results were saved successfully!"
  savingDataSuccess: "تم حفظ النتائج بنجاح!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "ردك يتجاوز 64 كيلوبايت. يرجى تقليل حجم الملف (الملفات) الخاصة بك والمحاولة مرة أخرى أو الاتصال بمالك الاستطلاع.",
  // "Try again"
  saveAgainButton: "حاول مجددا",
  // "min"
  timerMin: "دقيقة",
  // "sec"
  timerSec: "ثانية",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "لقد أنفقت {0} على هذه الصفحة و {1} إجمالاً.",
  // "You have spent {0} on this page."
  timerSpentPage: "لقد أنفقت {0} على هذه الصفحة.",
  // "You have spent {0} in total."
  timerSpentSurvey: "لقد أنفقت {0} إجمالاً.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "لقد أنفقت {0} من {1} في هذه الصفحة و {2} من إجمالي {3}.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "لقد أنفقت {0} من {1} في هذه الصفحة.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "لقد أنفقت {0} من إجمالي {1}.",
  // "Clear"
  clearCaption: "واضح",
  // [Auto-translated] "Select"
  selectCaption: "اختار",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "وقع هنا",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "لا يوجد توقيع",
  // "Select File"
  chooseFileCaption: "اختر ملف",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "التقاط صورة",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "انقر فوق الزر أدناه لالتقاط صورة باستخدام الكاميرا.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "قم بسحب ملف وإفلاته أو تحديده لتحميله أو التقاط صورة باستخدام الكاميرا.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "استبدال الملف",
  // "Remove this file"
  removeFileCaption: "قم بإزالة هذا الملف",
  // "Yes"
  booleanCheckedLabel: "نعم",
  // "No"
  booleanUncheckedLabel: "لا",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "هل أنت متأكد أنك تريد إزالة هذا الملف: {0}؟",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "هل أنت متأكد أنك تريد إزالة كافة الملفات؟",
  // "Question Title"
  questionTitlePatternText: "عنوان السؤال",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "إلغاء الأمر",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "طبق",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "اكتب للبحث...",
  // [Auto-translated] "No data to display"
  emptyMessage: "لا توجد بيانات للعرض",
  // [Auto-translated] "Loading..."
  loadingPage: "تحميل...",
  // [Auto-translated] "Loading..."
  loadingData: "تحميل...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "لا توجد إدخالات بعد.\nانقر فوق الزر أدناه لإضافة إدخال جديد.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "لا توجد إدخالات",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "لوحة جديدة",
  // [Auto-translated] "More"
  more: "أكثر",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "موافق",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "يتم تحديد جميع الخيارات للترتيب",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "اسحب الخيارات هنا لترتيبها",
  // [Auto-translated] "OK"
  ok: "موافق",
  // [Auto-translated] "Cancel"
  cancel: "إلغاء الأمر",
  // "Create \"{0}\" item..."
  createCustomItem: "قم بإنشاء عنصر \"{0}\" ...",
  // [Auto-translated] "Table of contents"
  toc: "جدول المحتويات",
  // [Auto-translated] "Progress bar"
  progressbar: "شريط التقدم"
};

setupLocale({ localeCode: "ar", strings: arabicSurveyStrings, nativeName: "العربية", englishName: "Arabic", rtl: true });
import { setupLocale } from "survey-core";

export var persianSurveyStrings = {
  // "Previous"
  pagePrevText: "قبلی",
  // "Next"
  pageNextText: "بعدی",
  // "Complete"
  completeText: "تکمیل",
  // "Preview"
  previewText: "پیش نمایش",
  // "Edit"
  editText: "ویرایش",
  // "Start"
  startSurveyText: "شروع",
  // [Auto-translated] "Please leave a comment"
  commentText: "لطفا نظر خود را بنویسید",
  // "Other (describe)"
  otherItemText: "دیگر(توضیح)",
  // "None"
  noneItemText: "هیچ",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "امتناع از پاسخ دادن",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "نمی دانم",
  // "Select All"
  selectAllItemText: "انتخاب همه",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "لغو انتخاب همه",
  // "Page {0} of {1}"
  progressText: "صفحه {0} از {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "مورد {0} از {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "پنل {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "تعداد پاسخ {0}/{1} سوال",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "صفحه ای یا گزینه ای برای این پرسشنامه موجود نیست.",
  // "Thank you for completing the survey"
  completingSurvey: "از شما بابت تکمیل این پرسشنامه متشکریم",
  // "You have already completed this survey."
  completingSurveyBefore: "به نظر می رسد هم هم اکنون پرسشنامه را تکمیل کرده اید.",
  // "Loading Survey..."
  loadingSurvey: "درحال ایجاد پرسشنامه",
  // "Select..."
  placeholder: "انتخاب کنید...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "انتخاب...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "انتخاب...",
  // "value"
  value: "مقدار",
  // "Response required."
  requiredError: "لطفا به سوال پاسخ دهید",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "لطفا حداقل به یک سوال پاسخ دهید.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "لطفا سوالات تمام سطرها را پاسخ دهید.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "هر سطر باید یک مقدار منحصر به فرد داشته باشد.",
  // "The value should be numeric."
  numericError: "مقدار باید عددی باشد",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "ارزش نباید کمتر از {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "لطفا مقداری را وارد کنید که با اندازه گام {0} مطابقت داشته باشد.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "ارزش نباید بیشتر از {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "شماره ها مجاز نیستند.",
  // "Please enter at least {0} character(s)."
  textMinLength: "لطفا حداقل  {0} حرف وارد کنید",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "لطفا کمتر از  {0} حرف وارد کنید.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "لطفا بیشتر از  {0} حرف و کمتر از {1} حرف وارد کنید.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "لطفا حداقل {0} سطر وارد کنید.",
  // "Please select at least {0} option(s)."
  minSelectError: "حداقل {0} انتخاب کنید.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "لطفا بیشتر از  {0} انتخاب کنید.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' باید بین {1} و {2} باشد",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' بزرگتر مساوی {1} باشد",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' باید کوچکتر یا مساوی {1} باشد",
  // "Please enter a valid e-mail address."
  invalidEmail: "لطفا ایمیل صحیح درج کنید",
  // "The expression: {0} should return 'true'."
  invalidExpression: "عبارت: {0} پاسخ باید 'true' باشد.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "درخواست با خطا روبرو شد: '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "درخواست مسیری خالی بازگشت داده یا مسیر درست تنظیم نشده",
  // "The file size should not exceed {0}."
  exceedMaxSize: "بیشترین حجم مجاز فایل: {0}",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "پروندهها را نمیتوان بارگذاری کرد. لطفا یک گرداننده برای رویداد \"onUploadFiles\" اضافه کنید.",
  // "Response required: enter another value."
  otherRequiredError: "مقدار 'دیگر' را وارد کنید",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "فایل در حال آیلود است. لطفا صبر کنید.",
  // "Loading..."
  loadingFile: "بارگیری...",
  // "Choose file(s)..."
  chooseFile: "انتخاب فایل(ها)...",
  // "No file selected"
  noFileChosen: "هیچ فایلی انتخاب نشده",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "یک فایل را در اینجا بکشید و رها کنید یا روی دکمه زیر کلیک کنید تا فایلی را برای آپلود انتخاب کنید.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "آیا مایل به حذف این ردیف هستید؟",
  // "This value should be unique."
  keyDuplicationError: "این مقدار باید غیر تکراری باشد",
  // "Add Column"
  addColumn: "ستون جدید",
  // "Add Row"
  addRow: "سطر جدید",
  // "Remove"
  removeRow: "حذف",
  // [Auto-translated] "There are no rows."
  noRowsText: "هیچ ردیفی وجود ندارد.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "ردیف {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "جدید",
  // "Remove"
  removePanel: "حذف",
  // [Auto-translated] "Show Details"
  showDetails: "نمایش جزئیات",
  // [Auto-translated] "Hide Details"
  hideDetails: "مخفی کردن جزئیات",
  // "item"
  choices_Item: "آیتم",
  // [Auto-translated] "Choice option"
  choices_Choice: "گزینه انتخاب",
  // "Column"
  matrix_column: "ستون",
  // "Row"
  matrix_row: "سطر",
  // [Auto-translated] "text"
  multipletext_itemname: "پیامک",
  // "The results are being saved on the server..."
  savingData: "نتایج در حال ذخیره سازی در سرور است",
  // "An error occurred and we could not save the results."
  savingDataError: "خطایی در ذخیره سازی نتایج رخ داده است",
  // "The results were saved successfully!"
  savingDataSuccess: "نتایج با موفقیت ذخیره شد",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "پاسخ شما بیش از 64 کیلوبایت است. لطفا حجم فایل(های) خود را کاهش دهید و دوباره امتحان کنید یا با مالک نظرسنجی تماس بگیرید.",
  // "Try again"
  saveAgainButton: "مجدد تلاش کنید",
  // "min"
  timerMin: "دقیقه",
  // "sec"
  timerSec: "ثانیه",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "شما مدت {0} در این صفحه و مدت {1} را در مجموع سپری کرده اید.",
  // "You have spent {0} on this page."
  timerSpentPage: "شما مدت {0} را در این صفحه سپری کرده اید.",
  // "You have spent {0} in total."
  timerSpentSurvey: "شما مدت {0} را در مجموع سپری کرده اید.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "شما مدت {0} از {1} در این صفحه و مدت {2} از {3} را در مجموع سپری کرده اید.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "شما مدت {0} از {1} را در این صفحه سپری کرده اید.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "شما مدت {0} از {1} را در مجموع سپری کرده اید.",
  // "Clear"
  clearCaption: "خالی کردن",
  // [Auto-translated] "Select"
  selectCaption: "انتخاب",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "اینجا را امضا کنید",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "بدون امضا",
  // "Select File"
  chooseFileCaption: "انتخاب فایل",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "گرفتن عکس",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "روی دکمه زیر کلیک کنید تا با استفاده از دوربین عکس بگیرید.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "کشیدن و رها کردن یا انتخاب یک فایل برای اپلود یا گرفتن عکس با استفاده از دوربین.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "جایگزینی پرونده",
  // "Remove this file"
  removeFileCaption: "حذف این فایل",
  // "Yes"
  booleanCheckedLabel: "بله",
  // "No"
  booleanUncheckedLabel: "خیر",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "آیا میخواهید این فایل را پاک کنید: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "آیا میخواهید تمام فایل ها را پاک کنید?",
  // "Question Title"
  questionTitlePatternText: "عنوان سوال",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "لغو",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "درخواست",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "تایپ برای جستجو...",
  // [Auto-translated] "No data to display"
  emptyMessage: "داده ای برای نمایش وجود ندارد",
  // [Auto-translated] "Loading..."
  loadingPage: "بارگذاری...",
  // [Auto-translated] "Loading..."
  loadingData: "بارگذاری...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "هنوز هیچ مدخلی وجود ندارد.\nبرای افزودن ورودی جدید روی دکمه زیر کلیک کنید.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "بدون ورودی",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "پنل جدید",
  // [Auto-translated] "More"
  more: "بیشتر",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "باشه",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "همه گزینه ها برای رتبه بندی انتخاب می شوند",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "گزینه ها را در اینجا بکشید تا آنها را رتبه بندی کنید",
  // [Auto-translated] "OK"
  ok: "باشه",
  // [Auto-translated] "Cancel"
  cancel: "لغو",
  // "Create \"{0}\" item..."
  createCustomItem: "مورد \"{0}\" ایجاد کنید...",
  // [Auto-translated] "Table of contents"
  toc: "جدول محتویات",
  // [Auto-translated] "Progress bar"
  progressbar: "نوار پیشرفت"
};

setupLocale({ localeCode: "fa", strings: persianSurveyStrings, nativeName: "فارْسِى", englishName: "Persian", rtl: true });
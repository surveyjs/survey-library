import { setupLocale } from "survey-core";

export var persianSurveyStrings = {
  pagePrevText: "قبلی",
  pageNextText: "بعدی",
  completeText: "تکمیل",
  previewText: "پیش نمایش",
  editText: "ویرایش",
  startSurveyText: "شروع",
  otherItemText: "دیگر(توضیح)",
  noneItemText: "هیچ",
  refuseItemText: "امتناع از پاسخ دادن",
  dontKnowItemText: "نمی دانم",
  selectAllItemText: "انتخاب همه",
  deselectAllItemText: "لغو انتخاب همه",
  progressText: "صفحه {0} از {1}",
  indexText: "{0} {1}",
  panelDynamicProgressText: "مورد {0} از {1}",
  panelDynamicTabTextFormat: "پنل {panelIndex}",
  questionsProgressText: "تعداد پاسخ {0}/{1} سوال",
  emptySurvey: "صفحه ای یا گزینه ای برای این پرسشنامه موجود نیست.",
  completingSurvey: "از شما بابت تکمیل این پرسشنامه متشکریم",
  completingSurveyBefore: "به نظر می رسد هم هم اکنون پرسشنامه را تکمیل کرده اید.",
  loadingSurvey: "درحال ایجاد پرسشنامه",
  placeholder: "انتخاب کنید...",
  ratingOptionsCaption: "انتخاب...",
  value: "مقدار",
  requiredError: "لطفا به سوال پاسخ دهید",
  requiredErrorInPanel: "لطفا حداقل به یک سوال پاسخ دهید.",
  requiredInAllRowsError: "لطفا سوالات تمام سطرها را پاسخ دهید.",
  eachRowUniqueError: "هر سطر باید یک مقدار منحصر به فرد داشته باشد.",
  numericError: "مقدار باید عددی باشد",
  minError: "ارزش نباید کمتر از {0}",
  maxError: "ارزش نباید بیشتر از {0}",
  textNoDigitsAllow: "شماره ها مجاز نیستند.",
  textMinLength: "لطفا حداقل  {0} حرف وارد کنید",
  textMaxLength: "لطفا کمتر از  {0} حرف وارد کنید.",
  textMinMaxLength: "لطفا بیشتر از  {0} حرف و کمتر از {1} حرف وارد کنید.",
  minRowCountError: "لطفا حداقل {0} سطر وارد کنید.",
  minSelectError: "حداقل {0} انتخاب کنید.",
  maxSelectError: "لطفا بیشتر از  {0} انتخاب کنید.",
  numericMinMax: "'{0}' باید بین {1} و {2} باشد",
  numericMin: "'{0}' بزرگتر مساوی {1} باشد",
  numericMax: "'{0}' باید کوچکتر یا مساوی {1} باشد",
  invalidEmail: "لطفا ایمیل صحیح درج کنید",
  invalidExpression: "عبارت: {0} پاسخ باید 'true' باشد.",
  urlRequestError: "درخواست با خطا روبرو شد: '{0}'. {1}",
  urlGetChoicesError: "درخواست مسیری خالی بازگشت داده یا مسیر درست تنظیم نشده",
  exceedMaxSize: "بیشترین حجم مجاز فایل: {0}",
  noUploadFilesHandler: "پروندهها را نمیتوان بارگذاری کرد. لطفا یک گرداننده برای رویداد \"onUploadFiles\" اضافه کنید.",
  otherRequiredError: "مقدار 'دیگر' را وارد کنید",
  uploadingFile: "فایل در حال آیلود است. لطفا صبر کنید.",
  loadingFile: "بارگیری...",
  chooseFile: "انتخاب فایل(ها)...",
  noFileChosen: "هیچ فایلی انتخاب نشده",
  filePlaceholder: "کشیدن و رها کردن یک فایل در اینجا و یا کلیک بر روی دکمه زیر و یک فایل برای اپلود را انتخاب کنید.",
  confirmDelete: "آیا مایل به حذف این ردیف هستید؟",
  keyDuplicationError: "این مقدار باید غیر تکراری باشد",
  addColumn: "ستون جدید",
  addRow: "سطر جدید",
  removeRow: "حذف",
  noRowsText: "هیچ ردیفی وجود ندارد.",
  addPanel: "جدید",
  removePanel: "حذف",
  showDetails: "نمایش جزئیات",
  hideDetails: "مخفی کردن جزئیات",
  choices_Item: "آیتم",
  matrix_column: "ستون",
  matrix_row: "سطر",
  multipletext_itemname: "پیامک",
  savingData: "نتایج در حال ذخیره سازی در سرور است",
  savingDataError: "خطایی در ذخیره سازی نتایج رخ داده است",
  savingDataSuccess: "نتایج با موفقیت ذخیره شد",
  savingExceedSize: "پاسخ شما بیش از 64KB است. لطفا اندازه فایل(های) خود را کاهش دهید و دوباره تلاش کنید یا با صاحب نظرسنجی تماس بگیرید.",
  saveAgainButton: "مجدد تلاش کنید",
  timerMin: "دقیقه",
  timerSec: "ثانیه",
  timerSpentAll: "شما مدت {0} در این صفحه و مدت {1} را در مجموع سپری کرده اید.",
  timerSpentPage: "شما مدت {0} را در این صفحه سپری کرده اید.",
  timerSpentSurvey: "شما مدت {0} را در مجموع سپری کرده اید.",
  timerLimitAll: "شما مدت {0} از {1} در این صفحه و مدت {2} از {3} را در مجموع سپری کرده اید.",
  timerLimitPage: "شما مدت {0} از {1} را در این صفحه سپری کرده اید.",
  timerLimitSurvey: "شما مدت {0} از {1} را در مجموع سپری کرده اید.",
  clearCaption: "خالی کردن",
  signaturePlaceHolder: "اینجا را امضا کنید",
  signaturePlaceHolderReadOnly: "بدون امضا",
  chooseFileCaption: "انتخاب فایل",
  takePhotoCaption: "گرفتن عکس",
  photoPlaceholder: "روی دکمه زیر کلیک کنید تا با استفاده از دوربین عکس بگیرید.",
  fileOrPhotoPlaceholder: "کشیدن و رها کردن یا انتخاب یک فایل برای اپلود یا گرفتن عکس با استفاده از دوربین.",
  replaceFileCaption: "جایگزینی پرونده",
  removeFileCaption: "حذف این فایل",
  booleanCheckedLabel: "بله",
  booleanUncheckedLabel: "خیر",
  confirmRemoveFile: "آیا میخواهید این فایل را پاک کنید: {0}?",
  confirmRemoveAllFiles: "آیا میخواهید تمام فایل ها را پاک کنید?",
  questionTitlePatternText: "عنوان سوال",
  modalCancelButtonText: "لغو",
  modalApplyButtonText: "درخواست",
  filterStringPlaceholder: "تایپ برای جستجو...",
  emptyMessage: "داده ای برای نمایش وجود ندارد",
  noEntriesText: "هنوز هیچ ورودی وجود ندارد.\nروی دکمه زیر کلیک کنید تا یک ورودی جدید اضافه شود.",
  noEntriesReadonlyText: "هیچ ورودی وجود ندارد.",
  tabTitlePlaceholder: "پنل جدید",
  more: "بیشتر",
  tagboxDoneButtonCaption: "باشه",
  selectToRankEmptyRankedAreaText: "همه انتخاب ها رتبه بندی می شوند",
  selectToRankEmptyUnrankedAreaText: "انتخاب های کشیدن و رها کردن در اینجا برای رتبه بندی انها",
  ok: "باشه",
  cancel: "لغو"
};

setupLocale({ localeCode: "fa", strings: persianSurveyStrings, nativeName: "فارْسِى", englishName: "Persian", rtl: true });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "پنل {panelIndex}"
// ratingOptionsCaption: "Select..." => "انتخاب..."
// minError: "The value should not be less than {0}" => "ارزش نباید کمتر از {0}"
// maxError: "The value should not be greater than {0}" => "ارزش نباید بیشتر از {0}"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "کشیدن و رها کردن یک فایل در اینجا و یا کلیک بر روی دکمه زیر و یک فایل برای اپلود را انتخاب کنید."
// noRowsText: "There are no rows." => "هیچ ردیفی وجود ندارد."
// multipletext_itemname: "text" => "پیامک"
// signaturePlaceHolder: "Sign here" => "اینجا را امضا کنید"
// modalCancelButtonText: "Cancel" => "لغو"
// modalApplyButtonText: "Apply" => "درخواست"
// filterStringPlaceholder: "Type to search..." => "تایپ برای جستجو..."
// emptyMessage: "No data to display" => "داده ای برای نمایش وجود ندارد"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "هنوز هیچ ورودی وجود ندارد.\nروی دکمه زیر کلیک کنید تا یک ورودی جدید اضافه شود."
// noEntriesReadonlyText: "There are no entries." => "هیچ ورودی وجود ندارد."
// more: "More" => "بیشتر"
// tagboxDoneButtonCaption: "OK" => "باشه"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "همه انتخاب ها رتبه بندی می شوند"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "انتخاب های کشیدن و رها کردن در اینجا برای رتبه بندی انها"// takePhotoCaption: "Take Photo" => "گرفتن عکس"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "روی دکمه زیر کلیک کنید تا با استفاده از دوربین عکس بگیرید."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "کشیدن و رها کردن یا انتخاب یک فایل برای اپلود یا گرفتن عکس با استفاده از دوربین."
// replaceFileCaption: "Replace file" => "جایگزینی پرونده"// eachRowUniqueError: "Each row must have a unique value." => "هر سطر باید یک مقدار منحصر به فرد داشته باشد."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "پروندهها را نمیتوان بارگذاری کرد. لطفا یک گرداننده برای رویداد \"onUploadFiles\" اضافه کنید."
// showDetails: "Show Details" => "نمایش جزئیات"
// hideDetails: "Hide Details" => "مخفی کردن جزئیات"
// ok: "OK" => "باشه"
// cancel: "Cancel" => "لغو"
// refuseItemText: "Refuse to answer" => "امتناع از پاسخ دادن"
// dontKnowItemText: "Don't know" => "نمی دانم"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "پاسخ شما بیش از 64KB است. لطفا اندازه فایل(های) خود را کاهش دهید و دوباره تلاش کنید یا با صاحب نظرسنجی تماس بگیرید."
// signaturePlaceHolderReadOnly: "No signature" => "بدون امضا"// tabTitlePlaceholder: "New Panel" => "پنل جدید"// deselectAllItemText: "Deselect all" => "لغو انتخاب همه"
// textNoDigitsAllow: "Numbers are not allowed." => "شماره ها مجاز نیستند."
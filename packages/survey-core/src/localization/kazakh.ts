import { setupLocale } from "survey-core";

export var kazakhStrings = {
  // "Previous"
  pagePrevText: "Артқа",
  // "Next"
  pageNextText: "Келесі",
  // "Complete"
  completeText: "Дайын",
  // "Preview"
  previewText: "Алдын ала қарау",
  // "Edit"
  editText: "Редакциялау",
  // "Start"
  startSurveyText: "Бастау",
  // [Auto-translated] "Please leave a comment"
  commentText: "Түсініктемені қалдыруыңызды сұраймын",
  // "Other (describe)"
  otherItemText: "Басқа (өтінеміз, жазыңыз)",
  // "None"
  noneItemText: "Жоқ",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Жауап беруден бас тарту",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Білмеймін",
  // "Select All"
  selectAllItemText: "Барлығын таңдау",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Барлығын жоққа шығару",
  // "Page {0} of {1}"
  progressText: "{0} ден {1} бет ",
  // [Auto-translated] "{0} of {1}"
  indexText: "{1} {0}",
  // "{0} of {1}"
  panelDynamicProgressText: "{0} ден {1} жазба",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Панель {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "{0}/{1} сұрақтарға жауап",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Бір де бір сұрақ жоқ.",
  // "Thank you for completing the survey"
  completingSurvey: "Сауалнаманы толтырғаныңыз үшін рахмет!",
  // "You have already completed this survey."
  completingSurveyBefore: "Сіз бұл сауалнаманы өтіп қойдыңыз.",
  // "Loading Survey..."
  loadingSurvey: "Серверден жүктеу...",
  // "Select..."
  placeholder: "Таңдау...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Таңдау...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Таңдау...",
  // "value"
  value: "мәні",
  // "Response required."
  requiredError: "Өтінеміз, сұраққа жауап беріңіз.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Өтінеміз, кем дегенде бір сұраққа жауап беріңіз.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Өтінеміз, әрбір жолдың сұрағаны жауап беріңіз.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Әр жолдың бірегей мәні болуы тиіс.",
  // "The value should be numeric."
  numericError: "Жауап сан түрінде болуы керек.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Мәні {0} кем болмауы тиіс",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Қадам өлшеміне сәйкес келетін мәнді {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Мән {0} артық болмауы тиіс",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Нөмірлерді беруге жол берілмейді.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Өтінеміз, {0} ден көп таңба енгізіңіз.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Өтінеміз, {0} ден аз таңба енгізіңіз.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Өтінеміз, {0} аз және {1} көп таңба енгізіңіз.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Өтінеміз, {0} ден кем емес жол толтырыңыз.",
  // "Please select at least {0} option(s)."
  minSelectError: "Өтінеміз, тым болмаса {0} нұсқа таңдаңыз.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Өтінеміз, {0} нұсқадан көп таңдамаңыз.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' {1} ден кем емес және {2} ден көп емес болу керек",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' {1} ден кем емес болу керек",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' {1} ден көп емес болу керек",
  // "Please enter a valid e-mail address."
  invalidEmail: "Өтінеміз, жарамды электрондық поштаңызды енгізіңіз.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "{0} өрнегі  'true' қайтару керек.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Сұратым қателікті қайтарды'{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Сұратымға жауап бос келді немесе 'path' қасиеті қате көрсетілген ",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Файлдың мөлшері {0} аспау керек.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Файлдарды кері жүктеу мүмкін емес. 'OnUploadFiles' оқиғасына өңдеушіні қосуыңызды сұраймыз.",
  // "Response required: enter another value."
  otherRequiredError: "Өтінеміз, “Басқа” жолына деректі енгізіңіз",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Сіздің файлыңыз жүктеліп жатыр. Бірнеше секунд тосып, қайтадан байқап көріңіз.",
  // "Loading..."
  loadingFile: "Жүктеу...",
  // "Choose file(s)..."
  chooseFile: "Файлдарды таңдаңыз...",
  // "No file selected"
  noFileChosen: "Файл таңдалынбады",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Файлды осы жерге апарып тастаңыз немесе кері жүктеу үшін файлды таңдау үшін төмендегі батырманың астын басыңыз.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Сіз жазбаны жоятыныңызға сенімдісіз бе?",
  // "This value should be unique."
  keyDuplicationError: "Бұл мән бірегей болу керек.",
  // "Add Column"
  addColumn: "Бағана қосу",
  // "Add Row"
  addRow: "Жолды қосу",
  // "Remove"
  removeRow: "Өшіру",
  // [Auto-translated] "There are no rows."
  noRowsText: "Қатарлар жоқ.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Жол {rowIndex}",
  // [Auto-translated] "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Жаңа қосу",
  // "Remove"
  removePanel: "Өшіру",
  // [Auto-translated] "Show Details"
  showDetails: "Егжей-тегжейін көрсету",
  // [Auto-translated] "Hide Details"
  hideDetails: "Егжей- тегжейін жасы",
  // "item"
  choices_Item: "Нұсқа",
  // [Auto-translated] "Choice option"
  choices_Choice: "Таңдау параметрі",
  // "Column"
  matrix_column: "Бағана",
  // "Row"
  matrix_row: "Жол",
  // [Auto-translated] "text"
  multipletext_itemname: "мәтін",
  // "The results are being saved on the server..."
  savingData: "Нәтижелер серверде сақталады...",
  // "An error occurred and we could not save the results."
  savingDataError: "Қателік туындады, нәтиже сақталынбады.",
  // "The results were saved successfully!"
  savingDataSuccess: "Нәтиже ойдағыдай сақталды!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Сіздің жауабыңыз 64КБ-тан асады. Файлдың өлшемін азайтып, қайталап көріңіз немесе сауалнама иесіне хабарласыңыз.",
  // "Try again"
  saveAgainButton: "Қайтадан байқап көру",
  // "min"
  timerMin: "мин",
  // "sec"
  timerSec: "сек",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Сіз бұл бетте {0} кетірдіңіз және барлығы {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Сіз бұл бетте {0} кетірдіңіз.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Сіз сауалнама кезінде {0} кетірдіңіз.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Сіз бұл бетте {0} ден {1} кетірдіңіз және {2} ден {3} бүкіл сауалнама үшін.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Сіз бұл бетте {0} ден {1} кетірдіңіз.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Сіз бүкіл сауалнама үшін {0} ден {1} кетірдіңіз ",
  // "Clear"
  clearCaption: "Тазалау",
  // [Auto-translated] "Select"
  selectCaption: "Таңдау",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Осында кіру",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Қолдың No",
  // "Select File"
  chooseFileCaption: "Файл таңдаңыз",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Фотосуретке түсу",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Камераны пайдаланып суретке түсу үшін төмендегі түймені басыңыз.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Фотоаппаратты пайдаланып кері жүктеу немесе суретке түсіру үшін файлды апарып тастаыңыз немесе таңдаңыз.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Файлды ауыстыру",
  // "Remove this file"
  removeFileCaption: "Файлды жойыңыз",
  // "Yes"
  booleanCheckedLabel: "Иә",
  // "No"
  booleanUncheckedLabel: "Жоқ",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Сіз бұл файлды жоятыныңызға сенімдісіз бе: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Сіз барлық файлдарды жоятыныңызға сенімдісіз бе?",
  // "Question Title"
  questionTitlePatternText: "Сұрақтың атауы",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Болдырмау",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Қолдану",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Іздеу үшін теріңіз...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Көрсетілетін деректер жоқ",
  // [Auto-translated] "Loading..."
  loadingPage: "Жүктеу...",
  // [Auto-translated] "Loading..."
  loadingData: "Жүктеу...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Әзірге жазбалар жоқ.\nЖаңа жазбаны қосу үшін төмендегі түймешігіңді басыңыз.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Жазбалар жоқ",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Жаңа панель",
  // [Auto-translated] "More"
  more: "Қосымша",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "ЖАҚСЫ",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Барлық таңдаулар рейтингке таңдалады",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Таңдаулар санын осында апарыңыз",
  // [Auto-translated] "OK"
  ok: "ЖАҚСЫ",
  // [Auto-translated] "Cancel"
  cancel: "Болдырмау",
  // "Create \"{0}\" item..."
  createCustomItem: "«{0}» элементін жасау...",
  // [Auto-translated] "Table of contents"
  toc: "Мазмұн кестесі",
  // [Auto-translated] "Progress bar"
  progressbar: "Прогресс тақтасы"
};

setupLocale({ localeCode: "kk", strings: kazakhStrings, nativeName: "kazakh", englishName: "Kazakh" });
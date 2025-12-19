import { setupLocale } from "survey-core";

export var macedonianSurveyStrings = {
  // "Previous"
  pagePrevText: "Претходна",
  // "Next"
  pageNextText: "Следно",
  // "Complete"
  completeText: "Заврши",
  // "Preview"
  previewText: "Преглед",
  // "Edit"
  editText: "Уредување",
  // "Start"
  startSurveyText: "Започнете",
  // [Auto-translated] "Please leave a comment"
  commentText: "Молиме оставете коментар",
  // "Other (describe)"
  otherItemText: "Друго (опиши)",
  // "None"
  noneItemText: "Ништо",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Одбиј да одговориш.",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Не знам",
  // "Select All"
  selectAllItemText: "Селектирај се",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Отстранете селекција на сите",
  // "Page {0} of {1}"
  progressText: "Страница {0} од {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} на {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Сними {0} од {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Панел {панел Индекс}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Одговорени на {0} / {1} прашања",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Нема видлива страница или прашање во истражувањето.",
  // "Thank you for completing the survey"
  completingSurvey: "Ви благодариме што го завршивте истражувањето!",
  // "You have already completed this survey."
  completingSurveyBefore: "Нашите записи покажуваат дека веќе сте го завршиле ова истражување.",
  // "Loading Survey..."
  loadingSurvey: "Анкетата се вчитува ...",
  // "Select..."
  placeholder: "Изберете ...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Изберете...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Изберете...",
  // "value"
  value: "вредност",
  // "Response required."
  requiredError: "Ве молам, одговорете на прашањето.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Ве молам, одговорете барем на едно прашање.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Ве молиме, одговорете на прашања во сите редови.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Секој ред мора да има уникатна вредност.",
  // "The value should be numeric."
  numericError: "Вредноста треба да биде нумеричка.",
  // "The value should not be less than {0}"
  minError: "Вредноста не треба да биде помала од {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Молиме внесете вредност која одговара на големината на чекорот на {0}.",
  // "The value should not be greater than {0}"
  maxError: "Вредноста не треба да биде поголема од {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Броевите не се дозволени.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Внесете најмалку {0} знак/ци.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Внесете не повеќе од {0} знак/ци.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Внесете најмалку {0} и не повеќе од {1} знаци.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Пополнете најмалку {0} ред(ови).",
  // "Please select at least {0} option(s)."
  minSelectError: "Ве молиме изберете најмалку {0} варијанта(и).",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Изберете не повеќе од {0} варијанта(и).",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' треба да биде најмалку {1} и најмногу {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' треба да биде најмалку {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' треба да биде најмногу {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Ве молиме внесете валидна е-маил адреса.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Изразот: {0} треба да се врати 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Барањето врати грешка '{0}'. {1} ",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Барањето врати празни податоци или својството 'path' е неточно",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Големината на датотеката не треба да надминува {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Максималниот број на датотеки што можеш да ги прикачиш е {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Фајловите не можат да се качуваат. Ве молиме додадете раководител за настанот 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Внесете ја другата вредност.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Вашата датотека се поставува. Ве молиме почекајте неколку секунди и обидете се повторно.",
  // "Loading..."
  loadingFile: "Се вчитува ...",
  // "Choose file(s)..."
  chooseFile: "Изберете датотека (и) ...",
  // "No file selected"
  noFileChosen: "Не се избрани датотеки",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Пуштете датотека овде или кликнете на копчето подолу за да ја вчитате датотеката.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Дали сакате да го избришете записот?",
  // "This value should be unique."
  keyDuplicationError: "Оваа вредност треба да биде единствена.",
  // "Add Column"
  addColumn: "Додај колона",
  // "Add Row"
  addRow: "Додади ред",
  // "Remove"
  removeRow: "Отстрани",
  // "There are no rows."
  noRowsText: "Нема редови.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Ред {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Додади ново",
  // "Remove"
  removePanel: "Отстрани",
  // [Auto-translated] "Show Details"
  showDetails: "Прикажување на деталите",
  // [Auto-translated] "Hide Details"
  hideDetails: "Сокриј ги деталите.",
  // "item"
  choices_Item: "ставка",
  // [Auto-translated] "Choice option"
  choices_Choice: "Опција за избор",
  // "Column"
  matrix_column: "Колона",
  // "Row"
  matrix_row: "Ред",
  // [Auto-translated] "text"
  multipletext_itemname: "текст.",
  // "The results are being saved on the server..."
  savingData: "Резултатите се зачувуваат на серверот ...",
  // "An error occurred and we could not save the results."
  savingDataError: "Настана грешка и не можевме да ги зачуваме резултатите.",
  // "The results were saved successfully!"
  savingDataSuccess: "Резултатите беа успешно зачувани!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Вашиот одговор надминува 64KB. Молиме намалете ја големината на вашите документи и пробајте повторно или контактирајте го сопственикот на анкетата.",
  // "Try again"
  saveAgainButton: "Обиди се повторно",
  // "min"
  timerMin: "мин",
  // "sec"
  timerSec: "сек",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Поминавте {0} на оваа страница и вкупно {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Поминавте {0} на оваа страница.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Вие потрошивте вкупно {0}.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Поминавте {0} од {1} на оваа страница и {2} од {3} вкупно.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Поминавте {0} од {1} на оваа страница.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Вие потрошивте вкупно {0} од {1}.",
  // "Clear"
  clearCaption: "Да расчисти",
  // [Auto-translated] "Select"
  selectCaption: "Избери",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Потпиши се овде.",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Нема потпис",
  // "Select File"
  chooseFileCaption: "Изберете датотека",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Фотографирајте",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Кликнете на копчето подолу за да фотографирате користејќи ја камерата.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Влечете и фрлајте или изберете датотека за качување или фотографирање користејќи ја камерата.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Заменете го фајлот.",
  // "Remove this file"
  removeFileCaption: "Отстранете ја оваа датотека",
  // "Yes"
  booleanCheckedLabel: "Да",
  // "No"
  booleanUncheckedLabel: "Не",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Дали сте сигурни дека сакате да ја отстраните оваа датотека: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Дали сте сигурни дека сакате да ги отстраните сите датотеки?",
  // "Question Title"
  questionTitlePatternText: "Наслов на прашањето",
  // "Cancel"
  modalCancelButtonText: "Откажи",
  // "Apply"
  modalApplyButtonText: "Аплицирај",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Тип за пребарување...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Нема податоци за прикажување",
  // [Auto-translated] "Loading..."
  loadingPage: "Вчитување...",
  // [Auto-translated] "Loading..."
  loadingData: "Вчитување...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Сè уште нема записи.\nКликнете на копчето подолу за да додадете нов запис.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Нема записи",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Нов панел",
  // [Auto-translated] "More"
  more: "Повеќе",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "ДОБРО",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Сите избори се избрани за рангирање",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Повлечете избори тука за да ги рангирате",
  // [Auto-translated] "OK"
  ok: "ДОБРО",
  // [Auto-translated] "Cancel"
  cancel: "Откажи",
  // "Create \"{0}\" item..."
  createCustomItem: "Креирање на \"{0}\" ставка...",
  // [Auto-translated] "Table of contents"
  toc: "Содржина",
  // [Auto-translated] "Progress bar"
  progressbar: "Лента за напредок"
};

setupLocale({ localeCode: "mk", strings: macedonianSurveyStrings, nativeName: "македонски", englishName: "Macedonian" });
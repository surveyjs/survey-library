import { setupLocale } from "survey-core";

export var bulgarianStrings = {
  // "Previous"
  pagePrevText: "Назад",
  // "Next"
  pageNextText: "Напред",
  // "Complete"
  completeText: "Край",
  // "Preview"
  previewText: "Визуализация",
  // "Edit"
  editText: "редактиране",
  // "Start"
  startSurveyText: "Начало",
  // [Auto-translated] "Please leave a comment"
  commentText: "Моля, оставете коментар",
  // "Other (describe)"
  otherItemText: "Друго (опишете)",
  // "None"
  noneItemText: "Нито един",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Отказва да отговори",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Не знам",
  // "Select All"
  selectAllItemText: "Всички",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Премахване на избора на всички",
  // "Page {0} of {1}"
  progressText: "стр. {0}, общо стр. {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} на {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Запис {0} от {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Панел {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Отговорени на {0} / {1} въпроса",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Анкетата не съдържа видими страници или въпроси.",
  // "Thank you for completing the survey"
  completingSurvey: "Благодарим ви за участието в анкетата!",
  // "You have already completed this survey."
  completingSurveyBefore: "Изглежда, че вие вече сте попълнили анкетата.",
  // "Loading Survey..."
  loadingSurvey: "Зареждане на анкетата...",
  // "Select..."
  placeholder: "Изберете...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Отбран...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Отбран...",
  // "value"
  value: "value",
  // "Response required."
  requiredError: "Моля, отговорете на следния въпрос.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Моля, отговорете поне на един от въпросите.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Моля, отговорете на въпросите на всички редове.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Всеки ред трябва да има уникална стойност.",
  // "The value should be numeric."
  numericError: "Стойността следва да бъде число.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Стойността не трябва да бъде по-малка от {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Моля, въведете стойност, която съответства на размера на стъпката на {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Стойността не трябва да бъде по-голяма от {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Номерата не са позволени.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Моля, използвайте поне {0} символа.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Моля, използвайте не повече от {0} символа.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Моля, използвайте повече от {0} и по-малко от {1} символа.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Моля, попълнете поне {0} реда.",
  // "Please select at least {0} option(s)."
  minSelectError: "Моля, изберете поне {0} варианта.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Моля, изберете не повече от {0} варианта.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "Стойността '{0}' следва да бъде равна или по-голяма от {1} и равна или по-малка от {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "Стойността '{0}' следва да бъде равна или по-голяма от {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "Стойността '{0}' следва да бъде равна или по-малка от {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Моля, въведете валиден адрес на електронна поща.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Изразът: {0} трябва да дава резултат 'true' (истина).",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Заявката води до грешка '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Заявката не връща данни или частта 'path' (път до търсения ресурс на сървъра) е неправилно зададена",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Размерът на файла следва да не превишава {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Максималният брой файлове, които можете да качите, е {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Файловете не могат да бъдат качени. Моля, добавете манипулатор за събитието \"onUploadFiles\".",
  // "Response required: enter another value."
  otherRequiredError: "Моля, въведете другата стойност.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Вашит файл се зарежда на сървъра. Моля, изчакайте няколко секунди и тогава опитвайте отново.",
  // "Loading..."
  loadingFile: "Зареждане...",
  // "Choose file(s)..."
  chooseFile: "Изберете файл(ове)...",
  // "No file selected"
  noFileChosen: "Няма избран файл",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Плъзнете и пуснете файл тук или щракнете върху бутона по-долу, за да изберете файл за качване.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Желаете ли да изтриете записа?",
  // "This value should be unique."
  keyDuplicationError: "Стойността следва да бъде уникална.",
  // "Add Column"
  addColumn: "Добавяне на колона",
  // "Add Row"
  addRow: "Добавяне на ред",
  // "Remove"
  removeRow: "Премахване на ред",
  // [Auto-translated] "There are no rows."
  noRowsText: "Няма редове.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Ред {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Добавяне на панел",
  // "Remove"
  removePanel: "Премахване на панел",
  // [Auto-translated] "Show Details"
  showDetails: "Показване на подробни данни",
  // [Auto-translated] "Hide Details"
  hideDetails: "Скрий подробните данни",
  // "item"
  choices_Item: "елемент",
  // [Auto-translated] "Choice option"
  choices_Choice: "Опция за избор",
  // "Column"
  matrix_column: "Колона",
  // "Row"
  matrix_row: "Ред",
  // [Auto-translated] "text"
  multipletext_itemname: "Текст",
  // "The results are being saved on the server..."
  savingData: "Резултатите се запазват на сървъра...",
  // "An error occurred and we could not save the results."
  savingDataError: "Поради възникнала грешка резултатите не можаха да бъдат запазени.",
  // "The results were saved successfully!"
  savingDataSuccess: "Резултатите бяха запазени успешно!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Вашият отговор надхвърля 64KB. Моля, намалете размера на вашите файлове и опитайте отново или се свържете със собственика на проучването.",
  // "Try again"
  saveAgainButton: "Нов опит",
  // "min"
  timerMin: "мин",
  // "sec"
  timerSec: "сек",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Вие използвахте {0} на тази страница и общо {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Вие използвахте {0} на тази страница.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Вие използвахте общо {0}.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Вие изпозвахте {0} от {1} на тази страница и общо {2} от {3}.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Вие използвахте {0} от {1} на тази страница.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Вие използвахте общо {0} от {1}.",
  // "Clear"
  clearCaption: "Начално състояние",
  // [Auto-translated] "Select"
  selectCaption: "Отбран",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Подпишете тук",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Няма подпис",
  // "Select File"
  chooseFileCaption: "Изберете файл",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Направете снимка",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Кликнете върху бутона по-долу, за да направите снимка с помощта на камерата.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Плъзнете и пуснете или изберете файл за качване или правене на снимка с помощта на камерата.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Заместване на файл",
  // "Remove this file"
  removeFileCaption: "Премахване на файла",
  // "Yes"
  booleanCheckedLabel: "Да",
  // "No"
  booleanUncheckedLabel: "Не",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Наистина ли искате да премахнете този файл: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Наистина ли искате да премахнете всички файлове?",
  // "Question Title"
  questionTitlePatternText: "Заглавие на въпроса",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Отмени",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Прилагам",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Въведете за търсене...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Няма данни за показване",
  // [Auto-translated] "Loading..."
  loadingPage: "Зареждане...",
  // [Auto-translated] "Loading..."
  loadingData: "Зареждане...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Все още няма записи.\nЩракнете върху бутона по-долу, за да добавите нов запис.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Няма записи",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Нов панел",
  // [Auto-translated] "More"
  more: "Още",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "Добре",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Всички избори се избират за класиране",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Плъзнете изборите тук, за да ги класирате",
  // [Auto-translated] "OK"
  ok: "Добре",
  // [Auto-translated] "Cancel"
  cancel: "Отмени",
  // "Create \"{0}\" item..."
  createCustomItem: "Създайте елемент \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Съдържание",
  // [Auto-translated] "Progress bar"
  progressbar: "Лента за напредъка"
};

setupLocale({ localeCode: "bg", strings: bulgarianStrings, nativeName: "български", englishName: "Bulgarian" });
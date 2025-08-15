import { setupLocale } from "survey-core";

export var ukrainianSurveyStrings = {
  // "Previous"
  pagePrevText: "Назад",
  // "Next"
  pageNextText: "Далі",
  // "Complete"
  completeText: "Завершити",
  // "Preview"
  previewText: "Попередній перегляд",
  // "Edit"
  editText: "Редагувати",
  // "Start"
  startSurveyText: "Почати",
  // [Auto-translated] "Please leave a comment"
  commentText: "Будь ласка, залиште коментар",
  // "Other (describe)"
  otherItemText: "Інше (будь ласка, опишіть)",
  // "None"
  noneItemText: "Жоден",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Відмовтеся відповідати",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Не знаю",
  // "Select All"
  selectAllItemText: "Вибрати все",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Зніміть позначку з усіх",
  // "Page {0} of {1}"
  progressText: "Сторінка {0} з {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Запис {0} із {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Панель {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Відповіли на {0}/{1} питань",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Немає жодного питання.",
  // "Thank you for completing the survey"
  completingSurvey: "Дякуємо Вам за заповнення анкети!",
  // "You have already completed this survey."
  completingSurveyBefore: "Ви вже проходили це опитування.",
  // "Loading Survey..."
  loadingSurvey: "Завантаження опитування...",
  // "Select..."
  placeholder: "Вибрати...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Виберіть...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Виберіть...",
  // "value"
  value: "значення",
  // "Response required."
  requiredError: "Будь ласка, дайте відповідь.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Будь ласка, дайте відповідь хоча б на одне питання.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Будь ласка, дайте відповідь на питання в кожному рядку.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Кожен рядок повинен мати унікальне значення.",
  // "The value should be numeric."
  numericError: "Відповідь повинна бути числом.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Значення не повинно бути менше {0}",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Значення не повинно бути більше {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Номери не допускаються.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Будь ласка введіть більше {0} символів.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Будь ласка введіть менше {0} символів.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Будь ласка введіть більше {0} и менше {1} символів.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Будь ласка, заповніть не менше {0} рядків.",
  // "Please select at least {0} option(s)."
  minSelectError: "Будь ласка, виберіть хоча б {0} варіантів.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Будь ласка, виберіть не більше {0} варіантів.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' повинно бути не менше ніж {1}, і не більше ніж {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' повинно бути не менше ніж {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' повинно бути не більше ніж {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Будь ласка, введіть дійсну адресу електронної пошти.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Вираз {0} повинен повертати 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Запит повернув помилку '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Відповідь на запит повернулась порожньою або властивіть 'path' вказано невірно",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Розмір файлу не повинен перевищувати {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Файли не можна завантажити. Будь ласка, додайте обробник для події 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Будь ласка, введіть дані в поле 'Інше'",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Ваш файл завантажується. Зачекайте декілька секунд і спробуйте знову.",
  // "Loading..."
  loadingFile: "Завантаження...",
  // "Choose file(s)..."
  chooseFile: "Виберіть файл(и)...",
  // "No file selected"
  noFileChosen: "Файл не вибрано",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Перетягніть файл сюди або натисніть кнопку нижче, щоб вибрати файл для завантаження.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Ви хочете видалити запис?",
  // "This value should be unique."
  keyDuplicationError: "Це значення повинно бути унікальним.",
  // "Add Column"
  addColumn: "Додати колонку",
  // "Add Row"
  addRow: "Додати рядок",
  // "Remove"
  removeRow: "Видалити",
  // [Auto-translated] "There are no rows."
  noRowsText: "Рядів немає.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Рядок {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Додати нову",
  // "Remove"
  removePanel: "Видалити",
  // [Auto-translated] "Show Details"
  showDetails: "Показати подробиці",
  // [Auto-translated] "Hide Details"
  hideDetails: "Сховати подробиці",
  // "item"
  choices_Item: "Варіант",
  // [Auto-translated] "Choice option"
  choices_Choice: "Варіант вибору",
  // "Column"
  matrix_column: "Колонка",
  // "Row"
  matrix_row: "Рядок",
  // [Auto-translated] "text"
  multipletext_itemname: "Текст",
  // "The results are being saved on the server..."
  savingData: "Результати зберігаються на сервер...",
  // "An error occurred and we could not save the results."
  savingDataError: "Відбулася помилка, результат не був збережений.",
  // "The results were saved successfully!"
  savingDataSuccess: "Резвультат успішно збережений!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Ваша відповідь перевищує 64 КБ. Будь ласка, зменшіть розмір вашого файлу (файлів) і спробуйте ще раз або зверніться до власника опитування.",
  // "Try again"
  saveAgainButton: "Спробувати знову",
  // "min"
  timerMin: "хв",
  // "sec"
  timerSec: "сек",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Ви витратили {0} на цій сторінці і {1} загалом.",
  // "You have spent {0} on this page."
  timerSpentPage: "Ви витратили {0} на цій сторінці.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Ви витратили {0} протягом тесту.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Ви витратили {0} з {1} на цій сторінці і {2} з {3} для всього тесту.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Ви витратили {0} з {1} на цій сторінці.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Ви витратили {0} з {1} для всього тесту.",
  // "Clear"
  clearCaption: "Очистити",
  // [Auto-translated] "Select"
  selectCaption: "Виберіть",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Підпишіться тут",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Без підпису",
  // "Select File"
  chooseFileCaption: "Виберіть файл",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Зробити фото",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Натисніть кнопку нижче, щоб зробити фото за допомогою камери.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Перетягніть або виберіть файл, щоб завантажити або зробити фотографію за допомогою камери.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Замінити файл",
  // "Remove this file"
  removeFileCaption: "Видалити файл",
  // "Yes"
  booleanCheckedLabel: "Так",
  // "No"
  booleanUncheckedLabel: "Ні",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Ви впевнені, що хочете видалити цей файл: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Ви впевнені, що хочете видалити всі файли?",
  // "Question Title"
  questionTitlePatternText: "Назва запитання",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Скасувати",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Застосовувати",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Введіть для пошуку...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Немає даних для відображення",
  // [Auto-translated] "Loading..."
  loadingPage: "Завантаження...",
  // [Auto-translated] "Loading..."
  loadingData: "Завантаження...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Записів поки що немає.\nНатисніть кнопку нижче, щоб додати новий запис.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Записів немає",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Нова панель",
  // [Auto-translated] "More"
  more: "Більше",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "ГАРАЗД",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Всі варіанти вибираються для ранжування",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Перетягніть варіанти сюди, щоб ранжувати їх",
  // [Auto-translated] "OK"
  ok: "ГАРАЗД",
  // [Auto-translated] "Cancel"
  cancel: "Скасувати",
  // "Create \"{0}\" item..."
  createCustomItem: "Створіть пункт \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Зміст",
  // [Auto-translated] "Progress bar"
  progressbar: "Індикатор прогресу"
};

setupLocale({ localeCode: "uk", strings: ukrainianSurveyStrings, nativeName: "українська", englishName: "Ukrainian" });
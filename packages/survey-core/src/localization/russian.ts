import { setupLocale } from "survey-core";

export var russianSurveyStrings = {
  // "Previous"
  pagePrevText: "Назад",
  // "Next"
  pageNextText: "Далее",
  // "Complete"
  completeText: "Готово",
  // "Preview"
  previewText: "Предварительный просмотр",
  // "Edit"
  editText: "Редактирование",
  // "Start"
  startSurveyText: "Начать",
  // [Auto-translated] "Please leave a comment"
  commentText: "Пожалуйста, оставьте комментарий",
  // "Other (describe)"
  otherItemText: "Другое (пожалуйста, опишите)",
  // "None"
  noneItemText: "Нет",
  // "Refuse to answer"
  refuseItemText: "Отказываюсь отвечать",
  // "Don't know"
  dontKnowItemText: "Не знаю",
  // "Select All"
  selectAllItemText: "Выбрать всё",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Отмена выбора всех",
  // "Page {0} of {1}"
  progressText: "Страница {0} из {1}",
  // "{0} of {1}"
  indexText: "{0} из {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Запись {0} из {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Панель {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Oтвечено на {0}/{1} вопросов",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Нет ни одного вопроса.",
  // "Thank you for completing the survey"
  completingSurvey: "Благодарим Вас за заполнение анкеты!",
  // "You have already completed this survey."
  completingSurveyBefore: "Вы уже проходили этот опрос.",
  // "Loading Survey..."
  loadingSurvey: "Загрузка с сервера...",
  // "Select..."
  placeholder: "Выбрать...",
  // "Select..."
  ratingOptionsCaption: "Нажмите здесь, чтобы оценить...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Выбирать...",
  // "value"
  value: "значение",
  // "Response required."
  requiredError: "Пожалуйста, ответьте на вопрос.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Пожалуйста, ответьте по крайней мере на один вопрос.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Пожалуйста, ответьте на вопросы в каждой строке.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Каждая строка должна иметь уникальное значение.",
  // "The value should be numeric."
  numericError: "Ответ должен быть числом.",
  // "The value should not be less than {0}"
  minError: "Значение не должно быть меньше {0}.",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Пожалуйста, введите значение, которое соответствует размеру шага {0}.",
  // "The value should not be greater than {0}"
  maxError: "Значение не должно превышать {0}.",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Номера не допускаются.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Пожалуйста введите больше {0} символов.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Пожалуйста введите меньше {0} символов.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Пожалуйста введите больше {0} и меньше {1} символов.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Пожалуйста, заполните не меньше {0} строк.",
  // "Please select at least {0} option(s)."
  minSelectError: "Пожалуйста, выберите хотя бы {0} вариантов.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Пожалуйста, выберите не более {0} вариантов.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' должно быть не меньше чем {1}, и не больше чем {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' должно быть не меньше чем {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' должно быть не больше чем {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Пожалуйста, введите действительный адрес электронной почты.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Выражение {0} должно возвращать 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Запрос вернул ошибку '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Ответ на запрос пришел пустой или свойство 'path' указано неверно",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Размер файла не должен превышать {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Максимальное количество файлов, которые вы можете загрузить, — {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Файлы не могут быть загружены. Пожалуйста, добавьте обработчик для события 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Пожалуйста, введите данные в поле 'Другое'",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Ваш файл загружается. Подождите несколько секунд и попробуйте снова.",
  // "Loading..."
  loadingFile: "Загрузка...",
  // "Choose file(s)..."
  chooseFile: "Выберите файл(ы)...",
  // "No file selected"
  noFileChosen: "Файл не выбран",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Перетащите файл сюда или нажмите кнопку ниже, чтобы загрузить файл.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Вы точно хотите удалить запись?",
  // "This value should be unique."
  keyDuplicationError: "Это значение должно быть уникальным.",
  // "Add Column"
  addColumn: "Добавить колонку",
  // "Add Row"
  addRow: "Добавить строку",
  // "Remove"
  removeRow: "Удалить",
  // "There are no rows."
  noRowsText: "Рядов нет.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Строка {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Добавить новую",
  // "Remove"
  removePanel: "Удалить",
  // [Auto-translated] "Show Details"
  showDetails: "Показать подробности",
  // [Auto-translated] "Hide Details"
  hideDetails: "Скрыть подробности",
  // "item"
  choices_Item: "Вариант",
  // [Auto-translated] "Choice option"
  choices_Choice: "Вариант выбора",
  // "Column"
  matrix_column: "Колонка",
  // "Row"
  matrix_row: "Строка",
  // "text"
  multipletext_itemname: "текст",
  // "The results are being saved on the server..."
  savingData: "Результаты сохраняются на сервер...",
  // "An error occurred and we could not save the results."
  savingDataError: "Произошла ошибка, результат не был сохранён.",
  // "The results were saved successfully!"
  savingDataSuccess: "Результат успешно сохранён!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Ваш ответ превышает 64 КБ. Уменьшите размер файла (файлов) и повторите попытку или обратитесь к владельцу опроса.",
  // "Try again"
  saveAgainButton: "Попробовать снова",
  // "min"
  timerMin: "мин",
  // "sec"
  timerSec: "сек",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Вы потратили {0} на этой странице и {1} всего.",
  // "You have spent {0} on this page."
  timerSpentPage: "Вы потратили {0} на этой странице.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Вы потратили {0} в течение теста.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Вы потратили {0} из {1} на этой странице и {2} из {3} для всего теста.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Вы потратили {0} из {1} на этой странице.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Вы потратили {0} из {1} для всего теста.",
  // "Clear"
  clearCaption: "Очистить",
  // [Auto-translated] "Select"
  selectCaption: "Выбирать",
  // "Sign here"
  signaturePlaceHolder: "Подпишите здесь",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Без подписи",
  // "Select File"
  chooseFileCaption: "Выберите файл",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Сделать фото",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Нажмите кнопку ниже, чтобы сделать снимок с помощью камеры.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Перетащите или выберите файл для загрузки или съемки с помощью камеры.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Заменить файл",
  // "Remove this file"
  removeFileCaption: "Удалить файл",
  // "Yes"
  booleanCheckedLabel: "Да",
  // "No"
  booleanUncheckedLabel: "Нет",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Вы уверены, что хотите удалить этот файл: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Вы уверены, что хотите удалить все файлы?",
  // "Question Title"
  questionTitlePatternText: "Название вопроса",
  // "Cancel"
  modalCancelButtonText: "Отменить",
  // "Apply"
  modalApplyButtonText: "Применять",
  // "Type to search..."
  filterStringPlaceholder: "Введите для поиска...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Нет данных для отображения",
  // [Auto-translated] "Loading..."
  loadingPage: "Загрузка...",
  // [Auto-translated] "Loading..."
  loadingData: "Загрузка...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Пока нет записей.\nНажмите кнопку ниже, чтобы добавить новую запись.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Нет записей",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Новая панель",
  // [Auto-translated] "More"
  more: "Больше",
  // "OK"
  tagboxDoneButtonCaption: "Хорошо",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Все варианты отбираются для ранжирования",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Перетащите варианты сюда для их ранжирования",
  // "OK"
  ok: "Хорошо",
  // [Auto-translated] "Cancel"
  cancel: "Отмена",
  // "Create \"{0}\" item..."
  createCustomItem: "Создать элемент \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Содержание",
  // [Auto-translated] "Progress bar"
  progressbar: "Индикатор выполнения"
};

setupLocale({ localeCode: "ru", strings: russianSurveyStrings, nativeName: "русский", englishName: "Russian" });
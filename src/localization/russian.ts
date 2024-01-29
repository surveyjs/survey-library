import { surveyLocalization } from "survey-core";

export var russianSurveyStrings = {
  pagePrevText: "Назад",
  pageNextText: "Далее",
  completeText: "Готово",
  previewText: "Предварительный просмотр",
  editText: "Редактирование",
  startSurveyText: "Начать",
  otherItemText: "Другое (пожалуйста, опишите)",
  noneItemText: "Нет",
  refuseItemText: "Откажитесь отвечать",
  dontKnowItemText: "Не знаю",
  selectAllItemText: "Выбрать всё",
  progressText: "Страница {0} из {1}",
  indexText: "{0} из {1}",
  panelDynamicProgressText: "Запись {0} из {1}",
  panelDynamicTabTextFormat: "Панель {panelIndex}",
  questionsProgressText: "Oтвечено на {0}/{1} вопросов",
  emptySurvey: "Нет ни одного вопроса.",
  completingSurvey: "Благодарим Вас за заполнение анкеты!",
  completingSurveyBefore: "Вы уже проходили этот опрос.",
  loadingSurvey: "Загрузка с сервера...",
  placeholder: "Выбрать...",
  ratingOptionsCaption: "Нажмите здесь, чтобы оценить...",
  value: "значение",
  requiredError: "Пожалуйста, ответьте на вопрос.",
  requiredErrorInPanel: "Пожалуйста, ответьте по крайней мере на один вопрос.",
  requiredInAllRowsError: "Пожалуйста, ответьте на вопросы в каждой строке.",
  eachRowUniqueError: "Каждая строка должна иметь уникальное значение.",
  numericError: "Ответ должен быть числом.",
  minError: "Значение не должно быть меньше {0}.",
  maxError: "Значение не должно превышать {0}.",
  textMinLength: "Пожалуйста введите больше {0} символов.",
  textMaxLength: "Пожалуйста введите меньше {0} символов.",
  textMinMaxLength: "Пожалуйста введите больше {0} и меньше {1} символов.",
  minRowCountError: "Пожалуйста, заполните не меньше {0} строк.",
  minSelectError: "Пожалуйста, выберите хотя бы {0} вариантов.",
  maxSelectError: "Пожалуйста, выберите не более {0} вариантов.",
  numericMinMax: "'{0}' должно быть не меньше чем {1}, и не больше чем {2}",
  numericMin: "'{0}' должно быть не меньше чем {1}",
  numericMax: "'{0}' должно быть не больше чем {1}",
  invalidEmail: "Пожалуйста, введите действительный адрес электронной почты.",
  invalidExpression: "Выражение {0} должно возвращать 'true'.",
  urlRequestError: "Запрос вернул ошибку '{0}'. {1}",
  urlGetChoicesError: "Ответ на запрос пришел пустой или свойство 'path' указано неверно",
  exceedMaxSize: "Размер файла не должен превышать {0}.",
  noUploadFilesHandler: "Файлы не могут быть загружены. Пожалуйста, добавьте обработчик для события 'onUploadFiles'.",
  otherRequiredError: "Пожалуйста, введите данные в поле 'Другое'",
  uploadingFile: "Ваш файл загружается. Подождите несколько секунд и попробуйте снова.",
  loadingFile: "Загрузка...",
  chooseFile: "Выберите файл(ы)...",
  noFileChosen: "Файл не выбран",
  filePlaceholder: "Перетащите файл сюда или нажмите кнопку ниже, чтобы загрузить файл.",
  confirmDelete: "Вы точно хотите удалить запись?",
  keyDuplicationError: "Это значение должно быть уникальным.",
  addColumn: "Добавить колонку",
  addRow: "Добавить строку",
  removeRow: "Удалить",
  emptyRowsText: "Рядов нет.",
  addPanel: "Добавить новую",
  removePanel: "Удалить",
  showDetails: "Показать подробности",
  hideDetails: "Скрыть подробности",
  choices_Item: "Вариант",
  matrix_column: "Колонка",
  matrix_row: "Строка",
  multipletext_itemname: "текст",
  savingData: "Результаты сохраняются на сервер...",
  savingDataError: "Произошла ошибка, результат не был сохранён.",
  savingDataSuccess: "Результат успешно сохранён!",
  saveAgainButton: "Попробовать снова",
  timerMin: "мин",
  timerSec: "сек",
  timerSpentAll: "Вы потратили {0} на этой странице и {1} всего.",
  timerSpentPage: "Вы потратили {0} на этой странице.",
  timerSpentSurvey: "Вы потратили {0} в течение теста.",
  timerLimitAll: "Вы потратили {0} из {1} на этой странице и {2} из {3} для всего теста.",
  timerLimitPage: "Вы потратили {0} из {1} на этой странице.",
  timerLimitSurvey: "Вы потратили {0} из {1} для всего теста.",
  clearCaption: "Очистить",
  signaturePlaceHolder: "Подпишите здесь",
  chooseFileCaption: "Выберите файл",
  takePhotoCaption: "Сделать фото",
  photoPlaceholder: "Нажмите кнопку ниже, чтобы сделать снимок с помощью камеры.",
  fileOrPhotoPlaceholder: "Перетащите или выберите файл для загрузки или съемки с помощью камеры.",
  replaceFileCaption: "Заменить файл",
  removeFileCaption: "Удалить файл",
  booleanCheckedLabel: "Да",
  booleanUncheckedLabel: "Нет",
  confirmRemoveFile: "Вы уверены, что хотите удалить этот файл: {0}?",
  confirmRemoveAllFiles: "Вы уверены, что хотите удалить все файлы?",
  questionTitlePatternText: "Название вопроса",
  modalCancelButtonText: "Отменить",
  modalApplyButtonText: "Применять",
  filterStringPlaceholder: "Введите для поиска...",
  emptyMessage: "Нет данных для отображения",
  noEntriesText: "Пока нет записей.\nНажмите кнопку ниже, чтобы добавить новую запись.",
  noEntriesReadonlyText: "Записей нет.",
  more: "Больше",
  tagboxDoneButtonCaption: "ХОРОШО",
  selectToRankEmptyRankedAreaText: "Все варианты ранжируются",
  selectToRankEmptyUnrankedAreaText: "Перетащите сюда варианты, чтобы ранжировать их",
  ok: "ХОРОШО",
  cancel: "Отмена"
};

surveyLocalization.locales["ru"] = russianSurveyStrings;
surveyLocalization.localeNames["ru"] = "русский";

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Панель {panelIndex}"
// emptyMessage: "No data to display" => "Нет данных для отображения"
// noEntriesReadonlyText: "There are no entries." => "Записей нет."
// more: "More" => "Больше"
// tagboxDoneButtonCaption: "OK" => "ХОРОШО"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Все варианты ранжируются"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Перетащите сюда варианты, чтобы ранжировать их"// takePhotoCaption: "Take Photo" => "Сделать фото"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Нажмите кнопку ниже, чтобы сделать снимок с помощью камеры."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Перетащите или выберите файл для загрузки или съемки с помощью камеры."
// replaceFileCaption: "Replace file" => "Заменить файл"// eachRowUniqueError: "Each row must have a unique value." => "Каждая строка должна иметь уникальное значение."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Файлы не могут быть загружены. Пожалуйста, добавьте обработчик для события 'onUploadFiles'."
// showDetails: "Show Details" => "Показать подробности"
// hideDetails: "Hide Details" => "Скрыть подробности"
// ok: "OK" => "ХОРОШО"
// cancel: "Cancel" => "Отмена"
// refuseItemText: "Refuse to answer" => "Откажитесь отвечать"
// dontKnowItemText: "Don't know" => "Не знаю"
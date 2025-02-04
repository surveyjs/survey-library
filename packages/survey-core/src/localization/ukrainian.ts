import { setupLocale } from "survey-core";

export var ukrainianSurveyStrings = {
  pagePrevText: "Назад",
  pageNextText: "Далі",
  completeText: "Завершити",
  previewText: "Попередній перегляд",
  editText: "Редагувати",
  startSurveyText: "Почати",
  otherItemText: "Інше (будь ласка, опишіть)",
  noneItemText: "Жоден",
  refuseItemText: "Відмовтеся відповідати",
  dontKnowItemText: "Не знаю",
  selectAllItemText: "Вибрати все",
  deselectAllItemText: "Зніміть позначку з усіх",
  progressText: "Сторінка {0} з {1}",
  indexText: "{0} {1}",
  panelDynamicProgressText: "Запис {0} із {1}",
  panelDynamicTabTextFormat: "Панель {panelIndex}",
  questionsProgressText: "Відповіли на {0}/{1} питань",
  emptySurvey: "Немає жодного питання.",
  completingSurvey: "Дякуємо Вам за заповнення анкети!",
  completingSurveyBefore: "Ви вже проходили це опитування.",
  loadingSurvey: "Завантаження опитування...",
  placeholder: "Вибрати...",
  ratingOptionsCaption: "Виберіть...",
  value: "значення",
  requiredError: "Будь ласка, дайте відповідь.",
  requiredErrorInPanel: "Будь ласка, дайте відповідь хоча б на одне питання.",
  requiredInAllRowsError: "Будь ласка, дайте відповідь на питання в кожному рядку.",
  eachRowUniqueError: "Кожен рядок повинен мати унікальне значення.",
  numericError: "Відповідь повинна бути числом.",
  minError: "Значення не повинно бути менше {0}",
  maxError: "Значення не повинно бути більше {0}",
  textNoDigitsAllow: "Номери не допускаються.",
  textMinLength: "Будь ласка введіть більше {0} символів.",
  textMaxLength: "Будь ласка введіть менше {0} символів.",
  textMinMaxLength: "Будь ласка введіть більше {0} и менше {1} символів.",
  minRowCountError: "Будь ласка, заповніть не менше {0} рядків.",
  minSelectError: "Будь ласка, виберіть хоча б {0} варіантів.",
  maxSelectError: "Будь ласка, виберіть не більше {0} варіантів.",
  numericMinMax: "'{0}' повинно бути не менше ніж {1}, і не більше ніж {2}",
  numericMin: "'{0}' повинно бути не менше ніж {1}",
  numericMax: "'{0}' повинно бути не більше ніж {1}",
  invalidEmail: "Будь ласка, введіть дійсну адресу електронної пошти.",
  invalidExpression: "Вираз {0} повинен повертати 'true'.",
  urlRequestError: "Запит повернув помилку '{0}'. {1}",
  urlGetChoicesError: "Відповідь на запит повернулась порожньою або властивіть 'path' вказано невірно",
  exceedMaxSize: "Розмір файлу не повинен перевищувати {0}.",
  noUploadFilesHandler: "Файли не можна завантажити. Будь ласка, додайте обробник для події 'onUploadFiles'.",
  otherRequiredError: "Будь ласка, введіть дані в поле 'Інше'",
  uploadingFile: "Ваш файл завантажується. Зачекайте декілька секунд і спробуйте знову.",
  loadingFile: "Завантаження...",
  chooseFile: "Виберіть файл(и)...",
  noFileChosen: "Файл не вибрано",
  filePlaceholder: "Перетягніть файл сюди або натисніть кнопку нижче та виберіть файл для завантаження.",
  confirmDelete: "Ви хочете видалити запис?",
  keyDuplicationError: "Це значення повинно бути унікальним.",
  addColumn: "Додати колонку",
  addRow: "Додати рядок",
  removeRow: "Видалити",
  noRowsText: "Рядів немає.",
  addPanel: "Додати нову",
  removePanel: "Видалити",
  showDetails: "Показати подробиці",
  hideDetails: "Сховати подробиці",
  choices_Item: "Варіант",
  matrix_column: "Колонка",
  matrix_row: "Рядок",
  multipletext_itemname: "Текст",
  savingData: "Результати зберігаються на сервер...",
  savingDataError: "Відбулася помилка, результат не був збережений.",
  savingDataSuccess: "Резвультат успішно збережений!",
  savingExceedSize: "Ваша відповідь перевищує 64 КБ. Будь ласка, зменшіть розмір файлу (файлів) і повторіть спробу або зв'яжіться з власником опитування.",
  saveAgainButton: "Спробувати знову",
  timerMin: "хв",
  timerSec: "сек",
  timerSpentAll: "Ви витратили {0} на цій сторінці і {1} загалом.",
  timerSpentPage: "Ви витратили {0} на цій сторінці.",
  timerSpentSurvey: "Ви витратили {0} протягом тесту.",
  timerLimitAll: "Ви витратили {0} з {1} на цій сторінці і {2} з {3} для всього тесту.",
  timerLimitPage: "Ви витратили {0} з {1} на цій сторінці.",
  timerLimitSurvey: "Ви витратили {0} з {1} для всього тесту.",
  clearCaption: "Очистити",
  signaturePlaceHolder: "Підпишіться тут",
  signaturePlaceHolderReadOnly: "Без підпису",
  chooseFileCaption: "Виберіть файл",
  takePhotoCaption: "Зробити фото",
  photoPlaceholder: "Натисніть кнопку нижче, щоб зробити фото за допомогою камери.",
  fileOrPhotoPlaceholder: "Перетягніть або виберіть файл, щоб завантажити або зробити фотографію за допомогою камери.",
  replaceFileCaption: "Замінити файл",
  removeFileCaption: "Видалити файл",
  booleanCheckedLabel: "Так",
  booleanUncheckedLabel: "Ні",
  confirmRemoveFile: "Ви впевнені, що хочете видалити цей файл: {0}?",
  confirmRemoveAllFiles: "Ви впевнені, що хочете видалити всі файли?",
  questionTitlePatternText: "Назва запитання",
  modalCancelButtonText: "Скасувати",
  modalApplyButtonText: "Застосовувати",
  filterStringPlaceholder: "Введіть для пошуку...",
  emptyMessage: "Немає даних для відображення",
  noEntriesText: "Записів поки немає.\nНатисніть кнопку нижче, щоб додати новий запис.",
  noEntriesReadonlyText: "Записів немає.",
  tabTitlePlaceholder: "Нова панель",
  more: "Більше",
  tagboxDoneButtonCaption: "ГАРАЗД",
  selectToRankEmptyRankedAreaText: "Всі варіанти ранжуються",
  selectToRankEmptyUnrankedAreaText: "Перетягніть варіанти тут, щоб оцінити їх",
  ok: "ГАРАЗД",
  cancel: "Скасувати"
};

setupLocale({ localeCode: "ua", strings: ukrainianSurveyStrings, nativeName: "українська", englishName: "Ukrainian" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Панель {panelIndex}"
// ratingOptionsCaption: "Select..." => "Виберіть..."
// minError: "The value should not be less than {0}" => "Значення не повинно бути менше {0}"
// maxError: "The value should not be greater than {0}" => "Значення не повинно бути більше {0}"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Перетягніть файл сюди або натисніть кнопку нижче та виберіть файл для завантаження."
// noRowsText: "There are no rows." => "Рядів немає."
// multipletext_itemname: "text" => "Текст"
// signaturePlaceHolder: "Sign here" => "Підпишіться тут"
// modalCancelButtonText: "Cancel" => "Скасувати"
// modalApplyButtonText: "Apply" => "Застосовувати"
// filterStringPlaceholder: "Type to search..." => "Введіть для пошуку..."
// emptyMessage: "No data to display" => "Немає даних для відображення"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Записів поки немає.\nНатисніть кнопку нижче, щоб додати новий запис."
// noEntriesReadonlyText: "There are no entries." => "Записів немає."
// more: "More" => "Більше"
// tagboxDoneButtonCaption: "OK" => "ГАРАЗД"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Всі варіанти ранжуються"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Перетягніть варіанти тут, щоб оцінити їх"// takePhotoCaption: "Take Photo" => "Зробити фото"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Натисніть кнопку нижче, щоб зробити фото за допомогою камери."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Перетягніть або виберіть файл, щоб завантажити або зробити фотографію за допомогою камери."
// replaceFileCaption: "Replace file" => "Замінити файл"// eachRowUniqueError: "Each row must have a unique value." => "Кожен рядок повинен мати унікальне значення."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Файли не можна завантажити. Будь ласка, додайте обробник для події 'onUploadFiles'."
// showDetails: "Show Details" => "Показати подробиці"
// hideDetails: "Hide Details" => "Сховати подробиці"
// ok: "OK" => "ГАРАЗД"
// cancel: "Cancel" => "Скасувати"// refuseItemText: "Refuse to answer" => "Відмовтеся відповідати"
// dontKnowItemText: "Don't know" => "Не знаю"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Ваша відповідь перевищує 64 КБ. Будь ласка, зменшіть розмір файлу (файлів) і повторіть спробу або зв'яжіться з власником опитування."
// signaturePlaceHolderReadOnly: "No signature" => "Без підпису"// tabTitlePlaceholder: "New Panel" => "Нова панель"// deselectAllItemText: "Deselect all" => "Зніміть позначку з усіх"
// textNoDigitsAllow: "Numbers are not allowed." => "Номери не допускаються."
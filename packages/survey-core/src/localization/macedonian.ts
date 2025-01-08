import { setupLocale } from "survey-core";

export var macedonianSurveyStrings = {
  pagePrevText: "Претходна",
  pageNextText: "Следно",
  completeText: "Заврши",
  previewText: "Преглед",
  editText: "Уредување",
  startSurveyText: "Започнете",
  otherItemText: "Друго (опиши)",
  noneItemText: "Ништо",
  refuseItemText: "Одбиј да одговориш.",
  dontKnowItemText: "Не знам",
  selectAllItemText: "Селектирај се",
  deselectAllItemText: "Отстранете селекција на сите",
  progressText: "Страница {0} од {1}",
  indexText: "{0} на {1}",
  panelDynamicProgressText: "Сними {0} од {1}",
  panelDynamicTabTextFormat: "Панел {панел Индекс}",
  questionsProgressText: "Одговорени на {0} / {1} прашања",
  emptySurvey: "Нема видлива страница или прашање во истражувањето.",
  completingSurvey: "Ви благодариме што го завршивте истражувањето!",
  completingSurveyBefore: "Нашите записи покажуваат дека веќе сте го завршиле ова истражување.",
  loadingSurvey: "Анкетата се вчитува ...",
  placeholder: "Изберете ...",
  ratingOptionsCaption: "Изберете...",
  value: "вредност",
  requiredError: "Ве молам, одговорете на прашањето.",
  requiredErrorInPanel: "Ве молам, одговорете барем на едно прашање.",
  requiredInAllRowsError: "Ве молиме, одговорете на прашања во сите редови.",
  eachRowUniqueError: "Секој ред мора да има уникатна вредност.",
  numericError: "Вредноста треба да биде нумеричка.",
  minError: "Вредноста не треба да биде помала од {0}",
  maxError: "Вредноста не треба да биде поголема од {0}",
  textNoDigitsAllow: "Броевите не се дозволени.",
  textMinLength: "Внесете најмалку {0} знак/ци.",
  textMaxLength: "Внесете не повеќе од {0} знак/ци.",
  textMinMaxLength: "Внесете најмалку {0} и не повеќе од {1} знаци.",
  minRowCountError: "Пополнете најмалку {0} ред(ови).",
  minSelectError: "Ве молиме изберете најмалку {0} варијанта(и).",
  maxSelectError: "Изберете не повеќе од {0} варијанта(и).",
  numericMinMax: "'{0}' треба да биде најмалку {1} и најмногу {2}",
  numericMin: "'{0}' треба да биде најмалку {1}",
  numericMax: "'{0}' треба да биде најмногу {1}",
  invalidEmail: "Ве молиме внесете валидна е-маил адреса.",
  invalidExpression: "Изразот: {0} треба да се врати 'true'.",
  urlRequestError: "Барањето врати грешка '{0}'. {1} ",
  urlGetChoicesError: "Барањето врати празни податоци или својството 'path' е неточно",
  exceedMaxSize: "Големината на датотеката не треба да надминува {0}.",
  noUploadFilesHandler: "Фајловите не можат да се качуваат. Ве молиме додадете раководител за настанот 'onUploadFiles'.",
  otherRequiredError: "Внесете ја другата вредност.",
  uploadingFile: "Вашата датотека се поставува. Ве молиме почекајте неколку секунди и обидете се повторно.",
  loadingFile: "Се вчитува ...",
  chooseFile: "Изберете датотека (и) ...",
  noFileChosen: "Не се избрани датотеки",
  filePlaceholder: "Пуштете датотека овде или кликнете на копчето подолу за да ја вчитате датотеката.",
  confirmDelete: "Дали сакате да го избришете записот?",
  keyDuplicationError: "Оваа вредност треба да биде единствена.",
  addColumn: "Додај колона",
  addRow: "Додади ред",
  removeRow: "Отстрани",
  noRowsText: "Нема редови.",
  addPanel: "Додади ново",
  removePanel: "Отстрани",
  showDetails: "Прикажување на деталите",
  hideDetails: "Сокриј ги деталите.",
  choices_Item: "ставка",
  matrix_column: "Колона",
  matrix_row: "Ред",
  multipletext_itemname: "текст.",
  savingData: "Резултатите се зачувуваат на серверот ...",
  savingDataError: "Настана грешка и не можевме да ги зачуваме резултатите.",
  savingDataSuccess: "Резултатите беа успешно зачувани!",
  savingExceedSize: "Вашиот одговор надминува 64KB. Ве молиме да ја намалите големината на вашата(ите) датотека(и) и обидете се повторно или контактирајте го сопственикот на истражувањето.",
  saveAgainButton: "Обиди се повторно",
  timerMin: "мин",
  timerSec: "сек",
  timerSpentAll: "Поминавте {0} на оваа страница и вкупно {1}.",
  timerSpentPage: "Поминавте {0} на оваа страница.",
  timerSpentSurvey: "Вие потрошивте вкупно {0}.",
  timerLimitAll: "Поминавте {0} од {1} на оваа страница и {2} од {3} вкупно.",
  timerLimitPage: "Поминавте {0} од {1} на оваа страница.",
  timerLimitSurvey: "Вие потрошивте вкупно {0} од {1}.",
  clearCaption: "Да расчисти",
  signaturePlaceHolder: "Потпиши се овде.",
  signaturePlaceHolderReadOnly: "Нема потпис",
  chooseFileCaption: "Изберете датотека",
  takePhotoCaption: "Фотографирајте",
  photoPlaceholder: "Кликнете на копчето подолу за да фотографирате користејќи ја камерата.",
  fileOrPhotoPlaceholder: "Влечете и фрлајте или изберете датотека за качување или фотографирање користејќи ја камерата.",
  replaceFileCaption: "Заменете го фајлот.",
  removeFileCaption: "Отстранете ја оваа датотека",
  booleanCheckedLabel: "Да",
  booleanUncheckedLabel: "Не",
  confirmRemoveFile: "Дали сте сигурни дека сакате да ја отстраните оваа датотека: {0}?",
  confirmRemoveAllFiles: "Дали сте сигурни дека сакате да ги отстраните сите датотеки?",
  questionTitlePatternText: "Наслов на прашањето",
  modalCancelButtonText: "Откажи",
  modalApplyButtonText: "Аплицирај",
  filterStringPlaceholder: "Тип за пребарување...",
  emptyMessage: "Нема податоци за прикажување",
  noEntriesText: "Сеуште нема влезници.\nКликнете на копчето подолу за да додадете нов влез.",
  noEntriesReadonlyText: "Нема влезници.",
  tabTitlePlaceholder: "Нов панел",
  more: "Повеќе",
  tagboxDoneButtonCaption: "ДОБРО",
  selectToRankEmptyRankedAreaText: "Сите избори се рангирани",
  selectToRankEmptyUnrankedAreaText: "Влечете и фрлете го изборот овде за да ги рангирате",
  ok: "ДОБРО",
  cancel: "Откажи"
};

setupLocale({ localeCode: "mk", strings: macedonianSurveyStrings, nativeName: "македонски", englishName: "Macedonian" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} на {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Панел {панел Индекс}"
// ratingOptionsCaption: "Select..." => "Изберете..."
// multipletext_itemname: "text" => "текст."
// signaturePlaceHolder: "Sign here" => "Потпиши се овде."
// filterStringPlaceholder: "Type to search..." => "Тип за пребарување..."
// emptyMessage: "No data to display" => "Нема податоци за прикажување"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Сеуште нема влезници.\nКликнете на копчето подолу за да додадете нов влез."
// noEntriesReadonlyText: "There are no entries." => "Нема влезници."
// more: "More" => "Повеќе"
// tagboxDoneButtonCaption: "OK" => "ДОБРО"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Сите избори се рангирани"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Влечете и фрлете го изборот овде за да ги рангирате"// takePhotoCaption: "Take Photo" => "Фотографирајте"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Кликнете на копчето подолу за да фотографирате користејќи ја камерата."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Влечете и фрлајте или изберете датотека за качување или фотографирање користејќи ја камерата."
// replaceFileCaption: "Replace file" => "Заменете го фајлот."// eachRowUniqueError: "Each row must have a unique value." => "Секој ред мора да има уникатна вредност."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Фајловите не можат да се качуваат. Ве молиме додадете раководител за настанот 'onUploadFiles'."
// showDetails: "Show Details" => "Прикажување на деталите"
// hideDetails: "Hide Details" => "Сокриј ги деталите."
// ok: "OK" => "ДОБРО"
// cancel: "Cancel" => "Откажи"
// refuseItemText: "Refuse to answer" => "Одбиј да одговориш."
// dontKnowItemText: "Don't know" => "Не знам"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Вашиот одговор надминува 64KB. Ве молиме да ја намалите големината на вашата(ите) датотека(и) и обидете се повторно или контактирајте го сопственикот на истражувањето."
// signaturePlaceHolderReadOnly: "No signature" => "Нема потпис"// tabTitlePlaceholder: "New Panel" => "Нов панел"// deselectAllItemText: "Deselect all" => "Отстранете селекција на сите"
// textNoDigitsAllow: "Numbers are not allowed." => "Броевите не се дозволени."
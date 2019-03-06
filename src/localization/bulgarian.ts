//Uncomment this line on creating a translation file
import { surveyLocalization } from "../surveyStrings";

export var bulgarianStrings = {
  pagePrevText: "Назад",
  pageNextText: "Напред",
  completeText: "Край",
  startSurveyText: "Начало",
  otherItemText: "Друго (опишете)",
  noneItemText: "Нито един",
  selectAllItemText: "Всички",
  progressText: "стр. {0}, общо стр. {1}",
  emptySurvey: "Анкетата не съдържа видими страници или въпроси.",
  completingSurvey: "Благодарим ви за участието в анкетата!",
  completingSurveyBefore:
    "Изглежда, че вие вече сте попълнили анкетата.",
  loadingSurvey: "Зареждане на анкетата...",
  optionsCaption: "Изберете...",
  value: "value",
  requiredError: "Моля, отговорете на следния въпрос.",
  requiredErrorInPanel: "Моля, отговорете поне на един от въпросите.",
  requiredInAllRowsError: "Моля, отговорете на въпросите на всички редове.",
  numericError: "Стойността следва да бъде число.",
  textMinLength: "Моля, използвайте поне {0} символа.",
  textMaxLength: "Моля, използвайте не повече от {0} символа.",
  textMinMaxLength: "Моля, използвайте повече от {0} и по-малко от {1} символа.",
  minRowCountError: "Моля, попълнете поне {0} реда.",
  minSelectError: "Моля, изберете поне {0} варианта.",
  maxSelectError: "Моля, изберете не повече от {0} варианта.",
  numericMinMax:
    "Стойността '{0}' следва да бъде равна или по-голяма от {1} и равна или по-малка от {2}",
  numericMin: "Стойността '{0}' следва да бъде равна или по-голяма от {1}",
  numericMax: "Стойността '{0}' следва да бъде равна или по-малка от {1}",
  invalidEmail: "Моля, въведете валиден адрес на електронна поща.",
  invalidExpression: "Изразът: {0} трябва да дава резултат 'true' (истина).",
  urlRequestError: "Заявката води до грешка '{0}'. {1}",
  urlGetChoicesError:
    "Заявката не връща данни или частта 'path' (път до търсения ресурс на сървъра) е неправилно зададена",
  exceedMaxSize: "Размерът на файла следва да не превишава {0}.",
  otherRequiredError: "Моля, въведете другата стойност.",
  uploadingFile:
    "Вашит файл се зарежда на сървъра. Моля, изчакайте няколко секунди и тогава опитвайте отново.",
  loadingFile: "Зареждане...",
  chooseFile: "Изберете файл(ове)...",
  confirmDelete: "Желаете ли да изтриете записа?",
  keyDuplicationError: "Стойността следва да бъде уникална.",
  addColumn: "Добавяне на колона",
  addRow: "Добавяне на ред",
  removeRow: "Премахване на ред",
  addPanel: "Добавяне на панел",
  removePanel: "Премахване на панел",
  choices_Item: "елемент",
  matrix_column: "Колона",
  matrix_row: "Ред",
  savingData: "Резултатите се запазват на сървъра...",
  savingDataError: "Поради възникнала грешка резултатите не можаха да бъдат запазени.",
  savingDataSuccess: "Резултатите бяха запазени успешно!",
  saveAgainButton: "Нов опит",
  timerMin: "мин",
  timerSec: "сек",
  timerSpentAll: "Вие използвахте {0} на тази страница и общо {1}.",
  timerSpentPage: "Вие използвахте {0} на тази страница.",
  timerSpentSurvey: "Вие използвахте общо {0}.",
  timerLimitAll:
    "Вие изпозвахте {0} от {1} на тази страница и общо {2} от {3}.",
  timerLimitPage: "Вие използвахте {0} от {1} на тази страница.",
  timerLimitSurvey: "Вие използвахте общо {0} от {1}.",
  cleanCaption: "Изчистване",
  clearCaption: "Начално състояние",
  removeFileCaption: "Премахване на файла"
};

//Uncomment these two lines on creating a translation file. You should replace "en" and enStrings with your locale ("fr", "de" and so on) and your variable.
surveyLocalization.locales["bg"] = bulgarianStrings;
surveyLocalization.localeNames["bg"] = "Bulgarian";

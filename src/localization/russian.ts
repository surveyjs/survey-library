import { surveyLocalization } from "../surveyStrings";

export var russianSurveyStrings = {
  pagePrevText: "Назад",
  pageNextText: "Далее",
  completeText: "Готово",
  progressText: "Страница {0} из {1}",
  emptySurvey: "Нет ни одного вопроса.",
  completingSurvey: "Благодарим Вас за заполнение анкеты!",
  loadingSurvey: "Загрузка с сервера...",
  otherItemText: "Другое (пожалуйста, опишите)",
  optionsCaption: "Выбрать...",
  requiredError: "Пожалуйста, ответьте на вопрос.",
  numericError: "Ответ должен быть числом.",
  textMinLength: "Пожалуйста, введите хотя бы {0} символов.",
  minSelectError: "Пожалуйста, выберите хотя бы {0} вариантов.",
  maxSelectError: "Пожалуйста, выберите не более {0} вариантов.",
  numericMinMax:
    "'{0}' должно быть равным или больше, чем {1}, и равным или меньше, чем {2}",
  numericMin: "'{0}' должно быть равным или больше, чем {1}",
  numericMax: "'{0}' должно быть равным или меньше, чем {1}",
  invalidEmail: "Пожалуйста, введите действительный адрес электронной почты.",
  otherRequiredError: 'Пожалуйста, введите данные в поле "Другое"',
  timerMin: "мин",
  timerSec: "сек",
  timerSpentAll: "Вы потратили {0} на этой странице и {1} всего.",
  timerSpentPage: "Вы потратили {0} на этой странице.",
  timerSpentSurvey: "Вы потратили {0} в течение теста.",
  timerLimitAll:
    "Вы потратили {0} из {1} на этой странице и {2} из {3} для всего теста.",
  timerLimitPage: "Вы потратили {0} из {1} на этой странице.",
  timerLimitSurvey: "Вы потратили {0} из {1} для всего теста."
};

surveyLocalization.locales["ru"] = russianSurveyStrings;
surveyLocalization.localeNames["ru"] = "русский";

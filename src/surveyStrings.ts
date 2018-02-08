export var surveyLocalization = {
  currentLocale: "",
  defaultLocale: "en",
  locales: {},
  supportedLocales: [],
  getString: function(strName: string) {
    var loc = this.currentLocale
      ? this.locales[this.currentLocale]
      : this.locales[this.defaultLocale];
    if (!loc || !loc[strName]) loc = this.locales[this.defaultLocale];
    return loc[strName];
  },
  getLocales: function(): Array<string> {
    var res = [];
    res.push("");
    if (this.supportedLocales && this.supportedLocales.length > 0) {
      for (var i = 0; i < this.supportedLocales.length; i++) {
        res.push(this.supportedLocales[i]);
      }
    } else {
      for (var key in this.locales) {
        res.push(key);
      }
    }
    res.sort();
    return res;
  }
};
export var surveyStrings = {
  pagePrevText: "Previous",
  pageNextText: "Next",
  completeText: "Complete",
  startSurveyText: "Start",
  otherItemText: "Other (describe)",
  progressText: "Page {0} of {1}",
  emptySurvey: "There is no visible page or question in the survey.",
  completingSurvey: "Thank you for completing the survey!",
  completingSurveyBefore:
    "Our records show that you have already completed this survey.",
  loadingSurvey: "Survey is loading...",
  optionsCaption: "Choose...",
  value: "value",
  requiredError: "Please answer the question.",
  requiredErrorInPanel: "Please answer at least one question.",
  requiredInAllRowsError: "Please answer questions in all rows.",
  numericError: "The value should be numeric.",
  textMinLength: "Please enter at least {0} characters.",
  textMaxLength: "Please enter less than {0} characters.",
  textMinMaxLength: "Please enter more than {0} and less than {1} characters.",
  minRowCountError: "Please fill in at least {0} rows.",
  minSelectError: "Please select at least {0} variants.",
  maxSelectError: "Please select no more than {0} variants.",
  numericMinMax:
    "The '{0}' should be equal or more than {1} and equal or less than {2}",
  numericMin: "The '{0}' should be equal or more than {1}",
  numericMax: "The '{0}' should be equal or less than {1}",
  invalidEmail: "Please enter a valid e-mail address.",
  urlRequestError: "The request returned error '{0}'. {1}",
  urlGetChoicesError:
    "The request returned empty data or the 'path' property is incorrect",
  exceedMaxSize: "The file size should not exceed {0}.",
  otherRequiredError: "Please enter the other value.",
  uploadingFile:
    "Your file is uploading. Please wait several seconds and try again.",
  confirmDelete: "Do you want to delete the record?",
  keyDuplicationError: "This value should be unique.",
  addRow: "Add row",
  removeRow: "Remove",
  addPanel: "Add new",
  removePanel: "Remove",
  choices_Item: "item",
  matrix_column: "Column",
  matrix_row: "Row",
  savingData: "The results are saving on the server...",
  savingDataError: "An error occurred and we could not save the results.",
  savingDataSuccess: "The results were saved successfully!",
  saveAgainButton: "Try again",
  timerMin: "min",
  timerSec: "sec",
  timerSpentAll: "You have spent {0} on this page and {1} in total.",
  timerSpentPage: "You have spent {0} on this page.",
  timerSpentSurvey: "You have spent {0} in total.",
  timerLimitAll:
    "You have spent {0} of {1} on this page and {2} of {3} in total.",
  timerLimitPage: "You have spent {0} of {1} on this page.",
  timerLimitSurvey: "You have spent {0} of {1} in total.",
  cleanCaption: "Clean"
};
surveyLocalization.locales["en"] = surveyStrings;

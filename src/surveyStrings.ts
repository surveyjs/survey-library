export var surveyLocalization = {
    currentLocale: "",
    defaultLocale: "en",
    locales: {},
    supportedLocales: [],
    getString: function (strName: string) {
        var loc = this.currentLocale ? this.locales[this.currentLocale] : this.locales[this.defaultLocale];
        if (!loc || !loc[strName]) loc = this.locales[this.defaultLocale];
        return loc[strName];
    },
    getLocales: function (): Array<string> {
        var res = [];
        res.push("");
        if(this.supportedLocales && this.supportedLocales.length > 0) {
            for(var i = 0; i < this.supportedLocales.length; i ++) {
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
    otherItemText: "Other (describe)",
    progressText: "Page {0} of {1}",
    emptySurvey: "There is no visible page or question in the survey.",
    completingSurvey: "Thank you for completing the survey!",
    loadingSurvey: "Survey is loading...",
    optionsCaption: "Choose...",
    requiredError: "Please answer the question.",
    requiredInAllRowsError: "Please answer questions in all rows.",
    numericError: "The value should be numeric.",
    textMinLength: "Please enter at least {0} symbols.",
    textMaxLength: "Please enter less than {0} symbols.",
    textMinMaxLength: "Please enter more than {0} and less than {1} symbols.",
    minRowCountError: "Please fill in at least {0} rows.",
    minSelectError: "Please select at least {0} variants.",
    maxSelectError: "Please select no more than {0} variants.",
    numericMinMax: "The '{0}' should be equal or more than {1} and equal or less than {2}",
    numericMin: "The '{0}' should be equal or more than {1}",
    numericMax: "The '{0}' should be equal or less than {1}",
    invalidEmail: "Please enter a valid e-mail address.",
    urlRequestError: "The request returned error '{0}'. {1}",
    urlGetChoicesError: "The request returned empty data or the 'path' property is incorrect",
    exceedMaxSize: "The file size should not exceed {0}.",
    otherRequiredError: "Please enter the other value.",
    uploadingFile: "Your file is uploading. Please wait several seconds and try again.",
    addRow: "Add row",
    removeRow: "Remove",
    choices_Item: "item",
    matrix_column: "Column",
    matrix_row: "Row"
};
surveyLocalization.locales["en"] = surveyStrings;

if (!String.prototype["format"]) {
    String.prototype["format"] = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

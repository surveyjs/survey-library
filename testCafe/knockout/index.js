var showSurvey = function() {
    var storage = SurveysStorage[chooseTestInput.value];
    var survey;
    var modifications;

    if (storage.beforeRender) storage.beforeRender();
    if (storage.knockout_beforeRender) storage.knockout_beforeRender();

    survey = new Survey.Survey(storage.data, "root");

    survey.onComplete.add(onSurveyComplete);
    survey.css = storage.css || {};
    modifications = storage.modifications.concat(storage.knockout_modifications || []);

    survey.render();
    showModifications(modifications, survey);
};

var showModifications = function(modifications, survey) {
    modifications.map(function (modification, index) {
        showModification(modification, survey);
    });
};

var showModification = function(modification, survey) {
    var button = document.createElement('button');
    var modTitle = modification.title;
    var modValue = modification.value;

    button.id = modTitle;
    button.innerHTML = modTitle;

    button.onclick = function() {
        var q;

        if (typeof modValue === "function") {
            modValue(survey);
        } else {
            q = survey.getQuestionByName(modification.questionName || 'car');
            mergeOptions(q, modValue);
            survey.render();
        }
    };

    document.documentElement.appendChild(button);
};

var onSurveyComplete = function(survey) {
    window.SurveyResult = survey.data;
};

var mergeOptions = function (obj1, obj2){
    for (var attrname in obj2) {
        obj1[attrname] = obj2[attrname];
    }
};

var chooseTestInput = document.querySelector('#testName');
chooseTestInput.addEventListener('change', showSurvey);
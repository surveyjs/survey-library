---
layout: example
propertiesFile: exampleproperties/runonetime.html
title: Allow your clients/users run survey only one time.
---
{% capture survey_setup %}
function onIsSurveyCompleted(success, result, response) {
    if(!success) return;
    if(result == 'completed') {
        alert('You have already run the survey!');
    } else {
        runSurvey();
    }
}
function runSurveyCheck() {
    var clientId = document.getElementById('clientId').value;
    new Survey.dxSurveyService().isCompleted('47e699f7-d523-4476-8fcd-be601c91d119', clientId, onIsSurveyCompleted);
}

function runSurvey() {
    var survey = new Survey.Survey({
            surveyId: 'e7866476-e901-4ab7-9f38-574416387f73',
            surveyPostId: 'df2a04fb-ce9b-44a6-a6a7-6183ac555a68'
    }, "surveyContainer");
    survey.clientId = document.getElementById('clientId').value;
    survey.sendResultOnPageNext = document.getElementById('sendResultOnPageNext').checked;
    survey.onComplete.add(function (s) { 
        document.getElementById('surveyContainer').innerHTML = ""; 
        document.getElementById("clientIdContainer").style.display = "inline";
    });
    survey.onSendResult.add(function (survey) { 
        var text = "clientId:" + survey.clientId + ". The results are:" + JSON.stringify(survey.data)  + String.fromCharCode(13, 10);
        var memo = document.getElementById('sentResults');
        memo.value = memo.value + text;
    });
    document.getElementById("clientIdContainer").style.display = "none";
}
{% endcapture %}
    
{% include live-example-code.html %}
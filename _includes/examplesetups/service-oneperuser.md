{% if page.useangular %}
<h1>This feature is not supported yet</h1>

{% else %}

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
function surveyComplete(s) { 
    document.getElementById('surveyContainer').innerHTML = ""; 
    document.getElementById("clientIdContainer").style.display = "inline";
}
function surveySendResult(survey) { 
    var text = "clientId:" + survey.clientId + ". The results are:" + JSON.stringify(survey.data)  + String.fromCharCode(13, 10);
    var memo = document.getElementById('sentResults');
    memo.value = memo.value + text;
}

{% if page.useknockout or page.usevue %}
function runSurvey() {
    var survey = new Survey.Model({
            surveyId: 'e7866476-e901-4ab7-9f38-574416387f73',
            surveyPostId: 'df2a04fb-ce9b-44a6-a6a7-6183ac555a68'
    }, "surveyContainer");
    survey.clientId = document.getElementById('clientId').value;
    survey.sendResultOnPageNext = document.getElementById('sendResultOnPageNext').checked;
    survey.onComplete.add(surveyComplete);
    survey.onSendResult.add(surveySendResult);
    document.getElementById("clientIdContainer").style.display = "none";
{% if page.usevue %}
    new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}
}

{% else %}
function runSurvey() {
    document.getElementById("clientIdContainer").style.display = "none";    
    survey.sendResultOnPageNext = document.getElementById('sendResultOnPageNext').checked;
    var clientId = document.getElementById('clientId').value;
{% if page.usereact %}
    ReactDOM.render(<Survey.Survey model={survey} clientId={clientId} onComplete={surveyComplete} onSendResult={surveySendResult} />, document.getElementById("surveyElement"));
{% elsif page.usejquery %}
    $("#surveyElement").Survey({
        model: survey,
        clientId: clientId,
        onComplete: surveyComplete,
        onSendResult: surveySendResult
    });
{% endif %}
}

var survey = new Survey.Model({
        surveyId: 'e7866476-e901-4ab7-9f38-574416387f73',
        surveyPostId: 'df2a04fb-ce9b-44a6-a6a7-6183ac555a68'
}, "surveyContainer");
window.runSurveyCheck = runSurveyCheck;
{% endif %}

{% endcapture %}
{% endif %}

{% include live-example-code.html %}
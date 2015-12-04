---
layout: example
title: Allow your clients/users run survey only one time.
---
<div id="clientIdContainer">
    <p>
    Your client Id: <input type="text" id="clientId" value="" onChange="document.getElementById('btnStartSurvey').disabled = value == ''" 
        onkeypress = "this.onchange();" onpaste    = "this.onchange();" oninput    = "this.onchange();"/>
    <pre class="brush:js">survey.clientId = yourValue;</pre>
    </p>
    <p>
        Send the survey results before moving on the next Page: <input type="checkbox" id="sendResultOnPageNext" /> default is false.
        <p>
        If you have a long survey, many your users may not finish the survey and enter the data on few pagers on only the first one. If you still want to save the information from incompleted surveys, set this property to true. The clientId property should bet set correctly, otherwise the data of others users may be ovewritten.
        </p>
        <pre class="brush:js">survey.sendResultOnPageNext = yourvalue;</pre>
    </p>
    
    <input id="btnStartSurvey" type="button" disabled="true" value="Start Survey" onclick="runSurveyCheck()">
</div>
<div>
    <p>Survey results sent to the servey.</p>
    <textarea id="sentResults" rows="10" readonly="true" style="width:95%"></textarea>
</div>
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
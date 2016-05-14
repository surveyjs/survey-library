---
layout: example
usereact: true
title: Use cookie to run servey one time in a browser.
disablereRun: true
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/survey-cookie.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}


{% include live-example-code.html %}
<div class="jumbotron">
    <p>
    Set the cookieName in the survey JSON to the unique id, for example surveyId, to run the survey one time.
    </p>
    <p>
    <input type="button" value="Delete cookie and run survey" onclick="survey.deleteCookie(); reRunSurvey();" />
    </p>
</div>

---
layout: example
usejquery: true
title: Use cookie to run servey one time in a browser.
disablereRun: true
dataFile: surveys/survey-cookie.json
redirect_from: "/examples/survey-cookie.html"
---

{% include examplesetups/standard.md %}
{% include live-example-code.html %}
<div class="jumbotron">
    <p>
    Set the cookieName in the survey JSON to the unique id, for example surveyId, to run the survey one time.
    </p>
    <p>
    <input type="button" value="Delete cookie and run survey" onclick="survey.deleteCookie(); reRunSurvey();" />
    </p>
</div>
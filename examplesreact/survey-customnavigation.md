---
layout: example
usereact: true
title: Custom navigation
propertiesFile: exampleproperties/customnavigation.html
preSurvey: survey-custombuttons.html
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/survey-severalpages.json %});
survey.showTitle = false;

function setNavigationVisibility(survey) {
    document.getElementById('surveyPrev').style.display = !survey.isFirstPage ? "inline" : "none";
    document.getElementById('surveyNext').style.display = !survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyComplete').style.display = survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyProgress').innerText = "Page " + (survey.currentPage.visibleIndex + 1) + " of " + survey.visiblePageCount + ".";
}

ReactDOM.render(<ReactSurvey model={survey} onCurrentPageChanged={setNavigationVisibility} />, document.getElementById("surveyElement"));

setNavigationVisibility(survey);
{% endcapture %}

{% include live-example-code.html %}

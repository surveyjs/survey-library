---
layout: example
usereact: true
propertiesFile: exampleproperties/processtext.html
title: Pre-process question and page titles, and html properties. 
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/survey-processtext.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

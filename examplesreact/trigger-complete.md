---
layout: example
usereact: true
propertiesFile: exampleproperties/completetrigger.html
title: Complete Trigger - finishes the survey.
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/trigger-complete.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}
{% include live-example-code.html %}

---
layout: example
usereact: true
propertiesFile: exampleproperties/startwithnewline.html
title: Show several questions in one line/row. 
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/survey-startwithnewline.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

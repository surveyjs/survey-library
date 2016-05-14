---
layout: example
usereact: true
propertiesFile: exampleproperties/html.html
title: Use html elements inside your survey (type:'html')
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/questiontype-html.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
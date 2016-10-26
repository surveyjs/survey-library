---
layout: example
usereact: true
propertiesFile: exampleproperties/html.html
title: Use html elements inside your survey (type:'html')
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/questiontype-html.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
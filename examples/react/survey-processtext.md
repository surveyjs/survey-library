---
layout: example
usereact: true
propertiesFile: exampleproperties/processtext.html
title: Pre-process question and page titles, and html properties. Use survey properties to change the templates.
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/survey-processtext.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

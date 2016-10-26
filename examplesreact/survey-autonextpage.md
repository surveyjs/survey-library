---
layout: example
usereact: true
title: Go to the next page automatically
propertiesFile: exampleproperties/autonextpage.html
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/survey-autonextpage.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

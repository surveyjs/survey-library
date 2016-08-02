---
layout: example
usereact: true
title: Go to the next page automatically
propertiesFile: exampleproperties/autonextpage.html
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/survey-autonextpage.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

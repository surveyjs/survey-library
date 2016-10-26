---
layout: example
usereact: true
propertiesFile: exampleproperties/visibletrigger.html
title: Visible Trigger - Show/Hide question(s) on survey running.
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/trigger-visible.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}
{% include live-example-code.html %}

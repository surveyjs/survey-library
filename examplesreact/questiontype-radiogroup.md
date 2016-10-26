---
layout: example
usereact: true
hasColumnCount: true
propertiesFile: exampleproperties/selectbase.html 
title: One choice - radio group (type:'radiogroup')
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/questiontype-radiogroup.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
{% include demo-selectbase-choices.html %}
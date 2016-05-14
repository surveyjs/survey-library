---
layout: example
usereact: true
hasColumnCount: true
propertiesFile: exampleproperties/selectbase.html
title: One choice - checkbox (type:'checkbox')
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/questiontype-checkbox.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
{% include demo-selectbase-choices.html %}
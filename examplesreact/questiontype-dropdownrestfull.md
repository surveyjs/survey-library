---
layout: example
usereact: true
propertiesFile: exampleproperties/choicesrestfull.html
title: One choice - dropdown (type:'dropdown'). Get the choices from a restfull service.
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/questiontype-dropdownrestfull.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
---
layout: example
usereact: true
title: Matrix with multiple choices (type:'matrixdropdown')
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/questiontype-matrixdropdown.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

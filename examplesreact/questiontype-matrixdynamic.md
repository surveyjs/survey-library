---
layout: example
usereact: true
title: Matrix with dynamic rows (type:'matrixdynamic')
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/questiontype-matrixdynamic.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

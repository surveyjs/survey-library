---
layout: example
usereact: true
title: Matrix (type:'matrix')
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/questiontype-matrix.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

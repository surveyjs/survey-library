---
layout: example
usereact: true
title: Multiple Text (type:'multipletext')
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/questiontype-multipletext.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

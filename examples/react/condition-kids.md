---
layout: example
usereact: true
title: Write an expression in "visibleIf" to show/hide your question(s) 
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/condition-kids.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
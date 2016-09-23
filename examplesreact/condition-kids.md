---
layout: example
usereact: true
title: Write an expression in "visibleIf" to show/hide your question(s) 
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/condition-kids.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
---
layout: example
usereact: true
title: Standard validators
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/validators-standard.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
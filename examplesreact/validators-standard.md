---
layout: example
usereact: true
title: Standard validators
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/validators-standard.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
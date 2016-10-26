---
layout: example
usereact: true
title: Product Feedback survey
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/real-productfeedback.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
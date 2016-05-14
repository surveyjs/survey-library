---
layout: example
usereact: true
title: Product Feedback survey
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/real-productfeedback.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
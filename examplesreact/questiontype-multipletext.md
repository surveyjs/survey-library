---
layout: example
usereact: true
title: Multiple Text (type:'multipletext')
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/questiontype-multipletext.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

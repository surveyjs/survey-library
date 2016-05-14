---
layout: example
usereact: true
propertiesFile: exampleproperties/rating.html
title: Rating (type:'rating')
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/questiontype-rating.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

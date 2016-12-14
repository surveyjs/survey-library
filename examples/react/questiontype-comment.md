---
layout: example
usereact: true
propertiesFile: exampleproperties/comment.html
title: Comment (type:'comment') 
---
{% capture survey_setup %}
var survey = new  Survey.ReactSurveyModel({% include surveys/questiontype-comment.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

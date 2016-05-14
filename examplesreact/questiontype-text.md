---
layout: example
usereact: true
propertiesFile: exampleproperties/text.html
title: Text (type:'text')
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/questiontype-text.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

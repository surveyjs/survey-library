---
layout: example
usereact: true
propertiesFile: exampleproperties/file.html
title: File uploading (type:'file')
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/questiontype-file.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
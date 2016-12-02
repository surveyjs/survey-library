---
layout: example
usereact: true
title: Text (type:'text')
propertiesFile: exampleproperties/questiontext.html
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/questiontype-text.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

---
layout: example
usereact: true
propertiesFile: exampleproperties/selectbase.html
title: One choice - dropdown (type:'dropdown')
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/questiontype-dropdown.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
{% include demo-selectbase-choices.html %}
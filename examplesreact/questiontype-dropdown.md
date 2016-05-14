---
layout: example
usereact: true
propertiesFile: exampleproperties/selectbase.html
title: One choice - dropdown (type:'dropdown')
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/questiontype-dropdown.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
{% include demo-selectbase-choices.html %}
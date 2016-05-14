---
layout: example
usereact: true
title: DevExpress WinForms Look & Feel Technology
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({% include surveys/real-devexpresswinformsskins.json %});
ReactDOM.render(<ReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}
{% include live-example-code.html %}
---
layout: example
usereact: true
title: DevExpress WinForms Look & Feel Technology
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/real-devexpresswinformsskins.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}
{% include live-example-code.html %}
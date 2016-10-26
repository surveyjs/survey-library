---
layout: example
usereact: true
title: Custom css
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/questiontype-matrix.json %});
var myCss = {
        matrix: {root: "table table-striped"},
        navigationButton: "button btn-lg"   
   };
ReactDOM.render(<Survey.Survey model={survey} css={myCss} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
---
layout: example
usereact: true
propertiesFile: exampleproperties/data.html
title: Work with survey data (properties, methods and events).
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/survey-data.json %});
var data = {name:"John Doe", email: "johndoe@nobody.com", car:["Ford"]};
var surveyValueChanged = function (sender, options) {
    var el = document.getElementById(options.name);
    if(el) {
        el.value = options.value;
    }
};
ReactDOM.render(<Survey.Survey model={survey} data={data} onValueChanged={surveyValueChanged} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

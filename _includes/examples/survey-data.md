---
layout: example
propertiesFile: exampleproperties/data.html
title: Work with survey data (properties, methods and events).
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/survey-data.json %});
survey.data = {name:"John Doe", email: "johndoe@nobody.com", car:["Ford"]};
survey.onValueChanged.add(function (sender, options) {
    var el = document.getElementById(options.name);
    if(el) {
        el.value = options.value;
    }
});

{% endcapture %}

{% include live-example-code.html %}

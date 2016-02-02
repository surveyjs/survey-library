---
layout: example
propertiesFile: exampleproperties/data.html
title: Work with survey data (properties, methods and events).
---
{% capture survey_setup %}
var survey = new Survey.Survey({ questions: [
    {type: "text", name: "name", title: "Your name:"},
    {type: "text", name: "email", title: "Your e-mail"},
    { type: "checkbox", name: "car", title: "What car are you driving?", isRequired: true, colCount: 0,
        choices: ["None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen"] }
]});
survey.data = {name:"John Doe", email: "johndoe@nobody.com", car:["Ford"]};
survey.onValueChanged.add(function (sender, options) {
    var el = document.getElementById(options.name);
    if(el) {
        el.value = options.value;
    }
});

{% endcapture %}

{% include live-example-code.html %}

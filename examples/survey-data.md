---
layout: example
title: Work with survey data (properties, methods and events).
---
Text boxes are bind to survey values by using events.
<p/>
Name: <input type="text" id="name" onChange="survey.setValue('name', this.value)" value="John Doe"/>
<p/>
Email: <input type="email" id="email" size="30" onChange="survey.setValue('email', this.value)" value="johndoe@nobody.com"/>
<p/>
Cars (use comma to separate values, do not type spaces): <input type="text" id="car" size="50" onChange="survey.setValue('car', this.value.split(','))" value="Ford" />

<pre class="brush:js">
//Use getValue to get the value of the question
survey.getValue('questionName');
//Use setValue to set the value of the question
survey.setValue('questionName', newValue);
//Use data property to get/set survey data as json
survey.data = {"youquestion1": value1, "youquestionN":valueN};
//Use onValueChanged event to get a notification on chaning question value.
survey.onValueChanged.add(function (sender, options) {
    var mySurvey = sender;
    var questionName = options.name;
    var newValue = options.value;
});
//Use onComplete to get survey.data to pass it to the server.
survey.onComplete.add(function (sender) {
    var mySurvey = sender;
    var surveyData = sender.data;
});
</pre>

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

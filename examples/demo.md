---
layout: example
title: Presentation Demo
usedxchart: true
---

<input type="button" value="Set some values" onclick="changeSurveyData()" />

<div id="chartContainer" style="width:300px;height:300px"></div>

{% capture survey_setup %}
var survey = new dxSurvey.Survey(
{
surveyPostId: "53102fc1-d5fb-4639-b262-4cd527725e0f",
questions: [
{ 
    type: "checkbox", name: "langs", title: "Please select languages that you have been used during last three months (Maximum 3).", 
    isRequired: true, colCount: 4, 
    choices: ["Java", "C", "Python", "C++", "C#", "JavaScript", "PHP", "SQL", 
        "Ruby", "Shell", "HTML", "Objective-C", "R", "Swift", "Perl", "Visual Basic", 
        "Assembly", "Scala", "Matlab", "SAS", "Go", "Arduino", "Delphi", "Processing", 
        "Cobol", "D", "Clojuer", "Lua", "Haskell", "ABAP", "Ada", "VHDL", "Cuda", 
        "Lisp", "Forth", "LabView", "Erlang", "Verilog", "Fortran", "Rust", "TCL", 
        "Scheme", "Actionscript", "Ladder Logic", "Prolog", "Julia", "J", "Ocami"],
    validators : [{type: "answercount", maxCount: 3}]
},
{ type: "text", name: "name", title: "Please enter your name", isRequired: true},
{ type: "text", name: "email", title: "Please enter your e-mail, if you want us to contact you"}
]});
survey.data = {name: "Andrew Telnov"};
function changeSurveyData() {
    survey.setValue('langs', ['Java', 'C#']); 
    survey.setValue('email', 'andrewt@devexpress.com');
}
survey.onSendResult.add(function(s, options) {
    if(options.success) {
        s.getResult('5a53b484-77c0-4688-b0bd-6980f9331854', 'langs');
    }
});

survey.onGetResult.add(function(s, options) {
    if(options.success) {
        showChart(options.dataList);
    }
});

function showChart(chartDataSource) {    
    $("#chartContainer").dxPieChart({
        dataSource: chartDataSource,
        series: {
            argumentField: 'name',
            valueField: 'value'
        }
    });
}

{% endcapture %}
{% include live-example-code.html %}

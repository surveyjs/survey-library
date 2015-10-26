---
layout: example
title: Presentation Demo
---

<input type="button" value="Set some values" onclick="changeSurveyData()" />

{% capture survey_setup %}
var survey = new dxSurvey.Survey(
{
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
{% endcapture %}
{% include live-example-code.html %}

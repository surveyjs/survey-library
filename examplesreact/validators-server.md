---
layout: example
usereact: true
title: Example of using onValidateQuestion event
jquery: true
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({
        questions: [{ type: "text", name: "country", title: "Type a country:" }]
    });

//assign call to onServerValidateQuestions callback
function surveyValidateQuestion(survey, options) {
    //options.data contains the data for the current page.
    var countryName = options.data["country"];
    //If the question is empty then do nothing
    if (!countryName) options.complete();
    //call the ajax method
    $.ajax({
        url: "http://services.groupkt.com/country/get/all"
    }).then(function (data) {
        var found = false;
        var countries = data.RestResponse.result;
        for (var i = 0; i < countries.length; i++) {
            if (countries[i].name == countryName) {
                found = true; break;
            }
        }
        //if the country is unknown, add the error
        if (!found) options.errors["country"] = "The country name '" + countryName +"' is unknown.";
        //tell survey that we are done with the server validation
        options.complete();
    });
}
    
ReactDOM.render(<Survey.Survey model={survey} onServerValidateQuestions={surveyValidateQuestion} />, document.getElementById("surveyElement"));    
{% endcapture %}


{% include live-example-code.html %}
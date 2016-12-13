---
layout: example
title: Example of using onServerValidateQuestions callback
jquery: true
---
{% capture survey_setup %}
var survey = new Survey.Survey( {
        questions: [{ type: "text", name: "country", title: "Type a country:" }]
    });
{% endcapture %}
{% capture survey_events %}
//assign call to onServerValidateQuestions callback
survey.onServerValidateQuestions = function (survey, options) {
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
        if (!found) options.errors["country"] = "The country name '" + countryName +"' is not in this list: http://services.groupkt.com/country/get/all";
        //tell survey that we are done with the server validation
        options.complete();
    });
}
{% endcapture %}

{% include live-example-code.html %}
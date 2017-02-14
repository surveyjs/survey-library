{% capture survey_setup %}
var survey = new Survey.Model({
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
        if (!found) options.errors["country"] = "The country name '" + countryName +"' is not in this list: http://services.groupkt.com/country/get/all";
        //tell survey that we are done with the server validation
        options.complete();
    });
}
    
{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey} onServerValidateQuestions={surveyValidateQuestion} />, document.getElementById("surveyElement"));    

{% elsif page.useknockout%}
//assign call to onServerValidateQuestions callback
survey.onServerValidateQuestions = surveyValidateQuestion

{% elsif page.useangular%}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey,
        onServerValidateQuestions: surveyValidateQuestion
    });
}
{% include examplesetups/angular-example-component.md %}

{% elsif page.usejquery%}
$("#surveyElement").Survey({
    model: survey,
    onServerValidateQuestions: surveyValidateQuestion
});

{% elsif page.usevue %}
survey.onServerValidateQuestions = surveyValidateQuestion
var app = new Vue({ el: '#surveyElement', data: { survey: survey } });

{% endif %}

{% endcapture %}

{% include live-example-code.html %}

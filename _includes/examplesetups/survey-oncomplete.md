{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-oncomplete.json %});

function surveyOnComplete(s) { 
    alert("Thanks for your answer!");
}

{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey} onComplete={surveyOnComplete}/>, document.getElementById("surveyElement"));

{% elsif page.usevue%}
survey.onComplete.add(surveyOnComplete);

var app = new Vue({
    el: '#surveyElement',
    data: {
        survey: survey
    }
});

{% elsif page.useangular%}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey,
        onComplete: surveyOnComplete
    });
}
{% include examplesetups/angular-example-component.md %}

{% elsif page.usejquery%}
$("#surveyElement").Survey({
    model:survey,
    onComplete: surveyOnComplete
});

{% elsif page.useknockout%}
survey.onComplete.add(surveyOnComplete);
{% endif %}
{% endcapture %}

{% include live-example-code.html %}
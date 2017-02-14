{% capture survey_setup %}
var survey = new Survey.Model({% include {{page.dataFile}} %});
survey.mode = "display";
var data =  {"Quality":{"affordable":"3","does what it claims":"4","better then others":"3","easy to use":"5"},"satisfaction":"4","recommend friends":"4","suggestions":"24/7 support would help a lot.","price to competitors":"Not sure","price":"correct","pricelimit":{"mostamount":"450","leastamount":"200"},"email":"jon.snow@nightwatch.org"};
survey.data = data;
{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% elsif page.useknockout%}
survey.render("surveyElement");
{% elsif page.useangular%}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {model:survey});
}
{% include examplesetups/angular-example-component.md %}
{% elsif page.usejquery%}
$("#surveyElement").Survey({model:survey});
{% elsif page.usevue%}
var app = new Vue({
    el: '#surveyElement',
    data: {
        survey: survey
    }
});
{% endif %}
{% endcapture %}
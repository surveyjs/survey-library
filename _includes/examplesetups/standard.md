{% capture survey_setup %}
{% if page.usereact %}
var survey = new Survey.ReactSurveyModel({% include {{page.dataFile}} %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% elsif page.useknockout%}
var survey = new Survey.Survey({% include {{page.dataFile}} %});
{% elsif page.useangular%}
var survey = new Survey.ReactSurveyModel({% include {{page.dataFile}} %});
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {model:survey});
}
{% elsif page.usejquery%}
var survey = new Survey.ReactSurveyModel({% include {{page.dataFile}} %});
$("#surveyElement").Survey({model:survey});
{% endif %}
{% endcapture %}
{% if page.usereact %}
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.showProgressBar = "bottom";
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
{% elsif page.useknockout%}
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.showProgressBar = "bottom";
{% endcapture %}

{% include live-example-code.html %}
{% elsif page.useangular%}
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.showProgressBar = "bottom";
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {model:survey});
}
{% include examplesetups/angular-example-component.md %}
{% endcapture %}

{% include live-example-code.html %}
{% elsif page.usejquery%}
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.showProgressBar = "bottom";
$("#surveyElement").Survey({model:survey});
{% endcapture %}

{% include live-example-code.html %}
{% endif %}
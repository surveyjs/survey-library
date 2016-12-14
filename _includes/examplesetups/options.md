{% if page.usereact %}
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/survey-severalpages.json %});
survey.showProgressBar = "bottom";
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}
{% elsif page.useknockout%}
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/survey-severalpages.json %});
survey.showProgressBar = "bottom";
{% endcapture %}

{% include live-example-code.html %}
{% elsif page.useangular%}
{% elsif page.usejquery%}
{% endif %}
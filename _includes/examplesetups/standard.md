{% capture survey_setup %}
{% if page.usereact %}
var survey = new Survey.ReactSurveyModel({% include {{page.dataFile}} %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% elsif page.useknockout%}
var survey = new Survey.Survey({% include {{page.dataFile}} %});
{% elsif page.useangular%}
{% elsif page.usejquery%}
{% endif %}
{% endcapture %}
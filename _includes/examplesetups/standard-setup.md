{% capture survey_setup %}

{% if include.usereact %}
var survey = new Survey.ReactSurveyModel({% include {{include.data}} %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));

{% elsif include.useknockout%}
var survey = new Survey.Survey({% include {{include.data}} %});

{% elsif include.useangular%}

{% elsif include.usejquery%}

{% endif %}

{% endcapture %}



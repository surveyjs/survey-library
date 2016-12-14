{% if page.usereact %}
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel( { surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1' });
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}
{% include live-example-code.html %}
{% elsif page.useknockout%}
{% capture survey_setup %}
var survey = new Survey.Survey(
    { 
        surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1'
    });
{% endcapture %}
{% include live-example-code.html %}
{% elsif page.useangular%}
{% elsif page.usejquery%}
{% endif %}
{% if page.usereact %}
{% capture survey_setup %}
var survey = new Survey.Model( { surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1' });
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}
{% include live-example-code.html %}
{% elsif page.useknockout%}
{% capture survey_setup %}
var survey = new Survey.Model(
    { 
        surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1'
    });
{% endcapture %}
{% include live-example-code.html %}
{% elsif page.useangular%}
{% capture survey_setup %}
var survey = new Survey.Model( { surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1' });
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {model:survey});
}
{% include examplesetups/angular-example-component.md %}
{% endcapture %}
{% include live-example-code.html %}
{% elsif page.usejquery%}
{% capture survey_setup %}
var survey = new Survey.Model( { surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1' });
$("#surveyElement").Survey({model:survey});
{% endcapture %}
{% include live-example-code.html %}
{% endif %}
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-data.json %});
var data = {name:"John Doe", email: "johndoe@nobody.com", car:["Ford"]};
var surveyValueChanged = function (sender, options) {
    var el = document.getElementById(options.name);
    if(el) {
        el.value = options.value;
    }
};

{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey} data={data} onValueChanged={surveyValueChanged} />, document.getElementById("surveyElement"));

{% elsif page.useknockout%}
survey.data = data;
survey.onValueChanged.add(surveyValueChanged);

{% elsif page.useangular%}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey,
        data: data,
        onValueChanged: surveyValueChanged
    });
}
{% include examplesetups/angular-example-component.md %}

{% elsif page.usejquery%}
$("#surveyElement").Survey({
    model: survey,
    data: data,
    onValueChanged: surveyValueChanged
});

{% elsif page.usevue%}
var app = new Vue({
    el: '#surveyElement',
    data: {
        survey: survey
    }
});
survey.data = data;
survey.onValueChanged.add(surveyValueChanged);

{% endif %}

{% endcapture %}

{% include live-example-code.html %}

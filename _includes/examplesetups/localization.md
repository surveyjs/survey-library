{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.locale = "de";

//Example of adding new locale into the library.
var mycustomSurveyStrings = {
    pagePrevText: "My Page Prev",
    pageNextText: "My Page Next",
    completeText: "OK - Press to Complete",
};
Survey.surveyLocalization.locales["my"] = mycustomSurveyStrings;

{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));

{% elsif page.usevue%}
var app = new Vue({
    el: '#surveyElement',
    data: {
        survey: survey
    }
});

{% elsif page.useangular%}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {model:survey});
}
{% include examplesetups/angular-example-component.md %}

{% elsif page.usejquery%}
$("#surveyElement").Survey({model:survey});

{% endif %}
{% endcapture %}

{% include live-example-code.html %}
<div class="jumbotron">
    <p>To get all localizable strings, please go to <a href="https://github.com/surveyjs/surveyjs/tree/master/src/localization" target="_blank">Github</a>.</p>
    <p>
    If you want to share your localization with the community, please create a new typescript file, similar to german.ts, and do a pull request.
    </p>
</div>
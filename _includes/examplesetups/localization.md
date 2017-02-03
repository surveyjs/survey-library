{% if page.usereact %}
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.locale = "de";
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));

//Example of adding new locale into the library.
var mycustomSurveyStrings = {
    pagePrevText: "My Page Prev",
    pageNextText: "My Page Next",
    completeText: "OK - Press to Complete",
};
Survey.surveyLocalization.locales["my"] = mycustomSurveyStrings;


{% endcapture %}

{% include live-example-code.html %}
<div class="jumbotron">
    <p>To get all localizable strings, please go to <a href="https://github.com/surveyjs/surveyjs/tree/master/src/localization" target="_blank">Github</a>.</p>
    <p>
    If you want to share your localization with the community, please create a new typescript file, similar to german.ts, and do a pull request.
    </p>
</div>
{% elsif page.useknockout%}
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

{% endcapture %}

{% include live-example-code.html %}
<div class="jumbotron">
    <p>To get all localizable strings, please go to <a href="https://github.com/surveyjs/surveyjs/tree/master/src/localization" target="_blank">Github</a>.</p>
    <p>
    If you want to share your localization with the community, please create a new typescript file, similar to german.ts, and do a pull request.
    </p>
</div>
{% elsif page.useangular%}
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.locale = "de";
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {model:survey});
}
{% include examplesetups/angular-example-component.md %}

//Example of adding new locale into the library.
var mycustomSurveyStrings = {
    pagePrevText: "My Page Prev",
    pageNextText: "My Page Next",
    completeText: "OK - Press to Complete",
};
Survey.surveyLocalization.locales["my"] = mycustomSurveyStrings;


{% endcapture %}

{% include live-example-code.html %}
<div class="jumbotron">
    <p>To get all localizable strings, please go to <a href="https://github.com/surveyjs/surveyjs/tree/master/src/localization" target="_blank">Github</a>.</p>
    <p>
    If you want to share your localization with the community, please create a new typescript file, similar to german.ts, and do a pull request.
    </p>
</div>
{% elsif page.usejquery%}
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.locale = "de";
$("#surveyElement").Survey({model:survey});

//Example of adding new locale into the library.
var mycustomSurveyStrings = {
    pagePrevText: "My Page Prev",
    pageNextText: "My Page Next",
    completeText: "OK - Press to Complete",
};
Survey.surveyLocalization.locales["my"] = mycustomSurveyStrings;


{% endcapture %}

{% include live-example-code.html %}
<div class="jumbotron">
    <p>To get all localizable strings, please go to <a href="https://github.com/surveyjs/surveyjs/tree/master/src/localization" target="_blank">Github</a>.</p>
    <p>
    If you want to share your localization with the community, please create a new typescript file, similar to german.ts, and do a pull request.
    </p>
</div>
{% endif %}
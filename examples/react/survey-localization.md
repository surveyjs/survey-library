---
layout: example
usereact: true
propertiesFile: exampleproperties/localization.html
title: Localize your survey
---
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({% include surveys/survey-severalpages.json %});
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
    <p>To get all localizable strings, please go to <a href="https://github.com/andrewtelnov/surveyjs/tree/master/src/localization" target="_blank">Github</a>.</p>
    <p>
    If you want to share your localization with the community, please create a new typescript file, similar to german.ts, and do a pull request.
    </p>
</div>

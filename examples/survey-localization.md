---
layout: example
propertiesFile: exampleproperties/localization.html
title: Localize your survey
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/survey-severalpages.json %});
survey.locale = "de";

//Example of adding new locale into the library.
var Survey;
(function (Survey) {
    var mycustomerSurveyStrings = {
        pagePrevText: "My Page Prev",
        pageNextText: "My Page Next",
        completeText: "OK - Press to Complete",
    };
    Survey.surveyLocalization.locales["my"] = mycustomerSurveyStrings;
})(Survey || (Survey = {}));

{% endcapture %}

{% include live-example-code.html %}
<div class="jumbotron">
    <p>To get all localizable strings, please go to <a href="https://github.com/andrewtelnov/surveyjs/tree/master/src/localization" target="_blank">Github</a>.</p>
    <p>
    If you want to share your localization with the community, please create a new typescript file, similar to german.ts, and do a pull request.
    </p>
</div>

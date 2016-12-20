{% if page.usereact %}
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.showTitle = false;

function setNavigationVisibility(survey) {
    document.getElementById('surveyPrev').style.display = !survey.isFirstPage ? "inline" : "none";
    document.getElementById('surveyNext').style.display = !survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyComplete').style.display = survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyProgress').innerText = "Page " + (survey.currentPage.visibleIndex + 1) + " of " + survey.visiblePageCount + ".";
}

ReactDOM.render(<Survey.Survey model={survey} onCurrentPageChanged={setNavigationVisibility} />, document.getElementById("surveyElement"));

setNavigationVisibility(survey);
{% endcapture %}

{% include live-example-code.html %}
{% elsif page.useknockout%}
Use onRedered event to initialized your custom navigation and onCurrentPageChanged event to update it after the current page is changed.
<pre class="brush:js">
survey.onRendered.add(function (sender) {
    var survey = sender;
    //Your code
});
survey.onCurrentPageChanged.add(function (sender, options) {
    var survey = sender;
    var oldCurrentPage = options.oldCurrentPage;
    var newCurrentPage = options.newCurrentPage;
    //Your code
});
</pre>

{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.showTitle = false;
survey.onRendered.add(function (sender) {
    setNavigationVisibility(sender);
});
survey.onCurrentPageChanged.add(function (sender) {
    setNavigationVisibility(sender);
});

function setNavigationVisibility(survey) {
    document.getElementById('surveyPrev').style.display = !survey.isFirstPage ? "inline" : "none";
    document.getElementById('surveyNext').style.display = !survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyComplete').style.display = survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyProgress').innerText = "Page " + (survey.currentPage.visibleIndex + 1) + " of " + survey.visiblePageCount + ".";
}

{% endcapture %}

{% include live-example-code.html %}
{% elsif page.useangular%}
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.showTitle = false;

function setNavigationVisibility(survey) {
    document.getElementById('surveyPrev').style.display = !survey.isFirstPage ? "inline" : "none";
    document.getElementById('surveyNext').style.display = !survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyComplete').style.display = survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyProgress').innerText = "Page " + (survey.currentPage.visibleIndex + 1) + " of " + survey.visiblePageCount + ".";
}

function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey,
        onCurrentPageChanged: setNavigationVisibility
    });
}
{% include examplesetups/angular-example-component.md %}

setNavigationVisibility(survey);
{% endcapture %}

{% include live-example-code.html %}
{% elsif page.usejquery%}
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.showTitle = false;

function setNavigationVisibility(survey) {
    document.getElementById('surveyPrev').style.display = !survey.isFirstPage ? "inline" : "none";
    document.getElementById('surveyNext').style.display = !survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyComplete').style.display = survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyProgress').innerText = "Page " + (survey.currentPage.visibleIndex + 1) + " of " + survey.visiblePageCount + ".";
}

$("#surveyElement").Survey({
    model: survey,
    onCurrentPageChanged: setNavigationVisibility
});

setNavigationVisibility(survey);
{% endcapture %}

{% include live-example-code.html %}
{% endif %}
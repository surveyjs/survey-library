{% if page.useknockout or page.usevue %}
<p>Use 
{% if page.useknockout %}
onRedered event to initialized your custom navigation and 
{% endif %}
onCurrentPageChanged event to update it after the current page is changed.</p>
<pre class="brush:js">
{% if page.useknockout %}
survey.onRendered.add(function (sender) {
    var survey = sender;
    //Your code
});
{% endif %}
survey.onCurrentPageChanged.add(function (sender, options) {
    var survey = sender;
    var oldCurrentPage = options.oldCurrentPage;
    var newCurrentPage = options.newCurrentPage;
    //Your code
});
</pre>
{% endif %}

{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/survey-severalpages.json %});
survey.showTitle = false;

function setNavigationVisibility(survey) {
    document.getElementById('surveyPrev').style.display = !survey.isFirstPage ? "inline" : "none";
    document.getElementById('surveyNext').style.display = !survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyComplete').style.display = survey.isLastPage ? "inline" : "none";
    document.getElementById('surveyProgress').innerText = "Page " + (survey.currentPage.visibleIndex + 1) + " of " + survey.visiblePageCount + ".";
}

{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey} onCurrentPageChanged={setNavigationVisibility} />, document.getElementById("surveyElement"));
setNavigationVisibility(survey);

{% elsif page.useknockout %}
survey.onRendered.add(setNavigationVisibility);
survey.onCurrentPageChanged.add(setNavigationVisibility);

{% elsif page.useangular %}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey,
        onCurrentPageChanged: setNavigationVisibility
    });
}
{% include examplesetups/angular-example-component.md %}
setNavigationVisibility(survey);

{% elsif page.usejquery %}
$("#surveyElement").Survey({
    model: survey,
    onCurrentPageChanged: setNavigationVisibility
});
setNavigationVisibility(survey);

{% elsif page.usevue %}
survey.onCurrentPageChanged.add(setNavigationVisibility);
new Vue({ el: '#surveyElement', data: { survey: survey } });
setNavigationVisibility(survey);

{% endif %}

{% endcapture %}

{% include live-example-code.html %}

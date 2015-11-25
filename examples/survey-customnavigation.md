---
layout: example
title: Custom navigation
preSurvey: survey-custombuttons.html
---
<p>
Page Prev Text: <input type="text" value="Previous" onChange="survey.pagePrevText = this.value; survey.render();"/> default is "Previous".
<pre class="brush:js">survey.pagePrevText = yourValue; survey.render();</pre>
</p>
<p>
Page Next Text: <input type="text" value="Next" onChange="survey.pageNextText = this.value; survey.render();"/> default is "Next".
<pre class="brush:js">survey.pageNextText = yourValue; survey.render();</pre>
</p>
<p>
Complete Text: <input type="text" value="Complete" onChange="survey.completeText = this.value; survey.render();"/> default is "Complete".
<pre class="brush:js">survey.completeText = yourValue; survey.render();</pre>
</p>
<p>
Show Navigation Buttons: <input type="checkbox" checked="true" onChange="survey.showNavigationButtons = this.checked; survey.render();"/> default is true.
<pre class="brush:js">survey.showNavigationButtons = yourValue; survey.render();</pre>
</p>
<p>
Use onRedered event to initialized your custom navigation and onPageChanged event to update it after the current page is changed.
<pre class="brush:js">
survey.onRendered.add(function (sender) {
    var survey = sender;
    //Your code
});
survey.onPageChanged.add(function (sender, options) {
    var survey = sender;
    var oldCurrentPage = options.oldCurrentPage;
    var newCurrentPage = options.newCurrentPage;
    //Your code
});
</pre>
</p>
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/survey-severalpages.json %});
survey.showTitle = false;
survey.onRendered.add(function (sender) {
    setNavigationVisibility(sender);
});
survey.onPageChanged.add(function (sender) {
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

<script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.6.4/showdown.min.js"></script>
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/markdown-radiogroup.json %});
//Create showdown mardown converter
var converter = new showdown.Converter();
survey.onTextMarkdown.add(function(survey, options){
    //convert the mardown text to html
    var str = converter.makeHtml(options.text);
    //remove root paragraphs <p></p>
    str = str.substring(3);
    str = str.substring(0, str.length - 4);
    //set html
    options.html = str;
});

{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));

{% elsif page.useknockout%}

{% elsif page.useangular%}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey
    });
}
{% include examplesetups/angular-example-component.md %}

{% elsif page.usejquery%}
$("#surveyElement").Survey({
    model: survey,
});

{% elsif page.usevue%}
var app = new Vue({
    el: '#surveyElement',
    data: {
        survey: survey
    }
});

{% endif %}

{% endcapture %}

{% include live-example-code.html %}

<div class="jumbotron">
<p>SurveyJS supports markdown via onTextMarkDown event. You may use any JavaScript markdown library. In this example, we are using <a href="https://github.com/showdownjs/showdown">Showdown markdown</a>. You may use all features that this or other libraries have.</p>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.6.4/showdown.min.js"></script>
{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/markdown-matrix.json %});
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
<p>As you see all string properties can be represented as a json object, where key is a locale. If there is no translation for the selected locale then the 'default' value is used, or the first one, if default doesn't exist as well.</p>
</div>
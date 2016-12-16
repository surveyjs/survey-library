{% capture survey_setup %}
{% if page.usereact %}
var survey = new Survey.ReactSurveyModel({% include {{page.dataFile}} %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% elsif page.useknockout%}
var survey = new Survey.Survey({% include {{page.dataFile}} %});
{% elsif page.useangular%}
var survey = new Survey.ReactSurveyModel({% include {{page.dataFile}} %});
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {model:survey});
}
var HelloApp =
    ng.core
        .Component({
            selector: 'ng-app',
            template: '<div id="surveyContainer" class="survey-container contentcontainer codecontainer">' +
            '<div id="surveyElement"></div></div>'
        })
        .Class({
            constructor: function() {
            },
            ngOnInit: function() {
                onAngularComponentInit();
            }
        });
document.addEventListener('DOMContentLoaded', function() {
    ng.platformBrowserDynamic.bootstrap(HelloApp);
});
{% elsif page.usejquery%}
var survey = new Survey.ReactSurveyModel({% include {{page.dataFile}} %});
$("#surveyElement").Survey({model:survey});
{% endif %}
{% endcapture %}
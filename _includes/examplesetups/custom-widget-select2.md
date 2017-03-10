<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>

{% capture survey_setup %}
Survey.JsonObject.metaData.addProperty("dropdown", {name: "renderAs", default: "standard", choices: ["standard", "select2"]});
var survey = new Survey.Model({ questions: [
 { type: "dropdown", renderAs: "select2", choicesByUrl: { url: "https://restcountries.eu/rest/v1/all" }, name: "countries", title: "Please select the country you have arrived from:"}
]});

{% if page.usevue != true %}
var widget = {
    name: "select2",
    htmlTemplate: "<select style='width: 100%;'></select>",
    isFit : function(question) { return question["renderAs"] === 'select2'; },
    afterRender: function(question, el) {
{% if page.useknockout %}
        var $el = $(el);
{% else %}
        var $el = $(el).find("select");
{% endif %}
        var widget = $el.select2({
            theme: "classic"
        });
        question.choicesChangedCallback = function() {
            $el.select2({data: question.visibleChoices.map(function(choice) { return { id: choice.value, text: choice.text }; })});
        }
        $el.on('select2:select', function (e) {
            question.value = e.target.value;
        });
        var updateHandler = function() {
            $el.val(question.value).trigger("change");
        };
        question.valueChangedCallback = updateHandler;
        updateHandler();
    }
}
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
survey.data = { countries: "Andorra" };

{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey}/>, document.getElementById("surveyElement"));

{% elsif page.useknockout %}

{% elsif page.useangular %}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey
    });
}
{% include examplesetups/angular-example-component.md %}

{% elsif page.usejquery %}
$("#surveyElement").Survey({
    model: survey
});
{% endif %}

{% elsif page.usevue %}
var widget = {
    name: "select2",
    isFit : function(question) { return question["renderAs"] === 'select2'; }
}

Vue.component(widget.name, {
    props: ['question', 'css', 'isEditMode'],
    template: "<select style='width: 100%;'></select>",
    mounted: function () {
        var vm = this;
        $(vm.$el).select2({
            data: vm.question.choices.map(function(choice) { return { id: choice.value, text: choice.text }; }),
            theme: "classic"
        });
        vm.question.choicesChangedCallback = function() {
            $(vm.$el).select2({data: vm.question.visibleChoices.map(function(choice) { return { id: choice.value, text: choice.text }; })});
        }
        $(vm.$el).on('select2:select', function (e) {
          vm.question.value = e.target.value;
        });
        var updateHandler = function() {
            $(vm.$el).val(vm.question.value).trigger("change");
        }
        vm.question.valueChangedCallback = updateHandler;
        updateHandler();
    }
})
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
survey.data = { countries: "Andorra" };

new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% include live-example-code.html %}
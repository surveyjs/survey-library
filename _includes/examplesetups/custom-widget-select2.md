<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>

{% capture survey_setup %}
Survey.JsonObject.metaData.addProperty("dropdown", {name: "renderAs", default: "standard", choices: ["standard", "select2"]});
var survey = new Survey.Model({ questions: [
 { type: "dropdown", name: "customSelect", renderAs: "select2", title: "Choose...", isRequired: true, colCount: 0,
     choices: ["1", "2", "3", "4", "5"] }
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
            data: question.choices.map(function(choice) { return { id: choice.value, text: choice.text }; }),
            theme: "classic"
        });
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
survey.data = { customSelect: "3" };

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

survey.data = { customSelect: "3" };

new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% include live-example-code.html %}
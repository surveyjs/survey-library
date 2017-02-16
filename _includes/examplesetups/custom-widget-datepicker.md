<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/themes/mint-choc/jquery-ui.css" type="text/css" rel="stylesheet" /> 


{% capture survey_setup %}
var survey = new Survey.Model({
    pages: [
        { name:"page1", questions: [
            {name:"date", type:"text", inputType:"date", title: "Your favorite date:"}
        ]}
    ]
});

{% if page.usevue != true %}
var widget = {
    name: "datepicker",
    htmlTemplate: "<input id='widget-datepicker' type='text'>",
    isFit : function(question) { return question.name == 'date'; },
    afterRender: function(question, el) {
{% if page.useknockout %}
        var widget = $(el).datepicker();
{% else %}
        var widget = $(el).find('#widget-datepicker').datepicker();
{% endif %}
        widget.on("change", function (e) {
            question.value = $(this).val();
        });
        question.valueChangedCallback = function() {
            widget.datepicker('setDate', new Date(question.value));
        }
    }
}
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
{% endif %}

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

{% elsif page.usevue %}
var widget = {
    name: "datepicker",
    isFit : function(question) { return question.name == 'date'; }
}

Vue.component(widget.name, {
    props: ['question', 'css', 'isEditMode'],
    template: "<input id='widget-datepicker' type='text'>",
    mounted: function () {
        var vm = this
        var widget = $(vm.$el).datepicker();
        widget.on("change", function (e) {
            vm.question.value = $(this).val();
        });
        vm.question.valueChangedCallback = function() {
            widget.datepicker('setDate', new Date(vm.question.value));
        }
    },
    destroyed: function () {
        $(this.$el).off().remove();
    }
})
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
new Vue({ el: '#surveyElement', data: { survey: survey } });

{% endif %}


{% endcapture %}

{% include live-example-code.html %}

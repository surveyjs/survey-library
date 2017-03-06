<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>

{% capture survey_setup %}
Survey.JsonObject.metaData.addProperty("dropdown", {name: "renderAs", default: "standard", choices: ["standard", "select2"]});
var survey = new Survey.Model({ questions: [
 { type: "dropdown", name: "car", renderAs: "select2", title: "Choose...", isRequired: true, colCount: 0,
     choices: ["1", "2", "3", "4", "5"] }
]});

{% if page.usevue != true %}

{% elsif page.usevue %}
var widget = {
    name: "select2",
    isFit : function(question) { return question["renderAs"] === 'select2'; }
}

Vue.component(widget.name, {
    props: ['question', 'css', 'isEditMode'],
    template: '<select :id="question.inputId" v-model="question.value" style="width:50%"><option v-for="(item, index) in question.visibleChoices" :value="item.value">{{ "{{ item.text" }}}}</option></select>',
    mounted: function () {
        var vm = this;
        $(vm.$el).select2({
          theme: "classic"
        });
        $(vm.$el).on('select2:select', function (e) {
          vm.question.value = e.target.value;
        });
        vm.question.valueChangedCallback = function() {
            $(vm.$el).val(vm.question.value).trigger("change");
        }
    }
})
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);

survey.data = {car:"3"};

new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% include live-example-code.html %}
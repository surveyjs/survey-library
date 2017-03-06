<script src="https://unpkg.com/icheck@1.0.2"></script>
<link rel="stylesheet" href="https://unpkg.com/icheck@1.0.2/skins/square/blue.css">

{% capture survey_setup %}
Survey.JsonObject.metaData.addProperty("radiogroup", {name: "renderAs", default: "standard", choices: ["standard", "icheck"]});
var survey = new Survey.Model({ questions: [
 { type: "radiogroup", name: "car", renderAs: "icheck", title: "Choose...", isRequired: true, colCount: 0,
     choices: ["1", "2", "3", "4", "5"] }
]});

{% if page.usevue != true %}

{% elsif page.usevue %}
var widget = {
    name: "icheck",
    isFit : function(question) { return question["renderAs"] === 'icheck'; }
}
Vue.component(widget.name, {
    props: ['question', 'css', 'isEditMode'],
    template:'<div><div v-for="(item, index) in question.visibleChoices"><label><input type="radio" :name="question.name" :value="item.value" :id="question.inputId + \'_\' + item.value"  /><span>{{ "{{ item.text" }}}}</span></label></div></div>',
    mounted: function () {
        var vm = this;
        var select = function() {
          $(vm.$el).find("input[value=" + vm.question.value + "]").iCheck('check');
        }
        $(vm.$el).find('input').iCheck({
          checkboxClass: 'iradio_square-blue',
          radioClass: 'iradio_square-blue',
          increaseArea: '20%' // optional
        });
        $(vm.$el).find('input').on('ifChecked', function(event){
          vm.question.value = event.target.value;
        });
        vm.question.valueChangedCallback = select;
        select();
    }
})
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);

survey.data = {car:"3"};

new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% include live-example-code.html %}
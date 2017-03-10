<script src="https://unpkg.com/icheck@1.0.2"></script>
<link rel="stylesheet" href="https://unpkg.com/icheck@1.0.2/skins/square/blue.css">

{% capture survey_setup %}
Survey.JsonObject.metaData.addProperty("radiogroup", {name: "renderAs", default: "standard", choices: ["standard", "icheck"]});
var survey = new Survey.Model({ questions: [
 { type: "radiogroup", name: "position", renderAs: "icheck", title: "Choose job position...", isRequired: true, colCount: 0,
     choices: ["1|Designer", "2|Front-end Developer", "3|Back-end Developer", "4|Database Administrator", "5|System Engineer"] }
]});
survey.data = {position:"2"};

{% if page.usevue != true %}
var widget = {
    name: "icheck",
    isFit : function(question) { return question["renderAs"] === 'icheck'; },
    isDefaultRender: true,
    afterRender: function(question, el) {
        var select = function() {
          $(el).find("input[value=" + question.value + "]").iCheck('check');
        }
        $(el).find('input').iCheck({
          checkboxClass: 'iradio_square-blue',
          radioClass: 'iradio_square-blue'
        });
        $(el).find('input').on('ifChecked', function(event){
          question.value = event.target.value;
        });
        question.valueChangedCallback = select;
        select();
    }
}
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);

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
          radioClass: 'iradio_square-blue'
        });
        $(vm.$el).find('input').on('ifChecked', function(event){
          vm.question.value = event.target.value;
        });
        vm.question.valueChangedCallback = select;
        select();
    }
})
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);

new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% include live-example-code.html %}
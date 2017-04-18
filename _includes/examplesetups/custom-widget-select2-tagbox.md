<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>

{% capture survey_setup %}
Survey.JsonObject.metaData.addProperty("dropdown", {name: "renderAs", default: "standard", choices: ["standard", "select2tagbox"]});
var survey = new Survey.Model({ questions: [
 { type: "dropdown", renderAs: "select2tagbox", choicesByUrl: { url: "https://restcountries.eu/rest/v1/all" }, name: "countries", title: "Please select all countries you have been for the last 3 years."}
 ]});

{% if page.usevue != true %}
var widget = {
    name: "select2tagbox",
    htmlTemplate: "<select multiple='multiple' style='width: 100%;'></select>",
    isFit : function(question) { return question["renderAs"] === 'select2tagbox'; },
    afterRender: function(question, el) {
{% if page.useknockout %}
        var $el = $(el);
{% else %}
        var $el = $(el).find("select");
{% endif %}
        var widget = $el.select2({
            tags: "true",
            theme: "classic"
        });
        $el.on('select2:unselect', function (e) {
            var index = (question.value || []).indexOf(e.params.data.id);
            if(index !== -1) {
                var val = question.value;
                val.splice(index, 1);
                question.value = val;
            }
        });
        question.choicesChangedCallback = function() {
            $el.select2({data: question.visibleChoices.map(function(choice) { return { id: choice.value, text: choice.text }; })});
        }
        $el.on('select2:select', function (e) {
            question.value = (question.value || []).concat(e.params.data.id);
        });
        var updateHandler = function() {
            $el.val(question.value).trigger("change");
        };
        question.valueChangedCallback = updateHandler;
        updateHandler();
    }
    {% if page.useknockout %}
    {% else %}
        ,
        willUnmount: function(question, el) {
            var $select = $(el).find("select").select2();
            $select.each(function(i,item){
              $(item).select2("destroy");
            });
        } 
    {% endif %}
}
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
survey.data = { countries: ["Andorra"] };

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
    name: "select2tagbox",
    isFit : function(question) { return question["renderAs"] === 'select2tagbox'; }
}

Vue.component(widget.name, {
    props: ['question', 'css', 'isEditMode'],
    template: "<select multiple='multiple' style='width: 100%;'></select>",
    mounted: function () {
        var vm = this;
        var widget = $(vm.$el).select2({
            tags: "true",
            theme: "classic"
        });
        vm.question.choicesChangedCallback = function() {
            $(vm.$el).select2({data: vm.question.visibleChoices.map(function(choice) { return { id: choice.value, text: choice.text }; })});
        }
        $(vm.$el).on('select2:unselect', function (e) {
            var index = (vm.question.value || []).indexOf(e.params.data.id);
            if(index !== -1) {
                var val = vm.question.value;
                val.splice(index, 1);
                vm.question.value = val;
            }
        });
        $(vm.$el).on('select2:select', function (e) {
            vm.question.value = (vm.question.value || []).concat(e.params.data.id);
        });
        var updateHandler = function() {
            $(vm.$el).val(vm.question.value).trigger("change");
        }
        vm.question.valueChangedCallback = updateHandler;
        updateHandler();
    },
    destroyed: function () {
        var $select = $(this.$el).select2();
        $select.each(function(i,item){
          $(item).select2("destroy");
        });     
    }
})
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);

survey.data = { countries: ["Andorra"] };

new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% include live-example-code.html %}
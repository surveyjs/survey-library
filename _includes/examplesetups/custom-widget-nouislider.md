<link href="https://unpkg.com/nouislider@9.2.0/distribute/nouislider.min.css" rel="stylesheet" />
<script src="https://unpkg.com/nouislider@9.2.0"></script>
<script src="https://unpkg.com/wnumb@1.1.0"></script>

{% capture survey_setup %}
Survey.JsonObject.metaData.addProperty("checkbox", {name: "renderAs", default: "standard", choices: ["standard", "nouislider"]});
var survey = new Survey.Model({ questions: [
 { type: "checkbox", renderAs: "nouislider", name: "range", title: "Please range"}
 ]});

{% if page.usevue != true %}
var widget = {
    name: "nouislider",
    htmlTemplate: "<div id='slider'></div>",
    isFit : function(question) { return question["renderAs"] === 'nouislider'; },
    afterRender: function(question, el) {
        debugger;
{% if page.useknockout %}
        var slider = el;
{% else %}
        var slider = el.querySelector("#slider");
{% endif %}
        noUiSlider.create(slider, {
        	start: (question.value && question.value.length) ? question.value : [30, 70],
        	connect: true,
        	range: {
        		'min': 0,
        		'max': 100
        	}
        });
        slider.noUiSlider.on('set', function(){
        	question.value = slider.noUiSlider.get();
        });     
    }
    {% if page.useknockout %}
    {% else %}
        ,
        willUnmount: function(question, el) {
            var slider = el.querySelector("#slider");
            slider.noUiSlider.destroy(); 
        } 
    {% endif %}
}
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
survey.data = { range: ["20.00", "80.00"] };

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
    name: "nouislider",
    isFit : function(question) { return question["renderAs"] === 'nouislider'; }
}

Vue.component(widget.name, {
    props: ['question', 'css', 'isEditMode'],
    template: "<div id='slider'></div>",
    mounted: function () {
        var vm = this;
        var slider = vm.$el;        
        noUiSlider.create(slider, {
            start: (vm.question.value && vm.question.value.length) ? vm.question.value : [30, 70],
            connect: true,
            range: {
                'min': 0,
                'max': 100
            }
        });
        slider.noUiSlider.on('set', function(){
            vm.question.value = slider.noUiSlider.get();
        });
    },
    destroyed: function () {
         this.$el.noUiSlider.destroy();   
     }
})
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);

survey.data = { range: ["20.00", "80.00"] };

new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% include live-example-code.html %}
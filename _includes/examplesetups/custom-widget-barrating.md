<script src="https://unpkg.com/jquery-bar-rating"></script>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css">
<!-- Themes -->
<link rel="stylesheet" href="https://unpkg.com/jquery-bar-rating@1.2.2/dist/themes/bars-1to10.css">
<link rel="stylesheet" href="https://unpkg.com/jquery-bar-rating@1.2.2/dist/themes/bars-movie.css">
<link rel="stylesheet" href="https://unpkg.com/jquery-bar-rating@1.2.2/dist/themes/bars-square.css">
<link rel="stylesheet" href="https://unpkg.com/jquery-bar-rating@1.2.2/dist/themes/bars-pill.css">
<link rel="stylesheet" href="https://unpkg.com/jquery-bar-rating@1.2.2/dist/themes/bars-reversed.css">
<link rel="stylesheet" href="https://unpkg.com/jquery-bar-rating@1.2.2/dist/themes/bars-horizontal.css">

<link rel="stylesheet" href="https://unpkg.com/jquery-bar-rating@1.2.2/dist/themes/fontawesome-stars.css">
<link rel="stylesheet" href="https://unpkg.com/jquery-bar-rating@1.2.2/dist/themes/css-stars.css">
<link rel="stylesheet" href="https://unpkg.com/jquery-bar-rating@1.2.2/dist/themes/bootstrap-stars.css">
<link rel="stylesheet" href="https://unpkg.com/jquery-bar-rating@1.2.2/dist/themes/fontawesome-stars-o.css">

{% capture survey_setup %}
Survey.JsonObject.metaData.addProperty("dropdown", {name: "renderAs", default: "standard", choices: ["standard", "barrating"]});
var survey = new Survey.Model({ questions: [
 { type: "dropdown", name: "barrating1", renderAs: "barrating", title: "Choose...", 
     choices: ["1", "2", "3", "4", "5"] }
]});

{% if page.usevue != true %}
var widget = {
    name: "antennaio-jquery-bar-rating",
    isFit : function(question) { return question["renderAs"] === 'barrating'; },
    isDefaultRender: true,
    afterRender: function(question, el) {
{% if page.useknockout %}
        var $el = $(el);
{% else %}
        var $el = $(el).find("select");
{% endif %}
        $el.barrating('show', {
            theme: 'fontawesome-stars',
            initialRating: question.value,
            showValues: false,
            showSelectedRating: false,
            onSelect: function(value, text) {
                question.value = value;
            }
        });

        question.valueChangedCallback = function() {
            $(el).find('select').barrating('set', question.value);
        }
    }
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
survey.data = { barrating1: "3" };

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
    name: "antennaio-jquery-bar-rating",
    isFit : function(question) { return question["renderAs"] === 'barrating'; }
}

Vue.component(widget.name, {
    props: ['question', 'css', 'isEditMode'],
    template: `
      <select :id="question.inputId" v-model="question.value">
          <option v-for="(item, index) in question.visibleChoices" :value="item.value">{{ "{{ item.text" }}}}</option>
      </select>
    `,
    mounted: function () {

        var vm = this;
        $(vm.$el).barrating('show', {
            theme: 'fontawesome-stars',
            initialRating: vm.question.value,
            showValues: false,
            showSelectedRating: false,
            onSelect: function(value, text) {
                vm.question.value = value;
            }
        });

        vm.question.valueChangedCallback = function() {
            $(vm.$el).barrating('set', vm.question.value);
        }
    }
})
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);

survey.data = { barrating1: "3" };

new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% include live-example-code.html %}
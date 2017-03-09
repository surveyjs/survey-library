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
Survey.JsonObject.metaData.addProperty("dropdown", {name: "ratingTheme", default: "fontawesome-stars", choices: ["fontawesome-stars", "css-stars", "bars-pill", "bars-1to10", "bars-movie", "bars-square", "bars-reversed", "bars-horizontal", "bootstrap-stars", "fontawesome-stars-o"]});
Survey.JsonObject.metaData.addProperty("dropdown", {name: "showValues", default: false});
var survey = new Survey.Model({ questions: [
 { type: "dropdown", name: "barrating1", renderAs: "barrating", "ratingTheme": "fontawesome-stars", title: "Choose...", 
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
            theme: question.ratingTheme,
            initialRating: question.value,
            showValues: question.showValues,
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
            theme: vm.question.ratingTheme,
            initialRating: vm.question.value,
            showValues: vm.question.showValues,
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
var vueApp = new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% if page.usereact %}
<script type="text/babel">
{% else %}
<script>
{% endif %}
window.surveyForceUpdate = function() {
    document.getElementById("surveyElement").innerHTML = "";
{% if page.useknockout %}
    survey.render();
{% elsif page.usereact %}
    ReactDOM.render(<Survey.Survey model={survey}/>, document.getElementById("surveyElement"));
{% elsif page.usejquery %}
    $("#surveyElement").Survey({ model: survey });
{% elsif page.useangular %}
    document.querySelector("ng-app").innerHTML = "";
    ng.platformBrowserDynamic.bootstrap(HelloApp);
{% elsif page.usevue %}
    document.getElementById("surveyElement").innerHTML = "<survey :survey='survey'/>";
    vueApp.$destroy();
    vueApp = new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}
}
</script>

{% include live-example-code.html %}
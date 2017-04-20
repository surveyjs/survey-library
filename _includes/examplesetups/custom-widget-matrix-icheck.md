<script src="https://unpkg.com/icheck@1.0.2"></script>
<link rel="stylesheet" href="https://unpkg.com/icheck@1.0.2/skins/square/blue.css">

{% capture survey_setup %}
var survey = new Survey.Model({ questions: [
{ type: "matrix", name: "Quality", title: "Please indicate if you agree or disagree with the following statements",
   columns: [{ value: 1, text: "Strongly Disagree" }, 
              { value: 2, text: "Disagree" }, 
              { value: 3, text: "Neutral" }, 
              { value: 4, text: "Agree" }, 
              { value: 5, text: "Strongly Agree" }],
    rows: [{ value: "affordable", text: "Product is affordable" }, 
           { value: "does what it claims", text: "Product does what it claims" },
           { value: "better then others", text: "Product is better than other products on the market" }, 
           { value: "easy to use", text: "Product is easy to use" }]}
]});
survey.data = {"Quality":{
  "does what it claims" : "2",
  "better then others" : "1"
}}

{% if page.usevue != true %}
var widget = {
    name: "icheck",
    isDefaultRender: true,
    isFit : function(question) { return question.getType() === 'matrix'; },
    afterRender: function(question, el) {
        $(el).find('input').data({"iCheck": undefined});
        $(el).find('input').iCheck({
          checkboxClass: 'iradio_square-blue',
          radioClass: 'iradio_square-blue'
        });
        $(el).find('input').on('ifChecked', function(event) {
          question.generatedVisibleRows.forEach(function(row, index, rows) {
            if (row.fullName === event.target.name) {
              row.value = event.target.value
            }
          });
        });
        var select = function() {
          question.generatedVisibleRows.forEach(function(row, index, rows) {
            if (row.value) {
              $(el).find("input[name='" + row.fullName  + "'][value=" + row.value + "]").iCheck('check');
            }
          });
        }
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
    isFit : function(question) { return question.getType() === 'matrix'; }
}

Vue.component(widget.name, {
    props: ['question', 'css', 'isEditMode'],
    template:
`<table :class="css.matrix.root">
    <thead>
        <tr>
            <th v-show="question.hasRows"></th>
            <th v-for="column in question.columns">{{ "{{ column.text" }}}}</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(row, rowIndex) in question.visibleRows">
            <td v-show="question.hasRows">{{ "{{ row.text" }}}}</td>
            <td v-for="(column, columnIndex) in question.columns">
                <input type="radio" :name="row.fullName" v-model="row.value" :value="column.value" :disabled="question.isReadOnly" :id="(columnIndex === 0) && (rowIndex === 0) ? question.inputId : ''"/>
            </td>
        </tr>
    </tbody>
</table>`,
    mounted: function () {
        var vm = this;
        $(vm.$el).find('input').iCheck({
          checkboxClass: 'iradio_square-blue',
          radioClass: 'iradio_square-blue',
          increaseArea: '20%' // optional
        });
        $(vm.$el).find('input').on('ifChecked', function(event) {
          vm.question.generatedVisibleRows.forEach(function(row, index, rows) {
            if (row.fullName === event.target.name) {
              row.value = event.target.value
            }
          });
        });
        var select = function() {
          vm.question.generatedVisibleRows.forEach(function(row, index, rows) {
            if (row.value) {
              $(vm.$el).find("input[name='" + row.fullName  + "'][value=" + row.value + "]").iCheck('check');
            }
          });
        }
        vm.question.valueChangedCallback = select;
        select();
    }
})
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);

new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% include live-example-code.html %}
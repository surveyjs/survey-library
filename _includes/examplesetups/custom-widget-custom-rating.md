{% capture survey_setup %}
var survey = new Survey.Model({
    questions: [
      {
        type: "radiogroup",
        title: "Customer satisfaction degree",
        name: "radiogroup1",
        choices: [{value: 0, text: "Upset"}, {value: 1}, {value: 2}, {value: 3}, {value: 4}, {value: 5}, {value: 6}, {value: 7}, {value: 8}, {value: 9, text: "Satisfied"}],
      }
    ]
  }
);

{% if page.usevue != true %}
var widget = {
    name: "customrating",
{% if page.useknockout %}
    htmlTemplate: "<div></div>",
{% endif %}
    isFit : function(question) { return question.name == 'radiogroup1'; },
    afterRender: function(question, el) {
        el.className = "cr-rating";
        var widget = new RatingWidget(el, question, function(newVal) {
          question.value = newVal;
        });
        question.valueChangedCallback = function() {
          widget.updateValue(question.value)
        }
    }
}
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
survey.data = {radiogroup1:"8"};

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
    name: "customrating",
    isFit : function(question) { return question.name == 'radiogroup1'; }
}

Vue.component(widget.name, {
    props: ['question', 'css', 'isEditMode'],
    template: '<div></div>',
    mounted: function () {
        var vm = this;
        vm.$el.className = "cr-rating";
        var widget = new RatingWidget(vm.$el, vm.question, function(newVal) {
          vm.question.value = newVal;
        });
        vm.question.valueChangedCallback = function() {
            widget.updateValue(vm.question.value)
        }
    }
})
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
survey.data = {radiogroup1:"8"};

new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% capture survey_code_1 %}
function RatingWidget(target, question, valueChangedHandler) {
  var inputs = [];

  this.updateValue = function(newVal) {
    inputs.forEach(function(inputElement) {
      if(inputElement.value === newVal) {
        inputElement.checked = true;
      }
      else {
        inputElement.checked = false;
      }
    });
  }

  question.choices.forEach(function(choice, index) {
    var labelText = index > 0 && index < question.choices.length - 1 ? "" : choice.text;
    var label = document.createElement("label");
    label.className = "cr-item";
    var content = "";
    if(!!labelText) {
      content = content.concat("<div class='cr-label'>" + labelText + "</div>");
    }
    label.innerHTML = content.concat("<input type='radio' name='" + question.name + "' value='" + choice.value + "'>");
    inputs.push(label.childNodes[label.childNodes.length - 1]);
    target.appendChild(label);
  });
  inputs.forEach(function(inputElement) {
    inputElement.addEventListener('click', function(event) {
      valueChangedHandler(event.target.value);
    }, false);
  });
  this.updateValue(question.value);
}
{% endcapture %}

{% include live-example-code.html %}

{% capture survey_setup %}
var survey = new Survey.Model({
    pages: [
        { name:"page1", questions: [
            { type: "checkbox", isRequired:true, choicesByUrl: { url: "https://restcountries.eu/rest/v1/all" }, isRequired: true, name: "countries", title: "Please select all countries you have been for the last 3 years." }
        ]}
    ]
});

{% if page.usereact %}
var widget = {
    name: "tagbox",
    htmlTemplate: "<div></div>",
    isFit : function(question) { return question.name == 'countries'; },
    afterRender: function(question, el) {
        var widget = $(el).dxTagBox({
            items: question.visibleChoices,
            value: question.value,
            searchEnabled: true,
            displayExpr: "text",
            valueExpr: "value",
            onValueChanged: function (e) {
                question.value = e.value;
            }
        }).dxTagBox("instance");
        //It requires when choices fills on ajax callback, using choicesByUrl property.
        question.choicesChangedCallback = function() {
            widget.option("items", question.visibleChoices);
        }
        question.valueChangedCallback = function() {
            widget.option("value", question.value);
        }
    }
}
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
ReactDOM.render(<Survey.Survey model={survey}/>, document.getElementById("surveyElement"));

{% elsif page.useknockout %}
var widget = {
    name: "tagbox",
    htmlTemplate: "<div data-bind='dxTagBox: { items: question.koVisibleChoices, value: question.koValue, searchEnabled: true, displayExpr: \"text\", valueExpr: \"value\" }'></div>",
    isFit : function(question) { return question.name == 'countries'; },
}
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);

{% elsif page.useangular %}
var widget = {
    name: "tagbox",
    htmlTemplate: "<div></div>",
    isFit : function(question) { return question.name == 'countries'; },
    afterRender: function(question, el) {
        var widget = $(el).dxTagBox({
            items: question.visibleChoices,
            value: question.value,
            searchEnabled: true,
            displayExpr: "text",
            valueExpr: "value",
            onValueChanged: function (e) {
                question.value = e.value;
            }
        }).dxTagBox("instance");
        //It requires when choices fills on ajax callback, using choicesByUrl property.
        question.choicesChangedCallback = function() {
            widget.option("items", question.visibleChoices);
        }
        question.valueChangedCallback = function() {
            widget.option("value", question.value);
        }
    }
}
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey
    });
}
{% include examplesetups/angular-example-component.md %}

{% elsif page.usejquery %}
var widget = {
    name: "tagbox",
    htmlTemplate: "<div></div>",
    isFit : function(question) { return question.name == 'countries'; },
    afterRender: function(question, el) {
        var widget = $(el).dxTagBox({
            items: question.visibleChoices,
            value: question.value,
            searchEnabled: true,
            displayExpr: "text",
            valueExpr: "value",
            onValueChanged: function (e) {
                question.value = e.value;
            }
        }).dxTagBox("instance");
        //It requires when choices fills on ajax callback, using choicesByUrl property.
        question.choicesChangedCallback = function() {
            widget.option("items", question.visibleChoices);
        }
        question.valueChangedCallback = function() {
            widget.option("value", question.value);
        }
    }
}
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
$("#surveyElement").Survey({
    model: survey
});

{% elsif page.usevue %}
var widget = {
    name: "tagbox",
    isFit : function(question) { return question.name == 'countries'; }
}

Vue.component(widget.name, {
    props: ['question', 'css', 'isEditMode'],
    template: '<div></div>',
    mounted: function () {
        var vm = this
        var widget = $(vm.$el).dxTagBox({
            items: vm.question.visibleChoices,
            value: vm.question.value,
            searchEnabled: true,
            displayExpr: "text",
            valueExpr: "value",
            onValueChanged: function (e) {
                vm.question.value = e.value;
            }
        }).dxTagBox("instance");
        //It requires when choices fills on ajax callback, using choicesByUrl property.
        vm.question.choicesChangedCallback = function() {
            widget.option("items", vm.question.visibleChoices);
        }
        vm.question.valueChangedCallback = function() {
            widget.option("value", vm.question.value);
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

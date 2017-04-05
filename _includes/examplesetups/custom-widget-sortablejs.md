<script src="https://unpkg.com/sortablejs@1.5.1/Sortable.js"></script>

{% capture survey_setup %}
Survey.JsonObject.metaData.addProperty("checkbox", {name: "renderAs", default: "standard", choices: ["standard", "sortablejs"]});

var survey = new Survey.Model({ questions: [
    { type: "checkbox", name: "lifepriopity", renderAs: "sortablejs", title: "Life Priorities ", isRequired: true, colCount: 0,
        choices: ["family", "work", "pets", "travels", "games"] }
]});

{% if page.useknockout %}
var widget = {
    name: "sortablejs",
    isFit : function(question) { return question["renderAs"] === 'sortablejs'; },
    htmlTemplate: `
  <div style="width:50%">
    <div class="result" style="border-style:solid;border-width:1px;border-color:#1ab394;width:100%; min-height:50px;">
      <span>move items here</span>
    </div>
    <div class="source" style="border-style:solid;border-width:1px;border-color:#1ab394;width:100%; min-height:50px; margin-top:10px;">
      <!-- ko foreach: { data: question.visibleChoices, as: 'item' } -->
        <div data-bind="attr: { 'data-value':item.value }">
          <div style="background-color:#1ab394;color:#fff;margin:5px;padding:10px;" data-bind="text:item.text"></div>
        </div>
      <!-- /ko -->
    </div>
  </div>
`,
    afterRender: function(question, el) {  
      var resultContainer = el.querySelector(".result");
      var emptyText = resultContainer.querySelector("span");
      var sourceContainer = el.querySelector(".source");
      Sortable.create(resultContainer, {
          animation: 150,
          group: {
        		name: 'top3',
        		pull: true,
        		put: true
          },
        	onSort: function (evt) {
        	  var result = [];
        	  if (evt.to.children.length === 1) {
        	      emptyText.style.display = "inline-block";
        	  } else {
        	      emptyText.style.display = "none";
            	  for (var i = 1; i < evt.to.children.length; i++) {
            	      result.push(evt.to.children[i].dataset.value)
            	  }
        	  }
        		question.value = result;
        	},
      });
      Sortable.create(sourceContainer, {
          animation: 150,
          group: {
        		name: 'top3',
        		pull: true,
        		put: true
          }
      });
    }
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);

{% elsif page.usereact %}
ReactDOM.render(<Survey.Survey model={survey}/>, document.getElementById("surveyElement"));

{% elsif page.useangular %}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey
    });
}
{% include examplesetups/angular-example-component.md %}

{% elsif page.usejquery %}
var widget = {
    name: "sortablejs",
    isFit : function(question) { return question["renderAs"] === 'sortablejs'; },
    htmlTemplate: `<div></div>`,
    afterRender: function(question, el) {
      var $el = $(el);
      var style = {border: "1px solid #1ab394", width:"100%", minHeight:"50px" }
      $el.append(`
        <div style="width:50%">
          <div class="result">
            <span>move items here</span>
          </div>
          <div class="source" style="margin-top:10px;">
          </div>
        </div>
      `);
      var $source = $el.find(".source").css(style);
      var $result = $el.find(".result").css(style);
      var $emptyText = $result.find("span");
      question.visibleChoices.forEach(function(choice) {
        $source.append(`<div data-value="` + choice.value +  `">
                               <div style="background-color:#1ab394;color:#fff;margin:5px;padding:10px;">` + choice.text + `</div>
                             </div>`);
      });
      
      Sortable.create($result[0], {
          animation: 150,
          group: {
        		name: 'top3',
        		pull: true,
        		put: true
          },
        	onSort: function (evt) {
        	  var result = [];
        	  if (evt.to.children.length === 1) {
        	      $emptyText.css({display: "inline-block"});
        	  } else {
        	      $emptyText.css({display: "none"});
            	  for (var i = 1; i < evt.to.children.length; i++) {
            	      result.push(evt.to.children[i].dataset.value)
            	  }
        	  }
        		question.value = result;
        	},
      });
      Sortable.create($source[0], {
          animation: 150,
          group: {
        		name: 'top3',
        		pull: true,
        		put: true
          }
      });
    }
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);


$("#surveyElement").Survey({
    model: survey
});

{% elsif page.usevue %}
var widget = {
    name: "sortablejs",
    isFit : function(question) { return question["renderAs"] === 'sortablejs'; }
}

Vue.component(widget.name, {
    props: ['question', 'css', 'isEditMode'],
    template:`
  <div style="width:50%">
    <div style="border-style:solid;border-width:1px;border-color:#1ab394;width:100%; min-height:50px;">
      <span>move items here</span>
    </div>
    <div style="border-style:solid;border-width:1px;border-color:#1ab394;width:100%; min-height:50px; margin-top:10px;">
      <div v-for="(item, index) in question.visibleChoices" :data-value="item.value">
        <div style="background-color:#1ab394;color:#fff;margin:5px;padding:10px;">{{ "{{ item.text" }}}}</div>
      </div>
    </div>
  </div>
`,
    mounted: function () {
      var vm = this;
      var resultContainer = vm.$el.querySelector("div:first-child");
      var emptyText = resultContainer.querySelector("span");
      var sourceContainer = vm.$el.querySelector("div:last-child");
      Sortable.create(resultContainer, {
          animation: 150,
          group: {
        		name: 'top3',
        		pull: true,
        		put: true
          },
        	onSort: function (evt) {
        	  var result = [];
        	  if (evt.to.children.length === 1) {
        	      emptyText.style.display = "inline-block";
        	  } else {
        	      emptyText.style.display = "none";
            	  for (var i = 1; i < evt.to.children.length; i++) {
            	      result.push(evt.to.children[i].dataset.value)
            	  }
        	  }
        		vm.question.value = result;
        	},
      });
      Sortable.create(sourceContainer, {
          animation: 150,
          group: {
        		name: 'top3',
        		pull: true,
        		put: true
          }
      });
    }
})
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
new Vue({ el: '#surveyElement', data: { survey: survey } });
{% endif %}

{% endcapture %}

{% include live-example-code.html %}
{% capture survey_setup %}
var survey = new Survey.Model({
        questions: [
            { type: "multipletext", name: "pricelimit", title: "What is the... ", isRequired: true, colCount: 2,
            items: [{ name: "leastamount", title: "The least amount you have ever paid for a computer",
                validators: [{ type: "numeric", minValue: 10, maxValue: 10000 }]
            },
                {  name: "mostamount", title: "The most amount you have ever paid for a computer",
                validators: [{ type: "numeric", minValue: 10, maxValue: 10000 }]
                }]
            },
            {
                type: "comment", name: "firstcomputer", title: "Please tell us about your first computer", isRequired: true,
                validators: [{type:"text", minLength:20}]
            },

        ]
    });

function isNumber(n) { return n && !isNaN(parseFloat(n)) && isFinite(n); }    
   
function surveyValidateQuestion(s, options) {
    if (options.name == 'pricelimit') {
        var leastamount = options.value['leastamount'];
        var mostamount = options.value['mostamount'];
        if(leastamount > mostamount) {
            options.error = "The 'most amount' should be more 'less amount'.";
        }
    }
    if (options.name == 'firstcomputer') {
        if(options.value.indexOf('computer') < 0) {
            options.error = "Please type the word 'computer'.";
        }
    }
}
    
{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey} onValidateQuestion={surveyValidateQuestion} />, document.getElementById("surveyElement"));    

{% elsif page.useknockout%}
survey.onValidateQuestion.add(surveyValidateQuestion);

{% elsif page.useangular%}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey,
        onValidateQuestion: surveyValidateQuestion
    });
}
{% include examplesetups/angular-example-component.md %}

{% elsif page.usejquery%}
$("#surveyElement").Survey({
    model: survey,
    onValidateQuestion: surveyValidateQuestion
});

{% elsif page.usevue %}
survey.onValidateQuestion.add(surveyValidateQuestion);
var app = new Vue({ el: '#surveyElement', data: { survey: survey } });

{% endif %}

{% endcapture %}

{% include live-example-code.html %}

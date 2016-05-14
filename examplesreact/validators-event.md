---
layout: example
usereact: true
title: Example of using onValidateQuestion event
---
{% capture survey_setup %}
var survey = new ReactSurveyModel({
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
var surveyValidateQuestion = function (s, options) {
    var computerType = s.getValue('computertype');
    if (!computerType) return;
    if (options.name == 'pricelimit') {
        var value = options.value['leastamount'];
        if (value) {
            if (!isNumber(options.value)) {
                options.error = "The least amount should be a value.";
                return;
            }
            var value = parseFloat(options.value);
            if (computerType == 'desktop' && value < 100) {
                options.error = "The desktop should cost at least 100$.";
                return;
            }
        }
    }
};
    
ReactDOM.render(<ReactSurvey model={survey} onValidateQuestion={surveyValidateQuestion} />, document.getElementById("surveyElement"));    
{% endcapture %}

{% include live-example-code.html %}
---
layout: example
title: Example of using onValidateQuestion event
---
{% capture survey_setup %}
var survey = new Survey.Survey({
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
                type: "comment", name: "firstcomputer", title: "Please tell us about your first computer (type the word 'computer')", isRequired: true,
                validators: [{type:"text", minLength:20}]
            },
        ]
    });
function isNumber(n) { return n && !isNaN(parseFloat(n)) && isFinite(n); }    
{% endcapture %}
{% capture survey_events %}
survey.onValidateQuestion.add(function (s, options) {
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
});
{% endcapture %}

{% include live-example-code.html %}
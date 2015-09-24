---
layout: example
title: Standard validators
---
{% capture survey_setup %}
var survey = new dxSurvey.Survey({
        questions: [
            { type: "multipletext", name: "pricelimit", title: "What is the... ", isRequired: true,
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

        ]});
{% endcapture %}

{% include live-example-code.html %}
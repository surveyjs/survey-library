---
layout: example
title: Standard validators
---
<div id="dxsurvey"></div>
<script>
    dxSurvey.Survey.templateKnockout = "../templates/dx.survey.ko.html";
    var survey = new dxSurvey.Survey(
        {
            pages: [
                {
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

                    ]
                }
            ]
        }, document.getElementById("dxsurvey"));
    survey.onComplete.add(function (s) { document.getElementById("dxsurvey").innerHTML = "The results are: \n" + JSON.stringify(survey.data); });
</script>

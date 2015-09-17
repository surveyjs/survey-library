---
layout: example
title: Example of using onValidateQuestion event
---
<div id="dxsurvey"></div>
<script>
    dxSurvey.Survey.templateKnockout = "../templates/dx.survey.ko.html";
    var survey = new dxSurvey.Survey(
        {
            pages: [
                {
                    questions: [
                        { type: "dropdown", name: "computertype", title: "Select the computer type", isRequired: true,
                            choices: ["desktop", "notebook", "tablete"]
                        },
                        { type: "multipletext", name: "pricelimit", title: "What is the... ", isRequired: true,
                        items: [{ name: "leastamount", title: "The least amount you have ever paid for a computer" },
                            { name: "mostamount", title: "The most amount you have ever paid for a computer" }]
                        }
                    ]
                }
            ]
        }, document.getElementById("dxsurvey"));
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    survey.onValidateQuestion.add(function (s, options) {
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
    });
    survey.onComplete.add(function (s) { document.getElementById("dxsurvey").innerHTML = "The results are: \n" + JSON.stringify(survey.data); });
</script>

---
layout: example
title: Create custom validator
---
{% capture survey_code %}
(function (dxSurvey) {
    var MyTextValidator = (function (_super) {
        __extends(MyTextValidator, _super);
        MyTextValidator.prototype.getType = function () { return "mytextvalidator"; };
        MyTextValidator.prototype.validate = function (value, name) {
            if(value.indexOf("dxSurvey") <= 0) {
                //report an error
                return new ValidatorResult(null, new dxSurvey.CustomError("You text should contains 'dxSurvey' word."));
            }
            //return ValidatorResult object if you want to correct the entered value
            // return new ValidatorResult(youCorrectedValue);
            //return nothing if there is no any error.
            return null;
        };
        return MyTextValidator;
    })(SurveyValidator);
    dxSurvey.MyTextValidator = MyTextValidator;
    //add into dxSurvey Json metaData
    dxSurvey.JsonObject.metaData.addClass("mytextvalidator", [], function () { return new MyTextValidator(); }, "surveyvalidator");
});
{% endcapture %}

{% capture survey_setup %}
var survey = new dxSurvey.Survey({
        questions: [
                { type: "comment",  name: "memo", isRequired: true,
                title: "Type here 'dxSurvey' to pass the valication ",
                validators: [{type: "mytextvalidator"}]}
            ]});
{% endcapture %}

{% include live-example-code.html %}
---
layout: example
title: Create custom validator
---
{% capture survey_code %}
var MyTextValidator = (function (_super) {
    __extends(MyTextValidator, _super);
    function MyTextValidator() {
        _super.call(this);
    }
    MyTextValidator.prototype.getType = function () { return "mytextvalidator"; };
    MyTextValidator.prototype.validate = function (value, name) {
        if(value.indexOf("dxSurvey") <= 0) {
            //report an error
            return new dxSurvey.ValidatorResult(null, new dxSurvey.CustomError(this.getErrorText(name)));
        }
        //return dxSurvey.ValidatorResult object if you want to correct the entered value
        // return new dxSurvey.ValidatorResult(youCorrectedValue);
        //return nothing if there is no any error.
        return null;
    };
    //the default error text. It shows if user do not set the 'text' property
    MyTextValidator.prototype.getDefaultErrorText = function(name) {
        return "You text should contains 'dxSurvey' word.";
    }
    return MyTextValidator;
})(dxSurvey.SurveyValidator);
dxSurvey.MyTextValidator = MyTextValidator;
//add into dxSurvey Json metaData
dxSurvey.JsonObject.metaData.addClass("mytextvalidator", [], function () { return new MyTextValidator(); }, "surveyvalidator");
{% endcapture %}

{% capture survey_setup %}
var survey = new dxSurvey.Survey({
        questions: [
                { type: "comment",  name: "memo", isRequired: true,
                title: "Type here 'dxSurvey' to pass the validation ",
                validators: [{type: "mytext"}]}
            ]});
{% endcapture %}

{% include live-example-code.html %}
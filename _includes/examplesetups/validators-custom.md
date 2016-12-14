{% if page.usereact %}
{% capture survey_code %}

var MyTextValidator = (function (_super) {
    Survey.__extends(MyTextValidator, _super);
    function MyTextValidator() {
        _super.call(this);
    }
    MyTextValidator.prototype.getType = function () { return "mytextvalidator"; };
    MyTextValidator.prototype.validate = function (value, name) {
        if(value.indexOf("survey") < 0) {
            //report an error
            return new Survey.ValidatorResult(null, new Survey.CustomError(this.getErrorText(name)));
        }
        //return Survey.ValidatorResult object if you want to correct the entered value
        // return new Survey.ValidatorResult(youCorrectedValue);
        //return nothing if there is no any error.
        return null;
    };
    //the default error text. It shows if user do not set the 'text' property
    MyTextValidator.prototype.getDefaultErrorText = function(name) {
        return "You text should contains 'survey' word.";
    }
    return MyTextValidator;
})(Survey.SurveyValidator);
Survey.MyTextValidator = MyTextValidator;
//add into survey Json metaData
Survey.JsonObject.metaData.addClass("mytextvalidator", [], function () { return new MyTextValidator(); }, "surveyvalidator");
{% endcapture %}

{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel({
        questions: [
                { type: "comment",  name: "memo", isRequired: true,
                title: "Type here 'survey' to pass the validation ",
                validators: [{type: "mytext"}]}
            ]});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));            
{% endcapture %}

{% include live-example-code.html %}
{% elsif page.useknockout%}
{% capture survey_code %}
var MyTextValidator = (function (_super) {
    Survey.__extends(MyTextValidator, _super);
    function MyTextValidator() {
        _super.call(this);
    }
    MyTextValidator.prototype.getType = function () { return "mytextvalidator"; };
    MyTextValidator.prototype.validate = function (value, name) {
        if(value.indexOf("survey") < 0) {
            //report an error
            return new Survey.ValidatorResult(null, new Survey.CustomError(this.getErrorText(name)));
        }
        //return Survey.ValidatorResult object if you want to correct the entered value
        // return new Survey.ValidatorResult(youCorrectedValue);
        //return nothing if there is no any error.
        return null;
    };
    //the default error text. It shows if user do not set the 'text' property
    MyTextValidator.prototype.getDefaultErrorText = function(name) {
        return "You text should contains 'survey' word.";
    }
    return MyTextValidator;
})(Survey.SurveyValidator);
Survey.MyTextValidator = MyTextValidator;
//add into survey Json metaData
Survey.JsonObject.metaData.addClass("mytextvalidator", [], function () { return new MyTextValidator(); }, "surveyvalidator");
{% endcapture %}

{% capture survey_setup %}
var survey = new Survey.Survey({
        questions: [
                { type: "comment",  name: "memo", isRequired: true,
                title: "Type here 'survey' to pass the validation ",
                validators: [{type: "mytext"}]}
            ]});
{% endcapture %}

{% include live-example-code.html %}
{% elsif page.useangular%}
{% elsif page.usejquery%}
{% endif %}
---
layout: example
usereact: true
title: Use your custom react components to render checkbox and radiogroup questions. Use bootstrap buttons group.
---
{% capture survey_setup %}
var MyReactSurveyQuestionradiogroup = (function (_super) {
    __extends(MyReactSurveyQuestionradiogroup, _super);
    function MyReactSurveyQuestionradiogroup(props) {
        _super.call(this, props);
    }
    MyReactSurveyQuestionradiogroup.prototype.render = function () {
        if (!this.question)
            return null;
        return (React.createElement("div", {className: "btn-group", ref: "toggleInput"}, this.getItems()));
    };
    MyReactSurveyQuestionradiogroup.prototype.componentDidMount = function() {
        this.refs.toggleInput.setAttribute('data-toggle', 'buttons');
    };    
    MyReactSurveyQuestionradiogroup.prototype.renderRadio = function (key, item, isChecked, divStyle, otherItem) {
        var className = "btn btn-default";
        if(isChecked) className += " active";
        return (React.createElement("label", {key: key, style: divStyle, className: className}, 
            React.createElement("input", {type: "radio", checked: isChecked, value: item.value, onChange: this.handleOnChange}), 
            React.createElement("span", {style: this.textStyle}, item.text), 
            otherItem));
    };
    return MyReactSurveyQuestionradiogroup;
}(ReactSurveyQuestionradiogroup));

var ReactSurveyQuestioncheckboxItem = (function (_super) {
    __extends(ReactSurveyQuestioncheckboxItem, _super);
    function ReactSurveyQuestioncheckboxItem(props) {
        _super.call(this, props);
    }
    ReactSurveyQuestioncheckboxItem.prototype.renderCheckbox = function (isChecked, divStyle, otherItem) {
        var className = "btn btn-default";
        if(isChecked) className += " active";
        return (React.createElement("label", {className: className, style: divStyle}, 
            React.createElement("input", {type: "checkbox", checked: isChecked, onChange: this.handleOnChange}), 
            React.createElement("span", {style: this.textStyle}, this.item.text), 
            otherItem));
    };
    return ReactSurveyQuestioncheckboxItem;
}(ReactSurveyQuestioncheckboxItemBase));


var MyReactSurveyQuestioncheckbox = (function (_super) {
    __extends(MyReactSurveyQuestioncheckbox, _super);
    function MyReactSurveyQuestioncheckbox(props) {
        _super.call(this, props);
    }
    MyReactSurveyQuestioncheckbox.prototype.render = function () {
        if (!this.question)
            return null;
        return (React.createElement("div", {className: "btn-group", ref: "toggleInput"}, this.getItems()));
    };
    MyReactSurveyQuestioncheckbox.prototype.componentDidMount = function() {
        this.refs.toggleInput.setAttribute('data-toggle', 'buttons');
    };    
    MyReactSurveyQuestioncheckbox.prototype.renderItem = function (key, item) {
        return React.createElement(ReactSurveyQuestioncheckboxItem, {key: key, question: this.question, item: item});
    };
    return MyReactSurveyQuestioncheckbox;
}(ReactSurveyQuestioncheckbox));

var MyReactSurvey = (function (_super) {
    __extends(MyReactSurvey, _super);
    function MyReactSurvey(props) {
        _super.call(this, props);
    }
    ReactSurveyBase.prototype.createQuestionElement = function (question) {
        if(question.getType() == "radiogroup") {
            return React.createElement(MyReactSurveyQuestionradiogroup, { question: question });
        }
        if(question.getType() == "checkbox") {
            return React.createElement(MyReactSurveyQuestioncheckbox, { question: question });
        }
        var className = "ReactSurveyQuestion" + question.getType();
        return React.createElement(window[className], { question: question });
    };
    return MyReactSurvey;
}(ReactSurvey));

var survey = new ReactSurveyModel({% include surveys/survey-about.json %});
ReactDOM.render(<MyReactSurvey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

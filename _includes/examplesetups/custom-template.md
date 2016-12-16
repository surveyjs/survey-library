{% if page.usereact %}
{% capture survey_setup %}

class MySurveyQuestionRadiogroup extends Survey.SurveyQuestionRadiogroup {
    render() {
        if (!this.question)
            return null;
        return React.createElement("form", {className: "btn-group", ref: "toggleInput"}, this.getItems());
    };
    componentDidMount() {
        this.refs.toggleInput.setAttribute('data-toggle', 'buttons');
    };    
    renderRadio(key, item, isChecked, divStyle, otherItem) {
        var className = "btn btn-default";
        if(isChecked) className += " active";
        return (React.createElement("label", {key: key, style: divStyle, className: className}, 
            React.createElement("input", {type: "radio", checked: isChecked, value: item.value, onChange: this.handleOnChange}), 
            React.createElement("span", {}, item.text), 
            otherItem));
    };
}

class MySurveyQuestionCheckboxItem extends Survey.SurveyQuestionCheckboxItem {
    renderCheckbox(isChecked, divStyle, otherItem) {
        var className = "btn btn-default";
        if(isChecked) className += " active";
        return (React.createElement("label", {className: className, style: divStyle}, 
            React.createElement("input", {type: "checkbox", checked: isChecked, onChange: this.handleOnChange}), 
            React.createElement("span", {}, this.item.text), 
            otherItem));
    };
}

class MySurveyQuestionCheckbox extends Survey.SurveyQuestionCheckbox {
    render() {
        if (!this.question)
            return null;
        return React.createElement("div", {className: "btn-group", ref: "toggleInput"}, this.getItems());
    }
    componentDidMount() {
        this.refs.toggleInput.setAttribute('data-toggle', 'buttons');
    };    
    renderItem(key, item) {
        return React.createElement(MySurveyQuestionCheckboxItem, {key: key, question: this.question, item: item, css: this.css, rootCss: this.rootCss });
    };
} 
 
Survey.ReactQuestionFactory.Instance.registerQuestion("checkbox", (props) => {
    return React.createElement(MySurveyQuestionCheckbox, props);
});

Survey.ReactQuestionFactory.Instance.registerQuestion("radiogroup", (props) => {
    return React.createElement(MySurveyQuestionRadiogroup, props);
});

var survey = new Survey.ReactSurveyModel({% include surveys/survey-about.json %});
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));
{% endcapture %}

{% include live-example-code.html %}

{% elsif page.useknockout%}
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/survey-about.json %});

new Survey.SurveyTemplateText().replaceText('{% include templates/question-radiogroup.html %}', "question", "radiogroup");
new Survey.SurveyTemplateText().replaceText('{% include templates/question-checkbox.html %}', "question", "checkbox");

{% endcapture %}

{% include live-example-code.html %}

{% elsif page.useangular%}
<h1>This feature is not supported yet<h1>
{% elsif page.usejquery%}
<h1>This feature is not supported yet<h1>
{% endif %}